import React, { useState } from "react";
import Sidebar from "./Sidebar";
import DashboardPage from "../pages/DashboardPage";
import DepartmentPage from "../pages/DepartmentPage";
import Settings from "../components/Settings";
import EmployeePage from "../pages/EmployeePage";
import LeavePage from "../pages/LeavePage";
import SalaryPage from "../pages/SalaryPage";
import AttendancePage from "../pages/AttendancePage";
import PayrollPage from "../pages/PayrollPage";
import TaskPage from "../pages/TaskPage";
import RecruitmentPage from "../pages/RecruitmentPage";
import RewardPage from "../pages/RewardPage";
import PaySlips from "../pages/PaySlips";

export default function DashboardLayout({ user, onLogout }) {
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // ------------ PAGE RENDERER ------------ //
  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardPage user={user} />;
      case "department":
        return <DepartmentPage />;
      case "settings":
        return <Settings user={user} />;

      // ------ ADMIN ONLY PAGES ------ //
      case "employee":
        return user?.role === "admin" ? <EmployeePage user={user} /> : <AccessDenied />;
      case "attendance":
        return <AttendancePage user={user} />;
      case "payroll":
        return <PayrollPage user={user} />;
      case "payslips":
        return user?.role === "admin" ? <PaySlips user={user} /> : <AccessDenied />;
      case "recruitment":
        return user?.role === "admin" ? <RecruitmentPage user={user} /> : <AccessDenied />;
      case "onboarding":
        return user?.role === "admin" ? <OnboardingPage user={user} /> : <AccessDenied />;

      // ------ GENERAL PAGES ------ //
      case "leave":
        return <LeavePage user={user} />;
      case "task":
        return <TaskPage user={user} />;
      case "rewards":
          return <RewardPage user={user} />;
      case "salary":
        return <SalaryPage user={user} />;

      default:
        return <DashboardPage user={user} />;
    }
  };

  // ------------ ADMIN ACCESS BLOCK ------------ //
  const AccessDenied = () => (
    <div className="text-center text-red-500 font-semibold mt-10">
      ❌ Access Denied — Admin Only
    </div>
  );

  return (
    <div className="flex min-h-screen w-full bg-[#0f172a] text-white overflow-x-hidden">

      {/* ---------------- SIDEBAR ---------------- */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        onLogout={onLogout}
        user={user}
        onToggle={(open) => setSidebarOpen(open)}
      />

      {/* ---------------- MAIN CONTENT AREA ---------------- */}
      <div
        className={`flex-1 min-h-screen w-full bg-[#0f172a] overflow-y-auto p-6 transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        {renderPage()}
      </div>
    </div>
  );
}