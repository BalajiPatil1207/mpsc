import React, { useState } from 'react';
import { 
  Flame, CheckCircle2, ChevronRight, BookOpen, 
  Target, GraduationCap, BarChart2, Star, Calendar, Clock, RotateCcw, 
  Camera, Timer, XCircle, FileText, FolderOpen
} from 'lucide-react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [theme, setTheme] = useState('dark');
  const [examDateStr, setExamDateStr] = useState(null);
  const [daysLeft, setDaysLeft] = useState(0);

  // Dynamic user data
  const [progress, setProgress] = useState(0);
  const [streak, setStreak] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [weakAreas, setWeakAreas] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);
  
  const navigate = useNavigate();
  const { user } = useAuth();

  React.useEffect(() => {
    fetchExamDate();
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      const res = await api.get('/user/dashboard-stats');
      const data = res.data.data;
      setProgress(data.progress);
      setStreak(data.streak);
      setTasks(data.tasks);
      setWeakAreas(data.weakAreas);
    } catch (e) {
      console.log('Error fetching stats', e);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchExamDate = async () => {
    try {
      const res = await api.get('/syllabus/exam-date');
      const dateString = res.data.data?.examDate;
      if (dateString) {
        setExamDateStr(dateString);
        
        // Calculate days left
        const targetDate = new Date(dateString);
        const today = new Date();
        const diffTime = targetDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setDaysLeft(diffDays > 0 ? diffDays : 0);
      }
    } catch (e) {
      console.log('Error fetching Exam Date', e);
    }
  };

  // Dummy logic just for showcasing the design
  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-[#0B0F19] text-gray-100' 
        : 'bg-[#F8FAFC] text-slate-900'
    }`}>
      
      {/* Background gradients for premium feel */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 ${
          theme === 'dark' ? 'bg-indigo-600' : 'bg-indigo-300'
        } -translate-y-1/2 translate-x-1/3`} />
        <div className={`absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-[150px] opacity-20 ${
          theme === 'dark' ? 'bg-purple-600' : 'bg-purple-300'
        } translate-y-1/3 -translate-x-1/4`} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-4 md:p-8 pt-8 md:pt-12">
        
        {/* Header Options */}
        <div className="flex justify-end mb-4">
          <button onClick={toggleTheme} className="px-4 py-2 rounded-full border border-indigo-500/30 text-indigo-500 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
            Toggle {theme === 'light' ? 'Dark' : 'Light'} Mode
          </button>
        </div>

        {/* Top greeting and streak */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div>
            <p className="text-sm md:text-base font-medium opacity-70 mb-1">Welcome back,</p>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight capitalize">{user?.name?.split(' ')[0] || 'Scholar'} 👋</h1>
          </div>
          
          <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl border ${
            theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'
          } backdrop-blur-sm`}>
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-500">
              <Flame size={20} className="fill-orange-500" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest opacity-60 font-bold">Your Streak</p>
              <p className="text-lg font-black tracking-tight flex items-center gap-2">
                {streak} {streak === 1 ? 'Test' : 'Tests'} Given <span className="text-orange-500 text-sm">🔥</span>
              </p>
            </div>
          </div>
        </div>

        {/* Main Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Left Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Exam Countdown Card */}
            <div className={`relative overflow-hidden p-8 rounded-[2rem] border ${
              theme === 'dark' 
                ? 'bg-gradient-to-br from-indigo-950 to-[#0F172A] border-indigo-900/50' 
                : 'bg-gradient-to-br from-indigo-50 to-white border-indigo-100 shadow-premium'
            }`}>
              <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Target size={18} className="text-indigo-500" />
                    <span className="text-xs font-bold tracking-[0.2em] uppercase text-indigo-500">EXAM GOAL</span>
                  </div>
                  <h2 className="text-3xl font-black mb-1">MPSC Target {examDateStr ? '' : '- JAN 2027'}</h2>
                  <p className="text-indigo-500 flex items-center gap-2 font-semibold">
                    <Calendar size={16} /> 
                    {examDateStr ? new Date(examDateStr).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'No exact date set - approx.'}
                  </p>
                </div>

                <div className={`flex flex-col items-end pl-6 border-l ${theme === 'dark' ? 'border-white/10' : 'border-slate-200'}`}>
                  <p className="text-5xl font-black mb-1">{examDateStr ? daysLeft : '470'}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Days Left</p>
                </div>
              </div>

              {/* Syllabus Progress */}
              <div className="mt-10">
                <div className="flex justify-between items-end mb-3">
                  <span className="text-sm font-semibold opacity-80">Syllabus Progress</span>
                  <span className="text-2xl font-black tracking-tighter">{progress}%</span>
                </div>
                <div className={`h-3 w-full rounded-full overflow-hidden ${theme === 'dark' ? 'bg-white/10' : 'bg-indigo-100'}`}>
                  <div className="h-full bg-indigo-500 rounded-full relative transition-all duration-1000" style={{ width: `${progress}%` }}>
                    <div className="absolute top-0 right-0 bottom-0 w-10 bg-gradient-to-r from-transparent to-white/30" />
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Reading Target */}
            <div className={`relative overflow-hidden p-6 rounded-[2rem] border flex items-center justify-between ${
              theme === 'dark' ? 'bg-[#151B2B] border-white/10' : 'bg-white border-slate-200 shadow-sm'
            }`}>
               <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2">Daily Reading Target</h3>
                  <h2 className="text-2xl font-black uppercase">History (Ancient)</h2>
                  <p className="text-sm font-medium opacity-70 mt-1 flex items-center gap-2">
                     <BookOpen size={16} className="text-indigo-400" />
                     Pages 145 - 168 (24 Pages)
                  </p>
               </div>
               
               <div className="flex flex-col items-end gap-4">
                  <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                     <BookOpen size={24} className="text-orange-500" />
                  </div>
                  <button className="px-6 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-widest transition-colors">
                     Mark Completed
                  </button>
               </div>
            </div>

            {/* Today's Mission & Timeline */}
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Target className="text-purple-500" /> 
                Today's Mission
              </h2>
              
              <div className="space-y-4">
                {statsLoading ? (
                   <div className="p-5 text-center opacity-50">Loading your mission...</div>
                ) : tasks.map((task, i) => (
                  <div key={i} className={`group flex items-center justify-between p-5 rounded-[1.5rem] border transition-all ${
                    task.done 
                      ? (theme === 'dark' ? 'bg-white/5 border-white/5 opacity-50' : 'bg-slate-50 border-slate-200 opacity-60')
                      : (theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-slate-200 shadow-sm hover:shadow-md')
                  }`}>
                    <div className="flex items-center gap-5">
                      <button className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                        task.done 
                          ? 'bg-emerald-500 text-white' 
                          : (theme === 'dark' ? 'bg-white/10 text-transparent hover:bg-white/20' : 'bg-slate-100 border border-slate-200 hover:bg-slate-200 text-transparent')
                      }`}>
                        <CheckCircle2 size={16} className={task.done ? "text-white" : "opacity-0"} />
                      </button>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-bold uppercase tracking-widest ${task.color}`}>{task.subject}</span>
                      {task.isTest && <span className="text-[9px] bg-purple-500/20 text-purple-500 px-2 py-0.5 rounded-full font-bold">TEST</span>}
                        </div>
                        <h4 className={`font-semibold ${task.done ? 'line-through' : ''}`}>{task.topic}</h4>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium opacity-60 flex items-center gap-1.5"><Clock size={14}/> {task.time}</span>
                      {!task.done && <button onClick={() => navigate(task.isTest ? '/quiz' : '/study')} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold uppercase rounded-xl transition-colors">
                        START MISSION
                      </button>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column / Side Panel */}
          <div className="space-y-8">
            
            {/* AI Coach Callout */}
            <div className={`p-6 md:p-8 rounded-[2rem] border relative overflow-hidden ${
              theme === 'dark' 
                ? 'bg-gradient-to-b from-[#1E1B4B] to-[#0A0520] border-purple-500/30' 
                : 'bg-gradient-to-b from-purple-50 to-white border-purple-200 shadow-premium'
            }`}>
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <RotateCcw size={100} />
              </div>
              
              <div className="relative z-10">
                <span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-600 dark:text-purple-400 text-[10px] font-black uppercase tracking-widest rounded-full mb-4">
                  AI Study Coach
                </span>
                
                <h3 className="text-xl font-bold mb-3 leading-snug" style={{ fontFamily: "'Noto Sans Devanagari', 'Tiro Devanagari Marathi', sans-serif" }}>
                  "आज History ला extra 30 minutes दिले आहेत कारण मागील 3 tests मध्ये या topic ची accuracy कमी आहे."
                </h3>
                
                <p className="text-sm opacity-70 mb-6 leading-relaxed" style={{ fontFamily: "'Noto Sans Devanagari', 'Tiro Devanagari Marathi', sans-serif" }}>
                  तुम्ही Fundamental Rights मधील 7 Mistakes आज revise करणार आहात.
                </p>
                
                <button onClick={() => navigate('/ai-coach')} className="w-full py-4 bg-purple-500 hover:bg-purple-600 text-white rounded-2xl font-bold tracking-wide transition-colors flex items-center justify-center gap-2">
                  TALK TO COACH <ChevronRight size={18} />
                </button>
              </div>
            </div>

            {/* Wake-Up Revision Test */}
            <div className={`p-6 rounded-[2rem] border ${
              theme === 'dark' ? 'bg-[#1E1B4B]/50 border-purple-500/20' : 'bg-purple-50 border-purple-200 shadow-sm'
            }`}>
               <h3 className="text-[10px] uppercase font-bold tracking-widest opacity-60 mb-2">Wake-up Revision Modal</h3>
               <h2 className="text-xl font-black mb-1">MORNING REVISION TEST</h2>
               <p className="text-sm opacity-70 mb-6">5 Questions Due</p>
               <button onClick={() => navigate('/tests')} className="w-full py-3 bg-purple-500 hover:bg-purple-400 text-white font-bold rounded-xl flex items-center justify-center transition-colors">
                  START TEST
               </button>
            </div>

            {/* Weak Areas */}
            <div className={`p-6 rounded-[2rem] border ${
              theme === 'dark' ? 'bg-[#111827]/60 border-white/5' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <h3 className="text-sm font-bold uppercase tracking-widest opacity-60 mb-6">Your Weak Areas</h3>
              
              <div className="space-y-5">
                {statsLoading ? (
                   <p className="text-sm opacity-50 text-center">Loading weak areas...</p>
                ) : weakAreas.map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-2">
                       <span className="font-semibold">{item.name}</span>
                       <span className="font-bold opacity-70">{item.score}%</span>
                    </div>
                    <div className={`h-1.5 w-full rounded-full ${theme === 'dark' ? 'bg-white/10' : 'bg-slate-100'}`}>
                      <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.score}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions Footer Card */}
            <div className={`p-6 rounded-[2rem] border flex flex-col gap-4 ${
              theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-white border-slate-200'
            }`}>
               <h3 className="text-[10px] uppercase font-bold tracking-widest opacity-60">Quick Actions</h3>
               <div className="grid grid-cols-3 gap-3">
                  <button onClick={() => navigate('/scanner')} className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-colors ${theme === 'dark' ? 'border-white/10 hover:bg-white/5' : 'border-slate-200 hover:bg-slate-50'}`}>
                     <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mb-2">
                        <Camera size={18} className="text-blue-500" />
                     </div>
                     <span className="text-xs font-bold text-center">Scan Book Page</span>
                  </button>
                  <button className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-colors ${theme === 'dark' ? 'border-white/10 hover:bg-white/5' : 'border-slate-200 hover:bg-slate-50'}`}>
                     <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center mb-2">
                        <Timer size={18} className="text-orange-500" />
                     </div>
                     <span className="text-xs font-bold text-center">Pomodoro</span>
                  </button>
                  <button onClick={() => navigate('/vault')} className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-colors ${theme === 'dark' ? 'border-white/10 hover:bg-white/5' : 'border-slate-200 hover:bg-slate-50'}`}>
                     <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center mb-2">
                        <FolderOpen size={18} className="text-red-500" />
                     </div>
                     <span className="text-xs font-bold text-center">Notes Vault</span>
                  </button>
               </div>
            </div>

          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Dashboard;
