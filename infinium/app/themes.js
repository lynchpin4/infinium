// --------------------------
// Imports
// --------------------------
var path = require('path'),
	fs = require('fs'),
	less = require('less');

// --------------------------
// Global variables
// --------------------------
global.theme = {};
global.theme.name = "base";

// --------------------------
// class: Themes
// This class handles loading themes (and template caching) before initializing the controllers
// --------------------------

function Themes()
{
	
}

Themes.prototype.loadTheme = function(theme)
{
	var dir = path.join(__dirname, '..', 'themes', global.theme.name);
	
	// Precompile / cache all templates
	var templateDir = path.join(dir, 'templates');
	var files = fs.readdirSync(templateDir);
	
	for (var i=0;i<files.length;i++)
	{
		var f = files[i];
		global.theme[path.basename(f, '.hbs')] = Handlebars.compile(fs.readFileSync(path.join(templateDir, f)).toString());
	}
	
	// Load all CSS files
	var css = less.render(fs.readFileSync(path.join(dir, 'styles', 'theme.less')).toString(), {
		paths: [path.join(dir, 'styles')],
		filename: 'theme.less'
	},
	function(e, css)
	{
		if (e)
			console.dir(e);
		
		console.log('Output CSS: '+css);
		global.theme.css = css;
		
		if (this.cb)
			this.cb(this);
	}.bind(this));
	
	global.less = less;
}

module.exports = Themes;