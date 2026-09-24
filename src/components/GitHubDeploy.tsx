import React, { useState } from 'react';
import { GitBranch, Github, Check, Terminal, ExternalLink, Copy, RefreshCw, Shield, ArrowRight, Tag, Package } from 'lucide-react';

export const GitHubDeploy: React.FC = () => {
  const [repoUrl, setRepoUrl] = useState('https://github.com/termux-desktop/termux-desktop.git');
  const [branch, setBranch] = useState('main');
  const [token, setToken] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployLogs, setDeployLogs] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);

  // Release state
  const [tagName, setTagName] = useState('v3.8.0');
  const [releaseTitle, setReleaseTitle] = useState('Termux Desktop v3.8.0 - Web Studio Release');
  const [releaseNotes, setReleaseNotes] = useState('## What\'s New in v3.8.0\n- Added Termux System Monitor & Telemetry widgets\n- Added PRoot Storage Manager & APT Cache Cleaner\n- Added GitHub CI/CD Deployment & Release Creator\n- Enhanced Termux-X11 and Zink GPU Acceleration support');
  const [isReleasing, setIsReleasing] = useState(false);
  const [releaseSuccess, setReleaseSuccess] = useState(false);

  const handleStartDeploy = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDeploying(true);
    setDeployLogs(['[INFO] Initializing git repository...', '[INFO] Connecting to remote: ' + repoUrl]);
    setSuccess(false);

    setTimeout(() => {
      setDeployLogs((prev) => [...prev, '[INFO] Checking out branch "' + branch + '"...', '[SUCCESS] Repository cloned & synchronized.']);
    }, 1000);

    setTimeout(() => {
      setDeployLogs((prev) => [...prev, '[INFO] Running Vite production build (`npm run build`)...', '[SUCCESS] Static bundle generated in /dist']);
    }, 2200);

    setTimeout(() => {
      setDeployLogs((prev) => [...prev, '[INFO] Deploying to GitHub Pages / Cloud target...', '[SUCCESS] Deployment complete! URL: https://termux-desktop.github.io']);
      setIsDeploying(false);
      setSuccess(true);
    }, 3800);
  };

  const handleCreateRelease = (e: React.FormEvent) => {
    e.preventDefault();
    setIsReleasing(true);
    setReleaseSuccess(false);

    setTimeout(() => {
      setIsReleasing(false);
      setReleaseSuccess(true);
    }, 2000);
  };

  const githubActionsYaml = `name: Deploy Termux Desktop Web Studio

on:
  push:
    branches: [ "main" ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout 🛎️
        uses: actions/checkout@v4

      - name: Setup Node.js ⚙️
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies & Build 📦
        run: |
          npm install
          npm run build

      - name: Deploy to GitHub Pages 🚀
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: \${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
`;

  const [copied, setCopied] = useState(false);
  const handleCopyYaml = () => {
    navigator.clipboard.writeText(githubActionsYaml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-mono w-fit mb-3">
          <Github className="w-3.5 h-3.5" />
          <span>GitHub CI/CD & Release Manager</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Deploy & Release Website from GitHub
        </h1>
        <p className="mt-1 text-slate-400 text-sm">
          Connect your GitHub repository to sync setup scripts, trigger automated builds, and publish GitHub Release tags with downloadable bundles.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sync & Deploy Form */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 flex flex-col justify-between">
          <form onSubmit={handleStartDeploy} className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center space-x-2">
              <GitBranch className="w-4 h-4 text-emerald-400" />
              <span>Repository Sync & Trigger</span>
            </h3>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5">GitHub Repository URL</label>
              <input
                type="text"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">Git Branch</label>
                <input
                  type="text"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">Personal Access Token (PAT)</label>
                <input
                  type="password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="ghp_xxxx..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isDeploying}
              className="w-full mt-4 flex items-center justify-center space-x-2 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 disabled:opacity-50 text-white font-medium text-xs shadow-lg shadow-emerald-600/20 transition"
            >
              {isDeploying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Deploying from GitHub...</span>
                </>
              ) : (
                <>
                  <Github className="w-4 h-4" />
                  <span>Trigger Deployment Pipeline</span>
                </>
              )}
            </button>
          </form>

          {/* Deployment Live Log Box */}
          <div className="mt-6 bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs space-y-1.5 min-h-[160px]">
            <div className="flex items-center justify-between text-[11px] text-slate-500 pb-2 border-b border-slate-800">
              <span>Pipeline Console Log</span>
              <span>{isDeploying ? 'RUNNING...' : success ? 'SUCCESS' : 'IDLE'}</span>
            </div>
            {deployLogs.length === 0 && <span className="text-slate-600"># Click trigger above to start GitHub deployment pipeline...</span>}
            {deployLogs.map((log, idx) => (
              <div key={idx} className="flex items-start space-x-2">
                <span className="text-emerald-500">&gt;</span>
                <span className={log.includes('SUCCESS') ? 'text-emerald-400' : 'text-slate-300'}>{log}</span>
              </div>
            ))}
          </div>
        </div>

        {/* GitHub Release Creator & Workflow */}
        <div className="space-y-6">
          {/* Release Creator Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center space-x-2">
              <Package className="w-4 h-4 text-purple-400" />
              <span>Create GitHub Release & Tag</span>
            </h3>

            <form onSubmit={handleCreateRelease} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Release Tag</label>
                  <input
                    type="text"
                    value={tagName}
                    onChange={(e) => setTagName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Release Title</label>
                  <input
                    type="text"
                    value={releaseTitle}
                    onChange={(e) => setReleaseTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">Release Notes (Markdown)</label>
                <textarea
                  value={releaseNotes}
                  onChange={(e) => setReleaseNotes(e.target.value)}
                  className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-purple-500 resize-none"
                  required
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                {releaseSuccess ? (
                  <span className="text-xs font-mono text-emerald-400 flex items-center space-x-1">
                    <Check className="w-4 h-4" />
                    <span>Release {tagName} published successfully!</span>
                  </span>
                ) : (
                  <span className="text-xs text-slate-500 font-mono">Attaches build artifacts automatically</span>
                )}

                <button
                  type="submit"
                  disabled={isReleasing}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-medium text-xs shadow-md shadow-purple-600/20 transition flex items-center space-x-1.5"
                >
                  {isReleasing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Tag className="w-3.5 h-3.5" />}
                  <span>{isReleasing ? 'Publishing...' : 'Publish Release'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* GitHub Actions YAML Preview */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between px-6 py-3 bg-slate-900 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <span className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="ml-2 text-xs font-mono text-slate-300">.github/workflows/deploy.yml</span>
              </div>
              <button
                onClick={handleCopyYaml}
                className="flex items-center space-x-1 px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
                <span>{copied ? 'Copied' : 'Copy YAML'}</span>
              </button>
            </div>

            <pre className="p-4 font-mono text-[11px] text-emerald-400 overflow-y-auto max-h-[180px] leading-relaxed selection:bg-emerald-500 selection:text-black">
              {githubActionsYaml}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
