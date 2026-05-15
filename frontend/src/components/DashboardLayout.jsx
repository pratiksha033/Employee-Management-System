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

export default function DashboardLayout({ user, onLogout, toggleTheme, darkMode }) {
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // ------------ PAGE RENDERER ------------ //
  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardPage user={user} darkMode={darkMode} />;
      case "department":
        return <DepartmentPage user={user} darkMode={darkMode} />;
      case "settings":
        return <Settings user={user} darkMode={darkMode} />;

      // ------ ADMIN ONLY PAGES ------ //
      case "employee":
        return user?.role === "admin" ? <EmployeePage user={user} darkMode={darkMode} /> : <AccessDenied />;
      case "attendance":
        return <AttendancePage user={user} darkMode={darkMode} />;
      case "payroll":
        return <PayrollPage user={user} darkMode={darkMode} />;
      case "payslips":
        return user?.role === "admin" ? <PaySlips user={user} darkMode={darkMode} /> : <AccessDenied />;
      case "recruitment":
        return user?.role === "admin" ? <RecruitmentPage user={user} darkMode={darkMode} /> : <AccessDenied />;
      case "onboarding":
        return user?.role === "admin" ? <OnboardingPage user={user} darkMode={darkMode} /> : <AccessDenied />;

      // ------ GENERAL PAGES ------ //
      case "leave":
        return <LeavePage user={user} darkMode={darkMode} />;
      case "task":
        return <TaskPage user={user} darkMode={darkMode} />;
      case "rewards":
          return <RewardPage user={user} darkMode={darkMode} />;
      case "salary":
        return <SalaryPage user={user} darkMode={darkMode} />;

      default:
        return <DashboardPage user={user} darkMode={darkMode} />;
    }
  };

  // ------------ ADMIN ACCESS BLOCK ------------ //
  const AccessDenied = () => (
    <div className="text-center text-red-500 font-semibold mt-10">
      ❌ Access Denied — Admin Only
    </div>
  );

  return (
    <div className="flex min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white overflow-x-hidden transition-colors duration-300">

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
        className={`relative flex-1 min-h-screen w-full bg-slate-50 dark:bg-slate-950 overflow-y-auto p-6 transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        {/* Theme Toggle Button within Dashboard */}
        <div className="absolute top-6 right-6 z-10">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 px-3 py-1.5 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-medium text-sm"
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>

        {/* Ensure underlying pages don't get covered by absolute toggle if they put content top-right, by adding some pt or using their own internal layout handling. But most pages have margins. */}
        <div className="mt-2">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}