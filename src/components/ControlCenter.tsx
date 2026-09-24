import React, { useState } from 'react';
import { ServiceItem } from '../types';
import { Play, Square, RefreshCw, Terminal, CheckCircle2, AlertCircle, Cpu, Wifi, Shield, Layers } from 'lucide-react';
import { DashboardWidget } from './DashboardWidget';
import { SystemMonitorWidget } from './SystemMonitorWidget';
import { ServiceLogsWidget } from './ServiceLogsWidget';
import { StorageManagerWidget } from './StorageManagerWidget';

interface ControlCenterProps {
  services: ServiceItem[];
  setServices: React.Dispatch<React.SetStateAction<ServiceItem[]>>;
}

export const ControlCenter: React.FC<ControlCenterProps> = ({ services, setServices }) => {
  const [selectedService, setSelectedService] = useState<ServiceItem>(services[0]);
  const [isExecuting, setIsExecuting] = useState(false);

  const handleToggleService = (id: string) => {
    setIsExecuting(true);
    setTimeout(() => {
      setServices((prev) =>
        prev.map((s) => {
          if (s.id === id) {
            const newStatus = s.status === 'running' ? 'stopped' : 'running';
            const timestamp = new Date().toLocaleTimeString();
            const newLog = newStatus === 'running' 
              ? `[${timestamp}] Service ${s.command} started successfully.` 
              : `[${timestamp}] Service ${s.command} stopped by user.`;
            return {
              ...s,
              status: newStatus,
              logs: [newLog, ...s.logs]
            };
          }
          return s;
        })
      );
      // update selected service reference
      const updated = services.find((s) => s.id === id);
      if (updated) {
        setSelectedService({
          ...updated,
          status: updated.status === 'running' ? 'stopped' : 'running',
          logs: [`[${new Date().toLocaleTimeString()}] Toggled service`, ...updated.logs]
        });
      }
      setIsExecuting(false);
    }, 800);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'x11': return <Terminal className="w-4 h-4 text-emerald-400" />;
      case 'vnc': return <Wifi className="w-4 h-4 text-cyan-400" />;
      case 'system': return <Cpu className="w-4 h-4 text-purple-400" />;
      default: return <Shield className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-mono w-fit mb-3">
          <Layers className="w-3.5 h-3.5" />
          <span>Termux Service Manager</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Control Center & Daemons
        </h1>
        <p className="mt-2 text-slate-400 text-sm">
          Manage X11 servers, VNC daemons, hardware acceleration drivers, and app menu integration commands.
        </p>
      </div>

      {/* Real-Time System Telemetry Dashboard Widget */}
      <DashboardWidget />

      {/* New System Monitor Widget */}
      <SystemMonitorWidget />

      {/* New Service Logs Widget */}
      <ServiceLogsWidget services={services} />

      {/* New PRoot Storage Manager Widget */}
      <StorageManagerWidget />

      {/* Grid of Services */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => {
          const isRunning = service.status === 'running';
          const isSelected = selectedService.id === service.id;

          return (
            <div
              key={service.id}
              onClick={() => setSelectedService(service)}
              className={`rounded-2xl border p-6 bg-slate-900/60 backdrop-blur-sm cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-emerald-500/60 shadow-xl shadow-emerald-500/10 bg-slate-900/90'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                      {getCategoryIcon(service.category)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-white">{service.name}</h3>
                      <span className="text-xs font-mono text-emerald-400">{service.command}</span>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-mono ${
                      isRunning
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                    <span>{isRunning ? 'Running' : 'Stopped'}</span>
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-6">
                  {service.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
                <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                  {service.category} service
                </span>
                <button
                  disabled={isExecuting}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleService(service.id);
                  }}
                  className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium transition ${
                    isRunning
                      ? 'bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25'
                      : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
                  }`}
                >
                  {isRunning ? (
                    <>
                      <Square className="w-3.5 h-3.5" />
                      <span>Stop Service</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>Start Service</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Service Log Console */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-sm text-white font-mono">
              Terminal Log Output: <span className="text-emerald-400">{selectedService.name}</span> ({selectedService.command})
            </span>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Status: {selectedService.status.toUpperCase()}
          </span>
        </div>

        <div className="bg-slate-900/80 rounded-xl p-4 font-mono text-xs text-slate-300 space-y-2 max-h-60 overflow-y-auto border border-slate-800/80">
          <div className="text-slate-500"># Executing command: {selectedService.command}</div>
          {selectedService.logs.map((log, index) => (
            <div key={index} className="flex items-start space-x-2">
              <span className="text-emerald-500">&gt;</span>
              <span className={log.includes('SUCCESS') ? 'text-emerald-400' : log.includes('ERROR') ? 'text-red-400' : 'text-slate-300'}>
                {log}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
