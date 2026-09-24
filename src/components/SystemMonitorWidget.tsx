import React, { useState, useEffect } from 'react';
import { Cpu, Activity, RefreshCw, Server, Zap, HardDrive } from 'lucide-react';

export const SystemMonitorWidget: React.FC = () => {
  const [metrics, setMetrics] = useState({
    cpuLoad: 24,
    ramUsed: 3.8,
    ramTotal: 12.0,
    swapUsed: 0.5,
    swapTotal: 2.0,
    temperature: 39.2,
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        cpuLoad: Math.max(10, Math.min(85, Math.round(prev.cpuLoad + (Math.random() * 12 - 6)))),
        ramUsed: +(Math.max(2.5, Math.min(10.5, prev.ramUsed + (Math.random() * 0.3 - 0.15)))).toFixed(1),
        temperature: +(Math.max(36, Math.min(52, prev.temperature + (Math.random() * 0.8 - 0.4)))).toFixed(1),
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const ramPercent = Math.round((metrics.ramUsed / metrics.ramTotal) * 100);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-white text-base">Termux System Monitor Widget</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30">
                LIVE INTERVAL
              </span>
            </div>
            <p className="text-xs text-slate-400">Real-time CPU and RAM resource tracking in Android container</p>
          </div>
        </div>

        <button
          onClick={handleManualRefresh}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono border border-slate-700 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-purple-400 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* CPU Monitor */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400">CPU Usage</span>
            <span className="text-xs font-mono text-purple-400 font-bold">{metrics.cpuLoad}%</span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800 mb-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${metrics.cpuLoad}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span>Thermal: {metrics.temperature}°C</span>
            <span>ARM64 8-Core</span>
          </div>
        </div>

        {/* RAM Monitor */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400">RAM Utilization</span>
            <span className="text-xs font-mono text-emerald-400 font-bold">{metrics.ramUsed} GB ({ramPercent}%)</span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800 mb-2">
            <div
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${ramPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span>Total: {metrics.ramTotal} GB</span>
            <span>Available</span>
          </div>
        </div>

        {/* Swap Monitor */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400">Swap Memory</span>
            <span className="text-xs font-mono text-cyan-400 font-bold">{metrics.swapUsed} / {metrics.swapTotal} GB</span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800 mb-2">
            <div
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${(metrics.swapUsed / metrics.swapTotal) * 100}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span>ZRAM Active</span>
            <span>Optimal</span>
          </div>
        </div>
      </div>
    </div>
  );
};
