from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    PermissionsMixin,
    BaseUserManager
)
from datetime import date

# -------------------
# User Manager
# -------------------
class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")

        email = self.normalize_email(email)
        extra_fields.setdefault("login_id", email)
        user = self.model(
            email=email,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("role", "ADMIN")
        extra_fields.setdefault("must_change_password", False)
        return self.create_user(email, password, **extra_fields)


# -------------------
# Custom User Model
# -------------------
class CustomUser(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
        ("ADMIN", "Admin"),
        ("HR", "HR"),
        ("EMP", "Employee"),
        ("INT", "Intern"),
    )

    login_id = models.CharField(max_length=255, unique=True)
    email = models.EmailField(unique=True)

    first_name = models.CharField(max_length=50, blank=True)
    last_name = models.CharField(max_length=50, blank=True)
    company_name = models.CharField(max_length=150, blank=True, default="")

    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default="EMP")
    date_of_joining = models.DateField(default=date.today)
    department = models.CharField(max_length=100, blank=True, default="")
    employment_type = models.CharField(max_length=50, blank=True, default="")
    salary = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)

    must_change_password = models.BooleanField(default=False)
    is_approved = models.BooleanField(default=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = CustomUserManager()

    USERNAME_FIELD = "login_id"
    REQUIRED_FIELDS = ["email"]

    def __str__(self):
        return self.login_id


class CompanyConfig(models.Model):
    company_name = models.CharField(max_length=150, unique=True, db_index=True)
    departments = models.JSONField(default=list, blank=True)
    roles = models.JSONField(default=list, blank=True)
    employment_types = models.JSONField(default=list, blank=True)
    created_by = models.ForeignKey(
        CustomUser,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="company_configs_created",
    )
    updated_by = models.ForeignKey(
        CustomUser,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="company_configs_updated",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.company_name} configuration"
