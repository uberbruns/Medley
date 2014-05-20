var util = require('util');
var events = require('events');
var midiLib = require('./midi-js.js');

var PLUGIN_NAME = 'midiDev';


var MIDIUnit = function() {

  this.pluginName = PLUGIN_NAME;
  this.name = undefined;
  this.state = {};

};

util.inherits(MIDIUnit, events.EventEmitter);



MIDIUnit.prototype.start = function(config) {

  var thisUnit = this;
  var midiIn;

  midiIn = new midiLib.input(config.device, function(err, message) {

    if (err) {
      thisUnit.emit('logError', message);
      return;
    }

    var statusByte, midiEvent, midiChannel, midiInput, i;

    for (i = 0; i < message.length; i = i + 3) {

      statusByte = message[i];
      midiEvent = statusByte & 0xf0;
      midiChannel = statusByte & 0x0f;

      midiInput = {
        on: (midiEvent === 144),
        off: (midiEvent === 128),
        polyphonicKeyPressure: (midiEvent === 160),
        controlChange: (midiEvent === 176),
        channelPressure: (midiEvent === 208),
        pitchBendChange: (midiEvent === 224),
        channel: midiChannel+1,
        note: message[i+1],
        value: message[i+2]
      };

      thisUnit.state.input = midiInput;
      thisUnit.emit('change', 'input');

    }

  });

  this.emit('ready');

};




module.exports = {

  pluginName: PLUGIN_NAME,
  classDef: MIDIUnit,
  onLoad: function(medley) { }

};