var util = require('util');
var events = require('events');
var midi = require('midi');

var PLUGIN_NAME = 'midi';
var midiInputLib = new midi.input();

var MIDIUnit = function() {

  this.pluginName = PLUGIN_NAME;
  this.name = undefined;
  this.state = {};
  this.device = undefined;

};

util.inherits(MIDIUnit, events.EventEmitter);



MIDIUnit.prototype.start = function(config) {

  var portNum = -1,
  portName,
  portCount = midiInputLib.getPortCount(),
  thisUnit = this;

  for (var i = 0; i < portCount; i++) {
    portName = midiInputLib.getPortName(0);
    if (portName == config.name) {
      portNum = i;
      break;
    }
  }

  if (portNum < 0) return;

  midiInputLib.on('message', function(deltaTime, message) {

    var statusByte = message[0];
    var midiEvent = statusByte & 0xf0;
    var midiChannel = statusByte & 0x0f;

    var midiInput = {
      on: (midiEvent === 144),
      off: (midiEvent === 128),
      polyphonicKeyPressure: (midiEvent === 160),
      controlChange: (midiEvent === 176),
      channelPressure: (midiEvent === 208),
      pitchBendChange: (midiEvent === 224),
      channel: midiChannel+1,
      note: message[1],
      value: message[2],
    };

    thisUnit.state.input = midiInput;
    thisUnit.emit('change', 'input');

    // console.log(statusByte, bitString(statusByte));
    // console.log(midiEvent, bitString(midiEvent));
    // console.log(midiChannel, bitString(midiChannel));
    // console.log(midiInput);

  }); 


  midiInputLib.openPort(portNum);
  this.emit('ready');

};




module.exports = {

  pluginName: PLUGIN_NAME,
  classDef: MIDIUnit,

  onLoad: function(medley) {

    var portName, portCount = midiInputLib.getPortCount();

    for (var i = 0; i < portCount; i++) {
      portName = midiInputLib.getPortName(0);
      medley.logInfo(PLUGIN_NAME, 'Port: ' + i + '; Name: ' + portName);
    }

  }

};