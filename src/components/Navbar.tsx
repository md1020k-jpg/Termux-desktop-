import React from 'react';
import { Terminal, Cpu, Settings, PlaySquare, FileCode, Bot, BookOpen, Sparkles, Download, Check } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onQuickDownloadScript: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onQuickDownloadScript }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyCommand = () => {
    navigator.clipboard.writeText('pkg update && pkg install wget curl git && bash <(curl -s https://raw.githubusercontent.com/termux-desktop/termux-desktop/main/setup-termux-desktop)');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const navItems = [
    { id: 'wizard', label: 'Setup Wizard', icon: Sparkles },
    { id: 'control', label: 'Control Center', icon: Cpu },
    { id: 'sandbox', label: 'Terminal & Desktop', icon: PlaySquare },
    { id: 'configs', label: 'Dotfiles & Configs', icon: FileCode },
    { id: 'ai', label: 'AI Copilot', icon: Bot },
    { id: 'docs', label: 'Guides & Docs', icon: BookOpen },
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('wizard')}>
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 border border-emerald-400/30">
            <Terminal className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Termux Desktop
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                v3.8 Web Studio
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Linux X11/VNC & PRoot Control Center</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800/80">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyCommand}
            className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono border border-slate-700 transition"
            title="Copy one-line installer command"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Terminal className="w-3.5 h-3.5 text-cyan-400" />}
            <span className="truncate max-w-[160px]">bash setup-termux-desktop</span>
          </button>
          
          <button
            onClick={onQuickDownloadScript}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white text-xs font-medium shadow-md shadow-emerald-600/20 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export Script</span>
          </button>
        </div>
      </div>

      {/* Mobile Subheader Nav */}
      <div className="md:hidden flex overflow-x-auto space-x-1 px-4 py-2 border-t border-slate-800 bg-slate-950/80 no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 bg-slate-900 border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
