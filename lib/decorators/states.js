var toarray = require("toarray"),
async       = require("async");

module.exports = {
  test: function (route) {
    return route.options.states;
  },
  decorate: function (route) {
    var states = route.options.states,
    router     = route.router;


    route.mediator.on("post enter", function (message, next) {
      message.data.set("states", states);
      next();
    });

    router.bind("location.states", { to: "application.models.states" });
  }
}