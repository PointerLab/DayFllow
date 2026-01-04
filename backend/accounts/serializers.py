from rest_framework import serializers
from .models import CustomUser


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    role = serializers.CharField(required=False)

    class Meta:
        model = CustomUser
        fields = ('email', 'password', 'first_name', 'last_name', 'role')

    def create(self, validated_data):
        role = validated_data.pop('role', None)
        request = self.context.get('request')

        # Only allow assigning a role when creating a user if:
        # - the request user is a superuser, or
        # - there are no users yet (bootstrap scenario)
        if role:
            if not (
                request
                and getattr(request.user, 'is_superuser', False)
            ) and CustomUser.objects.exists():
                raise serializers.ValidationError({'role': 'Not allowed to assign role.'})

        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            role=role if role else 'EMP',
        )
        return user
