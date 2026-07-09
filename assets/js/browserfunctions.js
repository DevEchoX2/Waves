let aTab = 0;
let tabCounter = 1;
let bTabs = [];
const NEW_TAB_PAGE = "/newtab.html";
const connection = new BareMux.BareMuxConnection("/baremux/worker.js");
const wispUrl = localStorage.getItem("cherri_wispUrl") || "wss://wisp.rhw.one/";
const bareUrl = "https://useclassplay.vercel.app/fq/";

let searchE;
const se = localStorage.getItem("cherri_searchEngine") || "DuckDuckGo";

if (se === "DuckDuckGo") {
  searchE = "https://duckduckgo.com/search?q=";
} else if (se === "Bing") {
  searchE = "https://bing.com/search?q=";
} else if (se === "Google") {
  searchE = "https://google.com/search?q=";
} else if (se === "Startpage") {
  searchE = "https://startpage.com/search?q=";
} else if (se === "Qwant") {
  searchE = "https://qwant.com/search?q=";
} else {
  searchE = "https://search.brave.com/search?q=";
}

connection.setTransport("/libcurl/index.mjs", [{ websocket: wispUrl }]);

const CONFIG = {
  files: {
    wasm: "/homework/history.wasm.wasm",
    all: "/homework/math.all.js",
    sync: "/homework/science.sync.js",
  },
};

const { ScramjetController } = $scramjetLoadController();
const scramjet = new ScramjetController({
  files: CONFIG.files,
});
scramjet.init();

// Wait for DOM to wire up searchbar events natively
window.addEventListener("DOMContentLoaded", () => {
  const searchbar = document.getElementById("searchbar");
  if (searchbar) {
    searchbar.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        nav(searchbar.value);
      }
    });
  }
});

function newTab() {
  const tabCont = document.querySelector(".tabs");
  const nTab = {
    id: tabCounter++,
    title: "New Tab",
    url: "",
    history: [],
    historyIndex: -1,
  };

  bTabs.push(nTab);
  if (!tabCont) return;

  const ntBtn = document.querySelector(".newtab");

  const tabElement = document.createElement("div");
  tabElement.classList.add("tab", "hcontainer");
  tabElement.dataset.tabId = nTab.id;
  tabElement.innerHTML = `
        <img src="/assets/fav.png" id="fav" data-fav-id="${nTab.id}" width="24" alt="">
        <span>New Tab</span>
        <i data-lucide="x" class="close-btn"></i>
  `;

  tabElement.addEventListener("click", (e) => {
    if (!e.target.closest(".close-btn")) {
      switchTab(nTab.id);
    }
  });

  const closebtn = tabElement.querySelector(".close-btn");
  closebtn.addEventListener("click", (e) => {
    e.stopPropagation();
    closeTab(nTab.id);
  });

  tabCont.insertBefore(tabElement, ntBtn);
  if (window.lucide) lucide.createIcons({ parent: tabElement });

  const tabFrame = document.createElement("iframe");
  tabFrame.classList.add("viewframe", "browser-frame");
  tabFrame.dataset.frameId = nTab.id;
  tabFrame.setAttribute("allowfullscreen", "true");
  tabFrame.setAttribute("loading", "eager");
  tabFrame.src = NEW_TAB_PAGE;

  const browserContainer = document.querySelector(".browser-container");
  if (browserContainer) {
    browserContainer.appendChild(tabFrame);
  } else {
    document.body.appendChild(tabFrame);
  }

  switchTab(nTab.id);
}

function switchTab(tId) {
  aTab = tId;

  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.toggle("active", parseInt(tab.dataset.tabId) === tId);
  });

  document.querySelectorAll(".viewframe").forEach((frame) => {
    frame.classList.toggle("active", parseInt(frame.dataset.frameId) === tId);
  });

  const cTab = bTabs.find((t) => t.id === tId);
  if (cTab) {
    const input = document.getElementById("searchbar");
    if (input) input.value = cTab.url;

    const frame = document.querySelector(`.viewframe[data-frame-id="${tId}"]`);
    if (frame && !cTab.url && frame.getAttribute("src") !== NEW_TAB_PAGE) {
      frame.src = NEW_TAB_PAGE;
    }
  }
}

