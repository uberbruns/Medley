var Leap = require('leapjs'); 

var controller = new Leap.Controller({enableGestures: true});
  controller.loop(function(frame) {
  console.log(frame.handsMap);
});
