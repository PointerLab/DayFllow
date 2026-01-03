from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from datetime import timedelta, date

from .models import LeaveRequest
from .serializers import LeaveRequestSerializer

#Employee applies for leave
class ApplyLeaveAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = LeaveRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        leave = serializer.save(user=request.user)
        return Response(
            {"message": "Leave applied successfully"},
            status=status.HTTP_201_CREATED
        )
    
#View My Leave Requests
class MyLeavesAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        leaves = LeaveRequest.objects.filter(user=request.user)
        serializer = LeaveRequestSerializer(leaves, many=True)
        return Response(serializer.data)

#View all Leaves - Admin Only
class AllLeavesAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role not in ["ADMIN", "HR"]:
            return Response(
                {"detail": "Permission denied"},
                status=status.HTTP_403_FORBIDDEN
            )

        leaves = LeaveRequest.objects.all()
        serializer = LeaveRequestSerializer(leaves, many=True)
        return Response(serializer.data)

#Approve or Reject Leave - Admin Only
from attendance.models import Attendance

class ApproveRejectLeaveAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, leave_id):
        if request.user.role not in ["ADMIN", "HR"]:
            return Response(
                {"detail": "Permission denied"},
                status=status.HTTP_403_FORBIDDEN
            )

        action = request.data.get("action")

        if action not in ["APPROVE", "REJECT"]:
            return Response(
                {"detail": "Invalid action"},
                status=status.HTTP_400_BAD_REQUEST
            )

        leave = LeaveRequest.objects.get(id=leave_id)

        leave.status = "APPROVED" if action == "APPROVE" else "REJECTED"
        leave.save()

        # If approved → mark attendance as LEAVE
        if leave.status == "APPROVED":
            current = leave.start_date
            while current <= leave.end_date:
                Attendance.objects.update_or_create(
                    user=leave.user,
                    date=current,
                    defaults={"status": "LEAVE"}
                )
                current += timedelta(days=1)

        return Response({"message": f"Leave {leave.status.lower()} successfully"})


