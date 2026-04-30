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
    <div className="min-h-screen bg-[#050505] p-4 md:p-10 font-sans selection:bg-orange-500/30">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-stretch mb-12 gap-8">
          <div className="flex-1 bg-[#111111] p-10 rounded-[2.5rem] shadow-2xl border border-white/5 flex items-center gap-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/5 rounded-bl-[8rem] -mr-12 -mt-12 transition-all group-hover:scale-110"></div>
            
            <div className="relative z-10 w-28 h-28 flex-shrink-0">
               <img src={mascotImg} alt="Mascot" className="w-full h-full object-contain drop-shadow-2xl animate-float" />
            </div>
            
            <div className="relative z-10">
              <h1 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">Jai Hind, Warrior {userData.name}!</h1>
              <p className="text-gray-400 font-bold max-w-lg text-sm md:text-base leading-relaxed italic">
                "Small steps every day lead to big victories. Which fortress are we conquering today?"
              </p>
              <div className="mt-6 flex gap-3">
                 <span className="bg-orange-500/10 text-orange-500 text-[10px] font-black px-4 py-1.5 rounded-xl uppercase tracking-widest border border-orange-500/20 shadow-lg shadow-orange-500/5">Daily Goal: 500 XP</span>
                 <span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-black px-4 py-1.5 rounded-xl uppercase tracking-widest border border-emerald-500/20 shadow-lg shadow-emerald-500/5">Level {userData.level}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-600 to-orange-800 p-10 rounded-[2.5rem] shadow-2xl shadow-orange-600/20 text-white flex flex-col justify-center items-center text-center min-w-[280px] border-b-8 border-orange-900">
             <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Warrior Rank</p>
             <div className="p-6 bg-white/10 rounded-[2rem] mb-4 border border-white/10 shadow-inner">
                <Trophy size={50} className="text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
             </div>
             <h3 className="text-2xl font-black tracking-tighter">MPSC ASPIRANT</h3>
             <div className="mt-4 h-1 w-12 bg-white/30 rounded-full"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-16">
          {[
            { label: 'Total Points', value: userData.points, icon: Trophy, color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
            { label: 'Daily Streak', value: `${userData.streak} Days`, icon: Flame, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
            { label: 'Current Level', value: `Lvl ${userData.level}`, icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
            { label: 'Badges Won', value: userData.badges.length, icon: Award, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
          ].map((stat, i) => (
            <Card key={i} className={`p-8 bg-[#111111] border ${stat.border} rounded-[2rem] shadow-xl hover:scale-105 transition-all duration-300`}>
              <div className="flex items-center gap-6">
                <div className={`p-4 ${stat.bg} ${stat.color} rounded-2xl shadow-inner`}>
                  <stat.icon size={28} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="text-3xl font-black text-white tracking-tighter">{stat.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Categories Section */}
        <div className="mb-16">
           <CategoryGrid />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-16">
          <div className="lg:col-span-2 space-y-10">
            {/* Performance Analytics */}
            <Card className="p-10 bg-[#111111] border border-white/5 shadow-2xl rounded-[3rem]">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-black text-white flex items-center gap-4">
                   <Activity className="text-orange-500" />
                   Performance Analytics
                </h2>
                <div className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20 uppercase tracking-widest">Total Solved: {userStats.totalSolved}</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {[
                  { label: 'Easy', percent: 70, solved: '14/20', color: 'text-emerald-500', stroke: '439.8' },
                  { label: 'Medium', percent: 40, solved: '8/20', color: 'text-yellow-500', stroke: '439.8' },
                  { label: 'Hard', percent: 10, solved: '2/20', color: 'text-red-500', stroke: '439.8' },
                ].map((diff, i) => (
                  <div key={i} className="flex flex-col items-center bg-white/5 p-8 rounded-[2rem] border border-white/5 hover:bg-white/10 transition-colors">
                    <div className="relative w-28 h-28 mb-6">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="56" cy="56" r="48" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-white/5" />
                        <circle cx="56" cy="56" r="48" stroke="currentColor" strokeWidth="10" fill="transparent" strokeDasharray="301.6" strokeDashoffset={301.6 * (1 - diff.percent/100)} className={`${diff.color} drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]`} />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-black text-white tracking-tighter">{diff.percent}%</span>
                      </div>
                    </div>
                    <span className={`text-sm font-black uppercase tracking-widest ${diff.color}`}>{diff.label}</span>
                    <span className="text-[10px] text-gray-500 font-black mt-1">{diff.solved} SOLVED</span>
                  </div>
                ))}
              </div>

              {/* Activity Map (Mock) */}
              <div className="mt-12 pt-12 border-t border-white/5">
                 <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mission Consistency</span>
                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Last 12 Months</span>
                 </div>
                 <div className="flex flex-wrap gap-1.5">
                    {[...Array(60)].map((_, i) => (
                      <div key={i} className={`w-4 h-4 rounded-[4px] transition-all ${Math.random() > 0.5 ? 'bg-orange-500 shadow-sm shadow-orange-500/20' : Math.random() > 0.3 ? 'bg-orange-900' : 'bg-white/5'}`}></div>
                    ))}
                 </div>
              </div>
            </Card>

            <Card className="p-10 bg-[#111111] border border-white/5 shadow-2xl rounded-[3rem]">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-black text-white flex items-center gap-4">
                  <Rocket className="text-orange-500" />
                  Recent Battles
                </h2>
                <button className="text-[10px] text-orange-500 font-black uppercase tracking-widest hover:text-white transition-colors">View All History</button>
              </div>
              <div className="space-y-4">
                {recentProgress.length > 0 ? (
                  recentProgress.map((p, i) => (
                    <div key={i} className="flex justify-between items-center p-6 bg-white/5 hover:bg-white/10 rounded-[2rem] transition-all border border-white/5 group overflow-hidden relative">
                      <div className="absolute left-0 top-0 w-1 h-full bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center border border-orange-500/20">
                           <CheckCircle2 className="text-orange-500" size={24} />
                        </div>
                        <div>
                          <h4 className="text-white font-black tracking-tight">{p.category || 'Mission'} Completed</h4>
                          <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">{new Date(p.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-white tracking-tighter">{p.score} <span className="text-xs text-gray-600">/ {p.totalQuestions}</span></p>
                        <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-lg uppercase tracking-widest border border-emerald-500/20">+{p.score * 10} XP</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16 opacity-30">
                    <div className="flex justify-center mb-6"><Rocket size={60} /></div>
                    <p className="text-sm font-black uppercase tracking-[0.2em]">No missions completed yet</p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          <div className="space-y-10">
            {/* Mastery Badges */}
            <Card className="p-10 bg-[#111111] border border-white/5 shadow-2xl rounded-[3rem]">
              <h2 className="text-xl font-black text-white mb-8 flex items-center gap-3">
                 <Award size={24} className="text-orange-500" />
                 Mastery Badges
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {userData.badges.map((badge, i) => (
                  <div key={i} className="flex flex-col items-center text-center p-6 bg-white/5 rounded-3xl border border-white/5 group hover:bg-white/10 transition-all hover:scale-105">
                    <div className="p-4 bg-orange-500/10 rounded-2xl mb-3 shadow-inner">
                       <Award size={36} className="text-orange-500 group-hover:scale-120 transition-transform" />
                    </div>
                    <span className="text-[10px] font-black text-gray-300 leading-tight uppercase tracking-widest">{badge.name}</span>
                  </div>
                ))}
                {userData.badges.length === 0 && (
                  <div className="col-span-2 text-center py-10 opacity-30">
                     <Award size={40} className="mx-auto mb-4" />
                     <p className="text-[10px] font-black uppercase tracking-widest">No badges earned</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Streak Card */}
            <Card className="p-10 bg-gradient-to-br from-orange-600 to-orange-900 shadow-2xl shadow-orange-600/20 rounded-[3rem] text-white relative overflow-hidden group border-b-8 border-orange-950">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                   <h2 className="text-xl font-black tracking-widest uppercase">Elite Streak</h2>
                   <div className="p-2 bg-white/20 rounded-xl"><Flame size={20} /></div>
                </div>
                <div className="flex items-center gap-6 mb-8">
                   <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-[1.5rem] flex items-center justify-center border border-white/20 shadow-2xl">
                      <Flame size={36} className="text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
                   </div>
                   <div>
                      <p className="text-5xl font-black tracking-tighter">{userData.streak}</p>
                      <p className="text-[10px] font-black text-orange-200 uppercase tracking-[0.3em]">Consecutive Days</p>
                   </div>
                </div>
                <p className="text-sm font-bold text-orange-100 leading-relaxed italic opacity-80">
                  "A warrior's strength is found in their consistency. Keep the fire burning!"
                </p>
              </div>
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/5 rounded-full blur-[100px] transition-all group-hover:bg-white/10"></div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
