global.Infinium = global.Infinium || {};
window.Infinium = global.Infinium;

function start()
{
	// instatiate the browser objects
	global.Infinium.tabs = new Tabs();
	
	// create the browser controller (Which will create it's subcontrollers for tabstrip and others)
	var browser = new BrowserController();
	global.Infinium.browser_controller = browser;
	window.browser = browser;
	
	// init and render
	browser.init();
}

/* bootstrap / initialization */
$(function(){
	var Themes = require('./themes');
	var themes = new Themes();
	global.themes = themes;
	global.themes.cb = start;
	
	themes.loadTheme(global.theme.name);
});