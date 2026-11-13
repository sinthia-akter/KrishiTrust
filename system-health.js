(async function () {
  await loadUser();

  window.pageTitle = "System Health";

  window.portalNav = `
<a href="admin.html"><span>◉</span>Admin Overview</a>
<a href="user-management.html"><span>👤</span>User Management</a>
<a href="store-registry.html"><span>🏪</span>Store Registry</a>
<a href="loan-oversight.html"><span>💳</span>Loan Oversight</a>
<a href="analytics.html"><span>📈</span>Analytics</a>
<a class="active" href="system-health.html"><span>⚙️</span>System Health</a>
`;

  pageShell(`
<div class="page-head">
<div>
<div class="kicker">Admin</div>
<h1 class="page-title">System Health</h1>
<p class="page-sub">
Monitoring of KrishiTrust platform's server and service status.
</p>
</div>
<button class="btn ghost-gold" id="refresh">Refresh now</button>
</div>

<div class="grid g4">

<div class="card stat">
<div class="stat-label">Database Uptime</div>
<div class="stat-value green" id="sUp">-</div>
<div class="note">Since MySQL started</div>
</div>

<div class="card stat">
<div class="stat-label">API Response</div>
<div class="stat-value" id="sApi">-</div>
<div class="note">Round trip from your browser</div>
</div>

<div class="card stat">
<div class="stat-label">Database Size</div>
<div class="stat-value" id="sSize">-</div>
<div class="note">Data and indexes</div>
</div>

<div class="card stat">
<div class="stat-label">DB Connections</div>
<div class="stat-value" id="sConn">-</div>
<div class="note">Open right now</div>
</div>

</div>

<div class="grid g2" style="margin-top:15px">

<div class="card pad">
<div class="kicker">Services</div>
<div class="title">Service Status</div>
<div class="list" id="services"></div>
</div>

<div class="card pad">
<div class="kicker">Activity</div>
<div class="title">Last 24 Hours</div>
<div class="list" id="activity"></div>
</div>

</div>

<div class="card pad" style="margin-top:15px">
<div class="kicker">Database</div>
<div class="title">Data Tables</div>
<div class="list" id="tables"></div>
<div class="meta" id="foot" style="margin-top:12px"></div>
</div>
`);

  function esc(s) {
    const d = document.createElement("div");
    d.textContent = s ?? "";
    return d.innerHTML;
  }
  const $ = id => document.getElementById(id);

  function uptime(sec) {
    const d = Math.floor(sec / 86400), h = Math.floor(sec % 86400 / 3600), m = Math.floor(sec % 3600 / 60);
    return d ? d + "d " + h + "h" : h ? h + "h " + m + "m" : m + "m";
  }

  const row = (title, note, badge, text) => `
<div class="row">
<div><div class="ititle">${esc(title)}</div><div class="meta">${esc(note)}</div></div>
<span class="badge ${badge}">${esc(text)}</span>
</div>`;

  async function load() {
    const t0 = performance.now();
    try {
      const d = await api("system_health.php");
      const rt = Math.round(performance.now() - t0);

      $("sUp").textContent = uptime(d.uptime);
      $("sApi").textContent = rt + " ms";
      $("sSize").textContent = d.size_mb + " MB";
      $("sConn").textContent = d.threads;

      const missing = d.tables.filter(t => t.rows === null).length;

      $("services").innerHTML =
        row("API Server", "PHP " + d.php, "ok", "Active") +
        row("Database", "MySQL " + d.mysql + " · query " + d.db_ms + " ms",
            d.db_ms > 500 ? "warn" : "ok", d.db_ms > 500 ? "Slow" : "Active") +
        row("Data Tables", d.tables.length + " checked",
            missing ? "bad" : "ok", missing ? missing + " missing" : "All present") +
        row("Marketplace", d.live + " live listings · " + d.stores + " verified stores", "ok", "Active") +
        row("Payment Gateway", "Not built yet", "warn", "Not connected") +
        row("Government Sync", "Not built yet", "warn", "Not connected") +
        row("Bank Integration", "Not built yet", "warn", "Not connected");

      $("activity").innerHTML =
        row("New accounts", "Registered in the last 24 hours", "gold", d.day.users) +
        row("Orders placed", "Including bulk order shares", "gold", d.day.orders) +
        row("Negotiation messages", "Messages, offers and acceptances", "gold", d.day.messages);

      $("tables").innerHTML = d.tables.map(t =>
        t.rows === null
          ? row(t.name, "This table does not exist. Run its CREATE TABLE SQL", "bad", "Missing")
          : row(t.name, "Rows stored", "ok", t.rows.toLocaleString())
      ).join("");

      $("foot").textContent = "Server time " + d.time + " · refreshes every 15 seconds";
    } catch (err) {
      $("services").innerHTML = row("API Server", err.message, "bad", "Error");
    }
  }

  $("refresh").onclick = load;
  load();
  setInterval(load, 15000);
})();