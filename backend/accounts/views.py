from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from django.db import transaction
from .serializers import UserRegistrationSerializer, EmployeeListSerializer
from .models import CustomUser
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
        return CustomUser.objects.filter(company_name=user.company_name).order_by("date_of_joining", "id")


class PendingHrListAPIView(generics.ListAPIView):
    serializer_class = EmployeeListSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        if user.role != "ADMIN":
            raise PermissionDenied("Permission denied")
        return CustomUser.objects.filter(
            role="HR",
            is_approved=False,
            company_name=user.company_name,
        ).order_by("date_of_joining", "id")


class ApproveHrAPIView(generics.UpdateAPIView):
    serializer_class = EmployeeListSerializer
    permission_classes = (IsAuthenticated,)
    queryset = CustomUser.objects.all()

    def post(self, request, *args, **kwargs):
        # Frontend triggers this approval action with POST.
        return self.update(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        if request.user.role != "ADMIN":
            raise PermissionDenied("Permission denied")
        user = self.get_object()
        if user.company_name != request.user.company_name:
            raise PermissionDenied("Permission denied")
        if user.role != "HR":
            raise PermissionDenied("Only HR users can be approved")
        user.is_approved = True
        user.is_active = True
        user.save()
        serializer = self.get_serializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
