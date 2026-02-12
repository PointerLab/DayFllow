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
        login_input = data.get("login_id")
        if login_input and "@" in login_input:
            user_by_email = CustomUser.objects.filter(email=login_input).first()
            if user_by_email:
                data["login_id"] = user_by_email.login_id

        # Development-only backdoor: accept specific credentials as admin
        if (
            settings.DEBUG
            and data.get("login_id") == "admin1@gmail.com"
            and data.get("password") == "adminisadmin"
        ):
            user = CustomUser.objects.filter(email=data.get("login_id")).first()
            if not user:
                user = CustomUser.objects.create_superuser(
                    email=data.get("login_id"),
                    password=data.get("password"),
                )

            data["user"] = user
            return data

        user = authenticate(
            username=data["login_id"],
            password=data["password"]
        )

        if not user:
            raise serializers.ValidationError("Invalid login credentials")

        if not user.is_active:
            raise serializers.ValidationError("Account is inactive")

        if user.role == "HR" and not user.is_approved:
            raise serializers.ValidationError("HR account pending admin approval")

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
    role = serializers.ChoiceField(choices=[("EMP", "Employee"), ("INT", "Intern"), ("HR", "HR")])
    date_of_joining = serializers.DateField()
    department = serializers.CharField(required=False, allow_blank=True)
    employment_type = serializers.CharField(required=False, allow_blank=True)

    def validate_email(self, value):
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

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
