from rest_framework import serializers
from .models import CustomUser, CompanyConfig


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    role = serializers.CharField(required=False)

    class Meta:
        model = CustomUser
        fields = (
            'email',
            'password',
            'first_name',
            'last_name',
            'company_name',
            'role',
            'department',
            'employment_type',
        )
        extra_kwargs = {
            'company_name': {'required': True, 'allow_blank': False},
        }

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
            company_name=validated_data.get('company_name', ''),
            role=role if role else 'EMP',
            department=validated_data.get('department', ''),
            employment_type=validated_data.get('employment_type', ''),
        )
        return user


class EmployeeListSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = (
            "id",
            "login_id",
            "email",
            "first_name",
            "last_name",
            "company_name",
            "role",
            "date_of_joining",
            "department",
            "employment_type",
            "salary",
            "is_active",
            "is_approved",
        )


class CompanyConfigSerializer(serializers.ModelSerializer):
    departments = serializers.ListField(
        child=serializers.CharField(),
        required=False,
    )
    roles = serializers.ListField(
        child=serializers.CharField(),
        required=False,
    )
    employment_types = serializers.ListField(
        child=serializers.CharField(),
        required=False,
    )

    class Meta:
        model = CompanyConfig
        fields = (
            "company_name",
            "departments",
            "roles",
            "employment_types",
            "updated_at",
        )
        read_only_fields = ("company_name", "updated_at")

    def _normalize_list(self, values):
        cleaned = []
        seen = set()
        for item in values or []:
            value = (item or "").strip()
            if not value:
                continue
            key = value.lower()
            if key in seen:
                continue
            seen.add(key)
            cleaned.append(value)
        return cleaned

    def validate_departments(self, value):
        return self._normalize_list(value)

    def validate_roles(self, value):
        normalized = self._normalize_list(value)
        allowed = {
            "EMP": "EMP",
            "EMPLOYEE": "EMP",
            "INT": "INT",
            "INTERN": "INT",
            "HR": "HR",
        }
        role_codes = []
        for role in normalized:
            mapped = allowed.get(role.upper())
            if not mapped:
                raise serializers.ValidationError(
                    "Roles can only include EMP/Employee, INT/Intern, or HR."
                )
            if mapped not in role_codes:
                role_codes.append(mapped)
        return role_codes

    def validate_employment_types(self, value):
        return self._normalize_list(value)
