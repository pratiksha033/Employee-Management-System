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
        <div className="w-full max-w-5xl flex flex-col md:flex-row bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 mx-auto mt-10">
            {/* Brand Panel */}
            <div className="w-full md:w-1/2 p-10 md:p-16 bg-gradient-to-br from-teal-400 via-teal-500 to-emerald-600 text-white flex flex-col justify-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-black/10 z-0"></div>
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                
                <div className="relative z-10 mb-8">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 shadow-xl border border-white/20">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight tracking-tight">
                        Join Our <br/><span className="text-teal-100">Platform.</span>
                    </h1>
                    <p className="text-lg text-teal-50/90 font-medium max-w-sm leading-relaxed">
                        Create an admin account to configure your workspace, manage teams, and start building.
                    </p>
                </div>
            </div>

            {/* Form Panel */}
            <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center bg-white dark:bg-gray-900">
                <div className="max-w-md w-full mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Admin Signup</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-8 font-medium">
                        Create your account to get started.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name */}
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all placeholder-gray-400 dark:placeholder-gray-500 shadow-sm"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                placeholder="admin@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all placeholder-gray-400 dark:placeholder-gray-500 shadow-sm"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all placeholder-gray-400 dark:placeholder-gray-500 shadow-sm"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transform hover:-translate-y-0.5 transition-all duration-200"
                            >
                                Sign Up
                            </button>
                        </div>
                    </form>
                    
                    <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-8 font-medium">
                        Already have an account?{" "}
                        <button
                            type="button"
                            onClick={onShowLogin}
                            className="font-bold text-teal-600 dark:text-teal-400 hover:text-teal-500 transition-colors"
                        >
                            Sign in instead
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}