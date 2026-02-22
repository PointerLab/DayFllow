from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from .serializers import UserRegistrationSerializer, EmployeeListSerializer
from .models import CustomUser
import traceback

class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = (AllowAny,)

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.save()

            # Default signup user to HR; admin must approve before login.
            user.role = "HR"
            user.is_staff = True
            user.is_approved = False
            user.save()
        except Exception as e:
            # In development return the exception message and traceback to help debugging
            tb = traceback.format_exc()
            return Response({
                "detail": str(e),
                "traceback": tb,
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(
            {
                "user": UserRegistrationSerializer(
                    user, context=self.get_serializer_context()
                ).data,
                "message": "User created successfully.",
            },
            status=status.HTTP_201_CREATED,
        )


class EmployeeListAPIView(generics.ListAPIView):
    serializer_class = EmployeeListSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        if user.role not in ["ADMIN", "HR"]:
            raise PermissionDenied("Permission denied")
        return CustomUser.objects.all().order_by("date_of_joining", "id")


class PendingHrListAPIView(generics.ListAPIView):
    serializer_class = EmployeeListSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        if user.role != "ADMIN":
            raise PermissionDenied("Permission denied")
        return CustomUser.objects.filter(role="HR", is_approved=False).order_by("date_of_joining", "id")


class ApproveHrAPIView(generics.UpdateAPIView):
    serializer_class = EmployeeListSerializer
    permission_classes = (IsAuthenticated,)
    queryset = CustomUser.objects.all()

    def post(self, request, *args, **kwargs):
        # Frontend triggers this approval action with POST.
        return self.update(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        if request.user.role != "ADMIN":
            raise PermissionDenied("Permission denied")
        user = self.get_object()
        if user.role != "HR":
            raise PermissionDenied("Only HR users can be approved")
        user.is_approved = True
        user.is_active = True
        user.save()
        serializer = self.get_serializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
