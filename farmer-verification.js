(async function () {
  await loadUser();
  const role = window.currentUser?.role;
  const canVerify = role === "udc" || role === "admin";

  window.pageTitle = "Farmer Verification";

  window.portalNav = role === "udc" ? `
<a href="udc.html"><span>◉</span>Dashboard</a>
<a href="farmer-registration.html"><span>📝</span>Farmer Registration</a>
<a class="active" href="farmer-verification.html"><span>👨‍🌾</span>Farmer Verification</a>
` : `
<a href="bank.html"><span>◉</span>Dashboard</a>
<a href="loan-applications.html"><span>💳</span>Loan Applications</a>
<a class="active" href="farmer-verification.html"><span>👨‍🌾</span>Farmer Verification</a>
<a href="portfolio.html"><span>📊</span>Portfolio</a>
`;

  pageShell(`
<div class="page-head">
  <div>
    <div class="kicker">${role === "udc" ? "UDC Agent" : "Bank Portal"}</div>
    <h1 class="page-title">Farmer Verification</h1>
    <p class="page-sub">
      Verify the identity, NID, and agricultural profile of farmers.
    </p>
  </div>
</div>

<div class="grid g4">
  <div class="card stat">
    <div class="stat-label">Total Farmers</div>
    <div class="stat-value" id="sTotal">-</div>
  </div>
  <div class="card stat">
    <div class="stat-label">NID Verification</div>
    <div class="stat-value green" id="sVerified">-</div>
  </div>
  <div class="card stat">
    <div class="stat-label">Profile Complete</div>
    <div class="stat-value" id="sComplete">-</div>
  </div>
  <div class="card stat">
    <div class="stat-label">Verification Pending</div>
    <div class="stat-value gold" id="sPending">-</div>
  </div>
</div>

<div class="card" style="margin-top:15px">
  <div class="head">
    <div>
      <div class="title">List of Farmers for Verification</div>
      <div class="sub">Pending farmers are shown first</div>
    </div>
  </div>
  <div class="table">
    <table>
      <thead>
        <tr>
          <th>Farmer</th>
          <th>NID</th>
          <th>District</th>
          <th>Land Area</th>
          <th>NID Status</th>
          <th></th>
        </tr>
      </thead>
      <tbody id="farmerRows"></tbody>
    </table>
  </div>
</div>
`);

  function esc(s) {
    const d = document.createElement("div");
    d.textContent = s ?? "";
    return d.innerHTML;
  }

  const BADGE = { verified: "ok", pending: "warn", rejected: "warn" };

  function row(f) {
    const actions = (canVerify && f.status === "pending") ? `
      <button class="btn ghost" data-act="verify" data-id="${f.id}" data-hasnid="${f.has_nid ? 1 : 0}">Verify</button>
      <button class="btn dark-btn" data-act="reject" data-id="${f.id}">Reject</button>` : "";
    return `
<tr>
  <td>${esc(f.full_name)}</td>
  <td>${f.nid ? esc(f.nid) : "Not added"}</td>
  <td>${esc(f.district)}</td>
  <td>${esc(f.land_bigha)} Bigha</td>
  <td><span class="badge ${BADGE[f.status] || "warn"}">${esc(f.status)}</span></td>
  <td>${actions}</td>
</tr>`;
  }

  async function load() {
    try {
      const data = await api("farmers_list.php");
      const s = data.stats;
      const total = Number(s.total) || 0;
      document.getElementById("sTotal").textContent = total.toLocaleString();
      document.getElementById("sPending").textContent = Number(s.pending || 0).toLocaleString();
      document.getElementById("sVerified").textContent = total ? Math.round(100 * s.verified / total) + "%" : "-";
      document.getElementById("sComplete").textContent = total ? Math.round(100 * s.complete / total) + "%" : "-";
      document.getElementById("farmerRows").innerHTML =
        data.farmers.length ? data.farmers.map(row).join("") : "<tr><td colspan='6'>No farmers yet.</td></tr>";
    } catch (err) {
      showMessage(err.message);
    }
  }

  document.getElementById("farmerRows").onclick = async (e) => {
    const btn = e.target.closest("button[data-act]");
    if (!btn) return;

    const body = new URLSearchParams({ id: btn.dataset.id, action: btn.dataset.act });

    if (btn.dataset.act === "verify" && btn.dataset.hasnid === "0") {
      const nid = prompt("Enter the farmer's NID number after checking their card:");
      if (!nid) return;
      body.set("nid", nid);
    } else if (btn.dataset.act === "reject" && !confirm("Reject this farmer?")) {
      return;
    }

    btn.disabled = true;
    try {
      await api("farmer_verify.php", body);
      load();
    } catch (err) {
      showMessage(err.message);
      btn.disabled = false;
    }
  };

  load();
})();