// --------------------------
// Imports
// --------------------------

var app = require('app');  // Module to control application life.

// --------------------------
// Global variables
// --------------------------

// Import some stuff into the global namespace before doing anything else
global.Infinium = global.Infinium || {
	Browser: require('./browser')
};

// First browser that gets created
global.browser = null;

// All browsers
global.browsers = [];

// --------------------------
// Bootstrap
// This is the first code executed when the browser is launched.
// --------------------------

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  if (process.platform != 'darwin')
    app.quit();
});

// This method will be called when atom-shell has done everything
// initialization and ready for creating browser windows.
app.on('ready', function() {
  // Create the original browser window.
  global.browser = new Infinium.Browser();
  global.browsers.push(global.browser);
  
 /* mainWindow = new BrowserWindow({width: 800, height: 600});

  // and load the index.html of the app.
  mainWindow.loadUrl('file://' + __dirname + '/index.html');

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    global.originalBrowser = null;
  }); */
});