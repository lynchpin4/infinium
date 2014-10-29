function start()
{
	var browser = new BrowserController();
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