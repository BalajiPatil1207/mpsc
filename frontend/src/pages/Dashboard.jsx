import React, { useState, useEffect } from 'react';
import { 
  Flame, CheckCircle2, ChevronRight, BookOpen, 
  Target, GraduationCap, BarChart2, Star, Calendar, Clock, RotateCcw, 
  Camera, Timer, XCircle, FileText, FolderOpen, Globe
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
  
  // Pomodoro State
  const [isPomodoroOpen, setIsPomodoroOpen] = useState(false);
  const [pomoTime, setPomoTime] = useState(25 * 60);
  const [pomoActive, setPomoActive] = useState(false);
  
  // Current Affairs State
  const [showCurrentAffairs, setShowCurrentAffairs] = useState(false);
  const [currentAffairs, setCurrentAffairs] = useState([]);
  
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchExamDate();
    fetchUserStats();
    fetchCurrentAffairs();
  }, []);

  useEffect(() => {
    let interval;
    if (pomoActive && pomoTime > 0) {
      interval = setInterval(() => setPomoTime(t => t - 1), 1000);
    } else if (pomoTime === 0) {
      setPomoActive(false);
    }
    return () => clearInterval(interval);
  }, [pomoActive, pomoTime]);

  const formatPomoTime = () => {
    const m = Math.floor(pomoTime / 60);
    const s = pomoTime % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const fetchUserStats = async () => {
    try {
      const res = await api.get('/user/dashboard-stats');
      if (res.data.status) {
        setProgress(res.data.data.progress);
        setStreak(res.data.data.streak);
        setWeakAreas(res.data.data.weakAreas);
      }
      
      const planRes = await api.get('/study-plan/daily');
      const realTasks = planRes.data.data.map((t, idx) => ({
        subject: t.subjectName,
        topic: t.topicName,
        time: '45 min',
        done: t.done === true,
        color: idx % 2 === 0 ? 'text-amber-500' : 'text-blue-500'
      }));
      setTasks(realTasks.length > 0 ? realTasks : [{ subject: 'All Set!', topic: 'All topics completed!', done: true, color: 'text-green-500', time: '-' }]);
    } catch (e) {
      console.log('Error fetching stats', e);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchCurrentAffairs = async () => {
    try {
      const res = await api.get('/current-affairs');
      if (res.data?.data) {
        setCurrentAffairs(res.data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const markMissionComplete = async (idx, subject, topic) => {
    try {
      if (!subject || !topic) return;
      await api.post('/study-plan/complete', { subjectName: subject, topicName: topic });
      
      const newTasks = [...tasks];
      newTasks[idx].done = true;
      setTasks(newTasks);
    } catch(e) {
      console.error('Failed to complete mission', e);
    }
  };

  const undoMissionComplete = async (idx, subject, topic) => {
    try {
      if (!subject || !topic) return;
      await api.post('/study-plan/uncomplete', { subjectName: subject, topicName: topic });
      
      const newTasks = [...tasks];
      newTasks[idx].done = false;
      setTasks(newTasks);
    } catch(e) {
      console.error('Failed to undo mission', e);
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
                      {task.done ? (
                        <button onClick={() => undoMissionComplete(i, task.subject, task.topic)} className="px-4 py-2 border border-slate-400 hover:border-slate-500 hover:text-slate-500 text-xs font-bold uppercase rounded-xl transition-colors">
                          UNDO
                        </button>
                      ) : (
                        <button onClick={() => markMissionComplete(i, task.subject, task.topic)} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase rounded-xl transition-colors">
                          MARK DONE
                        </button>
                      )}
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

            {/* Daily Current Affairs */}
            <div className={`p-6 rounded-[2rem] border ${
              theme === 'dark' ? 'bg-[#0F172A]/80 border-indigo-500/20' : 'bg-indigo-50/50 border-indigo-100 shadow-sm'
            }`}>
               <div className="flex items-center justify-between mb-4">
                 <h3 className="text-sm font-bold flex items-center gap-2"><Globe className="text-indigo-500" size={18}/> चालू घडामोडी (Today)</h3>
                 <span className="text-[10px] font-black tracking-widest uppercase bg-indigo-500/20 text-indigo-500 px-2 py-0.5 rounded">IMP</span>
               </div>
               
               <div className="space-y-4">
                  {currentAffairs.map((ca, i) => (
                    <React.Fragment key={ca.id || i}>
                      <div className="group cursor-pointer">
                         <h4 className="text-sm font-semibold mb-1 group-hover:text-indigo-500 transition-colors">{ca.title}</h4>
                         <p className="text-xs opacity-70 leading-relaxed">{ca.shortDesc}</p>
                      </div>
                      {i !== currentAffairs.length - 1 && <div className={`h-px w-full ${theme === 'dark' ? 'bg-white/10' : 'bg-slate-200'}`}></div>}
                    </React.Fragment>
                  ))}
               </div>
               <button onClick={() => setShowCurrentAffairs(true)} className="w-full mt-4 py-2 border border-indigo-500/30 text-indigo-500 hover:bg-indigo-500 hover:text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all">
                  Read Full PDF
               </button>
            </div>

            {/* Wake-Up Revision Test */}
            <div className={`p-6 rounded-[2rem] border ${
              theme === 'dark' ? 'bg-[#1E1B4B]/50 border-purple-500/20' : 'bg-purple-50 border-purple-200 shadow-sm'
            }`}>
               <h3 className="text-[10px] uppercase font-bold tracking-widest opacity-60 mb-2">Wake-up Revision Modal</h3>
               <h2 className="text-xl font-black mb-1">MORNING REVISION TEST</h2>
               <p className="text-sm opacity-70 mb-6">5 Questions Due</p>
               <button onClick={() => navigate('/test-engine')} className="w-full py-3 bg-purple-500 hover:bg-purple-400 text-white font-bold rounded-xl flex items-center justify-center transition-colors">
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
                  <button onClick={() => setIsPomodoroOpen(true)} className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-colors ${theme === 'dark' ? 'border-white/10 hover:bg-white/5' : 'border-slate-200 hover:bg-slate-50'}`}>
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
      
      {/* Premium Pomodoro Overlay */}
      {isPomodoroOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md transition-all">
          <div className={`relative p-8 rounded-[3rem] border shadow-2xl max-w-sm w-full flex flex-col items-center ${theme === 'dark' ? 'bg-[#151B2B] border-white/10 shadow-black' : 'bg-white border-slate-200 shadow-slate-300'}`}>
            <button onClick={() => setIsPomodoroOpen(false)} className="absolute top-6 right-6 opacity-40 hover:opacity-100 transition-opacity">
               <XCircle size={28} />
            </button>
            <div className="w-20 h-20 rounded-[1.5rem] bg-orange-500/10 flex items-center justify-center text-orange-500 mb-6 border border-orange-500/20">
               <Timer size={36} />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-wider mb-2">Focus Session</h2>
            <p className="text-sm opacity-60 font-medium mb-8 text-center text-balance">MPSC Pomodoro. 25 minutes of deep, unbroken concentration without distractions.</p>
            
            <div className="text-7xl font-black tracking-tighter mb-10 text-orange-500" style={{ fontVariantNumeric: 'tabular-nums' }}>
              {formatPomoTime()}
            </div>
            
            <div className="flex gap-4 w-full">
               <button onClick={() => setPomoActive(!pomoActive)} className={`flex-1 py-4 text-white font-black tracking-widest uppercase rounded-2xl transition-all shadow-lg ${pomoActive ? 'bg-indigo-500 hover:bg-indigo-600 shadow-indigo-500/30' : 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/30'}`}>
                 {pomoActive ? 'PAUSE' : 'START FOCUS'}
               </button>
               <button onClick={() => { setPomoActive(false); setPomoTime(25 * 60); }} className="px-6 py-4 border border-slate-500/30 hover:bg-slate-500/10 font-bold uppercase tracking-widest rounded-2xl transition-colors">
                 RESET
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Current Affairs PDF Reader Modal */}
      {showCurrentAffairs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md transition-all pt-10 pb-10">
          <div className={`relative p-8 rounded-[2rem] border shadow-2xl max-w-2xl w-full h-full max-h-[85vh] flex flex-col ${theme === 'dark' ? 'bg-[#151B2B] border-white/10' : 'bg-white border-slate-200'}`}>
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
               <h2 className="text-2xl font-black flex items-center gap-2"><Globe className="text-indigo-500" /> आजच्या चालू घडामोडी - सविस्तर</h2>
               <button onClick={() => setShowCurrentAffairs(false)} className="opacity-50 hover:opacity-100 transition-opacity">
                 <XCircle size={28} />
               </button>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-8 custom-scrollbar">
               {currentAffairs.map((ca, i) => (
                 <React.Fragment key={'full-'+(ca.id || i)}>
                   <div>
                      <h3 className="text-lg font-bold text-indigo-400 mb-2">{(i+1)}. {ca.title} ({ca.topic})</h3>
                      <p className="text-sm opacity-80 leading-relaxed mb-3">
                        {ca.longDesc}
                      </p>
                      {ca.points && ca.points.length > 0 && (
                        <ul className="text-sm opacity-70 list-disc pl-5 space-y-1">
                           {ca.points.map((pt, pIdx) => (
                             <li key={pIdx}>{pt}</li>
                           ))}
                        </ul>
                      )}
                   </div>
                   {i !== currentAffairs.length - 1 && <div className={`h-px w-full ${theme === 'dark' ? 'bg-white/10' : 'bg-slate-200'}`}></div>}
                 </React.Fragment>
               ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
