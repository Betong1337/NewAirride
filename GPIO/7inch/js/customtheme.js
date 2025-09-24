//bg color = background
    //cl = color

var themePath = path.join(__dirname, '../', 'json', 'Theme.json');

function setColorOfElement(element, option, color) {
    element = element.style;
    if (option === "bg") {
        element.backgroundColor = color;
    } else if (option === "cl") {
        element.color = color;
    } else {
        return;
    }
}

function ChangeColorTheme() {
    var fs = require('fs');
    const path = require('path');

    const data = fs.readFileSync(themePath);
    var theme = JSON.parse(data);

    var applybtn = document.querySelector('#settings-apply-btn');
    console.log(applybtn);

    applybtn.addEventListener('click', () => {
        var ColorInputs = document.querySelectorAll('.theme-color-input');
        ColorInputs.forEach((input) => {
            var id = input.id;
            var value = input.value;

            if (id === "theme-bg-color") {
                console.log(1);
                theme['background-color'] = value;
                console.log(2);
            } else if (id === "theme-sidebar-bg-color") {
                console.log(3);
                theme['sidebar-background-color'] = value;
                console.log(4);
            } else if (id === "theme-sidebar-btn-color") {
                console.log(5);
                theme['sidebar-btn-color'] = value;
                console.log(6);
            } else if (id === "theme-sidebar-btn-text-color") {
                console.log(7);
                theme['sidebar-btn-text-color'] = value;
                console.log(8);
            } else if (id === "theme-preset-btn-color") {
                console.log(9);
                theme['preset-btn-color'] = value;
                console.log(10);
            } else if (id === "theme-preset-btn-text-color") {
                console.log(11);
                theme['preset-btn-text-color'] = value;
                console.log(12);
            }
        });
        fs.writeFileSync(jsonpath, JSON.stringify(theme));
    });
}

function setColorInputValue() {
    var theme = require(themePath);

    document.querySelector('#theme-bg-color').value = theme['background-color'];
    document.querySelector('#theme-sidebar-bg-color').value = theme['sidebar-background-color'];
    document.querySelector('#theme-sidebar-btn-color').value = theme['sidebar-btn-color'];
    document.querySelector('#theme-sidebar-btn-text-color').value = theme['sidebar-text-color'];
    document.querySelector('#theme-preset-btn-color').value = theme['preset-btn-color'];
    document.querySelector('#theme-preset-btn-text-color').value = theme['preset-btn-text-color'];


}


function setCustomTheme() {
    var theme = require(themePath);

    //Get all elements
    const presetButtons = document.querySelectorAll(".main_btn");
    const sidebarButtons = document.querySelectorAll(".sidebar_btn");
    const sidebar_background = document.querySelector(".sidebar");
    const Background = document.querySelector(".main_container");

    //Get themes from json file
    var sidebarBackgroundColor = theme['sidebar-background-color'];
    var sidebarBtnColor = theme['sidebar-btn-color'];
    var sidebarTextColor = theme['sidebar-text-color'];

    var presetBtnColor = theme['preset-btn-color'];
    var presetBtnTextColor = theme['preset-btn-text-color'];

    var BackgroundColor = theme['background-color'];


    //Background
    setColorOfElement(Background, "bg", BackgroundColor)


    //SIDEBAR
    setColorOfElement(sidebar_background, "bg", sidebarBackgroundColor);

    sidebarButtons.forEach((button) => {
    
        setColorOfElement(button, "bg", sidebarBtnColor);
        setColorOfElement(button, "cl", sidebarTextColor);
    });

    //PRESET
    presetButtons.forEach((button) => {
        setColorOfElement(button, "bg", presetBtnColor);
        setColorOfElement(button, "cl", presetBtnTextColor);
    });
}
module.exports = {setCustomTheme, ChangeColorTheme, setColorInputValue};