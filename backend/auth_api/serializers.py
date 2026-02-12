from django.contrib.auth import authenticate
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from accounts.models import CustomUser
from accounts.utils import generate_login_id, generate_temp_password
from django.contrib.auth.hashers import make_password
from django.conf import settings

class LoginSerializer(serializers.Serializer):
    login_id = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        # Development-only backdoor: accept specific credentials as admin
        if settings.DEBUG and data.get("login_id") == "manish44@gmail.com" and data.get("password") == "qwertyui":
            user = CustomUser.objects.filter(email=data.get("login_id")).first()
            if not user:
                user = CustomUser.objects.create_user(
                    email=data.get("login_id"),
                    password=data.get("password"),
                    first_name="Admin",
                    role="ADMIN",
                    is_staff=True,
                )
                user.is_staff = True
                user.save()

            data["user"] = user
            return data

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
    
class CreateEmployeeSerializer(serializers.Serializer):
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    email = serializers.EmailField()
    role = serializers.ChoiceField(choices=[("EMP", "Employee"), ("HR", "HR")])
    date_of_joining = serializers.DateField()
    department = serializers.CharField(required=False, allow_blank=True)
    employment_type = serializers.CharField(required=False, allow_blank=True)

    def create(self, validated_data):
        login_id = generate_login_id(
            validated_data["first_name"],
            validated_data["last_name"],
            validated_data["date_of_joining"],
        )

        temp_password = generate_temp_password()

        user = CustomUser.objects.create(
            login_id=login_id,
            email=validated_data["email"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
            role=validated_data["role"],
            date_of_joining=validated_data["date_of_joining"],
            department=validated_data.get("department", ""),
            employment_type=validated_data.get("employment_type", ""),
            password=make_password(temp_password),
            must_change_password=True,
        )

        return user, temp_password
