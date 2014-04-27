var spotify = require('spotify-node-applescript');

module.exports = function(medley) {

  medley.createProgram('spotify', ['midi:mpk', 'sensorTag:one'], function(program, mpk, sensorTag) {

    sensorTag.on('keysChange', function(keys) {

      if (keys.right || keys.left) {
        spotify.playPause(function() {})
      }

    });

    sensorTag.on('temperatureChange', function(temperature) {

      var volume = (temperature.object - 12) * 10;
      if (volume > 100) volume = 100;
      if (volume < 0) volume = 0;

      spotify.setVolume(volume, function() {
        spotify.getState(function(err, state) {
            // console.log(state.volume);
        });
      });

      // medley.logDebug('mix', temperature);
    });


  });

};