from django.urls import path

from .views import (
    EmployeeSalaryAPIView,
    PayrollCreditAPIView,
    PayrollListAPIView,
    PayrollRunAPIView,
    PayrollSlipHTMLAPIView,
    PayrollSlipAPIView,
    AddExpenseAPIView,
)

urlpatterns = [
    path("salaries/", EmployeeSalaryAPIView.as_view(), name="payroll-salaries"),
    path("salaries/add-expense/", AddExpenseAPIView.as_view(), name="payroll-add-expense"),
    path("run/", PayrollRunAPIView.as_view(), name="payroll-run"),
    path("records/", PayrollListAPIView.as_view(), name="payroll-records"),
    path("records/<int:payroll_id>/credit/", PayrollCreditAPIView.as_view(), name="payroll-credit"),
    path("slips/<int:payroll_id>/", PayrollSlipAPIView.as_view(), name="payroll-slip"),
    path("slips/<int:payroll_id>/html/", PayrollSlipHTMLAPIView.as_view(), name="payroll-slip-html"),
]

