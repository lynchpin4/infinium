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

AppMenuController.prototype.hideClickHandler = function()
{
     console.log('close app menu handler');
    setTimeout(function(){
       
        browser.appMenu.hide();
    }, 1);
}

AppMenuController.prototype.hide = function()
{
    $('.app-menu').removeClass('show');
}

AppMenuController.prototype.show = function()
{
    $('.app-menu').addClass('show');
    
    if (!this.events_added)
    {
        this.events_added = true;
        
        //$("#tabstrip").click(this.hideClickHandler);
        $("#webframes").click(this.hideClickHandler);
    }
}

AppMenuController.prototype.render = function()
{
	$("#menu").html(global.theme.menu(this));
}