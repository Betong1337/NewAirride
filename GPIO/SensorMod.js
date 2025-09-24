 
const ADS1115 = require('ads1115')
const connection = [7, 0x48, 'i2c-bus']

    GetAllSensorValues = async function() {
        return new Promise(resolve => {
            ADS1115.open(...connection).then(async (ads1115) => {
                ads1115.gain = 1;
                let ValueList = [];
            
                for (let i=0;i<4;i++) {
                    let Analog = await ads1115.measure(`${i}+GND`);
                    ValueList.push(Analog);
                }
              resolve(ValueList);  
            })
        });
    }

    GetOneSensorValue = async function(Sensor) {
        return new Promise(resolve => {
            ADS1115.open(...connection).then(async (ads1115) => {
                ads1115.gain = 2/3;
                let SensorValue = await ads1115.measure(`${Sensor}+GND`)
    
                if (SensorValue < 5) SensorValue = 5;
                if (SensorValue > 20000) SensorValue = 20000;
                const percentage = ((SensorValue - 1) / (20000 - 1)) * (100 - 1) + 1;
                
                resolve(parseInt(percentage));
            }).catch(error => {
                console.log("GetOneSensor: " + error);
            });
        });
            
    }



module.exports = {GetOneSensorValue,GetAllSensorValues}
