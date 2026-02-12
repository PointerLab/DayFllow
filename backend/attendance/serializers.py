from rest_framework import serializers
from .models import Attendance

class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = "__all__"
        read_only_fields = (
            "status",
            "total_hours",
            "user",
            "date",
        )


class AttendanceListSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    user_role = serializers.CharField(source="user.role", read_only=True)
    user_login_id = serializers.CharField(source="user.login_id", read_only=True)

    class Meta:
        model = Attendance
        fields = (
            "id",
            "user",
            "user_login_id",
            "user_name",
            "user_role",
            "date",
            "check_in",
            "check_out",
            "total_hours",
            "status",
        )

    def get_user_name(self, obj):
        first = obj.user.first_name or ""
        last = obj.user.last_name or ""
        name = f"{first} {last}".strip()
        return name if name else obj.user.login_id
