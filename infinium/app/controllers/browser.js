function BrowserController()
{
	
}

BrowserController.prototype.init = function()
{
	// Initial Render
	this.render();
	
	// Create tab strip controller
	this.tabStripController = new TabStripController();
}

BrowserController.prototype.render = function()
{
	$('head').append('<style>'+global.theme.css+'</style>');
	document.body.innerHTML = global.theme.browser(this);
}