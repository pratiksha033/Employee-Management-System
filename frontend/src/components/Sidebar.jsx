import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Briefcase,
  Gift,
  Building2,
  DollarSign,
  FileSpreadsheet,
  ClipboardCheck,
  Settings,
  LogOut,
  Menu,
  ChevronLeft,
} from "lucide-react";

export default function Sidebar({ activePage, setActivePage, onLogout, user }) {
  const [isOpen, setIsOpen] = useState(true);
  const role = user?.role || "employee";

  const navItems = [
    { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    ...(role === "admin"
      ? [
          { key: "employee", label: "Employee", icon: <Users size={20} /> },
          { key: "attendance", label: "Attendance", icon: <CalendarCheck size={20} /> },
          { key: "recruitment", label: "Recruitment", icon: <Briefcase size={20} /> },
          { key: "onboarding", label: "Onboarding", icon: <Briefcase size={20} /> },
        ]
      : []),
    { key: "department", label: "Department", icon: <Building2 size={20} /> },
    { key: "rewards", label: "Rewards", icon: <Gift size={20} /> },
    { key: "leave", label: "Leave", icon: <CalendarCheck size={20} /> },
    { key: "salary", label: "Salary", icon: <DollarSign size={20} /> },
    { key: "payroll", label: "Payroll", icon: <FileSpreadsheet size={20} /> },
    { key: "payslips", label: "PaySlips", icon: <FileSpreadsheet size={20} /> },
    { key: "task", label: "Task Management", icon: <ClipboardCheck size={20} /> },
    { key: "settings", label: "Settings", icon: <Settings size={20} /> },
  ];

  return (
    <div
      className={`fixed top-0 left-0 h-screen backdrop-blur-md bg-gray-900/95 border-r border-gray-800 text-gray-200 transition-all duration-300 flex flex-col shadow-lg ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <h1 className={`text-lg font-bold text-teal-400 transition-all ${!isOpen && "hidden"}`}>
          EmployeeEase
        </h1>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-400 hover:text-teal-400 transition"
        >
          {isOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 mt-4 flex-1">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => setActivePage(item.key)}
            className={`flex items-center gap-3 p-3 mx-3 rounded-lg transition-all duration-200
              ${
                activePage === item.key
                  ? "bg-teal-600/20 text-teal-400 border-l-4 border-teal-500"
                  : "hover:bg-gray-800 text-gray-300"
              }`}
          >
            <span className="text-teal-400">{item.icon}</span>
            {isOpen && <span className="text-sm font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 py-2 rounded-lg text-white transition"
        >
          <LogOut size={18} />
          {isOpen && "Logout"}
        </button>
      </div>
    </div>
  );
}
