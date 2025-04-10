let manualProxies = [];

//Fire when user clicked on noproxy button
function setNoProxySetting() {

  const noProxySetting = {
    proxyType: "none",
  };

  browser.proxy.settings.set({ value: noProxySetting });

  let noproxy = document.getElementById("noproxy-id");
  noproxy.classList.add("active");

  // call setBadgeText function from browse_actions.js
  setBadgeText("N");

  let noProxySetIcon = document.getElementsByClassName("Switcher-icon-status");
  noProxySetIcon[0].src = "../images/icons/set_noproxy.png";

  let systemproxy = document.getElementById("systemproxy-id");
  systemproxy.classList.remove("active");

  for (let i = 0; i < manualProxies.length; i++) {
    let customProxy = document.getElementById("manual-proxy-" + i);
    customProxy.classList.remove("active");
  }
}

//Fire when user clicked on systemproxy button
function setSystemProxySetting() {

  const systemProxySetting = {
    proxyType: "system",
  };

  browser.proxy.settings.set({ value: systemProxySetting });

  let systemproxy = document.getElementById("systemproxy-id");
  systemproxy.classList.add("active");

  // call setBadgeText function from browserAction.js
  setBadgeText("S");

  let systemProxySetIcon = document.getElementsByClassName("Switcher-icon-status");
  systemProxySetIcon[0].src = "../images/icons/set_systemproxy.png";

  let noproxy = document.getElementById("noproxy-id");
  noproxy.classList.remove("active");

  for (let i = 0; i < manualProxies.length; i++) {
    let customProxy = document.getElementById("manual-proxy-" + i);
    customProxy.classList.remove("active");
  }
}

function createFragment(htmlStr) {
  let frag = document.createDocumentFragment(),
    temp = document.createElement('div');
  temp.innerHTML = htmlStr;
  while (temp.firstChild) {
    frag.appendChild(temp.firstChild);
  }
  return frag;
}

function addManualProxy() {
  // Read the proxy info
  let proxy = prompt("Please type your proxy address with the schema (for example: http://127.0.0.1:1080)");
  if (proxy == null)
    return;
  proxy = proxy.trim();

  // Validate it
  if (!proxy.startsWith("http://")) {
    alert("Invalid proxy schema: Must be http");
    return;
  }

  // Add it to the form
  let proxyList = document.getElementById("proxy-list");
  const item = createFragment('<li id="manual-proxy-' + manualProxies.length + '"><i class="manual"></i><span> ' + proxy + '</span></li>');
  proxyList.insertBefore(item, proxyList.childNodes[proxyList.childNodes.length - 2]);
  let proxyElement = document.getElementById("manual-proxy-" + manualProxies.length);
  proxyElement.addEventListener("click", setManualProxySetting);
  proxyElement.proxy = proxy;
  manualProxies.push(proxy);

  // Add it storage
  browser.storage.local.get("proxies").then(proxies => {
    proxies = proxies.proxies ?? [];
    proxies.push(proxy);
    browser.storage.local.set({ proxies }).then(_ => { });
  });
}

//Fire when user clicked on manualproxy button
function setManualProxySetting(event) {
  // Get the proxy info
  const proxy = event.currentTarget.proxy;

  // completed in next version 
  const manualProxySetting = {
    proxyType: "manual",
    http: proxy,
    httpProxyAll: true,
  };

  browser.proxy.settings.set({ value: manualProxySetting });

  // Find the proxy index and set it active
  for (let i = 0; i < manualProxies.length; i++) {
    if (manualProxies[i] == proxy) {
      let systemproxy = document.getElementById("manual-proxy-" + i);
      systemproxy.classList.add("active");
      break;
    }
  }

  let noproxy = document.getElementById("noproxy-id");
  noproxy.classList.remove("active");

  let systemproxy = document.getElementById("systemproxy-id");
  systemproxy.classList.remove("active");

  // call setBadgeText function from browser_action.js
  setBadgeText("M");

  let systemProxySetIcon = document.getElementsByClassName("Switcher-icon-status");
  systemProxySetIcon[0].src = "../images/icons/set_systemproxy.png";
}



//Fire 3th and checked current proxy type and update popup button list current proxy used
function setupSwitcher(proxyType, proxyAddress, savedProxies) {

  //Setup switcher version
  let version = browser.runtime.getManifest().version;
  document.getElementById("switcher-version").textContent = "version : " + version;

  savedProxies.forEach(proxy => {
    let proxyList = document.getElementById("proxy-list");
    let item = createFragment('<li id="manual-proxy-' + manualProxies.length + '"><i class="manual"></i><span> ' + proxy + '</span></li>');
    proxyList.insertBefore(item, proxyList.childNodes[proxyList.childNodes.length - 2]);
    let proxyElement = document.getElementById("manual-proxy-" + manualProxies.length);
    proxyElement.addEventListener("click", setManualProxySetting);
    proxyElement.proxy = proxy;
    manualProxies.push(proxy);
  });

  //Setup swithcer for current proxy mode
  if (proxyType == "none") {
    let noproxy = document.getElementById("noproxy-id");
    noproxy.classList.add("active");

    // call setBadgeText function from browserAction.js
    setBadgeText("N");

    let noProxySetIcon = document.getElementsByClassName("Switcher-icon-status");
    noProxySetIcon[0].src = "../images/icons/set_noproxy.png";
  }
  else if (proxyType == "system") {
    let systemproxy = document.getElementById("systemproxy-id");
    systemproxy.classList.add("active");

    // call setBadgeText function from browserAction.js
    setBadgeText("S");

    let systemProxySetIcon = document.getElementsByClassName("Switcher-icon-status");
    systemProxySetIcon[0].src = "../images/icons/set_systemproxy.png";
  }
  else if (proxyType == "manual") {
    // Find the proxy index and set it active
    for (let i = 0; i < manualProxies.length; i++) {
      if (manualProxies[i] == proxyAddress) {
        let systemproxy = document.getElementById("manual-proxy-" + i);
        systemproxy.classList.add("active");
        break;
      }
    }

    // call setBadgeText function from browser_action.js
    setBadgeText("M");

    let systemProxySetIcon = document.getElementsByClassName("Switcher-icon-status");
    systemProxySetIcon[0].src = "../images/icons/set_systemproxy.png";
  }

}


