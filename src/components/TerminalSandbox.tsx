import React, { useState, useRef, useEffect } from 'react';
import { Terminal, PlaySquare, Maximize2, Minimize2, RotateCcw, Send, Folder, Monitor, Cpu, Sparkles } from 'lucide-react';

interface TerminalSandboxProps {
  // sandbox props
}

export const TerminalSandbox: React.FC<TerminalSandboxProps> = () => {
  const [inputVal, setInputVal] = useState('');
  const [activeWindow, setActiveWindow] = useState<'terminal' | 'filemanager' | 'settings'>('terminal');
  const [desktopMode, setDesktopMode] = useState<'xfce' | 'i3'>('xfce');
  const [history, setHistory] = useState<Array<{ type: 'input' | 'output' | 'error' | 'success'; text: string }>>([
    { type: 'success', text: 'Welcome to Termux Desktop Web Sandbox (v3.8 ARM64)' },
    { type: 'output', text: 'Type "help" to see available simulated commands (e.g. tx11start, proot-distro login ubuntu, fastfetch, pkg install).' },
    { type: 'output', text: 'u0_a294@localhost:~$ ' }
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const cmd = inputVal.trim();
    const newHistory = [...history, { type: 'input' as const, text: `u0_a294@localhost:~$ ${cmd}` }];

    let responseText = '';
    let responseType: 'output' | 'error' | 'success' = 'output';

    const lower = cmd.toLowerCase();
    if (lower === 'help') {
      responseText = 'Available commands:\n- tx11start : Start Termux-X11 server\n- tx11stop : Stop Termux-X11 server\n- proot-distro login ubuntu : Enter Ubuntu PRoot container\n- fastfetch / neofetch : Display system specs\n- pkg install <pkg> : Simulate package installation\n- clear : Clear terminal screen';
    } else if (lower === 'tx11start') {
      responseText = '[INFO] Starting Termux-X11 server on :0...\n[SUCCESS] Display server active. Socket listening.';
      responseType = 'success';
    } else if (lower === 'tx11stop') {
      responseText = '[INFO] Termux-X11 server stopped.';
    } else if (lower.startsWith('proot-distro')) {
      responseText = '[PRoot] Entering container rootfs (Ubuntu 24.04)...\nroot@localhost:/# ';
    } else if (lower === 'fastfetch' || lower === 'neofetch') {
      responseText = '       /\\        u0_a294@termux\n      /  \\       --------------\n     / /\\ \\      OS: Android 14 (ARM64) with Termux\n    / ____ \\     Host: Snapdragon 8 Gen 3 (Adreno 750)\n   /_/    \\_\\    Uptime: 4 hours, 22 mins\n                 DE: XFCE4 / Termux-X11\n                 Kernel: Linux 6.1.0-android';
      responseType = 'success';
    } else if (lower.startsWith('pkg install') || lower.startsWith('apt install')) {
      responseText = `Reading package lists... Done\nBuilding dependency tree... Done\nReading state information... Done\nPreparing to unpack... Done\n[SUCCESS] Package successfully installed and linked to PATH.`;
      responseType = 'success';
    } else if (lower === 'clear') {
      setHistory([{ type: 'output', text: 'u0_a294@localhost:~$ ' }]);
      setInputVal('');
      return;
    } else {
      responseText = `bash: ${cmd}: command not found. Type "help" for available commands.`;
      responseType = 'error';
    }

    setHistory([...newHistory, { type: responseType, text: responseText }, { type: 'output', text: 'u0_a294@localhost:~$ ' }]);
    setInputVal('');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono w-fit mb-3">
            <PlaySquare className="w-3.5 h-3.5" />
            <span>Interactive Simulator</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Terminal & Desktop Sandbox
          </h1>
          <p className="mt-1 text-slate-400 text-sm">
            Interact with a simulated Termux terminal and preview your Linux X11 desktop workspace in real time.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center space-x-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setDesktopMode('xfce')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              desktopMode === 'xfce'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            XFCE4 Layout
          </button>
          <button
            onClick={() => setDesktopMode('i3')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              desktopMode === 'i3'
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            i3 Tiling Layout
          </button>
        </div>
      </div>

      {/* Main Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Terminal Side */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[520px]">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-xs font-mono text-slate-400">termux@android: ~</span>
            </div>
            <Terminal className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="p-4 overflow-y-auto flex-1 font-mono text-xs space-y-2 bg-slate-950 text-slate-200">
            {history.map((item, idx) => (
              <div key={idx} className="whitespace-pre-wrap leading-relaxed">
                <span className={item.type === 'error' ? 'text-red-400' : item.type === 'success' ? 'text-emerald-400' : item.type === 'input' ? 'text-cyan-400 font-semibold' : 'text-slate-300'}>
                  {item.text}
                </span>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={handleCommandSubmit} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center space-x-2">
            <span className="text-emerald-400 font-mono text-xs">&gt;</span>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Type command (e.g. tx11start, fastfetch, help)..."
              className="flex-1 bg-transparent text-xs font-mono text-white focus:outline-none placeholder:text-slate-600"
            />
            <button type="submit" className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono transition">
              <Send className="w-3 h-3" />
            </button>
          </form>
        </div>

        {/* Live X11 / VNC Desktop Preview Window */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[520px]">
          {/* Desktop Top Panel / Status Bar */}
          <div className="bg-slate-950 border-b border-slate-800 px-4 py-2 flex items-center justify-between text-xs font-mono text-slate-300">
            <div className="flex items-center space-x-3">
              <span className="flex items-center space-x-1.5 text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Termux-X11 (:0)</span>
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400">{desktopMode === 'xfce' ? 'XFCE4 Session' : 'i3wm Tiling'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">1920x1080 @ 60Hz</span>
            </div>
          </div>

          {/* Simulated Desktop Canvas Area */}
          <div className="relative flex-1 bg-slate-950/95 overflow-hidden p-6 flex flex-col justify-between bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
            {/* Desktop Icons */}
            <div className="grid grid-cols-4 gap-4 w-fit">
              <div
                onClick={() => setActiveWindow('terminal')}
                className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-slate-800/50 cursor-pointer group w-20"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition">
                  <Terminal className="w-5 h-5" />
                </div>
                <span className="mt-1.5 text-[11px] text-slate-300 font-medium text-center truncate w-full">Terminal</span>
              </div>

              <div
                onClick={() => setActiveWindow('filemanager')}
                className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-slate-800/50 cursor-pointer group w-20"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-105 transition">
                  <Folder className="w-5 h-5" />
                </div>
                <span className="mt-1.5 text-[11px] text-slate-300 font-medium text-center truncate w-full">Thunar</span>
              </div>
            </div>

            {/* Active Floating Simulated Window */}
            {activeWindow === 'terminal' && (
              <div className="absolute top-16 left-12 right-12 bottom-16 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="bg-slate-800 px-4 py-2 flex items-center justify-between border-b border-slate-700">
                  <div className="flex items-center space-x-2">
                    <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-xs font-mono text-white">XFCE Terminal - root@localhost</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <button onClick={() => setActiveWindow('settings')} className="text-slate-400 hover:text-white"><Minimize2 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setActiveWindow('settings')} className="text-slate-400 hover:text-white"><Maximize2 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setActiveWindow('settings')} className="text-red-400 hover:text-red-300">×</button>
                  </div>
                </div>
                <div className="p-4 bg-slate-950 flex-1 font-mono text-xs text-slate-200 overflow-y-auto space-y-1">
                  <div className="text-emerald-400">root@localhost:~# apt update && apt upgrade</div>
                  <div className="text-slate-400">Hit:1 http://ports.ubuntu.com/ubuntu-ports noble InRelease</div>
                  <div className="text-slate-400">Reading package lists... Done</div>
                  <div className="text-emerald-400">root@localhost:~# htop</div>
                  <div className="text-cyan-400 mt-2">[CPU: 12% | Mem: 2.1GB/12GB | Load: 0.85]</div>
                </div>
              </div>
            )}

            {activeWindow === 'filemanager' && (
              <div className="absolute top-16 left-12 right-12 bottom-16 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="bg-slate-800 px-4 py-2 flex items-center justify-between border-b border-slate-700">
                  <div className="flex items-center space-x-2">
                    <Folder className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-xs font-mono text-white">Thunar File Manager - /home/user</span>
                  </div>
                  <button onClick={() => setActiveWindow('terminal')} className="text-red-400 hover:text-red-300">×</button>
                </div>
                <div className="p-4 bg-slate-950 flex-1 font-mono text-xs text-slate-200 grid grid-cols-3 gap-4">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center space-x-3 cursor-pointer hover:border-blue-500/50">
                    <Folder className="w-5 h-5 text-yellow-400" />
                    <span>Desktop</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center space-x-3 cursor-pointer hover:border-blue-500/50">
                    <Folder className="w-5 h-5 text-yellow-400" />
                    <span>Downloads</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center space-x-3 cursor-pointer hover:border-blue-500/50">
                    <Folder className="w-5 h-5 text-yellow-400" />
                    <span>Documents</span>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Desktop Taskbar */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-2 flex items-center justify-between backdrop-blur-md">
              <div className="flex items-center space-x-3">
                <button onClick={() => setActiveWindow('terminal')} className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition">
                  <Terminal className="w-4 h-4" />
                </button>
                <button onClick={() => setActiveWindow('filemanager')} className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition">
                  <Folder className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center space-x-3 text-xs font-mono text-slate-400">
                <span className="flex items-center space-x-1"><Cpu className="w-3.5 h-3.5 text-purple-400" /><span>14%</span></span>
                <span>07:12 AM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
