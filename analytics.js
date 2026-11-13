(async function () {
  await loadUser();

  window.pageTitle = "Analytics | KrishiTrust Admin Portal";

  window.portalNav = `
<a href="admin.html"><span>◉</span>Admin Overview</a>
<a href="user-management.html"><span>👤</span>User Management</a>
<a href="store-registry.html"><span>🏪</span>Store Registry</a>
<a href="loan-oversight.html"><span>💳</span>Loan Oversight</a>
<a class="active" href="analytics.html"><span>📈</span>Analytics</a>
<a href="system-health.html"><span>⚙️</span>System Health</a>
`;

  pageShell(`
<div class="page-head">
<div>
<div class="kicker">Admin</div>
<h1 class="page-title">Platform Analytics</h1>
<p class="page-sub">
Analysis of transactions, agricultural products, and user activities on KrishiTrust.
</p>
</div>
</div>

<div class="grid g3">

<div class="card stat">
<div class="stat-label">Monthly Transaction</div>
<div class="stat-value gold" id="sMonth">-</div>
<div class="note" id="nPeak">&nbsp;</div>
</div>

<div class="card stat">
<div class="stat-label">Marketplace Conversion</div>
<div class="stat-value" id="sConv">-</div>
<div class="note" id="nConv">Listings that got an order</div>
</div>

<div class="card stat">
<div class="stat-label">Order Completion</div>
<div class="stat-value green" id="sDone">-</div>
<div class="note" id="nDone">Orders delivered</div>
</div>

</div>

<div class="grid g2" style="margin-top:15px">

<div class="card pad">
<div class="kicker">Top Crops</div>
<div class="title">By Transaction Volume</div>
<div class="list" id="crops"></div>
</div>

<div class="card pad">
<div class="kicker">User</div>
<div class="title">Role-based Distribution</div>
<div id="roles"></div>
</div>

</div>

<div class="card pad" style="margin-top:15px">
<div class="kicker">Trend</div>
<div class="title">Order value, last 6 months</div>
<div id="trend"></div>
</div>
`);

  function esc(s) {
    const d = document.createElement("div");
    d.textContent = s ?? "";
    return d.innerHTML;
  }
  const $ = id => document.getElementById(id);
  const money = n => "৳" + Math.round(Number(n)).toLocaleString();
  const pct = (a, b) => b ? Math.round(100 * a / b) : 0;
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const monthName = ym => MONTHS[Number(ym.slice(5, 7)) - 1] + " " + ym.slice(0, 4);

  try {
    const d = await api("analytics_stats.php");

    $("sMonth").textContent = money(d.this_month);
    $("nPeak").textContent = d.peak ? "Peak: " + monthName(d.peak.m) + " (" + money(d.peak.value) + ")" : "No orders yet";

    const c = d.conversion;
    $("sConv").textContent = c.listed ? pct(c.ordered, c.listed) + "%" : "-";
    $("nConv").textContent = c.ordered + " of " + c.listed + " listings got an order";

    const k = d.completion;
    $("sDone").textContent = k.orders ? pct(k.delivered, k.orders) + "%" : "-";
    $("nDone").textContent = k.delivered + " of " + k.orders + " orders delivered";

    $("crops").innerHTML = d.crops.length ? d.crops.map(r => `
<div class="row">
<span>${esc(r.crop_name)} <span class="meta">· ${r.orders} order${r.orders == 1 ? "" : "s"}</span></span>
<b>${money(r.value)}</b>
</div>`).join("") : "<p style='padding:14px 0'>No orders yet.</p>";

    const total = d.roles.reduce((s, r) => s + Number(r.n), 0);
    $("roles").innerHTML = d.roles.length ? d.roles.map(r => {
      const p = pct(r.n, total);
      return `
<div class="prow">
<div class="ptop"><span>${esc(cap(r.role))} <span class="meta">· ${r.n}</span></span><span>${p}%</span></div>
<div class="progress"><i style="width:${p}%"></i></div>
</div>`;
    }).join("") : "<p style='padding:14px 0'>No users yet.</p>";

    const now = new Date();
    const rows = [];
    for (let i = 5; i >= 0; i--) {
      const dt = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const ym = dt.getFullYear() + "-" + String(dt.getMonth() + 1).padStart(2, "0");
      const hit = d.monthly.find(m => m.m === ym);
      rows.push({ ym, value: hit ? Number(hit.value) : 0 });
    }
    const max = Math.max(...rows.map(r => r.value), 1);
    $("trend").innerHTML = rows.map(r => `
<div class="prow">
<div class="ptop"><span>${monthName(r.ym)}</span><span>${money(r.value)}</span></div>
<div class="progress"><i style="width:${pct(r.value, max)}%"></i></div>
</div>`).join("");
  } catch (err) {
    $("crops").innerHTML = "<p>" + esc(err.message) + "</p>";
  }
})();