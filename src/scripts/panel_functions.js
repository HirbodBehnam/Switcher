
//Fire when user clicked on noproxy button
function setNoProxySetting() {

  let noProxySetting = {
    proxyType: "none",
  };

  browser.proxy.settings.set({ value: noProxySetting });

  let noproxy = document.getElementById("noproxy-id");
  noproxy.classList.add("active");

  // call setBadgeText function from browse_actions.js
  setBadgeText("N");

  let noProxySetIcon = document.getElementsByClassName("Switcher-icon-status");
  noProxySetIcon[0].src = "../images/icons/set_noproxy.png";

  let noproxyText = document.getElementsByClassName("noproxy-text");
  noproxyText[0].innerText = "No Proxy Mode Is Set";

  let systemproxyText = document.getElementsByClassName("systemproxy-text");
  systemproxyText[0].innerText = "Switch To System Proxy";

  let systemproxy = document.getElementById("systemproxy-id");
  systemproxy.classList.remove("active");

  //panel shortcut handeling
  let systemproxyShortcut = document.getElementById("systemproxy-shortcut");
  systemproxyShortcut.classList.add("shortcut-active");

  let noproxyShortcut = document.getElementById("noproxy-shortcut");
  noproxyShortcut.classList.remove("shortcut-active");
}

//Fire when user clicked on systemproxy button
function setSystemProxySetting() {

  let systemProxySetting = {
    proxyType: "system",
  };

  browser.proxy.settings.set({ value: systemProxySetting });

  let systemproxy = document.getElementById("systemproxy-id");
  systemproxy.classList.add("active");

  // call setBadgeText function from browserAction.js
  setBadgeText("S");

  let systemProxySetIcon = document.getElementsByClassName("Switcher-icon-status");
  systemProxySetIcon[0].src = "../images/icons/set_systemproxy.png";

  let noproxyText = document.getElementsByClassName("noproxy-text");
  noproxyText[0].innerText = "Switch To No Proxy";

  let systemproxyText = document.getElementsByClassName("systemproxy-text");
  systemproxyText[0].innerText = "System Proxy Is Set ";

  let noproxy = document.getElementById("noproxy-id");
  noproxy.classList.remove("active");

  //panel shortcut handeling
  let systemproxyShortcut = document.getElementById("systemproxy-shortcut");
  systemproxyShortcut.classList.remove("shortcut-active");

  let noproxyShortcut = document.getElementById("noproxy-shortcut");
  noproxyShortcut.classList.add("shortcut-active");
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

let manualProxyIndex = 0;

function addManualProxy() {
  // Read the proxy info
  let proxy = prompt("Please type your proxy address with the schema (for example: socks5://127.0.0.1:1080)");
  if (proxy == null)
    return;
  proxy = proxy.trim();

  // Validate it
  if (!proxy.startsWith("http://") && !proxy.startsWith("socks5://")) {
    alert("Invalid proxy schema: Must be http or socks5");
    return;
  }

  // Add it to the form
  let proxyList = document.getElementById("proxy-list");
  const item = createFragment('<li id="manual-proxy-' + manualProxyIndex + '"><i class="manual"></i><span> ' + proxy + '</span></li>');
  proxyList.insertBefore(item, proxyList.childNodes[proxyList.childNodes.length - 2]);
  let proxyElement = document.getElementById("manual-proxy-" + manualProxyIndex);
  proxyElement.addEventListener("click", setManualProxySetting);
  proxyElement.proxy = proxy;
  manualProxyIndex++;

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
  let manualProxySetting = {
    proxyType: "manual",
  };
  if (proxy.startsWith("http://")) {
    manualProxySetting.http = proxy;
    manualProxySetting.httpProxyAll = true;
  } else if (proxy.startsWith("socks5://")) {
    manualProxySetting.socks = proxy;
    manualProxySetting.proxyDNS = true;
  }

  browser.proxy.settings.set({ value: manualProxySetting });
}



//Fire 3th and checked current proxy type and update popup button list current proxy used
function setupSwitcher(proxyType, savedProxies) {

  //Setup switcher version
  let version = browser.runtime.getManifest().version;
  document.getElementById("switcher-version").textContent = "version : " + version;

  savedProxies.forEach(proxy => {
    let proxyList = document.getElementById("proxy-list");
    let item = createFragment('<li id="manual-proxy-' + manualProxyIndex + '"><i class="manual"></i><span> ' + proxy + '</span></li>');
    proxyList.insertBefore(item, proxyList.childNodes[proxyList.childNodes.length - 2]);
    let proxyElement = document.getElementById("manual-proxy-" + manualProxyIndex);
    proxyElement.addEventListener("click", setManualProxySetting);
    proxyElement.proxy = proxy;
    manualProxyIndex++;
  });

  //Setup swithcer for current proxy mode
  if (proxyType == "none") {
    let noproxy = document.getElementById("noproxy-id");
    noproxy.classList.add("active");

    let noproxyText = document.getElementsByClassName("noproxy-text");
    noproxyText[0].innerText = "No Proxy Mode Is Set";

    // call setBadgeText function from browserAction.js
    setBadgeText("N");

    let noProxySetIcon = document.getElementsByClassName("Switcher-icon-status");
    noProxySetIcon[0].src = "../images/icons/set_noproxy.png";

    let systemproxyText = document.getElementsByClassName("systemproxy-text");
    systemproxyText[0].innerText = "Switch To System Proxy";

    let systemproxyShortcut = document.getElementById("systemproxy-shortcut");
    systemproxyShortcut.classList.add("shortcut-active");

    let noproxyShortcut = document.getElementById("noproxy-shortcut");
    noproxyShortcut.classList.remove("shortcut-active");
  }
  else if (proxyType == "system") {
    let systemproxy = document.getElementById("systemproxy-id");
    systemproxy.classList.add("active");

    let noproxyText = document.getElementsByClassName("noproxy-text");
    noproxyText[0].innerText = "Switch To No Proxy";

    // call setBadgeText function from browserAction.js
    setBadgeText("S");

    let systemProxySetIcon = document.getElementsByClassName("Switcher-icon-status");
    systemProxySetIcon[0].src = "../images/icons/set_systemproxy.png";

    let systemproxyText = document.getElementsByClassName("systemproxy-text");
    systemproxyText[0].innerText = "System Proxy Is Set";

    let systemproxyShortcut = document.getElementById("systemproxy-shortcut");
    systemproxyShortcut.classList.remove("shortcut-active");

    let noproxyShortcut = document.getElementById("noproxy-shortcut");
    noproxyShortcut.classList.add("shortcut-active");

  }
  else if (proxyType == "manual") {
    // call setBadgeText function from browser_action.js
    setBadgeText("M");
  }

}


