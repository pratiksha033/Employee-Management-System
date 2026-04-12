import React, { useState, useEffect } from "react";
import axios from "axios";
import { Users, Building2, Clock, LogIn, LogOut, CheckCircle, XCircle, AlertCircle } from "lucide-react";
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
  const [allLeaves, setAllLeaves] = useState([]);
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

  const fetchAllLeaves = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:4000/api/v1/leave/all",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setAllLeaves(data.leaves || []);
    } catch (err) {
      console.error("Error fetching all leaves:", err.message);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchAllLeaves();
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

  // Prepare Leave Status Chart
  const leaveData = [
    { name: "Pending", value: stats.pendingLeaves },
    { name: "Approved", value: stats.approvedLeaves },
    { name: "Rejected", value: stats.rejectedLeaves },
  ];

  // Prepare Attendance Chart
  const attendanceData = [
    { name: "Present", value: stats.attendance.present },
    { name: "Absent", value: stats.attendance.absent },
    { name: "Leave", value: stats.attendance.leave },
  ];

  // Prepare Leaves Per Month
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const leavesPerMonth = months.map(m => ({ month: m, leaves: 0 }));

  allLeaves.forEach(leave => {
    const date = new Date(leave.startDate);
    const monthIndex = date.getMonth();
    leavesPerMonth[monthIndex].leaves += 1;
  });


  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h2>

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
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-sm p-5">
          <h3 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">Leave Status</h3>
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
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Total Leaves: {stats.pendingLeaves + stats.approvedLeaves + stats.rejectedLeaves}
            </p>
          </div>
          <div className="flex gap-2 mt-3">
            {leaveData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: COLORS[idx] }}></div>
                <span className="text-gray-700 dark:text-gray-400 text-sm">
                  {item.name} ({item.value})
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance Chart */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-sm p-5">
          <h3 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">Attendance</h3>
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
                <span className="text-gray-700 dark:text-gray-400 text-sm">
                  {item.name} ({item.value})
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Rewards Section */}
      <div className="col-span-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-sm p-5">
          <h3 className="font-semibold mb-5 text-gray-800 dark:text-gray-200 text-lg">Recent Rewards</h3>
          <div className="space-y-4">
            {stats.rewards.map((reward, index) => (
              <div
                key={index}
                className="relative w-full p-5 rounded-xl shadow-md overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300 flex justify-between items-center"
                style={{
                  background: `linear-gradient(135deg, #6e8efb ${index * 20}%, #a777e3 100%)`,
                }}
              >
                <p className="text-white font-semibold text-lg">{reward.employeeName}</p>
                <p className="text-purple-200 text-sm">{reward.rewardType}</p>
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity rounded-xl"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Leaves Per Month Chart */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-sm p-5">
        <h3 className="font-semibold mb-3 text-gray-700">Leaves Per Month</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={leavesPerMonth}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="leaves" fill="#4cb0c9ff" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
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
  const [myTasks, setMyTasks] = useState([]);

  // ✅ Attendance states
  const [todayStatus, setTodayStatus] = useState(null); // null | { status, checkInTime, checkOutTime }
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch today's status
  const fetchTodayStatus = async () => {
    try {
      const { data } = await axios.get("http://localhost:4000/api/v1/attendance/today-status", {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      setTodayStatus(data);
    } catch (err) {
      console.error("Error fetching today status:", err.message);
    }
  };

  // Check In handler
  const handleCheckIn = async () => {
    setAttendanceLoading(true);
    try {
      await axios.post("http://localhost:4000/api/v1/attendance/checkin", {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      await fetchTodayStatus();
    } catch (err) {
      alert(err.response?.data?.message || "Check-in failed");
    } finally {
      setAttendanceLoading(false);
    }
  };

  // Check Out handler
  const handleCheckOut = async () => {
    setAttendanceLoading(true);
    try {
      await axios.post("http://localhost:4000/api/v1/attendance/checkout", {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      await fetchTodayStatus();
    } catch (err) {
      alert(err.response?.data?.message || "Check-out failed");
    } finally {
      setAttendanceLoading(false);
    }
  };
  const fethchMyTasks = async () => {
    try {
      const { data } = await axios.get("http://localhost:4000/api/v1/tasks/my", {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      }
      );
      console.log("My Tasks Data:", data);
      setMyTasks(data.tasks || []);
    }
    catch (err) {
      console.error("Error fetching my tasks:", err.message);
    }
  };

  useEffect(() => {
    fethchMyTasks();
    fetchTodayStatus();
  }, []);
  const fetchStats = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:4000/api/v1/dashboard/stats",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
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
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
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

  const pending = myLeaves.filter(l => (l.status || "Pending") === "Pending").length;
  const approved = myLeaves.filter(l => l.status === "Approved").length;
  const rejected = myLeaves.filter(l => l.status === "Rejected").length;

  // Format time as HH:MM:SS IST
  const formatTime = (date) => {
    return date.toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour12: true });
  };

  const formatDateTime = (isoStr) => {
    if (!isoStr) return "--";
    return new Date(isoStr).toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour12: true });
  };

  const getStatusColor = (status) => {
    if (status === "Present") return { bg: "#d1fae5", text: "#065f46", border: "#10b981" };
    if (status === "Late") return { bg: "#fef3c7", text: "#92400e", border: "#f59e0b" };
    if (status === "Absent") return { bg: "#fee2e2", text: "#991b1b", border: "#ef4444" };
    return { bg: "#f3f4f6", text: "#374151", border: "#9ca3af" };
  };

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Welcome back, {user?.name || "Employee"} 👋
      </h2>

      {/* ✅ CHECK-IN / CHECK-OUT CARD */}
      <div style={{
        background: "linear-gradient(135deg, #1e3a5f 0%, #0f2544 100%)",
        borderRadius: "16px",
        padding: "24px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        border: "1px solid rgba(255,255,255,0.1)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          {/* Left: Clock */}
          <div>
            <p style={{ color: "#94a3b8", fontSize: "13px", marginBottom: "4px" }}>⏰ Current Time (IST)</p>
            <p style={{ color: "#ffffff", fontSize: "32px", fontWeight: "700", fontFamily: "monospace", letterSpacing: "2px" }}>
              {formatTime(currentTime)}
            </p>
            <p style={{ color: "#64748b", fontSize: "13px", marginTop: "4px" }}>
              {currentTime.toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>

          {/* Right: Status + Buttons */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "12px" }}>
            {/* Status Badge */}
            {todayStatus && todayStatus.status !== "Not Marked" ? (
              <div style={{
                padding: "6px 16px",
                borderRadius: "999px",
                background: getStatusColor(todayStatus.status).bg,
                color: getStatusColor(todayStatus.status).text,
                fontWeight: "700",
                fontSize: "14px",
                border: `2px solid ${getStatusColor(todayStatus.status).border}`
              }}>
                {todayStatus.status === "Present" && <span>✅ Present</span>}
                {todayStatus.status === "Late" && <span>⚠️ Late</span>}
                {todayStatus.status === "Absent" && <span>❌ Absent</span>}
              </div>
            ) : (
              <div style={{ padding: "6px 16px", borderRadius: "999px", background: "rgba(255,255,255,0.1)", color: "#94a3b8", fontSize: "14px" }}>
                🕐 Not checked in yet
              </div>
            )}

            {/* Check In / Check Out Buttons */}
            <div style={{ display: "flex", gap: "10px" }}>
              {!todayStatus?.checkInTime ? (
                <button
                  onClick={handleCheckIn}
                  disabled={attendanceLoading}
                  style={{
                    display: "flex", alignItems: "center", gap: "8px",
                    padding: "10px 24px", borderRadius: "10px",
                    background: attendanceLoading ? "#374151" : "linear-gradient(135deg, #10b981, #059669)",
                    color: "white", fontWeight: "700", fontSize: "15px",
                    border: "none", cursor: attendanceLoading ? "not-allowed" : "pointer",
                    boxShadow: "0 4px 15px rgba(16,185,129,0.4)",
                    transition: "all 0.2s"
                  }}
                >
                  <LogIn size={18} />
                  {attendanceLoading ? "Checking In..." : "Check In"}
                </button>
              ) : !todayStatus?.checkOutTime ? (
                <button
                  onClick={handleCheckOut}
                  disabled={attendanceLoading}
                  style={{
                    display: "flex", alignItems: "center", gap: "8px",
                    padding: "10px 24px", borderRadius: "10px",
                    background: attendanceLoading ? "#374151" : "linear-gradient(135deg, #ef4444, #dc2626)",
                    color: "white", fontWeight: "700", fontSize: "15px",
                    border: "none", cursor: attendanceLoading ? "not-allowed" : "pointer",
                    boxShadow: "0 4px 15px rgba(239,68,68,0.4)",
                    transition: "all 0.2s"
                  }}
                >
                  <LogOut size={18} />
                  {attendanceLoading ? "Checking Out..." : "Check Out"}
                </button>
              ) : (
                <div style={{ color: "#10b981", fontWeight: "600", fontSize: "14px" }}>✅ Day Complete</div>
              )}
            </div>
          </div>
        </div>

        {/* Check-in / Check-out time display */}
        {todayStatus?.checkInTime && (
          <div style={{
            marginTop: "16px", paddingTop: "16px",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            display: "flex", gap: "32px", flexWrap: "wrap"
          }}>
            <div>
              <p style={{ color: "#64748b", fontSize: "12px" }}>CHECK IN</p>
              <p style={{ color: "#10b981", fontSize: "16px", fontWeight: "700" }}>{formatDateTime(todayStatus.checkInTime)}</p>
            </div>
            {todayStatus?.checkOutTime && (
              <div>
                <p style={{ color: "#64748b", fontSize: "12px" }}>CHECK OUT</p>
                <p style={{ color: "#ef4444", fontSize: "16px", fontWeight: "700" }}>{formatDateTime(todayStatus.checkOutTime)}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard title="Total Employees" value={stats.totalEmployees} icon={<Users size={38} />} colorClass="bg-teal-600" />
        <StatCard title="Departments" value={stats.totalDepartments} icon={<Building2 size={38} />} colorClass="bg-blue-600" />
      </div>

      {/* ==== MY LEAVE STATUS BOXES ==== */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-sm p-5">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">My Leave Status</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-lg">
            <p className="text-sm text-yellow-700">Pending</p>
            <p className="text-2xl font-bold text-yellow-800">{pending}</p>
          </div>
          <div className="bg-green-100 border-l-4 border-green-500 p-4 rounded-lg">
            <p className="text-sm text-green-700">Approved</p>
            <p className="text-2xl font-bold text-green-800">{approved}</p>
          </div>
          <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded-lg">
            <p className="text-sm text-red-700">Rejected</p>
            <p className="text-2xl font-bold text-red-800">{rejected}</p>
          </div>
        </div>
      </div>

      {/* ==== Attendance + Task Management Row ==== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Chart */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-sm p-5">
          <h3 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">Attendance</h3>
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
                <span className="text-gray-700 dark:text-gray-400 text-sm">
                  {item.name} ({item.value})
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Task Management Panel */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-sm p-5">
          <h3 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">My Tasks</h3>
          {myTasks.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm">No tasks assigned yet.</p>
          ) : (
            <div className="space-y-3">
              {myTasks.map((task, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg shadow flex justify-between items-center
                    ${task.status === "Pending"
                      ? "bg-yellow-100 border-l-4 border-yellow-500"
                      : task.status === "In Progress"
                        ? "bg-blue-100 border-l-4 border-blue-500"
                        : "bg-green-100 border-l-4 border-green-500"
                    }`}
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{task.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{task.description}</p>
                  </div>
                  <span
                    className={`text-sm font-semibold px-2 py-1 rounded-full 
                      ${task.status === "Pending"
                        ? "bg-yellow-200 text-yellow-800"
                        : task.status === "In Progress"
                          ? "bg-blue-200 text-blue-800"
                          : "bg-green-200 text-green-800"
                      }`}
                  >
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Rewards Section */}
      <div className="col-span-2 bg-white rounded-xl shadow p-5">
        <h3 className="font-semibold mb-5 text-gray-700 text-lg">Recent Rewards</h3>
        <div className="space-y-4">
          {stats.rewards.map((reward, index) => (
            <div
              key={index}
              className="relative w-full p-5 rounded-xl shadow-md overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300 flex justify-between items-center"
              style={{
                background: `linear-gradient(135deg, #6e8efb ${index * 20}%, #a777e3 100%)`,
              }}
            >
              <p className="text-white font-semibold text-lg">{reward.employeeName}</p>
              <p className="text-purple-200 text-sm">{reward.rewardType}</p>
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity rounded-xl"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


/* --------------------------- MAIN PAGE --------------------------- */
export default function DashboardPage({ user }) {
  if (!user) return <p>Loading...</p>;
  return user.role === "admin" ? <AdminDashboard user={user} /> : <EmployeeDashboard user={user} />;
}