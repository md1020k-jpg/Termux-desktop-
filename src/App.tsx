/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { SetupWizard } from './components/SetupWizard';
import { ControlCenter } from './components/ControlCenter';
import { TerminalSandbox } from './components/TerminalSandbox';
import { ConfigBuilder } from './components/ConfigBuilder';
import { AiAssistant } from './components/AiAssistant';
import { DocsViewer } from './components/DocsViewer';
import { SetupConfig, ServiceItem } from './types';
import { INITIAL_SERVICES } from './data/termuxData';

export default function App() {
  const [activeTab, setActiveTab] = useState('wizard');

  const [setupConfig, setSetupConfig] = useState<SetupConfig>({
    de: 'xfce',
    protocol: 'termux-x11',
    hwa: 'adreno',
    distro: 'ubuntu',
    audio: true,
    username: 'termux',
    installWine: false,
    installBrowsers: true,
  });

  const [services, setServices] = useState<ServiceItem[]>(INITIAL_SERVICES);

  const handleExportScript = () => {
    const scriptContent = `#!/usr/bin/env bash
# Termux Desktop Automated Installer Script
# DE: ${setupConfig.de} | Protocol: ${setupConfig.protocol} | HWA: ${setupConfig.hwa} | Distro: ${setupConfig.distro}

pkg update -y && pkg install -y wget curl git proot-distro pulseaudio
${setupConfig.protocol === 'termux-x11' ? 'pkg install -y termux-x11-nightly' : 'pkg install -y tigervnc'}
${setupConfig.hwa === 'adreno' ? 'pkg install -y mesa-vulkan-icd-turnip zink' : ''}
proot-distro install ${setupConfig.distro}
echo "[+] Setup configuration exported successfully from Termux Desktop Web Studio!"
`;
    const blob = new Blob([scriptContent], { type: 'text/x-sh;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'setup-termux-desktop.sh';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onQuickDownloadScript={handleExportScript}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'wizard' && (
          <SetupWizard
            config={setupConfig}
            setConfig={setSetupConfig}
            onExportScript={handleExportScript}
          />
        )}
        {activeTab === 'control' && (
          <ControlCenter
            services={services}
            setServices={setServices}
          />
        )}
        {activeTab === 'sandbox' && (
          <TerminalSandbox />
        )}
        {activeTab === 'configs' && (
          <ConfigBuilder />
        )}
        {activeTab === 'ai' && (
          <AiAssistant />
        )}
        {activeTab === 'docs' && (
          <DocsViewer />
        )}
      </main>
    </div>
  );
}
