from django.urls import path
from .views import UserRegistrationView, EmployeeListAPIView, PendingHrListAPIView, ApproveHrAPIView

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='user-registration'),
    path('employees/', EmployeeListAPIView.as_view(), name='employee-list'),
    path('hr-requests/', PendingHrListAPIView.as_view(), name='pending-hr-list'),
    path('hr-requests/<int:pk>/approve/', ApproveHrAPIView.as_view(), name='approve-hr'),
]
