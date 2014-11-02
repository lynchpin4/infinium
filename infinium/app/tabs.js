// --------------------------
// Imports
// --------------------------
var events = require('events'),
	_ = require('lodash'),
    http = require('http'),
    urll = require('url');

// --------------------------
// class: TabView
// The backing model/controller for an individual tab. Manages the WebView and is used as state for the controller
// --------------------------

function TabView(p)
{
	this.parent = p;
	this.tabstrip_el = null;
    
    this.has_favicon = false;
	
	this.webview = null;
	this.id = _.uniqueId('webframe_');
}

// see: https://github.com/atom/atom-shell/blob/master/docs/api/web-view-tag.md
TabView.prototype.initView = function()
{
	// create the frame holder
	this.frameHolder = document.createElement('div');
	this.frameHolder.id = this.id + "_frame";
	this.frameHolder.classList.add("webframe");
	
	// whether or not the tab is enabled, usable or w.e. not to be confused with selected tab (parent.active)
	this.active = true;
	this.favicon = null;
	
	this.webview = new WebView();
	this.frameHolder.appendChild(this.webview);
	
	this.loadState = "loading";
	
	$('#webframes').append(this.frameHolder);
	
	// attach event handlers
	this.webview.addEventListener('console-message', function(e) {
		console.log('page:', e.message);
	}.bind(this));
	
	this.webview.addEventListener('crashed', function() {
		// on tab closed
		this.active = false;
		this.loadState = "crashed";
		this.update();
	}.bind(this));
	
	this.webview.addEventListener('destroyed', function() {
		this.active = false;
		this.loadState = "destroyed";
        console.log('destroyed tab webview');
		this.update();
	}.bind(this));
	
	this.webview.addEventListener('close', function() {
		// on tab closed
		// todo: unify parent closeTab function
		this.active = false;
		this.parent.emit(Tabs.EVENT_TAB_CLOSED, this);
	}.bind(this));
	
	this.webview.addEventListener('did-fail-load', function() {
		// on tab closed
	}.bind(this));
	
	this.webview.addEventListener('did-finish-load', function() {
		this.loadState = "done";
		this.update();
	}.bind(this));
	
	this.webview.addEventListener('did-start-loading', function() {
		// on tab closed
		//console.dir(arguments);
		this.getUrlParts();
		this.update();
		this.loadState = "loading";
	}.bind(this));
	
	this.webview.addEventListener('did-stop-loading', function() {
		this.loadState = "done";
		this.update();
	}.bind(this));
	
	this.webview.addEventListener('did-get-redirect-request', function(e) {
		this.url = e.newUrl;
		this.update();
	}.bind(this));
	
	this.webview.addEventListener('new-window', function(e) {
		// check for window-bombing here
		this.parent.addTab(e.url);
	}.bind(this));
	
	this.updateInterval = setInterval(this.updateTick.bind(this), 500);
}

TabView.prototype.getUrlParts = function()
{
	var url = this.webview.getUrl();
    
    this.url_parts = urll.parse(url);
	
	return this.url_parts;
}

TabView.prototype.updateTick = function()
{
	// todo: check if these were even actually updated first
	this.url = this.webview.getUrl();
	this.title = this.webview.getTitle();
	this.parts = this.getUrlParts();
	this.favicon_url = 'http:' + "//" + this.url_parts.host + "/favicon.ico";
    if (this.old_favicon_url != this.favicon_url)
        this.updateFavicon();
    
	this.update();
}

TabView.prototype.updateFavicon = function()
{
    this.old_favicon_url = this.favicon_url;
    
    var favicon_data = [];
    http.get(urll.parse(this.favicon_url), function(resp) {
       // resp.setEncoding('binary');
        resp.on('data', function(chunk) { favicon_data.push(chunk); });
        resp.on('end', function() {
             var buf = Buffer.concat(favicon_data);
             console.dir(buf);
             console.dir(favicon_data);
             console.dir(this.favicon_url);
             this.has_favicon = true;
             this.favicon_data = "data:image/x-icon;base64," + buf.toString('base64');
             this.parent.emit(Tabs.EVENT_TAB_FAVICON, this);
        }.bind(this));
    }.bind(this));
    
}

TabView.prototype.update = function()
{
	this.parent.emit(Tabs.EVENT_TAB_STATE, this);
}

TabView.prototype.setUrl = function(url)
{
	if (!this.webview)
	{
		this.initView();
	}
	
	this.webview.src = url;
}

TabView.prototype.close = function()
{
    var i = this.parent.tabs.indexOf(this);
    this.parent.tabs.splice(i, 1);
    this.parent.emit(Tabs.EVENT_TAB_CLOSED, this);
    
    this.frameHolder.removeChild(this.webview);
    delete this.webview;
    
    if (this.parent.lastActive)
    {
        //this.parent.lastActive.show();
    }
    
    clearInterval(this.updateInterval);
}

TabView.prototype.show = function()
{
    this.parent.lastActive = this.parent.active == this ? this.parent.lastActive : this.parent.active;
	this.parent.active = this;
	
	$('.webframe').removeClass('visible');
	this.frameHolder.classList.add('visible');
    
    this.parent.emit(Tabs.EVENT_TAB_ACTIVE, this);
}

// --------------------------
// class: Tabs
// This class represents the backing model for a tabstrip, and manages tabs as they get created, deleted or swapped.
// The TabStripController will use this for getting information about tab state.
// --------------------------

function Tabs()
{
	// when the TabStripController is created, this object will hold a reference to it for callbacks
	this.controller = null;
	
	// array of created Tab objects
	this.tabs = [];
}

// this object will have events
Tabs.prototype.__proto__ = events.EventEmitter.prototype;

// --------------------------
// Events
// --------------------------

Tabs.EVENT_TAB_ADDED = "TabAdded";
Tabs.EVENT_TAB_CLOSED = "TabClosed";
Tabs.EVENT_TAB_STATE = "TabState";
Tabs.EVENT_TAB_ACTIVE = "TabActive";
Tabs.EVENT_TAB_FAVICON = "TabFavicon";

// --------------------------
// Class Methods
// --------------------------

Tabs.prototype.setController = function(controller)
{
	this.controller = controller;
}

// Add a tab and display it immediately
Tabs.prototype.addTab = function(url)
{
	var tab = new TabView(this);
	tab.setUrl(url);
	tab.show();
	
	this.tabs.push(tab);
	this.emit(Tabs.EVENT_TAB_ADDED, tab);
	
	return tab;
}