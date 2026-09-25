# TFE Windows Desktop Application Architecture

## Overview

This document outlines the architecture for the TFE (The Find Edit) Windows desktop application built using Electron while preserving the existing Next.js web application.

## Architecture Decision

**Technology Choice: Electron**

Electron was selected over Tauri based on technical compatibility analysis:

### Why Electron Was Selected

1. **95% Code Reuse**: Existing React components, Supabase integration, and business logic work unchanged
2. **Next.js Native Support**: No architectural changes required to the existing web application
3. **Faster Development**: Familiar Node.js environment reduces learning curve
4. **Lower Risk**: Proven compatibility with React/Next.js applications
5. **Supabase Compatibility**: Server and client patterns work without modification

### Electron vs Tauri Comparison

| Factor | Electron | Tauri | Winner |
|--------|----------|-------|---------|
| **Code Reuse** | 95% | 75% | Electron |
| **Development Complexity** | Low | High | Electron |
| **Next.js Compatibility** | Native | Requires static export | Electron |
| **Performance** | Good (100-200MB) | Excellent (10-50MB) | Tauri |
| **Bundle Size** | 150-300MB | 15-30MB | Tauri |
| **Security** | Good | Excellent | Tauri |

**Result**: Electron provides the best balance of development speed, code reuse, and compatibility for this project.

## Project Structure

```
TFE-Desktop/
├── app/                        # Existing TFE Next.js application (unchanged)
├── electron/                   # Electron desktop shell
│   ├── main.js                 # Main process entry point
│   ├── preload.js              # Security bridge
│   └── menu.js                 # Desktop application menu
├── desktop/                    # Desktop-specific utilities
│   ├── components/             # Desktop-only components
│   ├── utils/                  # Desktop utilities
│   │   └── desktop-utils.js    # Link handling, window management
│   └── config/                 # Desktop configuration
│       └── desktop-config.js   # Settings and constants
├── public/                     # Static assets (icons, images)
├── dist/                       # Build output directory
└── package.json               # Updated with desktop scripts
```

## How the Web App is Reused

The desktop application loads the existing Next.js web application with minimal changes:

### Preserved Components
- All existing React components in `app/components/`
- Supabase integration (`app/lib/supabase-*.ts`)
- Authentication systems
- Product data management
- Comparison and wishlist functionality
- Design system and styling
- Editorial content management

### Desktop-Specific Additions
- **Electron Main Process** (`electron/main.js`): Window management, security
- **Preload Bridge** (`electron/preload.js`): Secure IPC communication
- **Desktop Menu** (`electron/menu.js`): Native application menus
- **Link Handling** (`desktop/utils/`): External merchant link management
- **Window Management**: Desktop-specific window behavior

## Electron Entry Points

