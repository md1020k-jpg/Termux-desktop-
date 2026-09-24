import React, { useState } from 'react';
import { DOCUMENTATION_GUIDES } from '../data/termuxData';
import { BookOpen, Search, FileText, ChevronRight } from 'lucide-react';

export const DocsViewer: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedGuide, setSelectedGuide] = useState(DOCUMENTATION_GUIDES[0]);

  const filteredGuides = DOCUMENTATION_GUIDES.filter((g) =>
    g.title.toLowerCase().includes(search.toLowerCase()) || g.summary.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      <div>
        <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono w-fit mb-3">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Documentation & Guides</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Termux Desktop Knowledge Base
        </h1>
        <p className="mt-1 text-slate-400 text-sm">
          Browse official guides for hardware acceleration, window manager customization, and phantom process prevention.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Guides List */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search guides..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 placeholder:text-slate-600"
            />
          </div>

          <div className="space-y-3">
            {filteredGuides.map((guide) => {
              const isSelected = selectedGuide.id === guide.id;
              return (
                <div
                  key={guide.id}
                  onClick={() => setSelectedGuide(guide)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-emerald-500/10 border-emerald-500/50 shadow-lg shadow-emerald-500/5'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider">{guide.category}</span>
                    <ChevronRight className={`w-4 h-4 text-slate-500 ${isSelected ? 'text-emerald-400' : ''}`} />
                  </div>
                  <h3 className="font-semibold text-sm text-white">{guide.title}</h3>
                  <p className="mt-1 text-xs text-slate-400 line-clamp-2">{guide.summary}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Guide Content Reader */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-8 shadow-xl">
          <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 mb-2">
            <FileText className="w-4 h-4" />
            <span>{selectedGuide.category} / {selectedGuide.id}.md</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-6">{selectedGuide.title}</h2>
          
          <div className="prose prose-invert max-w-none font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap bg-slate-950 p-6 rounded-xl border border-slate-800/80">
            {selectedGuide.content}
          </div>
        </div>
      </div>
    </div>
  );
};
