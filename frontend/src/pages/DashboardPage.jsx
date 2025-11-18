import React, { useState, useEffect } from "react";
import {
  Users,
  Building2,
  Clock,
  CheckCircle,
  XCircle,
  UserCheck,
  ServerCrash,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

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

// --- Admin Dashboard ---
const AdminDashboard = ({ user }) => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        totalEmployees: 8,
        totalDepartments: 3,
        pendingLeaves: 2,
        approvedLeaves: 4,
        rejectedLeaves: 1,
        departmentCounts: [
          { departmentName: "HR", count: 2 },
          { departmentName: "Tech", count: 3 },
          { departmentName: "Finance", count: 1 },
        ],
      });
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
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

  // Data for Charts
  const leaveData = [
    { type: "Pending", count: stats.pendingLeaves },
    { type: "Approved", count: stats.approvedLeaves },
    { type: "Rejected", count: stats.rejectedLeaves },
  ];

  const deptData = stats.departmentCounts.map((d) => ({
    name: d.departmentName,
    Employees: d.count,
  }));

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
        <StatCard
          title="Total Leaves"
          value={stats.pendingLeaves + stats.approvedLeaves + stats.rejectedLeaves}
          icon={<CheckCircle size={36} />}
          colorClass="bg-purple-600"
        />
      </div>

      {/* Leave Overview */}
      <h2 className="text-xl font-semibold text-gray-700 mt-6">Leaves Overview</h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={leaveData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <XAxis dataKey="type" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#facc15" />
        </BarChart>
      </ResponsiveContainer>

      {/* Employees per Department */}
      <h2 className="text-xl font-semibold text-gray-700 mt-6">
        Employees per Department
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={deptData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Employees" stroke="#14b8a6" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// --- Employee Dashboard ---
const EmployeeDashboard = ({ user }) => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        totalEmployees: 8,
        totalDepartments: 3,
        departmentCounts: [
          { departmentName: "HR", count: 2 },
          { departmentName: "Tech", count: 3 },
          { departmentName: "Finance", count: 1 },
        ],
      });
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
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

  const deptData = stats.departmentCounts.map((d) => ({
    name: d.departmentName,
    Employees: d.count,
  }));

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

      {/* Employees per Department */}
      <h2 className="text-xl font-semibold text-gray-700 mt-6">
        Employees per Department
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={deptData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Employees" fill="#14b8a6" />
        </BarChart>
      </ResponsiveContainer>
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
