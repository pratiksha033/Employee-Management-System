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

  /* ================= FETCH ATTENDANCE ================= */
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/attendance/${selectedDate}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        if (data.success) {
          // Convert records array → map: { employeeId: { status, checkInTime, checkOutTime } }
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
  }, [selectedDate, token]);

  const fmt = (isoStr) => {
    if (!isoStr) return "--";
    return new Date(isoStr).toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour12: true,
    });
  };

  /* ================= EMPLOYEE VIEW ================= */
  if (user?.role === "employee") {
    const myRecord = attendance[user._id] || {};
    const myStatus = myRecord.status || "Not Marked";

    return (
      <div className="p-6 bg-gray-900 min-h-screen text-gray-100 rounded-xl">
        <h1 className="text-3xl font-bold mb-6 text-teal-400">
          My Attendance
        </h1>

        <div className="mb-6 flex items-center gap-4">
          <label className="font-semibold text-gray-300 text-lg">
            Select Date:
          </label>
          <input
            type="date"
            className="bg-gray-800 text-gray-100 border border-gray-700 p-2 rounded-lg"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        <div className="bg-gray-800 p-6 rounded-xl shadow-md max-w-md">
          <p className="text-lg mb-2">
            <span className="font-semibold">Name:</span> {user.name}
          </p>

          <p className="text-lg mb-2">
            <span className="font-semibold">Department:</span>{" "}
            {user.department?.name || "N/A"}
          </p>

          <p className="text-lg">
            <span className="font-semibold">Status:</span>{" "}
            <span
              className={`px-3 py-1 rounded-lg ml-2 ${myStatus === "Present"
                ? "bg-green-600"
                : myStatus === "Absent"
                  ? "bg-red-600"
                  : "bg-gray-600"
                }`}
            >
              {myStatus}
            </span>
          </p>
        </div>
      </div>
    );
  }

  /* ================= ADMIN VIEW (UNCHANGED) ================= */
  return (
    <div className="p-6 bg-gray-900 min-h-screen text-gray-100 rounded-xl">
      <h1 className="text-3xl font-bold mb-6 text-teal-400">
        Attendance Management
      </h1>


      <div className="mb-6 flex items-center gap-4">
        <label className="font-semibold text-gray-300 text-lg">
          Select Date:
        </label>
        <input
          type="date"
          className="bg-gray-800 text-gray-100 border border-gray-700 p-2 rounded-lg"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-700 shadow-lg">
        <table className="w-full border-collapse">
          <thead className="bg-gray-800 text-gray-300">
            <tr>
              <th className="border border-gray-700 p-3">Name</th>
              <th className="border border-gray-700 p-3">Department</th>
              <th className="border border-gray-700 p-3">Check In</th>
              <th className="border border-gray-700 p-3">Check Out</th>
              <th className="border border-gray-700 p-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((emp) => {
              const userId = emp.user?._id || emp.user;
              const rec = attendance[userId] || {};
              return (
                <tr key={emp._id} className="hover:bg-gray-800">
                  <td className="border border-gray-800 p-3">{emp.name}</td>
                  <td className="border border-gray-800 p-3">
                    {emp.department?.name || "N/A"}
                  </td>

                  <td className="border border-gray-800 p-3 text-center text-green-400">
                    {fmt(rec.checkInTime)}
                  </td>

                  <td className="border border-gray-800 p-3 text-center text-red-400">
                    {fmt(rec.checkOutTime)}
                  </td>

                  <td className="border border-gray-800 p-3 text-center">
                    <span
                      className={`px-3 py-1 rounded-lg font-semibold ${rec.status === "Present"
                        ? "bg-green-600"
                        : rec.status === "Late"
                          ? "bg-yellow-600"
                          : rec.status === "Absent"
                            ? "bg-red-600"
                            : "bg-gray-700"
                        }`}
                    >
                      {rec.status || "Not Marked"}
                    </span>
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
