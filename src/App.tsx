import React, { useState } from 'react';
import { DocumentUpload } from './components/DocumentUpload';
import { AnalysisResults } from './components/AnalysisResults';
import { DocumentChat } from './components/DocumentChat';
import { AnalysisSummary } from './types';
import { Scale, FileText, MessageSquare, ArrowLeft } from 'lucide-react';

export default function App() {
  const [documentText, setDocumentText] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisSummary | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'summary' | 'chat'>('summary');
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (text: string) => {
    setDocumentText(text);
    setIsAnalyzing(true);
    setError(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentText: text })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to analyze');
      setAnalysisResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setDocumentText('');
    setAnalysisResult(null);
    setActiveTab('summary');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans overflow-auto flex flex-col">
      <header className="h-16 flex-shrink-0 flex items-center justify-between px-8 bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
           <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center">
               <span className="text-white font-bold text-lg leading-none italic">L</span>
             </div>
             <div>
               <h1 className="text-xl font-bold text-slate-800 tracking-tight leading-none">LexAI</h1>
               <p className="text-[10px] text-indigo-600 font-semibold uppercase tracking-widest mt-1">Legal Clarity Engine</p>
             </div>
           </div>
           
           {analysisResult && (
             <div className="flex items-center gap-4">
               <div className="hidden sm:block bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium border border-emerald-100">
                 Document Analyzed
               </div>
               <button onClick={handleReset} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md shadow-indigo-100 hover:bg-indigo-700 transition">
                 New Analysis
               </button>
             </div>
           )}
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8 flex flex-col">
         {!analysisResult && !isAnalyzing && !error && (
            <DocumentUpload onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
         )}

         {(isAnalyzing || error) && !analysisResult && (
           <div className="max-w-4xl mx-auto mt-12">
             <DocumentUpload onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
             {error && (
               <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                 <strong>Error:</strong> {error}
               </div>
             )}
           </div>
         )}
         
         {analysisResult && (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="flex items-center border-b border-slate-200">
                 <button 
                  onClick={() => setActiveTab('summary')}
                  className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'summary' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'}`}
                 >
                   <FileText className="w-4 h-4" /> Analysis & Red Flags
                 </button>
                 <button 
                  onClick={() => setActiveTab('chat')}
                  className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'chat' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'}`}
                 >
                   <MessageSquare className="w-4 h-4" /> Q&A Chat
                 </button>
               </div>
               
               <div className="mt-6 flex-1">
                 {activeTab === 'summary' && <AnalysisResults data={analysisResult} />}
                 {activeTab === 'chat' && <DocumentChat documentText={documentText} />}
               </div>
            </div>
         )}
      </main>

      <footer className="h-12 bg-white border-t border-slate-200 px-8 flex flex-shrink-0 items-center justify-between max-w-6xl w-full mx-auto">
        <p className="text-[11px] text-slate-400">LEXAI V2.1 • Grounded in Indian Law Chunks</p>
        <p className="text-[11px] font-bold text-slate-500">Consult a qualified lawyer before signing any legal document.</p>
      </footer>
    </div>
  );
}
