

function rockLight() {
    const light_json_path = json_path + 'lights.json';
    const light_json_data = fs.readFileSync(light_json_path);
    var lights_json = JSON.parse(light_json_data);
    let light_rock_mode = document.querySelector('#lights-rock-mode');
    let light_rock_btn = document.querySelector('#light-rock-btn');

    light_rock_mode.addEventListener('change', () => {
        lights_json['rock-light-mode'] = light_rock_mode.value;
        fs.writeFileSync(light_json_path, JSON.stringify(lights_json));
    });

    light_rock_btn.addEventListener('click', () => {

        let IsRockLightsOn = lights_json['rock-light'];
        let RockLightMode = lights_json['rock-light-mode'];
        let rock_btn_color = "";

        if (IsRockLightsOn) {
            IsRockLightsOn = false;
            rock_btn_color = "#b50505";
        } else if (!IsRockLightsOn) {
            IsRockLightsOn = true;
            rock_btn_color = "#23a312";
        }

        lights_json['rock-light'] = IsRockLightsOn;
        fs.writeFileSync(light_json_path, JSON.stringify(lights_json));
        light_rock_btn.style.backgroundColor = rock_btn_color;

        console.log("IsRockLightOn = " + IsRockLightsOn + " " + "Mode = " + RockLightMode);
    });
}

module.exports = {rockLight};