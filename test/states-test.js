var router = require("../"),
expect     = require("expect.js");

describe("states#", function () {
  it("sets states", function (next) {
    var r = router().add({
      "/a": {
        states: {
          a: "b",
          b: "3"
        }
      }
    });

    r.redirect("/a", function (err, location) {
      expect(location.get("states.a")).to.be("b");
      expect(r.get("application.models.states.a")).to.be("b");
      next();
    })
  });
});