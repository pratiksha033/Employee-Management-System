import React, { useState } from "react";

export default function LoginView({ onShowSignup, onLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin(email, password);
    };

    return (
        <div className="w-full max-w-5xl flex flex-col md:flex-row bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
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
                        Transform Your <br/><span className="text-teal-100">Workplace.</span>
                    </h1>
                    <p className="text-lg text-teal-50/90 font-medium max-w-sm leading-relaxed">
                        Your all-in-one portal for HR, payroll, and performance tracking. Empowering teams to do their best work.
                    </p>
                </div>
            </div>

            {/* Form Panel */}
            <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center bg-white dark:bg-gray-900">
                <div className="max-w-md w-full mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back!</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-8 font-medium">
                        Please enter your details to log in to your account.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all placeholder-gray-400 dark:placeholder-gray-500 shadow-sm"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 text-sm font-semibold">
                                    Password
                                </label>
                                <a href="#" className="text-sm font-medium text-teal-600 dark:text-teal-400 hover:text-teal-500 dark:hover:text-teal-300 transition-colors">
                                    Forgot password?
                                </a>
                            </div>
                            <input
                                id="password"
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
                                Sign In
                            </button>
                        </div>
                    </form>
                    
                    <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-8 font-medium">
                        Don't have an account?{" "}
                        <button
                            type="button"
                            onClick={onShowSignup}
                            className="font-bold text-teal-600 dark:text-teal-400 hover:text-teal-500 transition-colors"
                        >
                            Create an account
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
