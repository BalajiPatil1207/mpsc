import React, { useState } from 'react';
import { UploadCloud, FileText, Camera, Sparkles, CheckCircle2, ChevronRight, PenTool } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Scanner = () => {
  const [theme] = useState('dark');
  const navigate = useNavigate();
  const [status, setStatus] = useState('idle'); // idle, scanning, result
  const [activeTab, setActiveTab] = useState('notes'); // notes, mcq
  const [files, setFiles] = useState([]);
  const [aiData, setAiData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleScan = async () => {
    if (files.length === 0) return setErrorMsg('Please select at least one file!');
    setStatus('scanning');
    
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));

    try {
      const res = await api.post('/scanner/process', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.status) {
        setAiData(res.data.data);
        setStatus('result');
      }
    } catch (error) {
      console.error(error);
      setErrorMsg('Failed to process image. Google Gemini API encountered an error or network timeout.');
      setStatus('idle');
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
    }
  };

  const startTest = () => {
    // Pass the dynamically generated MCQs to Quiz Engine
    navigate('/test-engine', { state: { questions: aiData?.mcqs || null } });
  };

  return (
    <div className={`min-h-[calc(100vh-80px)] pt-8 px-4 md:px-8 pb-24 transition-colors duration-300 ${
      theme === 'dark' ? 'bg-[#0B0F19] text-gray-100' : 'bg-[#F8FAFC] text-slate-900'
    }`}>
      <div className="max-w-5xl mx-auto">
        
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2 flex items-center gap-3">
             <Camera className="text-purple-500"/> Scan & Generate Notes
          </h1>
          <p className="opacity-70">Upload your book pages or handwritten notes. AI will extract short notes and generate MCQs for you.</p>
        </div>

        {status === 'idle' && (
          <div className={`border-2 border-dashed rounded-[2rem] p-12 text-center transition-all ${
            theme === 'dark' ? 'border-white/20 hover:border-purple-500 bg-white/5' : 'border-slate-300 hover:border-purple-500 bg-white'
          }`}>
             <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <UploadCloud size={40} className="text-purple-500" />
             </div>
             <h3 className="text-2xl font-bold mb-3">Drop your notes or textbook photos here</h3>
             <p className="opacity-50 text-sm mb-8 max-w-md mx-auto">
                Support JPG, PNG formats. You can select multiple images at once (e.g., full chapter). MahaPrep AI will extract everything!
             </p>
             <input type="file" id="fileUpload" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
             <label htmlFor="fileUpload" className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold transition-all flex items-center gap-2 mx-auto cursor-pointer w-max mb-4">
                <Camera size={20} /> {files.length > 0 ? `${files.length} Files Selected` : 'Select Files'}
             </label>
             {files.length > 0 && (
               <button onClick={handleScan} className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all flex items-center gap-2 mx-auto">
                  <Sparkles size={20} /> Magically Extract Notes
               </button>
             )}
          </div>
        )}

        {status === 'scanning' && (
          <div className="flex flex-col items-center justify-center py-20">
             <div className="relative w-24 h-24 mb-6">
               <div className="absolute inset-0 border-4 border-purple-500/30 rounded-full animate-ping"></div>
               <div className="absolute inset-0 border-4 border-t-purple-500 rounded-full animate-spin"></div>
               <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="text-purple-500 animate-pulse" />
               </div>
             </div>
             <h3 className="text-xl font-bold mb-2">Analyzing your notes...</h3>
             <ul className="space-y-2 opacity-60 text-sm text-center">
                <li className="flex items-center gap-2 justify-center"><CheckCircle2 size={16} className="text-emerald-500"/> Extracting Text via OCR...</li>
                <li className="flex items-center justify-center animate-pulse gap-2">Mapping to Master Syllabus...</li>
             </ul>
          </div>
        )}

        {status === 'result' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {/* Left Panel: Uploaded Resource Info */}
             <div className={`p-6 rounded-[2rem] border ${theme === 'dark' ? 'bg-[#151B2B] border-white/10' : 'bg-white border-slate-200'}`}>
                <div className="w-full h-40 bg-black/40 rounded-xl mb-4 border border-white/10 flex items-center justify-center text-xs opacity-50">Image Preview</div>
                <h3 className="font-bold text-lg mb-4">Detected Metadata</h3>
                <div className="space-y-3 text-sm">
                   <div className="flex justify-between border-b border-white/10 pb-2">
                     <span className="opacity-60">Subject:</span> <span className="font-semibold text-emerald-500">{aiData?.subject || 'History'}</span>
                   </div>
                   <div className="flex justify-between border-b border-white/10 pb-2">
                     <span className="opacity-60">Topic:</span> <span className="font-semibold text-emerald-500">{aiData?.topic || 'General'}</span>
                   </div>
                   <div className="flex justify-between border-b border-white/10 pb-2">
                     <span className="opacity-60">Subtopic:</span> <span className="font-semibold text-emerald-500">{aiData?.subtopic || 'Concept Extraction'}</span>
                   </div>
                   <div className="flex justify-between pb-2">
                     <span className="opacity-60">Date:</span> <span className="font-semibold">Today (Live Extracted)</span>
                   </div>
                </div>
                
                <button onClick={startTest} className="w-full mt-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center justify-center gap-2">
                   <PenTool size={18} /> Test My Knowledge 
                </button>
             </div>

             {/* Right Panel: AI Generation */}
             <div className={`md:col-span-2 p-6 rounded-[2rem] border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
                
                <div className="flex border-b border-white/10 mb-6">
                   <button 
                     onClick={() => setActiveTab('notes')}
                     className={`px-6 py-3 font-bold text-sm border-b-2 transition-all ${activeTab === 'notes' ? 'border-purple-500 text-purple-400' : 'border-transparent opacity-50'}`}
                   >
                     AI Short Notes
                   </button>
                   <button 
                     onClick={() => setActiveTab('mcq')}
                     className={`px-6 py-3 font-bold text-sm border-b-2 transition-all ${activeTab === 'mcq' ? 'border-indigo-500 text-indigo-400' : 'border-transparent opacity-50'}`}
                   >
                     Generated MCQs (5)
                   </button>
                </div>

                {activeTab === 'notes' && (
                   <div className="space-y-4">
                      <h4 className="text-xl font-bold mb-4">{aiData?.topic || 'Key Facts'}</h4>
                      <ul className="space-y-3 list-disc pl-5 opacity-90 leading-relaxed">
                         {aiData?.shortNotes?.map((note, idx) => (
                           <li key={idx}><strong>Point {idx+1}:</strong> {note}</li>
                         ))}
                      </ul>
                      <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                         <p className="text-sm font-semibold text-purple-400 flex items-center gap-2"><Sparkles size={16}/> Instant extraction complete.</p>
                      </div>
                   </div>
                )}

                {activeTab === 'mcq' && (
                   <div className="space-y-4">
                      <p className="text-sm opacity-60 mb-4">MahaPrep AI created {aiData?.mcqs?.length} questions based on these notes.</p>
                      
                      {aiData?.mcqs?.map((item, i) => (
                        <div key={i} className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                           <p className="font-bold mb-3">Q{i+1}: {item.q}</p>
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {item.options.map((opt, oIdx) => (
                                <div key={oIdx} className="p-2 border border-white/10 rounded-lg text-sm bg-white/5 opacity-70">
                                   {opt}
                                </div>
                              ))}
                           </div>
                           <p className="mt-3 text-xs font-bold text-emerald-500">Ans: Option {item.correct + 1}</p>
                        </div>
                      ))}
                      
                      <button onClick={startTest} className="w-full mt-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold flex items-center justify-center gap-2">
                         Start Live Test <ChevronRight size={18} />
                      </button>
                   </div>
                )}
             </div>
          </div>
        )}
      </div>

      {/* Custom Error Modal */}
      {errorMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
           <div className={`w-full max-w-sm p-6 rounded-[2rem] border text-center ${theme === 'dark' ? 'bg-[#151B2B] border-red-500/30' : 'bg-white border-red-200 shadow-2xl'}`}>
              <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center mx-auto mb-4">
                 <Camera size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">Scan Failed</h3>
              <p className="text-sm opacity-70 mb-6">{errorMsg}</p>
              
              <button 
                onClick={() => setErrorMsg('')} 
                className="w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-colors uppercase tracking-widest text-xs"
              >
                Okay, Understood
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default Scanner;
