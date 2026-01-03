from django.urls import path
from .views import (
    ApplyLeaveAPIView,
    MyLeavesAPIView,
    AllLeavesAPIView,
    ApproveRejectLeaveAPIView,
)

urlpatterns = [
    path("apply/", ApplyLeaveAPIView.as_view()),
    path("my/", MyLeavesAPIView.as_view()),
    path("all/", AllLeavesAPIView.as_view()),
    path("action/<int:leave_id>/", ApproveRejectLeaveAPIView.as_view()),
]
