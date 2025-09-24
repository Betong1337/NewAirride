const { contextBridge, ipcRenderer } = require('electron');
const path = require('path');
const fs = require('fs');

// Function to safely load modules
function safeRequire(modulePath) {
    try {
        return require(modulePath);
    } catch (error) {
        console.error(`Failed to load module ${modulePath}`, error);
        return null;
    }
}

const air_ride_buttons = safeRequire(path.join(__dirname, 'UI/js/air-ride-buttons.js'));
const only_airride_theme = safeRequire(path.join(__dirname, 'UI/js/only-airride-theme.js'));
const only_airride_AdSettings = safeRequire(path.join(__dirname, 'UI/js/air-ride-ad-settings.js'));

contextBridge.exposeInMainWorld('api', {
    airRideButtons: air_ride_buttons,
    onlyAirrideTheme: only_airride_theme,
    onlyAirrideAdSettings: only_airride_AdSettings,
    paths: {
        join: (...args) => path.join(...args),
        normalize: (p) => path.normalize(p),
        dirname: (p) => path.dirname(p),
        basename: (p, ext) => path.basename(p, ext),
        extname: (p) => path.extname(p),
        indexPath: path.normalize(path.join(__dirname, 'UI/html/index.html')),
        onlyAirridePathFull: path.normalize(path.join(__dirname, 'UI/html/index_full.html')),
        onlyAirridePath7inch: path.normalize(path.join(__dirname, 'UI/html/7inch.html')),
        onlyAirrideSettingsPath: path.normalize(path.join(__dirname, 'UI/html/only-airride-settings.html')),
        onlyAirridePath7inchSettings: path.normalize(path.join(__dirname, 'UI/html/on-airride-settings-7inch.html')),
        onlyAirrideAdSettingsPath: path.normalize(path.join(__dirname, "UI/html/on-airride-adsettings-7inch.html"))
    },
    fs: {
        readFileSync: (path, encoding) => fs.readFileSync(path, encoding),
        writeFileSync: (path, data, encoding) => fs.writeFileSync(path, data, encoding),
        // Add other fs functions as needed
    }
});

console.log('Preload script loaded');
