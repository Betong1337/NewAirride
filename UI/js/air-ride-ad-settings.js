let path, fs;

function initializeModules(api) {
    path = api.paths;
    fs = api.fs;
}

LoadJson = function(path1, libs) {
  let path = libs[0];
  let fs = libs[1];
  var airride_json_path = path.join(__dirname, '../', 'json', 'air-ride.json');
  var json_readfile = fs.readFileSync(path1);
  var json = JSON.parse(json_readfile);
  return [json, airride_json_path];
}

module.exports = {
    init: function () {
        return new Promise((resolve, reject) => {
            const checkApi = setInterval(() => {
                if (typeof window.api !== 'undefined' && window.api.paths) {
                    clearInterval(checkApi);
                    console.log('window.api is available in air-ride-buttons.js');
                    resolve(window.api.paths);
                }
            }, 100);

            // Timeout after 5 seconds
            setTimeout(() => {
                clearInterval(checkApi);
                reject(new Error('window.api not available'));
            }, 5000);
        });
    },
    initializeModules,
    setAdvancedSettings: function() {
        //reset-airsuspension-busy
        //only-airride-text-select
        //only-airride-settings-txt-value
        const json_path = path.join(__dirname, '../', 'json', '/air-ride.json');
        let airridejson = LoadJson(json_path, [path, fs])[0];

        const apply_btn = document.querySelector('#only-airride-settings-txt-submit');
        const resetAirrideBtn = document.querySelector('#reset-airsuspension-busy');

        const txt_select = document.querySelector('#only-airride-text-select');
        const txt_input = document.querySelector('#only-airride-settings-txt-value');
        const ResetSettingsBtn = document.querySelector('#reset-default-btn');
    
        resetAirrideBtn.addEventListener('click', function() {
            airridejson['IsAirsuspensionBusy'] = false;
            fs.writeFileSync(json_path, JSON.stringify(airridejson));
            alert("AirSuspension is not busy anymore.")
        });

        apply_btn.addEventListener('click', function() {
            let WhichPreset = txt_select.value;
                let ValueToChange = `${WhichPreset}SensorValue`
                airridejson[ValueToChange] = parseInt(txt_input.value);

                fs.writeFileSync(json_path, JSON.stringify(airridejson));
                alert("New sensor values changed!")
        });
        
    },
    LoadJson
    // other methods
};