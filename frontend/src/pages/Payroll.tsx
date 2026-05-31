import React, { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/layout/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useRealtimeRefresh } from "@/hooks/useRealtimeRefresh";
import { fetchEmployees } from "@/api/employees";
import {
  creditPayroll,
  fetchPayrollRecords,
  fetchPayrollSlip,
  fetchSalaryRecords,
  runPayroll,
  upsertSalary,
  type PayrollRecord,
  type PayrollSlip,
  type SalaryRecord,
} from "@/api/payroll";

interface EmployeeOption {
  id: number;
  first_name: string;
  last_name: string;
  login_id: string;
  role: "ADMIN" | "HR" | "EMP" | "INT";
}

const getCurrentMonth = () => new Date().toISOString().slice(0, 7);

const formatCurrency = (value: string | number, currency: string = "INR") => {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return `${value}`;
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
};

const employeeDisplayName = (employee: EmployeeOption) => {
  const fullName = `${employee.first_name || ""} ${employee.last_name || ""}`.trim();
  return fullName || employee.login_id;
};

const Payroll: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const isManager = user?.role === "ADMIN" || user?.role === "HR";

  const [employees, setEmployees] = useState<EmployeeOption[]>([]);
  const [salaryRecords, setSalaryRecords] = useState<SalaryRecord[]>([]);
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
  const [selectedSlip, setSelectedSlip] = useState<PayrollSlip | null>(null);

  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [loadingSlipId, setLoadingSlipId] = useState<number | null>(null);
  const [savingSalary, setSavingSalary] = useState(false);
  const [runningPayroll, setRunningPayroll] = useState(false);
  const [creditingPayrollId, setCreditingPayrollId] = useState<number | null>(null);

  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [salaryAmount, setSalaryAmount] = useState("");
  const [currency, setCurrency] = useState("INR");

  const [runMonth, setRunMonth] = useState(getCurrentMonth());
  const [runEmployeeId, setRunEmployeeId] = useState("all");

  const [recordMonth, setRecordMonth] = useState(getCurrentMonth());
  const [recordStatus, setRecordStatus] = useState<"ALL" | "PENDING" | "PAID">("ALL");

  const [error, setError] = useState<string | null>(null);

  const selectedEmployee = useMemo(
    () => employees.find((employee) => String(employee.id) === selectedEmployeeId),
    [employees, selectedEmployeeId],
  );

  const salaryRecordByEmployeeId = useMemo(() => {
    const map = new Map<number, SalaryRecord>();
    salaryRecords.forEach((salary) => {
      map.set(salary.employee_id, salary);
    });
    return map;
  }, [salaryRecords]);

  const loadEmployees = async () => {
    if (!isManager) {
      setEmployees([]);
      return;
    }

    const scope = user?.role === "ADMIN" ? "non_admin" : undefined;
    const list = (await fetchEmployees(scope)) as EmployeeOption[];
    setEmployees(list.filter((employee) => employee.role !== "ADMIN"));
  };

  const loadSalaryRecords = async () => {
    try {
      const response = await fetchSalaryRecords();
      if (Array.isArray(response)) {
        setSalaryRecords(response);
      } else if (response && typeof response === "object") {
        setSalaryRecords([response]);
      } else {
        setSalaryRecords([]);
      }
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load salary data.";
      if (!isManager && message.toLowerCase().includes("not configured")) {
        setSalaryRecords([]);
        setError(null);
        return;
      }
      setError(message);
    }
  };

  const loadPayrollRecords = async (params?: {
    month?: string;
    status?: "PENDING" | "PAID";
  }) => {
    setLoadingRecords(true);
    try {
      const records = await fetchPayrollRecords({
        month: params?.month ?? recordMonth,
        status:
          (params?.status as "PENDING" | "PAID" | undefined) ??
          (recordStatus === "ALL" ? undefined : recordStatus),
      });
      setPayrollRecords(records);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load payroll records.");
    } finally {
      setLoadingRecords(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    const bootstrap = async () => {
      setLoadingInitial(true);
      try {
        if (isManager) {
          await loadEmployees();
        }
        await Promise.all([loadSalaryRecords(), loadPayrollRecords()]);
      } catch (err) {
        if (mounted) {
          const message = err instanceof Error ? err.message : "Failed to load payroll page.";
          setError(message);
          toast({
            title: "Payroll load failed",
            description: message,
            variant: "destructive",
          });
        }
      } finally {
        if (mounted) {
          setLoadingInitial(false);
        }
      }
    };
    bootstrap();
    return () => {
      mounted = false;
    };
  }, [isManager, user?.role]);

  useEffect(() => {
    if (loadingInitial) return;
    loadPayrollRecords();
  }, [recordMonth, recordStatus]);

  useEffect(() => {
    if (!selectedEmployee) return;
    const currentSalary = salaryRecordByEmployeeId.get(selectedEmployee.id);
    if (currentSalary) {
      setSalaryAmount(currentSalary.monthly_salary);
      setCurrency(currentSalary.currency || "INR");
    }
  }, [selectedEmployee, salaryRecordByEmployeeId]);

  useRealtimeRefresh(() => {
    if (isManager) {
      void loadEmployees();
    }
    void loadSalaryRecords();
    void loadPayrollRecords();
  });

  const handleSaveSalary = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedEmployeeId || !salaryAmount.trim()) {
      toast({
        title: "Missing fields",
        description: "Choose an employee and monthly salary.",
        variant: "destructive",
      });
      return;
    }

    const amount = Number(salaryAmount);
    if (!Number.isFinite(amount) || amount < 0) {
      toast({
        title: "Invalid salary",
        description: "Monthly salary must be a valid non-negative number.",
        variant: "destructive",
      });
      return;
    }

    setSavingSalary(true);
    try {
      await upsertSalary({
        employee_id: Number(selectedEmployeeId),
        monthly_salary: amount.toFixed(2),
        currency: currency.trim().toUpperCase() || "INR",
      });
      toast({
        title: "Salary saved",
        description: "Employee designated salary has been updated.",
      });
      await loadSalaryRecords();
    } catch (err) {
      toast({
        title: "Failed to save salary",
        description: err instanceof Error ? err.message : "Try again.",
        variant: "destructive",
      });
    } finally {
      setSavingSalary(false);
    }
  };

  const handleRunPayroll = async () => {
    if (!runMonth) {
      toast({
        title: "Month is required",
        description: "Choose a payroll month.",
        variant: "destructive",
      });
      return;
    }

    setRunningPayroll(true);
    try {
      const result = await runPayroll({
        month: runMonth,
        employee_id: runEmployeeId === "all" ? undefined : Number(runEmployeeId),
      });

      const generated = result.results.filter((item) => item.status === "generated").length;
      const updated = result.results.filter((item) => item.status === "updated").length;
      const skipped = result.results.filter((item) => item.status === "skipped").length;

      toast({
        title: "Payroll processed",
        description: `Generated: ${generated}, Updated: ${updated}, Skipped: ${skipped}`,
      });
      await loadPayrollRecords({ month: runMonth });
      setRecordMonth(runMonth);
    } catch (err) {
      toast({
        title: "Payroll run failed",
        description: err instanceof Error ? err.message : "Try again.",
        variant: "destructive",
      });
    } finally {
      setRunningPayroll(false);
    }
  };

  const handleCreditPayroll = async (payrollId: number) => {
    setCreditingPayrollId(payrollId);
    try {
      await creditPayroll(payrollId);
      toast({
        title: "Salary credited",
        description: "Payroll status is now marked as paid.",
      });
      await loadPayrollRecords();
    } catch (err) {
      toast({
        title: "Credit failed",
        description: err instanceof Error ? err.message : "Try again.",
        variant: "destructive",
      });
    } finally {
      setCreditingPayrollId(null);
    }
  };

  const handleViewSlip = async (payrollId: number) => {
    setLoadingSlipId(payrollId);
    try {
      const slip = await fetchPayrollSlip(payrollId);
      setSelectedSlip(slip);
      toast({
        title: "Salary slip ready",
        description: `${slip.month_label} slip loaded.`,
      });
    } catch (err) {
      toast({
        title: "Unable to load slip",
        description: err instanceof Error ? err.message : "Try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingSlipId(null);
    }
  };

  const statusBadgeClass = (status: "PENDING" | "PAID") =>
    status === "PAID"
      ? "bg-success text-success-foreground"
      : "bg-warning text-warning-foreground";

  return (
    <div className="min-h-screen bg-background">
      <Header
        breadcrumb="Payroll"
        subtitle={isManager ? "Manage salary, payroll run, and credits" : "Track your salary and slips"}
      />

      <div className="p-6 space-y-6">
        {error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {isManager && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="text-lg font-semibold text-foreground">Set Designated Salary</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Admin or HR can assign/update monthly salary for any employee.
              </p>

              <form onSubmit={handleSaveSalary} className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Employee</label>
                  <select
                    value={selectedEmployeeId}
                    onChange={(event) => setSelectedEmployeeId(event.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
                    disabled={loadingInitial}
                  >
                    <option value="">Select employee</option>
                    {employees.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employeeDisplayName(employee)} ({employee.login_id})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-1">Monthly Salary</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={salaryAmount}
                      onChange={(event) => setSalaryAmount(event.target.value)}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
                      placeholder="50000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Currency</label>
                    <input
                      type="text"
                      value={currency}
                      onChange={(event) => setCurrency(event.target.value.toUpperCase())}
                      maxLength={10}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground uppercase"
                      placeholder="INR"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={savingSalary}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
                >
                  {savingSalary ? "Saving..." : "Save Salary"}
                </button>
              </form>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="text-lg font-semibold text-foreground">Run Payroll</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Generate payroll from attendance and keep status as pending until credited.
              </p>

              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Month</label>
                  <input
                    type="month"
                    value={runMonth}
                    onChange={(event) => setRunMonth(event.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Employee (Optional)</label>
                  <select
                    value={runEmployeeId}
                    onChange={(event) => setRunEmployeeId(event.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
                  >
                    <option value="all">All employees with salary configured</option>
                    {employees.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employeeDisplayName(employee)} ({employee.login_id})
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={handleRunPayroll}
                  disabled={runningPayroll}
                  className="rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/90 disabled:opacity-60"
                >
                  {runningPayroll ? "Running..." : "Run Payroll"}
                </button>
              </div>
            </div>
          </div>
        )}

        {isManager && (
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-lg font-semibold text-foreground">Designated Salaries</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/40">
                  <tr>
                    <th className="px-3 py-2 text-left text-sm font-semibold text-foreground">Employee</th>
                    <th className="px-3 py-2 text-left text-sm font-semibold text-foreground">Role</th>
                    <th className="px-3 py-2 text-left text-sm font-semibold text-foreground">Salary</th>
                    <th className="px-3 py-2 text-left text-sm font-semibold text-foreground">Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {salaryRecords.length === 0 ? (
                    <tr>
                      <td className="px-3 py-8 text-center text-sm text-muted-foreground" colSpan={4}>
                        No salaries assigned yet.
                      </td>
                    </tr>
                  ) : (
                    salaryRecords.map((salary) => (
                      <tr key={salary.employee_id}>
                        <td className="px-3 py-3 text-sm text-foreground">
                          {salary.employee_name} ({salary.employee_login_id})
                        </td>
                        <td className="px-3 py-3 text-sm text-foreground">{salary.employee_role}</td>
                        <td className="px-3 py-3 text-sm font-medium text-foreground">
                          {formatCurrency(salary.monthly_salary, salary.currency)}
                        </td>
                        <td className="px-3 py-3 text-sm text-muted-foreground">
                          {new Date(salary.updated_at).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!isManager && (
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-lg font-semibold text-foreground">Your Designated Salary</h2>
            {salaryRecords[0] ? (
              <p className="mt-2 text-3xl font-bold text-foreground">
                {formatCurrency(salaryRecords[0].monthly_salary, salaryRecords[0].currency)}
              </p>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">
                Salary is not configured yet. Contact Admin/HR.
              </p>
            )}
          </div>
        )}

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex flex-col md:flex-row md:items-end gap-3 justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Payroll Records</h2>
              <p className="text-sm text-muted-foreground">View pending and paid payroll entries.</p>
            </div>
            <div className="flex flex-wrap items-end gap-3">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Month</label>
                <input
                  type="month"
                  value={recordMonth}
                  onChange={(event) => setRecordMonth(event.target.value)}
                  className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Status</label>
                <select
                  value={recordStatus}
                  onChange={(event) => setRecordStatus(event.target.value as "ALL" | "PENDING" | "PAID")}
                  className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
                >
                  <option value="ALL">All</option>
                  <option value="PENDING">Pending</option>
                  <option value="PAID">Paid</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/40">
                <tr>
                  {isManager && (
                    <th className="px-3 py-2 text-left text-sm font-semibold text-foreground">Employee</th>
                  )}
                  <th className="px-3 py-2 text-left text-sm font-semibold text-foreground">Month</th>
                  <th className="px-3 py-2 text-left text-sm font-semibold text-foreground">Payable Days</th>
                  <th className="px-3 py-2 text-left text-sm font-semibold text-foreground">Net Salary</th>
                  <th className="px-3 py-2 text-left text-sm font-semibold text-foreground">Status</th>
                  <th className="px-3 py-2 text-left text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loadingRecords ? (
                  <tr>
                    <td
                      className="px-3 py-8 text-center text-sm text-muted-foreground"
                      colSpan={isManager ? 6 : 5}
                    >
                      Loading payroll...
                    </td>
                  </tr>
                ) : payrollRecords.length === 0 ? (
                  <tr>
                    <td
                      className="px-3 py-8 text-center text-sm text-muted-foreground"
                      colSpan={isManager ? 6 : 5}
                    >
                      No payroll records found.
                    </td>
                  </tr>
                ) : (
                  payrollRecords.map((record) => (
                    <tr key={record.id}>
                      {isManager && (
                        <td className="px-3 py-3 text-sm text-foreground">
                          {record.employee_name} ({record.employee_login_id})
                        </td>
                      )}
                      <td className="px-3 py-3 text-sm text-foreground">{record.month_label}</td>
                      <td className="px-3 py-3 text-sm text-foreground">{record.payable_days}</td>
                      <td className="px-3 py-3 text-sm font-medium text-foreground">
                        {formatCurrency(record.net_salary)}
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusBadgeClass(record.status)}`}
                        >
                          {record.status}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleViewSlip(record.id)}
                            className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
                            disabled={loadingSlipId === record.id}
                          >
                            {loadingSlipId === record.id ? "Loading..." : "View Slip"}
                          </button>
                          {isManager && record.status === "PENDING" && (
                            <button
                              type="button"
                              onClick={() => handleCreditPayroll(record.id)}
                              disabled={creditingPayrollId === record.id}
                              className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
                            >
                              {creditingPayrollId === record.id ? "Crediting..." : "Mark Paid"}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {selectedSlip && (
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Salary Slip</h2>
                <p className="text-sm text-muted-foreground">{selectedSlip.month_label}</p>
              </div>
              <button
                type="button"
                onClick={() => window.print()}
                className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
              >
                Print Slip
              </button>
            </div>

            <div className="mt-4 rounded-xl border border-border p-5 bg-background">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Company</p>
                  <p className="text-lg font-semibold text-foreground">{selectedSlip.company_name}</p>
                </div>
                {selectedSlip.company_logo_url ? (
                  <img
                    src={selectedSlip.company_logo_url}
                    alt="Company logo"
                    className="h-14 w-auto max-w-[220px] object-contain rounded-md bg-card p-1 border border-border"
                  />
                ) : (
                  <p className="text-xs text-muted-foreground">No company logo available</p>
                )}
              </div>

              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Employee</p>
                  <p className="font-medium text-foreground">
                    {selectedSlip.employee.name} ({selectedSlip.employee.login_id})
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Department</p>
                  <p className="font-medium text-foreground">{selectedSlip.employee.department || "--"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Employment Type</p>
                  <p className="font-medium text-foreground">{selectedSlip.employee.employment_type || "--"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Payroll Status</p>
                  <p className="font-medium text-foreground">{selectedSlip.status}</p>
                </div>
              </div>

              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="py-2 text-muted-foreground">Designated Salary</td>
                      <td className="py-2 text-right font-medium text-foreground">
                        {formatCurrency(selectedSlip.designated_salary)}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 text-muted-foreground">Total Days In Month</td>
                      <td className="py-2 text-right font-medium text-foreground">
                        {selectedSlip.total_days_in_month}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 text-muted-foreground">Present Days</td>
                      <td className="py-2 text-right font-medium text-foreground">
                        {selectedSlip.present_days}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 text-muted-foreground">Half Days</td>
                      <td className="py-2 text-right font-medium text-foreground">
                        {selectedSlip.half_days}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 text-muted-foreground">Payable Days</td>
                      <td className="py-2 text-right font-medium text-foreground">
                        {selectedSlip.payable_days}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 text-muted-foreground">Net Salary</td>
                      <td className="py-2 text-right text-lg font-bold text-foreground">
                        {formatCurrency(selectedSlip.net_salary)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payroll;
