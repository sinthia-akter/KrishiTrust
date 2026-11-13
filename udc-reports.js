(async function () {
  await loadUser();

  window.pageTitle = "Reports";

  window.portalNav = `
<a href="udc.html"><span>◉</span>Dashboard</a>
<a href="farmer-registration.html"><span>👨‍🌾</span>Farmer Registration</a>
<a href="farmer-verification.html"><span>✓</span>Farmer Verification</a>
<a href="udc-applications.html"><span>📄</span>Applications</a>
<a class="active" href="udc-reports.html"><span>📊</span>Reports</a>
`;

  pageShell(`
<div class="page-head">
<div>
<div class="kicker">UDC Agent</div>
<h1 class="page-title">Monthly Service Report</h1>
<p class="page-sub">
Report on UDC's farmer services and registration activity.
</p>
</div>
</div>

<div class="grid g4">

<div class="card stat">
<div class="stat-label">Farmers Registered</div>
<div class="stat-value" id="sTotal">-</div>
<div class="note">By you, all time</div>
</div>

<div class="card stat">
<div class="stat-label">New Registrations</div>
<div class="stat-value green" id="sMonth">-</div>
<div class="note">This month</div>
</div>

<div class="card stat">
<div class="stat-label">Waiting Verification</div>
<div class="stat-value" id="sPending">-</div>
<div class="note"><a href="farmer-verification.html" style="text-decoration:underline">Open verification list</a></div>
</div>

<div class="card stat">
<div class="stat-label">Activation Rate</div>
<div class="stat-value gold" id="sActive">-</div>
<div class="note" id="nActive">Farmers who published a crop</div>
</div>

</div>

<div class="grid g2" style="margin-top:15px">

<div class="card pad">
<div class="kicker">Service Efficiency</div>
<div class="title">Monthly Progress</div>
<div id="trend"></div>
</div>

<div class="card pad">
<div class="kicker">Coverage</div>
<div class="title">Top Districts</div>
<div id="districts"></div>
</div>

</div>
`);

  function esc(s) {
    const d = document.createElement("div");
    d.textContent = s ?? "";
    return d.innerHTML;
  }
  const $ = id => document.getElementById(id);
  const pct = (a, b) => b ? Math.round(100 * a / b) : 0;
  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const monthName = ym => MONTHS[Number(ym.slice(5, 7)) - 1] + " " + ym.slice(0, 4);

  try {
    const d = await api("udc_report.php");

    $("sTotal").textContent = d.total.toLocaleString();
    $("sMonth").textContent = d.month.toLocaleString();
    $("sPending").textContent = d.pending.toLocaleString();
    $("sActive").textContent = d.total ? pct(d.active, d.total) + "%" : "-";
    $("nActive").textContent = d.active + " of " + d.total + " farmers published a crop";

    const now = new Date();
    const rows = [];
    for (let i = 5; i >= 0; i--) {
      const dt = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const ym = dt.getFullYear() + "-" + String(dt.getMonth() + 1).padStart(2, "0");
      const hit = d.monthly.find(m => m.m === ym);
      rows.push({ ym, n: hit ? Number(hit.n) : 0 });
    }
    const max = Math.max(...rows.map(r => r.n), 1);
    $("trend").innerHTML = rows.map(r => `
<div class="prow">
<div class="ptop"><span>${monthName(r.ym)}</span><span>${r.n}</span></div>
<div class="progress"><i style="width:${pct(r.n, max)}%"></i></div>
</div>`).join("");

    $("districts").innerHTML = d.districts.length ? d.districts.map(r => `
<div class="prow">
<div class="ptop"><span>${esc(r.district)}</span><span>${r.n} · ${pct(r.n, d.total)}%</span></div>
<div class="progress"><i style="width:${pct(r.n, d.total)}%"></i></div>
</div>`).join("") : "<p style='padding:14px 0'>No farmers registered yet.</p>";
  } catch (err) {
    $("trend").innerHTML = "<p>" + esc(err.message) + "</p>";
  }
})();