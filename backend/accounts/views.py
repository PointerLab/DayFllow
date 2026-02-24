from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from django.db import transaction
from .serializers import (
    UserRegistrationSerializer,
    EmployeeListSerializer,
    CompanyConfigSerializer,
)
from .models import CustomUser, CompanyConfig
from .company_table_service import ensure_company_table, insert_company_user_row
import traceback

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
        user = self.request.user
        if user.role not in ["ADMIN", "HR"]:
            raise PermissionDenied("Permission denied")
        queryset = CustomUser.objects.filter(company_name=user.company_name)
        scope = self.request.query_params.get("scope")

        if scope == "non_admin":
            if user.role != "ADMIN":
                raise PermissionDenied("Permission denied")
            queryset = queryset.exclude(role="ADMIN")
        elif scope == "employees_only":
            queryset = queryset.filter(role="EMP")

        return queryset.order_by("date_of_joining", "id")


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
