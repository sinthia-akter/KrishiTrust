window.pageTitle = "Subsidy Allocation";

window.portalNav = `
<a href="government.html"><span>◉</span>Overview</a>
<a href="disaster-management.html"><span>🌊</span>Disaster Management</a>
<a class="active" href="subsidy-allocation.html"><span>💰</span>Subsidy Allocation</a>
<a href="store-inspection.html"><span>🏪</span>Store Inspection</a>
<a href="district-reports.html"><span>📊</span>District Reports</a>
<a href="issue-notice.html"><span>📣</span>Issue Notice</a>
`;

pageShell(`
<div class="page-head">
<div>
<div class="kicker">Government Portal</div>
<h1 class="page-title">Subsidy Allocation</h1>
<p class="page-sub">
Allocation and monitoring of government subsidy schemes for farmers.
</p>
</div>
</div>

<div class="grid g3">

<div class="card stat">
<div class="stat-label">Total Allocation</div>
<div class="stat-value gold">৳3.8B</div>
</div>

<div class="card stat">
<div class="stat-label">Disbursement</div>
<div class="stat-value green">৳3.1B</div>
</div>

<div class="card stat">
<div class="stat-label">Remaining</div>
<div class="stat-value">৳700M</div>
</div>

</div>

<div class="card" style="margin-top:15px">

<div class="head">
<div>
<div class="title">Subsidy Schemes</div>
<div class="sub">Active Government Agricultural Schemes</div>
</div>
</div>

<div class="table">

<table>

<thead>
<tr>
<th>Scheme</th>
<th>Allocation</th>
<th>Disbursement</th>
<th>Status</th>
</tr>
</thead>

<tbody>

<tr>
<td>Fertilizer subsidy</td>
<td>৳1.8B</td>
<td>৳1.5B</td>
<td><span class="badge ok">Active</span></td>
</tr>

<tr>
<td>Seed subsidy</td>
<td>৳820M</td>
<td>৳680M</td>
<td><span class="badge ok">Active</span></td>
</tr>

<tr>
<td>Diesel subsidy</td>
<td>৳540M</td>
<td>৳420M</td>
<td><span class="badge warn">Disbursement in progress</span></td>
</tr>

</tbody>

</table>

</div>

</div>
`);