async function main() {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM fully loaded and parsed');

        // Check if window.api and required properties are available
        if (!window.api) {
            console.error('window.api is not defined');
            return;
        }

        const { airRideButtons, onlyAirrideTheme, onlyAirrideAdSettings, paths } = window.api;
        if (!airRideButtons || !onlyAirrideTheme || !paths) {
            console.error('Required properties (airRideButtons, onlyAirrideTheme, paths) are not defined on window.api');
            return;
        }

        // Debugging statement to check window location
        airRideButtons.initializeModules(window.api);
        onlyAirrideTheme.initializeModules(window.api);
        onlyAirrideAdSettings.initializeModules(window.api);
        var window_location = paths.normalize(window.location.pathname);
        console.log('Window location:', window_location);

        try {
            if (window_location === paths.indexPath || window_location === paths.onlyAirridePathFull || window_location === paths.onlyAirridePath7inch) {
                airRideButtons.KeepBtnPressed();
                airRideButtons.manualEvent();
                airRideButtons.ManualModeSwitch();
                airRideButtons.LoadAirsuspension();
                airRideButtons.CheckSensorInterval();
                onlyAirrideTheme.LoadTheme();
            } else if (window_location === paths.onlyAirrideSettingsPath || window_location === paths.onlyAirridePath7inchSettings) {
                onlyAirrideTheme.setCustomText();
                onlyAirrideTheme.LoadColorInputsSettings();
            } else if (window_location === paths.onlyAirrideAdSettingsPath) {
                console.log("Path: " + "Adsettings");
                onlyAirrideAdSettings.setAdvancedSettings();
            }
        } catch (error) {
            console.error('Failed to execute airRideButtons functions:', error);
        }
    });
}

main();
