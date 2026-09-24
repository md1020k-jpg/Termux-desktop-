import React, { useState } from 'react';
import { Archive, Download, CheckCircle2, RefreshCw, FolderArchive, Shield } from 'lucide-react';

export const BackupManagerWidget: React.FC = () => {
  const [backupPath, setBackupPath] = useState('/sdcard/Download/termux-ubuntu-backup.tar.gz');
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupLog, setBackupLog] = useState<string | null>(null);
  const [lastBackupTime, setLastBackupTime] = useState<string | null>(null);

  const handleTriggerBackup = () => {
    setIsBackingUp(true);
    setBackupLog('[PRoot] Tarball creation started: tar -czvf home/ --exclude="*.cache" ...');

    setTimeout(() => {
      setBackupLog('[PRoot] Compressing home directory to /sdcard/Download/ (Size: ~142MB)...');
    }, 1200);

    setTimeout(() => {
      setIsBackingUp(false);
      setBackupLog('[SUCCESS] Compressed backup successfully saved to ' + backupPath);
      setLastBackupTime(new Date().toLocaleTimeString());
      setTimeout(() => setBackupLog(null), 5000);
    }, 2800);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
            <Archive className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-white text-base">PRoot Backup Manager</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30">
                TARBALL COMPRESSION
              </span>
            </div>
            <p className="text-xs text-slate-400">Create compressed backups of your PRoot home directory to shared Android storage</p>
          </div>
        </div>

        {backupLog && (
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/30 animate-in fade-in">
            {backupLog}
          </span>
        )}
      </div>

      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-4">
        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1.5">Destination External Storage Path</label>
          <input
            type="text"
            value={backupPath}
            onChange={(e) => setBackupPath(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="text-xs font-mono text-slate-400">
            {lastBackupTime ? (
              <span className="text-emerald-400 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Last successful backup: {lastBackupTime}</span>
              </span>
            ) : (
              <span>No backup executed in this session yet.</span>
            )}
          </div>

          <button
            disabled={isBackingUp}
            onClick={handleTriggerBackup}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-medium text-xs shadow-lg shadow-purple-600/20 transition"
          >
            {isBackingUp ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Backing up PRoot Home...</span>
              </>
            ) : (
              <>
                <FolderArchive className="w-4 h-4" />
                <span>Trigger Compressed Backup</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
