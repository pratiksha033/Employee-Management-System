import React, { useState, useEffect } from "react";
import {
  Users,
  Building2,
  IndianRupee,
  Clock,
  CheckCircle,
  XCircle,
  UserCheck,
  ServerCrash,
} from "lucide-react";

// --- Helper: Get Auth Token ---
const getAuthToken = () => localStorage.getItem("authToken");

// --- Helper: Format Currency in INR ---
const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return "N/A";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(amount);
};

// --- Reusable Stat Card Component ---
const StatCard = ({ title, value, icon, colorClass }) => (
  <div
    className={`rounded-2xl text-white shadow p-4 flex items-center justify-between ${colorClass}`}
  >
    <div>
      <p className="text-sm opacity-90">{title}</p>
      <h3 className="text-2xl font-bold">{value}</h3>
    </div>
    {icon}
  </div>
);

// --- Admin Dashboard View ---
const AdminDashboard = ({ user }) => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const token = getAuthToken();
        const response = await fetch("http://localhost:4000/api/v1/dashboard/stats", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch stats");
        setStats(data.stats);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <Clock size={48} className="text-teal-600 animate-spin" />
      </div>
    );

  if (error)
    return (
      <div className="rounded-lg bg-red-100 p-6 text-red-700">
        <h3 className="text-xl font-semibold flex items-center">
          <ServerCrash size={24} className="mr-2" /> Error
        </h3>
        <p>{error}</p>
      </div>
    );

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>

      {/* Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Employees"
          value={stats.totalEmployees}
          icon={<Users size={36} />}
          colorClass="bg-teal-600"
        />
        <StatCard
          title="Total Departments"
          value={stats.totalDepartments}
          icon={<Building2 size={36} />}
          colorClass="bg-blue-600"
        />
        
      </div>

      {/* Leave Overview */}
      <h2 className="text-xl font-semibold text-gray-700">Leave Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Pending Leaves"
          value={stats.pendingLeaves}
          icon={<Clock size={32} />}
          colorClass="bg-yellow-500"
        />
        <StatCard
          title="Approved Leaves"
          value={stats.approvedLeaves}
          icon={<CheckCircle size={32} />}
          colorClass="bg-green-500"
        />
        <StatCard
          title="Rejected Leaves"
          value={stats.rejectedLeaves}
          icon={<XCircle size={32} />}
          colorClass="bg-red-500"
        />
      </div>

      {/* Employees per Department */}
      <h2 className="text-xl font-semibold text-gray-700">
        Employees per Department
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.departmentCounts?.length ? (
          stats.departmentCounts.map((dept) => (
            <div
              key={dept.departmentName}
              className="rounded-lg bg-white shadow p-4 flex items-center justify-between"
            >
              <div>
                <p className="text-sm text-gray-600">{dept.departmentName}</p>
                <h3 className="text-2xl font-bold text-gray-800">{dept.count}</h3>
              </div>
              <UserCheck size={32} className="text-teal-500" />
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-full">
            No employees assigned to departments yet.
          </p>
        )}
      </div>
    </div>
  );
};

// --- Employee Dashboard View ---
const EmployeeDashboard = ({ user }) => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const token = getAuthToken();
        const response = await fetch("http://localhost:4000/api/v1/dashboard/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch stats");
        setStats(data.stats);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <Clock size={48} className="text-teal-600 animate-spin" />
      </div>
    );

  if (error)
    return (
      <div className="rounded-lg bg-red-100 p-6 text-red-700">
        <h3 className="text-xl font-semibold flex items-center">
          <ServerCrash size={24} className="mr-2" /> Error
        </h3>
        <p>{error}</p>
      </div>
    );

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">
        Welcome back, {user?.name || "Employee"} 👋
      </h2>

      {/* Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Employees"
          value={stats.totalEmployees}
          icon={<Users size={36} />}
          colorClass="bg-teal-600"
        />
        <StatCard
          title="Departments"
          value={stats.totalDepartments}
          icon={<Building2 size={36} />}
          colorClass="bg-blue-600"
        />
        
      </div>

      {/* Department Breakdown */}
      <h2 className="text-xxl font-semibold text-gray-700">
        Employees per Department
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.departmentCounts?.map((dept) => (
          <div
            key={dept.departmentName}
            className="rounded-lg border p-4 text-center shadow-sm bg-white"
          >
            <p className="text-sm text-gray-500">{dept.departmentName}</p>
            <h3 className="text-xl font-bold text-gray-800">{dept.count}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Main Page Component ---
export default function DashboardPage({ user }) {
  if (!user) return <p>Loading...</p>;
  return user.role === "admin" ? (
    <AdminDashboard user={user} />
  ) : (
    <EmployeeDashboard user={user} />
  );
}
