import React, { useState, useEffect } from 'react';
import LoginView from "./components/LoginView";
import SignupView from "./components/SignupView";
import DashboardLayout from "./components/DashboardLayout";

export default function App() {
  const [view, setView] = useState('login'); // 'login', 'signup', or 'dashboard'
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const API_BASE_URL = 'http://localhost:4000/api/v1/user';

  // Apply dark mode class to body
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Check auth on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userName = localStorage.getItem('userName');
    const userRole = localStorage.getItem('userRole');
    if (token && userName) {
      setUser({ name: userName, role: userRole });
      setView('dashboard');
    }
  }, []);

  const handleLogin = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed');

      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userName', data.user.name);
      localStorage.setItem('userRole', data.user.role);
      setUser({ name: data.user.name, email: data.user.email, role: data.user.role });
      setView('dashboard');
      alert(data.message);
    } catch (error) {
      console.error('Login error:', error);
      alert(error.message);
    }
  };

  const handleSignup = async (name, email, password, role) => {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Signup failed');

      alert('Signup successful! Please log in.');
      setView('login');
    } catch (error) {
      console.error('Signup error:', error);
      alert(error.message);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setView('login');
    alert('You have been logged out.');
  };

  const renderView = () => {
    switch (view) {
      case 'signup':
        return <SignupView onShowLogin={() => setView('login')} onSignup={handleSignup} />;
      case 'dashboard':
        return <DashboardLayout user={user} onLogout={handleLogout} />;
      case 'login':
      default:
        return <LoginView onShowSignup={() => setView('signup')} onLogin={handleLogin} />;
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-4 font-sans transition-colors duration-300 
      ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}
    >
      {/* 🌙 Toggle Button */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="absolute top-4 right-4 bg-gray-700 text-white px-3 py-1 rounded-md shadow-md hover:bg-gray-600"
      >
        {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>

      {renderView()}
    </div>
  );
}
