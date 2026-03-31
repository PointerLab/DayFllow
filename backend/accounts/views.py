from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework.views import APIView
from django.conf import settings
from django.db import transaction
from django.http import HttpResponse
from openpyxl import Workbook
from datetime import datetime
import base64
import hashlib
import hmac
import json
from urllib import error, request as urllib_request
from .serializers import (
    UserRegistrationSerializer,
    EmployeeListSerializer,
    CompanyConfigSerializer,
)
from .models import CustomUser, CompanyConfig
from .company_table_service import ensure_company_table, insert_company_user_row
import traceback


def get_employee_queryset_for_request(request):
    user = request.user
    if user.role not in ["ADMIN", "HR"]:
        raise PermissionDenied("Permission denied")

    queryset = CustomUser.objects.filter(company_name=user.company_name)
    scope = request.query_params.get("scope")

    if scope == "non_admin":
        if user.role != "ADMIN":
            raise PermissionDenied("Permission denied")
        queryset = queryset.exclude(role="ADMIN")
    elif scope == "employees_only":
        queryset = queryset.filter(role="EMP")

    role = request.query_params.get("role")
    if role:
        queryset = queryset.filter(role=role)

    return queryset.order_by("date_of_joining", "id")

class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = (AllowAny,)

    def create(self, request, *args, **kwargs):
        try:
            with transaction.atomic():
                serializer = self.get_serializer(data=request.data)
                serializer.is_valid(raise_exception=True)
                user = serializer.save()

                # Company signup account is the company admin.
                user.role = "ADMIN"
                user.is_staff = True
                user.is_approved = True
                user.save()

                company_table_name = ensure_company_table(user.company_name)
                insert_company_user_row(
                    company_name=user.company_name,
                    user=user,
                    created_by_user_id=None,
                )
        except Exception as e:
            # In development return the exception message and traceback to help debugging
            tb = traceback.format_exc()
            return Response({
                "detail": str(e),
                "traceback": tb,
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(
            {
                "user": UserRegistrationSerializer(
                    user, context=self.get_serializer_context()
                ).data,
                "company_table": company_table_name,
                "message": "Company admin account created successfully.",
            },
            status=status.HTTP_201_CREATED,
        )


class EmployeeListAPIView(generics.ListAPIView):
    serializer_class = EmployeeListSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return get_employee_queryset_for_request(self.request)


class EmployeeExportAPIView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        queryset = get_employee_queryset_for_request(request)

        workbook = Workbook()
        worksheet = workbook.active
        worksheet.title = "Employees"

        headers = [
            "Employee ID",
            "First Name",
            "Last Name",
            "Email",
            "Role",
            "Department",
            "Employment Type",
            "Salary",
            "Status",
            "Date Of Joining",
        ]
        worksheet.append(headers)

        for user in queryset:
            worksheet.append(
                [
                    user.login_id or "",
                    user.first_name or "",
                    user.last_name or "",
                    user.email or "",
                    user.role or "",
                    user.department or "",
                    user.employment_type or "",
                    float(user.salary) if user.salary is not None else "",
                    "Active" if user.is_active else "Inactive",
                    user.date_of_joining.isoformat() if user.date_of_joining else "",
                ]
            )

        response = HttpResponse(
            content_type=(
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            )
        )
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        response["Content-Disposition"] = (
            f'attachment; filename="employees_{timestamp}.xlsx"'
        )
        workbook.save(response)
        return response


class CompanyConfigAPIView(generics.GenericAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = CompanyConfigSerializer

    def get_object(self):
        company_name = getattr(self.request.user, "company_name", "")
        if not company_name:
            raise PermissionDenied("Company is not set for this user.")

        return CompanyConfig.objects.filter(company_name=company_name).first()

    def get(self, request):
        if request.user.role not in ["ADMIN", "HR"]:
            raise PermissionDenied("Permission denied")

        instance = self.get_object()
        if not instance:
            return Response(
                {
                    "company_name": request.user.company_name,
                    "departments": [],
                    "roles": [],
                    "employment_types": [],
                    "updated_at": None,
                },
                status=status.HTTP_200_OK,
            )

        serializer = self.get_serializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        if request.user.role != "ADMIN":
            raise PermissionDenied("Only admin can update company configuration.")

        instance = self.get_object()
        if instance:
            serializer = self.get_serializer(instance, data=request.data, partial=True)
        else:
            serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if instance:
            config = serializer.save(updated_by=request.user)
        else:
            config = serializer.save(
                company_name=request.user.company_name,
                created_by=request.user,
                updated_by=request.user,
            )

        return Response(self.get_serializer(config).data, status=status.HTTP_200_OK)


PLAN_PRICING = {
    "starter": 49900,  # paise
    "enterprise": 149900,  # paise
}


class RazorpayCreateOrderAPIView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        plan = str(request.data.get("plan", "")).strip().lower()
        amount = PLAN_PRICING.get(plan)
        if not amount:
            return Response(
                {"detail": "Invalid plan selected for payment."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        key_id = getattr(settings, "RAZORPAY_KEY_ID", "")
        key_secret = getattr(settings, "RAZORPAY_KEY_SECRET", "")
        if not key_id or not key_secret:
            return Response(
                {"detail": "Razorpay keys are not configured."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        payload = json.dumps(
            {
                "amount": amount,
                "currency": "INR",
                "receipt": f"{plan}-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}",
                "notes": {"plan": plan},
            }
        ).encode("utf-8")
        auth = base64.b64encode(f"{key_id}:{key_secret}".encode("utf-8")).decode("utf-8")
        req = urllib_request.Request(
            "https://api.razorpay.com/v1/orders",
            data=payload,
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Basic {auth}",
            },
            method="POST",
        )

        try:
            with urllib_request.urlopen(req, timeout=15) as response:
                data = json.loads(response.read().decode("utf-8"))
        except error.HTTPError as exc:
            body = exc.read().decode("utf-8", errors="ignore")
            return Response(
                {"detail": "Failed to create Razorpay order.", "error": body or str(exc)},
                status=status.HTTP_502_BAD_GATEWAY,
            )
        except Exception as exc:
            return Response(
                {"detail": f"Unable to create Razorpay order: {exc}"},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        return Response(
            {
                "key_id": key_id,
                "plan": plan,
                "amount": amount,
                "currency": "INR",
                "order_id": data.get("id"),
            },
            status=status.HTTP_200_OK,
        )


class RazorpayVerifyPaymentAPIView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        order_id = str(request.data.get("razorpay_order_id", "")).strip()
        payment_id = str(request.data.get("razorpay_payment_id", "")).strip()
        signature = str(request.data.get("razorpay_signature", "")).strip()

        if not order_id or not payment_id or not signature:
            return Response(
                {"detail": "Missing payment verification fields."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        key_secret = getattr(settings, "RAZORPAY_KEY_SECRET", "")
        if not key_secret:
            return Response(
                {"detail": "Razorpay key secret is not configured."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        expected_signature = hmac.new(
            key_secret.encode("utf-8"),
            f"{order_id}|{payment_id}".encode("utf-8"),
            hashlib.sha256,
        ).hexdigest()

        if not hmac.compare_digest(expected_signature, signature):
            return Response(
                {"detail": "Payment signature verification failed."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response({"verified": True}, status=status.HTTP_200_OK)
