from django.urls import path
from .views import (
    CheckInAPIView,
    CheckOutAPIView,
    MyAttendanceAPIView,
    AllAttendanceAPIView,
)

urlpatterns = [
    path("check-in/", CheckInAPIView.as_view()),
    path("check-out/", CheckOutAPIView.as_view()),
    path("my/", MyAttendanceAPIView.as_view()),
    path("all/", AllAttendanceAPIView.as_view()),
]
