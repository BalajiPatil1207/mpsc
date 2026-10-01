import React, { useState } from 'react';
import { Target, ShieldAlert, Award, Clock, Activity, ChevronRight, PenTool, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Tests = () => {
  const [theme] = useState('dark');
  const navigate = useNavigate();
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualJson, setManualJson] = useState(`[\n  {\n    "q": "New Question?",\n    "options": ["A", "B", "C", "D"],\n    "correct": 0\n  }\n]`);
  const [manualTime, setManualTime] = useState(15);
  const [modalMode, setModalMode] = useState('json');

  const [historyStats, setHistoryStats] = useState({
    testsCount: 0,
    avgAccuracy: 0,
    mcqsSolved: 0,
    mistakesLogged: 0
  });

  React.useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/quiz/history');
      if (res.data && res.data.data) {
         setHistoryStats(res.data.data);
      }
    } catch (e) {
      console.log('Failed to fetch test history');
    }
  };

  const testCategories = [
    {
      title: "Daily Mission",
      desc: "25 Mixed Questions from your current topics",
      icon: Target,
      color: "text-blue-500",
      bgInfo: "bg-blue-500/10",
      time: "20 min",
      action: "Start Now"
    },
    {
      title: "3-Day Mistake Test",
      desc: "Revise what you got wrong previously",
      icon: ShieldAlert,
      color: "text-orange-500",
      bgInfo: "bg-orange-500/10",
      time: "15 min",
      action: "Revise Mistakes"
    },
    {
      title: "Weekly Maha Test",
      desc: "Full Mock Assessment for Rajyaseva",
      icon: Award,
      color: "text-purple-500",
      bgInfo: "bg-purple-500/10",
      time: "120 min",
      action: "Take Mock",
      onClick: async () => {
         try {
            const res = await api.get('/quiz/weekend');
            navigate('/test-engine', { state: { questions: res.data.data, timeLimit: 120 } });
         } catch (e) {
            alert(e.response?.data?.message || 'Failed to generate test. Start by scanning Notes first!');
         }
      }
    },
    {
      title: "Create Manual Test",
      desc: "Paste JSON array of MCQs and set Timer",
      icon: PenTool,
      color: "text-emerald-500",
      bgInfo: "bg-emerald-500/10",
      time: "Custom",
      action: "Create",
      onClick: () => setShowManualModal(true)
    }
  ];

  const handleStartManualTest = async () => {
    try {
      const parsedArray = JSON.parse(manualJson);
      
      // Save it mapping strictly to backend /api/quiz/manual
      await api.post('/quiz/manual', {
         questionsArray: parsedArray,
         timeLimit: manualTime
      });

      setShowManualModal(false);
      navigate('/test-engine', { state: { questions: parsedArray, timeLimit: parseInt(manualTime) } });
    } catch (e) {
      alert('Invalid JSON Format or Server Error. Please ensure it follows EXACT structure.');
    }
  };

  return (
    <div className={`min-h-screen pt-8 px-4 md:px-8 pb-24 transition-colors duration-300 ${
      theme === 'dark' ? 'bg-[#0B0F19] text-gray-100' : 'bg-[#F8FAFC] text-slate-900'
    }`}>
      
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">Test Engine</h1>
          <p className="opacity-70">Adaptive AI testing to master your weak spots.</p>
        </div>

        {/* Test Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {testCategories.map((test, i) => (
            <div key={i} className={`p-8 rounded-[2rem] border relative overflow-hidden group transition-all cursor-pointer ${
              theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-slate-200 hover:shadow-lg'
            }`}>
              <div className="absolute top-0 right-0 w-32 h-32 -mr-10 -mt-10 rounded-full blur-3xl opacity-20 transition-all group-hover:scale-150" style={{ backgroundColor: 'currentColor' }} />
              
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${test.bgInfo} ${test.color}`}>
                <test.icon size={28} />
              </div>
              
              <h3 className="text-xl font-bold tracking-tight mb-2">{test.title}</h3>
              <p className="text-sm opacity-70 mb-8 min-h-[40px]">{test.desc}</p>
              
              <div className="flex items-center justify-between mt-auto">
                <span className="text-sm font-bold opacity-60 flex items-center gap-1.5"><Clock size={16}/> {test.time}</span>
                <button 
                  onClick={test.onClick ? test.onClick : () => alert('Feature coming soon!')} 
                  className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1 transition-colors ${test.bgInfo} ${test.color}`}
                >
                  {test.action} <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Past Performance Summary */}
        <div className={`p-8 rounded-[2rem] border flex flex-col md:flex-row gap-8 items-center ${
          theme === 'dark' ? 'bg-[#111827]/60 border-white/5' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Activity className="text-emerald-500" /> Recent Accuracy</h3>
            <p className="text-sm opacity-70 mb-6">You've averaged {historyStats.avgAccuracy}% across {historyStats.testsCount} tests so far. Keep pushing!</p>
            <div className="flex gap-4">
               <div className="p-4 rounded-xl bg-black/20 border border-white/10 w-full">
                 <p className="text-2xl font-black text-emerald-500">{historyStats.mcqsSolved}</p>
                 <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">MCQs Solved</p>
               </div>
               <div className="p-4 rounded-xl bg-black/20 border border-white/10 w-full">
                 <p className="text-2xl font-black text-rose-500">{historyStats.mistakesLogged}</p>
                 <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Mistakes Logged</p>
               </div>
            </div>
          </div>
          
          <div className="w-48 h-48 relative shrink-0">
             {/* Simple Ring Chart Mock */}
             <svg className="w-full h-full transform -rotate-90">
               <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="16" fill="transparent" className={`opacity-10`} />
               <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="16" fill="transparent" strokeDasharray="502" strokeDashoffset={502 * (1 - historyStats.avgAccuracy / 100)} className={`text-emerald-500`} />
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-emerald-500">{historyStats.avgAccuracy}%</span>
                <span className="text-[10px] font-bold uppercase opacity-60">Accuracy</span>
             </div>
          </div>
        </div>

      </div>

      {/* Manual Test Modal */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
           <div className={`w-full max-w-xl p-8 rounded-[2rem] border ${theme === 'dark' ? 'bg-[#0f172A] border-white/10' : 'bg-white border-slate-200'}`}>
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-bold flex items-center gap-2"><PenTool className="text-emerald-500" /> Create Manual Test</h2>
                 <button onClick={() => setShowManualModal(false)} className="opacity-50 hover:opacity-100 transition-opacity">
                   <X size={24} />
                 </button>
              </div>

              <div className="mb-4">
                 <label className="block text-sm font-bold opacity-70 mb-2">Paste Questions (JSON Array Format)</label>
                 <textarea 
                   rows={8}
                   value={manualJson}
                   onChange={(e) => setManualJson(e.target.value)}
                   className={`w-full p-4 rounded-xl border text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                     theme === 'dark' ? 'bg-black/20 border-white/10 text-emerald-400' : 'bg-slate-50 border-slate-200 text-teal-700'
                   }`}
                 />
                 <p className="text-xs opacity-50 mt-2">Example: <code>[{`{"q":"...", "options":["A","B","C","D"], "correct": 0}`}]</code></p>
              </div>

              <div className="mb-8">
                 <label className="block text-sm font-bold opacity-70 mb-2">Timer Duration (Minutes)</label>
                 <input 
                   type="number"
                   value={manualTime}
                   onChange={(e) => setManualTime(e.target.value)}
                   min="1"
                   max="300"
                   className={`w-full p-4 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                     theme === 'dark' ? 'bg-black/20 border-white/10' : 'bg-slate-50 border-slate-200'
                   }`}
                 />
              </div>

              <button 
                onClick={handleStartManualTest}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-lg transition-all"
              >
                Save & Start Test NOW
              </button>
           </div>
        </div>
      )}

    </div>
  );
};

export default Tests;
