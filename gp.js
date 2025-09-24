const Gpio = require('onoff').Gpio;
const relIn1 = new Gpio(75, 'out'); //UP Front
const relIn2 = new Gpio(146, 'out'); //UP Rear
const relIn3 = new Gpio(150, 'out'); //Down Front
const relIn4 = new Gpio(149, 'out'); //Down Rear
// Toggle the LED on and off every second7, 11, 13, 15   75, 146, 150, 149

RunFunc = function(value) {
    try {
        //Lift
        if (value === 1) {
            relIn1.writeSync(1);
            relIn2.writeSync(1);
        } else if (value === 0) {
        //Lower
            relIn3.writeSync(1);
            relIn4.writeSync(1);
        }
    } catch(error) {
        relIn1.writeSync(0);
        relIn2.writeSync(0);
        relIn3.writeSync(0);
        relIn4.writeSync(0);
        console.log("RunFunc Error", error);
    }
}

StopFunc = function(value) {
    try {
        //Stop lift
        if (value === 1) {
            relIn1.writeSync(0);
            relIn2.writeSync(0);
        } else if (value === 0) {
            //Stop lower
            relIn3.writeSync(0);
            relIn4.writeSync(0);
        }
    } catch(error) {
        relIn1.writeSync(0);
        relIn2.writeSync(0);
        relIn3.writeSync(0);
        relIn4.writeSync(0);
        console.log("StopFunc Error: ", error)
    }
}