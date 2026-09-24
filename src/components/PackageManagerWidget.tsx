import React, { useState } from 'react';
import { Package, RefreshCw, ArrowUpCircle, CheckCircle2, Shield, Search } from 'lucide-react';

export const PackageManagerWidget: React.FC = () => {
  const [packages, setPackages] = useState([
    { name: 'xfce4', version: '4.18.0', status: 'Installed' },
    { name: 'xfce4-goodies', version: '4.18.2', status: 'Installed' },
    { name: 'dbus-x11', version: '1.14.10', status: 'Installed' },
    { name: 'box64', version: '0.3.0', status: 'Installed' },
    { name: 'wine64', version: '9.0-rc', status: 'Installed' },
    { name: 'pulseaudio', version: '16.1', status: 'Installed' },
    { name: 'mesa-vulkan-icd-turnip', version: '24.1.0', status: 'Installed' },
    { name: 'firefox', version: '125.0', status: 'Upgradable' },
    { name: 'vlc', version: '3.0.20', status: 'Installed' },
  ]);

  const [search, setSearch] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [actionLog, setActionLog] = useState<string | null>(null);

  const handleRunCommand = (action: 'update' | 'upgrade') => {
    setIsExecuting(true);
    setActionLog(`[PRoot apt] Running apt-${action} inside Ubuntu container...`);

    setTimeout(() => {
      if (action === 'upgrade') {
        setPackages((prev) =>
          prev.map((p) => (p.status === 'Upgradable' ? { ...p, status: 'Installed' } : p))
        );
      }
      setIsExecuting(false);
      setActionLog(`[SUCCESS] apt-${action} completed successfully.`);
      setTimeout(() => setActionLog(null), 4000);
    }, 1800);
  };

  const filteredPackages = packages.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-white text-base">PRoot Package Manager</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                APT / DPKG
              </span>
            </div>
            <p className="text-xs text-slate-400">Inspect installed packages and run apt update / upgrade commands in container</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {actionLog && (
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/30 animate-in fade-in">
              {actionLog}
            </span>
          )}
          <button
            disabled={isExecuting}
            onClick={() => handleRunCommand('update')}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-mono border border-slate-700 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isExecuting ? 'animate-spin' : ''}`} />
            <span>apt update</span>
          </button>

          <button
            disabled={isExecuting}
            onClick={() => handleRunCommand('upgrade')}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-mono transition shadow-md shadow-cyan-600/20"
          >
            <ArrowUpCircle className="w-3.5 h-3.5" />
            <span>apt upgrade</span>
          </button>
        </div>
      </div>

      {/* Search Filter */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter installed packages..."
          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-cyan-500 placeholder:text-slate-600"
        />
      </div>

      {/* Package List Grid */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden max-h-56 overflow-y-auto">
        <div className="grid grid-cols-3 px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-[11px] font-mono text-slate-400">
          <span>Package Name</span>
          <span>Version</span>
          <span>Status</span>
        </div>
        <div className="divide-y divide-slate-900">
          {filteredPackages.map((pkg, idx) => (
            <div key={idx} className="grid grid-cols-3 px-4 py-2.5 text-xs font-mono items-center hover:bg-slate-900/50">
              <span className="text-white font-medium">{pkg.name}</span>
              <span className="text-slate-400">{pkg.version}</span>
              <div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] ${
                  pkg.status === 'Upgradable'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {pkg.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
