import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { 
  Github, Linkedin, Mail, MapPin, Phone, 
  Flame, Award, CheckCircle2, ChevronLeft, 
  ChevronRight, Activity, Calendar, User, BookOpen
} from 'lucide-react';
import Card from '../components/common/Card';
import ProgressBar from '../components/common/ProgressBar';

const Profile = () => {
  const { user: authUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState({ tasks: [] });

  useEffect(() => {
    fetchProfileData();
    fetchStudyPlan();
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await api.get('/user/profile');
      setProfileData(response.data.data);
    } catch (error) {
      console.error('Failed to fetch profile', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudyPlan = async () => {
    try {
      const response = await api.get('/study-plan/daily');
      setPlan(response.data.data);
    } catch (error) {
      console.error('Failed to fetch study plan', error);
    }
  };

  const toggleTask = async (index) => {
    const newTasks = [...plan.tasks];
    newTasks[index].completed = !newTasks[index].completed;
    try {
      const response = await api.post('/study-plan/daily', { tasks: newTasks });
      setPlan(response.data.data);
    } catch (error) {
      console.error('Failed to update task', error);
    }
  };

  const addTask = async (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      const newTasks = [...plan.tasks, { title: e.target.value, completed: false }];
      e.target.value = '';
      try {
        const response = await api.post('/study-plan/daily', { tasks: newTasks });
        setPlan(response.data.data);
      } catch (error) {
        console.error('Failed to add task', error);
      }
    }
  };

  if (loading) return <div className="p-8 text-center text-blue-600 font-bold animate-pulse text-2xl">Loading Warrior Profile...</div>;
  if (!profileData) return <div className="p-8 text-center text-red-500 font-bold">Failed to load profile. Please refresh.</div>;

  const { user, recentProgress, stats } = profileData;

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 p-4 md:p-10 font-sans selection:bg-orange-500/30">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-10">
        
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-10">
          <Card className="bg-[#111111] border border-white/5 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-600 via-yellow-500 to-orange-600 animate-gradient-x"></div>
             <div className="flex flex-col items-center text-center">
                <div className="w-40 h-40 rounded-full border-4 border-orange-500/30 p-1.5 mb-6 relative group">
                   <img 
                     src={`https://ui-avatars.com/api/?name=${user.name}&background=f97316&color=fff&size=200&bold=true`} 
                     className="w-full h-full rounded-full object-cover shadow-2xl group-hover:scale-105 transition-transform duration-500" 
                   />
                   <div className="absolute bottom-2 right-2 w-7 h-7 bg-emerald-500 border-4 border-[#111111] rounded-full shadow-lg"></div>
                </div>
                <h1 className="text-3xl font-black text-white tracking-tight">{user.name}</h1>
                <p className="text-sm text-orange-500/80 font-black mb-8 tracking-widest uppercase">Warrior @{user.name.toLowerCase().replace(' ', '_')}</p>
                
                <div className="w-full space-y-6 text-left">
                   <div className="flex items-center gap-4 text-sm font-bold text-gray-400 bg-white/5 p-3 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                      <div className="p-2 bg-orange-500/10 rounded-lg"><MapPin size={18} className="text-orange-500" /></div>
                      {user.location}
                   </div>
                   <div className="flex items-center gap-4 text-sm font-bold text-gray-400 bg-white/5 p-3 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                      <div className="p-2 bg-orange-500/10 rounded-lg"><Mail size={18} className="text-orange-500" /></div>
                      {user.email}
                   </div>
                   <div className="bg-[#1a1a1a] p-6 rounded-[1.5rem] border border-white/5 shadow-inner">
                      <p className="text-[10px] text-orange-500 font-black uppercase tracking-[0.2em] mb-3">Biography</p>
                      <p className="text-sm leading-relaxed text-gray-300 font-medium italic">"{user.bio}"</p>
                   </div>
                </div>

                <div className="flex gap-4 mt-10 w-full">
                   <button className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5 flex items-center justify-center gap-2 font-bold text-white"><Github size={18} /> GitHub</button>
                   <button className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5 flex items-center justify-center gap-2 font-bold text-white"><Linkedin size={18} /> LinkedIn</button>
                </div>
             </div>
          </Card>

          {/* Streak Section */}
          <Card className="bg-[#111111] border border-white/5 p-8 rounded-[2rem] shadow-2xl">
             <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-black text-white flex items-center gap-3">
                   <Flame size={24} className="text-orange-500" />
                   Mission Streak
                </h2>
                <div className="bg-emerald-500/10 text-emerald-500 text-[10px] font-black px-3 py-1 rounded-full border border-emerald-500/20 uppercase tracking-widest">Active</div>
             </div>
             
             <div className="grid grid-cols-2 gap-6 mb-10">
                <div className="bg-emerald-500/5 p-5 rounded-2xl border border-emerald-500/20 text-center">
                   <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest mb-1">Current</p>
                   <p className="text-3xl font-black text-white">{user.streak} <span className="text-xs text-emerald-500/60 uppercase">Days</span></p>
                </div>
                <div className="bg-orange-500/5 p-5 rounded-2xl border border-orange-500/20 text-center">
                   <p className="text-[10px] text-orange-500 font-black uppercase tracking-widest mb-1">Max</p>
                   <p className="text-3xl font-black text-white">{user.longestStreak} <span className="text-xs text-orange-500/60 uppercase">Days</span></p>
                </div>
             </div>

             <div className="bg-[#1a1a1a] p-6 rounded-[1.5rem] border border-white/5">
                <div className="flex justify-between items-center mb-6">
                   <span className="text-sm font-black text-white tracking-widest uppercase">April 2026</span>
                   <div className="flex gap-3">
                      <button className="p-1 hover:text-orange-500 transition-colors"><ChevronLeft size={20} /></button>
                      <button className="p-1 hover:text-orange-500 transition-colors"><ChevronRight size={20} /></button>
                   </div>
                </div>
                <div className="grid grid-cols-7 gap-2.5 text-center text-[10px] font-black text-gray-500 mb-2">
                   {['S','M','T','W','T','F','S'].map(d => <div key={d}>{d}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-2.5 text-center">
                   {[...Array(30)].map((_, i) => (
                     <div key={i} className={`h-8 flex items-center justify-center rounded-lg text-xs font-black transition-all ${i+1 === 29 || i+1 === 30 ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20 scale-110' : 'bg-white/5 text-gray-500 hover:bg-white/10'}`}>
                        {i + 1}
                     </div>
                   ))}
                </div>
             </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-10">
          
          {/* Contributions Heatmap */}
          <Card className="bg-[#111111] border border-white/5 p-10 rounded-[2.5rem] shadow-2xl overflow-hidden relative">
             <div className="absolute top-0 right-0 p-8 opacity-5">
                <Activity size={120} />
             </div>
             <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-black text-white flex items-center gap-4">
                   <Activity className="text-emerald-500" />
                   {recentProgress.length * 10 + 12} Missions Completed
                </h2>
                <div className="bg-white/5 px-6 py-2 rounded-xl text-xs font-black text-emerald-500 border border-emerald-500/20 uppercase tracking-widest">Year 2026</div>
             </div>
             
             <div className="overflow-x-auto pb-4 scrollbar-hide">
                <div className="flex gap-1.5 min-w-[850px]">
                   {[...Array(52)].map((_, week) => (
                     <div key={week} className="flex flex-col gap-1.5">
                        {[...Array(7)].map((_, day) => {
                          const active = Math.random() > 0.7;
                          const intensity = Math.random() > 0.5 ? 'bg-emerald-500 shadow-sm shadow-emerald-500/20' : 'bg-emerald-800';
                          return <div key={day} className={`w-4 h-4 rounded-[4px] transition-all duration-500 ${active ? intensity : 'bg-white/5'}`}></div>
                        })}
                     </div>
                   ))}
                </div>
             </div>
             <div className="mt-6 flex items-center gap-3 text-[10px] font-black text-gray-500 justify-end uppercase tracking-widest">
                <span>Lazy</span>
                <div className="flex gap-1">
                   <div className="w-3 h-3 bg-white/5 rounded-sm"></div>
                   <div className="w-3 h-3 bg-emerald-900 rounded-sm"></div>
                   <div className="w-3 h-3 bg-emerald-700 rounded-sm"></div>
                   <div className="w-3 h-3 bg-emerald-500 rounded-sm"></div>
                </div>
                <span>Warrior</span>
             </div>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
             <Card className="bg-[#111111] border border-white/5 p-10 rounded-[2.5rem] shadow-2xl">
                <h2 className="text-xl font-black text-white mb-10 flex items-center gap-3">
                   <BookOpen size={24} className="text-orange-500" />
                   Mission Mastery
                </h2>
                <div className="flex items-center gap-12">
                   <div className="relative w-40 h-40">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/5" />
                        <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="439.8" strokeDashoffset={439.8 * (1 - 0.45)} className="text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                         <span className="text-4xl font-black text-white tracking-tighter">{stats.totalSolved}</span>
                         <span className="text-[10px] text-orange-500 font-black uppercase tracking-widest mt-1">Total XP</span>
                      </div>
                   </div>
                   <div className="flex-1 space-y-6">
                      <div className="space-y-2">
                         <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                            <span className="text-emerald-500">Geography</span>
                            <span className="text-white">45/100</span>
                         </div>
                         <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 w-[45%]"></div>
                         </div>
                      </div>
                      <div className="space-y-2">
                         <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                            <span className="text-yellow-500">History</span>
                            <span className="text-white">12/100</span>
                         </div>
                         <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-yellow-500 w-[12%]"></div>
                         </div>
                      </div>
                      <div className="space-y-2">
                         <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                            <span className="text-red-500">Polity</span>
                            <span className="text-white">3/100</span>
                         </div>
                         <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-red-500 w-[3%]"></div>
                         </div>
                      </div>
                   </div>
                </div>
             </Card>

             {/* Study Plan Section */}
             <Card className="bg-[#111111] border border-white/5 p-10 rounded-[2.5rem] shadow-2xl">
                <h2 className="text-xl font-black text-white mb-8 flex items-center gap-3">
                   <Calendar size={24} className="text-orange-500" />
                   Daily Strategy
                </h2>
                <div className="space-y-6">
                   <div className="relative group">
                      <input 
                        type="text" 
                        placeholder="Add a new goal..." 
                        onKeyDown={addTask}
                        className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-orange-500/50 outline-none text-white font-medium transition-all group-hover:bg-white/10"
                      />
                      <button className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-500 font-black text-xl">+</button>
                   </div>
                   <div className="max-h-60 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-white/10">
                      {plan.tasks.map((task, i) => (
                        <div key={i} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl group hover:bg-white/10 transition-all border border-transparent hover:border-white/5">
                           <input 
                             type="checkbox" 
                             checked={task.completed} 
                             onChange={() => toggleTask(i)}
                             className="w-6 h-6 rounded-lg border-2 border-white/10 bg-transparent text-orange-500 focus:ring-0 cursor-pointer transition-all checked:bg-orange-500"
                           />
                           <span className={`text-sm font-bold flex-1 transition-all ${task.completed ? 'line-through text-gray-600' : 'text-gray-200'}`}>
                             {task.title}
                           </span>
                        </div>
                      ))}
                      {plan.tasks.length === 0 && (
                        <div className="text-center py-10 opacity-30">
                           <div className="flex justify-center mb-4"><BookOpen size={40} /></div>
                           <p className="text-sm font-bold uppercase tracking-widest">No goals for today</p>
                        </div>
                      )}
                   </div>
                </div>
             </Card>
          </div>

          {/* Recent Submissions */}
          <Card className="bg-[#111111] border border-white/5 p-10 rounded-[2.5rem] shadow-2xl">
             <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-black text-white flex items-center gap-4">
                   <CheckCircle2 className="text-orange-500" />
                   Recent Submissions
                </h2>
                <button className="text-[10px] text-orange-500 font-black uppercase tracking-[0.2em] hover:text-white transition-colors">View Battle History</button>
             </div>
             <div className="grid grid-cols-1 gap-4">
                {recentProgress.map((p, i) => (
                  <div key={i} className="flex items-center justify-between p-6 bg-white/5 rounded-3xl hover:bg-white/10 transition-all border border-white/5 group relative overflow-hidden">
                     <div className="absolute left-0 top-0 w-1 h-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                     <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20">
                           <Trophy className="text-emerald-500" size={24} />
                        </div>
                        <div>
                           <h4 className="text-white text-lg font-black tracking-tight">{p.category} Mission</h4>
                           <div className="flex items-center gap-3 mt-1">
                              <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{new Date(p.date).toLocaleDateString()}</span>
                              <span className="w-1 h-1 bg-white/10 rounded-full"></span>
                              <span className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">{p.difficulty || 'Normal'}</span>
                           </div>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-2xl font-black text-white tracking-tighter">{p.score} <span className="text-xs text-gray-600 font-black">/ {p.totalQuestions}</span></p>
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Victory</span>
                     </div>
                  </div>
                ))}
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
