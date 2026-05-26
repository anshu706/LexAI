import React, { useState, useRef } from 'react';
import { AlertCircle, UploadCloud, FileText, File as FileIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export function DocumentUpload({ onAnalyze, isAnalyzing }: { onAnalyze: (text: string) => void, isAnalyzing: boolean }) {
  const [text, setText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedFileName, setExtractedFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please upload a valid PDF file.');
      return;
    }

    setIsExtracting(true);
    setError(null);
    setExtractedFileName(file.name);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + '\n\n';
      }
      
      if (!fullText.trim()) {
         throw new Error('No readable text found in this PDF. It might be scanned images.');
      }
      
      setText(fullText);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error extracting text from PDF');
      setExtractedFileName(null);
      setText('');
    } finally {
      setIsExtracting(false);
      // Reset input so the same file can be selected again if needed
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const clearText = () => {
    setText('');
    setExtractedFileName(null);
    setError(null);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto p-6 space-y-8"
    >
      <div className="text-center space-y-3 mt-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-800">
          Analyze <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-emerald-500">Legal Documents</span> Instantly
        </h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">Upload a PDF or paste your contract for clarity and risk analysis without the legalese.</p>
      </div>

      <div className="bg-white border border-slate-200 shadow-xl shadow-slate-100/50 rounded-2xl overflow-hidden">
        
        {/* Tabs */}
        <div className="flex border-b border-slate-200">
           <button 
             onClick={() => setActiveTab('upload')}
             className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${activeTab === 'upload' ? 'bg-gradient-to-r from-indigo-50 to-emerald-50 border-b-2 border-indigo-500 text-indigo-700' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700 border-b-2 border-transparent'}`}
           >
             <UploadCloud className="w-4 h-4" /> Upload PDF
           </button>
           <button 
             onClick={() => setActiveTab('paste')}
             className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${activeTab === 'paste' ? 'bg-gradient-to-r from-indigo-50 to-emerald-50 border-b-2 border-indigo-500 text-indigo-700' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700 border-b-2 border-transparent'}`}
           >
             <FileText className="w-4 h-4" /> Paste Text
           </button>
        </div>

        <div className="p-6 relative">
          <AnimatePresence mode="wait">
            {activeTab === 'upload' && !text ? (
              <motion.div 
                key="upload"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="h-[300px] border-2 border-dashed border-indigo-200 bg-gradient-to-br from-indigo-50/50 to-emerald-50/50 hover:from-indigo-50 hover:to-emerald-50 rounded-xl flex flex-col items-center justify-center transition-all relative overflow-hidden group cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept="application/pdf"
                  onChange={handleFileChange}
                />
                
                {isExtracting ? (
                  <div className="flex flex-col items-center text-indigo-600">
                    <svg className="animate-spin h-10 w-10 mb-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="font-semibold text-lg tracking-tight">Extracting text from PDF...</p>
                    <p className="text-sm font-medium opacity-80 mt-1">This might take a few seconds</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-slate-500 group-hover:scale-105 transition-transform duration-300">
                    <div className="w-16 h-16 bg-white shadow-sm border border-indigo-100 rounded-full flex items-center justify-center mb-4 group-hover:shadow-md transition-shadow">
                      <UploadCloud className="w-8 h-8 text-indigo-500" />
                    </div>
                    <p className="font-bold text-lg text-slate-700">Click to upload a PDF file</p>
                    <p className="text-sm text-slate-500 mt-2">Maximum file size: 10MB</p>
                    
                    {error && (
                      <p className="mt-4 text-sm font-medium text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-100 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" /> {error}
                      </p>
                    )}
                  </div>
                )}
              </motion.div>
            ) : (
               <motion.div 
                 key="text-editor"
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                 className="relative group"
               >
                 {extractedFileName && activeTab === 'upload' && (
                    <div className="absolute -top-3 left-3 px-3 py-1 bg-gradient-to-r from-emerald-100 to-teal-100 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-full shadow-sm flex items-center gap-1.5 z-10">
                      <FileIcon className="w-3.5 h-3.5" />
                      Extracted from: {extractedFileName}
                    </div>
                 )}
                 {text && (
                    <button 
                      onClick={clearText}
                      className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-rose-100 hover:text-rose-600 text-slate-500 rounded-lg transition-colors border border-transparent hover:border-rose-200"
                      title="Clear text"
                    >
                      <X className="w-4 h-4" />
                    </button>
                 )}
                 <textarea 
                   className={`w-full h-[300px] p-6 resize-y outline-none text-slate-700 font-mono text-sm leading-relaxed bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${extractedFileName && activeTab === 'upload' ? 'pt-8' : ''}`}
                   placeholder="Paste the full text of your legal agreement here..."
                   value={text}
                   onChange={e => setText(e.target.value)}
                   disabled={isAnalyzing}
                 />
               </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
             <AlertCircle className="w-3.5 h-3.5 mr-1.5 text-amber-500" />
             For general analysis only. Always consult a lawyer.
          </div>
          <button 
           onClick={() => onAnalyze(text)}
           disabled={text.trim().length < 50 || isAnalyzing || isExtracting}
           className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 font-bold text-white rounded-xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 disabled:shadow-none transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed"
          >
             {isAnalyzing ? (
               <>
                 <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
                 Analyzing...
               </>
             ) : 'Analyze Document'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

