var bindable = require("bindable"),
async        = require("async"),
toarray      = require("toarray"),
mediocre     = require("mediocre");

function Route (path, options, routes, parent) {

  this.path    = path;
  this.parent  = parent;
  this.options = options;
  this.routes  = routes;

  this.mediator = mediocre();
  this._setPathInfo();
}

bindable.Object.extend(Route, {

  /**
   */

  enter: function (request, next) {
    this.mediator.execute("enter", request, next);
  },

  /**
   */

  exit: function (request, next) {
    this.mediator.execute("exit", request, next);
  },
  
  /**
   */

  match: function (query) {
    if (query.pathname && !this._matchPath(query.pathname)) return false;
    // TODO - match query
    return true;
  },

  /**
   */

  _matchPath: function (pathname) {
    if (!this._pathTester) return false;
    return this._pathTester.test(pathname);
  },

  /**
   */

  _setPathInfo: function () {
    if (!this.path) return;

    this._pathTester = new RegExp("^" + this.path.replace(/\/\:\w+/g, "/\\w+") + "$");

    var paramNames = this.path.match((/\/\:\w+/g)) || [];

    this.params = [];

    for (var i = paramNames.length; i--;) {
      this.params.push(paramNames[i].substr(2));
    }
  }
});


module.exports = Route;