import React, { useState } from 'react';
import { Terminal, RefreshCw, FileText, CheckCircle2 } from 'lucide-react';
import { ServiceItem } from '../types';

interface ServiceLogsWidgetProps {
  services: ServiceItem[];
}

export const ServiceLogsWidget: React.FC<ServiceLogsWidgetProps> = ({ services }) => {
  const [selectedServiceId, setSelectedServiceId] = useState<string>(services[0]?.id || 'tx11');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [logRefreshCount, setLogRefreshCount] = useState(0);

  const activeService = services.find((s) => s.id === selectedServiceId) || services[0];

  const handleRefreshLogs = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLogRefreshCount((c) => c + 1);
      setIsRefreshing(false);
    }, 500);
  };

  // Get last 10 lines
  const allLogs = activeService ? [...activeService.logs, `[LOG_POLL #${logRefreshCount + 1}] System daemon heartbeat OK. Socket responsive.`] : [];
  const last10Logs = allLogs.slice(-10);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-white text-base">Service Logs Widget</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                LAST 10 LINES
              </span>
            </div>
            <p className="text-xs text-slate-400">Inspect real-time system logs for Termux X11, VNC, and PRoot services</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Service Selector Tabs */}
          <select
            value={selectedServiceId}
            onChange={(e) => setSelectedServiceId(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-emerald-400 font-mono focus:outline-none"
          >
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.command})
              </option>
            ))}
          </select>

          <button
            onClick={handleRefreshLogs}
            disabled={isRefreshing}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono border border-slate-700 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh Logs</span>
          </button>
        </div>
      </div>

      {/* Logs Terminal Box */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 font-mono text-xs space-y-2 max-h-60 overflow-y-auto">
        <div className="flex items-center justify-between text-[11px] text-slate-500 pb-2 border-b border-slate-800">
          <span>Target Service: <span className="text-emerald-400">{activeService?.name}</span></span>
          <span>Showing last {last10Logs.length} entries</span>
        </div>

        {last10Logs.map((log, idx) => (
          <div key={idx} className="flex items-start space-x-2 leading-relaxed">
            <span className="text-emerald-500 select-none">&gt;</span>
            <span className={log.includes('SUCCESS') || log.includes('OK') ? 'text-emerald-400' : log.includes('ERROR') ? 'text-red-400' : 'text-slate-300'}>
              {log}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
