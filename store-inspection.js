window.pageTitle = "Store Inspection";

window.portalNav = `
<a href="government.html"><span>◉</span>Overview</a>
<a href="disaster-management.html"><span>🌊</span>Disaster Management</a>
<a href="subsidy-allocation.html"><span>💰</span>Subsidy Allocation</a>
<a class="active" href="store-inspection.html"><span>🏪</span>Store Inspection</a>
<a href="district-reports.html"><span>📊</span>District Reports</a>
<a href="issue-notice.html"><span>📣</span>Issue Notice</a>
`;

pageShell(`
<div class="page-head">
<div>
<div class="kicker">Government Portal</div>
<h1 class="page-title">Store Inspection</h1>
<p class="page-sub">
Inspection of registered agricultural shops and input suppliers
</p>
</div>
</div>

<div class="grid g3">

<div class="card stat">
<div class="stat-label">Registered Stores</div>
<div class="stat-value">98,400</div>
</div>

<div class="card stat">
<div class="stat-label">Inspected</div>
<div class="stat-value green">96,820</div>
</div>

<div class="card stat">
<div class="stat-label">Pending Inspection</div>
<div class="stat-value red">184</div>
</div>

</div>

<div class="card" style="margin-top:15px">

<div class="head">
<div>
<div class="title">Stores Requiring Inspection</div>
<div class="sub">Pending inspection</div>
</div>
</div>

<div class="table">

<table>

<thead>
<tr>
<th>Store Name</th>
<th>District</th>
<th>Reason</th>
<th>Status</th>
<th></th>
</tr>
</thead>

<tbody>

<tr>
<td>Mymensingh Agro Supply</td>
<td>Mymensingh</td>
<td>Price Complaint</td>
<td><span class="badge bad">Flagged</span></td>
<td><button class="btn ghost">Inspect</button></td>
</tr>

<tr>
<td>Rangpur Farm Inputs</td>
<td>Rangpur</td>
<td>Product Verification</td>
<td><span class="badge bad">Flagged</span></td>
<td><button class="btn ghost">Inspect</button></td>
</tr>

</tbody>

</table>

</div>

</div>
`);