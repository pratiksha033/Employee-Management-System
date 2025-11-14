import React, { useState } from "react";
import Sidebar from "./Sidebar";
import DashboardPage from "../pages/DashboardPage";
import DepartmentPage from "../pages/DepartmentPage";
import SettingsPage from "../pages/SettingsPage";
import EmployeePage from "../pages/EmployeePage";
import LeavePage from "../pages/LeavePage";
import SalaryPage from "../pages/SalaryPage";
import AttendancePage from "../pages/AttendancePage";
import PayrollPage from "../pages/PayrollPage";
import TaskPage from "../pages/TaskPage";
import RecruitmentPage from "../pages/RecruitmentPage";
import RewardPage from "../pages/RewardPage";
import OnboardingPage from "../pages/OnboardingPage";
import MyPayslips from "../pages/PaySlips";
import PayrollManagement from "../pages/PayrollPage";


export default function DashboardLayout({ user, onLogout }) {
  const [activePage, setActivePage] = useState("dashboard");

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardPage user={user} />;
      case "department":
        return <DepartmentPage />;
      case "settings":
        return <SettingsPage user ={user}/>;
        case "rewards":
          return <RewardPage user ={user}/>;
      case "employee":
        // ✅ Allow Employee page only if user is admin
        return user?.role === "admin" ? (
          <EmployeePage user={user}  />
        ) : (
          <div className="text-center text-red-500 font-semibold mt-10">
            ❌ Access Denied — Only Admins can view this page
          </div>
        );
        case "attendance":
        // ✅ Allow Employee page only if user is admin
        return user?.role === "admin" ? (
          <AttendancePage user={user}  />
        ) : (
          <div className="text-center text-red-500 font-semibold mt-10">
            ❌ Access Denied — Only Admins can view this page
          </div>
        );

        case "payroll":
          // ✅ Allow Employee page only if user is admin
          return user?.role === "admin" ? (
            <PayrollManagement user={user}  />
          ) : (
            <div className="text-center text-red-500 font-semibold mt-10">
              ❌ Access Denied — Only Admins can view this page
            </div>
          );

          case "payslips":
          // ✅ Allow Employee page only if user is admin
          return user?.role === "admin" ? (
            <MyPayslips user={user}  />
          ) : (
            <div className="text-center text-red-500 font-semibold mt-10">
              ❌ Access Denied — Only Admins can view this page
            </div>
          );


          case "recruitment":
            // ✅ Allow Employee page only if user is admin
            return user?.role === "admin" ? (
              <RecruitmentPage user={user}  />
            ) : (
              <div className="text-center text-red-500 font-semibold mt-10">
                ❌ Access Denied — Only Admins can view this page
              </div>
            );

            case "onboarding":
              // ✅ Allow Employee page only if user is admin
              return user?.role === "admin" ? (
                <OnboardingPage user={user}  />
              ) : (
                <div className="text-center text-red-500 font-semibold mt-10">
                  ❌ Access Denied — Only Admins can view this page
                </div>
              );
      case "leave":
        return <LeavePage user ={user}/>;
      case "task":
        return <TaskPage user ={user}/>;
      
      case "salary":
        return <SalaryPage user ={user}/>;
      
      default:
        return <DashboardPage user={user} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar — ✅ Pass user prop */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        onLogout={onLogout}
        user={user} // ✅ Added this
      />

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">{renderPage()}</div>
    </div>
  );
}
