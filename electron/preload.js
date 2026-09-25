const { contextBridge, ipcRenderer } = require('electron');

// Security: Expose only specific APIs to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // App information
  getAppVersion: () => ipcRenderer.invoke('app:get-version'),
  getAppName: () => ipcRenderer.invoke('app:get-name'),

  // External link handling
  openExternal: (url) => ipcRenderer.invoke('shell:open-external', url),

  // Platform detection
  platform: process.platform,

  // Development mode detection
  isDev: process.env.NODE_ENV === 'development'
});

// Security: Remove any Node.js globals that might be exposed
delete window.require;
delete window.exports;
delete window.module;