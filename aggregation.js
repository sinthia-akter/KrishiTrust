(async function () {
  await loadUser();
  const me = window.currentUser;
  if (!me) { location.href = "login.html"; return; }

  document.body.innerHTML = `
<div class="app">
<div class="layout">

<div class="overlay" id="overlay"></div>

<aside class="sidebar" id="side">

<a class="brand" href="index.html">
<div class="brand-mark">KT</div>
<div>
<div class="brand-text">KrishiTrust</div>
<span class="brand-sub">Farmer Portal</span>
</div>
</a>

<div class="nav-label">Workspace</div>

<nav class="nav">
<a href="farmer-dashboard.html"><span>🏠</span>Dashboard</a>
<a href="sell-crops.html"><span>🌾</span>Sell Crops</a>
<a href="negotiations.html"><span>⇄</span>Negotiations</a>
<a href="order-tracking.html"><span>◎</span>Order Tracking</a>
<a href="store-finder.html"><span>🏪</span>Find Stores</a>
<a href="agri-loan.html"><span>💳</span>Agri Loan</a>
<a href="disaster-relief.html"><span>🌊</span>Disaster Relief</a>
<a class="active" href="aggregation.html"><span>🤝</span>Aggregation</a>
</nav>

<div class="side-footer">
Secure agricultural intelligence platform<br>
<span class="green">● System operational</span>
</div>

</aside>

<section class="main">

<header class="topbar">
<div class="top-left">
<button class="menu-btn" id="menu">☰</button>
<div class="crumb">Farmer Portal / <b>Aggregation</b></div>
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
<div class="kicker">Bulk Procurement</div>
<h1 class="page-title">Aggregation</h1>
<p class="page-sub">Combine farmer supply to meet larger procurement requirements.</p>
</div>
</div>

<div class="grid g4">
<div class="card stat"><div class="stat-label">Open Aggregations</div><div class="stat-value" id="sOpen">-</div><div class="note">With an active share of yours</div></div>
<div class="card stat"><div class="stat-label">Your Supply</div><div class="stat-value gold" id="sSupply">-</div><div class="note">Units in active shares</div></div>
<div class="card stat"><div class="stat-label">Expected Value</div><div class="stat-value" id="sValue">-</div><div class="note">At the agreed listed price</div></div>
<div class="card stat"><div class="stat-label">Delivered Shares</div><div class="stat-value green" id="sDone">-</div><div class="note">Completed by you</div></div>
</div>

<div class="grid g2" style="margin-top:15px">

<div class="card pad">
<div class="kicker">Your Aggregations</div>
<div class="title">Bulk orders you are part of</div>
<div id="bulkList" style="margin-top:12px"></div>
</div>

<div class="card pad">
<div class="kicker">How it works</div>
<div class="title">How you get included</div>
<div class="list">
<div class="row"><div><div class="ititle">1. Keep a live listing</div><div class="meta">Publish your crop on Sell Crops and keep stock available.</div></div></div>
<div class="row"><div><div class="ititle">2. A buyer picks you</div><div class="meta">A buyer chooses up to 3 farmers for one product and places a single bulk order.</div></div></div>
<div class="row"><div><div class="ititle">3. Confirm your share</div><div class="meta">Your share appears here and in Order Tracking. Confirm it, then mark it shipped.</div></div></div>
</div>
<a class="btn gold-btn" style="margin-top:14px;width:100%" href="sell-crops.html">Publish a listing</a>
<a class="btn ghost-gold" style="margin-top:8px;width:100%" href="order-tracking.html">Open Order Tracking</a>
</div>

</div>

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
  const $ = id => document.getElementById(id);
  const money = n => "৳" + Math.round(Number(n)).toLocaleString();

  const LABEL = { placed: "Pending", confirmed: "Confirmed", in_transit: "In Transit", delivered: "Delivered", cancelled: "Cancelled" };
  const BADGE = { placed: "warn", confirmed: "ok", in_transit: "gold", delivered: "ok", cancelled: "bad" };

  function card(b) {
    const live = b.parts.filter(p => p.status !== "cancelled");
    const done = live.filter(p => ["confirmed", "in_transit", "delivered"].includes(p.status)).length;
    const total = live.reduce((s, p) => s + Number(p.quantity), 0);
    const pct = live.length ? Math.round(100 * done / live.length) : 0;

    return `
<div style="margin-bottom:22px">
<div class="kicker">${esc(b.bulk_code)}</div>
<div class="title">${esc(b.crop_name)} Bulk Purchase</div>
<div class="sub">${total.toLocaleString()} ${esc(b.unit)} in total · Buyer: ${esc(b.buyer)}</div>

<div class="prow">
<div class="ptop"><span>Farmers confirmed</span><span>${done} / ${live.length}</span></div>
<div class="progress"><i style="width:${pct}%"></i></div>
</div>

<div class="list">
${b.parts.map(p => `
<div class="row">
<div class="item">
<div class="icon">👨‍🌾</div>
<div>
<div class="ititle">${esc(p.name)}</div>
<div class="meta">${Number(p.quantity).toLocaleString()} ${esc(p.unit)}</div>
</div>
</div>
<span class="badge ${BADGE[p.status]}">${LABEL[p.status]}</span>
</div>`).join("")}
</div>

<div class="meta" style="margin-top:10px">Your share: ${Number(b.quantity).toLocaleString()} ${esc(b.unit)} × ${money(b.unit_price)} = ${money(b.total)} · ${esc(LABEL[b.status])}</div>
</div>`;
  }

  async function load() {
    try {
      const d = await api("agg_mine.php");
      $("sOpen").textContent = d.stats.open;
      $("sSupply").textContent = Number(d.stats.supply).toLocaleString();
      $("sValue").textContent = money(d.stats.value);
      $("sDone").textContent = d.stats.delivered;
      $("bulkList").innerHTML = d.bulks.length
        ? d.bulks.map(card).join("")
        : "<p style='padding:14px 0'>You are not part of any bulk order yet. Keep a live listing and buyers can include you.</p>";
    } catch (err) {
      $("bulkList").innerHTML = "<p>" + esc(err.message) + "</p>";
    }
  }

  load();
  setInterval(load, 10000);
})();