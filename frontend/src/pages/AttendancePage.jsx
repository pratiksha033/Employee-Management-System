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

  // ✅ Fetch all employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch(`${API_BASE_URL}/employee/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setEmployees(data.employees);
      } catch (err) {
        console.error("Error fetching employees:", err);
      }
    };
    fetchEmployees();
  }, []);

  // ✅ Fetch attendance for selected date
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch(
          `${API_BASE_URL}/attendance/${selectedDate}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        if (data.success) setAttendance(data.attendance);
        else setAttendance({});
      } catch (err) {
        console.error("Error fetching attendance:", err);
      }
    };
    fetchAttendance();
  }, [selectedDate]);

  // ✅ Mark attendance (present/absent)
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
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold text-gray-700 mb-4">
        Attendance Management
      </h1>

      <div className="mb-4 flex items-center gap-3">
        <label className="font-semibold text-gray-700">Select Date:</label>
        <input
          type="date"
          className="border p-2 rounded-md"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      <table className="w-full border-collapse border border-gray-300 text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2 text-left">Employee ID</th>
            <th className="border p-2 text-left">Name</th>
            <th className="border p-2 text-left">Department</th>
            <th className="border p-2 text-center">Status</th>
            <th className="border p-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp._id} className="hover:bg-gray-50">
              <td className="border p-2">{emp._id}</td>
              <td className="border p-2">{emp.name}</td>
              <td className="border p-2">{emp.department}</td>
              <td className="border p-2 text-center font-semibold">
                {attendance[emp._id] || "Not Marked"}
              </td>
              <td className="border p-2 text-center">
                <button
                  onClick={() => markAttendance(emp._id, "Present")}
                  className={`px-3 py-1 rounded-md text-white ${
                    attendance[emp._id] === "Present"
                      ? "bg-green-500"
                      : "bg-green-400 hover:bg-green-500"
                  }`}
                >
                  Present
                </button>
                <button
                  onClick={() => markAttendance(emp._id, "Absent")}
                  className={`px-3 py-1 rounded-md text-white ml-2 ${
                    attendance[emp._id] === "Absent"
                      ? "bg-red-500"
                      : "bg-red-400 hover:bg-red-500"
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
  );
}
