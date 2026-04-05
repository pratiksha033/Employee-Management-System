import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Shield,
  Building2,
  Calendar,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Fingerprint,
  Bell,
  LogOut,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api/v1";

/* ─── tiny Toast helper ─── */
function Toast({ message, type }) {
  if (!message) return null;
  const isSuccess = type === "success";
  return (
    <div
      className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border transition-all ${isSuccess
        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
        : "bg-red-500/10 text-red-400 border-red-500/30"
        }`}
    >
      {isSuccess ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
      {message}
    </div>
  );
}

export default function SettingsPage({ user }) {
  const token = localStorage.getItem("authToken");

  /* ── Profile state ── */
  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [profileMsg, setProfileMsg] = useState({ text: "", type: "" });
  const [profileLoading, setProfileLoading] = useState(false);

  /* ── Password state ── */
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPw, setShowPw] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [pwMsg, setPwMsg] = useState({ text: "", type: "" });
  const [pwLoading, setPwLoading] = useState(false);

  /* ── Notification prefs (UI only) ── */
  const [notifs, setNotifs] = useState({
    emailAlerts: true,
    attendanceReminders: true,
    leaveUpdates: false,
    payrollNotifs: true,
  });

  /* ─────────────── HANDLERS ─────────────── */
  const handleUpdateProfile = async () => {
    if (!profile.name.trim()) {
      setProfileMsg({ text: "Name cannot be empty.", type: "error" });
      return;
    }
    setProfileLoading(true);
    setProfileMsg({ text: "", type: "" });
    try {
      const res = await fetch(`${API_BASE_URL}/user/update/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: profile.name, email: profile.email }),
      });
      const data = await res.json();
      if (data.success) {
        setProfileMsg({ text: "Profile updated successfully!", type: "success" });
      } else {
        setProfileMsg({ text: data.message || "Update failed.", type: "error" });
      }
    } catch {
      setProfileMsg({ text: "Network error. Please try again.", type: "error" });
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
      setPwMsg({ text: "Please fill all password fields.", type: "error" });
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPwMsg({ text: "New passwords do not match.", type: "error" });
      return;
    }
    if (passwords.newPassword.length < 6) {
      setPwMsg({ text: "Password must be at least 6 characters.", type: "error" });
      return;
    }
    setPwLoading(true);
    setPwMsg({ text: "", type: "" });
    try {
      const res = await fetch(`${API_BASE_URL}/user/update/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
          confirmPassword: passwords.confirmPassword,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPwMsg({ text: "Password changed successfully!", type: "success" });
        setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        setPwMsg({ text: data.message || "Password change failed.", type: "error" });
      }
    } catch {
      setPwMsg({ text: "Network error. Please try again.", type: "error" });
    } finally {
      setPwLoading(false);
    }
  };

  /* ─────────────── REUSABLE FIELD ─────────────── */
  const Field = ({ label, icon: Icon, children }) => (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
        <Icon size={13} className="text-teal-400" />
        {label}
      </label>
      {children}
    </div>
  );

  const inputCls =
    "w-full p-3 bg-gray-800/60 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors text-sm";

  const disabledCls =
    "w-full p-3 bg-gray-800/30 border border-gray-700/50 rounded-xl text-gray-500 text-sm cursor-not-allowed";

  /* ─────────────── ACCOUNT INFO ─────────────── */
  const roleColor =
    user?.role === "admin"
      ? "bg-purple-500/20 text-purple-400 border-purple-500/40"
      : "bg-teal-500/20 text-teal-400 border-teal-500/40";

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    : "N/A";

  /* ─────────────── RENDER ─────────────── */
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      {/* ── Page Header ── */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-gray-400 mt-1 text-sm">
          Manage your profile, security, and preferences
        </p>
      </div>

      <div className="max-w-4xl space-y-6">

        {/* ══════════ PROFILE OVERVIEW STRIP ══════════ */}
        <div className="bg-gradient-to-r from-teal-900/20 to-cyan-900/10 border border-teal-700/30 rounded-2xl p-6 flex items-center gap-5">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-teal-500/30">
              {user?.name?.charAt(0).toUpperCase() || "?"}
            </div>
            <span className="absolute -bottom-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full border-2 border-gray-950 flex items-center justify-center">
              <span className="w-2 h-2 bg-white rounded-full" />
            </span>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-white truncate">{user?.name || "—"}</h2>
            <p className="text-gray-400 text-sm truncate">{user?.email || "—"}</p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${roleColor}`}>
                {user?.role?.toUpperCase() || "EMPLOYEE"}
              </span>
              {user?.department?.name && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full border bg-gray-700/30 text-gray-300 border-gray-600/40">
                  {user.department.name}
                </span>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="hidden md:grid grid-cols-2 gap-4 text-center flex-shrink-0">
            {[
              { label: "Role", value: user?.role === "admin" ? "Admin" : "Employee" },
              { label: "Department", value: user?.department?.name || "N/A" },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-900/50 rounded-xl px-4 py-3">
                <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                <p className="text-sm font-semibold text-white">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════ TWO-COLUMN GRID ══════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ── Profile Info Card ── */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-teal-500/10 rounded-lg flex items-center justify-center">
                <User size={16} className="text-teal-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Profile Information</h3>
                <p className="text-gray-500 text-xs">Update your personal details</p>
              </div>
            </div>

            <div className="space-y-4">
              <Field label="Full Name" icon={User}>
                <input
                  type="text"
                  className={inputCls}
                  placeholder="Your full name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                />
              </Field>

              <Field label="Email Address" icon={Mail}>
                <input
                  type="email"
                  className={disabledCls}
                  value={profile.email}
                  disabled
                  title="Contact admin to change email"
                />
                <p className="text-xs text-gray-600 mt-1.5 ml-1">
                  Email cannot be changed. Contact admin if needed.
                </p>
              </Field>

              <Field label="Phone Number" icon={Phone}>
                <input
                  type="text"
                  className={inputCls}
                  placeholder="+91 XXXXX XXXXX"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                />
              </Field>

              <Toast message={profileMsg.text} type={profileMsg.type} />

              <button
                onClick={handleUpdateProfile}
                disabled={profileLoading}
                className="w-full mt-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 disabled:opacity-60 py-3 rounded-xl text-sm font-semibold text-white transition-all shadow-lg shadow-teal-600/20 flex items-center justify-center gap-2"
              >
                {profileLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} />
                    Save Profile
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ── Account Info Card (read-only) ── */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Fingerprint size={16} className="text-purple-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Account Information</h3>
                <p className="text-gray-500 text-xs">Your account details at a glance</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                {
                  icon: Shield,
                  label: "Role",
                  value: user?.role === "admin" ? "Administrator" : "Employee",
                  color: "text-purple-400",
                },
                {
                  icon: Building2,
                  label: "Department",
                  value: user?.department?.name || "Not Assigned",
                  color: "text-teal-400",
                },
                {
                  icon: Mail,
                  label: "Email",
                  value: user?.email || "—",
                  color: "text-cyan-400",
                },
                {
                  icon: Calendar,
                  label: "Member Since",
                  value: joinedDate,
                  color: "text-amber-400",
                },
              ].map(({ icon: Icon, label, value, color }) => (
                <div
                  key={label}
                  className="flex items-center justify-between p-3 bg-gray-800/40 rounded-xl border border-gray-700/50"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={15} className={color} />
                    <span className="text-xs text-gray-400 font-medium">{label}</span>
                  </div>
                  <span className="text-sm text-gray-200 font-medium truncate max-w-[160px] text-right">
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {/* Account ID */}
            <div className="mt-4 p-3 bg-gray-800/40 rounded-xl border border-gray-700/50">
              <p className="text-xs text-gray-500 mb-1">Account ID</p>
              <p className="text-xs text-gray-400 font-mono truncate">
                {user?._id || user?.id || "—"}
              </p>
            </div>
          </div>
        </div>

        {/* ══════════ CHANGE PASSWORD ══════════ */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center">
              <Lock size={16} className="text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Change Password</h3>
              <p className="text-gray-500 text-xs">Keep your account secure with a strong password</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { key: "currentPassword", label: "Current Password", showKey: "current" },
              { key: "newPassword", label: "New Password", showKey: "new" },
              { key: "confirmPassword", label: "Confirm Password", showKey: "confirm" },
            ].map(({ key, label, showKey }) => (
              <Field key={key} label={label} icon={Lock}>
                <div className="relative">
                  <input
                    type={showPw[showKey] ? "text" : "password"}
                    className={inputCls + " pr-10"}
                    placeholder="••••••••"
                    value={passwords[key]}
                    onChange={(e) =>
                      setPasswords({ ...passwords, [key]: e.target.value })
                    }
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPw({ ...showPw, [showKey]: !showPw[showKey] })
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showPw[showKey] ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </Field>
            ))}
          </div>

          {/* Password strength hint */}
          {passwords.newPassword && (
            <div className="mt-3 flex items-center gap-2">
              {["Weak", "Fair", "Strong"].map((level, i) => {
                const strength =
                  passwords.newPassword.length < 6 ? 0 :
                    passwords.newPassword.length < 10 ? 1 : 2;
                return (
                  <div key={level} className="flex-1">
                    <div
                      className={`h-1.5 rounded-full transition-all ${i <= strength
                        ? i === 0 ? "bg-red-500" : i === 1 ? "bg-amber-500" : "bg-emerald-500"
                        : "bg-gray-700"
                        }`}
                    />
                  </div>
                );
              })}
              <span className="text-xs text-gray-500">
                {passwords.newPassword.length < 6 ? "Weak"
                  : passwords.newPassword.length < 10 ? "Fair" : "Strong"}
              </span>
            </div>
          )}

          <div className="mt-4 space-y-3">
            <Toast message={pwMsg.text} type={pwMsg.type} />
            <button
              onClick={handleChangePassword}
              disabled={pwLoading}
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:opacity-60 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all shadow-lg shadow-amber-600/20 flex items-center gap-2"
            >
              {pwLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Lock size={15} />
                  Update Password
                </>
              )}
            </button>
          </div>
        </div>

        {/* ══════════ NOTIFICATION PREFERENCES ══════════ */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Bell size={16} className="text-blue-400" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Notification Preferences</h3>
              <p className="text-gray-500 text-xs">Choose what updates you want to receive</p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { key: "emailAlerts", label: "Email Alerts", desc: "General account notifications via email" },
              { key: "attendanceReminders", label: "Attendance Reminders", desc: "Daily check-in / check-out reminders" },
              { key: "leaveUpdates", label: "Leave Status Updates", desc: "Get notified when leave is approved or rejected" },
              { key: "payrollNotifs", label: "Payroll Notifications", desc: "Salary slip generation and payroll alerts" },
            ].map(({ key, label, desc }) => (
              <div
                key={key}
                className="flex items-center justify-between p-4 bg-gray-800/40 rounded-xl border border-gray-700/50 hover:border-gray-600 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-gray-200">{label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                </div>
                <button
                  onClick={() => setNotifs({ ...notifs, [key]: !notifs[key] })}
                  className={`relative w-11 h-6 rounded-full transition-all duration-300 ${notifs[key] ? "bg-teal-500" : "bg-gray-700"
                    }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${notifs[key] ? "translate-x-5" : "translate-x-0"
                      }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════ QUICK LINKS ══════════ */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-base font-semibold text-white mb-4">Quick Links</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: "Privacy Policy", desc: "How we handle your data" },
              { label: "Terms of Service", desc: "Platform usage terms" },
              { label: "Help & Support", desc: "Get assistance from the team" },
              { label: "Report an Issue", desc: "Report bugs or feedback" },
            ].map(({ label, desc }) => (
              <button
                key={label}
                className="flex items-center justify-between p-4 bg-gray-800/40 rounded-xl border border-gray-700/50 hover:border-teal-500/40 hover:bg-gray-800 transition-all group text-left"
              >
                <div>
                  <p className="text-sm font-medium text-gray-200 group-hover:text-teal-400 transition-colors">
                    {label}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                </div>
                <ChevronRight size={16} className="text-gray-600 group-hover:text-teal-400 transition-colors" />
              </button>
            ))}
          </div>
        </div>

        {/* ══════════ DANGER ZONE ══════════ */}
        <div className="bg-red-950/20 border border-red-800/40 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center">
              <AlertCircle size={16} className="text-red-400" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-red-400">Danger Zone</h3>
              <p className="text-gray-500 text-xs">These actions are irreversible — proceed with caution</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-red-700/50 text-red-400 text-sm font-medium hover:bg-red-500/10 transition-all">
              <LogOut size={15} />
              Sign Out of All Devices
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-red-700/50 text-red-400 text-sm font-medium hover:bg-red-500/10 transition-all">
              <AlertCircle size={15} />
              Delete My Account
            </button>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-600 pb-4">
          EmployeeEase v1.0 · Build 2025 · All rights reserved
        </p>
      </div>
    </div>
  );
}
