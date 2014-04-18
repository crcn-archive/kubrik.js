var Router = require("./router");

module.exports = function (app) {

  var r = new Router({
    application: app
  });

  return r;
};
