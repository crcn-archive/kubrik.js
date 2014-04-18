var Router = require("./router");

module.exports = function (app) {

  var r = new Router({
    application: app
  });

  r.bind("location.query"  , { to: "application.models.query" });
  r.bind("location.params" , { to: "application.models.params" });
  r.bind("location.states" , { to: "application.models.states" });

  if (process.browser) {
    r.use(module.exports.listeners.http);
  }

  if (app) {
    app.router = r;
  }

  return r;
};

module.exports.listeners = require("./listeners");
