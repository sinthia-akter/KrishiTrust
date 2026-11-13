(async function () {
  await loadUser();

  window.pageTitle = "Applications";

  window.portalNav = `
<a href="udc.html"><span>◉</span>Dashboard</a>
<a href="farmer-registration.html"><span>👨‍🌾</span>Farmer Registration</a>
<a href="farmer-verification.html"><span>✓</span>Farmer Verification</a>
<a class="active" href="udc-applications.html"><span>📄</span>Applications</a>
<a href="udc-reports.html"><span>📊</span>Reports</a>
`;

  pageShell(`
<div class="page-head">
<div>
<div class="kicker">UDC Agent</div>
<h1 class="page-title">Service Applications</h1>
<p class="page-sub">
Recent applications assisted by UDC
</p>
</div>
</div>

<div class="card">

<div class="table">

<table>

<thead>
<tr>
<th>Applicant</th>
<th>Service</th>
<th>Application ID</th>
<th>Date</th>
<th>Status</th>
<th></th>
</tr>
</thead>

<tbody id="rows"></tbody>

</table>

</div>

</div>
`);

  function esc(s) {
    const d = document.createElement("div");
    d.textContent = s ?? "";
    return d.innerHTML;
  }

  const STATUS = {
    verified: ["ok", "Completed"],
    pending:  ["warn", "Pending"],
    rejected: ["bad", "Rejected"],
  };

  function when(ts) {
    const day = (ts || "").slice(0, 10);
    const fmt = d => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    const now = new Date();
    const yest = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    return day === fmt(now) ? "Today" : day === fmt(yest) ? "Yesterday" : day;
  }

  let list = [];

  try {
    const d = await api("udc_applications.php");
    list = d.applications;

    document.getElementById("rows").innerHTML = list.length ? list.map((a, i) => {
      const st = STATUS[a.status] || ["warn", a.status];
      const mine = Number(a.mine) === 1;
      const action = !mine && a.status === "pending"
        ? `<a class="btn gold-btn" href="farmer-verification.html">Verify</a>`
        : `<button class="btn dark-btn" data-i="${i}">Details</button>`;
      return `
<tr>
<td>${esc(a.full_name)}</td>
<td>${mine ? "Farmer Registration" : "Farmer Verification"}</td>
<td>${esc(a.farmer_code || "-")}</td>
<td>${esc(when(a.created_at))}</td>
<td><span class="badge ${st[0]}">${st[1]}</span></td>
<td>${action}</td>
</tr>`;
    }).join("") : "<tr><td colspan='6'>No applications yet.</td></tr>";
  } catch (err) {
    document.getElementById("rows").innerHTML = "<tr><td colspan='6'>" + esc(err.message) + "</td></tr>";
  }

  document.getElementById("rows").onclick = (e) => {
    const b = e.target.closest("button[data-i]");
    if (!b) return;
    const a = list[b.dataset.i];
    alert(
      a.full_name + " · " + (a.farmer_code || "") + "\n\n" +
      "Status: " + a.status + "\n" +
      "NID: " + (a.nid || "Not added") + "\n" +
      "District: " + a.district + (a.union_name ? " · " + a.union_name : "") + "\n" +
      "Land: " + a.land_bigha + " Bigha\n" +
      "Main crop: " + (a.primary_crop || "-") + "\n" +
      "Registered: " + (a.created_at || "").slice(0, 10)
    );
  };
})();