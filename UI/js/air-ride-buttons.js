let path, fs;

function initializeModules(api) {
    path = api.paths;
    fs = api.fs;
    readSensorData = api.readSensorData;
    readSensorsData = api.readSensorsData;
    runFunc = api.runFunc;
    stopFunc = api.stopFunc;

}

LoadJson = function(path1, libs) {
  let path = libs[0];
  let fs = libs[1];
  var airride_json_path = path.join(__dirname, '../', 'json', 'air-ride.json');
  var json_readfile = fs.readFileSync(path1);
  var json = JSON.parse(json_readfile);
  return [json, airride_json_path];
}
SetAirSuspensionStatus = function(bool, airride_json, libs) {
  let path = libs[0];
  let fs = libs[1];
  var airride_json_path = path.join(__dirname, '../', 'json', 'air-ride.json');
  var img_path = path.join(__dirname, '../', 'imgs')

  IsAirsuspensionBusy = bool;
  airride_json['IsAirsuspensionBusy'] = IsAirsuspensionBusy;
  fs.writeFileSync(airride_json_path, JSON.stringify(airride_json));
}
IsThisCheckBoxChecked = function(string, arr) {
  let arrlen = arr.length;
  for (let i=0;i<arrlen;i++) {
    if (arr[i] === string) {
      return true;
    }
  }
  return false;
}

