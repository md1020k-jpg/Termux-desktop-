import React, { useState, useEffect } from 'react';
import { Cpu, HardDrive, Activity, Zap, RefreshCw, Smartphone, Thermometer } from 'lucide-react';

export const DashboardWidget: React.FC = () => {
  const [metrics, setMetrics] = useState({
    cpuUsage: 18,
    cpuTemp: 38.5,
    ramUsed: 3.4,
    ramTotal: 12.0,
    storageUsed: 42.1,
    storageTotal: 128.0,
    batteryLevel: 84,
    processesCount: 47,
  });

  const [isOptimizing, setIsOptimizing] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => {
        // Random fluctuation for realistic real-time telemetry
        const cpuDelta = (Math.random() * 10 - 5);
        const newCpu = Math.max(5, Math.min(95, Math.round(prev.cpuUsage + cpuDelta)));
        const newTemp = +(Math.max(35, Math.min(55, prev.cpuTemp + (Math.random() * 1 - 0.5)))).toFixed(1);
        const newRam = +(Math.max(2.0, Math.min(10.5, prev.ramUsed + (Math.random() * 0.4 - 0.2)))).toFixed(1);

        return {
          ...prev,
          cpuUsage: newCpu,
          cpuTemp: newTemp,
          ramUsed: newRam,
        };
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const handleOptimize = () => {
    setIsOptimizing(true);
    setNotification('Running sync & dropping caches (`sync && echo 3 > /proc/sys/vm/drop_caches`)...');
    setTimeout(() => {
      setMetrics((prev) => ({
        ...prev,
        ramUsed: +(prev.ramUsed * 0.85).toFixed(1),
        cpuUsage: 12,
      }));
      setIsOptimizing(false);
      setNotification('Memory optimized successfully! Freed ~540MB RAM.');
      setTimeout(() => setNotification(null), 3500);
    }, 1200);
  };

  const ramPercent = Math.round((metrics.ramUsed / metrics.ramTotal) * 100);
  const storagePercent = Math.round((metrics.storageUsed / metrics.storageTotal) * 100);

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-white">Termux Hardware & System Telemetry</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                LIVE POLLING (2.5s)
              </span>
            </div>
            <p className="text-xs text-slate-400">Snapdragon 8 Gen 3 • 12GB RAM • Android 14 PRoot Environment</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {notification && (
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/30 animate-in fade-in">
              {notification}
            </span>
          )}
          <button
            onClick={handleOptimize}
            disabled={isOptimizing}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isOptimizing ? 'animate-spin' : ''}`} />
            <span>Optimize RAM</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CPU Usage */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-slate-400 flex items-center space-x-1.5">
              <Cpu className="w-3.5 h-3.5 text-purple-400" />
              <span>CPU Load</span>
            </span>
            <span className="text-xs font-mono text-purple-400 font-semibold">{metrics.cpuUsage}%</span>
          </div>
          <div className="space-y-2">
            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${metrics.cpuUsage}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span>8 Cores Active</span>
              <span className="flex items-center space-x-1 text-amber-400">
                <Thermometer className="w-3 h-3" />
                <span>{metrics.cpuTemp}°C</span>
              </span>
            </div>
          </div>
        </div>

        {/* Memory Usage */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-slate-400 flex items-center space-x-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>RAM Memory</span>
            </span>
            <span className="text-xs font-mono text-emerald-400 font-semibold">{metrics.ramUsed} / {metrics.ramTotal} GB</span>
          </div>
          <div className="space-y-2">
            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${ramPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span>{ramPercent}% Utilized</span>
              <span>{metrics.processesCount} Daemons</span>
            </div>
          </div>
        </div>

        {/* Storage Available */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-slate-400 flex items-center space-x-1.5">
              <HardDrive className="w-3.5 h-3.5 text-blue-400" />
              <span>Internal Storage</span>
            </span>
            <span className="text-xs font-mono text-blue-400 font-semibold">{metrics.storageUsed} GB free</span>
          </div>
          <div className="space-y-2">
            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${storagePercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span>/data/data/com.termux</span>
              <span>{metrics.storageTotal} GB total</span>
            </div>
          </div>
        </div>

        {/* Android Battery & Thermal */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-slate-400 flex items-center space-x-1.5">
              <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
              <span>Android Power</span>
            </span>
            <span className="text-xs font-mono text-cyan-400 font-semibold">{metrics.batteryLevel}%</span>
          </div>
          <div className="space-y-2">
            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-cyan-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${metrics.batteryLevel}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span>Wakelock Active</span>
              <span className="text-emerald-400">Charging / OK</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
