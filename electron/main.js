const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow;
let projectorWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        icon: path.join(__dirname, '../public/favicon.svg'),
        autoHideMenuBar: true,
        title: "VoiceBible"
    });

    const startUrl = isDev
        ? 'http://localhost:5173'
        : `file://${path.join(__dirname, '../dist/index.html')}`;

    mainWindow.loadURL(startUrl);

    // Handle window closed
    mainWindow.on('closed', () => {
        mainWindow = null;
        if (projectorWindow) {
            projectorWindow.close();
        }
    });
}

function createProjectorWindow() {
    if (projectorWindow) return;

    const displays = screen.getAllDisplays();
    // Find external display (if any), otherwise use primary
    const externalDisplay = displays.find((display) => display.bounds.x !== 0 && display.bounds.y !== 0) || displays[0];

    projectorWindow = new BrowserWindow({
        x: externalDisplay.bounds.x + 50,
        y: externalDisplay.bounds.y + 50,
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        autoHideMenuBar: true,
        title: "VoiceBible Projection",
        show: false // Don't show until ready
    });

    const projectorUrl = isDev
        ? 'http://localhost:5173/projector'
        : `file://${path.join(__dirname, '../dist/index.html')}#/projector`; // Hash routing for production if needed, or query param

    // For React Router in Electron, hash router is safer, but let's try direct path first.
    // Actually, for file:// protocol, memory router or hash router is best. 
    // Let's assume standard Vite SPA.

    if (isDev) {
        projectorWindow.loadURL('http://localhost:5173/projector');
    } else {
        // In production, we typically need HashRouter. 
        // But standard BrowserRouter with file:// often fails.
        // We will try loading index.html and injecting history push? 
        // Easier: Use a query param that App.tsx detects to redirect?
        // Or just assume HashRouter is used?
        // Let's just load the URL and see. 
        projectorWindow.loadURL(`file://${path.join(__dirname, '../dist/index.html')}`);

        // Inject navigation script after load
        projectorWindow.webContents.on('did-finish-load', () => {
            projectorWindow.webContents.executeJavaScript(`window.history.pushState({}, '', '/projector'); window.dispatchEvent(new PopStateEvent('popstate'));`);
        });
    }

    projectorWindow.once('ready-to-show', () => {
        projectorWindow.show();
        if (!isDev) projectorWindow.setFullScreen(true);
    });

    projectorWindow.on('closed', () => {
        projectorWindow = null;
    });
}

app.whenReady().then(() => {
    createWindow();

    ipcMain.on('project-verse', (event, verseData) => {
        if (!projectorWindow) {
            createProjectorWindow();
            // Wait slightly for window to load before sending (naïve approach)
            // Better: use 'did-finish-load' or send immediately and let projector request state?
            // For now, let's wait 1s if just created, or send immediately if exists.

            // Actually, best pattern: Projector sends "ready" event.
            // But for speed, let's use the 'did-finish-load' of the new window to send cached data?

            // Simple approach for now:
            setTimeout(() => {
                if (projectorWindow) {
                    projectorWindow.webContents.send('update-verse', verseData);
                }
            }, 1000);
        } else {
            projectorWindow.webContents.send('update-verse', verseData);
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
