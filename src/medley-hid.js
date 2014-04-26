var util = require('util');
var events = require('events');
var HID = require('node-hid');

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
  var that = this;

  var dataFnc = function(data) {
        
    var n = data.toJSON();
    var o = that.state.data;

    if (n[0] !== o[0] ||
      n[1] !== o[1] ||
      n[2] !== o[2] ||
      n[3] !== o[3] ||
      n[4] !== o[4] ||
      n[5] !== o[5]) {
      that.state.data = n;
      that.emit('change', 'data');
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

  onLoad: function(units) {

    var device, devices = HID.devices();
    
    for (var i = 0; i < devices.length; i++) {
       device = devices[i];
       units.log(0, 'hid', device.product + ': ' + device.path);
     }

  }

};