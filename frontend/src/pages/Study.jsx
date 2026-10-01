import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BookOpen, Search, ChevronRight, CheckCircle2, Lock } from 'lucide-react';
import Skeleton from '../components/common/Skeleton';
import api from '../api/axios';

const Study = () => {
  const [theme] = useState('dark');
  const [allSubjects, setAllSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  // Fetch from Real Backend
  useEffect(() => {
    const fetchSyllabus = async () => {
      try {
        const res = await api.get('/syllabus/master');
        if (res.data.status && res.data.data) {
          setAllSubjects(res.data.data);
          // initialize first chunk
          setTimeout(() => {
            setItems(res.data.data.slice(0, 4));
            setPage(2);
            setLoading(false);
            if (res.data.data.length <= 4) setHasMore(false);
          }, 800); // 800ms buffer for UX
        }
      } catch (error) {
        console.error("Failed to load syllabus", error);
        setLoading(false);
      }
    };
    fetchSyllabus();
  }, []);

  // Infinite Scroll logic
  const lastItemRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    }, { threshold: 1.0 });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const loadMore = () => {
    if (!hasMore || allSubjects.length === 0) return;
    setLoading(true);
    setTimeout(() => {
      const nextItems = allSubjects.slice(0, page * 4);
      setItems(nextItems);
      setPage(prev => prev + 1);
      if (nextItems.length >= allSubjects.length) {
        setHasMore(false);
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className={`min-h-screen pt-8 px-4 md:px-8 pb-24 transition-colors duration-300 ${
      theme === 'dark' ? 'bg-[#0B0F19] text-gray-100' : 'bg-[#F8FAFC] text-slate-900'
    }`}>
      
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">Topic Explorer</h1>
            <p className="opacity-70">Master the syllabus, one topic at a time.</p>
          </div>
          
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
            <Search size={18} className="opacity-50" />
            <input 
              type="text" 
              placeholder="Search topics..." 
              className="bg-transparent border-none outline-none text-sm w-full md:w-64"
            />
          </div>
        </div>

        {/* Master Syllabus Grid with Infinite Scroll */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {items.map((subj, idx) => {
            const isLast = idx === items.length - 1;
            return (
              <div ref={isLast ? lastItemRef : null} key={idx} className={`p-6 rounded-[2rem] border overflow-hidden relative group ${
                theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight">{subj.name}</h2>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs font-bold uppercase tracking-widest opacity-60 flex items-center gap-1">
                        <BookOpen size={14}/> {subj.topics.length} Topics
                      </span>
                      <span className="text-xs font-bold uppercase tracking-widest opacity-60 flex items-center gap-1">
                        <CheckCircle2 size={14}/> {subj.progress}% Mastery
                      </span>
                    </div>
                  </div>
                  
                  <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{
                    background: `conic-gradient(var(--tw-gradient-stops))`,
                    backgroundImage: `conic-gradient(from 0deg, currentColor ${subj.progress}%, transparent ${subj.progress}%)`
                  }}>
                     <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${theme === 'dark' ? 'bg-[#151B2B]' : 'bg-white'}`}>
                       {subj.progress}%
                     </div>
                  </div>
                </div>

                <div className="flex flex-col h-64 overflow-hidden relative z-10 w-full rounded-2xl">
                  {/* Scrollable Topics List */}
                  <div className="flex-1 overflow-y-auto pr-2 space-y-3 pb-2 custom-scrollbar">
                    {subj.topics && subj.topics.map((topic, tIdx) => {
                      const isLocked = subj.progress !== undefined && subj.progress < 20 && tIdx >= 3;
                      return (
                        <div key={topic.id || tIdx} className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                          isLocked 
                            ? (theme === 'dark' ? 'bg-white/5 border-white/5 opacity-50' : 'bg-slate-100 border-slate-200 opacity-60')
                            : (theme === 'dark' ? 'bg-black/20 border-white/5 hover:border-white/20 hover:bg-white/5' : 'bg-slate-50 border-slate-200 hover:border-slate-300')
                        }`}>
                          <div className="flex items-center gap-4">
                            <span className="text-sm font-bold opacity-40">{(tIdx + 1).toString().padStart(2, '0')}</span>
                            <span className="font-semibold">{topic.name}</span>
                          </div>
                          {isLocked ? (
                            <Lock size={16} className="opacity-40" />
                          ) : (
                            <ChevronRight size={18} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                          )}
                        </div>
                      );
                    })}
                    {(!subj.topics || subj.topics.length === 0) && (
                      <p className="text-sm opacity-50 italic">No topics found for this subject.</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Skeleton Buffering / Loading State */}
          {loading && (
            <>
              {[...Array(2)].map((_, i) => (
                <div key={`skel-${i}`} className={`p-6 rounded-[2rem] border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
                  <div className="flex justify-between items-start mb-6 w-full">
                     <div>
                       <Skeleton width="180px" height="24px" className="mb-3" />
                       <div className="flex gap-4">
                          <Skeleton width="60px" height="12px" />
                          <Skeleton width="80px" height="12px" />
                       </div>
                     </div>
                     <Skeleton width="48px" height="48px" rounded="9999px" />
                  </div>
                  <div className="space-y-3">
                     <Skeleton width="100%" height="56px" rounded="1rem" />
                     <Skeleton width="100%" height="56px" rounded="1rem" />
                     <Skeleton width="100%" height="56px" rounded="1rem" />
                  </div>
                </div>
              ))}
            </>
          )}

        </div>
        
        {!hasMore && (
           <p className="text-center mt-8 text-sm font-bold opacity-40 uppercase tracking-widest">
             You have reached the end of the syllabus
           </p>
        )}
      </div>
    </div>
  );
};

export default Study;
