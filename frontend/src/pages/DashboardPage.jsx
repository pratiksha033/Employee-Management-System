import React, { useState, useEffect } from "react";
import axios from "axios";
import { Users, Building2, Clock } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

// Chart Colors
const COLORS = ["#0088FE", "#00C49F", "#e55252ff"];
const ATTENDANCE_COLORS = ["#4281b5ff", "#e55252ff", "#4c4594ff"]; // Present, Absent, Leave

const StatCard = ({ title, value, icon, colorClass }) => (
  <div
    className={`rounded-xl text-white shadow-md p-5 flex items-center justify-between ${colorClass}`}
  >
    <div>
      <p className="text-sm opacity-80">{title}</p>
      <h3 className="text-3xl font-bold">{value}</h3>
    </div>
    {icon}
  </div>
);

/* --------------------------- ADMIN DASHBOARD --------------------------- */
const AdminDashboard = ({ user }) => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:4000/api/v1/dashboard/stats",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (typeof data !== "object") throw new Error("Invalid response from server");

      data.rewards = data.rewards || [];
      data.departmentCounts = data.departmentCounts || [];

      setStats(data);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching dashboard stats:", err.message);
      setError(err.message || "Failed to load dashboard data");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // every 30 seconds
  return () => clearInterval(interval);
  }, []);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <Clock size={48} className="text-teal-600 animate-spin" />
      </div>
    );

  if (error)
    return (
      <div className="text-red-500 text-center p-6">
        <p>Error: {error}</p>
        <p>Please check your backend server and try again.</p>
      </div>
    );

  const leaveData = [
    { name: "Pending", value: stats.pendingLeaves },
    { name: "Approved", value: stats.approvedLeaves },
    { name: "Rejected", value: stats.rejectedLeaves },
  ];

  const attendanceData = [
    { name: "Present", value: stats.attendance.present },
    { name: "Absent", value: stats.attendance.absent },
    { name: "Leave", value: stats.attendance.leave },
  ];
  

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>

      {/* Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard
          title="Total Employees"
          value={stats.totalEmployees}
          icon={<Users size={38} />}
          colorClass="bg-gradient-to-r from-teal-500 to-teal-600"
        />
        <StatCard
          title="Departments"
          value={stats.totalDepartments}
          icon={<Building2 size={38} />}
          colorClass="bg-gradient-to-r from-blue-500 to-blue-600"
        />
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Leave Chart */}
        <div className="bg-white rounded-xl shadow p-5">
          <h3 className="font-semibold mb-3 text-gray-700">Leave Status</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={leaveData}
                dataKey="value"
                startAngle={180}
                endAngle={0}
                innerRadius={70}
                outerRadius={110}
                paddingAngle={3}
              >
                {leaveData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="text-center mt-[-40px]">
            <p className="text-lg font-semibold text-gray-700">
              Total Leaves: {stats.pendingLeaves + stats.approvedLeaves + stats.rejectedLeaves}
            </p>
          </div>
          <div className="flex gap-6 mt-3">
            {leaveData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: COLORS[idx] }}></div>
                <span className="text-gray-600 text-sm">
                  {item.name} ({item.value})
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance Chart */}
        <div className="bg-white rounded-xl shadow p-5">
          <h3 className="font-semibold mb-3 text-gray-700">Attendance</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={attendanceData}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={5}
                startAngle={90}
                endAngle={450}
                cornerRadius={8}
              >
                {attendanceData.map((entry, index) => (
                  <Cell key={index} fill={ATTENDANCE_COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex gap-6 mt-3 justify-center">
            {attendanceData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ background: ATTENDANCE_COLORS[idx] }}
                ></div>
                <span className="text-gray-600 text-sm">
                  {item.name} ({item.value})
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Rewards Section */}
        <div className="col-span-2 bg-white rounded-xl shadow p-5">
          <h3 className="font-semibold mb-5 text-gray-700 text-lg">Recent Rewards</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.rewards.map((reward, index) => (
              <div
                key={index}
                className="relative p-5 rounded-xl shadow-md overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300"
                style={{
                  background: `linear-gradient(135deg, #6e8efb ${index * 20}%, #a777e3 100%)`,
                }}
              >
                {/* Badge */}
                <div className="absolute top-3 right-3 bg-white text-purple-700 rounded-full w-8 h-8 flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <p className="text-white font-semibold text-lg">{reward.employeeName}</p>
                <p className="text-purple-200 text-sm mt-1">{reward.rewardName}</p>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity rounded-xl"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      
    </div>
  );
};

/* --------------------------- EMPLOYEE DASHBOARD --------------------------- */
const EmployeeDashboard = ({ user }) => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [myLeaves, setMyLeaves] = useState([]);

  const fetchStats = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:4000/api/v1/dashboard/stats",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (typeof data !== "object") throw new Error("Invalid response from server");

      data.rewards = data.rewards || [];
      data.departmentCounts = data.departmentCounts || [];

      setStats(data);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching dashboard stats:", err.message);
      setError(err.message || "Failed to load dashboard data");
      setIsLoading(false);
    }
  };
  const fetchMyLeaves = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:4000/api/v1/leave/my-leaves",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
  
      setMyLeaves(data.leaves || []);
    } catch (err) {
      console.error("Error fetching my leaves:", err.message);
    }
  };
  

  useEffect(() => {
    fetchStats();
    fetchMyLeaves();
  }, []);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <Clock size={48} className="text-teal-600 animate-spin" />
      </div>
    );

  if (error)
    return (
      <div className="text-red-500 text-center p-6">
        <p>Error: {error}</p>
        <p>Please check your backend server and try again.</p>
      </div>
    );

  const attendanceData = [
    {
      name: "Present",
      value: stats.totalEmployees - (stats.pendingLeaves + stats.approvedLeaves + stats.rejectedLeaves),
    },
    { name: "Absent", value: 0 },
    { name: "Leave", value: stats.approvedLeaves + stats.pendingLeaves },
  ];
  const pending = myLeaves.filter(
    (l) => (l.status || "Pending") === "Pending"
  ).length;
  const approved = myLeaves.filter((l) => l.status === "Approved").length;
  const rejected = myLeaves.filter((l) => l.status === "Rejected").length;

  const myLeaveChart = [
    { name: "Pending", value: pending },
    { name: "Approved", value: approved },
    { name: "Rejected", value: rejected },
  ];

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-8 space-y-10">
  
      {/* 🌟 HERO WELCOME */}
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-2xl p-8 shadow-lg flex flex-col md:flex-row justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white">
            Welcome back, {user?.name || "Employee"} 👋
          </h2>
          <p className="text-teal-100 mt-2">
            Here’s an overview of your activity & status
          </p>
        </div>
      </div>
  
      {/* 📊 STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Employees"
          value={stats.totalEmployees}
          icon={<Users size={40} />}
          colorClass="bg-gradient-to-br from-teal-500 to-teal-700"
        />
        <StatCard
          title="Departments"
          value={stats.totalDepartments}
          icon={<Building2 size={40} />}
          colorClass="bg-gradient-to-br from-blue-500 to-blue-700"
        />
      </div>
  
      {/* 🏖️ MY LEAVE STATUS */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">
          My Leave Status
        </h3>
  
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="rounded-xl p-6 bg-gradient-to-br from-yellow-100 to-yellow-200 shadow hover:scale-105 transition">
            <p className="text-sm text-yellow-700">Pending</p>
            <p className="text-3xl font-bold text-yellow-800">{pending}</p>
          </div>
  
          <div className="rounded-xl p-6 bg-gradient-to-br from-green-100 to-green-200 shadow hover:scale-105 transition">
            <p className="text-sm text-green-700">Approved</p>
            <p className="text-3xl font-bold text-green-800">{approved}</p>
          </div>
  
          <div className="rounded-xl p-6 bg-gradient-to-br from-red-100 to-red-200 shadow hover:scale-105 transition">
            <p className="text-sm text-red-700">Rejected</p>
            <p className="text-3xl font-bold text-red-800">{rejected}</p>
          </div>
        </div>
      </div>
  
      {/* 📈 ATTENDANCE */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Attendance Overview
        </h3>
  
        <div className="flex flex-wrap justify-center gap-8 mt-6">
          {attendanceData.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 bg-gray-50 px-5 py-3 rounded-xl shadow"
            >
              <div
                className="w-4 h-4 rounded-full"
                style={{ background: ATTENDANCE_COLORS[idx] }}
              />
              <span className="text-gray-700 font-medium">
                {item.name}: {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
  
      {/* 🏆 RECENT REWARDS */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">
          Recent Rewards
        </h3>
  
        {stats.rewards.length === 0 ? (
          <p className="text-gray-500 text-center">No rewards yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.rewards.map((reward, index) => (
              <div
                key={index}
                className="relative p-6 rounded-2xl shadow-lg text-white overflow-hidden hover:scale-105 transition"
                style={{
                  background: "linear-gradient(135deg, #667eea, #764ba2)",
                }}
              >
                <span className="absolute top-4 right-4 bg-white text-indigo-600 rounded-full w-8 h-8 flex items-center justify-center font-bold">
                  {index + 1}
                </span>
                <p className="text-lg font-semibold">{reward.employeeName}</p>
                <p className="text-indigo-200 mt-1">{reward.rewardName}</p>
              </div>
            ))}
          </div>
        )}
      </div>
  
    </div>
  );
  
};

/* --------------------------- MAIN PAGE --------------------------- */
export default function DashboardPage({ user }) {
  if (!user) return <p>Loading...</p>;
  return user.role === "admin" ? <AdminDashboard user={user} /> : <EmployeeDashboard user={user} />;
}
