from django.contrib.auth import authenticate
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from accounts.models import CustomUser
from accounts.utils import generate_login_id, generate_temp_password
from django.contrib.auth.hashers import make_password

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
    
class CreateEmployeeSerializer(serializers.Serializer):
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    email = serializers.EmailField()
    role = serializers.ChoiceField(choices=[("EMP", "Employee"), ("HR", "HR")])
    date_of_joining = serializers.DateField()

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
            password=make_password(temp_password),
            must_change_password=True,
        )

        return user, temp_password