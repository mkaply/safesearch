const {classes: Cc, interfaces: Ci, utils: Cu, results: Cr} = Components;
Cu.import("resource://gre/modules/Services.jsm");

function startup(aData, aReason) {
  Services.obs.addObserver(HTTPObserver, "http-on-modify-request", false);
}

function shutdown(aData, aReason) {
  Services.obs.removeObserver(HTTPObserver, "http-on-modify-request", false);
}
 
function install(aData, aReason) {}

function uninstall(aData, aReason) {
}
 
var HTTPObserver = {
  observe: function observe(subject, topic, data) {
    switch (topic) {
    case "http-on-modify-request":
      var httpChannel = subject.QueryInterface(Ci.nsIHttpChannel);
      if (/.*\.google\..*/.test(httpChannel.URI.host)) {
        if (/^(\/custom|\/search|\/images\/complete)/.test(httpChannel.URI.path)) {
          if (httpChannel.URI.spec.indexOf("safe=strict") == -1) {
            httpChannel.redirectTo(Services.io.newURI(httpChannel.URI.spec + "&safe=strict", null, null));
          }
        }
        return;
      }
      if (/.*\.search.yahoo\..*/.test(httpChannel.URI.host)) {
        if (/^(\/search)/.test(httpChannel.URI.path)) {
          if (httpChannel.URI.spec.indexOf("vm=r") == -1) {
            httpChannel.redirectTo(Services.io.newURI(httpChannel.URI.spec + "'&vm=r", null, null));
          }
        }
        return;
      }
      if (/.*\.bing\..*/.test(httpChannel.URI.host)) {
        if (/^(\/search|\/videos|\/images|\/news)/.test(httpChannel.URI.path)) {
          if (httpChannel.URI.spec.indexOf("adlt=strict") == -1) {
            httpChannel.redirectTo(Services.io.newURI(httpChannel.URI.spec + "'&adlt=strict", null, null));
          }
        }
        return;
      }
    }
  }
}
