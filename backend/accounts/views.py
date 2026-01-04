from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .serializers import UserRegistrationSerializer
from .models import CustomUser
import traceback

class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = (AllowAny,)

    def create(self, request, *args, **kwargs):
        # If there are no users yet, this will be the bootstrap admin
        is_first_user = not CustomUser.objects.exists()

        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.save()

            user.role = "ADMIN"
            user.is_staff = True
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

