var toarray = require("toarray"),
async       = require("async");

module.exports = {
  test: function (route) {
    return route.options.states;
  },
  decorate: function (route) {
    var states = route.options.states;
    route.mediator.on("post enter", function () {
      route.router.application.set("models.states", states);
    });
  }
}