
var airride_json_path = path.join(__dirname, '../', 'json', 'air-ride.json');
var img_path = path.join(__dirname, '../', 'imgs')
console.log(img_path);

function LoadJson(path) {
    var json_readfile = fs.readFileSync(path);
    var json = JSON.parse(json_readfile);
    return [json, airride_json_path];
}

function LoadAirsuspension() {
  console.log("Loading airsuspension...");
  var airride_json = LoadJson(airride_json_path);
  console.log(airride_json);
  var LatestPresetButtonPressed = airride_json[0]['LatestPresetButtonPressed'];
  var carHeightImg = document.querySelector('#car-height-image');
  var LatestPresetButton = document.querySelector(`#preset-${LatestPresetButtonPressed}-Btn`);

  LatestPresetButton.classList.add('active');

  if (LatestPresetButtonPressed === "lifted") {
    carHeightImg.src = img_path + "/LIFTED.png";
  } else if (LatestPresetButtonPressed === "normal") {
    carHeightImg.src = img_path + "/NORMAL.png";
  } else if (LatestPresetButtonPressed === "lowered") {
    carHeightImg.src = img_path + "/LOW.png";
  }
}

function KeepBtnPressed() {
    const buttons = document.querySelectorAll('.preset');
    var img = document.querySelector('#car-height-image');

    var json_data = LoadJson(airride_json_path);
    var airride_json = json_data[0];
    var IsAirsuspensionBusy = airride_json['IsAirsuspensionBusy'];
    var btn_color = airride_json['preset-btn-color'];
    var btn_active_color = airride_json['preset-btn-active-color'];

    buttons.forEach(button => {
      button.addEventListener('click', () => {
        buttons.forEach(btn => {
          btn.classList.remove('active');
        });

        console.log("Checking if airsuspension is free...");

        if (IsAirsuspensionBusy) {
          alert('The airsuspension is busy ATM, wait!');
          console.log("AirSuspension is busy...");
          return;
        }

        IsAirsuspensionBusy = true;

        if (button.id === "preset-lifted-Btn") {
            airride_json['LatestPresetButtonPressed'] = "lifted";
            img.src = img_path + "/LIFTED.png";

            console.log("raising...")

        } else if (button.id === "preset-normal-Btn") {
            airride_json['LatestPresetButtonPressed'] = "normal";
            img.src = img_path + "/NORMAL.png";

        } else if (button.id === "preset-lowered-Btn") {
            airride_json['LatestPresetButtonPressed'] = "lowered";
            img.src = img_path + "/LOW.png";
        }
        IsAirsuspensionBusy = false;
        fs.writeFileSync(json_data[1], JSON.stringify(airride_json));
      });
    });
}

function manualEvent() {

    function stopping(IsAirsuspensionBusy) {
        IsAirsuspensionBusy = false;
        airride_json['IsAirsuspensionBusy'] = IsAirsuspensionBusy;
        fs.writeFileSync(airride_json_path, JSON.stringify(airride_json));
    }
    let lowerBtn = document.querySelector('#manual-btn-lower');
    let raiseBtn = document.querySelector('#manual-btn-raise');

    let checkboxes = document.querySelectorAll('.airride_checkbox-only-airride');

    const airride_json_path = path.join(__dirname,'../', 'json', 'air-ride.json');
    var airride_json_readfile = "";
    var airride_json = "";

    lowerBtn.addEventListener('mousedown', function() {
        console.log('Lower event started');
        console.log('Checking if airsuspension is free...')

        airride_json_readfile = fs.readFileSync(airride_json_path);
        airride_json = JSON.parse(airride_json_readfile);
        let IsAirsuspensionBusy = airride_json['IsAirsuspensionBusy'];

        if (IsAirsuspensionBusy) {
            alert('The airsuspension is busy ATM, wait!');
            console.log("Airsuspension is busy");
            return;
        }

        IsAirsuspensionBusy = true;
        airride_json['IsAirsuspensionBusy'] = IsAirsuspensionBusy;

        fs.writeFileSync(airride_json_path, JSON.stringify(airride_json));

        let errormsg_sametime = "You can not choose front and FL & RL at the same time!";

        let checkboxes_checked = [];

        checkboxes.forEach((checkbox) => {
          if(checkbox.checked) {
            if (checkbox.value === "front" && checkbox.value === "flrl") {
              alert(errormsg_sametime);
              return;
            } else if (checkbox.value === "front" && checkbox.value === "frrr") {
              alert(errormsg_sametime);
              return;
            } else if (checkbox.value === "rear" && checkbox.value === "flrl") {
              alert(errormsg_sametime);
              return;
            } else if (checkbox.value === "rear" && checkbox.value === "frrr") {
              alert(errormsg_sametime);
              return;
            }
            checkboxes_checked.push(checkbox.value);
          }
        });
        const intervalId = setInterval(function() {
          console.log('Started lowering the vehicle');
        }, 1000);
        lowerBtn.addEventListener('mouseup', function() {
          clearInterval(intervalId);
          stopping(IsAirsuspensionBusy);
          console.log('Stopped lowering the vehicle');
        });
        lowerBtn.addEventListener('mouseleave', function() {
          clearInterval(intervalId);
          stopping(IsAirsuspensionBusy);
          console.log('Stopped lowering the vehicle');
        
        });
      });

      raiseBtn.addEventListener('mousedown', function() {
        console.log('Lower event started');
        console.log('Checking if airsuspension is free...')

        airride_json_readfile = fs.readFileSync(airride_json_path);
        airride_json = JSON.parse(airride_json_readfile);
        let IsAirsuspensionBusy = airride_json['IsAirsuspensionBusy'];

        if (IsAirsuspensionBusy) {
            alert('The airsuspension is busy ATM, wait!');
            console.log("Airsuspension is busy");
            return;
        }
        IsAirsuspensionBusy = true;
        airride_json['IsAirsuspensionBusy'] = IsAirsuspensionBusy;

        fs.writeFileSync(airride_json_path, JSON.stringify(airride_json));

        const intervalId = setInterval(function() {
          console.log('Started lowering the vehicle');
        }, 1000);
        raiseBtn.addEventListener('mouseup', function() {
          clearInterval(intervalId);
          console.log('Stopped lowering the vehicle');

          stopping(IsAirsuspensionBusy);
        });
        raiseBtn.addEventListener('mouseleave', function() {
          clearInterval(intervalId);
          console.log('Stopped lowering the vehicle');

          stopping(IsAirsuspensionBusy);

        });
      });
}

module.exports = {KeepBtnPressed, manualEvent, LoadAirsuspension};