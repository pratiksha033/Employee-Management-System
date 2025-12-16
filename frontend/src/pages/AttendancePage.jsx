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
        setAttendance(data.success ? data.attendance : {});
      } catch (err) {
        console.error("Error fetching attendance:", err);
      }
    };

    fetchAttendance();
  }, [selectedDate, token]);

  /* ================= ADMIN: MARK ATTENDANCE ================= */
  const markAttendance = async (employeeId, status) => {
    try {
      const res = await fetch(`${API_BASE_URL}/attendance/mark`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          employeeId,
          date: selectedDate,
          status,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setAttendance((prev) => ({
          ...prev,
          [employeeId]: status,
        }));
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Error marking attendance:", err);
    }
  };

  /* ================= EMPLOYEE VIEW ================= */
  if (user?.role === "employee") {
    console.log("USER:", user);
console.log("employeeId:", user._id);
console.log("attendance:", attendance);
    const myStatus = attendance[user._id] || "Not Marked";

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
              className={`px-3 py-1 rounded-lg ml-2 ${
                myStatus === "Present"
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
              <th className="border border-gray-700 p-3">Employee ID</th>
              <th className="border border-gray-700 p-3">Name</th>
              <th className="border border-gray-700 p-3">Department</th>
              <th className="border border-gray-700 p-3">Status</th>
              <th className="border border-gray-700 p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((emp) => (
              <tr key={emp._id} className="hover:bg-gray-800">
                <td className="border border-gray-800 p-3">{emp._id}</td>
                <td className="border border-gray-800 p-3">{emp.name}</td>
                <td className="border border-gray-800 p-3">
                  {emp.department?.name || "N/A"}
                </td>

                <td className="border border-gray-800 p-3 text-center">
                  <span
                    className={`px-3 py-1 rounded-lg ${
                      attendance[emp._id] === "Present"
                        ? "bg-green-600"
                        : attendance[emp._id] === "Absent"
                        ? "bg-red-600"
                        : "bg-gray-700"
                    }`}
                  >
                    {attendance[emp._id] || "Not Marked"}
                  </span>
                </td>

                <td className="border border-gray-800 p-3 text-center">
                  <button
                    onClick={() => markAttendance(emp._id, "Present")}
                    className="bg-green-500 px-3 py-1 rounded-lg mr-2"
                  >
                    Present
                  </button>
                  <button
                    onClick={() => markAttendance(emp._id, "Absent")}
                    className="bg-red-500 px-3 py-1 rounded-lg"
                  >
                    Absent
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
