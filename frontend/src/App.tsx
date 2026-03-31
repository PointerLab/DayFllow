import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Employees from "./pages/Employees";
import EmployeesAdmin from "./pages/EmployeesAdmin";
import CreateEmployee from "./pages/CreateEmployee";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import AdminProfile from "./pages/AdminProfile";
import EmployeeProfile from "./pages/EmployeeProfile";
import AdminAttendance from "./pages/AdminAttendance";
import EmployeeAttendance from "./pages/EmployeeAttendance";
import AdminLeaves from "./pages/AdminLeaves";
import EmployeeLeaves from "./pages/EmployeeLeaves";
import CompanySetup from "./pages/CompanySetup";
import Payroll from "./pages/Payroll";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/plans" element={<PlanSelection />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/company/setup" element={<CompanySetup />} />
            
            {/* Protected Routes */}
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard/admin" element={<AdminDashboard />} />
              <Route path="/dashboard/employee" element={<EmployeeDashboard />} />
              <Route path="/employees" element={<Employees />} />
              <Route path="/employees/admin" element={<EmployeesAdmin />} />
              <Route path="/employees/new" element={<CreateEmployee />} />
              <Route path="/profile/admin" element={<AdminProfile />} />
              <Route path="/profile/employee" element={<EmployeeProfile />} />
              <Route path="/attendance/admin" element={<AdminAttendance />} />
              <Route path="/attendance/employee" element={<EmployeeAttendance />} />
              <Route path="/leaves/admin" element={<AdminLeaves />} />
              <Route path="/leaves/employee" element={<EmployeeLeaves />} />
              <Route path="/payroll" element={<Payroll />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