function closeTab(tId) {
  if (bTabs.length === 1) {
    if (typeof showToast === "function") showToast("error", "Cannot close last tab!", "x-circle");
    return;
  }

  const tIndex = bTabs.findIndex((t) => t.id === tId);
  if (tIndex === -1) return;

  bTabs.splice(tIndex, 1);

  const tEl = document.querySelector(`.tab[data-tab-id="${tId}"]`);
  const frame = document.querySelector(`.viewframe[data-frame-id="${tId}"]`);

  if (tEl) tEl.remove();
  if (frame) frame.remove();

  if (aTab === tId) {
    const newATab = bTabs[Math.max(0, tIndex - 1)];
    if (newATab) {
      switchTab(newATab.id);
    }
  }
}

function nav(i) {
  if (!i || !i.trim()) return;

  let url = i.trim();

  if (!url.includes(".") || url.includes(" ")) {
    url = searchE + encodeURIComponent(url);
  } else {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }
  }

  const cTab = bTabs.find((t) => t.id === aTab);
  if (!cTab) return;

  cTab.history = cTab.history.slice(0, cTab.historyIndex + 1);
  cTab.history.push(url);
  cTab.historyIndex++;
  cTab.url = url;

  let fUrl;
  const backend = localStorage.getItem("cherri_backend") || "Scramjet";
  
  if (backend.toLowerCase() === "ultraviolet") {
    fUrl = "/uv/service/" + __uv$config.encodeUrl(url);
  } else {
    fUrl = scramjet.encodeUrl(url);
  }

  go(fUrl);
}

function updateUrlFromIframe(viewframe) {
  try {
    const cTab = bTabs.find((t) => t.id === aTab);
    if (!cTab) return;

    let decodedUrl;
    const currentSrc = viewframe.src;
    const backend = localStorage.getItem("cherri_backend") || "Scramjet";

    if (backend.toLowerCase() === "ultraviolet") {
      if (currentSrc.includes("/uv/service/")) {
        decodedUrl = __uv$config.decodeUrl(currentSrc.split("/uv/service/")[1]);
      }
    } else {
      decodedUrl = scramjet.decodeUrl(currentSrc);
    }

    if (decodedUrl && decodedUrl !== cTab.url) {
      cTab.url = decodedUrl;

      const ubar = document.getElementById("searchbar");
      if (ubar) ubar.value = decodedUrl;

      const favEl = document.querySelector(`#fav[data-fav-id="${aTab}"]`);
      if (favEl)
        favEl.src = `https://www.google.com/s2/favicons?domain=${decodedUrl}&sz=256`;
    }
  } catch (e) {
    console.error("Error updating URL from iframe:", e);
  }
}

