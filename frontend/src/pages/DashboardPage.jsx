import React, { useState, useEffect } from "react";
import {
  Users,
  Building2,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

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

/* -----------------------------------------------------------
                    ADMIN DASHBOARD
----------------------------------------------------------- */
const AdminDashboard = ({ user }) => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
        rewards: [
          { employeeName: "John Doe", rewardName: "Employee of the Month" },
          { employeeName: "Jane Smith", rewardName: "Best Innovator" },
          { employeeName: "Alice Johnson", rewardName: "Top Performer" },
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

  const leaveData = [
    { name: "Pending", value: stats.pendingLeaves },
    { name: "Approved", value: stats.approvedLeaves },
    { name: "Rejected", value: stats.rejectedLeaves },
  ];

  const attendanceData = [
    {
      name: "Present",
      value:
        stats.totalEmployees -
        (stats.pendingLeaves + stats.approvedLeaves + stats.rejectedLeaves),
    },
    {
      name: "Absent",
      value: 0,
    },
    {
      name: "Leave",
      value: stats.approvedLeaves + stats.pendingLeaves,
    },
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
        {/* Leave Semi-Circle Gauge Chart */}
        <div className="bg-white rounded-xl shadow p-5">
          <h3 className="font-semibold mb-3 text-gray-700">Leave Status</h3>

          <div className="flex flex-col items-center">
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

            {/* Center Summary */}
            <div className="text-center mt-[-40px]">
              <p className="text-lg font-semibold text-gray-700">
                Total Leaves:{" "}
                {stats.pendingLeaves +
                  stats.approvedLeaves +
                  stats.rejectedLeaves}
              </p>
            </div>

            {/* Legend */}
            <div className="flex gap-6 mt-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ background: COLORS[0] }}
                ></div>
                <span className="text-gray-600 text-sm">
                  Pending ({stats.pendingLeaves})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ background: COLORS[1] }}
                ></div>
                <span className="text-gray-600 text-sm">
                  Approved ({stats.approvedLeaves})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ background: COLORS[2] }}
                ></div>
                <span className="text-gray-600 text-sm">
                  Rejected ({stats.rejectedLeaves})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Donut Chart */}
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
                  <Cell key={`cell-${index}`} fill={ATTENDANCE_COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="flex gap-6 mt-3 justify-center">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ background: ATTENDANCE_COLORS[0] }}
              ></div>
              <span className="text-gray-600 text-sm">
                Present ({attendanceData[0].value})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ background: ATTENDANCE_COLORS[1] }}
              ></div>
              <span className="text-gray-600 text-sm">
                Absent ({attendanceData[1].value})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ background: ATTENDANCE_COLORS[2] }}
              ></div>
              <span className="text-gray-600 text-sm">
                Leave ({attendanceData[2].value})
              </span>
            </div>
          </div>
        </div>

        {/* Rewards Cards */}
        <div className="col-span-2 bg-white rounded-xl shadow p-5">
          <h3 className="font-semibold mb-3 text-gray-700">Recent Rewards</h3>
          <div className="flex flex-col gap-4">
            {stats.rewards.map((reward, index) => (
              <div
                key={index}
                className="flex flex-row justify-between p-3 pr-20 bg-gray-50 rounded-lg"
              >
                <p className="font-medium text-gray-800">{reward.employeeName}</p>
                <p className="text-sm text-gray-500">{reward.rewardName}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Department Bar Chart */}
      <div className="bg-white rounded-xl shadow p-5">
        <h3 className="font-semibold mb-3 text-gray-700">
          Employees per Department
        </h3>

        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={stats.departmentCounts}>
            <XAxis dataKey="departmentName" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#a16bc7ff" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

/* -----------------------------------------------------------
                    EMPLOYEE DASHBOARD
----------------------------------------------------------- */
const EmployeeDashboard = ({ user }) => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
        rewards: [
          { employeeName: "John Doe", rewardName: "Employee of the Month" },
          { employeeName: "Jane Smith", rewardName: "Best Innovator" },
          { employeeName: "Alice Johnson", rewardName: "Top Performer" },
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

  const attendanceData = [
    {
      name: "Present",
      value:
        stats.totalEmployees -
        (stats.pendingLeaves + stats.approvedLeaves + stats.rejectedLeaves),
    },
    {
      name: "Absent",
      value: 0,
    },
    {
      name: "Leave",
      value: stats.approvedLeaves + stats.pendingLeaves,
    },
  ];

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">
        Welcome back, {user?.name || "Employee"} 👋
      </h2>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard
          title="Total Employees"
          value={stats.totalEmployees}
          icon={<Users size={38} />}
          colorClass="bg-teal-600"
        />
        <StatCard
          title="Departments"
          value={stats.totalDepartments}
          icon={<Building2 size={38} />}
          colorClass="bg-blue-600"
        />
      </div>

      {/* Attendance Donut Chart */}
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
                <Cell key={`cell-${index}`} fill={ATTENDANCE_COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="flex gap-6 mt-3 justify-center">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ background: ATTENDANCE_COLORS[0] }}
            ></div>
            <span className="text-gray-600 text-sm">
              Present ({attendanceData[0].value})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ background: ATTENDANCE_COLORS[1] }}
            ></div>
            <span className="text-gray-600 text-sm">
              Absent ({attendanceData[1].value})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ background: ATTENDANCE_COLORS[2] }}
            ></div>
            <span className="text-gray-600 text-sm">
              Leave ({attendanceData[2].value})
            </span>
          </div>
        </div>
      </div>

      {/* Rewards Cards */}
      <div className="bg-white rounded-xl shadow p-5">
        <h3 className="font-semibold mb-3 text-gray-700">Recent Rewards</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.rewards.map((reward, index) => (
            <div
              key={index}
              className="flex flex-col p-3 bg-gray-50 rounded-lg"
            >
              <p className="font-medium text-gray-800">{reward.employeeName}</p>
              <p className="text-sm text-gray-500">{reward.rewardName}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Department Chart */}
      <div className="bg-white rounded-xl shadow p-5">
        <h3 className="font-semibold mb-3 text-gray-700">
          Employees per Department
        </h3>

        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={stats.departmentCounts}>
            <XAxis dataKey="departmentName" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#FF8042" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

/* -----------------------------------------------------------
                    MAIN PAGE
----------------------------------------------------------- */
export default function DashboardPage({ user }) {
  if (!user) return <p>Loading...</p>;
  return user.role === "admin" ? (
    <AdminDashboard user={user} />
  ) : (
    <EmployeeDashboard user={user} />
  );
}