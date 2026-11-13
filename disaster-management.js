window.pageTitle = "Disaster Management";

window.portalNav = `
<a href="government.html"><span>◉</span>Overview</a>
<a class="active" href="disaster-management.html"><span>🌊</span>Disaster Management</a>
<a href="subsidy-allocation.html"><span>💰</span>Subsidy Allocation</a>
<a href="store-inspection.html"><span>🏪</span>Store Inspection</a>
<a href="district-reports.html"><span>📊</span>District Reports</a>
<a href="issue-notice.html"><span>📣</span>Issue Notice</a>
`;

pageShell(`
<div class="page-head">
  <div>
    <div class="kicker">Government Portal</div>
    <h1 class="page-title">Disaster Management</h1>
    <p class="page-sub">
      Monitoring agricultural disasters, damages, and relief operations.
    </p>
  </div>
</div>

<div class="grid g4">

<div class="card stat">
<div class="stat-label">Active Disasters</div>
<div class="stat-value orange">8</div>
</div>

<div class="card stat">
<div class="stat-label">Affected Farmers</div>
<div class="stat-value">48.2K</div>
</div>

<div class="card stat">
<div class="stat-label">Damage Reports</div>
<div class="stat-value">12,480</div>
</div>

<div class="card stat">
<div class="stat-label">Relief Allocation</div>
<div class="stat-value gold">৳620M</div>
</div>

</div>

<div class="grid g2" style="margin-top:15px">

<div class="card pad">

<div class="kicker">🌊 Active Disasters</div>
<div class="title">Flood in Sylhet Division</div>

<p class="sub">
48,200 farmers affected · Relief operations underway.
</p>

<div class="alert gold-alert" style="margin-top:15px">
12,480 damage reports pending verification.
</div>

</div>

<div class="card pad">

<div class="kicker">Relief Fund</div>
<div class="title">Current Status</div>

<div class="list">

<div class="row">
<span>Total Allocation</span>
<b>৳620M</b>
</div>

<div class="row">
<span>Committed</span>
<b>৳410M</b>
</div>

<div class="row">
<span>Remaining</span>
<b>৳210M</b>
</div>

</div>

</div>

</div>
`);