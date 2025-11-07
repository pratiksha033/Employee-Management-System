import React, { useState, useEffect } from "react";
import { User, Lock, Save } from "lucide-react";

const API_BASE_URL = "http://localhost:4000/api/v1/user";

const getAuthToken = () => {
  return localStorage.getItem("authToken");
};

const FormMessage = ({ message }) => {
  if (!message.text) return null;
  const colorClass =
    message.type === "success"
      ? "text-green-700 bg-green-100 border-green-300"
      : "text-red-700 bg-red-100 border-red-300";
  return (
    <div
      className={`p-3 rounded-lg text-sm font-medium border ${colorClass} shadow-sm mt-3`}
    >
      {message.text}
    </div>
  );
};

export default function SettingsPage({ user }) {
  const [profileData, setProfileData] = useState({ name: "", email: "" });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [profileMessage, setProfileMessage] = useState({ type: "", text: "" });
  const [passwordMessage, setPasswordMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
      });
    }

    const fetchProfile = async () => {
      try {
        const token = getAuthToken();
        const response = await fetch(`${API_BASE_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.success) {
          setProfileData({ name: data.user.name, email: data.user.email });
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
      }
    };

    if (!user.email) {
      fetchProfile();
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileMessage({ type: "", text: "" });

    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/update/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update profile");

      setProfileMessage({
        type: "success",
        text: "Profile updated successfully!",
      });
      localStorage.setItem("userName", data.user.name);
    } catch (error) {
      setProfileMessage({ type: "error", text: error.message });
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMessage({ type: "", text: "" });

    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: "error", text: "New passwords do not match." });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMessage({
        type: "error",
        text: "Password must be at least 6 characters.",
      });
      return;
    }

    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/update/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to change password");

      setPasswordMessage({
        type: "success",
        text: "Password changed successfully!",
      });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setPasswordMessage({ type: "error", text: error.message });
    }
  };

  return (
    <div className="min-h-screen w-screen overflow-hidden bg-gradient-to-br from-gray-50 to-teal-50 flex items-center justify-center">
  <div className="w-[90%] max-w-5xl bg-white rounded-2xl shadow-xl border border-gray-100 p-10 space-y-10 overflow-y-auto max-h-[90vh]">

        <h2 className="text-4xl font-bold text-gray-800 text-center mb-6">
          ⚙️ Account Settings
        </h2>

        {/* --- Update Profile --- */}
        <div className="bg-gradient-to-r from-teal-50 to-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
          <h3 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center">
            <User className="mr-3 text-teal-600" size={24} />
            Update Profile
          </h3>
          <form onSubmit={handleUpdateProfile} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-teal-500 focus:ring-teal-500 p-3"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleProfileChange}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-teal-500 focus:ring-teal-500 p-3"
                required
              />
            </div>
            <div className="pt-3">
              <button
                type="submit"
                className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center shadow-md w-full sm:w-auto"
              >
                <Save size={18} className="mr-2" />
                Save Profile
              </button>
            </div>
            {profileMessage.text && <FormMessage message={profileMessage} />}
          </form>
        </div>

        {/* --- Change Password --- */}
        <div className="bg-gradient-to-r from-white to-teal-50 p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
          <h3 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center">
            <Lock className="mr-3 text-teal-600" size={24} />
            Change Password
          </h3>
          <form onSubmit={handleChangePassword} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-teal-500 focus:ring-teal-500 p-3"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-teal-500 focus:ring-teal-500 p-3"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-teal-500 focus:ring-teal-500 p-3"
                required
              />
            </div>
            <div className="pt-3">
              <button
                type="submit"
                className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center shadow-md w-full sm:w-auto"
              >
                <Save size={18} className="mr-2" />
                Change Password
              </button>
            </div>
            {passwordMessage.text && <FormMessage message={passwordMessage} />}
          </form>
        </div>
      </div>
    </div>
  );
}
