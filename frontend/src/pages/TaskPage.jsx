import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:4000/api/v1/tasks";

export default function TaskPage() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", status: "To Do" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const statusFilters = ["All", "To Do", "In Progress", "Done"];
  const [activeFilter, setActiveFilter] = useState("All");

  const token = localStorage.getItem("token"); // get token

  const fetchTasks = async () => {
    if (!token) {
      setIsLoggedIn(false);
      setError("Please login first!");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`${API}/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data.tasks);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch tasks. Please login again.");
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!form.title) {
      setError("Title is required");
      return;
    }

    if (!token) {
      setIsLoggedIn(false);
      setError("Please login first!");
      return;
    }

    try {
      await axios.post(`${API}/add`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm({ title: "", description: "", status: "To Do" });
      fetchTasks();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to add task");
    }
  };

  const filteredTasks =
    activeFilter === "All" ? tasks : tasks.filter((t) => t.status === activeFilter);

  useEffect(() => {
    fetchTasks();
  }, []);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-[#0f0f0f]">
        <h2>Please login first to view your tasks.</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white px-8 py-8 font-inter transition-colors">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold mb-1">Tasks</h1>
          <p className="text-gray-400 text-sm">Manage and track your tasks</p>
        </div>
      </div>

      {/* Add Task Form */}
      <form
        onSubmit={submitHandler}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 bg-[#111827] p-6 rounded-xl border border-gray-700"
      >
        {error && <div className="col-span-3 text-red-400">{error}</div>}
        <input
          type="text"
          placeholder="Task Title"
          className="p-3 rounded bg-[#1F2937] border border-gray-600"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          className="p-3 rounded bg-[#1F2937] border border-gray-600"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <select
          className="p-3 rounded bg-[#1F2937] border border-gray-600"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
        <button className="col-span-1 md:col-span-3 bg-blue-600 p-3 rounded-lg hover:bg-blue-700 font-semibold">
          Add Task
        </button>
      </form>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        {statusFilters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeFilter === filter
                ? "bg-gray-700 text-white"
                : "bg-[#1a1a1a] text-gray-400 hover:text-white hover:bg-gray-700"
            }`}
          >
            {filter} ({filter === "All" ? tasks.length : tasks.filter(t => t.status === filter).length})
          </button>
        ))}
      </div>

      {/* Task Grid */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTasks.map((task) => (
          <div
            key={task._id}
            className="bg-[#181818] border border-t-4 border-blue-500 rounded-2xl p-5 shadow hover:shadow-lg transition-all duration-200"
          >
            <div className="flex justify-between items-start mb-3">
              <h2 className="text-lg font-semibold text-gray-100">{task.title}</h2>
              <span
                className={`text-xs px-3 py-1 rounded-md font-medium ${
                  task.status === "In Progress"
                    ? "bg-blue-900/40 text-blue-300"
                    : task.status === "To Do"
                    ? "bg-yellow-900/40 text-yellow-300"
                    : "bg-green-900/40 text-green-300"
                }`}
              >
                {task.status}
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-5">{task.description}</p>
            <div className="text-gray-400 text-xs">{new Date(task.createdAt).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
