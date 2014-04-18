var protoclass = require("protoclass"),
bindable       = require("bindable"),
Request        = require("./request"),
Routes         = require("./routes"),
Url            = require("url"),
async          = require("async"),
comerr         = require("comerr");


function Router () {
  bindable.Object.call(this, this);
  this.routes = new Routes();
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

    var pathParts = Url.parse(path, true),
    route         = this.routes.find(pathParts);

    // TODO - rebuild the route
    var prevRequest = this.location,
    newRequest      = new Request(pathParts);

    // make sure that the previous request doesn't match this location.
    // TODO - combine query params
    if (prevRequest && prevRequest.equals(newRequest)) {
      return next(null, prevRequest);
    }

    newRequest.setProperties({
      previousRequest : prevRequest,
      route           : route
    });

    if (!route) {
      var err = comerr.notFound("path " + path + " not found");
      this.emit("error", err);
      return next(err);
    }

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

  buildPath: function (routeName, options) {

  },

  /**
   */

  add: function (routes) {
    this.routes.add(routes);
    return this;
  }
});


module.exports = Router;