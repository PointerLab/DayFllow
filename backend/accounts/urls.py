from django.urls import path
from .views import UserRegistrationView, EmployeeListAPIView

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='user-registration'),
    path('employees/', EmployeeListAPIView.as_view(), name='employee-list'),
]
