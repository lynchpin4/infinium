// --------------------------
// Imports
// --------------------------

var BrowserWindow = require('browser-window');  // Module to create native browser window.

// --------------------------
// class: Browser
// This class represents and creates a new Infinium browser window
// --------------------------

function Browser()
{
	this.width = 1280;
	this.height = 768;
	
	this.window = new BrowserWindow({
		width: this.width,
		height: this.height,
		frame: false,
		'web-preferences': {
			plugins: true,  // Required by <webview>. Still doesn't work in <webview> -- Enabling it in overridecreateplugins manually half works but has unintended effects (flash has wrong security context, doesn't render ontop of webview or at all)
			javascript: true  // Test whether web-preferences crashes.
		}
	});
	
	this.window.loadUrl('file://' + __dirname + '/browser.html');
	this.window.on('closed', function() { this.window = null; }.bind(this));
	
	this.window.focus();
}

module.exports = Browser;