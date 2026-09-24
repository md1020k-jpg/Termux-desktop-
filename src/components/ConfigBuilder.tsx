import React, { useState } from 'react';
import { FileCode, Copy, Check, Download, Settings, Sliders } from 'lucide-react';

export const ConfigBuilder: React.FC = () => {
  const [activeFile, setActiveFile] = useState<'termux.properties' | 'colors.properties' | '.aliases' | 'config.jsonc'>('termux.properties');

  const [files, setFiles] = useState({
    'termux.properties': `# Termux Properties Configuration
# Extra keys row configuration
extra-keys = [['ESC','/','-','HOME','UP','END','PGUP'],['TAB','CTRL','ALT','LEFT','DOWN','RIGHT','PGDN']]

# Allow external apps to execute intents
allow-external-apps = true

# Bell character action
bell-character = ignore
`,
    'colors.properties': `# Termux Color Scheme (Nord Dark)
background = #2e3440
foreground = #d8dee9
cursor = #d8dee9

color0 = #3b4252
color1 = #bf616a
color2 = #a3be8c
color3 = #ebcb8b
color4 = #81a1c1
color5 = #b48ead
color6 = #88c0d0
color7 = #e5e9f0
`,
    '.aliases': `# Termux Desktop Shell Aliases
alias update="pkg update && pkg upgrade"
alias startx="tx11start"
alias stopx="tx11stop"
alias ubuntu="proot-distro login ubuntu --shared-tmp"
alias ll="ls -la --color=auto"
`,
    'config.jsonc': `{
  // Termux Desktop JSON Configuration
  "display_server": "termux-x11",
  "resolution": "1920x1080",
  "hardware_acceleration": true,
  "driver": "turnip",
  "audio_forwarding": true
}`
  });

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(files[activeFile]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([files[activeFile]], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = activeFile;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-mono w-fit mb-3">
          <FileCode className="w-3.5 h-3.5" />
          <span>Dotfiles & Configuration Studio</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Config & Dotfiles Builder
        </h1>
        <p className="mt-1 text-slate-400 text-sm">
          Customize Termux properties, color palettes, shell aliases, and JSON preferences with instant export.
        </p>
      </div>

      {/* File Selector Tabs */}
      <div className="flex overflow-x-auto space-x-2 pb-2 no-scrollbar">
        {(['termux.properties', 'colors.properties', '.aliases', 'config.jsonc'] as const).map((filename) => (
          <button
            key={filename}
            onClick={() => setActiveFile(filename)}
            className={`px-4 py-2 rounded-xl text-xs font-mono transition flex items-center space-x-2 shrink-0 ${
              activeFile === filename
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-md'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>{filename}</span>
          </button>
        ))}
      </div>

      {/* Editor Box */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[550px]">
        {/* Editor Toolbar */}
        <div className="flex items-center justify-between px-6 py-3 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="ml-2 text-xs font-mono text-slate-300">{activeFile}</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>
          </div>
        </div>

        {/* Textarea Editor */}
        <textarea
          value={files[activeFile]}
          onChange={(e) => setFiles({ ...files, [activeFile]: e.target.value })}
          className="w-full flex-1 bg-slate-950 p-6 font-mono text-xs text-emerald-400 leading-relaxed focus:outline-none resize-none selection:bg-purple-500 selection:text-black"
          spellCheck={false}
        />

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-900/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Place in <code className="text-purple-400">~/.termux/</code> or project folder</span>
          <span>Editable live</span>
        </div>
      </div>
    </div>
  );
};
