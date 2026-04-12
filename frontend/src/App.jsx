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


  // Check auth on mount — fetch full profile so department/_id are available
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) return;
    fetch('http://localhost:4000/api/v1/user/profile', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setUser({ ...data.user, _id: data.user.id || data.user._id });
          setView('dashboard');
        }
      })
      .catch(() => { });
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

      // Fetch full profile to get department + _id
      const profileRes = await fetch('http://localhost:4000/api/v1/user/profile', {
        headers: { Authorization: `Bearer ${data.token}` },
      });
      const profileData = await profileRes.json();
      const fullUser = profileData.success
        ? { ...profileData.user, _id: profileData.user.id || profileData.user._id }
        : { name: data.user.name, email: data.user.email, role: data.user.role };

      setUser(fullUser);
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
      className={`min-h-screen font-sans transition-colors duration-300 
      ${darkMode ? 'bg-slate-950 text-gray-100' : 'bg-slate-50 text-slate-900'}`}
    >
      {/* 🌙 Toggle Button for Auth Pages */}
      {view !== 'dashboard' && (
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="absolute top-4 right-4 bg-white/20 backdrop-blur-md border border-gray-400/20 text-gray-800 dark:text-white px-4 py-2 rounded-xl shadow-lg hover:bg-white/30 transition-all z-50 flex items-center gap-2 text-sm font-semibold"
        >
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      )}

      {view === 'dashboard' ? (
        <DashboardLayout user={user} onLogout={handleLogout} toggleTheme={() => setDarkMode(!darkMode)} darkMode={darkMode} />
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          {renderView()}
        </div>
      )}
    </div>
  );
}
