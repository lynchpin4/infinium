function TabStripController()
{
	this.init();
}

TabStripController.prototype.init = function()
{
	this.render();
}

TabStripController.prototype.render = function()
{
	$('body').append(global.theme.tabstrip(this));
}