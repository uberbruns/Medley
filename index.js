var medley = require(__dirname +'/src/medley.js');
medley.loadPlugin(__dirname +'/src/medley-hid.js');
medley.loadPlugin(__dirname +'/src/medley-sensor-tag.js');


medley.config({

    hid: {
      gamepad: {
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


medley.createProgram('mix', ['hid:gamepad', 'sensorTag:one'], function(program, gamepad, sensorTag) {

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


medley.createProgram('controller', ['hid:gamepad'], function(program, gamepad) {

  gamepad.on('dataChange', function() {
    var data = gamepad.state.data;
    medley.logDebug('controller', data);
  });


});