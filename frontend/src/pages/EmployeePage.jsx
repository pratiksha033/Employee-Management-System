import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash, User, X } from "lucide-react";
import DataTable from "react-data-table-component";

const API_BASE_URL = "http://localhost:4000/api/v1";
const getAuthToken = () => localStorage.getItem("authToken");

const inputDarkClass =
  "w-full bg-[#1E1E1E] border border-gray-700 text-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500";

const darkTableStyles = {
  table: { style: { backgroundColor: "#111827", color: "#d1d5db" } },

  headRow: {
    style: { backgroundColor: "#1f2937", color: "#e5e7eb", fontWeight: "600" },
  },

  rows: {
    style: {
      backgroundColor: "#111827",
      color: "#d1d5db",
    },
    highlightOnHoverStyle: {
      backgroundColor: "#1f2937",
      color: "#fff",
    },
  },

  pagination: {
    style: {
      backgroundColor: "#111827",
      color: "#cbd5e1",
      borderTop: "1px solid #374151",
    },

    pageButtonsStyle: {
      backgroundColor: "transparent",
      color: "#cbd5e1",
      fill: "#cbd5e1",
      borderRadius: "6px",
      "&:hover": {
        backgroundColor: "#1f2937",
        color: "#fff",
        fill: "#fff",
      },
    },
  },
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function EmployeePage({ user }) {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [profileView, setProfileView] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    dob: "",
    department: "",
  });

  const isAdmin = user?.role === "admin";

  const fetchEmployees = async () => {
    if (!isAdmin) return;
    setIsLoading(true);

    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/employee/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (response.ok) setEmployees(data.employees);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  const fetchDepartments = async () => {
    try {
      const token = getAuthToken();
      const res = await fetch(`${API_BASE_URL}/department`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) setDepartments(data.departments);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchEmployees();
      fetchDepartments();
    }
  }, [isAdmin]);

  const closeModal = () => {
    setShowModal(false);
    setIsEditMode(false);
    setSelectedEmployee(null);
    setFormData({ name: "", email: "", password: "", dob: "", department: "" });
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddEmployee = async () => {
    try {
      const token = getAuthToken();
      const res = await fetch(`${API_BASE_URL}/employee/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert("Employee Added");
      fetchEmployees();
      closeModal();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEditClick = (emp) => {
    setIsEditMode(true);
    setSelectedEmployee(emp);

    setFormData({
      name: emp.name,
      email: emp.email,
      password: "",
      dob: emp.dob?.split("T")[0],
      department: emp.department?._id || "",
    });

    setShowModal(true);
  };

  const handleUpdateEmployee = async () => {
    try {
      const token = getAuthToken();
      const res = await fetch(
        `${API_BASE_URL}/employee/update/${selectedEmployee._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert("Updated");
      fetchEmployees();
      closeModal();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (!window.confirm("Delete Employee?")) return;

    try {
      const token = getAuthToken();
      const res = await fetch(`${API_BASE_URL}/employee/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) fetchEmployees();
    } catch (error) {
      alert(error.message);
    }
  };

  const columns = [
    { name: "S.No", selector: (_, i) => i + 1, width: "70px" },

    {
      name: "Image",
      cell: (row) => (
        <User
          onClick={() => setProfileView(row)}
          className="w-10 h-10 bg-gray-800 text-gray-400 rounded-full p-2 cursor-pointer hover:scale-110 transition"
        />
      ),
    },

    { name: "Name", selector: (row) => row.name },
    { name: "Email", selector: (row) => row.email },
    { name: "DOB", selector: (row) => formatDate(row.dob) },
    { name: "Department", selector: (row) => row.department?.name },

    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
          <button
            className="p-2 bg-green-600 hover:bg-green-700 rounded-lg"
            onClick={() => handleEditClick(row)}
          >
            <Edit size={14} />
          </button>

          <button
            className="p-2 bg-red-600 hover:bg-red-700 rounded-lg"
            onClick={() => handleDeleteEmployee(row._id)}
          >
            <Trash size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 text-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold">Manage Employees</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={18} /> Add Employee
        </button>
      </div>

      <div className="bg-gray-900 rounded-xl shadow-xl p-4">
        <DataTable
          columns={columns}
          data={employees}
          progressPending={isLoading}
          pagination
          highlightOnHover
          customStyles={darkTableStyles}
        />
      </div>

      {/* ---------- MODAL ---------- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 text-gray-200 rounded-xl shadow-2xl p-6 w-full max-w-lg">
            <h3 className="text-xl font-semibold mb-4">
              {isEditMode ? "Edit Employee" : "Add Employee"}
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                isEditMode ? handleUpdateEmployee() : handleAddEmployee();
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label>Name</label>
                  <input
                    name="name"
                    className={inputDarkClass}
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label>Email</label>
                  <input
                    name="email"
                    type="email"
                    className={inputDarkClass}
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>

                {!isEditMode && (
                  <div>
                    <label>Password</label>
                    <input
                      name="password"
                      type="password"
                      className={inputDarkClass}
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                  </div>
                )}

                <div>
                  <label>DOB</label>
                  <input
                    name="dob"
                    type="date"
                    className={inputDarkClass}
                    value={formData.dob}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="col-span-2">
                  <label>Department</label>
                  <select
                    name="department"
                    className={inputDarkClass}
                    value={formData.department}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Department</option>

                    {departments.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-lg"
                >
                  {isEditMode ? "Save" : "Add Employee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
