var util = require('util');
var events = require('events');
var HID = require('node-hid');
var async = require('async');
var SensorTag = require('sensorTag');


var PLUGIN_NAME = 'sensorTag';


var SensorTagUnit = function() {

  this.pluginName = PLUGIN_NAME;
  this.name = undefined;
  this.state = {
  };

};

util.inherits(SensorTagUnit, events.EventEmitter);


SensorTagUnit.prototype.start = function(config) {

  var that = this;

  SensorTag.discover(function(sensorTag) {

    async.series([

      function(callback) {
        that.emit('logInfo', PLUGIN_NAME, 'Connected');
        sensorTag.connect(callback);
      },

      function(callback) {
        that.emit('logInfo', PLUGIN_NAME, 'Discovering Services And Characteristics');
        sensorTag.discoverServicesAndCharacteristics(function() {
          that.emit('ready');
          callback();
        });
      },

      function(callback) {

        if (config.readKeys === true) {
          sensorTag.notifySimpleKey(function() {});
          sensorTag.on('simpleKeyChange', function(left, right) {
            var keys = { left: left, right: right };
            that.state.keys = keys;
            that.emit('change', 'keys', keys);
          });
        }

        callback();

      },

      function(callback) {
        if (config.irTemperatureReadInterval !== undefined) {
          sensorTag.enableIrTemperature(callback);
        }
      },

      function(callback) {
        if (config.irTemperatureReadInterval !== undefined) {
          setInterval(function() {
            sensorTag.readIrTemperature(function(objectTemperature, ambientTemperature) {
              var temp = {
                object: objectTemperature.toFixed(1),
                ambient: ambientTemperature.toFixed(1)
              };
              that.state.temperature = temp;
              that.emit('change', 'temperature', temp);
            });
          }, config.irTemperatureReadInterval);
        }
      },


    ]);

    that.emit('logInfo' ,PLUGIN_NAME, 'SensorTag Found');

  }, config.uuid);

};


module.exports = {

  pluginName: PLUGIN_NAME,
  classDef: SensorTagUnit,

  onLoad: function(units) {

    units.logInfo(PLUGIN_NAME, 'Discover…');

    SensorTag.discover(function(sensorTag) {

      units.logInfo(PLUGIN_NAME, 'UUID: ' + sensorTag.uuid);

    });

  }

};