CheckManualMode = function(libs) {
  let path = libs[0];
  let fs = libs[1];
  var airride_json_path = path.join(__dirname, '../', 'json', 'air-ride.json');
  var img_path = path.join(__dirname, '../', 'imgs')
  var json_data = LoadJson(airride_json_path, [path, fs]);
  var airride_json = json_data[0];
  var ManualMode = airride_json['ManualMode'];

  if (ManualMode === true) {
    return true;
  }
  return false;

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
  KeepBtnPressed: async function() {
    const buttons = document.querySelectorAll('.preset');
    var img = document.querySelector('#car-height-image');
    var airride_json_path = path.join(__dirname, '../', 'json', 'air-ride.json');
    var img_path = path.join(__dirname, '../', 'imgs');

    var json_data = LoadJson(airride_json_path, [path, fs]);
    console.log("MLEM1: " + path);
    console.log("MLEM2: " + fs);
    var airride_json = json_data[0];
    var IsAirsuspensionBusy = airride_json['IsAirsuspensionBusy'];
    var btn_color = airride_json['preset-btn-color'];
    var btn_active_color = airride_json['preset-btn-active-color'];

    buttons.forEach(button => {
      button.addEventListener('click', async () => {
        json_data = LoadJson(airride_json_path, [path, fs]);
        airride_json = json_data[0];
        if (CheckManualMode([path, fs]) === true) {
          alert("Disable Manual Mode");
          return;
        }

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
        let SensorValue1,SensorValue2,SensorValue3,SensorValue4,LowerOrLift,SvalList;

        if (button.id === "preset-lifted-Btn") {
            //LIFTED BTN START
            airride_json['LatestPresetButtonPressed'] = "lifted";
            const LiftedSensorValue = airride_json['LiftedSensorValue'];
            SvalList = await readSensorsData();
            SensorValue1 = await readSensorData(0);
            SensorValue4 = await readSensorData(3);
            if (SensorValue1 >= LiftedSensorValue - 3 && SensorValue1 <= LiftedSensorValue + 3) {
              console.log("Preset-Lifted: SensorValue Already at the desired Value", SensorValue1);
              IsAirsuspensionBusy = false;
              fs.writeFileSync(json_data[1], JSON.stringify(airride_json));
              img.src = img_path + "/LIFTED.png";
              return;
            }

            while (SensorValue1  !== LiftedSensorValue && SensorValue4 !== LiftedSensorValue) {
              SensorValue1 = await readSensorData(0);
              SensorValue4 = await readSensorData(3);
              console.log(SensorValue1, SensorValue4);
              runFunc(1);
              console.log("Preset-Lifted: raising...");
            }
            stopFunc(1);
            if (SensorValue1 !== LiftedSensorValue) {
              while (SensorValue1 !== LiftedSensorValue) {
                SensorValue1 = await readSensorData(0);
                runFunc(2);
                console.log("Raising front only");
              }
              stopFunc(1);
              console.log("Front raised done!", SensorValue1);
            } else if (SensorValue4 !== LiftedSensorValue) {
              while (SensorValue4 !== LiftedSensorValue) {
                SensorValue4 = await readSensorData(3);
                runFunc(3);
                console.log("Raising rear only");
              }
              stopFunc(1);
            }
            SvalList = await readSensorsData();
            console.log("Preset-Lifted: Done Raising", SvalList);
            img.src = img_path + "/LIFTED.png";
            //LIFTED BTN END
        } else if (button.id === "preset-normal-Btn") {
          //NORMAL BTN START
            airride_json['LatestPresetButtonPressed'] = "normal";
            const NormalSensorValue = airride_json['NormalSensorValue'];
            SvalList = await readSensorsData();
            SensorValue1 = await readSensorData(0);
            SensorValue4 = await readSensorData(3);

            if (SensorValue1 >= NormalSensorValue - 3 && SensorValue1 <= NormalSensorValue + 3) {
              console.log("Normal-Preset: SensorValue Already at the desired Value");
              IsAirsuspensionBusy = false;
              fs.writeFileSync(json_data[1], JSON.stringify(airride_json));
              img.src = img_path + "/NORMAL.png";
              return;
            }

            if (SensorValue1 > NormalSensorValue) {
              LowerOrLift = false;
              //Lower
            } else if (SensorValue1 < NormalSensorValue) {
              //Higher
              LowerOrLift = true;
            }
            
            while (SensorValue1 !== NormalSensorValue && SensorValue4 !== NormalSensorValue) {
              SensorValue1 = await readSensorData(0);
              SensorValue4 = await readSensorData(3);
              console.log(SensorValue1, SensorValue4);
              if (LowerOrLift) {
                console.log("Raising...");
                runFunc(1);
              } else if (!LowerOrLift) {
                console.log("Lowering...");
                runFunc(0);
              }
            }
            if (LowerOrLift) {
              stopFunc(1);
            } else {
              stopFunc(0);
            }
            if (SensorValue1 !== NormalSensorValue) {
              while (SensorValue1 !== NormalSensorValue) {
                SensorValue1 = await readSensorData(0);
                if (LowerOrLift) {
                  console.log("Raising only front...");
                  runFunc(2);
                } else if (!LowerOrLift) {
                  console.log("Lowering only front...");
                  runFunc(4);
                }
              }
              if (LowerOrLift) {
                stopFunc(1);
              } else {
                stopFunc(0);
              }
              console.log("Front raised/lowered done!", SensorValue1);
            } else if (SensorValue4 !== NormalSensorValue) {
              while (SensorValue4 !== NormalSensorValue) {
                SensorValue4 = await readSensorData(3);
                if (LowerOrLift) {
                  console.log("Raising only rear...");
                  runFunc(3);
                } else if (!LowerOrLift) {
                  console.log("Lowering only rear...");
                  runFunc(5);
                }
              }
              console.log("Rear raised/lowered done!", SensorValue4);
              if (LowerOrLift) {
                stopFunc(1);
              } else {
                stopFunc(0);
              }
            }
            SvalList = await readSensorsData();
            console.log("Preset-Normal: Done Raising/Lower", SvalList);
            
            img.src = img_path + "/NORMAL.png";
            //NORMAL BTN END
        } else if (button.id === "preset-lowered-Btn") {
            //LOWER BTN START
            airride_json['LatestPresetButtonPressed'] = "lowered";
            let LoweredSensorValue = airride_json['LoweredSensorValue'];
            SensorValue1 = await readSensorData(0);
            SensorValue4 = await readSensorData(3);
            
            if (SensorValue1 >= LoweredSensorValue - 3 && SensorValue1 <= LoweredSensorValue + 3) {
              console.log("Preset-Lowered: SensorValue Already at the desired Value");
              IsAirsuspensionBusy = false;
              fs.writeFileSync(json_data[1], JSON.stringify(airride_json));
              img.src = img_path + "/LOW.png";
              return;
            }

            if (SensorValue1 > LoweredSensorValue) {
              LowerOrLift = false;
              //Lower
            } else if (SensorValue1 < LoweredSensorValue) {
              //Higher
              LowerOrLift = true;            }
            
            while (SensorValue1 !== LoweredSensorValue && SensorValue4 !== LoweredSensorValue) {
              SensorValue1 = await readSensorData(0);
              SensorValue4 = await readSensorData(3);
              console.log(SensorValue1, SensorValue4);
              if (LowerOrLift) {
                console.log("Raising...");
                runFunc(1);
              } else if (!LowerOrLift) {
                console.log("Lowering...");
                runFunc(0);
              }
            }
            if (LowerOrLift) {
              stopFunc(1);
            } else {
              stopFunc(0);
            }
            if (SensorValue1 !== LoweredSensorValue) {
              while (SensorValue1 !== LoweredSensorValue) {
                SensorValue1 = await readSensorData(0);
                if (LowerOrLift) {
                  console.log("Raising only front...");
                  runFunc(2);
                } else if (!LowerOrLift) {
                  console.log("Lowering only front...");
                  runFunc(4);
                }
              }
              if (LowerOrLift) {
                stopFunc(1);
              } else {
                stopFunc(0);
              }
              console.log("Front raised/lowered done!", SensorValue1);
            } else if (SensorValue4 !== LoweredSensorValue) {
              while (SensorValue4 !== LoweredSensorValue) {
                SensorValue4 = await readSensorData(3);
                if (LowerOrLift) {
                  console.log("Raising only rear...");
                  runFunc(3)
                } else if (!LowerOrLift) {
                  console.log("Lowering only rear...");
                  runFunc(5);
                }
              }
              if (LowerOrLift) {
                stopFunc(1);
              } else {
                stopFunc(0);
              }
              console.log("Rear raised/lowered done!", SensorValue4);
            }
            
            SvalList = await readSensorsData();
            console.log("Done Raising/Lowering", SvalList);

            img.src = img_path + "/LOW.png";
        }
        IsAirsuspensionBusy = false;
        fs.writeFileSync(json_data[1], JSON.stringify(airride_json));
        //LOWER BTN END
      });
    });
  },
  manualEvent: function() {
    var airride_json_path = path.join(__dirname, '../', 'json', 'air-ride.json');
    var img_path = path.join(__dirname, '../', 'imgs');
      
    function stopping(IsAirsuspensionBusy) {
      IsAirsuspensionBusy = false;
      airride_json['IsAirsuspensionBusy'] = IsAirsuspensionBusy;
      fs.writeFileSync(airride_json_path, JSON.stringify(airride_json));
  }
  let lowerBtn = document.querySelector('#manual-btn-lower');
  let raiseBtn = document.querySelector('#manual-btn-raise');

  let checkboxes = document.querySelectorAll('.checkbox');
  var airride_json_readfile = fs.readFileSync(airride_json_path);
  var airride_json = JSON.parse(airride_json_readfile);
  let errormsg_sametime = "You can not choose front and FL & RL at the same time!";

  var IsAirSusBusyString = 'IsAirsuspensionBusy';

  lowerBtn.addEventListener('touchstart', function() {
      if (CheckManualMode([path, fs]) === false) {
        alert("Enable Manual Mode!");
        return;
      }
      
      console.log("This should not log");
      console.log('Lower event started');
      console.log('Checking if airsuspension is free...');
      let IsAirsuspensionBusy = airride_json[IsAirSusBusyString];

      if (IsAirsuspensionBusy) {
          alert('The airsuspension is busy ATM, wait!');
          console.log("Airsuspension is busy");
          return;
      }

      IsAirsuspensionBusy = true;
      airride_json[IsAirSusBusyString] = IsAirsuspensionBusy;

      let checkboxes_checked = [];

      checkboxes.forEach((checkbox) => {
        if(checkbox.checked) {
          checkboxes_checked.push(checkbox.value);
        }
      });

      if (checkboxes_checked.length === 0) {
        airride_json['IsAirsuspensionBusy'] = false;
        fs.writeFileSync(airride_json_path, JSON.stringify(airride_json));
        return;
      }
      fs.writeFileSync(airride_json_path, JSON.stringify(airride_json));
      console.log(checkboxes_checked);
      
      const intervalId = setInterval(function() {
        console.log('Started lowering the vehicle');
          if (checkboxes_checked.length === 1) {
            if (checkboxes_checked[0] === "front") {
              console.log("Lowering front");
              runFunc(4);
            } else if (checkboxes_checked[0] === "rear") {
              console.log("Lowering Rear");
              runFunc(5);
            }
          } else if (checkboxes_checked.length == 2) {
            let first = checkboxes_checked[0];
            let second = checkboxes_checked[1];
            if (first === "front" && second === "rear") {
              console.log("Lowering front and rear");
              runFunc(0);
            }
          }
      }, 1000);
      lowerBtn.addEventListener('touchend', function() {
        clearInterval(intervalId);
        stopping(IsAirsuspensionBusy);
        console.log('Stopped lowering the vehicle');
        stopFunc(0);
      });
      lowerBtn.addEventListener('touchmove', function() {
        clearInterval(intervalId);
        stopping(IsAirsuspensionBusy);
        console.log('Stopped lowering the vehicle');
        stopFunc(0);
      
      });
    });

    raiseBtn.addEventListener('touchstart', function() {
      if (CheckManualMode([path, fs]) === false) {
        alert("Enable Manual Mode");
        return;
      }
      console.log('Lower event started');
      console.log('Checking if airsuspension is free...')

      airride_json_readfile = fs.readFileSync(airride_json_path);
      airride_json = JSON.parse(airride_json_readfile);
      let IsAirsuspensionBusy = airride_json[IsAirSusBusyString];

      if (IsAirsuspensionBusy) {
          alert('The airsuspension is busy ATM, wait!');
          console.log("Airsuspension is busy");
          return;
      }
      IsAirsuspensionBusy = true;
      airride_json[IsAirSusBusyString] = IsAirsuspensionBusy;

      let checkboxes_checked = [];

      checkboxes.forEach((checkbox) => {
        if(checkbox.checked) {
          checkboxes_checked.push(checkbox.value);
        }
      });
      
      if (checkboxes_checked.length === 0) {
        airride_json['IsAirsuspensionBusy'] = false;
        fs.writeFileSync(airride_json_path, JSON.stringify(airride_json));
        return;
      }

      fs.writeFileSync(airride_json_path, JSON.stringify(airride_json));

      console.log(checkboxes_checked);
      const intervalId = setInterval(function() {
        console.log('Started raising the vehicle');
        if (checkboxes_checked.length === 1) {
          if (checkboxes_checked[0] === "front") {
            console.log("Raising front");
            runFunc(2);
          } else if (checkboxes_checked[0] === "rear") {
            console.log("Raising Rear");
            runFunc(3);
          }
        } else if (checkboxes_checked.length == 2) {
          let first = checkboxes_checked[0];
          let second = checkboxes_checked[1];
          if (first === "front" && second === "rear") {
            console.log("Raising front and rear");
            runFunc(1);
          }
        }
      }, 1000);
      raiseBtn.addEventListener('touchend', function() {
        clearInterval(intervalId);
        console.log('Stopped raising the vehicle');
        stopFunc(1);
        stopping(IsAirsuspensionBusy);
      });
      raiseBtn.addEventListener('touchmove', function() {
        clearInterval(intervalId);
        console.log('Stopped raising the vehicle');
        stopFunc(1);

        stopping(IsAirsuspensionBusy);

      });
    });
  },
  ManualModeSwitch: function() {
    var airride_json_path = path.join(__dirname, '../', 'json', 'air-ride.json');
    var img_path = path.join(__dirname, '../', 'imgs');
    var airrideConfig = LoadJson(airride_json_path, [path, fs]);
    var manualSwitch = document.querySelector("#toggle-manual-mode");
    manualSwitch.addEventListener("change", () => {
      var mode = airrideConfig[0]['ManualMode'];
  
      if (mode === true) {
        airrideConfig[0]['ManualMode'] = false;
      } else {
        airrideConfig[0]['ManualMode'] = true;
      }
  
      fs.writeFileSync(airrideConfig[1], JSON.stringify(airrideConfig[0]));
      console.log("Manual mode is now set to: " + airrideConfig[0]['ManualMode']);
  
    });
  },
  LoadAirsuspension: function() {
    var airride_json_path = path.join(__dirname, '../', 'json', 'air-ride.json');
    var img_path = path.join(__dirname, '../', 'imgs');
    console.log("Loading airsuspension...");
    var airride_json = LoadJson(airride_json_path, [path, fs]);
    console.log(airride_json);
    var LatestPresetButtonPressed = airride_json[0]['LatestPresetButtonPressed'];
    var carHeightImg = document.querySelector('#car-height-image');
    var LatestPresetButton = document.querySelector(`#preset-${LatestPresetButtonPressed}-Btn`);
    var IsManualModeActive = airride_json[0]['ManualMode'];
    const ManualModeSwitch = document.querySelector('#toggle-manual-mode');
  
    ManualModeSwitch.checked = IsManualModeActive;
  
    LatestPresetButton.classList.add('active');
  
    if (LatestPresetButtonPressed === "lifted") {
      carHeightImg.src = img_path + "/LIFTED.png";
    } else if (LatestPresetButtonPressed === "normal") {
      carHeightImg.src = img_path + "/NORMAL.png";
    } else if (LatestPresetButtonPressed === "lowered") {
      carHeightImg.src = img_path + "/LOW.png";
    }
  },
  CheckSensorInterval: async function() {
    //value-FL, value-FR, value-RR, value-RL

    async function CheckSensors() {
      //Get and Show Sensor Values
      let showVal_FR, showVal_FL, showVal_RR, showVal_RL;
      showVal_FR = await readSensorData(0);
      showVal_FL = await readSensorData(1);
      showVal_RR = await readSensorData(2);
      showVal_RL = await readSensorData(3);

      document.querySelector("#value-FL").innerHTML = showVal_FL;
      document.querySelector("#value-FR").innerHTML = showVal_FR;
      document.querySelector("#value-RR").innerHTML = showVal_RR;
      document.querySelector("#value-RL").innerHTML = showVal_RL;
    }
    //1.2 Second Interval
    setInterval(CheckSensors, 1200);
  },
  LoadJson, SetAirSuspensionStatus, IsThisCheckBoxChecked, CheckManualMode
  // other methods
};
