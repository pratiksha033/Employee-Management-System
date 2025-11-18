import React, { useState } from "react";

export default function SignupView({ onShowLogin, onSignup }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSignup(name, email, password, "admin"); // ✅ Explicitly send "admin"
  };

  return (
    <div className="w-full max-w-4xl flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden mx-auto mt-10">
      {/* Left Panel */}
      <div className="w-full md:w-1/2 p-8 md:p-12 bg-gradient-to-br from-cyan-400 to-blue-600 text-white flex flex-col justify-center items-start">
        <div className="mb-6">
          <svg
            className="w-12 h-12"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="text-4xl font-bold mb-3">Create Admin Account</h1>
        <p className="text-lg mb-8 text-blue-100">
          Only admins can add employees later.
        </p>
      </div>

      {/* Right Panel */}
      <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Admin Signup</h2>
        <p className="text-gray-600 mb-8">
          Create your admin account to manage employees.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2 uppercase">
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="border rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2 uppercase">
              Email
            </label>
            <input
              type="email"
              placeholder="admin@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2 uppercase">
              Password
            </label>
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-500 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-all duration-300"
          >
            SIGN UP
          </button>

          <p className="text-center text-gray-600 text-sm mt-6">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onShowLogin}
              className="font-bold text-blue-500 hover:underline"
            >
              Log In
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
