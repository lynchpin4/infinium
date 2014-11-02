var remote = require('remote'),
    BrowserWindow = remote.require('browser-window'); 

// --------------------------
// class: BrowserController
// Manages the view for the window
// --------------------------
function AppMenuController()
{
	this.init();
}

AppMenuController.prototype.init = function()
{
	// Render
	this.render();
}

// todo: mask/overlay invisible div to detect for close event
AppMenuController.prototype.hideClickHandler = function()
{
    setTimeout(function(){
        browser.appMenu.hide();
    }, 1);
}

AppMenuController.prototype.hide = function()
{
    $('.app-menu').removeClass('show');
    $('.app-menu-cover').removeClass('show');
}

AppMenuController.prototype.onShowBrowserDevtools = function()
{
    BrowserWindow.getFocusedWindow().openDevTools();
}

AppMenuController.prototype.onShowTabDevtools = function()
{
    browser.tabStrip.tabs.active.webview.openDevTools()
}

AppMenuController.prototype.show = function()
{
    $('.app-menu').addClass('show');
    $('.app-menu-cover').addClass('show');
    
    if (!this.events_added)
    {
        this.events_added = true;
        
        //$("#tabstrip").click(this.hideClickHandler);
        $(".app-menu-cover").click(this.hideClickHandler);
        
        $("#browser_devtools").click(this.onShowBrowserDevtools);
        $("#tab_devtools").click(this.onShowTabDevtools);
    }
}

AppMenuController.prototype.render = function()
{
	$("#menu").html(global.theme.menu(this));
}