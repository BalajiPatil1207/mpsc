import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import ProgressBar from '../components/common/ProgressBar';
import Badge from '../components/common/Badge';
import { Trophy, Flame, Star, Play, Award, BarChart2, Zap, Rocket, CheckCircle2, ChevronRight, Activity } from 'lucide-react';
import CategoryGrid from '../components/dashboard/CategoryGrid';
import mascotImg from '../assets/cartoons/mascot.png';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/user/profile');
      setStats(response.data.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-blue-600 font-bold animate-pulse">Loading Warrior Dashboard...</div>;
  if (!stats) return <div className="p-8 text-center text-red-500 font-bold">Failed to load data. Please refresh the page.</div>;

  const { user: userData, recentProgress, stats: userStats } = stats;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-stretch mb-10 gap-6">
          <div className="flex-1 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center gap-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[5rem] -mr-8 -mt-8 transition-all group-hover:scale-110"></div>
            
            <div className="relative z-10 w-24 h-24 flex-shrink-0">
               <img src={mascotImg} alt="Mascot" className="w-full h-full object-contain drop-shadow-xl animate-float" />
            </div>
            
            <div className="relative z-10">
              <h1 className="text-3xl font-black text-gray-900 mb-1">Jai Hind, Warrior {userData.username}!</h1>
              <p className="text-gray-500 font-bold max-w-md">
                "Small steps every day lead to big victories. Which fortress are we conquering today?"
              </p>
              <div className="mt-4 flex gap-2">
                 <span className="bg-orange-100 text-orange-700 text-[10px] font-black px-2 py-1 rounded-lg uppercase">Daily Goal: 500 XP</span>
                 <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-2 py-1 rounded-lg uppercase">Level {userData.level}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-blue-900 p-8 rounded-[2.5rem] shadow-xl text-white flex flex-col justify-center items-center text-center min-w-[240px]">
             <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-2">Current Rank</p>
             <div className="p-4 bg-white/10 rounded-3xl mb-3">
                <Trophy size={40} className="text-yellow-400" />
             </div>
             <h3 className="text-xl font-black">MPSC ASPIRANT</h3>
             <button className="mt-4 text-xs font-bold text-blue-300 hover:text-white transition-colors" onClick={logout}>Sign Out</button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                <Trophy size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Points</p>
                <p className="text-2xl font-bold">{userData.points}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
                <Flame size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Daily Streak</p>
                <p className="text-2xl font-bold">{userData.streak} Days</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                <Star size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Current Level</p>
                <p className="text-2xl font-bold">Lvl {userData.level}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                <Award size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Badges Won</p>
                <p className="text-2xl font-bold">{userData.badges.length}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Categories Section */}
        <CategoryGrid />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          <div className="lg:col-span-2 space-y-8">
            {/* LeetCode Style Stats */}
            <Card className="p-8 border-none shadow-sm rounded-[2.5rem]">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
                  <Activity className="text-emerald-500" />
                  Performance Analytics
                </h2>
                <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest">Total Solved: {userStats.totalSolved}</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Easy */}
                <div className="flex flex-col items-center">
                  <div className="relative w-24 h-24 mb-4">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100" />
                      <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - 0.7)} className="text-emerald-500" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xl font-black">70%</span>
                    </div>
                  </div>
                  <span className="font-bold text-gray-700">Easy</span>
                  <span className="text-xs text-gray-400 font-medium">14/20 Solved</span>
                </div>

                {/* Medium */}
                <div className="flex flex-col items-center">
                  <div className="relative w-24 h-24 mb-4">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100" />
                      <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - 0.4)} className="text-yellow-500" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xl font-black">40%</span>
                    </div>
                  </div>
                  <span className="font-bold text-gray-700">Medium</span>
                  <span className="text-xs text-gray-400 font-medium">8/20 Solved</span>
                </div>

                {/* Hard */}
                <div className="flex flex-col items-center">
                  <div className="relative w-24 h-24 mb-4">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100" />
                      <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - 0.1)} className="text-red-500" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xl font-black">10%</span>
                    </div>
                  </div>
                  <span className="font-bold text-gray-700">Hard</span>
                  <span className="text-xs text-gray-400 font-medium">2/20 Solved</span>
                </div>
              </div>

              {/* Activity Map (Mock) */}
              <div className="mt-10 pt-10 border-t border-gray-50">
                 <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-bold text-gray-700">Mission Consistency</span>
                    <span className="text-xs text-gray-500">Last 12 Months</span>
                 </div>
                 <div className="flex flex-wrap gap-1">
                    {[...Array(50)].map((_, i) => (
                      <div key={i} className={`w-3 h-3 rounded-sm ${Math.random() > 0.5 ? 'bg-emerald-500' : Math.random() > 0.3 ? 'bg-emerald-200' : 'bg-gray-100'}`}></div>
                    ))}
                 </div>
              </div>
            </Card>

            <Card className="p-8 border-none shadow-sm rounded-[2.5rem]">
              <h2 className="text-xl font-bold mb-6 flex items-center justify-between">
                <span>Recent Battles</span>
                <button className="text-xs text-blue-600 font-bold flex items-center gap-1">View All <ChevronRight size={14} /></button>
              </h2>
              <div className="space-y-4">
                {recentProgress.length > 0 ? (
                  recentProgress.map((p, i) => (
                    <div key={i} className="flex justify-between items-center p-5 bg-gray-50/50 hover:bg-gray-50 rounded-2xl transition-colors border border-transparent hover:border-gray-100">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                           <CheckCircle2 className="text-emerald-500" size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">Quiz Mission Completed</p>
                          <p className="text-xs text-gray-400 font-medium">{new Date(p.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-gray-900">{p.score}/{p.totalQuestions}</p>
                        <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md uppercase">+{p.score * 10} XP</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                       <Rocket className="text-gray-300" />
                    </div>
                    <p className="text-gray-500 font-bold">No missions yet. Start your journey!</p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="p-8 border-none shadow-sm rounded-[2.5rem] bg-white">
              <h2 className="text-xl font-bold mb-6">Mastery Badges</h2>
              <div className="grid grid-cols-2 gap-4">
                {userData.badges.map((badge, i) => (
                  <div key={i} className="flex flex-col items-center text-center p-4 bg-orange-50 rounded-2xl border border-orange-100 group">
                    <Award size={32} className="text-orange-500 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-black text-orange-700 leading-tight">{badge.name}</span>
                  </div>
                ))}
                {userData.badges.length === 0 && (
                  <div className="col-span-2 text-center py-6 text-gray-400 italic font-medium">No badges earned yet.</div>
                )}
              </div>
            </Card>

            <Card className="p-8 border-none shadow-sm rounded-[2.5rem] bg-gradient-to-br from-indigo-600 to-blue-700 text-white relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-xl font-bold mb-2">Daily Streak</h2>
                <div className="flex items-center gap-3 mb-6">
                   <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                      <Flame size={24} className="text-orange-400" />
                   </div>
                   <div>
                      <p className="text-3xl font-black">{userData.streak}</p>
                      <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest">Days Streak</p>
                   </div>
                </div>
                <p className="text-sm font-medium text-indigo-100 leading-relaxed italic">
                  "Excellence is not an act, but a habit. Keep your streak alive, Warrior!"
                </p>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
