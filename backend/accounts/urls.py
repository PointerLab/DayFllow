from django.urls import path
from .views import (
    UserRegistrationView,
    EmployeeListAPIView,
    EmployeeDetailAPIView,
    EmployeeExportAPIView,
    CompanyConfigAPIView,
    RazorpayCreateOrderAPIView,
    RazorpayVerifyPaymentAPIView,
)

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='user-registration'),
    path('employees/', EmployeeListAPIView.as_view(), name='employee-list'),
    path('employees/<int:pk>/', EmployeeDetailAPIView.as_view(), name='employee-detail'),
    path('employees/export/', EmployeeExportAPIView.as_view(), name='employee-export'),
    path('company-config/', CompanyConfigAPIView.as_view(), name='company-config'),
    path('payments/razorpay/create-order/', RazorpayCreateOrderAPIView.as_view(), name='razorpay-create-order'),
    path('payments/razorpay/verify/', RazorpayVerifyPaymentAPIView.as_view(), name='razorpay-verify-payment'),
]
