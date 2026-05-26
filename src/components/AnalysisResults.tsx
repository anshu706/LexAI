import React from 'react';
import { AnalysisSummary, RedFlag } from '../types';

export function AnalysisResults({ data }: { data: AnalysisSummary }) {
  const criticalCount = data.red_flags?.filter(f => f.severity === 'CRITICAL').length || 0;
  const warningCount = data.red_flags?.filter(f => f.severity === 'WARNING').length || 0;
  const fineCount = data.red_flags?.filter(f => f.severity === 'FINE').length || 0;

  const scoreText = data.overall_fairness_score !== undefined
    ? data.overall_fairness_score > 80 ? 'highly fair' 
    : data.overall_fairness_score > 50 ? 'moderately fair' : 'concerning'
    : 'unscored';

  return (
    <div className="flex flex-col md:flex-row gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      {/* Sidebar - Document Identity & Risk Health */}
      <section className="w-full md:w-[320px] flex flex-col gap-6 shrink-0">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Document Identity</h2>
          <div className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Type</p>
              <p className="text-sm font-semibold text-slate-800">{data.document_type || 'Unknown Document'}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
               <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                 <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Party A (Orgn/Lessor)</p>
                 <p className="text-xs font-medium text-slate-700 truncate" title={data.parties?.party_a}>{data.parties?.party_a || 'Not specified'}</p>
               </div>
               <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                 <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Party B (User/Lessee)</p>
                 <p className="text-xs font-medium text-slate-700 truncate" title={data.parties?.party_b}>{data.parties?.party_b || 'Not specified'}</p>
               </div>
            </div>
            {data.duration && (
               <div className="grid grid-cols-2 gap-3">
                 <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                   <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Start Date</p>
                   <p className="text-xs font-medium text-slate-700">{data.duration.start_date || 'N/A'}</p>
                 </div>
                 <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                   <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">End Date</p>
                   <p className="text-xs font-medium text-slate-700">{data.duration.end_date || 'N/A'}</p>
                 </div>
               </div>
            )}
          </div>
        </div>

        {data.overall_fairness_score !== undefined && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex-1">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Risk Health</h2>
            <div className="flex flex-col items-center justify-center pt-2 pb-6">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
                  <circle cx="64" cy="64" r="58" fill="none" stroke="#E2E8F0" strokeWidth="8" />
                  <circle 
                    cx="64" cy="64" r="58" fill="none" stroke={data.overall_fairness_score > 70 ? "#4F46E5" : data.overall_fairness_score > 40 ? "#F59E0B" : "#EF4444"} 
                    strokeWidth="8" 
                    strokeDasharray="364.4" 
                    strokeDashoffset={364.4 - (364.4 * data.overall_fairness_score) / 100} 
                    strokeLinecap="round" 
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-slate-800">{data.overall_fairness_score}</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Fairness</span>
                </div>
              </div>
              <p className="text-sm text-center mt-6 text-slate-600 px-2">
                This document is <span className="text-indigo-600 font-bold">{scoreText}</span> but contains {criticalCount > 0 ? `${criticalCount} critical clauses` : 'some terms'} that require attention.
              </p>
            </div>
            <div className="space-y-2 border-t border-slate-100 pt-4">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Critical Risks</span>
                <span className="font-bold text-rose-500">{criticalCount}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Unfair Terms</span>
                <span className="font-bold text-amber-500">{warningCount}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Standard Terms</span>
                <span className="font-bold text-emerald-500">{fineCount}</span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Main Content - Findings */}
      <section className="flex-1 flex flex-col gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm shrink-0">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Executive Summary</h2>
          <p className="text-slate-600 leading-relaxed text-sm">
            {data.summary_in_one_paragraph}
          </p>
        </div>

        {data.red_flags && data.red_flags.length > 0 && (
          <div className="flex-1 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Critical Findings & Red Flags</h2>
            <div className="flex-1 space-y-4">
              {data.red_flags.map((flag, idx) => {
                if (flag.severity === 'CRITICAL') {
                  return (
                    <div key={idx} className="p-4 rounded-xl border-l-4 border-rose-500 bg-rose-50/50 flex flex-col gap-2">
                      <div className="flex justify-between items-start">
                        <span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-[10px] font-bold uppercase tracking-wider rounded">CRITICAL RISK</span>
                        <span className="text-[11px] text-rose-900 font-medium">{flag.clause_reference}</span>
                      </div>
                      <p className="italic text-xs text-rose-900 font-medium overflow-hidden text-ellipsis line-clamp-2">"{flag.clause_quote}"</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1 border-t border-rose-100 pt-2">
                        <div>
                          <p className="text-[10px] font-bold text-rose-800 uppercase">Plain Language</p>
                          <p className="text-xs text-rose-700">{flag.plain_explanation}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-rose-800 uppercase">Why it Matters/Action</p>
                          <p className="text-xs text-rose-700">{flag.why_it_matters} <span className="font-semibold block mt-1">{flag.recommended_action}</span></p>
                        </div>
                      </div>
                    </div>
                  );
                }
                
                if (flag.severity === 'WARNING') {
                  return (
                    <div key={idx} className="p-4 rounded-xl border-l-4 border-amber-400 bg-amber-50/50 flex flex-col gap-2">
                      <div className="flex justify-between items-start">
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider rounded">WARNING</span>
                        <span className="text-[11px] text-amber-900 font-medium">{flag.clause_reference}</span>
                      </div>
                      <p className="italic text-xs text-amber-900 font-medium overflow-hidden text-ellipsis line-clamp-2">"{flag.clause_quote}"</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1 border-t border-amber-100 pt-2">
                        <div>
                          <p className="text-[10px] font-bold text-amber-800 uppercase">Plain Language</p>
                          <p className="text-xs text-amber-700">{flag.plain_explanation}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-amber-800 uppercase">Why it Matters/Action</p>
                          <p className="text-xs text-amber-700">{flag.why_it_matters} <span className="font-semibold block mt-1">{flag.recommended_action}</span></p>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={idx} className="p-4 rounded-xl border-l-4 border-emerald-400 bg-emerald-50/50 flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider rounded">FINE</span>
                      <span className="text-[11px] text-emerald-900 font-medium">{flag.clause_reference}</span>
                    </div>
                    <p className="text-xs text-emerald-800 font-medium">{flag.plain_explanation}</p>
                    <p className="italic text-xs text-emerald-700 opacity-80 mt-1 line-clamp-1">"{flag.clause_quote}"</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
