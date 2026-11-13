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
    <a class="active" href="farmer-dashboard.html"><span>🏠</span>Dashboard</a>
    <a href="sell-crops.html"><span>🌾</span>Sell Crops</a>
    <a href="negotiations.html"><span>⇄</span>Negotiations</a>
    <a href="order-tracking.html"><span>◎</span>Order Tracking</a>
    <a href="store-finder.html"><span>🏪</span>Store Finder</a>
    <a href="agri-loan.html"><span>💳</span>Agri Loan</a>
    <a href="disaster-relief.html"><span>🌊</span>Disaster Relief</a>
    <a href="aggregation.html"><span>🤝</span>Aggregation</a>
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
    <div class="crumb">Farmer Portal / <b>Dashboard</b></div>
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
    <div class="kicker">KrishiTrust Platform</div>
    <h1 class="page-title">Farmer Dashboard</h1>
    <p class="page-sub">
      🎙️ Bengali voice guide is active
      · Bengali voice assistance is available for all actions
    </p>
  </div>
</div>

<div class="alert gold-alert" id="verifyBanner" style="display:none;margin-bottom:15px"></div>

<div class="grid g4">

  <div class="card stat">
    <div class="stat-label">Active Listings</div>
    <div class="stat-value" id="sList">-</div>
    <div class="note">Currently live</div>
  </div>

  <div class="card stat">
    <div class="stat-label">Total Earnings</div>
    <div class="stat-value gold" id="sEarn">-</div>
    <div class="note">Delivered orders</div>
  </div>

  <div class="card stat">
    <div class="stat-label">Pending Bids</div>
    <div class="stat-value" id="sBids">-</div>
    <div class="note">Awaiting your response</div>
  </div>

  <div class="card stat">
    <div class="stat-label">Account Status</div>
    <div class="stat-value" id="sStatus">-</div>
    <div class="note" id="nStatus">&nbsp;</div>
  </div>

</div>

<div class="grid g2" style="margin-top:15px">

  <div class="card pad">

    <div class="kicker">Quick Actions</div>
    <div class="title">Quick Actions</div>

    <div class="grid g2" style="margin-top:14px">

      <a class="card pad" href="sell-crops.html">
        <div class="icon">🌾</div>
        <div class="ititle" style="margin-top:8px">List the crops</div>
        <div class="meta">Sell your crops</div>
      </a>

      <a class="card pad" href="agri-loan.html">
        <div class="icon">💳</div>
        <div class="ititle" style="margin-top:8px">Apply for Agri Loan</div>
        <div class="meta">Loan Application</div>
      </a>

      <a class="card pad" href="disaster-relief.html">
        <div class="icon">🌊</div>
        <div class="ititle" style="margin-top:8px">Damage Registration</div>
        <div class="meta">Register crop damage</div>
      </a>

      <a class="card pad" href="store-finder.html">
        <div class="icon">🏪</div>
        <div class="ititle" style="margin-top:8px">Store Finder</div>
        <div class="meta">Find verified stores</div>
      </a>

      <a class="card pad" href="aggregation.html">
        <div class="icon">🤝</div>
        <div class="ititle" style="margin-top:8px">Sell together</div>
        <div class="meta">Join aggregation</div>
      </a>

      <button class="card pad" id="priceBtn" style="text-align:left;color:inherit">
        <div class="icon">📈</div>
        <div class="ititle" style="margin-top:8px">Market Prices</div>
        <div class="meta">Check market prices</div>
      </button>

    </div>

  </div>

  <div class="card pad">

    <div class="kicker">Current Listings</div>
    <div class="title">Your active crops</div>

    <div class="list" id="myCrops"></div>

  </div>

</div>

