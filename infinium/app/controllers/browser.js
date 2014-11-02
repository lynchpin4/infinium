// --------------------------
// class: BrowserController
// Manages the view for the window
// --------------------------
function BrowserController()
{
	
}

BrowserController.prototype.init = function()
{
	// Render
	this.render();
	
	// Create tab strip controller
	this.tabStrip = new TabStripController();
	
	// Create the window controller
	this.window = new WindowController();
    
    // Create the app menu controller
    this.appMenu = new AppMenuController();
}

BrowserController.prototype.render = function()
{
	$('head').append('<style>'+global.theme.css+'</style>');
	document.body.innerHTML = global.theme.browser(this);
}