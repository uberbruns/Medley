var sfx = require('sfx');

var SoundBoard = function() {


}



SoundBoard.prototype.init = function(program, mpk, sensorTag) {

  mpk.on('inputChange', function(input) {

    // console.log(input);

    if (input.on ) {

      if (input.channel == 1) {
        sfx.random();
      }

      if (input.channel == 2) {
        sfx.say('The human torch was denied a bank loan.');
      }

    }

  });

  sensorTag.on('keysChange', function(keys) {

    if (keys.right) {
        sfx.random();
    }


  });


};

var soundBoard = new SoundBoard();



module.exports = function(medley) {

  medley.createProgram('soundboard', ['midi:mpk', 'sensorTag:one'], function(program, mpk, sensorTag) {
    soundBoard.init(program, mpk, sensorTag);
  });

};