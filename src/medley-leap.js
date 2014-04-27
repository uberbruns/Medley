var util = require('util');
var events = require('events');
var Leap = require('leapjs'); 

var PLUGIN_NAME = 'leap';


var LeapUnit = function() {
  this.pluginName = PLUGIN_NAME;
  this.name = undefined;
  this._ready = false;
  this.state = {};
};

util.inherits(LeapUnit, events.EventEmitter);


LeapUnit.prototype.start = function(config) {

  var thisUnit = this;
  var controller = new Leap.Controller({ enableGestures: true });


  controller.on('ready', function() {
    if (thisUnit._ready === false) {
      thisUnit._ready = true;
      thisUnit.emit('logInfo', 'Ready');
      thisUnit.emit('ready');
    };
  });

  controller.on('connect', function() {
      thisUnit.emit('logInfo', 'Connect');
  });

  controller.on('disconnect', function() {
      thisUnit.emit('logInfo', 'Disconnect');
  });

  controller.on('focus', function() {
      thisUnit.emit('logInfo', 'Focus');
  });

  controller.on('blur', function() {
      thisUnit.emit('logInfo', 'Blur');
  });

  controller.loop(function(frame) {
    thisUnit.state.frame = frame;
    thisUnit.emit('change', 'frame');
  });

};


module.exports = {

  pluginName: PLUGIN_NAME,
  classDef: LeapUnit,
  onLoad: function(medley) {}

};