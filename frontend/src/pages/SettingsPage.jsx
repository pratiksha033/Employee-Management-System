import React from "react";

export default function SettingsPage({ user }) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>Welcome, {user?.name || "User"}! 🎉</p>
    </div>
  );
}
