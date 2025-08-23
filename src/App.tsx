
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import type { User, NavItem } from './types/types';
// import { AuthScreen, HomeScreen, JournalScreen, MeditateScreen, ChatScreen } from './pages';
import AuthScreen from './pages/AuthScreen';
import HomeScreen from './pages/HomeScreen';
import JournalScreen from './pages/JournalScreen';
import MeditateScreen from './pages/MeditateScreen';
import ChatScreen from './pages/ChatScreen';
import { authService } from './services/AuthService';
import { auth } from './config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Home, MessageSquare, BookOpen, Leaf, User as UserIcon, Settings, Info, LogOut, Menu, X } from 'lucide-react';
import {SplashScreen}  from './components/common/CommonComp';

const navItems: NavItem[] = [
  { path: '/', name: 'Home', icon: Home },
  { path: '/journal', name: 'Journal', icon: BookOpen },
  { path: '/meditate', name: 'Meditate', icon: Leaf },
  { path: '/chat', name: 'Chat', icon: MessageSquare },
];

const drawerItems: NavItem[] = [
  { path: '/profile', name: 'Profile', icon: UserIcon },
  { path: '/settings', name: 'Settings', icon: Settings },
  { path: '/about', name: 'About Us', icon: Info },
];

// const SplashScreen: React.FC = () => (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5EFE6] text-[#2F4F4F] animate-pulse">
//         <Leaf className="w-24 h-24 text-[#4DB6AC]"/>
//         <h1 className="text-6xl font-bold mt-4">StayAfloat</h1>
//     </div>
// );

const Sidebar: React.FC<{ user: User | null; onLogout: () => void; isSidebarOpen: boolean; closeSidebar: () => void; }> = ({ user, onLogout, isSidebarOpen, closeSidebar }) => {
    const location = useLocation();

    const linkClasses = (path: string) => 
        `flex items-center gap-4 px-4 py-3 rounded-lg transition-colors duration-200 ${
            location.pathname === path
                ? 'bg-[#4DB6AC] text-white shadow-md'
                : 'text-slate-600 hover:bg-teal-100'
        }`;

    return (
        <>
            <div className={`fixed inset-0 bg-black/30 z-30 md:hidden transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={closeSidebar}></div>
            <aside className={`fixed top-0 left-0 h-full bg-[#F5EFE6] w-64 p-4 flex flex-col z-40 transform transition-transform duration-300 md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-between mb-8 md:mb-10">
                    <div className="flex items-center gap-2">
                        <Leaf className="w-8 h-8 text-[#4DB6AC]"/>
                        <span className="text-2xl font-bold text-[#2F4F4F]">StayAfloat</span>
                    </div>
                     <button onClick={closeSidebar} className="md:hidden text-slate-600">
                        <X/>
                    </button>
                </div>

                {user && (
                    <div className="mb-8 p-3 bg-white/50 rounded-lg">
                        <p className="font-bold text-slate-800 truncate">{user.name || 'User'}</p>
                        <p className="text-sm text-slate-500 truncate">{user.email || 'No Email'}</p>
                    </div>
                )}
                
                <nav className="flex-1 space-y-2">
                    <p className="px-4 text-sm font-semibold text-slate-400 uppercase tracking-wider">Menu</p>
                    {navItems.map(item => (
                        <NavLink key={item.path} to={item.path} end className={linkClasses(item.path)} onClick={closeSidebar}>
                            <item.icon className="w-6 h-6"/>
                            <span>{item.name}</span>
                        </NavLink>
                    ))}
                    
                    <div className="pt-6">
                        <p className="px-4 text-sm font-semibold text-slate-400 uppercase tracking-wider">Account</p>
                        {/* Drawer items are placeholders for now */}
                        {drawerItems.map(item => (
                             <a key={item.name} href="#" className={`${linkClasses(item.path)} cursor-not-allowed opacity-60`} onClick={(e) => { e.preventDefault(); closeSidebar(); }}>
                                <item.icon className="w-6 h-6"/>
                                <span>{item.name}</span>
                            </a>
                        ))}
                    </div>
                </nav>

                <div className="mt-auto">
                    <button onClick={onLogout} className="flex items-center gap-4 w-full px-4 py-3 text-slate-600 hover:bg-red-100 rounded-lg transition-colors duration-200">
                        <LogOut className="w-6 h-6"/>
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

const MainLayout: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setUser({
                    name: firebaseUser.displayName,
                    email: firebaseUser.email,
                });
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = () => {
        authService.logout();
    };

    if (loading) {
        return <SplashScreen />;
    }

    if (!user) {
        return <AuthScreen />;
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
                        <Route path="/" element={<HomeScreen userName={user.name || 'Friend'} />} />
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

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <HashRouter>
      {showSplash ? <SplashScreen /> : <MainLayout />}
    </HashRouter>
  );
};

export default App;