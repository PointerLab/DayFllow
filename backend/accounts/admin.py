from django.contrib import admin
from .models import CustomUser

@admin.register(CustomUser)
class UserAdmin(admin.ModelAdmin):
    list_display = (
        "login_id",
        "email",
        "role",
        "is_active",
        "is_staff",
        "must_change_password",
    )
    search_fields = ("login_id", "email")
    list_filter = ("role", "is_active")
