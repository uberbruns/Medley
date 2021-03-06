var util = require('util');
var events = require('events');
var HID = require('node-hid');
var _ = require('underscore');

var PLUGIN_NAME = 'hid';


var HIDUnit = function() {

  this.pluginName = PLUGIN_NAME;
  this.name = undefined;
  this.state = {
    data: [0, 0, 0, 0, 0, 0]
  };
  this.device = undefined;

};

util.inherits(HIDUnit, events.EventEmitter);



HIDUnit.prototype.start = function(config) {

  var i, device, devices = HID.devices();
  var thisUnit = this;

  var dataFnc = function(data) {
        
    var n = data.toJSON();
    var o = thisUnit.state.data;

    if (_.isEqual(n, o) === false) {
      thisUnit.state.data = n;
      thisUnit.emit('change', 'data');
    }
    
  };


  for (i = 0; i < devices.length; i++) {

    device = devices[i];

    if (device.path == config.path) {
      this.device = new HID.HID(device.path);
      this.device.on('data', dataFnc);
      this.emit('ready');
      return;
    }

  }

};



module.exports = {

  pluginName: PLUGIN_NAME,
  classDef: HIDUnit,

  onLoad: function(medley) {

    var device, devices = HID.devices();
    
    for (var i = 0; i < devices.length; i++) {
       device = devices[i];
       medley.log(0, 'hid', device.product + ': ' + device.path);
     }

  }

};