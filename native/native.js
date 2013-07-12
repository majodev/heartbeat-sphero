// Load native UI library from node-webkit
var gui = require('nw.gui');

// Get the current window
var win = gui.Window.get();

// define handle close event for window properly
win.on('close', function() {
  this.hide(); // Pretend to be closed already
	try{
		console.log("closing application, trying to shut down sphero...");
  	sphero.close();
	}catch(e){
  	console.log("error while trying to shut down sphero: " + e);
  }
  this.close(true);
});

// show dev-tools for debugging
//win.showDevTools();

// refocus on windows after dev-tools are shown
win.focus();
win.show();

// set focus on the canvas
//document.getElementById('gameCanvas').focus();

// And listen to new window's focus event
// win.on('focus', function() {
//   console.log('New window is focused');
// });