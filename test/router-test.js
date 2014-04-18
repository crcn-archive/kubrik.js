var router = require("../"),
expect     = require("expect.js");

describe("router#", function () {

  it("can create a router", function () {
    router();
  });

  it("can register a route", function () {

    var r = router().add({
      "/a": {

      }
    });

    expect(r.routes.find({ pathname: "/a" }).path).to.be("/a");
  });


  it("emits a 404 error on a route that's not found", function (next) {
    var r = router().add({});
    r.on("error", function (err) {
      expect(err.code).to.be('404');
      next();
    });

    r.redirect("/a");
  });


  it("can redirect to a route", function (next) {

    var c = 0;

    var r = router().add({
      "/a": {
        enter: function (request, next) {
          c++;
          next();
        }
      }
    });

    r.redirect("/a", function () {
      expect(c).to.be(1);
      expect(r.get("location.route")).to.be(r.routes.find({ pathname: "/a" }));
      next();
    });
  });

  it("can redirect to a route with multiple enter functions", function (next) {

    var c = 0;

    var r = router().add({
      "/a": {
        enter: [function (request, next) {
          c++;
          next();
        }, function (request, next) {
          c++;
          next();
        }]
      }
    });

    r.redirect("/a", function () {
      expect(c).to.be(2);
      expect(r.get("location.route")).to.be(r.routes.find({ pathname: "/a" }));
      next();
    });
  });

  it("can redirect with query params", function (next) {
    var c= 0;
    var r = router().add({
      "/a": {
        enter: function (request, next) {
          c++;
          next();
        }
      }
    });
    r.redirect("/a?name=abba", function (err, location) {
      expect(location.get("query.name")).to.be("abba");
      expect(location.get("query").__isBindable).to.be(true);
      next();
    })

  });

  it("cannot redirect to the same location", function (next) {
    var c= 0;
    var r = router().add({
      "/a": {
        enter: function (request, next) {
          c++;
          next();
        }
      }
    });
    r.redirect("/a", function () {
      r.redirect("/a", function () {
        expect(c).to.be(1);
        next();
      });
    });
  });

  it("can redirect to the same route if the location is different", function (next) {
    var c= 0;
    var r = router().add({
      "/:a": {
        enter: function (request, next) {
          c++;
          next();
        }
      }
    });
    r.redirect("/a", function () {
      r.redirect("/b", function () {
        expect(c).to.be(2);
        next();
      });
    });
  });

  it("calls exit on a route", function (next) {
    var c= 0, x = 0;
    var r = router().add({
      "/:a": {
        exit: function (request, next) {
          x++;
          next();
        },
        enter: function (request, next) {
          c++;
          next();
        }
      }
    });
    r.redirect("/a", function () {
      r.redirect("/b", function () {
        expect(c).to.be(2);
        expect(x).to.be(1);
        next();
      });
    });
  });

  it("can redirect to a route with a parent enter / exit function", function (next) {

    var c = 0, x = 0;

    var r = router().add({
      enter: function (request, next) {
        c++;
        next();
      },
      exit: function (request, next) {
        x++;
        next();
      },
      "/a": {
        enter: function (request, next) {
          c++;
          next();
        },
        routes: {
          "/b": {
            enter: function (request, next) {
              c++;
              next();
            }
          }
        }
      }
    });

    r.redirect("/a/b", function () {
      expect(c).to.be(3);
      expect(r.get("location.route")).to.be(r.routes.find({ pathname: "/a/b" }));
      r.redirect("/a", function () {
        expect(c).to.be(5);
        expect(x).to.be(1);
        next();
      });
    });
  });

  it("can exit a route", function () {

  });
});