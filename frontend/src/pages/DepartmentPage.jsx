import React, { useState, useEffect } from "react";

// Base API
const API_BASE_URL = "http://localhost:4000/api/v1/department";

// Get token and user
const getAuthToken = () => localStorage.getItem("authToken");
const getUserRole = () => localStorage.getItem("userRole"); // save role when user logs in

export default function DepartmentPage() {
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editDept, setEditDept] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newDept, setNewDept] = useState({ name: "", description: "" });

  const userRole = getUserRole(); // 'admin' or 'employee'
  const isAdmin = userRole === "admin";

  // --- Fetch Departments ---
  const fetchDepartments = async () => {
    setIsLoading(true);
    try {
      const token = getAuthToken();
      if (!token) {
        alert("You are not authenticated. Please log in.");
        setIsLoading(false);
        return;
      }

      const response = await fetch(API_BASE_URL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch departments");
      }

      setDepartments(data.departments || []);
    } catch (error) {
      console.error("Fetch Departments Error:", error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // --- Filter ---
  const filteredDepartments = departments.filter((dep) =>
    dep.name.toLowerCase().includes(search.toLowerCase())
  );

  // --- Add Department (Admin only) ---
  const handleAddDepartment = async () => {
    if (!newDept.name.trim()) {
      alert("Department name is required!");
      return;
    }

    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newDept),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to add department");

      alert(data.message || "Department added successfully!");
      setDepartments([...departments, data.department]);
      setNewDept({ name: "", description: "" });
      setShowModal(false);
    } catch (error) {
      console.error("Add Department Error:", error);
      alert(error.message);
    }
  };

  // --- Update Department (Admin only) ---
  const handleUpdateDepartment = async () => {
    if (!editDept || !editDept._id) return;
    if (!editDept.name.trim()) {
      alert("Department name is required!");
      return;
    }

    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/update/${editDept._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editDept.name,
          description: editDept.description,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update department");

      alert(data.message || "Department updated successfully!");
      setDepartments(
        departments.map((d) => (d._id === editDept._id ? data.department : d))
      );
      setEditDept(null);
    } catch (error) {
      console.error("Update Department Error:", error);
      alert(error.message);
    }
  };

  // --- Delete Department (Admin only) ---
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this department?")) return;

    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to delete department");

      alert(data.message || "Department deleted successfully!");
      setDepartments(departments.filter((d) => d._id !== id));
    } catch (error) {
      console.error("Delete Department Error:", error);
      alert(error.message);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Manage Departments</h2>

      {/* Search + Add Button */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search By Department Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded w-1/2"
        />
        {isAdmin && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded"
          >
            Add New Department
          </button>
        )}
      </div>

      {/* Department List */}
      {isLoading ? (
        <p>Loading departments...</p>
      ) : filteredDepartments.length === 0 ? (
        <p className="text-gray-500">There are no records to display</p>
      ) : (
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2 text-left">Department Name</th>
              <th className="border px-4 py-2 text-left">Description</th>
              {isAdmin && <th className="border px-4 py-2 text-center">Action</th>}
            </tr>
          </thead>
          <tbody>
            {filteredDepartments.map((dep) => (
              <tr key={dep._id}>
                <td className="border px-4 py-2">{dep.name}</td>
                <td className="border px-4 py-2">{dep.description}</td>
                {isAdmin && (
                  <td className="border px-4 py-2 text-center space-x-2">
                    <button
                      onClick={() => setEditDept({ ...dep })}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(dep._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* --- Add Modal --- */}
      {isAdmin && showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Add New Department</h3>
            <input
              type="text"
              placeholder="Department Name"
              value={newDept.name}
              onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
              className="w-full border px-3 py-2 mb-3 rounded"
            />
            <textarea
              placeholder="Description"
              value={newDept.description}
              onChange={(e) => setNewDept({ ...newDept, description: e.target.value })}
              className="w-full border px-3 py-2 mb-3 rounded"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowModal(false);
                  setNewDept({ name: "", description: "" });
                }}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddDepartment}
                className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded"
              >
                Add Department
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Edit Modal --- */}
      {isAdmin && editDept && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Edit Department</h3>
            <input
              type="text"
              placeholder="Department Name"
              value={editDept.name}
              onChange={(e) => setEditDept({ ...editDept, name: e.target.value })}
              className="w-full border px-3 py-2 mb-3 rounded"
            />
            <textarea
              placeholder="Description"
              value={editDept.description}
              onChange={(e) => setEditDept({ ...editDept, description: e.target.value })}
              className="w-full border px-3 py-2 mb-3 rounded"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditDept(null)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateDepartment}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
