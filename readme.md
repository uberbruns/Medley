# Medley 0.0.1

## Description

Medley is a node library to easily interweave different type of hardware. New Hardware is integrated via plugins.

User-defined programs run as soon as their required hardware is ready.

## Usage

### Import \*

```javascript
var medley = require(__dirname +'/src/medley.js');
medley.loadPlugin(__dirname +'/src/medley-hid.js');
medley.loadPlugin(__dirname +'/src/medley-sensor-tag.js');
```

\* node modules planned

### Config Hardware

```javascript
medley.config({

    hid: {                                           // Plugin
      gamepad: {                                     // Configuration
        path: 'USB_07b5_0312_fd120000' 
      }
    },

    sensorTag: {
      one: {
        uuid: 'c8a5e9303665488f800d9c944520ff57',
        readKeys: true,
        irTemperatureReadInterval: 2000
      }
    }

});
```


### Create Program

```javascript
medley.createProgram('mix',                       // Program name
    ['hid:gamepad', 'sensorTag:one'],             // Dependencies
    function(program, gamepad, sensorTag) {       // Program

  gamepad.on('dataChange', function() {
    var data = gamepad.state.data;
    medley.logDebug('mix', data);
  });

  sensorTag.on('keysChange', function() {
    var keys = sensorTag.state.keys;
    medley.logDebug('mix', keys);
  });

  sensorTag.on('temperatureChange', function() {
    var temperature = sensorTag.state.temperature;
    medley.logDebug('mix', temperature);
  });

});
```
