
var HandlebarsObject = Object.create(HTMLElement.prototype);

HandlebarsObject.createdCallback = function() {
    this.render();
}

HandlebarsObject.render = function()
{
    console.log('render custom');
    
    if (this.attributes["template"].value)
    {
        var tmpl = this.attributes["template"].value;
        var obj = global.theme[tmpl];
        if (obj)
        {
            this.innerHTML = obj(this);
            console.log('template set: '+this.innerHTML);
        }
        else
        {
            this.innerHTML = "<p>no template found.</p>";
        }
    }
    else
    {
        this.innerHTML = "<p>no template given.</p>";
    }
}

module.exports = HandlebarsObject;