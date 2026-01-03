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
class UserManager(BaseUserManager):
    def create_user(self, login_id, email, password=None, **extra_fields):
        if not login_id:
            raise ValueError("Login ID is required")
        if not email:
            raise ValueError("Email is required")

        email = self.normalize_email(email)
        user = self.model(
            login_id=login_id,
            email=email,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, login_id, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("role", "ADMIN")
        extra_fields.setdefault("must_change_password", False)
        extra_fields.setdefault("date_of_joining", date.today())
        return self.create_user(login_id, email, password, **extra_fields)


# -------------------
# Custom User Model
# -------------------
class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
        ("ADMIN", "Admin"),
        ("HR", "HR"),
        ("EMP", "Employee"),
    )

    login_id = models.CharField(max_length=20, unique=True)
    email = models.EmailField(unique=True)

    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)

    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    date_of_joining = models.DateField()

    must_change_password = models.BooleanField(default=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = "login_id"
    REQUIRED_FIELDS = ["email"]

    def __str__(self):
        return self.login_id
