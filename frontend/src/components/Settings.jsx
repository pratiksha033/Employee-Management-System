import React, { useState } from "react";

export default function SettingsPage({ user }) {
  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
  });

  return (
    <div className="min-h-screen w-full bg-[#0d1224] text-white overflow-x-hidden py-12 px-4">

      <div className="max-w-4xl mx-auto space-y-12">

        {/* --- PAGE HEADER --- */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-teal-400 to-cyan-400 text-transparent bg-clip-text drop-shadow-lg">
            Settings
          </h1>
          <p className="text-gray-400 mt-1">
            Manage your profile & account security
          </p>
        </div>

        {/* --- PROFILE CARD --- */}
        <div className="bg-[#131b31]/60 backdrop-blur-xl border border-teal-700/30 shadow-xl shadow-teal-500/10 rounded-2xl p-8 transition-all hover:shadow-teal-700/20">
          <h2 className="text-2xl font-semibold mb-6 text-teal-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
            Profile Information
          </h2>

          <div className="grid gap-5">

            <div>
              <label className="block mb-1 text-gray-300">Full Name</label>
              <input
                type="text"
                value={profile.name}
                className="w-full p-3 bg-[#0d1527] border border-gray-700 rounded-xl text-gray-200
                focus:border-teal-500 focus:ring-2 focus:ring-teal-600 transition-all"
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-300">Email Address</label>
              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full p-3 bg-[#0d1527] border border-gray-700 rounded-xl text-gray-400 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-300">Phone Number</label>
              <input
                type="text"
                value={profile.phone}
                className="w-full p-3 bg-[#0d1527] border border-gray-700 rounded-xl text-gray-200
                focus:border-teal-500 focus:ring-2 focus:ring-teal-600 transition-all"
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              />
            </div>

            <button className="mt-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:opacity-90 
            px-6 py-3 rounded-xl font-semibold tracking-wide transition-all shadow-lg shadow-teal-500/20">
              Save Profile
            </button>
          </div>
        </div>

        {/* --- PASSWORD CARD --- */}
        <div className="bg-[#131b31]/60 backdrop-blur-xl border border-cyan-700/30 shadow-xl shadow-cyan-500/10 rounded-2xl p-8 transition-all hover:shadow-cyan-700/20">
          <h2 className="text-2xl font-semibold mb-6 text-cyan-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            Change Password
          </h2>

          <div className="grid gap-5">

            <div>
              <label className="block mb-1 text-gray-300">Old Password</label>
              <input
                type="password"
                className="w-full p-3 bg-[#0d1527] border border-gray-700 rounded-xl text-gray-200
                focus:border-cyan-500 focus:ring-2 focus:ring-cyan-600 transition-all"
                onChange={(e) =>
                  setPasswords({ ...passwords, oldPassword: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-300">New Password</label>
              <input
                type="password"
                className="w-full p-3 bg-[#0d1527] border border-gray-700 rounded-xl text-gray-200
                focus:border-cyan-500 focus:ring-2 focus:ring-cyan-600 transition-all"
                onChange={(e) =>
                  setPasswords({ ...passwords, newPassword: e.target.value })
                }
              />
            </div>

            <button className="mt-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-90 
            px-6 py-3 rounded-xl font-semibold tracking-wide transition-all shadow-lg shadow-cyan-500/20">
              Update Password
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}
