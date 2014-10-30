// --------------------------
// Imports
// --------------------------
var events = require('events'),
	_ = require('lodash');

// --------------------------
// class: TabStripController
// Manages the view for the tabstrip
// --------------------------
function TabStripController()
{
	// tabstrip specific settings
	this.tabWidth = 170;
	this.tabMargin = 0;
	
	// keep local reference to the tab manager
	this.tabs = global.Infinium.tabs;
	this.init();
    
    this.color = color({});
}

TabStripController.prototype.init = function()
{
	// Only one call to render
	this.render();
	
	// Local element references
	this.strip = $('.strip');
	this.wrapper = this.strip.find('.wrapper');
	this.tabs_el = this.strip.find('.tabs');
	this.back = this.strip.find('.command.back');
	this.forward = this.strip.find('.command.forward');
	this.newtab = this.strip.find('.command.new');
	
	// Tab elements (may not even be necessary)
	this.tab_els = [];
	
	// One call to setcontroller on tabs, let the object know the controller is ready and to start firing tab events
	this.tabs.setController(this);
	
	// Register events from the tab system
	this.tabs.addListener(Tabs.EVENT_TAB_ADDED, this.onTabAdded.bind(this));
	this.tabs.addListener(Tabs.EVENT_TAB_CLOSED, this.onTabClosed.bind(this));
	this.tabs.addListener(Tabs.EVENT_TAB_STATE, this.onTabState.bind(this));
	this.tabs.addListener(Tabs.EVENT_TAB_ACTIVE, this.onTabActive.bind(this));
    this.tabs.addListener(Tabs.EVENT_TAB_FAVICON, this.onTabFavicon.bind(this));
    
    this.input_blurred = true;
    
    $('.box input').blur(function() {
        this.input_blurred = true;
    }.bind(this));
    
    $('.box input').focus(function() {
        this.input_blurred = false;
    }.bind(this));
    
    $('.box form').submit(function(e){
        var url = $('.box input').val();
        if (url.indexOf("http:") == -1 && url.indexOf("https:") == -1)
        {
            url = "http://" + url;
        }
        
        if (this.tabs.active)
        {
            this.tabs.active.setUrl(url);
        }
        else
        {
            Infinium.tabs.addTab(url);
        }
        
        return false;
    }.bind(this));
	
	// Register events from the UI
	$('.command.new').click(this.onAddNewTab.bind(this));
}

// Methods
TabStripController.prototype.onAddNewTab = function()
{
	Infinium.tabs.addTab('http://google.com/');
}

TabStripController.prototype.positionTab = function(tab, idx)
{
	var el = tab.tabstrip_el;
	el.css('left', idx * (this.tabWidth + this.tabMargin));
	
	if (tab.parent.active == tab)
	{
		var tabs_width = tab.parent.tabs.length * (this.tabWidth + this.tabMargin);
		var tabs_left = this.tabs_el.position().left;
		
		if ((idx + 1) * (this.tabWidth + this.tabMargin) + tabs_left > this.wrapper.width())
		{
			this.tabs_el.css({
				'left': (this.wrapper.width() - (idx + 1) * (this.tabWidth + this.tabMargin)) + 'px'
			});
		}
		else if (-tabs_left > idx * (this.tabWidth + this.tabMargin))
		{
			this.tabs_el.css({
				'left': -(idx * (this.tabWidth + this.tabMargin)) + 'px'
			});
		}
	}
}

// Tab Events

TabStripController.prototype.onTabAdded = function(tab)
{
	var tab_id = _.uniqueId('tab_');
	
	var tab_html = global.theme.tab({
		id: tab_id
	});
	
	var el = $(tab_html);
	this.tabs_el.append(el);
	
	tab.tabstrip_el = el;
	
	console.log('-- tab added --');
	this.onTabState(tab);
	this.positionTab(tab, tab.parent.tabs.length - 1); // todo: proper
    
    $("#"+tab_id).click(function(){
        tab.show();
    });
}

TabStripController.prototype.onTabActive = function(tab)
{
    if (tab.url_parts)
    {
        $('.box.host').text(tab.url_parts.host);
        $('.box.path').text(tab.url_parts.path);
        $('.box.hash').text(tab.url_parts.hash);
        if (this.input_blurred) $('.box input').val(tab.url);
    }
}

TabStripController.prototype.onTabFavicon = function(tab)
{
    var el = tab.tabstrip_el;
    if (tab.has_favicon)
    {
        el.find('.content').addClass('with-favicon');
        el.find('.favicon').css('background-image', 'url('+tab.favicon_data+')');
        el.find('.favicon').css('display', 'block');
        
        var img = new Image();
        img.src = tab.favicon_data;
        img.onload = function() {
        tab.favicon_need_color = false;
            var rgb = this.color.get(img);
            el.find('.loading').css({
              'background-color': 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')'
            });
        }.bind(this);
    }
    else
    {
        el.find('.content').removeClass('with-favicon');
        el.find('.favicon').removeAttr('style');
    }
}

TabStripController.prototype.onTabState = function(tab)
{
	var el = tab.tabstrip_el;
	el.find('.title').text(tab.title);
    
    if (this.tabs.active == tab)
    {
        if (tab.url_parts)
        {
            $('.box .host').text(tab.url_parts.host);
            $('.box .path').text(tab.url_parts.path);
            $('.box .hash').text(tab.url_parts.hash);
            
            if (this.input_blurred) $('.box input').val(tab.url);
        }
        
        $('.tab').removeClass('active');
        el.addClass('active');
    }
}

TabStripController.prototype.onTabClosed = function(tab)
{
	
}

TabStripController.prototype.render = function()
{
	$('#tabstrip').append(global.theme.tabstrip(this));
}