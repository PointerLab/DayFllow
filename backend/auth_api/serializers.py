from django.contrib.auth import authenticate
from rest_framework import serializers
from accounts.models import User
from django.contrib.auth.password_validation import validate_password

class LoginSerializer(serializers.Serializer):
    login_id = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(
            login_id=data["login_id"],
            password=data["password"]
        )

        if not user:
            raise serializers.ValidationError("Invalid login credentials")

        if not user.is_active:
            raise serializers.ValidationError("Account is inactive")

        data["user"] = user
        return data

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)

    def validate_new_password(self, value):
        validate_password(value)
        return value