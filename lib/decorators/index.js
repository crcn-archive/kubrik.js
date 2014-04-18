var protoclass = require("protoclass"),
defaultDecorators = [
  require("./enterExit"),
  require("./parentEnterExit"),
  require("./states")
];

function Decorators () {
  this._decorators = defaultDecorators.concat();
}


protoclass(Decorators, {
  add: function (decorator) {
    this._decorators.push(decorator);
  },
  decorate: function (route) {

    for (var i = this._decorators.length; i--;) {
      var decorator = this._decorators[i];
      if (decorator.test(route)) {
        decorator.decorate(route);
      }
    }

    return route;
  }
});

module.exports = Decorators;