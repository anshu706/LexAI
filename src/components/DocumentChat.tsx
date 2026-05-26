import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export function DocumentChat({ documentText }: { documentText: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([{
    role: 'ai',
    text: "Hello! I've read your document. What would you like to ask about it?"
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentText, question: userMessage })
      });
      
      const textRes = await res.text();
      let data;
      try {
        data = JSON.parse(textRes);
      } catch (e) {
        setMessages(prev => [...prev, { role: 'ai', text: "Backend API unavailable. Note: Document chat requires the local Express server and does not work on static hosts like GitHub Pages." }]);
        return;
      }
      
      if (res.ok) {
        setMessages(prev => [...prev, { role: 'ai', text: data.answer }]);
      } else {
        setMessages(prev => [...prev, { role: 'ai', text: `Sorry, I encountered an error: ${data.error}` }]);
      }
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'ai', text: "Sorry, network error." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] max-h-[80vh] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
        <h3 className="font-semibold text-slate-900">Q&A Assistant</h3>
        <p className="text-sm text-slate-500">Ask clarifying questions about specific clauses.</p>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
             {msg.role === 'ai' && (
               <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-indigo-700" />
               </div>
             )}
             <div className={`px-5 py-3.5 rounded-2xl max-w-[85%] text-sm leading-relaxed ${
               msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-br-none' 
                : 'bg-slate-100 text-slate-800 rounded-bl-none'
             }`}>
                {msg.role === 'ai' ? (
                   <div className="prose prose-sm prose-slate max-w-none">
                     <ReactMarkdown>{msg.text}</ReactMarkdown>
                   </div>
                ) : (
                   msg.text
                )}
             </div>
             {msg.role === 'user' && (
               <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-slate-600" />
               </div>
             )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4 justify-start">
             <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-indigo-700" />
             </div>
             <div className="px-5 py-3.5 rounded-2xl bg-slate-100 text-slate-500 rounded-bl-none flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Thinking...
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-slate-200">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex items-center gap-2"
        >
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="e.g., Can I terminate this agreement early without penalty?"
            className="flex-1 min-w-0 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow text-sm"
          />
          <button 
           type="submit"
           disabled={!input.trim() || isLoading}
           className="w-12 h-12 flex items-center justify-center shrink-0 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
             <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
