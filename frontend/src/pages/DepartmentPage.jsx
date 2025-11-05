import React, { useState } from "react";

export default function DepartmentPage() {
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editDept, setEditDept] = useState(null); // track department being edited

  const [newDept, setNewDept] = useState({
    name: "",
    description: "",
  });

  // Filter departments
  const filteredDepartments = departments.filter((dep) =>
    dep.name.toLowerCase().includes(search.toLowerCase())
  );

  // Add new department
  const handleAddDepartment = () => {
    if (!newDept.name.trim()) {
      alert("Department name is required!");
      return;
    }

    if (departments.some((d) => d.name === newDept.name)) {
      alert("Department already exists!");
      return;
    }

    setDepartments([...departments, newDept]);
    setNewDept({ name: "", description: "" });
    setShowModal(false);
  };

  // Update department
  const handleUpdateDepartment = () => {
    if (!editDept.name.trim()) {
      alert("Department name is required!");
      return;
    }

    setDepartments(
      departments.map((d) => (d.name === editDept.oldName ? editDept : d))
    );
    setEditDept(null);
  };

  // Delete department
  const handleDelete = (name) => {
    setDepartments(departments.filter((d) => d.name !== name));
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
      {filteredDepartments.length === 0 ? (
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
            {filteredDepartments.map((dep, idx) => (
              <tr key={idx}>
                <td className="border px-4 py-2">{dep.name}</td>
                <td className="border px-4 py-2">{dep.description}</td>
                <td className="border px-4 py-2 text-center space-x-2">
                  <button
                    onClick={() =>
                      setEditDept({ ...dep, oldName: dep.name })
                    }
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(dep.name)}
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
                onClick={() => setShowModal(false)}
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
