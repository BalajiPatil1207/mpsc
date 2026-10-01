import React, { useState, useEffect } from 'react';
import { Clock, ChevronLeft, ChevronRight, CheckCircle2, ShieldCheck, XCircle, LayoutList } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios';

const Quiz = () => {
  const [theme] = useState('dark');
  const navigate = useNavigate();
  const location = useLocation();

  const fallbackQuestions = [
    { id: 1, q: "इ.स. १९२१ मध्ये हडप्पा संस्कृतीचा शोध कोणी लावला?", options: ["राखालदास बॅनर्जी", "दयाराम साहनी", "जॉन मार्शल", "अलेक्झांडर कनिंगहॅम"], correct: 1 },
    { id: 2, q: "सिंधू संस्कृतीतील कोणते शहर प्राचीन गोदी (Dockyard) साठी प्रसिद्ध आहे?", options: ["मोहेंजोदारो", "कालीबंगन", "धोलाविरा", "लोथल"], correct: 3 },
    { id: 3, q: "सिंधू संस्कृतीतील लोकांचा मुख्य व्यवसाय कोणता होता?", options: ["शेती", "युद्ध", "शिकार", "खाणकाम"], correct: 0 },
    { id: 4, q: "आर्यांचा मूळ धर्म प्रामुख्याने कोणता होता?", options: ["मूर्तिपूजा", "निसर्गपूजा आणि यज्ञ", "भक्ती आणि कीर्तन", "तांत्रिक विधी"], correct: 1 },
    { id: 5, q: "भारतातील सर्वात प्राचीन घडीचा पर्वत (Fold Mountain) कोणता आहे?", options: ["हिमालय", "सह्याद्री", "अरवली", "विंध्य"], correct: 2 }
  ];

  const questionsArray = location.state?.questions || fallbackQuestions;

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionIdx: optionIdx }
  const [timer, setTimer] = useState(location.state?.timeLimit ? location.state.timeLimit * 60 : 300); // converting minutes to seconds
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [viewingAnswers, setViewingAnswers] = useState(false);
  const [testStats, setTestStats] = useState(null);

  useEffect(() => {
    let interval;
    if (timer > 0 && !isSubmitted) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    } else if (timer === 0 && !isSubmitted) {
      handleFinalSubmit(); // Auto submit
    }
    return () => clearInterval(interval);
  }, [timer, isSubmitted]);

  const handleSelect = (optIdx) => {
    if (isSubmitted) return;
    setAnswers({ ...answers, [currentIdx]: optIdx });
  };

  const calculateScore = () => {
    let score = 0;
    let correctCount = 0;
    let wrongCount = 0;
    let unattempted = 0;

    questionsArray.forEach((q, idx) => {
      if (answers[idx] !== undefined) {
        if (answers[idx] === q.correct) {
          score += 1;
          correctCount++;
        } else {
          score -= 0.25;
          wrongCount++;
        }
      } else {
        unattempted++;
      }
    });
    // Can't have negative total score visually usually, but actual logic can be negative
    return { score, correctCount, wrongCount, unattempted };
  };

  const handleFinalSubmit = async () => {
    setIsSubmitted(true);
    const stats = calculateScore();
    setTestStats(stats);
    
    // Percentage based on max possible score (all correct)
    const maxScore = questionsArray.length;
    // Cap at 0 so accuracy isn't negative
    const percent = Math.max(0, Math.round((stats.score / maxScore) * 100));
    
    try {
      await api.post('/quiz/submit', {
        type: 'AI_Test',
        score: stats.score,
        total: questionsArray.length,
        accuracy: percent
      });
    } catch (e) {
      console.error('Error saving stats:', e);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Render Answer Review Screen
  if (viewingAnswers && isSubmitted) {
    return (
      <div className={`min-h-[calc(100vh-80px)] pt-8 px-4 md:px-8 pb-24 transition-colors ${theme === 'dark' ? 'bg-[#0B0F19] text-gray-100' : 'bg-[#F8FAFC] text-slate-900'}`}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <LayoutList className="text-indigo-500" /> Test Review (Solutions)
            </h1>
            <button onClick={() => setViewingAnswers(false)} className="px-4 py-2 border border-white/20 rounded-lg hover:bg-white/10 transition-colors">
              Back to Score
            </button>
          </div>

          <div className="space-y-8">
            {questionsArray.map((q, qIdx) => {
              const selectedOpt = answers[qIdx];
              const isAttempted = selectedOpt !== undefined;
              const isCorrect = isAttempted && selectedOpt === q.correct;

              return (
                <div key={qIdx} className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151B2B] border-white/10' : 'bg-white border-slate-200'}`}>
                   <div className="flex justify-between items-start mb-4">
                     <span className="font-bold text-lg">Q{qIdx + 1}. {q.q}</span>
                     {!isAttempted ? (
                        <span className="text-xs font-bold px-2 py-1 bg-slate-500/20 text-slate-400 rounded-md">Unattempted (0 Mark)</span>
                     ) : isCorrect ? (
                        <span className="text-xs font-bold px-2 py-1 bg-emerald-500/20 text-emerald-500 rounded-md">Correct (+1 Mark)</span>
                     ) : (
                        <span className="text-xs font-bold px-2 py-1 bg-red-500/20 text-red-500 rounded-md">Incorrect (-0.25 Mark)</span>
                     )}
                   </div>

                   <div className="space-y-3">
                     {q.options.map((opt, oIdx) => {
                        let btnStyle = theme === 'dark' ? 'bg-black/20 border-white/10' : 'bg-slate-50 border-slate-200';
                        let icon = null;

                        if (oIdx === q.correct) {
                           btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-500 font-bold';
                           icon = <CheckCircle2 size={18} />;
                        } else if (isAttempted && selectedOpt === oIdx && selectedOpt !== q.correct) {
                           btnStyle = 'bg-red-500/20 border-red-500 text-red-500 font-bold';
                           icon = <XCircle size={18} />;
                        }

                        return (
                          <div key={oIdx} className={`w-full text-left p-4 rounded-xl border flex justify-between items-center ${btnStyle}`}>
                             <span>{opt}</span>
                             {icon}
                          </div>
                        )
                     })}
                   </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // Render Score Screen
  if (isSubmitted && testStats) {
    const maxScore = questionsArray.length;
    const percent = Math.max(0, Math.round((testStats.score / maxScore) * 100));
    
    return (
      <div className={`min-h-[calc(100vh-80px)] pt-12 px-4 transition-colors ${theme === 'dark' ? 'bg-[#0B0F19] text-gray-100' : 'bg-[#F8FAFC] text-slate-900'}`}>
        <div className={`max-w-2xl mx-auto p-8 rounded-[2rem] border text-center ${theme === 'dark' ? 'bg-[#151B2B] border-white/10' : 'bg-white border-slate-200 shadow-xl'}`}>
           <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${percent >= 60 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
              <ShieldCheck size={48} />
           </div>
           <h2 className="text-3xl font-extrabold mb-2">Test Completed!</h2>
           <p className="opacity-70 mb-8">Negative marking (-0.25) has been applied to wrong answers.</p>
           
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                <p className="text-3xl font-black">{testStats.score.toFixed(2)}<span className="text-sm opacity-50">/{maxScore}</span></p>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-50 mt-1">Net Score</p>
              </div>
              <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-black/20 border-emerald-500/20 text-emerald-500' : 'bg-emerald-50 border-emerald-200 text-emerald-600'}`}>
                <p className="text-3xl font-black">{testStats.correctCount}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mt-1">Correct (+1)</p>
              </div>
              <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-black/20 border-rose-500/20 text-rose-500' : 'bg-rose-50 border-rose-200 text-rose-600'}`}>
                <p className="text-3xl font-black">{testStats.wrongCount}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mt-1">Wrong (-0.25)</p>
              </div>
              <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                <p className="text-3xl font-black opacity-50">{testStats.unattempted}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-50 mt-1">Unattempted</p>
              </div>
           </div>

           <div className="flex flex-col md:flex-row gap-4 justify-center">
             <button onClick={() => setViewingAnswers(true)} className="px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
               <LayoutList size={18} /> View Answers
             </button>
             <button onClick={() => navigate('/dashboard')} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all">
               Return to Dashboard
             </button>
           </div>
        </div>
      </div>
    );
  }

  const q = questionsArray[currentIdx];

  return (
    <div className={`min-h-[calc(100vh-80px)] pt-8 px-4 md:px-8 pb-24 transition-colors duration-300 flex justify-center ${
      theme === 'dark' ? 'bg-[#0B0F19] text-gray-100' : 'bg-[#F8FAFC] text-slate-900'
    }`}>
      
      <div className="w-full max-w-4xl flex flex-col md:flex-row gap-6">
         
         {/* Question Area */}
         <div className="flex-1">
            <div className={`flex justify-between items-center p-4 rounded-t-2xl border-b-0 border ${
              theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'
            }`}>
               <span className="font-bold text-sm opacity-60">Question {currentIdx + 1} of {questionsArray.length}</span>
               <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold text-sm ${
                 timer < 60 ? 'bg-red-500/10 text-red-500 animate-pulse' : (theme === 'dark' ? 'bg-black/40 text-blue-400' : 'bg-slate-100 text-blue-600')
               }`}>
                 <Clock size={16} /> {formatTime(timer)}
               </div>
            </div>

            <div className={`p-6 md:p-10 rounded-b-2xl border ${theme === 'dark' ? 'bg-[#151B2B] border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
               <h2 className="text-2xl font-bold leading-relaxed mb-8" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>{q.q}</h2>
               
               <div className="space-y-3">
                  {q.options.map((opt, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => handleSelect(idx)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between group ${
                        answers[currentIdx] === idx 
                          ? 'border-indigo-500 bg-indigo-500/10' 
                          : (theme === 'dark' ? 'border-white/10 hover:border-white/30 bg-black/20' : 'border-slate-200 hover:border-slate-300 bg-slate-50')
                      }`}
                    >
                      <span className="font-medium text-[15px]" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>{opt}</span>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        answers[currentIdx] === idx ? 'border-indigo-500 bg-indigo-500 text-white' : 'border-slate-400 group-hover:border-slate-300'
                      }`}>
                         {answers[currentIdx] === idx && <CheckCircle2 size={14} className="opacity-100" />}
                      </div>
                    </button>
                  ))}
               </div>

               <div className="flex justify-between items-center mt-12">
                  <button 
                    onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
                    disabled={currentIdx === 0}
                    className="px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 border border-white/20 disabled:opacity-30"
                  >
                    <ChevronLeft size={18} /> Prev
                  </button>
                  
                  {currentIdx === questionsArray.length - 1 ? (
                    <button 
                      onClick={handleFinalSubmit}
                      className="px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-lg"
                    >
                      Submit Exam <CheckCircle2 size={18} />
                    </button>
                  ) : (
                    <button 
                      onClick={() => setCurrentIdx(prev => Math.min(questionsArray.length - 1, prev + 1))}
                      className="px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white"
                    >
                      Next <ChevronRight size={18} />
                    </button>
                  )}
               </div>
            </div>
         </div>

         {/* Side Map */}
         <div className={`w-full md:w-64 shrink-0 p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#151B2B] border-white/10' : 'bg-white border-slate-200'}`}>
            <h3 className="font-bold opacity-70 mb-4 flex justify-between items-center">
              Questions Map
              <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded-md">{Object.keys(answers).length}/{questionsArray.length}</span>
            </h3>
            <div className="grid grid-cols-4 gap-2">
               {questionsArray.map((_, i) => (
                 <button 
                   key={i} 
                   onClick={() => setCurrentIdx(i)}
                   className={`h-10 rounded-lg font-bold text-sm border transition-all ${
                     currentIdx === i ? 'border-indigo-500 ring-2 ring-indigo-500/30' : 
                     answers[i] !== undefined ? 'bg-indigo-500 border-indigo-500 text-white shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 
                     (theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-slate-100 border-slate-200 hover:bg-slate-200')
                   }`}
                 >
                   {i + 1}
                 </button>
               ))}
            </div>
            
            <div className="mt-8 space-y-3 text-xs opacity-70 font-semibold p-4 rounded-xl bg-black/20 border border-white/5">
               <div className="flex items-center gap-2"><div className="w-3 h-3 bg-indigo-500 rounded-sm"></div> Attempted</div>
               <div className="flex items-center gap-2"><div className="w-3 h-3 bg-white/10 border border-white/30 rounded-sm"></div> Unattempted</div>
               <div className="flex items-center gap-2"><div className="w-3 h-3 border-2 border-indigo-500 rounded-sm"></div> Current</div>
            </div>
            
            {/* Direct Submit from Sidebar */}
            <button 
              onClick={handleFinalSubmit}
              className="w-full mt-6 py-3 font-bold border border-rose-500/50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all"
            >
              End Test Early
            </button>
         </div>

      </div>
    </div>
  );
};

export default Quiz;
