import React, { useState, useEffect } from "react";
import { Pencil, Trash2, Plus, X } from "lucide-react";

const API_BASE_URL = "http://localhost:4000/api/v1/department";

const getAuthToken = () => localStorage.getItem("authToken");
const getUserRole = () => localStorage.getItem("userRole");

export default function DepartmentPage() {
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [newDept, setNewDept] = useState({ name: "", description: "" });
  const [editDept, setEditDept] = useState(null);

  const userRole = getUserRole();
  const isAdmin = userRole === "admin";

  // Fetch All Departments
  const fetchDepartments = async () => {
    setIsLoading(true);
    try {
      const token = getAuthToken();

      const res = await fetch(API_BASE_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setDepartments(data.departments || []);
    } catch (err) {
      console.log(err.message);
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // Add Department
  const handleAdd = async () => {
    if (!newDept.name.trim()) return alert("Name is required!");

    try {
      const token = getAuthToken();
      const res = await fetch(`${API_BASE_URL}/add`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newDept),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert("Department added!");

      setDepartments([...departments, data.department]);
      setShowAddModal(false);
      setNewDept({ name: "", description: "" });
    } catch (err) {
      alert(err.message);
    }
  };

  // Update
  const handleUpdate = async () => {
    if (!editDept.name.trim()) return alert("Name is required!");

    try {
      const token = getAuthToken();
      const res = await fetch(`${API_BASE_URL}/update/${editDept._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editDept),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert("Updated!");

      setDepartments(
        departments.map((d) => (d._id === editDept._id ? data.department : d))
      );

      setShowEditModal(false);
      setEditDept(null);
    } catch (err) {
      alert(err.message);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this department?")) return;

    try {
      const token = getAuthToken();
      const res = await fetch(`${API_BASE_URL}/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setDepartments(departments.filter((d) => d._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  // Filter Search Results
  const filtered = departments.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-[#0A0F1F] min-h-screen text-white">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Department Management</h1>

        {isAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-teal-600 px-5 py-2 rounded-lg hover:bg-teal-700 shadow"
          >
            <Plus size={18} />
            Add Department
          </button>
        )}
      </div>

      {/* SEARCH */}
      <div className="mb-5">
        <input
          placeholder="Search Department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/2 px-4 py-2 bg-[#1F2937] border border-gray-700 rounded-lg text-white"
        />
      </div>

      {/* TABLE */}
      <div className="bg-[#111827] rounded-xl p-6 border border-gray-700 shadow-xl">
        {isLoading ? (
          <p>Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-400">No Departments Found</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-700 text-gray-300">
                <th className="py-3">Name</th>
                <th className="py-3">Description</th>
                {isAdmin && <th className="py-3 text-center">Action</th>}
              </tr>
            </thead>

            <tbody>
              {filtered.map((dep) => (
                <tr key={dep._id} className="border-b border-gray-800">
                  <td className="py-3">{dep.name}</td>
                  <td className="py-3">{dep.description}</td>

                  {isAdmin && (
                    <td className="py-3 text-center flex gap-3 justify-center">
                      <button
                        onClick={() => {
                          setEditDept(dep);
                          setShowEditModal(true);
                        }}
                        className="bg-green-600 px-3 py-1 rounded-lg hover:bg-green-700"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() => handleDelete(dep._id)}
                        className="bg-red-600 px-3 py-1 rounded-lg hover:bg-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ADD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-[#1F2937] p-6 rounded-xl border border-gray-700 w-full max-w-md">

            <h2 className="text-xl font-semibold mb-4">Add Department</h2>

            <input
              type="text"
              placeholder="Department Name"
              className="w-full p-3 bg-[#111827] border border-gray-600 rounded-lg text-white mb-3"
              value={newDept.name}
              onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
            />

            <textarea
              placeholder="Description"
              className="w-full p-3 bg-[#111827] border border-gray-600 rounded-lg text-white mb-3"
              value={newDept.description}
              onChange={(e) =>
                setNewDept({ ...newDept, description: e.target.value })
              }
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-gray-600 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="px-4 py-2 bg-teal-600 rounded-lg hover:bg-teal-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && editDept && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-[#1F2937] p-6 rounded-xl border border-gray-700 w-full max-w-md">

            <h2 className="text-xl font-semibold mb-4">Edit Department</h2>

            <input
              type="text"
              className="w-full p-3 bg-[#111827] border border-gray-600 rounded-lg text-white mb-3"
              value={editDept.name}
              onChange={(e) =>
                setEditDept({ ...editDept, name: e.target.value })
              }
            />

            <textarea
              className="w-full p-3 bg-[#111827] border border-gray-600 rounded-lg text-white mb-3"
              value={editDept.description}
              onChange={(e) =>
                setEditDept({ ...editDept, description: e.target.value })
              }
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-gray-600 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700"
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
