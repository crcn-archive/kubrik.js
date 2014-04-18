var toarray = require("toarray"),
async       = require("async");

module.exports = {
  test: function (route) {
    return true;
  },
  decorate: function (route) {

    var enter = toarray(route.options.enter),
    exit      = toarray(route.options.exit);

    route.mediator.on("enter", function (message, next) {
      if (!enter.length) return next();
      async.eachSeries(enter, function (enter, next) {
        enter(message.data, next);
      }, next);
    });

    route.mediator.on("exit", function (message, next) {
      if (!exit.length) return next();
      async.eachSeries(exit, function (exit, next) {
        exit(message.data, next);
      }, next);
    });
  }
}