<div class="card pad" style="margin-top:15px">

  <div class="kicker">Recent Activity</div>
  <div class="title">Your Recent Activities</div>

  <div class="list" id="activity"></div>

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

  let alerts = 0;
  let prices = [];

  document.getElementById("bell").onclick = () => {
    alert(alerts ? alerts + " item(s) need your attention (offers or new orders)." : "No new notifications");
  };

  document.getElementById("priceBtn").onclick = () => {
    alert(prices.length
      ? "Average listed prices on KrishiTrust:\n\n" +
        prices.map(p => p.crop_name + " " + money(p.avg_price)).join("\n")
      : "No crops are listed on the market right now.");
  };

  const ORDER_TEXT = {
    placed: ["New order to confirm", "gold"],
    confirmed: ["Order confirmed", "ok"],
    in_transit: ["Order shipped", "ok"],
    delivered: ["Order delivered", "ok"],
    cancelled: ["Order cancelled", "bad"],
  };

  let verified = false;
  try {
    const d = await api("farmer_stats.php");
    const s = d.stats;
    prices = d.prices;
    alerts = s.bids + s.new_orders;
    verified = s.status === "verified";

    document.getElementById("sList").textContent = s.listings;
    document.getElementById("sEarn").textContent = money(s.earnings);
    document.getElementById("sBids").textContent = s.bids;

    const st = document.getElementById("sStatus");
    st.textContent = s.status.charAt(0).toUpperCase() + s.status.slice(1);
    st.className = "stat-value " + (verified ? "green" : "gold");
    document.getElementById("nStatus").textContent =
      verified ? "You can sell crops" : s.status === "rejected" ? "Contact your UDC agent" : "Waiting for verification";

    if (!verified) {
      const b = document.getElementById("verifyBanner");
      b.style.display = "block";
      b.textContent = s.status === "rejected"
        ? "Your account was rejected. Please contact your local UDC agent."
        : "Your account is waiting for verification by a UDC agent or admin. You can sell crops once it is verified.";
    }

    const items = [];
    d.offers.forEach(o => items.push(`
<a class="row" href="negotiations.html?id=${o.id}" style="text-decoration:none;color:inherit">
<div>
<div class="ititle">New buyer offer: ${money(o.current_offer)} per unit</div>
<div class="meta">${esc(o.crop_name)} · ${esc(o.buyer)}</div>
</div>
<span class="badge gold">New</span>
</a>`));
    d.orders.forEach(o => {
      const t = ORDER_TEXT[o.status];
      items.push(`
<a class="row" href="order-tracking.html" style="text-decoration:none;color:inherit">
<div>
<div class="ititle">${t[0]}</div>
<div class="meta">${esc(o.crop_name)} · ${Number(o.quantity).toLocaleString()} ${esc(o.unit)} · ${esc(o.buyer)}</div>
</div>
<span class="badge ${t[1]}">${esc(o.order_code)}</span>
</a>`);
    });

    document.getElementById("activity").innerHTML =
      items.slice(0, 6).join("") || "<p style='padding:14px 0'>No activity yet. Publish a crop to get started.</p>";
  } catch (err) {
    document.getElementById("activity").innerHTML = "<p>" + esc(err.message) + "</p>";
  }


  try {
    const d = await api("crop_mine.php");
    document.getElementById("myCrops").innerHTML = d.crops.length
      ? d.crops.slice(0, 5).map(c => `
<div class="row">
<div class="item">
<div class="icon">${ICONS[c.crop_name] || "🌾"}</div>
<div>
<div class="ititle">${esc(c.crop_name)}</div>
<div class="meta">${Number(c.quantity).toLocaleString()} ${esc(c.unit)} · ${esc(c.quality)}</div>
</div>
</div>
<div>
<div class="price">${money(c.price)}</div>
<span class="badge ok">Live</span>
</div>
</div>`).join("")
      : "<p style='padding:14px 0'>" + (verified ? "No live listings. Open Sell Crops to publish one." : "You can publish crops after verification.") + "</p>";
  } catch (err) {
    document.getElementById("myCrops").innerHTML = "";
  }
})();