from decimal import Decimal

from django.conf import settings
from django.db import models

from accounts.models import CustomUser


class EmployeeSalary(models.Model):
    employee = models.OneToOneField(
        CustomUser,
        on_delete=models.CASCADE,
        related_name="salary_details",
    )
    monthly_salary = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=10, default="INR")
    set_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="salaries_created",
    )
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="salaries_updated",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("employee_id",)

    def __str__(self):
        return f"{self.employee.login_id} - {self.monthly_salary} {self.currency}"


class PayrollRecord(models.Model):
    STATUS_CHOICES = (
        ("PENDING", "Pending"),
        ("PAID", "Paid"),
    )

    employee = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name="payroll_records",
    )
    salary = models.ForeignKey(
        EmployeeSalary,
        on_delete=models.PROTECT,
        related_name="payroll_records",
    )
    month = models.DateField(
        help_text="First day of payroll month (YYYY-MM-01).",
        db_index=True,
    )

    total_days_in_month = models.PositiveSmallIntegerField()
    attendance_entries = models.PositiveSmallIntegerField(default=0)
    present_days = models.PositiveSmallIntegerField(default=0)
    half_days = models.PositiveSmallIntegerField(default=0)
    leave_days = models.PositiveSmallIntegerField(default=0)
    absent_days = models.PositiveSmallIntegerField(default=0)
    payable_days = models.DecimalField(max_digits=6, decimal_places=2, default=Decimal("0.00"))

    designated_salary = models.DecimalField(max_digits=12, decimal_places=2)
    net_salary = models.DecimalField(max_digits=12, decimal_places=2)

    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="PENDING")
    generated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="payrolls_generated",
    )
    credited_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="payrolls_credited",
    )
    credited_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("-month", "employee_id")
        constraints = [
            models.UniqueConstraint(
                fields=("employee", "month"),
                name="unique_employee_month_payroll",
            )
        ]

    def __str__(self):
        return f"{self.employee.login_id} - {self.month:%Y-%m} - {self.status}"

