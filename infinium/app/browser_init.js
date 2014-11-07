global.Infinium = global.Infinium || {};
window.Infinium = global.Infinium;

function registerElements()
{
    document.registerElement('x-hbars', { prototype: require('./handlebars-object') });
}

function start()
{
	// instatiate the browser objects (tabs, bookmarks, history, downloads etc)
	global.Infinium.tabs = new Tabs();
	
	// create the browser controller (Which will create it's subcontrollers for tabstrip and others)
	var browser = new BrowserController();
	global.Infinium.browser_controller = browser;
	window.browser = browser;
    
    registerElements();
	
	// init and render
	browser.init();
}

/* bootstrap / initialization */
$(function(){
	var Themes = require('./themes');
	var themes = new Themes();
	global.themes = themes;
    
    // after the themes are loaded do the rest of the initialization.
	global.themes.cb = start;
	
	themes.loadTheme(global.theme.name);
});