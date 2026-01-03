from django.urls import path
from .views import LoginAPIView, ChangePasswordAPIView
from .views import CreateEmployeeAPIView

urlpatterns = [
    path("login/", LoginAPIView.as_view(), name="login"),
    path("change-password/", ChangePasswordAPIView.as_view(), name="change_password"),
    path("create-employee/", CreateEmployeeAPIView.as_view(), name="create-employee"),
]
