import React, { useState } from "react";
import { CalendarDays } from "lucide-react";

const tasks = [
  {
    title: "Update Employee Records",
    description: "Review and update all employee records for Q1 compliance",
    assignee: "Sarah Johnson",
    initials: "SJ",
    date: "Dec 20",
    status: "In Progress",
    color: "border-t-red-500",
  },
  {
    title: "Prepare Monthly Report",
    description: "Compile attendance and performance data for management",
    assignee: "Mike Chen",
    initials: "MC",
    date: "Dec 25",
    status: "To Do",
    color: "border-t-yellow-400",
  },
  {
    title: "System Backup",
    description: "Perform routine system backup and verification",
    assignee: "Alex Rodriguez",
    initials: "AR",
    date: "Dec 10",
    status: "Done",
    color: "border-t-blue-500",
  },
  {
    title: "Interview Candidates",
    description: "Conduct interviews for open engineering positions",
    assignee: "Emily Davis",
    initials: "ED",
    date: "Dec 22",
    status: "In Progress",
    color: "border-t-red-500",
  },
];

const statusFilters = ["All", "To Do", "In Progress", "Done"];

export default function TaskPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredTasks =
    activeFilter === "All"
      ? tasks
      : tasks.filter((task) => task.status === activeFilter);

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white px-8 py-8 font-inter transition-colors">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold mb-1">Tasks</h1>
          <p className="text-gray-400 text-sm">
            Manage and track task assignments
          </p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow transition-all duration-200">
          <span className="text-lg font-bold">+</span> Create Task
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-10">
        {statusFilters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
              activeFilter === filter
                ? "bg-gray-700 text-white"
                : "bg-[#1a1a1a] text-gray-400 hover:text-white hover:bg-gray-700"
            }`}
          >
            {filter}{" "}
            <span className="text-gray-500 text-xs ml-1">
              (
              {
                (filter === "All"
                  ? tasks
                  : tasks.filter((task) => task.status === filter)
                ).length
              }
              )
            </span>
          </button>
        ))}
      </div>

      {/* Task Grid */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTasks.map((task, index) => (
          <div
            key={index}
            className={`bg-[#181818] border ${task.color} border-t-4 rounded-2xl p-5 shadow hover:shadow-lg transition-all duration-200`}
          >
            <div className="flex justify-between items-start mb-3">
              <h2 className="text-lg font-semibold text-gray-100">
                {task.title}
              </h2>
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

            <p className="text-gray-400 text-sm mb-5 leading-relaxed">
              {task.description}
            </p>

            <div className="flex items-center justify-between text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="bg-gray-700 text-gray-200 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm">
                  {task.initials}
                </div>
                <span className="text-gray-300">{task.assignee}</span>
              </div>
              <div className="flex items-center gap-1">
                <CalendarDays size={16} className="text-gray-400" />
                <span className="text-gray-300">{task.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
