import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ChevronDown, ChevronUp, Save, X, BookOpen, Layers, Calendar } from 'lucide-react';
import api from '../api/axios';

const AdminSyllabus = () => {
  const [theme] = useState('dark');
  
  // Dummy State for CRUD Operations
  const [subjects, setSubjects] = useState([
    { 
      id: 1, name: 'History (इतिहास)', 
      topics: [
        { 
          id: 101, name: 'Ancient India', 
          subtopics: [{ id: 1001, name: 'Indus Valley' }, { id: 1002, name: 'Vedic Period' }]
        }
      ] 
    }
  ]);
  
  const [examDate, setExamDate] = useState('');
  const [expandedSubj, setExpandedSubj] = useState(null);
  const [expandedTopic, setExpandedTopic] = useState(null);

  useEffect(() => {
    fetchExamDate();
  }, []);

  const fetchExamDate = async () => {
    try {
      const res = await api.get('/syllabus/exam-date');
      if (res.data.data?.examDate) setExamDate(res.data.data.examDate);
    } catch (error) {
      console.log('Failed to fetch exam date', error);
    }
  };

  const handleUpdateExamDate = async () => {
    try {
      await api.post('/syllabus/exam-date', { examDate });
      alert('Exam Date updated successfully!');
    } catch (error) {
      alert('Failed to update exam date');
    }
  };

  // Simple Add/Edit Modals internal states
  const [isEditing, setIsEditing] = useState(false);
  const [editType, setEditType] = useState(null); // 'subject', 'topic', 'subtopic'
  const [editItem, setEditItem] = useState({ id: null, name: '' });
  const [parentId, setParentId] = useState(null); // to know where to add

  const toggleSubject = (id) => setExpandedSubj(expandedSubj === id ? null : id);
  const toggleTopic = (id) => setExpandedTopic(expandedTopic === id ? null : id);

  const openEditModal = (type, item = null, parent = null) => {
    setEditType(type);
    setEditItem(item ? { ...item } : { id: null, name: '' });
    setParentId(parent);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!editItem.name.trim()) return;

    if (editType === 'subject') {
      if (editItem.id) {
        setSubjects(subjects.map(s => s.id === editItem.id ? { ...s, name: editItem.name } : s));
      } else {
        setSubjects([...subjects, { id: Date.now(), name: editItem.name, topics: [] }]);
      }
    } else if (editType === 'topic') {
      const updatedS = subjects.map(s => {
        if (s.id === parentId) {
          let newTopics = [...s.topics];
          if (editItem.id) {
            newTopics = newTopics.map(t => t.id === editItem.id ? { ...t, name: editItem.name } : t);
          } else {
            newTopics.push({ id: Date.now(), name: editItem.name, subtopics: [] });
          }
          return { ...s, topics: newTopics };
        }
        return s;
      });
      setSubjects(updatedS);
    } else if (editType === 'subtopic') {
      // Find subject containing topic
      const updatedS = subjects.map(s => {
        const tIndex = s.topics.findIndex(t => t.id === parentId);
        if (tIndex !== -1) {
          const newTopics = [...s.topics];
          const t = newTopics[tIndex];
          let newSub = [...t.subtopics];
          if (editItem.id) {
            newSub = newSub.map(st => st.id === editItem.id ? { ...st, name: editItem.name } : st);
          } else {
            newSub.push({ id: Date.now(), name: editItem.name });
          }
          newTopics[tIndex] = { ...t, subtopics: newSub };
          return { ...s, topics: newTopics };
        }
        return s;
      });
      setSubjects(updatedS);
    }
    
    setIsEditing(false);
  };

  const handleDelete = (type, id, pId = null) => {
    if (!window.confirm("Are you sure you want to delete this?")) return;
    
    if (type === 'subject') {
      setSubjects(subjects.filter(s => s.id !== id));
    } else if (type === 'topic') {
      setSubjects(subjects.map(s => (s.id === pId ? { ...s, topics: s.topics.filter(t => t.id !== id) } : s)));
    } else if (type === 'subtopic') {
      setSubjects(subjects.map(s => {
        const topic = s.topics.find(t => t.id === pId);
        if (topic) {
           return { ...s, topics: s.topics.map(t => t.id === pId ? { ...t, subtopics: t.subtopics.filter(st => st.id !== id) } : t) };
        }
        return s;
      }));
    }
  };

  return (
    <div className={`min-h-screen pt-8 px-4 md:px-8 pb-24 transition-colors duration-300 ${
      theme === 'dark' ? 'bg-[#0B0F19] text-gray-100' : 'bg-[#F8FAFC] text-slate-900'
    }`}>
      
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-2 flex items-center gap-2"><BookOpen className="text-purple-500"/> Admin: Master Syllabus</h1>
            <p className="opacity-70">Add, Update, or Delete Subjects and Subtopics directly.</p>
          </div>
          <button 
            onClick={() => openEditModal('subject')}
            className="px-4 py-2 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-500 flex items-center gap-2"
          >
            <Plus size={18} /> New Subject
          </button>
        </div>

        {/* Global Exam Configuration */}
        <div className={`rounded-[1.5rem] border p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-4 ${theme === 'dark' ? 'bg-indigo-900/20 border-indigo-500/30' : 'bg-indigo-50 border-indigo-200'}`}>
           <div className="flex items-center gap-3">
             <div className="p-3 bg-indigo-500 text-white rounded-xl">
               <Calendar size={24} />
             </div>
             <div>
               <h2 className="text-lg font-bold">Target Exam Date</h2>
               <p className="text-sm opacity-70">Used to calculate countdowns across the app.</p>
             </div>
           </div>
           <div className="flex gap-2 w-full md:w-auto">
             <input 
               type="date" 
               value={examDate}
               onChange={(e) => setExamDate(e.target.value)}
               className={`p-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none flex-1 md:w-48 ${theme === 'dark' ? 'bg-black/40 border-white/10' : 'bg-white border-slate-200'}`}
             />
             <button onClick={handleUpdateExamDate} className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl flex items-center gap-2">
               <Save size={18} /> Update
             </button>
           </div>
        </div>

        <div className="space-y-4">
          {subjects.map(subject => (
            <div key={subject.id} className={`rounded-[1.5rem] border overflow-hidden ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
               <div className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3 cursor-pointer flex-1" onClick={() => toggleSubject(subject.id)}>
                     {expandedSubj === subject.id ? <ChevronUp size={20} className="opacity-50"/> : <ChevronDown size={20} className="opacity-50"/>}
                     <h2 className="text-xl font-bold">{subject.name}</h2>
                     <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded-lg">{subject.topics.length} Topics</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <button onClick={() => openEditModal('subject', subject)} className="p-2 text-blue-500 hover:bg-blue-500/20 rounded-lg"><Edit2 size={16}/></button>
                     <button onClick={() => handleDelete('subject', subject.id)} className="p-2 text-red-500 hover:bg-red-500/20 rounded-lg"><Trash2 size={16}/></button>
                  </div>
               </div>

               {expandedSubj === subject.id && (
                 <div className="border-t border-white/5 p-4 pl-12 space-y-3">
                   <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-bold opacity-50 uppercase tracking-widest">Topics in {subject.name}</h3>
                      <button onClick={() => openEditModal('topic', null, subject.id)} className="text-xs font-bold text-purple-400 flex items-center gap-1 hover:text-purple-300">
                        <Plus size={14}/> Add Topic
                      </button>
                   </div>
                   
                   {subject.topics.map(topic => (
                     <div key={topic.id} className={`rounded-xl border ${theme === 'dark' ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="p-3 flex items-center justify-between">
                           <div className="flex items-center gap-2 cursor-pointer flex-1" onClick={() => toggleTopic(topic.id)}>
                              <Layers size={16} className="text-indigo-400"/>
                              <span className="font-semibold">{topic.name}</span>
                              <span className="text-[10px] text-gray-500 ml-2">{topic.subtopics.length} Subtopics</span>
                           </div>
                           <div className="flex gap-1">
                             <button onClick={() => openEditModal('topic', topic, subject.id)} className="p-1.5 text-blue-500 hover:bg-blue-500/20 rounded-md"><Edit2 size={14}/></button>
                             <button onClick={() => handleDelete('topic', topic.id, subject.id)} className="p-1.5 text-red-500 hover:bg-red-500/20 rounded-md"><Trash2 size={14}/></button>
                           </div>
                        </div>

                        {expandedTopic === topic.id && (
                           <div className="p-3 pt-0 pl-10 space-y-2">
                             <div className="flex justify-end mb-2">
                                <button onClick={() => openEditModal('subtopic', null, topic.id)} className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 hover:text-emerald-300">
                                  <Plus size={12}/> Add Subtopic
                                </button>
                             </div>
                             {topic.subtopics.map(st => (
                               <div key={st.id} className={`p-2 px-3 rounded-lg flex items-center justify-between border ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100'}`}>
                                  <span className="text-sm">{st.name}</span>
                                  <div className="flex gap-1 opacity-0 hover:opacity-100 group-hover:opacity-100 focus-within:opacity-100 transition-opacity" style={{opacity: 1}}>
                                     <button onClick={() => openEditModal('subtopic', st, topic.id)} className="p-1 text-blue-400 hover:bg-white/10 rounded"><Edit2 size={12}/></button>
                                     <button onClick={() => handleDelete('subtopic', st.id, topic.id)} className="p-1 text-red-400 hover:bg-white/10 rounded"><Trash2 size={12}/></button>
                                  </div>
                               </div>
                             ))}
                             {topic.subtopics.length === 0 && <p className="text-xs opacity-40 italic">No subtopics yet.</p>}
                           </div>
                        )}
                     </div>
                   ))}
                   {subject.topics.length === 0 && <p className="text-sm opacity-40 italic pb-2">No topics added in this subject.</p>}
                 </div>
               )}
            </div>
          ))}
        </div>
      </div>

      {/* Edit/Add Modal Overlay */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
           <div className={`w-full max-w-md p-6 rounded-[2rem] border ${theme === 'dark' ? 'bg-[#151B2B] border-white/10' : 'bg-white border-slate-200'}`}>
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xl font-bold capitalize">{editItem.id ? 'Edit' : 'Add'} {editType}</h3>
                 <button onClick={() => setIsEditing(false)} className="p-2 rounded-full hover:bg-white/10"><X size={20}/></button>
              </div>
              
              <div className="mb-6">
                 <label className="block text-xs font-bold uppercase tracking-widest opacity-60 mb-2">{editType} Name</label>
                 <input 
                   type="text" 
                   value={editItem.name}
                   onChange={e => setEditItem({...editItem, name: e.target.value})}
                   className={`w-full p-3 rounded-xl border focus:ring-2 focus:ring-purple-500 outline-none ${
                     theme === 'dark' ? 'bg-black/20 border-white/10' : 'bg-slate-50 border-slate-200'
                   }`}
                   placeholder={`Enter ${editType} name...`}
                   autoFocus
                 />
              </div>

              <div className="flex gap-3 justify-end">
                 <button onClick={() => setIsEditing(false)} className="px-5 py-2 rounded-xl font-bold opacity-70 hover:opacity-100">Cancel</button>
                 <button onClick={handleSave} className="px-5 py-2 rounded-xl font-bold bg-purple-600 text-white hover:bg-purple-500 flex items-center gap-2">
                   <Save size={18}/> Save Changes
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminSyllabus;
