global.$ = $;

// Load native UI library
var gui = require('nw.gui');

// Get the current window
var win = gui.Window.get();

// And listen to new window's focus event
win.on('focus', function() {
  console.log('New window is focused');
});

win.showDevTools();