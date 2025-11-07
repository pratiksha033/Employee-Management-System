import React, { useState, useEffect } from "react";
import { Check, X, Clock, Plus, Eye } from "lucide-react";
import DataTable from "react-data-table-component";

const API_BASE_URL = "http://localhost:4000/api/v1/leave";

const getAuthToken = () => localStorage.getItem("authToken");

const calculateDays = (startDate, endDate) => {
  if (!startDate || !endDate) return "N/A";
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1;
};

const StatusBadge = ({ status }) => {
  let colorClass = "";
  let Icon = Clock;
  switch (status) {
    case "Approved":
      colorClass = "bg-green-100 text-green-800";
      Icon = Check;
      break;
    case "Rejected":
      colorClass = "bg-red-100 text-red-800";
      Icon = X;
      break;
    default:
      colorClass = "bg-yellow-100 text-yellow-800";
      Icon = Clock;
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      <Icon size={14} className="mr-1" />
      {status}
    </span>
  );
};

export default function LeavePage({ user }) {
  const [leaves, setLeaves] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newLeave, setNewLeave] = useState({
    startDate: "",
    endDate: "",
    leaveType: "",
    reason: "",
  });
  const [filter, setFilter] = useState("All");
  const [searchId, setSearchId] = useState("");

  const isEmployee = user?.role === "employee";
  const isAdmin = user?.role === "admin";

  // --- Fetch Leaves ---
  const fetchLeaves = async () => {
    if (!user) return;
    setIsLoading(true);
    const endpoint = isAdmin ? "/all" : "/my-leaves";

    try {
      const token = getAuthToken();
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch leaves");
      setLeaves(data.leaves || []);
    } catch (err) {
      console.error("Fetch Leaves Error:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [user]);

  // --- Apply for Leave ---
  const handleApplyLeave = async () => {
    const { startDate, endDate, reason, leaveType } = newLeave;
    if (!startDate || !endDate || !reason || !leaveType) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const token = getAuthToken();
      const res = await fetch(`${API_BASE_URL}/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...newLeave, department: user.department }), // ✅ Include department
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to apply for leave");

      alert("Leave applied successfully!");
      setNewLeave({ startDate: "", endDate: "", reason: "", leaveType: "" });
      setShowModal(false);
      fetchLeaves();
    } catch (err) {
      console.error("Apply Leave Error:", err.message);
    }
  };

  // --- Update Leave Status (Admin only) ---
  const handleUpdateStatus = async (id, status) => {
    if (!isAdmin) return;

    try {
      const token = getAuthToken();
      const res = await fetch(`${API_BASE_URL}/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `Failed to update leave status`);

      console.log(`Leave ${status} successfully!`);
      fetchLeaves();
    } catch (err) {
      console.error("Update Leave Status Error:", err.message);
    }
  };

  // --- Filter logic for Admin ---
  const filteredLeaves = leaves.filter((leave) => {
    const matchesStatus = filter === "All" || leave.status === filter;
    const matchesSearch =
      !searchId ||
      (leave.employeeId &&
        leave.employeeId.empId &&
        leave.employeeId.empId.toLowerCase().includes(searchId.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  // --- Table Columns ---
  const columns = [
    { name: "S.No", selector: (row, i) => i + 1, width: "80px" },
    ...(isAdmin
      ? [
          {
            name: "Emp ID",
            selector: (row) => row.employeeId?.empId || "N/A",
          },
          {
            name: "Name",
            selector: (row) => row.employeeId?.name || "N/A",
          },
        ]
      : []),
    { name: "Leave Type", selector: (row) => row.leaveType || "N/A" },
    { name: "Department", selector: (row) => row.employeeId?.department || row.department || "N/A" },
    { name: "Days", selector: (row) => calculateDays(row.startDate, row.endDate) },
    {
      name: "Status",
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex gap-2">
          {isAdmin && row.status === "Pending" && (
            <>
              <button
                onClick={() => handleUpdateStatus(row._id, "Approved")}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-xs"
                title="Approve"
              >
                <Check size={14} />
              </button>
              <button
                onClick={() => handleUpdateStatus(row._id, "Rejected")}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-xs"
                title="Reject"
              >
                <X size={14} />
              </button>
            </>
          )}
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-xs"
            title="View"
          >
            <Eye size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">
          {isAdmin ? "Manage Leaves" : "My Leave Applications"}
        </h2>
        {isEmployee && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg shadow flex items-center"
          >
            <Plus size={20} className="mr-1" />
            Apply for Leave
          </button>
        )}
      </div>

      {/* Admin Filters */}
      {isAdmin && (
        <div className="mb-4 flex items-center justify-between">
          <input
            type="text"
            placeholder="Search By Emp ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-lg w-1/4"
          />
          <div className="flex gap-2">
            {["All", "Pending", "Approved", "Rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg ${
                  filter === status
                    ? "bg-teal-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <DataTable
          columns={columns}
          data={isAdmin ? filteredLeaves : leaves}
          progressPending={isLoading}
          pagination
          highlightOnHover
        />
      </div>

      {/* Modal for Apply Leave */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Apply for Leave</h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={newLeave.startDate}
                  onChange={(e) => setNewLeave({ ...newLeave, startDate: e.target.value })}
                  className="w-full border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={newLeave.endDate}
                  onChange={(e) => setNewLeave({ ...newLeave, endDate: e.target.value })}
                  className="w-full border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
              <select
                value={newLeave.leaveType}
                onChange={(e) => setNewLeave({ ...newLeave, leaveType: e.target.value })}
                className="w-full border-gray-300 rounded-lg"
              >
                <option value="">Select Leave Type</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Casual Leave">Casual Leave</option>
                <option value="Annual Leave">Annual Leave</option>
                <option value="Unpaid Leave">Unpaid Leave</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
              <textarea
                value={newLeave.reason}
                onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
                className="w-full border-gray-300 rounded-lg"
                rows="3"
                placeholder="Enter reason for leave"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-200 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyLeave}
                className="bg-teal-600 text-white px-4 py-2 rounded-lg"
              >
                Submit Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
