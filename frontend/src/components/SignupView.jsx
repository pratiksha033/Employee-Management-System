import React, { useState } from "react";

export default function SignupView({ onShowLogin, onSignup }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('employee'); // Added role state

    const handleSubmit = (e) => {
        e.preventDefault();
        onSignup(name, email, password, role); // Pass role to handler
    };

    return (
        <div className="w-full max-w-4xl flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Brand Panel */}
             <div className="w-full md:w-1/2 p-8 md:p-12 bg-gradient-to-br from-cyan-400 to-blue-600 text-white flex flex-col justify-center items-start">
                <div className="mb-6">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h1 className="text-4xl font-bold mb-3">Sign Up to Manage Your Work</h1>
                <p className="text-lg mb-8 text-blue-100">Empowering Employees, Simplifying Management.</p>
                
            </div>

            {/* Form Panel */}
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
                <p className="text-gray-600 mb-8">Let's get you started!</p>
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2 uppercase" htmlFor="name">
                            Full Name
                        </label>
                        <input
                            className="shadow-inner appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                            id="name"
                            type="text"
                            placeholder="monu baviskar"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2 uppercase" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="shadow-inner appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                            id="email"
                            type="email"
                            placeholder="monubaviskar@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                       <label className="block text-gray-700 text-sm font-bold mb-2 uppercase" htmlFor="password">
                            Password
                        </label>
                        <input
                            className="shadow-inner appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                            id="password"
                            type="password"
                            placeholder="******************"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {/* Role Selection Dropdown */}
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2 uppercase" htmlFor="role">
                            Role
                        </label>
                        <select
                            id="role"
                            className="shadow-inner appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="employee">Employee</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div className="flex flex-col items-center justify-between">
                        <button
                            className="w-full bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-500 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-all duration-300 shadow-lg"
                            type="submit"
                        >
                            SIGN UP
                        </button>
                        <p className="text-center text-gray-600 text-sm mt-6">
                            Already have an account?{' '}
                            <button
                                type="button"
                                onClick={onShowLogin}
                                className="font-bold text-blue-500 hover:underline"
                            >
                                Log in
                            </button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Dashboard View Component
function DashboardView({ user, onLogout }) {
    return (
        <div className="w-full max-w-4xl bg-white p-8 md:p-12 rounded-2xl shadow-2xl text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
                Welcome, {user ? user.name : 'Guest'}!
            </h1>
            <p className="text-gray-600 text-lg mb-8">
                You have successfully logged into your dashboard.
            </p>
            <button
                onClick={onLogout}
                className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-3 px-8 rounded-lg focus:outline-none focus:shadow-outline transition-all duration-300 shadow-lg"
            >
                Logout
            </button>
        </div>
    );
}
