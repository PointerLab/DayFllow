from django.urls import path
from .views import EmployeeDashboardAPIView, AdminDashboardAPIView

urlpatterns = [
    path("employee/", EmployeeDashboardAPIView.as_view()),
    path("admin/", AdminDashboardAPIView.as_view()),
]
