const path = require('path');
var fs = require('fs');

const UI_path = path.join(__dirname, "../");
const html_path = UI_path + "html/";

const js_path = UI_path + '/js/';
const json_path = UI_path + "/json/";

const customtheme = require(js_path + 'customtheme.js');
const lights_js = require(js_path + 'lights.js');
const air_ride_buttons = require(js_path + 'air-ride-buttons.js');
const only_airride_theme = require(js_path + 'only-airride-theme.js');

const ThemeSettingsPath = html_path + "themesettings.html";
const LightsPath = html_path + "lights.html";
const indexPath = html_path + "index.html";

const onlyAirridePath = html_path + "only-airride.html";
const onlyAirrideSettingsPath = html_path + "only-airride-settings.html";

var window_location = window.location.pathname;


if (window_location === ThemeSettingsPath) {
    customtheme.ChangeColorTheme();
    customtheme.setColorInputValue();
} else if (window_location === LightsPath) {
    lights_js.rockLight();
} else if (window_location === indexPath || window_location === onlyAirridePath) {
    air_ride_buttons.KeepBtnPressed();
    air_ride_buttons.manualEvent();
    air_ride_buttons.LoadAirsuspension();
    only_airride_theme.LoadTheme();
} else if (window_location === onlyAirrideSettingsPath) {
    console.log(1);
    only_airride_theme.setCustomText();
    console.log(2);
    only_airride_theme.LoadColorInputsSettings();
    console.log(3);
}

if (!window_location === onlyAirridePath) {
    customtheme.setCustomTheme();
}






