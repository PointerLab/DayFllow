from django.urls import path
from .views import LoginAPIView, ChangePasswordAPIView

urlpatterns = [
    path("login/", LoginAPIView.as_view(), name="login"),
    path("change-password/", ChangePasswordAPIView.as_view(), name="change_password"),
]
