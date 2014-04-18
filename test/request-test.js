var Request = require("../lib/request"),
expect      = require("expect.js"),
sinon       = require("sinon");


describe("request#", function () { 

  it("can create a new request", function () {
    new Request();
  });

  it("the context is itself", function () {
    var r = new Request();
    expect(r.context()).to.be(r);
  })

  it("can bind to the path", function (next) {
    var r = new Request();
    r.bind("path", function (path) {
      expect(path).to.be("abba");
      next();
    });
    r.set("path", "abba");
  })

  it("can bind to query object", function (next) {
    var r = new Request();
    r.query.on("change", function (key, value) {
      expect(key).to.be("a");
      expect(value).to.be("b");
      next();
    });
    r.set("query.a", "b");
  });

  it("can bind to the params", function (next) {
    var r = new Request();
    r.params.on("change", function (key, value) {
      expect(key).to.be("a");
      expect(value).to.be("b");
      next();
    });
    r.set("params.a", "b");
  });
});