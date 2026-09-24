export type DesktopEnvironment = 'xfce' | 'lxqt' | 'i3' | 'openbox' | 'gnome-lite';
export type DisplayProtocol = 'termux-x11' | 'vnc' | 'proot-distro';
export type HardwareAccel = 'adreno' | 'mali' | 'none';
export type DistroType = 'ubuntu' | 'debian' | 'arch' | 'alpine';

export interface SetupConfig {
  de: DesktopEnvironment;
  protocol: DisplayProtocol;
  hwa: HardwareAccel;
  distro: DistroType;
  audio: boolean;
  username: string;
  installWine: boolean;
  installBrowsers: boolean;
}

export interface ServiceItem {
  id: string;
  name: string;
  command: string;
  description: string;
  category: 'x11' | 'vnc' | 'system' | 'utils';
  status: 'stopped' | 'running';
  logs: string[];
}
