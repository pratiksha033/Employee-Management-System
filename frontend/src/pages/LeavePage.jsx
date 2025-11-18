import React, { useState, useEffect } from "react";
import { Check, X, Clock, Plus, Eye } from "lucide-react";
import DataTable from "react-data-table-component";

const API_BASE_URL = "http://localhost:4000/api/v1/leave";
const getAuthToken = () => localStorage.getItem("authToken");

// Calculate Days
const calculateDays = (startDate, endDate) => {
  if (!startDate || !endDate) return "N/A";
  const diff = (new Date(endDate) - new Date(startDate)) / (1000 * 3600 * 24);
  return diff + 1;
};

// Status Badge
const StatusBadge = ({ status }) => {
  let color = "";
  let Icon = Clock;
  if (status === "Approved") {
    color = "bg-green-500/20 text-green-400 border border-green-500/40";
    Icon = Check;
  } else if (status === "Rejected") {
    color = "bg-red-500/20 text-red-400 border border-red-500/40";
    Icon = X;
  } else {
    color = "bg-yellow-500/20 text-yellow-400 border border-yellow-500/40";
  }

  return (
    <span className={`flex items-center px-3 py-1 rounded-full text-xs font-medium ${color}`}>
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

  const isAdmin = user?.role === "admin";
  const isEmployee = user?.role === "employee";

  // Fetch Leaves
  const fetchLeaves = async () => {
    const endpoint = isAdmin ? "/all" : "/my-leaves";
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setLeaves(data.leaves || []);
    } catch (err) {
      console.log("Fetch Leaves Error:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchLeaves();
  }, [user]);

  // Apply Leave
  const handleApplyLeave = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({ ...newLeave, department: user.department }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert("Leave Applied Successfully!");
      setShowModal(false);
      fetchLeaves();
    } catch (err) {
      console.log(err.message);
    }
  };

  // Update Status (Admin)
  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_BASE_URL}/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({ status }),
      });

      await res.json();
      fetchLeaves();
    } catch (err) {
      console.log(err.message);
    }
  };

  // Filters
  const filteredLeaves = leaves.filter((l) => {
    const s1 = filter === "All" || l.status === filter;
    const s2 =
      !searchId ||
      l.employeeId?.empId?.toLowerCase().includes(searchId.toLowerCase());
    return s1 && s2;
  });

  // Table Columns
  const columns = [
    { name: "S.No", selector: (row, i) => i + 1, width: "70px" },

    ...(isAdmin
      ? [
          { name: "Emp ID", selector: (row) => row.employeeId?.empId || "N/A" },
          { name: "Name", selector: (row) => row.employeeId?.name || "N/A" },
        ]
      : []),

    { name: "Leave Type", selector: (row) => row.leaveType },
    {
      name: "Department",
      selector: (row) => row.employeeId?.department || row.department,
    },
    { name: "Days", selector: (row) => calculateDays(row.startDate, row.endDate) },

    {
      name: "Status",
      cell: (row) => <StatusBadge status={row.status} />,
    },

    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
          {isAdmin && row.status === "Pending" && (
            <>
              <button
                onClick={() => updateStatus(row._id, "Approved")}
                className="bg-green-600/80 hover:bg-green-700 text-white px-3 py-1 rounded-lg"
              >
                <Check size={14} />
              </button>

              <button
                onClick={() => updateStatus(row._id, "Rejected")}
                className="bg-red-600/80 hover:bg-red-700 text-white px-3 py-1 rounded-lg"
              >
                <X size={14} />
              </button>
            </>
          )}

          <button className="bg-blue-600/80 hover:bg-blue-700 text-white px-3 py-1 rounded-lg">
            <Eye size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 text-white bg-[#0A0F1F] min-h-screen">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          {isAdmin ? "Leave Management" : "My Leave Applications"}
        </h1>

        {isEmployee && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-teal-600 px-5 py-2 rounded-lg flex items-center gap-2 hover:bg-teal-700 shadow"
          >
            <Plus size={18} />
            Apply Leave
          </button>
        )}
      </div>

      {/* Admin Filters */}
      {isAdmin && (
        <div className="flex justify-between mb-6">
          <input
            placeholder="Search by Emp ID"
            className="px-3 py-2 rounded-lg bg-[#1F2937] border border-gray-700 w-1/4"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />

          <div className="flex gap-2">
            {["All", "Pending", "Approved", "Rejected"].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 py-2 rounded-lg ${
                  filter === s
                    ? "bg-teal-600 text-white"
                    : "bg-[#1F2937] text-gray-300 border border-gray-700"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-[#111827] rounded-xl p-4 shadow-xl border border-gray-700">
        <DataTable
          columns={columns}
          data={isAdmin ? filteredLeaves : leaves}
          progressPending={isLoading}
          pagination
          highlightOnHover
          theme="dark"
        />
      </div>

      {/* Apply Leave Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-[#111827] p-6 rounded-xl shadow-xl border border-gray-700 w-full max-w-md">

            <h2 className="text-xl font-semibold mb-4 text-white">
              Apply for Leave
            </h2>

            {/* Form */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  className="p-3 bg-[#1F2937] rounded-lg border border-gray-600 text-white"
                  value={newLeave.startDate}
                  onChange={(e) =>
                    setNewLeave({ ...newLeave, startDate: e.target.value })
                  }
                />
                <input
                  type="date"
                  className="p-3 bg-[#1F2937] rounded-lg border border-gray-600 text-white"
                  value={newLeave.endDate}
                  onChange={(e) =>
                    setNewLeave({ ...newLeave, endDate: e.target.value })
                  }
                />
              </div>

              <select
                className="p-3 bg-[#1F2937] rounded-lg border border-gray-600 text-white w-full"
                value={newLeave.leaveType}
                onChange={(e) =>
                  setNewLeave({ ...newLeave, leaveType: e.target.value })
                }
              >
                <option value="">Select Leave Type</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Casual Leave">Casual Leave</option>
                <option value="Annual Leave">Annual Leave</option>
                <option value="Unpaid Leave">Unpaid Leave</option>
              </select>

              <textarea
                rows="3"
                placeholder="Enter Reason"
                className="p-3 bg-[#1F2937] rounded-lg border border-gray-600 text-white w-full"
                value={newLeave.reason}
                onChange={(e) =>
                  setNewLeave({ ...newLeave, reason: e.target.value })
                }
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-600 rounded-lg text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyLeave}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 rounded-lg text-white"
              >
                Submit
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
