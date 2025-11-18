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
         
        ]
      : []),
    { key: "department", label: "Department", icon: <Building2 size={20} /> },
    { key: "rewards", label: "Rewards", icon: <Gift size={20} /> },
    { key: "leave", label: "Leave", icon: <CalendarCheck size={20} /> },
    { key: "salary", label: "Salary", icon: <DollarSign size={20} /> },
    { key: "payroll", label: "Payroll", icon: <FileSpreadsheet size={20} /> },
    
    { key: "task", label: "Task Management", icon: <ClipboardCheck size={20} /> },
    { key: "settings", label: "Settings", icon: <Settings size={20} /> },
  ];

  return (
    <div
      className={`fixed top-0 left-0 h-full flex flex-col bg-gray-900/95 backdrop-blur-md border-r border-gray-800 text-gray-200 transition-all duration-300 shadow-lg
      ${isOpen ? "w-64" : "w-20"}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        {isOpen && (
          <h1 className="text-lg font-bold text-teal-400">EmployeeEase</h1>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-400 hover:text-teal-400 transition"
        >
          {isOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto mt-4">
        <nav className="flex flex-col gap-1">
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
      </div>

      {/* Logout Button Always Visible */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={onLogout}
          className="flex items-center justify-center gap-2 w-full bg-red-600 hover:bg-red-700 py-2 rounded-lg text-white transition"
        >
          <LogOut size={20} />
          {isOpen && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
}
