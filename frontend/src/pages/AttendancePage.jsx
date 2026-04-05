import React, { useEffect, useState } from "react";
import { format } from "date-fns";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api/v1";

export default function AttendancePage({ user }) {
  const [employees, setEmployees] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [attendance, setAttendance] = useState({});
  const [myRecords, setMyRecords] = useState([]);

  const token = localStorage.getItem("authToken");

  /* ================= ADMIN: FETCH EMPLOYEES ================= */
  useEffect(() => {
    if (user?.role !== "admin") return;
    const fetchEmployees = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/employee/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setEmployees(data.success ? data.employees : []);
      } catch (err) {
        console.error("Error fetching employees:", err);
      }
    };
    fetchEmployees();
  }, [user, token]);

  /* ================= ADMIN: FETCH ATTENDANCE BY DATE ================= */
  useEffect(() => {
    if (user?.role !== "admin") return;
    const fetchAttendance = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/attendance/${selectedDate}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          const map = {};
          (data.records || []).forEach((r) => {
            const id = r.employeeId?._id || r.employeeId;
            map[id] = {
              status: r.status,
              checkInTime: r.checkInTime,
              checkOutTime: r.checkOutTime,
            };
          });
          setAttendance(map);
        } else {
          setAttendance({});
        }
      } catch (err) {
        console.error("Error fetching attendance:", err);
      }
    };
    fetchAttendance();
  }, [selectedDate, token, user]);

  /* ================= EMPLOYEE: FETCH MY ATTENDANCE ================= */
  useEffect(() => {
    if (user?.role !== "employee") return;
    const fetchMyAttendance = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/attendance/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setMyRecords(data.success ? data.attendance || [] : []);
      } catch (err) {
        console.error("Error fetching my attendance:", err);
      }
    };
    fetchMyAttendance();
  }, [token, user]);

  const fmt = (isoStr) => {
    if (!isoStr) return "--";
    return new Date(isoStr).toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour12: true,
    });
  };

  /* ─────────────────── STATUS CONFIG ─────────────────── */
  const statusConfig = {
    Present: {
      bg: "bg-emerald-500/20",
      text: "text-emerald-400",
      border: "border-emerald-500/40",
      dot: "bg-emerald-400",
    },
    Late: {
      bg: "bg-amber-500/20",
      text: "text-amber-400",
      border: "border-amber-500/40",
      dot: "bg-amber-400",
    },
    Absent: {
      bg: "bg-red-500/20",
      text: "text-red-400",
      border: "border-red-500/40",
      dot: "bg-red-400",
    },
    "Not Marked": {
      bg: "bg-gray-500/20",
      text: "text-gray-400",
      border: "border-gray-500/40",
      dot: "bg-gray-400",
    },
  };

  /* ═══════════════════ EMPLOYEE VIEW ═══════════════════ */
  if (user?.role === "employee") {
    const myRecord = myRecords.find((r) => r.date === selectedDate) || {};
    const myStatus = myRecord.status || "Not Marked";
    const sc = statusConfig[myStatus] || statusConfig["Not Marked"];

    const presentCount = myRecords.filter((r) => r.status === "Present").length;
    const lateCount = myRecords.filter((r) => r.status === "Late").length;
    const absentCount = myRecords.filter((r) => r.status === "Absent").length;

    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
            My Attendance
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            Track your daily attendance record
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Present", count: presentCount, color: "from-emerald-600 to-emerald-400", icon: "✓" },
            { label: "Late", count: lateCount, color: "from-amber-600 to-amber-400", icon: "⏰" },
            { label: "Absent", count: absentCount, color: "from-red-600 to-red-400", icon: "✗" },
          ].map(({ label, count, color, icon }) => (
            <div
              key={label}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col gap-1 hover:border-gray-700 transition-all duration-300"
            >
              <span className="text-2xl">{icon}</span>
              <span
                className={`text-3xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}
              >
                {count}
              </span>
              <span className="text-gray-400 text-sm font-medium">
                {label} Days
              </span>
            </div>
          ))}
        </div>

        {/* Date Picker + Status Card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Date Picker */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Select Date
            </h2>
            <input
              type="date"
              className="w-full bg-gray-800 text-gray-100 border border-gray-700 p-3 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          {/* Status Card */}
          <div
            className={`rounded-2xl p-6 border ${sc.border} ${sc.bg} flex flex-col justify-between`}
          >
            <div>
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Status for{" "}
                {format(new Date(selectedDate + "T00:00:00"), "dd MMM yyyy")}
              </h2>
              <span
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${sc.bg} ${sc.text} border ${sc.border}`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${sc.dot} animate-pulse`}
                />
                {myStatus}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-gray-900/50 rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-1">Check In</p>
                <p className="text-emerald-400 font-semibold">
                  {fmt(myRecord.checkInTime)}
                </p>
              </div>
              <div className="bg-gray-900/50 rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-1">Check Out</p>
                <p className="text-red-400 font-semibold">
                  {fmt(myRecord.checkOutTime)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Strip */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-8 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-white text-lg">{user.name}</p>
            <p className="text-gray-400 text-sm">
              {user.department?.name || user.email || "Employee"}
            </p>
          </div>
        </div>

        {/* Attendance History */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800">
            <h2 className="text-base font-semibold text-white">
              Attendance History
            </h2>
            <p className="text-gray-500 text-xs mt-0.5">
              All your attendance records
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-800/50 text-gray-400 text-xs uppercase tracking-wider">
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Check In</th>
                  <th className="px-6 py-3 text-left">Check Out</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {myRecords.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-10 text-center text-gray-500"
                    >
                      No attendance records found.
                    </td>
                  </tr>
                ) : (
                  myRecords.map((r) => {
                    const s =
                      statusConfig[r.status] || statusConfig["Not Marked"];
                    return (
                      <tr
                        key={r._id}
                        className={`hover:bg-gray-800/40 transition-colors ${r.date === selectedDate
                          ? "bg-teal-900/10 border-l-2 border-teal-500"
                          : ""
                          }`}
                      >
                        <td className="px-6 py-4 text-sm font-medium text-gray-200">
                          {r.date}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${s.bg} ${s.text} border ${s.border}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${s.dot}`}
                            />
                            {r.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-emerald-400">
                          {fmt(r.checkInTime)}
                        </td>
                        <td className="px-6 py-4 text-sm text-red-400">
                          {fmt(r.checkOutTime)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  /* ═══════════════════ ADMIN VIEW ═══════════════════ */
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
          Attendance Management
        </h1>
        <p className="text-gray-400 mt-1 text-sm">
          View and manage daily attendance records
        </p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-6 flex items-center gap-4">
        <label className="font-semibold text-gray-300 text-sm uppercase tracking-wider whitespace-nowrap">
          Select Date:
        </label>
        <input
          type="date"
          className="bg-gray-800 text-gray-100 border border-gray-700 p-2.5 rounded-xl focus:outline-none focus:border-teal-500 transition-colors"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-800/50 text-gray-400 text-xs uppercase tracking-wider">
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Department</th>
                <th className="px-6 py-3 text-left">Check In</th>
                <th className="px-6 py-3 text-left">Check Out</th>
                <th className="px-6 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {employees.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    No employee records found.
                  </td>
                </tr>
              ) : (
                employees.map((emp) => {
                  const userId = emp.user?._id || emp.user;
                  const rec = attendance[userId] || {};
                  const adminStatusColors = {
                    Present:
                      "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
                    Late: "bg-amber-500/20 text-amber-400 border-amber-500/40",
                    Absent: "bg-red-500/20 text-red-400 border-red-500/40",
                  };
                  const asc =
                    adminStatusColors[rec.status] ||
                    "bg-gray-700/30 text-gray-400 border-gray-600/40";
                  return (
                    <tr
                      key={emp._id}
                      className="hover:bg-gray-800/40 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-200">
                        {emp.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {emp.department?.name || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-emerald-400">
                        {fmt(rec.checkInTime)}
                      </td>
                      <td className="px-6 py-4 text-sm text-red-400">
                        {fmt(rec.checkOutTime)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${asc}`}
                        >
                          {rec.status || "Not Marked"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
