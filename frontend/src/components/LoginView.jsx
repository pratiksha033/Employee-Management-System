import React, { useState } from "react";

export default function LoginView({ onShowSignup, onLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin(email, password);
    };

    return (
        <div className="w-full max-w-4xl flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Brand Panel */}
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
                <h1 className="text-4xl font-bold mb-3">Sign in to Manage Your Work</h1>
                <p className="text-lg mb-8 text-blue-100">
                Your all-in-one portal for HR, payroll, and performance tracking.
                </p>
                
            </div>

            {/* Form Panel */}
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Hello! employees</h2>
                <p className="text-gray-600 mb-8">
                    Welcome backklll! Please enter your details to log in.
                </p>

                <form onSubmit={handleSubmit}>
                    {/* Email */}
                    <div className="mb-6">
                        <label
                            htmlFor="email"
                            className="block text-gray-700 text-sm font-bold mb-2 uppercase"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="YourEmail@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="shadow-inner appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Password */}
                    <div className="mb-6">
                        <div className="flex justify-between items-baseline">
                            <label
                                htmlFor="password"
                                className="block text-gray-700 text-sm font-bold mb-2 uppercase"
                            >
                                Password
                            </label>
                            <a
                                href="#"
                                className="text-sm text-blue-500 hover:underline"
                            >
                                Forgot?
                            </a>
                        </div>
                        <input
                            id="password"
                            type="password"
                            placeholder="******************"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="shadow-inner appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex flex-col items-center justify-between">
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-500 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-all duration-300 shadow-lg"
                        >
                            LOGIN
                        </button>
                        <p className="text-center text-gray-600 text-sm mt-6">
                            Don&apos;t have an account?{" "}
                            <button
                                type="button"
                                onClick={onShowSignup}
                                className="font-bold text-blue-500 hover:underline"
                            >
                                Sign up
                            </button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
