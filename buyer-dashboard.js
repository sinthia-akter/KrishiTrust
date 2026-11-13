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
    <span class="brand-sub">Buyer Portal</span>
  </div>
</a>

<div class="nav-label">Buyer Portal</div>

<nav class="nav">
<a class="active" href="buyer-dashboard.html"><span>▦</span>Dashboard</a>
<a href="post-requirements.html"><span>＋</span>Post Requirements</a>
<a href="browse-crops.html"><span>🌾</span>Browse Crops</a>
<a href="multi-farmer-orders.html"><span>🤝</span>Multi-Farmer Orders</a>
<a href="order-tracking.html"><span>◎</span>Order Tracking</a>
<a href="negotiations.html"><span>⇄</span>Negotiations</a>
</nav>

<div class="side-footer">
Verified procurement network<br>
<span class="green">● Platform operational</span>
</div>

</aside>

<section class="main">

<header class="topbar">
<div class="top-left">
<button class="menu-btn" id="menu">☰</button>
<div class="crumb">Buyer Portal / <b>Dashboard</b></div>
</div>
<div class="top-right">
<button id="themeToggle" type="button" class="theme-toggle" aria-label="Toggle theme">🌙</button>
<button class="icon-btn" id="bell">🔔</button>
<button class="icon-btn" onclick="logout()">Logout</button>
<div class="avatar">${initials(me.name)}</div>
</div>
</header>

<main class="page">

<div class="page-head">
<div>
<div class="kicker">Procurement Intelligence</div>
<h1 class="page-title">Dashboard</h1>
<p class="page-sub">Buyer Dashboard · Manage procurement, farmers and orders.</p>
</div>
<a class="btn gold-btn" href="browse-crops.html">Browse Crops →</a>
</div>

<div class="grid g4">
<div class="card stat">
<div class="stat-label">Active Orders</div>
<div class="stat-value" id="sActive">-</div>
<div class="note" id="nActive">&nbsp;</div>
</div>
<div class="card stat">
<div class="stat-label">Total Purchased</div>
<div class="stat-value gold" id="sBought">-</div>
<div class="note">Delivered orders</div>
</div>
<div class="card stat">
<div class="stat-label">Farmers Supplying You</div>
<div class="stat-value" id="sFarmers">-</div>
<div class="note">Different farmers ordered from</div>
</div>
<div class="card stat">
<div class="stat-label">Savings via Platform</div>
<div class="stat-value green" id="sSave">-</div>
<div class="note">Negotiated savings</div>
</div>
</div>

<div class="grid g2" style="margin-top:15px">

<div class="card">
<div class="head">
<div>
<div class="title">Available Crop Listings</div>
<div class="sub">Newest · Verified farmers</div>
</div>
<a class="btn ghost-gold" href="browse-crops.html">View all</a>
</div>
<div class="body">
<div class="list" id="listings"></div>
</div>
</div>

<div class="card">
<div class="head">
<div>
<div class="title">Procurement Performance</div>
<div class="sub">Delivered vs ordered</div>
</div>
</div>
<div class="body" id="perf"></div>
</div>

</div>

<div class="grid g3" style="margin-top:15px">

<div class="card pad">
<div class="kicker">Quick Action</div>
<div class="title">Post Requirement</div>
<div class="sub">Tell verified farmers what you need.</div>
<a class="btn gold-btn" style="margin-top:14px" href="post-requirements.html">Post Requirement</a>
</div>

<div class="card pad">
<div class="kicker">Bulk Procurement</div>
<div class="title">Multi-Farmer Orders</div>
<div class="sub">Combine supply from multiple farmers.</div>
<a class="btn ghost-gold" style="margin-top:14px" href="multi-farmer-orders.html">Manage Orders</a>
</div>

<div class="card pad">
<div class="kicker">Order Status</div>
<div class="title">Track Shipments</div>
<div class="sub">Monitor all active deliveries.</div>
<a class="btn ghost-gold" style="margin-top:14px" href="order-tracking.html">Track Orders</a>
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
  const money = n => "৳" + Math.round(Number(n)).toLocaleString();
  const ICONS = { "Potato": "🥔", "Jute": "🌿", "Mustard": "🌼", "Lentils": "🫘" };

  let waiting = 0;
  document.getElementById("bell").onclick = () => {
    alert(waiting
      ? waiting + " negotiation(s) are waiting for your reply."
      : "No new notifications");
  };


  try {
    const d = await api("buyer_stats.php");
    const s = d.stats;
    waiting = d.waiting;

    document.getElementById("sActive").textContent = Number(s.active).toLocaleString();
    document.getElementById("nActive").textContent = Number(s.pending) + " waiting for a farmer";
    document.getElementById("sBought").textContent = money(s.purchased);
    document.getElementById("sFarmers").textContent = Number(s.farmers).toLocaleString();
    document.getElementById("sSave").textContent = money(s.savings);

    document.getElementById("perf").innerHTML = d.crops.length ? d.crops.map(c => {
      const pct = Math.round(100 * c.delivered / c.ordered);
      return `
<div class="prow">
<div class="ptop">
<span>${esc(c.crop_name)}</span>
<span>${Number(c.delivered).toLocaleString()} / ${Number(c.ordered).toLocaleString()} ${esc(c.unit)}</span>
</div>
<div class="progress"><i style="width:${pct}%"></i></div>
</div>`;
    }).join("") : "<p style='padding:14px 0'>No orders yet.</p>";
  } catch (err) {
    document.getElementById("perf").innerHTML = "<p>" + esc(err.message) + "</p>";
  }

  // newest 3 live crops
  try {
    const d = await api("crops_public.php");
    document.getElementById("listings").innerHTML = d.crops.length
      ? d.crops.slice(0, 3).map(c => `
<div class="row">
<div class="item">
<div class="icon">${ICONS[c.crop_name] || "🌾"}</div>
<div>
<div class="ititle">${esc(c.crop_name)}</div>
<div class="meta">${esc(c.farmer_name)} · ${esc(c.district)}</div>
</div>
</div>
<div>
<div class="price">${money(c.price)}</div>
<div class="meta">${Number(c.quantity).toLocaleString()} ${esc(c.unit)}</div>
</div>
</div>`).join("")
      : "<p style='padding:14px 0'>No crops on sale right now.</p>";
  } catch (err) {
    document.getElementById("listings").innerHTML = "<p>" + esc(err.message) + "</p>";
  }
})();