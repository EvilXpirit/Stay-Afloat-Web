
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import type { User } from '../types/user';
import AuthScreen from '../pages/AuthScreen';
import HomeScreen from '../pages/HomeScreen';
import JournalScreen from '../pages/JournalScreen';
import MeditateScreen from '../pages/MeditateScreen';
import ChatScreen from '../pages/ChatScreen';
import Sidebar from '../components/Sidebar';
import { authService } from '../services';
import { Leaf, Menu } from 'lucide-react';

const MainLayout: React.FC = () => {
    const [user, setUser] = useState<User | null>(() => {
        const loggedInUser = sessionStorage.getItem('user');
        return loggedInUser ? JSON.parse(loggedInUser) : null;
    });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogin = (loggedInUser: User) => {
        setUser(loggedInUser);
        sessionStorage.setItem('user', JSON.stringify(loggedInUser));
    };

    const handleLogout = () => {
        authService.logout().then(() => {
            setUser(null);
            sessionStorage.removeItem('user');
        });
    };

    if (!user) {
        return <AuthScreen onLogin={handleLogin} />;
    }

    return (
        <div className="flex h-screen bg-[#FAF9F6] text-[#2F4F4F]">
            <Sidebar user={user} onLogout={handleLogout} isSidebarOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)} />
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="flex items-center justify-between p-4 bg-[#FAF9F6]/80 backdrop-blur-sm border-b border-gray-200 md:hidden">
                    <div className="flex items-center gap-2">
                         <Leaf className="w-6 h-6 text-[#4DB6AC]"/>
                        <span className="text-xl font-bold text-[#2F4F4F]">StayAfloat</span>
                    </div>
                    <button onClick={() => setIsSidebarOpen(true)} className="text-slate-600">
                        <Menu />
                    </button>
                </header>
                <div className="flex-1 overflow-y-auto">
                    <Routes>
                        <Route path="/" element={<HomeScreen userName={user.name} />} />
                        <Route path="/journal" element={<JournalScreen />} />
                        <Route path="/meditate" element={<MeditateScreen />} />
                        <Route path="/chat" element={<ChatScreen />} />
                        {/* Placeholder routes for drawer items */}
                        <Route path="/profile" element={<div>Profile Page</div>} />
                        <Route path="/settings" element={<div>Settings Page</div>} />
                        <Route path="/about" element={<div>About Page</div>} />
                    </Routes>
                </div>
            </main>
        </div>
    );
};
export default MainLayout;
