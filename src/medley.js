var events = require('events'),
util = require('util'),
async = require('async'),
colors = require('colors'),
S = require('string');

var INFO = 0,
DEBUG = 1,
INPUT = 2,
OKAY = 3;


var Program = function() {

  this.name = undefined;
  this.dependencies = [];
  this.isLaunched = false;
  this.code = function() {};

};



var Medley = function() {

  this.plugins = {};
  this.programs = [];
  this.conf = {};
  this.units = [];

};
util.inherits(Medley, events.EventEmitter);



Medley.prototype.config = function(config) {

  this.conf = config;
  this.start();

};



Medley.prototype.loadPlugin = function(unitPath) {

  var plugin = require(unitPath);
  this.plugins[plugin.pluginName] = plugin;

  if (plugin.onLoad !== undefined) {
    plugin.onLoad(this);
  }

};



Medley.prototype.start = function() {

  var UnitClass;
  var aPluginName, aPluginConf, aPluginConfName, allPluginConfs;
  var success;
  var that = this;

  var setupUnitFnc = function(UnitClass, aPluginConf, aPluginConfName) {

    var anUnit = new UnitClass();
    anUnit.name = aPluginConfName;

    that.logOkay(anUnit.pluginName + ':' + aPluginConfName, 'Unit Setup');

    anUnit.on('ready', function() {
      that.unitReady(anUnit);
    });

    anUnit.on('log', function(level, section, msg) {
      that.log(level, section, msg);
    });

    anUnit.on('logInfo', function(msg) {
      that.logInfo(anUnit.pluginName, msg);
    });

    anUnit.on('change', function(key) {
      that.unitStateChanged(anUnit, key);
    });

    anUnit.start(aPluginConf);

  };

  for(aPluginName in this.plugins) {

    allPluginConfs = this.conf[aPluginName];

    if (allPluginConfs !== undefined) {

      for(aPluginConfName in allPluginConfs) {
        setupUnitFnc(this.plugins[aPluginName].classDef, allPluginConfs[aPluginConfName], aPluginConfName);
      }

    }

  }

};



Medley.prototype.createProgram = function(programName, dependencies, code) {

  var newProgram = new Program();
  newProgram.name = programName;
  newProgram.dependencies = dependencies;
  newProgram.code = code;

  this.programs.push(newProgram);
  this.launchPrograms();

};



Medley.prototype.launchPrograms = function() {

  var that = this;

  if (this.units.length < 1) {
    return; 
  }

  this.programs.forEach(function(aProgram) {

    if (aProgram.isLaunched === false) {

      var unitCollection = [];
      var args = [aProgram];

      aProgram.dependencies.forEach(function(dependency) {

        var comp = dependency.split(':');
        var pluginName = comp[0];
        var confName = comp[1];

        that.units.forEach(function(anUnit) {
          var rightPluginName = (pluginName !== undefined && pluginName == anUnit.pluginName);
          var rightConfName = (confName !== undefined && confName === anUnit.name);
          if (rightPluginName && rightConfName) {
            unitCollection.push(anUnit);
          }
        });

      });

      if (aProgram.dependencies.length == unitCollection.length) {
        that.log(OKAY, aProgram.name, 'Launching Program');
        aProgram.code.apply(aProgram.code, args.concat(unitCollection));
        aProgram.isLaunched = true;
      }

    }

  });

};



Medley.prototype.unitStateChanged = function(unit, key) {

  // this.log(INPUT, unit.pluginName + ':' + unit.name , unit.state[key]);
  unit.emit(key + 'Change');

};



Medley.prototype.unitReady = function(unit) {

  this.log(OKAY, unit.pluginName, 'Unit Ready');
  this.units.push(unit);
  this.launchPrograms();

};



Medley.prototype.unitLost = function(unit) {

  var index = this.units.indexOf(unit);
  this.units.splice(index, 1);

};



Medley.prototype.log = function(level, section, msg) {

  var levelStr = 'INFO'.cyan;

  if (level == DEBUG) {
    levelStr = 'DEBUG'.yellow;
  } else if (level == OKAY) {
    levelStr = 'OKAY'.green;
  } else if (level == INPUT) {
    levelStr = 'INPUT'.blue;
  }

  levelStr = S(levelStr).padRight(17).s;
  section = S(section).padRight(17).s.magenta.bold;
  msg = JSON.stringify(msg);

  console.log(levelStr + section + ' ' + msg);

};



Medley.prototype.logDebug = function(section, msg) {

  this.log(DEBUG, section, msg);

};



Medley.prototype.logInfo = function(section, msg) {

  this.log(INFO, section, msg);

};


Medley.prototype.logOkay = function(section, msg) {

  this.log(OKAY, section, msg);

};


var medley = new Medley();
module.exports = medley;