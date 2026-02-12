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
import CreateEmployee from "./pages/CreateEmployee";
import AdminProfile from "./pages/AdminProfile";
import EmployeeProfile from "./pages/EmployeeProfile";
import AdminAttendance from "./pages/AdminAttendance";
import EmployeeAttendance from "./pages/EmployeeAttendance";
import AdminLeaves from "./pages/AdminLeaves";
import EmployeeLeaves from "./pages/EmployeeLeaves";
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
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected Routes */}
            <Route element={<DashboardLayout />}>
              <Route path="/employees" element={<Employees />} />
              <Route path="/employees/new" element={<CreateEmployee />} />
              <Route path="/profile/admin" element={<AdminProfile />} />
              <Route path="/profile/employee" element={<EmployeeProfile />} />
              <Route path="/attendance/admin" element={<AdminAttendance />} />
              <Route path="/attendance/employee" element={<EmployeeAttendance />} />
              <Route path="/leaves/admin" element={<AdminLeaves />} />
              <Route path="/leaves/employee" element={<EmployeeLeaves />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
