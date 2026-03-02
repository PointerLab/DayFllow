from django.urls import path
from .views import (
    UserRegistrationView,
    EmployeeListAPIView,
    EmployeeExportAPIView,
    CompanyConfigAPIView,
)

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='user-registration'),
    path('employees/', EmployeeListAPIView.as_view(), name='employee-list'),
    path('employees/export/', EmployeeExportAPIView.as_view(), name='employee-export'),
    path('company-config/', CompanyConfigAPIView.as_view(), name='company-config'),
]
