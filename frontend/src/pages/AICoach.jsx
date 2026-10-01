import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Sparkles, BookOpen, PenTool, LayoutDashboard, Loader2 } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const AICoach = () => {
  const [theme] = useState('dark');
  const [message, setMessage] = useState('');
  const { user } = useAuth();
  const [chatHistory, setChatHistory] = useState([
    { sender: 'ai', text: `Hello ${user?.name?.split(' ')[0] || 'Student'}! मी तुमचा personal MahaPrep AI Coach आहे. तुम्हाला अभ्यासात काही मदत हवी आहे का?` }
  ]);
  const [loading, setLoading] = useState(false);
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!message.trim()) return;

    const userMessage = message;
    setMessage('');
    setChatHistory(prev => [...prev, { sender: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const res = await api.post('/chat', { message: userMessage });
      setChatHistory(prev => [...prev, { sender: 'ai', text: res.data.data.reply }]);
    } catch (err) {
      setChatHistory(prev => [...prev, { sender: 'ai', text: "Sorry, I am facing a network issue right now." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (text) => {
    setMessage(text);
  };

  return (
    <div className={`min-h-[calc(100vh-80px)] md:h-[calc(100vh-80px)] flex flex-col md:flex-row transition-colors duration-300 ${
      theme === 'dark' ? 'bg-[#0B0F19] text-gray-100' : 'bg-[#F8FAFC] text-slate-900'
    }`}>
      
      {/* Sidebar for Suggested Actions */}
      <div className={`hidden md:flex flex-col w-72 shrink-0 border-r p-6 pb-24 space-y-6 ${
        theme === 'dark' ? 'bg-[#0B0F19] border-white/10' : 'bg-white border-slate-200'
      }`}>
         <div className="flex items-center gap-3 text-purple-500 mb-2">
            <Sparkles size={24} />
            <h2 className="text-xl font-bold">Quick Prompts</h2>
         </div>
         
         <div className="space-y-3 flex-1 overflow-y-auto">
            {[
              { icon: PenTool, text: 'Take a 10-Question Mix Test' },
              { icon: BookOpen, text: 'Explain Fundamental Rights' },
              { icon: LayoutDashboard, text: 'Update my Study Plan' },
              { icon: Sparkles, text: 'Generate Flashcards for History' }
            ].map((action, i) => (
              <button key={i} onClick={() => handleQuickAction(action.text)} className={`w-full text-left p-4 rounded-2xl border flex flex-col gap-2 transition-all ${
                theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
              }`}>
                 <action.icon size={18} className="text-purple-500" />
                 <span className="text-sm font-semibold">{action.text}</span>
              </button>
            ))}
         </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 flex flex-col pt-4 md:pt-0 pb-16 md:pb-0 h-full max-w-4xl mx-auto w-full relative">
         
         <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
            <div className="text-center opacity-50 text-xs font-bold uppercase tracking-widest mb-8">
               Today, 10:24 AM
            </div>

            {chatHistory.map((msg, i) => (
              <div key={i} className={`flex gap-4 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                 <div className={`w-10 h-10 shrink-0 rounded-2xl flex items-center justify-center border ${
                   msg.sender === 'ai' 
                     ? (theme === 'dark' ? 'bg-purple-500/20 border-purple-500/30 text-purple-500' : 'bg-purple-100 border-purple-200 text-purple-600')
                     : (theme === 'dark' ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400' : 'bg-indigo-100 border-indigo-200 text-indigo-600')
                 }`}>
                    {msg.sender === 'ai' ? <Bot size={20} /> : <div className="font-bold text-sm">{user?.name ? user.name[0].toUpperCase() : 'U'}</div>}
                 </div>
                 
                 <div className={`p-5 rounded-[1.5rem] text-sm md:text-base leading-relaxed ${
                   msg.sender === 'user'
                     ? 'bg-indigo-600 text-white rounded-tr-none'
                     : (theme === 'dark' ? 'bg-white/10 border border-white/5 rounded-tl-none' : 'bg-white border border-slate-200 shadow-sm rounded-tl-none')
                 }`}>
                     {msg.text.split('\n').map((line, idx) => (
                        <p key={idx} className={idx > 0 ? "mt-2" : ""}>{line}</p>
                     ))}
                 </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex gap-4 max-w-[85%]">
                 <div className={`w-10 h-10 shrink-0 rounded-2xl flex items-center justify-center border ${theme === 'dark' ? 'bg-purple-500/20 border-purple-500/30 text-purple-500' : 'bg-purple-100 border-purple-200 text-purple-600'}`}>
                    <Bot size={20} />
                 </div>
                 <div className={`p-5 rounded-[1.5rem] rounded-tl-none flex items-center gap-2 ${theme === 'dark' ? 'bg-white/10 border border-white/5' : 'bg-white border border-slate-200 shadow-sm'}`}>
                    <Loader2 size={18} className="animate-spin text-purple-500" />
                    <span className="text-sm opacity-60">Coach is typing...</span>
                 </div>
              </div>
            )}
            <div ref={endOfMessagesRef} />
         </div>

         {/* Input Area */}
         <div className={`p-4 md:p-6 border-t ${theme === 'dark' ? 'bg-[#0B0F19] border-white/10' : 'bg-white border-slate-200'}`}>
            <form onSubmit={handleSendMessage} className={`flex items-center gap-3 p-3 rounded-2xl border ${
              theme === 'dark' ? 'bg-white/5 border-white/10 focus-within:border-purple-500/50' : 'bg-slate-50 border-slate-200 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-100'
            } transition-all`}>
               <input 
                 type="text" 
                 value={message}
                 onChange={(e) => setMessage(e.target.value)}
                 placeholder="Message MahaPrep AI Coach..." 
                 className="flex-1 bg-transparent border-none outline-none px-2"
                 disabled={loading}
               />
               <button type="submit" disabled={loading} className="w-10 h-10 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white flex items-center justify-center shrink-0 transition-colors">
                  <Send size={18} className="translate-x-[-1px] translate-y-[1px]" />
               </button>
            </form>
            <p className="text-center text-[10px] uppercase font-bold tracking-widest opacity-40 mt-4">
              AI can make mistakes. Always verify facts with your standard syllabus books.
            </p>
         </div>

      </div>
    </div>
  );
};

export default AICoach;
