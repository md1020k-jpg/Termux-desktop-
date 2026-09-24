import React, { useState } from 'react';
import { Bot, Send, Sparkles, User, Terminal, AlertCircle } from 'lucide-react';

export const AiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: 'Hello! I am your Termux Desktop AI Copilot. Ask me anything about troubleshooting Termux-X11 display errors, Turnip driver crashes on Snapdragon, PRoot container setup, or audio configuration.'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMsg, context: 'Termux Desktop User' })
      });
      const data = await res.json();
      if (data.reply) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.error || 'Failed to get AI response. Please check your GEMINI_API_KEY.' }]);
      }
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Network error communicating with AI backend.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-mono w-fit mb-3">
          <Bot className="w-3.5 h-3.5" />
          <span>Gemini AI Assistant</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Termux Desktop AI Copilot
        </h1>
        <p className="mt-1 text-slate-400 text-sm">
          Instant AI troubleshooting for display servers, graphics drivers, audio forwarding, and Linux packages.
        </p>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[600px]">
        {/* Chat Messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex items-start space-x-3 ${m.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
                {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`max-w-2xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${m.role === 'user' ? 'bg-cyan-950/40 text-cyan-100 border border-cyan-800/50' : 'bg-slate-900 text-slate-200 border border-slate-800'}`}>
                <pre className="whitespace-pre-wrap font-sans">{m.content}</pre>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs text-slate-400 flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]" />
                <span className="ml-2 font-mono">Gemini AI is analyzing...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-4 bg-slate-900 border-t border-slate-800 flex items-center space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about Termux-X11 errors, Vulkan drivers, PRoot mounting..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 placeholder:text-slate-600"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-medium text-xs shadow-lg shadow-emerald-600/20 transition flex items-center space-x-1.5"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
