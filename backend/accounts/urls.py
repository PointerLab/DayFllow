from django.urls import path
from .views import UserRegistrationView, EmployeeListAPIView, CompanyConfigAPIView

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='user-registration'),
    path('employees/', EmployeeListAPIView.as_view(), name='employee-list'),
    path('company-config/', CompanyConfigAPIView.as_view(), name='company-config'),
]
