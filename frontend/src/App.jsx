import React, { useState, useEffect } from 'react';
import LoginView from "./components/LoginView";
import SignupView from "./components/SignupView";
import DashboardLayout from "./components/DashboardLayout";

export default function App() {
    const [view, setView] = useState('login'); // 'login', 'signup', or 'dashboard'
    const [user, setUser] = useState(null);

    // Effect to check for an existing token on component mount
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const userName = localStorage.getItem('userName');
        if (token && userName) {
            setUser({ name: userName });
            setView('dashboard');
        }
    }, []);


    const API_BASE_URL = 'http://localhost:4000/api/v1/user'; // Corrected backend URL

    const handleLogin = async (email, password) => {
        console.log('Login attempt:', { email, password });

        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Login failed');
            
            // Store token and user data from backend response
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userName', data.user.name);
            setUser({ name: data.user.name, email: data.user.email });
            setView('dashboard');
            alert(data.message);
        } catch (error) {
            console.error('Login error:', error);
            alert(error.message);
        }
    };

    const handleSignup = async (name, email, password, role) => {
        console.log('Signup attempt:', { name, email, password, role });
        
        try {
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, role }), // Added role to body
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
        console.log('Logging out...');
        // No API call needed based on backend code, just clear local state
        localStorage.removeItem('authToken');
        localStorage.removeItem('userName');
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
        <div className="bg-gray-100 flex items-center justify-center min-h-screen p-4 font-sans">
            {renderView()}
        </div>
    );
}

