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

  // ---------------- FETCH EMPLOYEES ----------------
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch(`${API_BASE_URL}/employee/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (data.success) {
          setEmployees(data.employees);
        } else {
          setEmployees([]);
        }
      } catch (err) {
        console.error("Error fetching employees:", err);
      }
    };
    fetchEmployees();
  }, []);

  // ---------------- FETCH ATTENDANCE ----------------
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch(`${API_BASE_URL}/attendance/${selectedDate}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (data.success) {
          setAttendance(data.attendance);
        } else {
          setAttendance({});
        }
      } catch (err) {
        console.error("Error fetching attendance:", err);
      }
    };
    fetchAttendance();
  }, [selectedDate]);

  // ---------------- MARK ATTENDANCE ----------------
  const markAttendance = async (employeeId, status) => {
    try {
      const token = localStorage.getItem("authToken");
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

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-gray-100 rounded-xl">
      <h1 className="text-3xl font-bold mb-6 text-teal-400">
        Attendance Management
      </h1>

      {/* Date Picker */}
      <div className="mb-6 flex items-center gap-4">
        <label className="font-semibold text-gray-300 text-lg">
          Select Date:
        </label>
        <input
          type="date"
          className="bg-gray-800 text-gray-100 border border-gray-700 p-2 rounded-lg focus:ring-2 focus:ring-teal-500"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-700 shadow-lg">
        <table className="w-full border-collapse">
          <thead className="bg-gray-800 text-gray-300">
            <tr>
              <th className="border border-gray-700 p-3 text-left">Employee ID</th>
              <th className="border border-gray-700 p-3 text-left">Name</th>
              <th className="border border-gray-700 p-3 text-left">Department</th>
              <th className="border border-gray-700 p-3 text-center">Status</th>
              <th className="border border-gray-700 p-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((emp) => (
              <tr
                key={emp._id}
                className="bg-gray-900 hover:bg-gray-800 transition"
              >
                <td className="border border-gray-800 p-3">{emp._id}</td>

                <td className="border border-gray-800 p-3">{emp.name}</td>

                <td className="border border-gray-800 p-3">
                  {emp.department?.name || "N/A"}
                </td>

                <td className="border border-gray-800 p-3 text-center font-semibold">
                  <span
                    className={`px-3 py-1 rounded-lg ${
                      attendance[emp._id] === "Present"
                        ? "bg-green-600 text-white"
                        : attendance[emp._id] === "Absent"
                        ? "bg-red-600 text-white"
                        : "bg-gray-700 text-gray-300"
                    }`}
                  >
                    {attendance[emp._id] || "Not Marked"}
                  </span>
                </td>

                <td className="border border-gray-800 p-3 text-center">
                  <button
                    onClick={() => markAttendance(emp._id, "Present")}
                    className={`px-4 py-1 rounded-lg mr-2 transition ${
                      attendance[emp._id] === "Present"
                        ? "bg-green-600 text-white"
                        : "bg-green-500 hover:bg-green-600 text-white"
                    }`}
                  >
                    Present
                  </button>

                  <button
                    onClick={() => markAttendance(emp._id, "Absent")}
                    className={`px-4 py-1 rounded-lg transition ${
                      attendance[emp._id] === "Absent"
                        ? "bg-red-600 text-white"
                        : "bg-red-500 hover:bg-red-600 text-white"
                    }`}
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
