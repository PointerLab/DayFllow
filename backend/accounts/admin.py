from django.contrib import admin
from .models import CompanyConfig, CompanyLogo, CustomUser

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


@admin.register(CompanyConfig)
class CompanyConfigAdmin(admin.ModelAdmin):
    list_display = ("company_name", "updated_at")
    search_fields = ("company_name",)


@admin.register(CompanyLogo)
class CompanyLogoAdmin(admin.ModelAdmin):
    list_display = ("company_name", "logo_url", "updated_at")
    search_fields = ("company_name",)
