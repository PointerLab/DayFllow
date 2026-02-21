from django.urls import path
from .views import (
    EmployeeDashboardAPIView,
    AdminDashboardAPIView,
    DashboardNotificationsAPIView,
)

urlpatterns = [
    path("employee/", EmployeeDashboardAPIView.as_view()),
    path("admin/", AdminDashboardAPIView.as_view()),
    path("notifications/", DashboardNotificationsAPIView.as_view()),
]
