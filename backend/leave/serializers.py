from rest_framework import serializers
from .models import LeaveRequest

class LeaveRequestSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField(read_only=True)
    user_role = serializers.SerializerMethodField(read_only=True)

    def get_user_name(self, obj):
        if not obj.user:
            return ""
        full_name = f"{obj.user.first_name} {obj.user.last_name}".strip()
        return full_name or obj.user.login_id

    def get_user_role(self, obj):
        return obj.user.role if obj.user else None

    class Meta:
        model = LeaveRequest
        fields = "__all__"
        read_only_fields = ("user", "status")
