var protoclass = require("protoclass"),
bindable       = require("bindable"),
Request        = require("./request"),
Routes         = require("./routes"),
Url            = require("url"),
async          = require("async"),
comerr         = require("comerr"),
_              = require("underscore");

function Router (options) {

  this.application = options.application;

  bindable.Object.call(this, this);
  this.routes = new Routes(this);
}

bindable.Object.extend(Router, {

  /**
   */

  use: function () {
    for (var i = arguments.length; i--;) {
      arguments[i](this);
    }
    return this;
  },

  /**
   */

  redirect: function (path, options, next) {

    if (!options) options = { };

    if (typeof options === "function") {
      next     = options;
      options  = { };
    }

    if (!next) next = function () { };

    // parse route ~ /path/to/route?query=value
    var pathParts = Url.parse(path, true);

    // find based on the path
    var route   = this.routes.find(pathParts);

    // return if 404
    if (!route) {
      var err = comerr.notFound("path " + path + " not found");
      this.emit("error", err);
      return next(err);
    }

    // if the route name matches the pathname, then
    // rebuild the REAL path
    if (route.options.name === pathParts.pathname) {

      // rebuild the path, and parse it
      pathParts = Url.parse(this._fillPath(route.pathname, options.params));

      // pass the query and params 
      pathParts.query  = options.query;
      pathParts.params = options.params;
    } else {

      // otherwise, fetch the params from the route path
      pathParts.params = this._getParams(route.pathname, pathParts.pathname);
    }

    var prevRequest = this.location,
    newRequest      = new Request(pathParts);

    // make sure that the previous request doesn't match this location.
    if (prevRequest && prevRequest.equals(newRequest)) {
      prevRequest.query.setProperties(pathParts.query);
      return next(null, prevRequest);
    }
    
    newRequest.setProperties({
      previousRequest : prevRequest,
      route           : route
    });

    this.set("location", newRequest);

    async.waterfall([

      // exit from the previous route. Might have something like a transition
      function exit (next) {
        if (!prevRequest) return next();
        prevRequest.route.exit(newRequest, next);
      },

      // enter the new route
      function enter (next) {
        newRequest.route.enter(newRequest, next);
      },

      // return the request
      function () {
        next(null, newRequest);
      }
    ]);
  },

  /**
   */

  _fillPath: function (path, params) {
    for (var key in params) {
      path = path.replace(":" + key, params[key]);
    }
    return path;
  },

  /**
   */

  _getParams: function (routePath, reqPath) {

    var reqPathParts = reqPath.split("/"),
    routePathParts   = routePath.split("/"),
    params = {};

    for (var i = routePathParts.length; i--;) {

      var part = routePathParts[i];

      if (part.substr(0, 1) === ":") {
        params[part.substr(1)] = reqPathParts[i];
      }
    }

    return params;
  },

  /**
   */

  add: function (routes) {
    this.routes.add(routes);
    return this;
  }
});


module.exports = Router;