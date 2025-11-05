import React, { useState, useEffect } from "react";

// Define the base URL for your department API
const API_BASE_URL = "http://localhost:4000/api/v1/department";

// Helper function to get the auth token from local storage
const getAuthToken = () => {
  return localStorage.getItem("authToken");
};

export default function DepartmentPage() {
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editDept, setEditDept] = useState(null); // track department being edited
  const [isLoading, setIsLoading] = useState(false);

  const [newDept, setNewDept] = useState({
    name: "",
    description: "",
  });

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
          Authorization: `Bearer ${token}`, // Send token in header
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to fetch departments");
      }

      const data = await response.json();
      setDepartments(data.departments || []); // Assuming backend returns { success: true, departments: [...] }
    } catch (error) {
      console.error("Fetch Departments Error:", error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch departments on component mount
  useEffect(() => {
    fetchDepartments();
  }, []);

  // Filter departments
  const filteredDepartments = departments.filter((dep) =>
    dep.name.toLowerCase().includes(search.toLowerCase())
  );

  // --- Add New Department ---
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
      if (!response.ok) {
        throw new Error(data.message || "Failed to add department");
      }

      alert(data.message || "Department added successfully!");
      setDepartments([...departments, data.department]); // Add new dept from response
      setNewDept({ name: "", description: "" });
      setShowModal(false);
    } catch (error) {
      console.error("Add Department Error:", error);
      alert(error.message);
    }
  };

  // --- Update Department ---
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
      if (!response.ok) {
        throw new Error(data.message || "Failed to update department");
      }

      alert(data.message || "Department updated successfully!");
      // Update the department in the local state
      setDepartments(
        departments.map((d) =>
          d._id === editDept._id ? data.department : d
        )
      );
      setEditDept(null);
    } catch (error) {
      console.error("Update Department Error:", error);
      alert(error.message);
    }
  };

  // --- Delete Department ---
  const handleDelete = async (id) => {
    // Replaced confirm with a simple window.confirm for now
    if (!window.confirm("Are you sure you want to delete this department?")) {
      return;
    }

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
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete department");
      }

      alert(data.message || "Department deleted successfully!");
      setDepartments(departments.filter((d) => d._id !== id));
    } catch (error) {
      console.error("Delete Department Error:", error);
      alert(error.message);
    }
  };

  return (
    <div className="p-6">
      {/* Title */}
      <h2 className="text-2xl font-semibold mb-4">Manage Departments</h2>

      {/* Search + Add Button */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search By Dep Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded w-1/2"
        />
        <button
          onClick={() => setShowModal(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded"
        >
          Add New Department
        </button>
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
              <th className="border px-4 py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredDepartments.map((dep) => (
              <tr key={dep._id}>
                {/* Use dep._id as the key */}
                <td className="border px-4 py-2">{dep.name}</td>
                <td className="border px-4 py-2">{dep.description}</td>
                <td className="border px-4 py-2 text-center space-x-2">
                  <button
                    onClick={() => setEditDept({ ...dep })} // Store the whole dept object for editing
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(dep._id)} // Pass dep._id to delete
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal for Add Department */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Add New Department</h3>

            <input
              type="text"
              placeholder="Department Name"
              value={newDept.name}
              onChange={(e) =>
                setNewDept({ ...newDept, name: e.target.value })
              }
              className="w-full border px-3 py-2 mb-3 rounded"
            />

            <textarea
              placeholder="Description"
              value={newDept.description}
              onChange={(e) =>
                setNewDept({ ...newDept, description: e.target.value })
              }
              className="w-full border px-3 py-2 mb-3 rounded"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowModal(false);
                  setNewDept({ name: "", description: "" }); // Reset form on cancel
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

      {/* Modal for Edit Department */}
      {editDept && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Edit Department</h3>

            <input
              type="text"
              placeholder="Department Name"
              value={editDept.name}
              onChange={(e) =>
                setEditDept({ ...editDept, name: e.target.value })
              }
              className="w-full border px-3 py-2 mb-3 rounded"
            />

            <textarea
              placeholder="Description"
              value={editDept.description}
              onChange={(e) =>
                setEditDept({ ...editDept, description: e.target.value })
              }
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