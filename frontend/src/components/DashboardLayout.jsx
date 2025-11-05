import React, { useState } from "react";
import Sidebar from "./Sidebar";
import DashboardPage from "../pages/DashboardPage";
import DepartmentPage from "../pages/DepartmentPage";

export default function DashboardLayout({ user, onLogout }) {
  const [activePage, setActivePage] = useState("dashboard");

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardPage user={user} />;
      case "department":
        return <DepartmentPage />;
      default:
        return <DashboardPage user={user} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        onLogout={onLogout}
      />

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">{renderPage()}</div>
    </div>
  );
}
