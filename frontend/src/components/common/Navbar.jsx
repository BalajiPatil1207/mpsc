import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, LogOut, User, Trophy, Play, Flame } from 'lucide-react';
import Button from '../common/Button';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: Trophy },
    { name: 'Start Quiz', path: '/quiz', icon: Play },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <nav className="bg-[#050505] border-b border-white/5 sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center gap-12">
            <Link to="/dashboard" className="flex-shrink-0 flex items-center gap-3">
              <div className="p-2 bg-orange-500 rounded-xl shadow-lg shadow-orange-500/20">
                 <Trophy className="text-white" size={24} />
              </div>
              <span className="text-2xl font-black text-white tracking-tighter">MPSC<span className="text-orange-500">WARRIOR</span></span>
            </Link>
            <div className="hidden sm:flex sm:space-x-10">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="inline-flex items-center px-1 pt-1 text-sm font-black text-gray-400 hover:text-white transition-all relative group"
                >
                  {link.name}
                  <span className="absolute bottom-4 left-0 w-0 h-1 bg-orange-500 transition-all group-hover:w-full rounded-full"></span>
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-6">
            <div className="flex items-center gap-3 px-5 py-2 bg-white/5 text-orange-500 rounded-2xl text-sm font-black border border-white/5 shadow-inner">
              <Flame size={18} />
              {user.points} XP
            </div>
            <div className="h-10 w-[1px] bg-white/10 mx-2"></div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-black text-gray-400 hover:text-red-500 transition-colors"
            >
              <LogOut size={18} />
              LEAVE
            </button>
          </div>

          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 focus:outline-none transition-all"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden bg-[#0a0a0a] border-b border-white/5 animate-in slide-in-from-top duration-300">
          <div className="pt-4 pb-6 space-y-2 px-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-4 px-6 py-4 rounded-2xl text-base font-black text-gray-400 hover:bg-white/5 hover:text-orange-500 transition-all border border-transparent hover:border-white/5"
              >
                <link.icon size={20} />
                {link.name}
              </Link>
            ))}
          </div>
          <div className="pt-6 pb-8 border-t border-white/5 px-4 bg-black/40">
            <div className="flex items-center px-6 mb-6">
              <div className="flex-shrink-0">
                <div className="h-14 w-14 rounded-2xl bg-orange-500 flex items-center justify-center text-white shadow-xl shadow-orange-500/20">
                  <User size={28} />
                </div>
              </div>
              <div className="ml-5">
                <div className="text-lg font-black text-white">{user.name}</div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-0.5">{user.email}</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-4 w-full px-6 py-4 rounded-2xl text-base font-black text-red-500 hover:bg-red-500/10 transition-all"
            >
              <LogOut size={20} />
              LOGOUT MISSION
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
