
function LoadJson(path) {
    var json_readfile = fs.readFileSync(path);
    var json = JSON.parse(json_readfile);
    return [json];
}
const json_path = path.join(__dirname, '../', 'json', '/only-airride-theme.json');

function setCustomText() {
    const apply_btn = document.querySelector('#only-airride-settings-txt-submit');
    const txt_select = document.querySelector('#only-airride-text-select');
    const txt_input = document.querySelector('#only-airride-settings-txt-value');
    const bg_toggle = document.querySelector('.only-airride-toggle-bg');

    const background_input = document.querySelector('#only-airride-settings-background-value');

    let themeJson = LoadJson(json_path)[0];

    bg_toggle.addEventListener('change', () => {
        let bg_toggleValue = bg_toggle.checked;

        if (bg_toggleValue) {
            themeJson['IsBgEnabled'] = true;
        } else {
            themeJson['IsBgEnabled'] = false;
        }
        fs.writeFileSync(json_path, JSON.stringify(themeJson));
        alert("Your settings have been saved!")
    });

    apply_btn.addEventListener('click', () => {
        var txt_select_value = txt_select.value;
        var customTextValue = txt_input.value;
        var backgroundValue = background_input.value;

        let allColorInputs = document.querySelectorAll('.input-color');

        allColorInputs.forEach((input) => {
            let input_id = input.id;
            let input_value = input.value;
            let Latest_preset_btn_color = themeJson['preset-btn-color'];
            let Latest_preset_btn_color_text = themeJson['preset-btn-text-color'];
            let Latest_other_text_color = themeJson['other-text-color'];
            let Latest_bg_color = themeJson['bg-color'];
            
            if (input_id === "preset-btn-color") {
                if (Latest_preset_btn_color != input_value) {
                    themeJson['preset-btn-color'] = input_value;
                }
            } else if (input_id === "preset-btn-text-color") {
                if (Latest_preset_btn_color_text != input_value) {
                    themeJson['preset-btn-text-color'] = input_value;
                }
            } else if (input_id === "other-text-color") {
                if (Latest_other_text_color != input_value) {
                    themeJson['other-text-color'] = input_value;
                }
            } else if (input_id === "bg-color") {
                if (Latest_bg_color != input_value) {
                    themeJson['bg-color'] = input_value;
                }
            }
        });

        if (customTextValue.trim() != '') {
            if (txt_select_value === "lifted") {
                themeJson['preset-lift-btn-text'] = customTextValue;
            } else if (txt_select_value === "normal") {
                themeJson['preset-normal-btn-text'] = customTextValue;
            } else if (txt_select_value === "lowered") {
                themeJson['preset-lowered-btn-text'] = customTextValue;
            }
        }
        if (backgroundValue.length != 0) {
            themeJson['bg-url'] = backgroundValue;
        }

        fs.writeFileSync(json_path, JSON.stringify(themeJson));
        alert("Your settings have been saved!")
    });
}

function LoadTheme() {
    let themeJson = LoadJson(json_path)[0];
    let mainContainer = document.querySelector('.main_container-only-airride');

    let allButtons = document.querySelectorAll('.main_btn');
    let getAlltxtElements = document.querySelectorAll('.txt');
    let bgUrl = themeJson['bg-url'];

    let activeClass = document.querySelector(".active");

    activeClass.style.backgroundColor = themeJson['preset-btn-active-color'];

    let IsBgEnabled = themeJson['IsBgEnabled'];
    if (IsBgEnabled) {
        mainContainer.style.backgroundImage = `url('${bgUrl}')`;
    } else {
        mainContainer.style.backgroundColor = themeJson['bg-color'];
    }

    getAlltxtElements.forEach((element) => {
        element.style.color = themeJson['other-text-color'];
    });

    allButtons.forEach((button) => {
        button.style.backgroundColor = themeJson['preset-btn-color'];
        button.style.color = themeJson['preset-btn-text-color'];

        if (button.id === "preset-lifted-Btn") {
            button.textContent = themeJson['preset-lift-btn-text'];
        } else if (button.id === "preset-normal-Btn") {
            button.textContent = themeJson['preset-normal-btn-text'];
        } else if (button.id === "preset-lowered-Btn") {
            button.textContent = themeJson['preset-lowered-btn-text'];
        }
    });
}

function LoadColorInputsSettings() {

    let themeJson = LoadJson(json_path)[0];
    let bg_toggle = document.querySelector(".only-airride-toggle-bg");
    let IsBgEnabled = themeJson['IsBgEnabled'];
    let getAllColorInputs = document.querySelectorAll('.input-color');

    if (IsBgEnabled) {
        bg_toggle.checked = true;
    } else {
        bg_toggle.checked = false;
    }

    getAllColorInputs.forEach((input) => {
        input.value = themeJson[input.id];
    });
}

module.exports = {setCustomText, LoadTheme, LoadColorInputsSettings};