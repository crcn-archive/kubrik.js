HTTP Router for Mojo.js [![Alt ci](https://travis-ci.org/classdojo/mojo-router.png)](https://travis-ci.org/classdojo/mojo-router)



- accept query parameters
- redirect should pull the name of the models, and use them as params.
  - works by pulling properties from the view controller

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
  pre: [auth, auth2],
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


app.router.param("")

app.router.on({
  pre: [auth, auth2],
  states: {
    app: "main"
  },
  routes: {
    "/classes/:classroom": {
      params: {
        classroom: function (request, next) {

        }
      },
      routes: {
        "/reports": {

        }
      }
    },
    "?edit": {

    }
  }
});


app.router.redirect("classroomReports", {
  params: {
    classroom: "classroom"
  }
});
```


```html
<a data-href="studentMessages" data-bind="{{
    active: <=>isActive
}}">
  student 1
</a>
```