async function go(u) {
  if (!(await connection.getTransport())) {
    connection.setTransport("/libcurl/index.mjs", [{ websocket: wispUrl }]);
  }

  const cTab = bTabs.find((t) => t.id === aTab);
  if (!cTab) return;

  const favEl = document.querySelector(`#fav[data-fav-id="${aTab}"]`);
  const viewframe = document.querySelector(`.viewframe[data-frame-id="${aTab}"]`);
  if (!viewframe) return;

  const ubar = document.getElementById("searchbar");
  const tabEl = document.querySelector(`.tab[data-tab-id="${aTab}"]`);
  
  if (tabEl) {
    const titleEl = tabEl.querySelector("span");
    if (titleEl) titleEl.textContent = "Loading...";
  }

  if (ubar) ubar.value = cTab.url;
  const favUrl = cTab.url;
  if (favEl && favUrl)
    favEl.src = `https://www.google.com/s2/favicons?domain=${favUrl}&sz=256`;

  try {
    viewframe.src = u;

    viewframe.onload = () => {
      try {
        const iframeDoc = viewframe.contentDocument || viewframe.contentWindow.document;
        const title = iframeDoc.title || new URL(cTab.url).hostname;

        if (tabEl) {
          const titleEl = tabEl.querySelector("span");
          if (titleEl) titleEl.textContent = title;
        }

        updateUrlFromIframe(viewframe);
      } catch (e) {
        console.error("Error accessing iframe content:", e);
        if (tabEl && cTab.url) {
          const titleEl = tabEl.querySelector("span");
          try {
            if (titleEl) titleEl.textContent = new URL(cTab.url).hostname;
          } catch (_) {
            if (titleEl) titleEl.textContent = "Web Page";
          }
        }
        updateUrlFromIframe(viewframe);
      }
    };
  } catch (e) {
    console.error("There was an error while loading the page:", e);
    if (typeof showToast === "function") {
      showToast("error", "There was a problem loading the page.", "x-circle");
    }
  }
}

function b() {
  const cTab = bTabs.find((t) => t.id === aTab);
  if (!cTab || cTab.historyIndex <= 0) return;

  cTab.historyIndex--;
  const u = cTab.history[cTab.historyIndex];
  cTab.url = u;
  
  let furl;
  const ba = localStorage.getItem("cherri_backend") || "Scramjet";
  if (ba.toLowerCase() === "ultraviolet") {
    furl = (__uv$config.prefix || "/uv/service/") + __uv$config.encodeUrl(u);
  } else {
    furl = scramjet.encodeUrl(u);
  }

  go(furl);
}

function f() {
  const cTab = bTabs.find((t) => t.id === aTab);
  if (!cTab || cTab.historyIndex >= cTab.history.length - 1) return;

  cTab.historyIndex++;
  const u = cTab.history[cTab.historyIndex];
  cTab.url = u;
  
  let furl;
  const ba = localStorage.getItem("cherri_backend") || "Scramjet";
  if (ba.toLowerCase() === "ultraviolet") {
    furl = (__uv$config.prefix || "/uv/service/") + __uv$config.encodeUrl(u);
  } else {
    furl = scramjet.encodeUrl(u);
  }

  go(furl);
}

function r() {
  const viewframe = document.querySelector(`.viewframe[data-frame-id="${aTab}"]`);
  if (viewframe) viewframe.src = viewframe.src;
}

function full() {
  const viewframe = document.querySelector(`.viewframe[data-frame-id="${aTab}"]`);
  if (viewframe) viewframe.requestFullscreen();
}

function hideBrowser() {
  const b = document.querySelector(".browser-container");
  const frames = document.querySelectorAll(".viewframe");
  if (b) {
    b.style.opacity = 0;
    b.style.pointerEvents = "none";
  }
  frames.forEach((frame) => {
    frame.style.opacity = 0;
    frame.style.pointerEvents = "none";
  });
}

async function launchEruda() {
  if (typeof showToast === "function") showToast("info", "Launching Eruda...", "zap");
  try {
    eruda.init();
    if (typeof showToast === "function") showToast("success", "Successfully injected Eruda", "check-circle");
  } catch (e) {
    if (typeof showToast === "function") showToast("error", "Failed to inject Eruda", "x-circle");
  }
}

async function fixProxy() {
  await connection.setTransport("/libcurl/index.mjs", [{ websocket: wispUrl }]);
  if (typeof showToast === "function") showToast("success", "Connection reset to Libcurl!", "refresh-cw");

  await navigator.serviceWorker.register("/sw.js");
  if (typeof showToast === "function") showToast("success", "Service workers reregistered. (1/2)", "check-circle");

  await navigator.serviceWorker.register("/uv/sw.js");
  if (typeof showToast === "function") showToast("success", "Service workers reregistered. (2/2)", "check-circle");
}
