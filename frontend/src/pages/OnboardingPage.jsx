import React, { useEffect, useState } from "react";
import { CheckCircle, Send } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function OnboardingPage() {
  const [onboards, setOnboards] = useState([]);

  const fetchOnboards = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/onboarding`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOnboards(data.records || []);
    } catch (err) {
      console.error("Error fetching onboarding:", err);
    }
  };

  const markComplete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_BASE_URL}/onboarding/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchOnboards();
    } catch (err) {
      console.error("Error marking complete:", err);
    }
  };

  useEffect(() => {
    fetchOnboards();
  }, []);

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-100 transition-colors">
      <h2 className="text-2xl font-bold mb-6">Onboarding Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {onboards.map((o) => (
          <div
            key={o._id}
            className={`border-l-4 p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm ${
              o.progress >= 80
                ? "border-green-500"
                : o.progress >= 40
                ? "border-blue-500"
                : "border-orange-500"
            }`}
          >
            <h3 className="text-lg font-semibold">{o.name}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {o.department}
            </p>
            <p className="text-xs text-gray-400 mb-2">
              Joined: {new Date(o.joinDate).toLocaleDateString()}
            </p>

            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
              <div
                className={`h-2 rounded-full ${
                  o.progress >= 80
                    ? "bg-green-500"
                    : o.progress >= 40
                    ? "bg-blue-500"
                    : "bg-orange-500"
                }`}
                style={{ width: `${o.progress}%` }}
              ></div>
            </div>

            <div className="flex justify-between text-sm mt-2">
              <span>{o.progress}% Complete</span>
              {o.progress < 100 ? (
                <button
                  onClick={() => markComplete(o._id)}
                  className="text-teal-600 flex items-center gap-1 hover:underline"
                >
                  <Send size={14} /> Mark Complete
                </button>
              ) : (
                <span className="text-green-600 flex items-center gap-1">
                  <CheckCircle size={14} /> Done
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
