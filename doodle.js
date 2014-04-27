var midi = require('midi');
var S = require('string');

var input = new midi.input();
var portNum, portName, portCount = input.getPortCount();


for (var i = 0; i < portCount; i++) {
	portName = input.getPortName(0);
	portNum = i;
	console.log(portName);
};


var bitString = function(num) {
	return S(num.toString(2)).padLeft(8,0).s;
}

input.on('message', function(deltaTime, message) {

	var statusByte = message[0];
	var midiEvent = statusByte & 0xf0;
	var midiChannel = statusByte & 0x0f;

	var msg = {
		on: (midiEvent === 144),
		off: (midiEvent === 128),
		polyphonicKeyPressure: (midiEvent === 160),
		controlChange: (midiEvent === 176),
		channelPressure: (midiEvent === 208),
		pitchBendChange: (midiEvent === 224),
		channel: midiChannel+1,
		note: message[1],
		verlocity: message[2],
	}

	console.log(statusByte, bitString(statusByte));
	console.log(midiEvent, bitString(midiEvent));
	console.log(midiChannel, bitString(midiChannel));
	console.log(msg);

});


input.openPort(portNum);
