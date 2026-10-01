import React, { useState, useEffect } from 'react';
import { BookOpen, FolderOpen, ChevronLeft, Calendar, FileText, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Vault = () => {
  const [theme] = useState('dark');
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await api.get('/user/notes');
      // Parse AI Content automatically
      const parsedNotes = res.data.data.map(note => {
        try {
          const parsed = JSON.parse(note.aiContent);
          // BACKWARD COMPATIBILITY: if the older parsed data was just an array of strings
          if (Array.isArray(parsed)) {
            return { ...note, parsed: { subject: 'Uncategorized', shortNotes: parsed, topic: 'Early Scan', mcqs: [] } };
          }
          return { ...note, parsed };
        } catch (e) {
          return { ...note, parsed: { subject: 'Unknown', shortNotes: [], topic: '', mcqs: [] } };
        }
      });
      setNotes(parsedNotes);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Group by Subject
  const groupedSubjects = notes.reduce((acc, note) => {
    const subject = note.parsed.subject || "General";
    if (!acc[subject]) acc[subject] = [];
    acc[subject].push(note);
    return acc;
  }, {});

  const renderSubjectGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Object.entries(groupedSubjects).map(([subject, subjectNotes]) => (
        <div 
          key={subject}
          onClick={() => setSelectedSubject(subject)}
          className={`p-6 rounded-[1.5rem] border cursor-pointer transition-all hover:scale-[1.02] ${
            theme === 'dark' ? 'bg-[#151B2B] border-white/10 hover:border-blue-500/50' : 'bg-white border-slate-200 shadow-sm hover:shadow-md'
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-500 flex items-center justify-center mb-4">
            <FolderOpen size={24} />
          </div>
          <h3 className="text-xl font-bold mb-1">{subject}</h3>
          <p className="text-sm opacity-60 flex items-center gap-2">
            <FileText size={14} /> {subjectNotes.length} Saved Scans
          </p>
        </div>
      ))}
    </div>
  );

  const renderSubjectNotes = () => (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => setSelectedSubject(null)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
          <ChevronLeft size={16} />
        </button>
        <h2 className="text-2xl font-bold">{selectedSubject} Notes</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groupedSubjects[selectedSubject].map(note => (
          <div 
             key={note.id}
             onClick={() => setSelectedNote(note)}
             className={`p-5 rounded-xl border cursor-pointer transition-colors ${
              theme === 'dark' ? 'bg-[#151B2B] border-white/5 hover:bg-white/5' : 'bg-white border-slate-200 hover:bg-slate-50'
             }`}
          >
             <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold px-2 py-1 bg-white/10 rounded-md opacity-70">
                  {new Date(note.createdAt).toLocaleDateString()}
                </span>
                <ChevronRight size={16} className="opacity-50" />
             </div>
             <h4 className="font-bold text-lg mb-1">{note.parsed.topic || 'Scanned Content'}</h4>
             <p className="text-sm opacity-60 line-clamp-2">
               {note.parsed.shortNotes.length > 0 ? note.parsed.shortNotes[0] : 'Open to read full notes...'}
             </p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`min-h-[calc(100vh-80px)] pt-8 px-4 md:px-8 pb-24 transition-colors ${
      theme === 'dark' ? 'bg-[#0B0F19] text-gray-100' : 'bg-[#F8FAFC] text-slate-900'
    }`}>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex flex-col items-center justify-center hover:bg-white/10 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
              <FolderOpen className="text-blue-500" /> Notes Vault
            </h1>
            <p className="opacity-70 mt-1">Access all your categorized AI smart notes here.</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center opacity-50 py-20">Loading your vault...</div>
        ) : notes.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-[2rem] border border-white/10">
            <FileText size={48} className="mx-auto mb-4 text-blue-500 opacity-50" />
            <h2 className="text-xl font-bold mb-2">Vault is Empty</h2>
            <p className="opacity-70 mb-6 max-w-sm mx-auto">You haven't scanned any book pages yet.</p>
            <button onClick={() => navigate('/scanner')} className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold transition-colors">
              Go to Scanner
            </button>
          </div>
        ) : selectedSubject ? (
          renderSubjectNotes()
        ) : (
          renderSubjectGrid()
        )}
      </div>

      {/* Note Reader Modal */}
      {selectedNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
           <div className={`w-full max-w-2xl max-h-[85vh] overflow-y-auto p-8 rounded-[2rem] border ${theme === 'dark' ? 'bg-[#0f172A] border-blue-500/30' : 'bg-white border-blue-200 shadow-2xl'}`}>
              <div className="flex justify-between items-center mb-6">
                <div>
                   <h2 className="text-2xl font-black text-blue-400">{selectedNote.parsed.topic || 'Notes'}</h2>
                   <p className="text-sm opacity-70">Subject: {selectedNote.parsed.subject} | {new Date(selectedNote.createdAt).toLocaleString()}</p>
                </div>
                <button onClick={() => setSelectedNote(null)} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-red-500/20 hover:text-red-500 transition-colors">
                  <ChevronLeft size={20} className="rotate-180" />
                </button>
              </div>

              <div className="space-y-4">
                {selectedNote.parsed.shortNotes.map((point, idx) => (
                  <div key={idx} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <p className="text-[15px] leading-relaxed font-medium" style={{ fontFamily: "'Noto Sans Devanagari', 'Tiro Devanagari Marathi', sans-serif" }}>
                      {point}
                    </p>
                  </div>
                ))}
              </div>
              
              <button 
                onClick={() => {
                   if(selectedNote.parsed.mcqs && selectedNote.parsed.mcqs.length > 0) {
                      navigate('/test-engine', { state: { questions: selectedNote.parsed.mcqs } });
                   } else {
                      alert("No MCQs found for this older note!");
                   }
                }} 
                className="w-full mt-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 tracking-widest uppercase text-sm shadow-xl"
              >
                Take a Revision Test ({selectedNote.parsed.mcqs?.length || 0} MCQs)
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default Vault;
