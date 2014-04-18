module.exports = function (router) {

  var hasher = require("hasher");

  function onHashChange (newHash) {

    // make sure any hash stuff isn't included
    router.redirect(String(newHash || "/").replace(/^#?!?\/?(.*)/,"/$1"));
  }

  router.bind("_location.url", function (url) {
    window.location.hash = "!" + url
  });

  hasher.changed.add(onHashChange);
  hasher.initialized.add(onHashChange);
  setTimeout(hasher.init, 0);
}
