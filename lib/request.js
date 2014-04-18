var bindable = require("bindable");

function Request (options) {

  bindable.Object.call(this, this);

  this.pathname = options.pathname;
  this.query    = new bindable.Object(options.query  || {});
  this.params   = new bindable.Object(options.params || {});
} 

bindable.Object.extend(Request, {
  __isRequest: true,
  equals: function (request) {
    if (request.pathname !== this.pathname) return false;
    return true;  
  }
});


module.exports = Request;