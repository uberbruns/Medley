var medley = require(__dirname +'/src/medley.js');

medley.loadPlugin(__dirname +'/src/medley-hid.js');
medley.loadPlugin(__dirname +'/src/medley-sensor-tag.js');
medley.loadPlugin(__dirname +'/src/medley-leap.js');
medley.loadPlugin(__dirname +'/src/medley-midi.js');




medley.config({

    hid: {
      gamepad: {
        path: 'USB_07b5_0312_fd120000'
      },
      makeymakey: {
        path: 'USB_1b4f_2b75_fa130000'
      }
    },

    sensorTag: {
      one: {
        uuid: 'c8a5e9303665488f800d9c944520ff57',
        readKeys: true,
        irTemperatureReadInterval: 2000
      }
    },

    leap: {
      one: {}
    },

    midi: {
      mpk: {
        name: 'MPK mini'
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



medley.createProgram('gamepad', ['hid:gamepad'], function(program, gamepad) {

  gamepad.on('dataChange', function(data) {
    medley.logDebug('gamepad', data);
  });

});


medley.createProgram('makeymakey', ['hid:makeymakey'], function(program, makeymakey) {

  makeymakey.on('dataChange', function(data) {
    medley.logDebug('makeymakey', data);
  });

});


medley.createProgram('leap', ['leap:one'], function(program, leap) {

  leap.on('frameChange', function(frame) {

    for (var key in frame.handsMap) {
      var hand = frame.handsMap[key];
    }

  });

});


medley.createProgram('midi', ['midi:mpk'], function(program, mpk) {

  mpk.on('inputChange', function(input) {


  });

});