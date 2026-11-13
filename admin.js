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
          <span class="brand-sub">Administration</span>
        </div>
      </a>

      <div class="nav-label">Workspace</div>

      <nav class="nav">
        <a class="active" href="admin.html"><span>◉</span>Admin Overview</a>
        <a href="user-management.html"><span>👤</span>User Management</a>
        <a href="farmer-verification.html"><span>👨‍🌾</span>Farmer Verification</a>
        <a href="store-registry.html"><span>🏪</span>Store Registry</a>
        <a href="loan-oversight.html"><span>💳</span>Loan Oversight</a>
        <a href="analytics.html"><span>📈</span>Analytics</a>
        <a href="system-health.html"><span>⚙️</span>System Health</a>
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
          <div class="crumb">Administration / <b>KrishiTrust Platform Administration</b></div>
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
            <h1 class="page-title">KrishiTrust Platform Administration</h1>
            <p class="page-sub">Monitor users, transactions, loans, analytics and system health.</p>
          </div>
          <div></div>
        </div>

        <div class="grid g4">
          <div class="card stat">
            <div class="stat-label">Total Users</div>
            <div class="stat-value" id="sUsers">-</div>
            <div class="note" id="nUsers">&nbsp;</div>
          </div>
          <div class="card stat">
            <div class="stat-label">Orders This Month</div>
            <div class="stat-value gold" id="sOrders">-</div>
            <div class="note">Cancelled excluded</div>
          </div>
          <div class="card stat">
            <div class="stat-label">Pending Farmers</div>
            <div class="stat-value" id="sPending">-</div>
            <div class="note">Waiting for verification</div>
          </div>
          <div class="card stat">
            <div class="stat-label">Live Listings</div>
            <div class="stat-value green" id="sListings">-</div>
            <div class="note">Crops on sale now</div>
          </div>
        </div>

        <div class="grid g2" style="margin-top:15px">

          <div class="card pad">
            <div class="kicker">Platform alerts</div>
            <div class="title">Active Alerts</div>
            <div class="list" id="alerts"></div>
          </div>

          <div class="card pad" id="health">
            <div class="kicker">Platform health</div>
            <div class="title">Service Status</div>
            <div class="list" id="services"></div>
          </div>

        </div>

        <div class="card" id="users" style="margin-top:15px">

          <div class="head">
            <div>
              <div class="title">User Management</div>
              <div class="sub">Newest registered platform participants</div>
            </div>
            <a class="btn gold-btn" href="user-management.html">Manage Users →</a>
          </div>

          <div class="table">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>District</th>
                  <th>Joined</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody id="userRows"></tbody>
            </table>
          </div>

        </div>

        <div class="grid g3" style="margin-top:15px">

          <div class="card pad" id="stores">
            <div class="kicker">Store Registry</div>
            <div class="stat-value" id="sStores">-</div>
            <div class="note">Verified stores</div>
          </div>

          <div class="card pad" id="loans">
            <div class="kicker">Loan Oversight</div>
            <div class="stat-value gold">—</div>
            <div class="note">Loan module not connected yet</div>
          </div>

          <div class="card pad" id="analytics">
            <div class="kicker">Monthly Transaction Volume</div>
            <div class="stat-value" id="sVolume">-</div>
            <div class="note">Order value this month</div>
          </div>

        </div>

        <div class="card pad" style="margin-top:15px">

          <div class="kicker">Platform KPIs</div>

          <div class="grid g4">
            <div class="card stat">
              <div class="stat-label">Farmers Verified</div>
              <div class="stat-value" id="kFarmers">-</div>
            </div>
            <div class="card stat">
              <div class="stat-label">Negotiations Accepted</div>
              <div class="stat-value green" id="kNeg">-</div>
            </div>
            <div class="card stat">
              <div class="stat-label">Orders Delivered</div>
              <div class="stat-value" id="kDelivered">-</div>
            </div>
            <div class="card stat">
              <div class="stat-label">Registered Buyers</div>
              <div class="stat-value gold" id="kBuyers">-</div>
            </div>
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
  const pct = (a, b) => b ? Math.round(100 * a / b) + "%" : "-";
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const STATUS = { active: "ok", pending: "warn", blocked: "bad" };

  let alertCount = 0;
  document.getElementById("bell").onclick = () => {
    alert(alertCount ? alertCount + " alert(s) need attention. See Active Alerts." : "No new notifications");
  };

  try {
    const d = await api("admin_stats.php");
    const s = d.stats;

    document.getElementById("sUsers").textContent = s.users.toLocaleString();
    document.getElementById("nUsers").textContent = s.farmers + " farmers · " + s.buyers + " buyers";
    document.getElementById("sOrders").textContent = s.orders_month.toLocaleString();
    document.getElementById("sPending").textContent = s.pending_farmers.toLocaleString();
    document.getElementById("sListings").textContent = s.live_listings.toLocaleString();

    document.getElementById("sStores").textContent = s.stores.toLocaleString();
    document.getElementById("sVolume").textContent = money(s.volume_month);

    document.getElementById("kFarmers").textContent = pct(s.verified_farmers, s.total_farmers);
    document.getElementById("kNeg").textContent = pct(s.accepted_negs, s.negotiations);
    document.getElementById("kDelivered").textContent = pct(s.orders_delivered, s.orders_total);
    document.getElementById("kBuyers").textContent = s.buyers.toLocaleString();

  
    const alerts = [];
    if (s.pending_farmers) alerts.push([s.pending_farmers + " farmer(s) waiting for verification", "warn", "Medium", "farmer-verification.html"]);
    if (s.waiting_orders)  alerts.push([s.waiting_orders + " order(s) unconfirmed for over 2 days", "bad", "High", ""]);
    if (s.blocked)         alerts.push([s.blocked + " blocked account(s)", "warn", "Info", "user-management.html"]);
    alertCount = alerts.length;
    document.getElementById("alerts").innerHTML = alerts.length
      ? alerts.map(a => `
<${a[3] ? "a" : "div"} class="row" ${a[3] ? `href="${a[3]}"` : ""} style="text-decoration:none;color:inherit">
<span>${esc(a[0])}</span>
<span class="badge ${a[1]}">${a[2]}</span>
</${a[3] ? "a" : "div"}>`).join("")
      : "<p style='padding:14px 0'>No alerts. Everything looks fine.</p>";

  
    document.getElementById("services").innerHTML = `
<div class="row"><span>API and Database</span><span class="badge ok">Operational</span></div>
<div class="row"><span>Marketplace</span><span class="badge ok">${s.live_listings} live listings</span></div>`;


    document.getElementById("userRows").innerHTML = d.users.length ? d.users.map(u => `
<tr>
<td>${esc(u.name)}</td>
<td>${esc(cap(u.role))}</td>
<td>${esc(u.district)}</td>
<td>${esc((u.created_at || "").slice(0, 10))}</td>
<td><span class="badge ${STATUS[u.status] || "warn"}">${esc(cap(u.status))}</span></td>
</tr>`).join("") : "<tr><td colspan='5'>No users yet.</td></tr>";
  } catch (err) {
    document.getElementById("alerts").innerHTML = "<p>" + esc(err.message) + "</p>";
  }
})();