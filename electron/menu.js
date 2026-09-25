const { Menu, shell, app } = require('electron');

module.exports = (mainWindow) => {
  const isMac = process.platform === 'darwin';

  const template = [
    // macOS app menu
    ...(isMac ? [{
      label: app.getName(),
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    }] : []),

    // File menu
    {
      label: 'File',
      submenu: [
        {
          label: 'New Search',
          accelerator: 'CmdOrCtrl+K',
          click: () => {
            mainWindow.webContents.executeJavaScript(`
              if (window.location.pathname !== '/finds') {
                window.location.href = '/finds';
              }
              // Focus search input if available
              setTimeout(() => {
                const searchInput = document.querySelector('input[type="search"], input[placeholder*="search" i]');
                if (searchInput) searchInput.focus();
              }, 100);
            `);
          }
        },
        { type: 'separator' },
        {
          label: 'Wishlist',
          accelerator: 'CmdOrCtrl+W',
          click: () => {
            mainWindow.webContents.executeJavaScript(`
              window.location.href = '/wishlist';
            `);
          }
        },
        {
          label: 'Compare Products',
          accelerator: 'CmdOrCtrl+Shift+C',
          click: () => {
            mainWindow.webContents.executeJavaScript(`
              window.location.href = '/compare';
            `);
          }
        },
        { type: 'separator' },
        isMac ? { role: 'close' } : { role: 'quit' }
      ]
    },

    // Navigate menu
    {
      label: 'Navigate',
      submenu: [
        {
          label: 'Home',
          accelerator: 'CmdOrCtrl+H',
          click: () => {
            mainWindow.webContents.executeJavaScript(`window.location.href = '/';`);
          }
        },
        {
          label: 'Find Products',
          accelerator: 'CmdOrCtrl+F',
          click: () => {
            mainWindow.webContents.executeJavaScript(`window.location.href = '/finds';`);
          }
        },
        {
          label: 'Categories',
          accelerator: 'CmdOrCtrl+G',
          click: () => {
            mainWindow.webContents.executeJavaScript(`
              // Trigger categories menu in the web app
              const categoriesButton = document.querySelector('button:has-text("Categories"), [data-testid="categories-trigger"]');
              if (categoriesButton) {
                categoriesButton.click();
              } else {
                // Fallback to a category page
                window.location.href = '/fashion';
              }
            `);
          }
        },
        {
          label: 'Collections',
          accelerator: 'CmdOrCtrl+L',
          click: () => {
            mainWindow.webContents.executeJavaScript(`window.location.href = '/collections';`);
          }
        },
        { type: 'separator' },
        {
          label: 'Back',
          accelerator: 'CmdOrCtrl+Left',
          click: () => {
            if (mainWindow.webContents.canGoBack()) {
              mainWindow.webContents.goBack();
            }
          }
        },
        {
          label: 'Forward',
          accelerator: 'CmdOrCtrl+Right',
          click: () => {
            if (mainWindow.webContents.canGoForward()) {
              mainWindow.webContents.goForward();
            }
          }
        },
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            mainWindow.webContents.reload();
          }
        }
      ]
    },

    // View menu
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
        { type: 'separator' },
        {
          label: 'Actual Size',
          accelerator: 'CmdOrCtrl+0',
          click: () => {
            mainWindow.webContents.setZoomLevel(0);
          }
        }
      ]
    },

    // Window menu
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' },
        ...(isMac ? [
          { type: 'separator' },
          { role: 'front' },
          { type: 'separator' },
          { role: 'window' }
        ] : [])
      ]
    },

    // Help menu
    {
      role: 'help',
      submenu: [
        {
          label: 'About TFE',
          click: () => {
            mainWindow.webContents.executeJavaScript(`window.location.href = '/about';`);
          }
        },
        {
          label: 'How It Works',
          click: () => {
            mainWindow.webContents.executeJavaScript(`window.location.href = '/how-it-works';`);
          }
        },
        { type: 'separator' },
        {
          label: 'Visit TFE Website',
          click: async () => {
            await shell.openExternal('https://thefindedit.com');
          }
        },
        {
          label: 'Report Issue',
          click: async () => {
            await shell.openExternal('mailto:hello@thefindedit.com?subject=Desktop App Issue');
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  return menu;
};