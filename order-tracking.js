(async function () {
  await loadUser();
  const me = window.currentUser;
  if (!me) { location.href = "login.html"; return; }
  const isBuyer = me.role === "buyer";

  const nav = isBuyer ? `
<a href="buyer-dashboard.html"><span>▦</span>Dashboard</a>
<a href="post-requirements.html"><span>＋</span>Post Requirements</a>
<a href="browse-crops.html"><span>🌾</span>Browse Crops</a>
<a href="multi-farmer-orders.html"><span>🤝</span>Multi-Farmer Orders</a>
<a class="active" href="order-tracking.html"><span>◎</span>Order Tracking</a>
<a href="negotiations.html"><span>⇄</span>Negotiations</a>` : `
<a href="farmer-dashboard.html"><span>🏠</span>Dashboard</a>
<a href="sell-crops.html"><span>🌾</span>Sell Crops</a>
<a class="active" href="order-tracking.html"><span>◎</span>Order Tracking</a>
<a href="negotiations.html"><span>⇄</span>Negotiations</a>`;

  document.body.innerHTML = `
<div class="app">
<div class="layout">
<div class="overlay" id="overlay"></div>

<aside class="sidebar" id="side">
<a class="brand" href="index.html">
<div class="brand-mark">KT</div>
<div>
<div class="brand-text">KrishiTrust</div>
<span class="brand-sub">${isBuyer ? "Buyer Portal" : "Farmer Portal"}</span>
</div>
</a>
<div class="nav-label">${isBuyer ? "Buyer Portal" : "Workspace"}</div>
<nav class="nav">${nav}</nav>
<div class="side-footer">
Verified procurement network<br>
<span class="green">● Platform operational</span>
</div>
</aside>

<section class="main">
<header class="topbar">
<div class="top-left">
<button class="menu-btn" id="menu">☰</button>
<div class="crumb">${isBuyer ? "Buyer" : "Farmer"} Portal / <b>Order Tracking</b></div>
</div>
<div class="top-right">
<button id="themeToggle" type="button" class="theme-toggle" aria-label="Toggle theme">🌙</button>
<button class="icon-btn" onclick="logout()">Logout</button>
<div class="avatar">${initials(me.name)}</div>
</div>
</header>

<main class="page">

<div class="page-head">
<div>
<div class="kicker">${isBuyer ? "Procurement Logistics" : "Sales Orders"}</div>
<h1 class="page-title">Order Tracking</h1>
<p class="page-sub">${isBuyer ? "Track every procurement order from farmer to delivery." : "Manage the orders buyers placed on your crops."}</p>
</div>
</div>

<div class="grid g4">
<div class="card stat"><div class="stat-label">Active Orders</div><div class="stat-value" id="sActive">-</div><div class="note">Currently processing</div></div>
<div class="card stat"><div class="stat-label">In Transit</div><div class="stat-value gold" id="sTransit">-</div><div class="note">On the road</div></div>
<div class="card stat"><div class="stat-label">Delivered</div><div class="stat-value green" id="sDelivered">-</div><div class="note">Completed</div></div>
<div class="card stat"><div class="stat-label">${isBuyer ? "Total Spent" : "Total Earned"}</div><div class="stat-value" id="sValue">-</div><div class="note">Delivered orders</div></div>
</div>

<div class="grid g2" id="orderGrid" style="margin-top:15px"></div>

</main>
</section>
</div>
</div>
`;

  const side = document.getElementById("side");
  const overlay = document.getElementById("overlay");
  document.getElementById("menu").onclick = () => {
    side.classList.toggle("open");
    overlay.classList.toggle("show");
  };
  overlay.onclick = () => {
    side.classList.remove("open");
    overlay.classList.remove("show");
  };

  function esc(s) {
    const d = document.createElement("div");
    d.textContent = s ?? "";
    return d.innerHTML;
  }
  const money = n => "৳" + Number(n).toLocaleString();

  const LABEL = { placed: "Placed", confirmed: "Confirmed", in_transit: "In Transit", delivered: "Delivered", cancelled: "Cancelled" };
  const BADGE = { placed: "warn", confirmed: "warn", in_transit: "gold", delivered: "ok", cancelled: "bad" };
  const PCT   = { placed: 15, confirmed: 40, in_transit: 72, delivered: 100, cancelled: 0 };

  function buttons(o) {
    const b = (act, text, cls) =>
      `<button class="btn ${cls}" data-act="${act}" data-id="${o.id}">${text}</button>`;
    if (isBuyer) {
      if (o.status === "placed") return b("cancel", "Cancel Order", "dark-btn");
      if (o.status === "in_transit") return b("receive", "Confirm Delivery", "gold-btn");
    } else {
      if (o.status === "placed") return b("confirm", "Confirm Order", "gold-btn") + b("reject", "Reject", "dark-btn");
      if (o.status === "confirmed") return b("ship", "Mark as Shipped", "gold-btn");
    }
    return "";
  }

  function card(o) {
    const pct = PCT[o.status];
    return `
<div class="card">
<div class="head">
<div>
<div class="title">${esc(o.crop_name)}</div>
<div class="sub">Order #${esc(o.order_code)}</div>
</div>
<span class="badge ${BADGE[o.status]}">${LABEL[o.status]}</span>
</div>
<div class="body">
<div class="row">
<div>
<div class="ititle">${isBuyer ? "Farmer" : "Buyer"}</div>
<div class="meta">${esc(o.other)}${o.district ? " · " + esc(o.district) : ""}</div>
${isBuyer && o.other_phone ? `<div class="meta">📞 ${esc(o.other_phone)}</div>` : ""}
</div>
<div>
<div class="price">${money(o.total)}</div>
<div class="meta">${Number(o.quantity).toLocaleString()} ${esc(o.unit)} × ${money(o.unit_price)}</div>
</div>
</div>
<div class="row">
<div>
<div class="ititle">${o.status === "delivered" ? "Delivered" : "Expected Delivery"}</div>
<div class="meta">${o.expected_delivery ? esc(o.expected_delivery) : "Set when the farmer confirms"}</div>
</div>
</div>
${o.status === "cancelled" ? "" : `
<div class="prow">
<div class="ptop"><span>Progress</span><span>${pct}%</span></div>
<div class="progress"><i style="width:${pct}%"></i></div>
</div>`}
<div class="actions" style="margin:15px 0">${buttons(o)}</div>
</div>
</div>`;
  }

  async function load() {
    try {
      const d = await api("orders_list.php");
      document.getElementById("sActive").textContent = d.stats.active;
      document.getElementById("sTransit").textContent = d.stats.transit;
      document.getElementById("sDelivered").textContent = d.stats.delivered;
      document.getElementById("sValue").textContent = money(d.stats.value);
      document.getElementById("orderGrid").innerHTML = d.orders.length
        ? d.orders.map(card).join("")
        : "<p>No orders yet.</p>";
    } catch (err) {
      document.getElementById("orderGrid").innerHTML = "<p>" + esc(err.message) + "</p>";
    }
  }

  document.getElementById("orderGrid").onclick = async (e) => {
    const btn = e.target.closest("button[data-act]");
    if (!btn) return;
    if (["cancel", "reject"].includes(btn.dataset.act) && !confirm("Cancel this order? The stock goes back on sale.")) return;
    btn.disabled = true;
    try {
      await api("order_status.php", { id: btn.dataset.id, action: btn.dataset.act });
      load();
    } catch (err) {
      alert(err.message);
      btn.disabled = false;
      load();
    }
  };

  load();
  setInterval(load, 8000);
})();