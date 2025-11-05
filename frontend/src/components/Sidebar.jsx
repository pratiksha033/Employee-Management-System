import React, { useState } from "react";

export default function Sidebar({ activePage, setActivePage, onLogout }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className={`fixed top-0 left-0 h-screen bg-gray-900 text-white transition-all duration-300 flex flex-col ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="m-4 px-2 py-1 bg-teal-600 rounded"
      >
        {isOpen ? "Features" : ">>"}
      </button>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 mt-4 flex-1">
        <button
          onClick={() => setActivePage("dashboard")}
          className={`p-3 text-left hover:bg-gray-700 ${
            activePage === "dashboard" ? "bg-gray-700" : ""
          }`}
        >
          {isOpen ? "Dashboard" : ""}
        </button>
        <button
          onClick={() => setActivePage("employee")}
          className={`p-3 text-left hover:bg-gray-700 ${
            activePage === "employee" ? "bg-gray-700" : ""
          }`}
        >
          {isOpen ? "Employee" : ""}
        </button>

        <button
          onClick={() => setActivePage("department")}
          className={`p-3 text-left hover:bg-gray-700 ${
            activePage === "department" ? "bg-gray-700" : ""
          }`}
        >
          {isOpen ? "Department" : ""}
        </button>
        <button
          onClick={() => setActivePage("Leave")}
          className={`p-3 text-left hover:bg-gray-700 ${
            activePage === "Leave" ? "bg-gray-700" : ""
          }`}
        >
          {isOpen ? "Leave" : ""}
        </button>
        <button
          onClick={() => setActivePage("Salary")}
          className={`p-3 text-left hover:bg-gray-700 ${
            activePage === "Salary" ? "bg-gray-700" : ""
          }`}
        >
          {isOpen ? "Salary" : ""}
        </button>
        <button
          onClick={() => setActivePage("Profile")}
          className={`p-3 text-left hover:bg-gray-700 ${
            activePage === "Profile" ? "bg-gray-700" : ""
          }`}
        >
          {isOpen ? "Profile" : ""}
        </button>
        <button
          onClick={() => setActivePage("settings")}
          className={`p-3 text-left hover:bg-gray-700 ${
            activePage === "Settings" ? "bg-gray-700" : ""
          }`}
        >
          {isOpen ? "Settings" : ""}
        </button>
      </nav>

      {/* Logout */}
      <div className="p-4">
        <button
          onClick={onLogout}
          className="bg-red-600 hover:bg-red-700 w-full py-2 rounded"
        >
          {isOpen ? "Logout" : "X"}
        </button>
      </div>
    </div>
  );
}
