var Routes = require("../lib/routes"),
expect     = require("expect.js");


describe("routes#", function () { 

  it("can create a collection of routes", function () {
    new Routes();
  }); 

  it("can properly parse out routes", function () {
    var routes = new Routes();

    routes.add({
      "/a": {},
      "/b": {},
      "/c": {}
    });

    expect(routes.all().length).to.be(3);
  });

  it("can have a route with params", function () {
    var routes = new Routes();

    routes.add({
      "/:a": {
        routes: {
          "/:b": {}
        }
      }
    });

    var ar = routes.find({ pathname: "/a" }),
    br     = routes.find({ pathname: "/a/b" });

    expect(ar.pathname).to.be("/:a");
    expect(br.pathname).to.be("/:a/:b");

    expect(ar.params).to.contain("a");
    expect(br.params).to.contain("a");
    expect(br.params).to.contain("b");
  });

  it("can have child routes", function () {

    var routes = new Routes();

    routes.add({
      "/a": {
        routes: {
          "/b": {}
        }
      }
    });

    expect(routes.all().length).to.be(2);
    expect(routes.all().shift().pathname).to.be("/a/b");
    expect(routes.all().shift().pathname).to.be("/a");
  });

  it("can find a basic route", function () {
    var routes = new Routes();

    routes.add({
      "/a": {},
      "/b": {},
      "/c": {}
    });

    expect(routes.find({ pathname: "/a" }).pathname).to.be("/a");
  });

  it("can find a basic child route", function () {
    var routes = new Routes();

    routes.add({
      "/a": {
        routes: {
          "/b": {}
        }
      }
    });

    expect(routes.find({ pathname: "/a/b" }).pathname).to.be("/a/b");
  });

  it("can find a route based on the param", function () {
    var routes = new Routes();

    routes.add({
      "/:something": {}
    });

    expect(routes.find({ pathname: "/abba" }).pathname).to.be("/:something");
  });

  it("can find doesn't return param route if param is specified", function () {

    var routes = new Routes();
    routes.add({
      "/a": {
        routes: {
          "/b": {}
        }
      },
      "/:a": {
        routes: {
          "/:b": {}
        }
      }
    });


    expect(routes.find({ pathname: "/a" }).pathname).to.be("/a");
    expect(routes.find({ pathname: "/c" }).pathname).to.be("/:a");
    expect(routes.find({ pathname: "/a/b" }).pathname).to.be("/a/b");
    expect(routes.find({ pathname: "/a/c" }).pathname).to.be("/:a/:b");
  });
});