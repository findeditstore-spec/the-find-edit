// Desktop-specific utilities for TFE
const { shell } = require('electron');

/**
 * Safely opens external URLs in the user's default browser
 * @param {string} url - The URL to open
 * @returns {Promise<{success: boolean, error?: string}>}
 */
async function openExternalLink(url) {
  try {
    // Validate URL
    const parsedUrl = new URL(url);

    // Only allow HTTP/HTTPS protocols
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      return { success: false, error: 'Invalid URL protocol' };
    }

    // Open in system browser
    await shell.openExternal(url);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Checks if a URL is a merchant/affiliate link
 * @param {string} url - The URL to check
 * @returns {boolean}
 */
function isMerchantLink(url) {
  const merchantDomains = [
    'amazon.com',
    'shopify.com',
    'etsy.com',
    'target.com',
    'walmart.com',
    'bestbuy.com',
    'nordstrom.com',
    'sephora.com',
    'ulta.com',
    'macys.com'
  ];

  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.toLowerCase();

    return merchantDomains.some(domain =>
      hostname === domain || hostname.endsWith(`.${domain}`)
    );
  } catch {
    return false;
  }
}

/**
 * Gets the current window state
 * @param {BrowserWindow} window - The Electron window
 * @returns {object} Window state information
 */
function getWindowState(window) {
  const bounds = window.getBounds();

  return {
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
    isMaximized: window.isMaximized(),
    isMinimized: window.isMinimized(),
    isFullScreen: window.isFullScreen()
  };
}

/**
 * Restores window state
 * @param {BrowserWindow} window - The Electron window
 * @param {object} state - Previously saved window state
 */
function restoreWindowState(window, state) {
  if (state) {
    window.setBounds({
      x: state.x || 0,
      y: state.y || 0,
      width: state.width || 1200,
      height: state.height || 800
    });

    if (state.isMaximized) {
      window.maximize();
    }
  }
}

/**
 * Creates desktop-specific keyboard shortcuts
 * @param {BrowserWindow} window - The Electron window
 */
function registerDesktopShortcuts(window) {
  // These shortcuts are handled by the menu system
  // This function exists for future desktop-specific shortcuts
  console.log('Desktop shortcuts registered for TFE');
}

module.exports = {
  openExternalLink,
  isMerchantLink,
  getWindowState,
  restoreWindowState,
  registerDesktopShortcuts
};