import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { 
  Github, Linkedin, Mail, MapPin, Phone, 
  Flame, Award, CheckCircle2, ChevronLeft, 
  ChevronRight, Activity, Calendar, User, BookOpen
} from 'lucide-react';
import Card from '../common/Card';
import ProgressBar from '../common/ProgressBar';

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
    <div className="min-h-screen bg-[#0a0a0a] text-gray-300 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-8">
          <Card className="bg-[#1a1a1a] border-none p-6 rounded-3xl overflow-hidden relative group">
             <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 to-yellow-500"></div>
             <div className="flex flex-col items-center text-center">
                <div className="w-32 h-32 rounded-full border-4 border-orange-500/20 p-1 mb-4 relative">
                   <img src={`https://ui-avatars.com/api/?name=${user.name}&background=random&size=200`} className="w-full h-full rounded-full object-cover" />
                   <div className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 border-4 border-[#1a1a1a] rounded-full"></div>
                </div>
                <h1 className="text-2xl font-black text-white">{user.name}</h1>
                <p className="text-sm text-gray-500 font-bold mb-6">@{user.name.toLowerCase().replace(' ', '_')}</p>
                
                <div className="w-full space-y-4 text-left">
                   <div className="flex items-center gap-3 text-sm font-medium text-gray-400">
                      <MapPin size={18} className="text-orange-500" />
                      {user.location}
                   </div>
                   <div className="flex items-center gap-3 text-sm font-medium text-gray-400">
                      <Mail size={18} className="text-orange-500" />
                      {user.email}
                   </div>
                   <div className="bg-[#252525] p-4 rounded-2xl">
                      <p className="text-xs text-gray-500 font-black uppercase mb-2">About</p>
                      <p className="text-sm leading-relaxed">{user.bio}</p>
                   </div>
                </div>

                <div className="flex gap-4 mt-8">
                   <button className="p-3 bg-[#252525] hover:bg-[#333] rounded-xl transition-colors text-white"><Github size={20} /></button>
                   <button className="p-3 bg-[#252525] hover:bg-[#333] rounded-xl transition-colors text-white"><Linkedin size={20} /></button>
                </div>
             </div>
          </Card>

          {/* Streak Section */}
          <Card className="bg-[#1a1a1a] border-none p-6 rounded-3xl">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                   <Flame size={20} className="text-orange-500" />
                   Your Streak
                </h2>
                <div className="w-10 h-6 bg-emerald-500/20 rounded-full flex items-center px-1">
                   <div className="w-4 h-4 bg-emerald-500 rounded-full ml-auto"></div>
                </div>
             </div>
             
             <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-[#252525] p-4 rounded-2xl border-b-4 border-emerald-500">
                   <p className="text-[10px] text-gray-500 font-black uppercase">Current</p>
                   <p className="text-2xl font-black text-white">{user.streak} days</p>
                </div>
                <div className="bg-[#252525] p-4 rounded-2xl border-b-4 border-orange-500">
                   <p className="text-[10px] text-gray-500 font-black uppercase">Longest</p>
                   <p className="text-2xl font-black text-white">{user.longestStreak} days</p>
                </div>
             </div>

             <div className="bg-[#252525] p-4 rounded-2xl">
                <div className="flex justify-between items-center mb-4">
                   <span className="text-sm font-bold text-white">April 2026</span>
                   <div className="flex gap-2">
                      <ChevronLeft size={16} className="cursor-pointer" />
                      <ChevronRight size={16} className="cursor-pointer" />
                   </div>
                </div>
                <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-black text-gray-500">
                   {['S','M','T','W','T','F','S'].map(d => <div key={d}>{d}</div>)}
                   {[...Array(30)].map((_, i) => (
                     <div key={i} className={`h-6 flex items-center justify-center rounded-md ${i+1 === 29 || i+1 === 30 ? 'bg-emerald-500 text-white' : 'bg-[#1a1a1a]'}`}>
                        {i + 1}
                     </div>
                   ))}
                </div>
             </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
          
          {/* Contributions Heatmap */}
          <Card className="bg-[#1a1a1a] border-none p-8 rounded-[2.5rem]">
             <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                   <Activity className="text-emerald-500" />
                   {recentProgress.length * 10 + 12} contributions in the last year
                </h2>
                <div className="bg-[#252525] px-4 py-2 rounded-xl text-xs font-bold">2026</div>
             </div>
             
             <div className="overflow-x-auto">
                <div className="flex gap-1 min-w-[800px]">
                   {[...Array(52)].map((_, week) => (
                     <div key={week} className="flex flex-col gap-1">
                        {[...Array(7)].map((_, day) => {
                          const active = Math.random() > 0.7;
                          const intensity = Math.random() > 0.5 ? 'bg-emerald-500' : 'bg-emerald-800';
                          return <div key={day} className={`w-3.5 h-3.5 rounded-sm ${active ? intensity : 'bg-[#252525]'}`}></div>
                        })}
                     </div>
                   ))}
                </div>
             </div>
             <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-gray-500 justify-end">
                <span>Less</span>
                <div className="w-3 h-3 bg-[#252525] rounded-sm"></div>
                <div className="w-3 h-3 bg-emerald-900 rounded-sm"></div>
                <div className="w-3 h-3 bg-emerald-700 rounded-sm"></div>
                <div className="w-3 h-3 bg-emerald-500 rounded-sm"></div>
                <span>More</span>
             </div>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <Card className="bg-[#1a1a1a] border-none p-8 rounded-[2.5rem]">
                <h2 className="text-lg font-black text-white mb-8 flex items-center gap-2">
                   <BookOpen size={20} className="text-orange-500" />
                   Interview Practice Stats
                </h2>
                <div className="flex items-center gap-8">
                   <div className="relative w-32 h-32">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-[#252525]" />
                        <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="351.8" strokeDashoffset={351.8 * (1 - 0.45)} className="text-orange-500" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                         <span className="text-2xl font-black text-white">{stats.totalSolved}</span>
                         <span className="text-[10px] text-gray-500 font-bold uppercase">Solved</span>
                      </div>
                   </div>
                   <div className="flex-1 space-y-4">
                      <div className="flex justify-between items-center">
                         <span className="text-xs font-bold text-emerald-500">Easy</span>
                         <span className="text-sm font-black text-white">45/100</span>
                      </div>
                      <div className="flex justify-between items-center">
                         <span className="text-xs font-bold text-yellow-500">Medium</span>
                         <span className="text-sm font-black text-white">12/100</span>
                      </div>
                      <div className="flex justify-between items-center">
                         <span className="text-xs font-bold text-red-500">Hard</span>
                         <span className="text-sm font-black text-white">3/100</span>
                      </div>
                   </div>
                </div>
             </Card>

             {/* Study Plan Section */}
             <Card className="bg-[#1a1a1a] border-none p-8 rounded-[2.5rem]">
                <h2 className="text-lg font-black text-white mb-6 flex items-center gap-2">
                   <Calendar size={20} className="text-orange-500" />
                   Daily Study Plan
                </h2>
                <div className="space-y-4">
                   <input 
                     type="text" 
                     placeholder="Add a study goal (e.g., Read Polity Ch. 5)..." 
                     onKeyDown={addTask}
                     className="w-full bg-[#252525] border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                   />
                   <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                      {plan.tasks.map((task, i) => (
                        <div key={i} className="flex items-center gap-3 bg-[#252525] p-3 rounded-xl group">
                           <input 
                             type="checkbox" 
                             checked={task.completed} 
                             onChange={() => toggleTask(i)}
                             className="w-5 h-5 rounded-lg border-none bg-[#333] text-emerald-500 focus:ring-0 cursor-pointer"
                           />
                           <span className={`text-sm font-medium flex-1 ${task.completed ? 'line-through text-gray-600' : 'text-gray-300'}`}>
                             {task.title}
                           </span>
                        </div>
                      ))}
                      {plan.tasks.length === 0 && (
                        <p className="text-center text-gray-500 text-sm py-4 italic">No goals set for today.</p>
                      )}
                   </div>
                </div>
             </Card>
          </div>

          {/* Recent Submissions */}
          <Card className="bg-[#1a1a1a] border-none p-8 rounded-[2.5rem]">
             <h2 className="text-xl font-black text-white mb-8 flex justify-between items-center">
                Recent Submissions
                <button className="text-xs text-orange-500 font-bold uppercase tracking-widest">View All</button>
             </h2>
             <div className="space-y-4">
                {recentProgress.map((p, i) => (
                  <div key={i} className="flex items-center justify-between p-5 bg-[#252525] rounded-2xl hover:bg-[#2d2d2d] transition-colors border-l-4 border-emerald-500">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#1a1a1a] rounded-xl flex items-center justify-center">
                           <CheckCircle2 className="text-emerald-500" />
                        </div>
                        <div>
                           <h4 className="text-white font-black">{p.category} Mission</h4>
                           <p className="text-xs text-gray-500 font-bold uppercase tracking-tighter">Solved on {new Date(p.date).toLocaleDateString()}</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-xl font-black text-white">{p.score}/{p.totalQuestions}</p>
                        <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-500 px-2 py-0.5 rounded uppercase">Passed</span>
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
