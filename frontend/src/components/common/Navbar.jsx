import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Home, BookOpen, PenTool, LayoutDashboard, BrainCircuit, Bell, Settings, UserCircle, Camera } from 'lucide-react';

const Navbar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [theme, setTheme] = useState('dark');

  // Dummy auth for visual display if context isn't perfectly connected yet
  const dummyUser = user || { name: 'Balaji', email: 'balaji@example.com' };

  const navLinks = [
    { name: 'Home', path: '/dashboard', icon: Home },
    { name: 'Study', path: '/study', icon: BookOpen },
    { name: 'Tests', path: '/tests', icon: PenTool },
    { name: 'Scan Notes', path: '/scanner', icon: Camera },
    { name: 'AI Coach', path: '/ai-coach', icon: BrainCircuit },
    { name: 'Admin', path: '/admin/syllabus', icon: Settings },
  ];

  return (
    <>
      {/* Desktop Top Navbar */}
      <nav className={`hidden md:block sticky top-0 z-50 border-b backdrop-blur-xl transition-colors duration-300 ${
        theme === 'dark' 
          ? 'bg-[#0B0F19]/80 border-white/10' 
          : 'bg-white/80 border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <BrainCircuit size={22} />
            </div>
            <span className={`text-2xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              MahaPrep <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">AI</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-2 bg-slate-100 dark:bg-white/5 p-1.5 rounded-2xl border border-slate-200 dark:border-white/10">
            {navLinks.map((link) => {
              const isActive = location.pathname.includes(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive 
                      ? 'bg-white dark:bg-[#1E293B] text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/5'
                  }`}
                >
                  <link.icon size={18} className={isActive ? "opacity-100" : "opacity-70"} />
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-5">
            <button className={`p-2.5 rounded-xl transition-colors ${
              theme === 'dark' ? 'bg-white/5 hover:bg-white/10 text-gray-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}>
              <Bell size={20} />
            </button>
            <div className={`flex items-center gap-3 pl-5 border-l ${theme === 'dark' ? 'border-white/10' : 'border-slate-200'}`}>
              <div className="text-right hidden sm:block">
                <p className={`text-sm font-bold leading-none ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{dummyUser.name}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 mt-1">Pro Member</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 flex items-center justify-center text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700">
                <UserCircle size={24} />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Top Header (Minimal) */}
      <nav className={`md:hidden sticky top-0 z-50 border-b backdrop-blur-xl px-4 h-16 flex items-center justify-between ${
        theme === 'dark' ? 'bg-[#0B0F19]/90 border-white/10 text-white' : 'bg-white/90 border-slate-200 text-slate-900'
      }`}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
            <BrainCircuit size={18} />
          </div>
          <span className="text-xl font-black tracking-tight">MahaPrep AI</span>
        </div>
        <button className="p-2 relative">
          <Bell size={22} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-[#0B0F19]"></span>
        </button>
      </nav>

      {/* Mobile Bottom Navigation (App Style) */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 z-50 border-t pb-safe ${
        theme === 'dark' ? 'bg-[#0B0F19]/90 border-white/10 backdrop-blur-xl' : 'bg-white/90 border-slate-200 backdrop-blur-xl'
      }`}>
        <div className="flex items-center justify-around h-16 px-2">
          {navLinks.map((link) => {
            const isActive = location.pathname.includes(link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                  isActive 
                    ? 'text-indigo-600 dark:text-indigo-400' 
                    : 'text-slate-400 dark:text-gray-500'
                }`}
              >
                <link.icon size={22} className={isActive ? "opacity-100" : "opacity-70"} />
                <span className="text-[10px] font-bold tracking-wide">{link.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Navbar;
