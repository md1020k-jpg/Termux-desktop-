import { ServiceItem } from '../types';

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: 'tx11',
    name: 'Termux-X11 Server',
    command: 'tx11start',
    description: 'Launch Termux-X11 display server with hardware acceleration & audio support.',
    category: 'x11',
    status: 'stopped',
    logs: ['[INFO] Initializing Termux-X11 socket...', '[READY] Socket /data/data/com.termux/files/usr/tmp/.X11-unix/X0 created.']
  },
  {
    id: 'vnc',
    name: 'TigerVNC Server',
    command: 'vncstart',
    description: 'Start TigerVNC server on port 5901 for VNC viewer access.',
    category: 'vnc',
    status: 'stopped',
    logs: ['[INFO] Starting Xvnc server on :1...', '[READY] VNC desktop listening on localhost:5901']
  },
  {
    id: 'hwa',
    name: 'Hardware Acceleration',
    command: 'enable-hw-acceleration',
    description: 'Configure Turnip Vulkan driver (Adreno) or Panfrost (Mali) for GPU rendering.',
    category: 'system',
    status: 'running',
    logs: ['[SUCCESS] GPU driver override enabled.', '[INFO] Turnip Vulkan driver active for Adreno GPU.']
  },
  {
    id: 'add2menu',
    name: 'Desktop App Menu Integrator',
    command: 'add2menu',
    description: 'Export Termux CLI applications (.desktop launchers) to XFCE/LXQt app menus.',
    category: 'utils',
    status: 'stopped',
    logs: ['[INFO] Scanning ~/.local/share/applications...', '[SUCCESS] 14 desktop entries linked.']
  },
  {
    id: 'repo',
    name: 'Fastest Termux Mirror',
    command: 'termux-fastest-repo',
    description: 'Select and switch to the lowest latency package repository mirror.',
    category: 'system',
    status: 'stopped',
    logs: ['[INFO] Ping test across global mirrors...', '[SUCCESS] Selected mirror: mirrors.tuna.tsinghua.edu.cn']
  },
  {
    id: 'ssh',
    name: 'SSH Remote Server',
    command: 'termux-ssh',
    description: 'Start Dropbear / OpenSSH server for remote terminal management.',
    category: 'utils',
    status: 'stopped',
    logs: ['[INFO] Starting sshd on port 8022...', '[SUCCESS] Ready for remote connections: ssh localhost -p 8022']
  }
];

export const DOCUMENTATION_GUIDES = [
  {
    id: 'hw-acceleration',
    title: 'Hardware Acceleration Guide',
    category: 'Performance',
    summary: 'How to enable Turnip Vulkan & Zink OpenGL drivers on Snapdragon Adreno GPUs for 60fps desktop rendering.',
    content: `# Hardware Acceleration on Termux Desktop

Running a Linux desktop on Android requires direct GPU rendering to achieve smooth performance without CPU bottlenecking.

## 1. Adreno GPUs (Snapdragon)
Adreno devices benefit immensely from **Turnip** (open-source Vulkan driver) and **Zink** (OpenGL over Vulkan):
\`\`\`bash
bash enable-hw-acceleration
\`\`\`
This script configures mesa drivers, installs \`mesa-vulkan-icd-turnip\`, and sets environment variables \`MESA_LOADER_DRIVER_OVERRIDE=zink\` and \`GALLIUM_DRIVER=zink\`.

## 2. Mali GPUs (MediaTek / Exynos)
For Mali GPUs, Panfrost / Panthor drivers are configured automatically if supported by your kernel version or PRoot container.
`
  },
  {
    id: 'proot-container',
    title: 'PRoot Container Distros',
    category: 'System',
    summary: 'Running Ubuntu, Debian, or Arch Linux inside PRoot containers with full apt/pacman package management.',
    content: `# PRoot Container Environment

PRoot allows chrooting without root privileges on Android.

## Supported Distros
- **Ubuntu 24.04 LTS**: Best compatibility with desktop packages & Wine.
- **Debian 12 Bookworm**: Rock-solid stability.
- **Arch Linux**: Bleeding-edge packages via AUR and pacman.

## Starting a PRoot Session
\`\`\`bash
proot-distro login ubuntu --shared-tmp
\`\`\`
`
  },
  {
    id: 'xfce-styles',
    title: 'XFCE4 Customization & Themes',
    category: 'Appearance',
    summary: 'Configuring XFCE panels, XFWM themes, GTK dark mode, and desktop icons.',
    content: `# XFCE4 Desktop Customization

XFCE4 is the default recommended desktop environment for Termux Desktop due to its lightweight resource footprint and full system tray support.

## Recommended Themes
- **GTK Theme**: Nordic-Darker or Orchis-Dark
- **Icons**: Tela-circle-dark
- **Window Manager**: XFWM4 compositing enabled with VSync.
`
  },
  {
    id: 'disable-phantom',
    title: 'Disable Android Phantom Process Killer',
    category: 'Troubleshooting',
    summary: 'Preventing Android 12+ from killing background Termux server processes.',
    content: `# Disabling Phantom Process Killer

Android 12 and higher introduced a phantom process limit that kills background child processes spawned by apps like Termux.

## Solution via ADB
Run this command from a connected PC via ADB:
\`\`\`bash
adb shell settings put global max_phantom_processes 2147483647
\`\`\`
Or use Shizuku / Wireless Debugging if rooted or running ADB companion apps.
`
  },
  {
    id: 'wine-desktop',
    title: 'Running Windows Apps via Wine',
    category: 'Advanced',
    summary: 'Running x86_64 Windows applications and games on ARM64 Android using Box64 + Wine.',
    content: `# Wine & Box64 on Termux Desktop

Combine **Box64** (x86_64 emulator for ARM64) with **Wine** to run Windows executables (.exe) inside your Termux X11 desktop!

\`\`\`bash
sudo apt install wine box64
wine notepad.exe
\`\`\`
`
  }
];
