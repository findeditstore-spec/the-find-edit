// Desktop-specific configuration for TFE
export const desktopConfig = {
  // Window settings
  window: {
    minWidth: 1100,
    minHeight: 700,
    defaultWidth: 1200,
    defaultHeight: 800,
    titleBarStyle: 'default'
  },

  // TFE branding
  branding: {
    appName: 'TFE - The Find Edit',
    appId: 'com.thefindedit.desktop',
    tagline: 'DISCOVER • COMPARE • SHOP SMARTER',
    motto: 'Good Finds. A Better You.'
  },

  // Security settings
  security: {
    nodeIntegration: false,
    contextIsolation: true,
    enableRemoteModule: false,
    webSecurity: true,
    allowRunningInsecureContent: false
  },

  // Development settings
  development: {
    devTools: true,
    reloadOnChange: true,
    debugMode: process.env.NODE_ENV === 'development'
  },

  // External link handling
  externalLinks: {
    openInBrowser: true,
    allowedProtocols: ['http:', 'https:', 'mailto:'],
    merchantDomains: [
      'amazon.com',
      'shopify.com',
      'etsy.com',
      'target.com',
      'walmart.com',
      'bestbuy.com'
    ]
  },

  // TFE color scheme
  colors: {
    primary: '#176B6B',      // Deep teal
    background: '#FFFDF9',   // Warm cream
    secondary: '#7A827D',    // Muted green
    accent: '#C9A86A',       // Restrained gold/ochre
    text: '#1F2937',         // Dark text
    border: '#EAE6DF'        // Subtle borders
  }
};

export default desktopConfig;