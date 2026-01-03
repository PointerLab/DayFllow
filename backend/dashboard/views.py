from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from datetime import date
from django.db.models import Count

from attendance.models import Attendance
from leave.models import LeaveRequest

class EmployeeDashboardAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = date.today()

        today_attendance = Attendance.objects.filter(
            user=request.user,
            date=today
        ).first()

        month_attendance = Attendance.objects.filter(
            user=request.user,
            date__month=today.month,
            date__year=today.year
        )

        data = {
            "today_status": today_attendance.status if today_attendance else "ABSENT",
            "present_days": month_attendance.filter(status="PRESENT").count(),
            "leave_days": month_attendance.filter(status="LEAVE").count(),
            "pending_leaves": LeaveRequest.objects.filter(
                user=request.user,
                status="PENDING"
            ).count()
        }

        return Response(data)

from accounts.models import User

class AdminDashboardAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role not in ["ADMIN", "HR"]:
            return Response(
                {"detail": "Permission denied"},
                status=403
            )

        today = date.today()

        data = {
            "total_employees": User.objects.filter(role="EMP").count(),
            "present_today": Attendance.objects.filter(
                date=today, status="PRESENT"
            ).count(),
            "absent_today": Attendance.objects.filter(
                date=today, status="ABSENT"
            ).count(),
            "on_leave_today": Attendance.objects.filter(
                date=today, status="LEAVE"
            ).count(),
            "pending_leaves": LeaveRequest.objects.filter(
                status="PENDING"
            ).count(),
        }

        return Response(data)
