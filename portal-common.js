try {
  const t = localStorage.getItem("krishitrust-theme");
  if (t === "light" || t === "dark") document.documentElement.dataset.theme = t;
} catch (e) {}
(function () {

  const PUBLIC_PAGES = [
  "index.html", "login.html", "register.html",
  "browse-crops.html", "store-finder.html",
  "farmer-registration-main.html", "buyer-registration.html",
];

  const ROLE_PAGES = {
    "farmer-dashboard.html":     ["farmer"],
    "sell-crops.html":           ["farmer"],
    "agri-loan.html":            ["farmer"],
    "disaster-relief.html":      ["farmer"],
    "aggregation.html":          ["farmer"],

    "buyer-dashboard.html":      ["buyer"],
    "post-requirements.html":    ["buyer"],
    "multi-farmer-orders.html":  ["buyer"],
    

    "negotiations.html":         ["buyer", "farmer"],
    "order-tracking.html":       ["buyer", "farmer"],

    "udc.html":                  ["udc"],
    "udc-applications.html":     ["udc"],
    "udc-reports.html":          ["udc"],
    "farmer-registration.html":  ["udc"],
    "farmer-verification.html":  ["udc", "bank"],

    "bank.html":                 ["bank"],
    "loan-applications.html":    ["bank"],
    "portfolio.html":            ["bank"],

    "government.html":           ["government"],
    "analytics.html":            ["government"],
    "district-reports.html":     ["government"],
    "disaster-management.html":  ["government"],
    "issue-notice.html":         ["government"],
    "loan-oversight.html":       ["government"],
    "subsidy-allocation.html":   ["government"],
    "store-inspection.html":     ["government"],
    "store-registry.html":       ["government", "store"],

    "admin.html":                ["admin"],
    "user-management.html":      ["admin"],
    "system-health.html":        ["admin"],
  };

  const page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  if (PUBLIC_PAGES.includes(page)) return;


  document.documentElement.style.visibility = "hidden";

  fetch("api/me.php")
    .then(r => r.json())
    .then(d => {
      const u = d.user;
      if (!u) { location.replace("login.html"); return; }
      if (Number(u.must_change) === 1 && page !== "change-password.html") {
        location.replace("change-password.html"); return;
      }

      const allowed = ROLE_PAGES[page];
      if (allowed && u.role !== "admin" && !allowed.includes(u.role)) {
        alert("You are not allowed to open this page");
        location.replace("index.html");
        return;
      }
      document.documentElement.style.visibility = "visible";
    })
    .catch(() => location.replace("login.html"));


  window.addEventListener("pageshow", e => { if (e.persisted) location.reload(); });
})();
async function api(url, data) {
  const options = {};
  if (data) {
    options.method = "POST";
    options.body = data instanceof FormData ? data : new URLSearchParams(data);
  }
  const res = await fetch("api/" + url, options);
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Something went wrong");
  return json;
}


async function loadUser() {
  try {
    const data = await api("me.php");
    window.currentUser = data.user;
  } catch (err) {
    window.currentUser = null;
  }
}


function requireRole(roles) {
  if (!window.currentUser) {
    location.href = "login.html";
    return false;
  }
  if (roles && !roles.includes(window.currentUser.role)) {
    alert("You are not allowed to open this page");
    location.href = "index.html?loggedout=1";
    return false;
  }
  return true;
}

function initials(name) {
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

async function logout() {
  await api("logout.php", {});
  location.href = "index.html?loggedout=1";
}
function mobileMenu() {
  const menu = document.getElementById("menu");
  const side = document.getElementById("side");
  const overlay = document.getElementById("overlay");

  if (!menu) return;

  menu.onclick = () => {
    side.classList.toggle("open");
    overlay.classList.toggle("show");
  };

  overlay.onclick = () => {
    side.classList.remove("open");
    overlay.classList.remove("show");
  };
}

function showMessage(message) {
  alert(message);
}

function pageShell(content) {
  const u = window.currentUser;   // NEW

  document.body.innerHTML = `
    <div class="app">
      <div class="layout">

        <div class="overlay" id="overlay"></div>

        <aside class="sidebar" id="side">

          <a class="brand" href="index.html">
            <div class="brand-mark">KT</div>
            <div>
              <div class="brand-text">KrishiTrust</div>
              <span class="brand-sub">Agricultural Service Platform</span>
            </div>
          </a>

          <div class="nav-label">Workspace</div>

          <nav class="nav">
            ${window.portalNav || ""}
          </nav>

          <div class="side-footer">
            Safe Agricultural Information and Service Platform<br>
            <span class="green">● System is operational</span>
          </div>

        </aside>

        <section class="main">

          <header class="topbar">

            <div class="top-left">
              <button class="menu-btn" id="menu">☰</button>
              <div class="crumb">
                KrishiTrust / <b>${window.pageTitle || ""}</b>
              </div>
            </div>

            <div class="top-right">
              <button id="themeToggle" type="button" class="theme-toggle" aria-label="Toggle theme">🌙</button>

              <button class="icon-btn" onclick="showMessage('No new notifications')">🔔</button>

              ${u ? `<button class="icon-btn" onclick="logout()">Logout</button>` : ""}

              <div class="avatar">${u ? initials(u.name) : "KT"}</div>
            </div>

          </header>

          <main class="page">
            ${content}
          </main>

        </section>

      </div>
    </div>
  `;

  mobileMenu();
}