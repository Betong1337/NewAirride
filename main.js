const { app, BrowserWindow, ipcMain, BrowserView, dialog, globalShortcut } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const preloadPath = path.join(__dirname, 'preload.js');
  console.log('Preload path:', preloadPath); // Add this line for debugging
  fs.access(preloadPath, fs.constants.R_OK, (err) => {
    if (err) {
        console.error('Preload script is not accessible:', err);
    } else {
        console.log('Preload script is accessible');
    }
});
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    //fullscreen: true,
    //frame: false,
    //kiosk: true,
    //alwaysOnTop: true,

    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: true,
      webgl: true
    },
  });
  /*
  let view = new BrowserView();
  view.setBounds({ x: 100, y: 0, width: 1920, height: 1080 });
  view.setAutoResize({ width: true, height: true });
  view.webContents.loadURL('https://www.google.com/maps');
  win.setBrowserView(view);

  win.webContents.on('did-navigate', (event, url) => {
    if (url.includes('navigation.html')) {
      if (!win.getBrowserView()) {
        win.setBrowserView(view);
      }
      view.webContents.loadURL(__dirname + '/web/navigation.html');
      view.webContents.on('did-finish-load', () => {
        view.setAutoResize({ width: true, height: true });
      });
    } else {
      win.removeBrowserView(view);
    }
  });
  */
  win.loadFile('./UI/html/7inch.html');
}

app.whenReady().then(() => {
  createWindow();
  console.log("window created")

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
  //win.webContents.send('toggle-cursor');
  //app.commandLine('touch-events', 'enabled');
});
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

