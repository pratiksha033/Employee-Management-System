import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash, User, X } from "lucide-react";
import DataTable from "react-data-table-component";

const API_BASE_URL = "http://localhost:4000/api/v1";

// Helper to get token
const getAuthToken = () => localStorage.getItem("authToken");

// Helper to format date
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
    dob: "",
    department: "",
  });

  const isAdmin = user?.role === "admin";

  // Fetch employees (Admin only)
  const fetchEmployees = async () => {
    if (!isAdmin) return;
    setIsLoading(true);
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/employee/all`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch employees");
      setEmployees(data.employees || []);
    } catch (error) {
      console.error("❌ Fetch Employees Error:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch departments
  const fetchDepartments = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/department`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch departments");

      setDepartments(data.departments || []);
    } catch (error) {
      console.error("❌ Fetch Departments Error:", error.message);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchEmployees();
      fetchDepartments();
    }
  }, [isAdmin]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditMode(false);
    setSelectedEmployee(null);
    setFormData({
      name: "",
      email: "",
      dob: "",
      department: "",
    });
  };

  // Add Employee
  const handleAddEmployee = async () => {
    const { name, email, dob, department } = formData;
    if (!name || !email || !dob || !department) {
      alert("⚠️ Please fill all required fields");
      return;
    }

    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/employee/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email, dob, department }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to add employee");

      alert("✅ Employee added successfully!");
      await fetchEmployees();
      closeModal();
    } catch (error) {
      console.error("❌ Add Employee Error:", error.message);
      alert(error.message);
    }
  };

  // Edit Modal Open
  const handleEditClick = (employee) => {
    setSelectedEmployee(employee);
    setFormData({
      name: employee.name,
      email: employee.email,
      dob: employee.dob ? new Date(employee.dob).toISOString().split("T")[0] : "",
      department: employee.department?._id || "",
    });
    setIsEditMode(true);
    setShowModal(true);
  };

  const handleUpdateEmployee = async () => {
    if (!selectedEmployee) return;

    const { name, email, dob, department } = formData;
    if (!name || !email || !dob || !department) {
      alert("⚠️ Please fill all required fields");
      return;
    }

    try {
      const token = getAuthToken();
      const response = await fetch(
        `${API_BASE_URL}/employee/update/${selectedEmployee._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name, email, dob, department }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update employee");

      alert("✅ Employee updated successfully!");
      await fetchEmployees();
      closeModal();
    } catch (error) {
      console.error("❌ Update Employee Error:", error.message);
      alert(error.message);
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;

    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/employee/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to delete employee");

      alert("✅ Employee deleted successfully!");
      await fetchEmployees();
    } catch (error) {
      console.error("❌ Delete Employee Error:", error.message);
      alert(error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    isEditMode ? handleUpdateEmployee() : handleAddEmployee();
  };

  // Employee Profile Modal
  const EmployeeProfileModal = ({ employee, onClose }) => {
    if (!employee) return null;

    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
        <div className="bg-white rounded-2xl p-6 shadow-xl w-[400px] md:w-[500px] relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
          >
            <X size={20} />
          </button>

          <div className="flex flex-col items-center text-center space-y-3">
            <User className="w-20 h-20 text-gray-400 bg-gray-100 rounded-full p-3" />
            <h2 className="text-xl font-semibold text-gray-800 capitalize">
              {employee.name}
            </h2>
            <p className="text-gray-600">{employee.email}</p>

            <div className="w-full mt-4 space-y-2 text-sm text-gray-700">
              <div className="flex justify-between border-b pb-1">
                <span className="font-medium">Department:</span>
                <span>{employee.department?.name || "N/A"}</span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span className="font-medium">DOB:</span>
                <span>{formatDate(employee.dob)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Role:</span>
                <span>{employee.role || "Employee"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Table Columns
  const columns = [
    { name: "S.No", selector: (row, i) => i + 1, width: "70px" },
    {
      name: "Image",
      cell: (row) => (
        <User
          onClick={() => setProfileView(row)}
          className="w-10 h-10 text-gray-400 bg-gray-100 rounded-full p-1 cursor-pointer hover:scale-110 transition-transform"
        />
      ),
      width: "100px",
    },
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Email", selector: (row) => row.email },
    { name: "DOB", selector: (row) => formatDate(row.dob) },
    { name: "Department", selector: (row) => row.department?.name || "N/A" },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEditClick(row)}
            className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded-lg text-xs"
          >
            <Edit size={14} />
          </button>
          <button
            onClick={() => handleDeleteEmployee(row._id)}
            className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded-lg text-xs"
          >
            <Trash size={14} />
          </button>
        </div>
      ),
      width: "150px",
    },
  ];

  if (!isAdmin) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-red-600">Access Denied</h2>
        <p className="text-gray-600">You do not have permission to manage employees.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Manage Employees</h2>
        
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <DataTable
          columns={columns}
          data={employees}
          progressPending={isLoading}
          pagination
          highlightOnHover
        />
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-lg">
            <h3 className="text-xl font-semibold mb-4">
              {isEditMode ? "Edit Employee" : "Add Employee"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1 font-medium">Name</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="border rounded-lg w-full p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1 font-medium">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="border rounded-lg w-full p-2"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1 font-medium">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    required
                    className="border rounded-lg w-full p-2"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm mb-1 font-medium">Department</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                    className="border rounded-lg w-full p-2"
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept._id} value={dept._id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg"
                >
                  {isEditMode ? "Save Changes" : "Add Employee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Profile View Modal */}
      {profileView && (
        <EmployeeProfileModal
          employee={profileView}
          onClose={() => setProfileView(null)}
        />
      )}
    </div>
  );
}
