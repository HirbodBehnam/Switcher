
//Fire 4th : handling event on panel
document.onreadystatechange = function () {
  document.getElementById("noproxy-id").addEventListener("click", setNoProxySetting);
  document.getElementById("systemproxy-id").addEventListener("click", setSystemProxySetting);
  document.getElementById("add-proxy-id").addEventListener("click", addManualProxy);
}


//Fire 2th : gotProxyType get proxy type then pass type to currentProxyType function
function gotProxyType(popupURL) {
  Promise.all([
    browser.proxy.settings.get({}),
    browser.storage.local.get("proxies"),
  ]).then(results => {
    let proxyAddress = "";
    if (results[0].value.proxyType == "manual") {
      if (results[0].value.http != "") {
        proxyAddress = "http://" + results[0].value.http;
      } else if (results[0].value.socks != "") {
        proxyAddress = "socks5://" + results[0].value.socks;
      }
    }
    setupSwitcher(results[0].value.proxyType, proxyAddress, results[1].proxies ?? []);
  });
}

//Fire 1th : gettingPopup call gotProxyType function and pass popupURL
var gettingPopup = browser.browserAction.getPopup({});
gettingPopup.then(gotProxyType);


