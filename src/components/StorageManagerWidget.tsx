import React, { useState } from 'react';
import { HardDrive, Trash2, CheckCircle2, RefreshCw, Folder, AlertTriangle } from 'lucide-react';

export const StorageManagerWidget: React.FC = () => {
  const [storageStats, setStorageStats] = useState({
    totalSpace: 128.0,
    usedSpace: 46.5,
    aptCacheSize: 1.2,
    tmpSize: 0.85,
    userCacheSize: 2.4,
  });

  const [isCleaning, setIsCleaning] = useState(false);
  const [cleanLog, setCleanLog] = useState<string | null>(null);

  const handleCleanAction = (type: 'apt' | 'tmp' | 'all') => {
    setIsCleaning(true);
    setCleanLog(`[PRoot] Executing cleanup command for ${type}...`);

    setTimeout(() => {
      setStorageStats((prev) => {
        if (type === 'apt') {
          return { ...prev, aptCacheSize: 0.0, usedSpace: +(prev.usedSpace - prev.aptCacheSize).toFixed(1) };
        } else if (type === 'tmp') {
          return { ...prev, tmpSize: 0.0, usedSpace: +(prev.usedSpace - prev.tmpSize).toFixed(1) };
        } else {
          return {
            ...prev,
            aptCacheSize: 0.0,
            tmpSize: 0.0,
            userCacheSize: 0.4,
            usedSpace: +(prev.usedSpace - (prev.aptCacheSize + prev.tmpSize + 2.0)).toFixed(1),
          };
        }
      });
      setIsCleaning(false);
      setCleanLog(`[SUCCESS] PRoot cleanup completed successfully. Freed storage space.`);
      setTimeout(() => setCleanLog(null), 4000);
    }, 1000);
  };

  const freeSpace = +(storageStats.totalSpace - storageStats.usedSpace).toFixed(1);
  const usagePercent = Math.round((storageStats.usedSpace / storageStats.totalSpace) * 100);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-white text-base">PRoot Storage Manager</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/15 text-blue-300 border border-blue-500/30">
                DISTRO CACHE CLEANER
              </span>
            </div>
            <p className="text-xs text-slate-400">Manage storage partitions, apt archives, and temporary directories inside proot-distro</p>
          </div>
        </div>

        {cleanLog && (
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/30 animate-in fade-in">
            {cleanLog}
          </span>
        )}
      </div>

      {/* Storage Bar */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400">PRoot Rootfs Usage ({storageStats.usedSpace} GB used / {freeSpace} GB free)</span>
          <span className="text-blue-400 font-bold">{usagePercent}%</span>
        </div>
        <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-slate-800">
          <div
            className="bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${usagePercent}%` }}
          />
        </div>
      </div>

      {/* Breakdown & Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* APT Cache */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono text-slate-300 font-semibold">APT Package Cache</span>
              <span className="text-xs font-mono text-amber-400">{storageStats.aptCacheSize} GB</span>
            </div>
            <p className="text-[11px] text-slate-500 font-mono">/var/cache/apt/archives/*.deb</p>
          </div>
          <button
            disabled={isCleaning || storageStats.aptCacheSize === 0}
            onClick={() => handleCleanAction('apt')}
            className="w-full flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-mono border border-slate-700 transition"
          >
            <Trash2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Clean APT Cache</span>
          </button>
        </div>

        {/* TMP Directory */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono text-slate-300 font-semibold">Temp Files (/tmp)</span>
              <span className="text-xs font-mono text-red-400">{storageStats.tmpSize} GB</span>
            </div>
            <p className="text-[11px] text-slate-500 font-mono">/tmp/* & X11 sockets</p>
          </div>
          <button
            disabled={isCleaning || storageStats.tmpSize === 0}
            onClick={() => handleCleanAction('tmp')}
            className="w-full flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-mono border border-slate-700 transition"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-400" />
            <span>Clear /tmp</span>
          </button>
        </div>

        {/* Clean All */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono text-slate-300 font-semibold">Total Junk & Caches</span>
              <span className="text-xs font-mono text-emerald-400">
                +{(storageStats.aptCacheSize + storageStats.tmpSize + 1.0).toFixed(2)} GB
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-mono">APT + /tmp + ~/.cache</p>
          </div>
          <button
            disabled={isCleaning}
            onClick={() => handleCleanAction('all')}
            className="w-full flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 disabled:opacity-50 text-white text-xs font-mono transition shadow-md shadow-blue-600/20"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isCleaning ? 'animate-spin' : ''}`} />
            <span>Clean All Caches</span>
          </button>
        </div>
      </div>
    </div>
  );
};
