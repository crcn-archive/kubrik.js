var bindable = require("bindable");

function Request (options) {

  if (!options) options = {};

  bindable.Object.call(this, this);

  this.path   = options.path;
  this.query  = new bindable.Object(options.query  || {});
  this.params = new bindable.Object(options.params || {});
}

bindable.Object.extend(Request, {
  __isRequest: true,
  equals: function (request) {
    if (!request.__isRequest) request = new Request(request);

    if (request.path !== this.path) return false;

    // TODO - compare query?
    return true;  
  }
});


module.exports = Request;