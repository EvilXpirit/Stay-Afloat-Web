import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Leaf, LogOut, X } from 'lucide-react';
import type { User, NavItem } from '../../types/types';
import { navItems, drawerItems } from '../../config/navigation';

interface SidebarProps {
  user: User | null;
  onLogout: () => void;
  isSidebarOpen: boolean;
  closeSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  user, 
  onLogout, 
  isSidebarOpen, 
  closeSidebar 
}) => {
  const location = useLocation();

  const linkClasses = (path: string) => 
    `flex items-center gap-4 px-4 py-3 rounded-lg transition-colors duration-200 ${
      location.pathname === path
        ? 'bg-[#4DB6AC] text-white shadow-md'
        : 'text-slate-600 hover:bg-teal-100'
    }`;

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/30 z-30 md:hidden transition-opacity ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`} 
        onClick={closeSidebar}
      />
      <aside className={`fixed top-0 left-0 h-full bg-[#F5EFE6] w-64 p-4 flex flex-col z-40 transform transition-transform duration-300 md:relative md:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
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
            <NavLink 
              key={item.path} 
              to={item.path} 
              end 
              className={linkClasses(item.path)} 
              onClick={closeSidebar}
            >
              <item.icon className="w-6 h-6"/>
              <span>{item.name}</span>
            </NavLink>
          ))}
          
          <div className="pt-6">
            <p className="px-4 text-sm font-semibold text-slate-400 uppercase tracking-wider">Account</p>
            {drawerItems.map(item => (
              <a 
                key={item.name} 
                href="#" 
                className={`${linkClasses(item.path)} cursor-not-allowed opacity-60`} 
                onClick={(e) => { e.preventDefault(); closeSidebar(); }}
              >
                <item.icon className="w-6 h-6"/>
                <span>{item.name}</span>
              </a>
            ))}
          </div>
        </nav>

        <div className="mt-auto">
          <button 
            onClick={onLogout} 
            className="flex items-center gap-4 w-full px-4 py-3 text-slate-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
          >
            <LogOut className="w-6 h-6"/>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;