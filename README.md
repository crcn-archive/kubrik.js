HTTP Router for Mojo.js [![Alt ci](https://travis-ci.org/classdojo/mojo-router.png)](https://travis-ci.org/classdojo/mojo-router)


```javascript
var mojo = require("mojojs"), app = mojo.application;

app.use(require("mojo-router"));

// authentication routes
app.router.on({
  states: {
    app: "auth"
  },
  "/login": {
    name: "login",
    states: {
      auth: "login"
    }
  }
});


function auth (req) {
  // TODO
}


// application routes
app.router.on({
  pre: auth,
  states: {
    app: "main"
  },
  "/classes/:classroom": {
    states: {
      main: "classes"
    },
    "/reports": {
      name: "classroomReports",
      states: {
        classes: "reports"
      }
    }
  }
});


app.router.redirect("classroomReports", {
  params: {
    classroom: "classroom"
  }
});
```
