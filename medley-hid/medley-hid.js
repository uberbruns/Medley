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

  var thisUnit = this;

  var dataFnc = function(data) {
        
    var n = data.toJSON();
    var o = thisUnit.state.data;

    if (_.isEqual(n, o) === false) {
      thisUnit.state.data = n;
      thisUnit.emit('change', 'data');
    }
    
  };

  var eventBindingFnc = function(config) {

    var i, device, devices = HID.devices();

    // thisUnit.emit('logInfo', devices);

    for (i = 0; i < devices.length; i++) {

      device = devices[i];

      var pathTest = (config.path === undefined) || (config.path === device.path);
      var productTest = (config.product === undefined) || (config.product === device.product);

      if (pathTest && productTest) {

        thisUnit.device = new HID.HID(device.path);
        
        thisUnit.device.on('data', dataFnc);

        thisUnit.device.on('error', function(err) {

          thisUnit.emit('logError', err);

          // Retry
          setTimeout(function() {
            eventBindingFnc(config);
          }, 1000);

        });      

        thisUnit.emit('ready');
        
        return;

      }

    }

  }

  eventBindingFnc(config);

};



module.exports = {

  pluginName: PLUGIN_NAME,
  classDef: HIDUnit,

  onLoad: function(medley) {

    var device, devices = HID.devices();
    
    for (var i = 0; i < devices.length; i++) {
       device = devices[i];
       medley.logInfo(PLUGIN_NAME, device.product + ': ' + device.path);
     }

  }

};