### Main Process (`electron/main.js`)
- Creates and manages the main application window
- Handles security policies and external link opening
- Loads the Next.js application (http://localhost:3000 in dev)
- Manages window state and lifecycle

### Preload Script (`electron/preload.js`)
- Provides secure bridge between main and renderer processes
- Exposes limited APIs via `window.electronAPI`
- Prevents direct Node.js access from renderer

### Menu System (`electron/menu.js`)
- Native desktop application menus
- Keyboard shortcuts for TFE functionality
- Platform-specific menu behavior

## Security Model

### Security Principles
- **Node Integration**: Disabled in renderer process
- **Context Isolation**: Enabled for secure communication
- **External Links**: Opened in system browser only
- **Content Security**: No arbitrary code execution
- **IPC Validation**: All messages validated

### Implementation
```javascript
webPreferences: {
  nodeIntegration: false,
  contextIsolation: true,
  enableRemoteModule: false,
  preload: path.join(__dirname, 'preload.js'),
  webSecurity: true
}
```

## Development Commands

### Start Development Environment
```bash
npm run desktop:dev
```
- Starts Next.js development server
- Launches Electron in development mode
- Enables hot reload for both web and desktop

### Build for Production
```bash
npm run desktop:build
```
- Builds Next.js application
- Prepares Electron for packaging

### Create Windows Installer
```bash
npm run desktop:dist
```
- Creates production build
- Generates Windows NSIS installer (.exe)
- Output: `dist/TFE - The Find Edit Setup.exe`

## Build Commands

### Web Application Build
The existing web application build remains unchanged:
```bash
npm run build  # Next.js build
npm run start  # Next.js production server
```

### Desktop Application Build
Desktop-specific builds use electron-builder:
```bash
npm run desktop:build  # Build + package
npm run desktop:dist   # Build + create installer
```

## Windows Installer Process

### Configuration
- **Installer Type**: NSIS (.exe)
- **App ID**: `com.thefindedit.desktop`
- **Product Name**: "TFE - The Find Edit"
- **Output Directory**: `dist/`

### Features
- User-configurable installation directory
- Desktop and Start Menu shortcuts
- Automatic uninstaller generation
- Windows-native installer experience

### Build Process
1. Next.js application is built to `.next/`
2. Electron packages the application
3. electron-builder creates Windows installer
4. Installer includes all dependencies and assets

## Known Limitations

### Current Limitations
1. **Bundle Size**: ~150-200MB (due to Electron + Chromium)
2. **Memory Usage**: ~100-200MB runtime (typical for Electron apps)
3. **Auto-Updates**: Not implemented in Phase 1
4. **System Tray**: Not implemented in Phase 1
5. **Notifications**: Basic only, no rich notifications yet

### Future Enhancements (Later Phases)
- Auto-update system
- System tray integration
- Rich desktop notifications
- Offline product caching
- Enhanced keyboard shortcuts
- Desktop-specific UI optimizations

## Future Phases

### Phase 2: Enhanced Features
- Auto-update system using electron-updater
- System tray with quick access
- Desktop notifications for deals and updates
- Enhanced keyboard navigation

### Phase 3: Advanced Integration
- Offline product caching with SQLite
- Desktop-specific UI optimizations
- Advanced search capabilities
- Integration with Windows features

### Phase 4: Performance & Polish
- Bundle size optimization
- Memory usage improvements
- Advanced security hardening
- Performance monitoring

## External Dependencies

### Desktop-Specific Packages
- `electron`: ^32.0.0 - Desktop application framework
- `electron-builder`: ^25.0.0 - Build and packaging
- `concurrently`: ^9.0.0 - Run multiple commands
- `cross-env`: ^7.0.0 - Cross-platform environment variables

### Existing Dependencies (Unchanged)
- Next.js 16.3.3 - Web framework
- React 19.2.8 - UI library
- Supabase - Database and authentication
- Tailwind CSS - Styling system

## Brand Integration

### TFE Design System Preserved
- **Colors**: Deep teal (#176B6B), warm cream (#FFFDF9)
- **Typography**: Elegant serif display, modern sans-serif body
- **Spacing**: Generous whitespace and subtle borders
- **Brand Voice**: "Good Finds. A Better You."

### Desktop Experience
- **Window**: Minimum 1100x700, professional appearance
- **Navigation**: "Home, Find, Shop, Categories, Collections, etc."
- **Functionality**: Discover → Compare → Shop workflow preserved
- **External Shopping**: Links open in system browser

## Compatibility

### Operating System
- **Primary Target**: Windows 10/11
- **Architecture**: x64 (can be extended to ARM64)
- **Dependencies**: .NET Framework (included in Windows)

### Web Application Compatibility
- **Next.js Build**: Must continue to work (`npm run build`)
- **Development**: Must continue to work (`npm run dev`)
- **Production**: Must continue to work (`npm run start`)
- **No Breaking Changes**: Web app remains fully functional

## Security Considerations

### Electron Security Best Practices
1. **Disable Node Integration**: Prevents renderer access to Node.js
2. **Enable Context Isolation**: Secure communication channel
3. **Validate External URLs**: Only HTTP/HTTPS in system browser
4. **Secure IPC**: All messages validated and typed
5. **Content Security Policy**: Restricts resource loading

### Data Security
- **Environment Variables**: Securely passed to renderer
- **Supabase Keys**: Public keys only (as in web version)
- **User Data**: Stored in Electron's app data directory
- **Session Management**: Handled by existing Supabase auth

This architecture provides a solid foundation for the TFE Windows desktop application while maintaining full compatibility with the existing web application.