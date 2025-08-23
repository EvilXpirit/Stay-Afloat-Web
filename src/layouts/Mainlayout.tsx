import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import type { User } from '../types/user';
import { authService } from '../services/AuthService';
import { SplashScreen } from '../components/common/CommonComp';
import Sidebar from '../components/common/Sidebar';
import AuthScreen from '../pages/AuthScreen';
import HomeScreen from '../pages/HomeScreen';
import JournalScreen from '../pages/JournalScreen';
import LibraryScreen from '../pages/LibraryScreen';
import MeditateScreen from '../pages/MeditateScreen';
import ChatScreen from '../pages/ChatScreen';
import { Leaf, Menu } from 'lucide-react';

const MainLayout: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                const userData = {
                    name: firebaseUser.displayName,
                    email: firebaseUser.email,
                };
                setUser(userData);
                sessionStorage.setItem('user', JSON.stringify(userData));
            } else {
                setUser(null);
                sessionStorage.removeItem('user');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await authService.logout();
            setUser(null);
            sessionStorage.removeItem('user');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    if (loading) {
        return <SplashScreen />;
    }

    if (!user) {
        return <AuthScreen onLogin={setUser} />;
    }

    return (
        <div className="flex h-screen bg-[#FAF9F6] text-[#2F4F4F]">
            <Sidebar 
                user={user} 
                onLogout={handleLogout} 
                isSidebarOpen={isSidebarOpen} 
                closeSidebar={() => setIsSidebarOpen(false)} 
            />
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="flex items-center justify-between p-4 bg-[#FAF9F6]/80 backdrop-blur-sm border-b border-gray-200 md:hidden">
                    <div className="flex items-center gap-2">
                        <Leaf className="w-6 h-6 text-[#4DB6AC]"/>
                        <span className="text-xl font-bold text-[#2F4F4F]">StayAfloat</span>
                    </div>
                    <button 
                        onClick={() => setIsSidebarOpen(true)} 
                        className="text-slate-600"
                    >
                        <Menu />
                    </button>
                </header>
                <div className="flex-1 overflow-y-auto">
                    <Routes>
                        <Route path="/" element={<HomeScreen userName={user.name || 'Friend'} />} />
                        <Route path="/journal" element={<JournalScreen />} />
                        <Route path="/library" element={<LibraryScreen />} />
                        <Route path="/meditate" element={<MeditateScreen />} />
                        <Route path="/chat" element={<ChatScreen />} />
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