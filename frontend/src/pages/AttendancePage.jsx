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

  useEffect(() => {
    if (user?.role !== "admin") return;

    const fetchEmployees = async () => {
      const res = await fetch(`${API_BASE_URL}/employee/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setEmployees(data.success ? data.employees : []);
    };

    fetchEmployees();
  }, [user, token]);

  useEffect(() => {
    if (user?.role !== "admin") return;

    const fetchAttendance = async () => {
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
    };

    fetchAttendance();
  }, [selectedDate, token, user]);

  useEffect(() => {
    if (user?.role !== "employee") return;

    const fetchMyAttendance = async () => {
      const res = await fetch(`${API_BASE_URL}/attendance/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setMyRecords(data.success ? data.attendance || [] : []);
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

  /* ================= EMPLOYEE VIEW ================= */

  if (user?.role === "employee") {
    const myRecord = myRecords.find((r) => r.date === selectedDate) || {};

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 p-6 transition-colors">

        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          My Attendance
        </h1>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 mb-6">

          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Select Date
          </label>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="mt-2 w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          />

          <div className="grid grid-cols-2 gap-4 mt-6">

            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Check In
              </p>
              <p className="text-lg font-semibold text-green-500">
                {fmt(myRecord.checkInTime)}
              </p>
            </div>

            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Check Out
              </p>
              <p className="text-lg font-semibold text-red-500">
                {fmt(myRecord.checkOutTime)}
              </p>
            </div>

          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">

          <table className="w-full">

            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm uppercase">
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Check In</th>
                <th className="px-6 py-3 text-left">Check Out</th>
              </tr>
            </thead>

            <tbody>

              {myRecords.map((r) => (
                <tr
                  key={r._id}
                  className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <td className="px-6 py-4 text-gray-800 dark:text-gray-200">
                    {r.date}
                  </td>

                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                    {r.status}
                  </td>

                  <td className="px-6 py-4 text-green-500">
                    {fmt(r.checkInTime)}
                  </td>

                  <td className="px-6 py-4 text-red-500">
                    {fmt(r.checkOutTime)}
                  </td>
                </tr>
              ))}

            </tbody>

          </table>
        </div>
      </div>
    );
  }

  /* ================= ADMIN VIEW ================= */

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 p-6 transition-colors">

      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Attendance Management
      </h1>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 mb-6 flex items-center gap-4">

        <label className="font-semibold text-gray-700 dark:text-gray-300">
          Select Date
        </label>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
        />

      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">

        <table className="w-full">

          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm uppercase">
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Department</th>
              <th className="px-6 py-3 text-left">Check In</th>
              <th className="px-6 py-3 text-left">Check Out</th>
              <th className="px-6 py-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody>

            {employees.map((emp) => {
              const userId = emp.user?._id || emp.user;
              const rec = attendance[userId] || {};

              return (
                <tr
                  key={emp._id}
                  className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <td className="px-6 py-4 text-gray-800 dark:text-gray-200">
                    {emp.name}
                  </td>

                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                    {emp.department?.name || "N/A"}
                  </td>

                  <td className="px-6 py-4 text-green-500">
                    {fmt(rec.checkInTime)}
                  </td>

                  <td className="px-6 py-4 text-red-500">
                    {fmt(rec.checkOutTime)}
                  </td>

                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                    {rec.status || "Not Marked"}
                  </td>
                </tr>
              );
            })}

          </tbody>

        </table>
      </div>
    </div>
  );
}