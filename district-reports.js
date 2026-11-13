window.pageTitle = "District Reports";

window.portalNav = `
<a href="government.html"><span>◉</span>Overview</a>
<a href="disaster-management.html"><span>🌊</span>Disaster Management</a>
<a href="subsidy-allocation.html"><span>💰</span>Subsidy Allocation</a>
<a href="store-inspection.html"><span>🏪</span>Store Inspection</a>
<a class="active" href="district-reports.html"><span>📊</span>District Reports</a>
<a href="issue-notice.html"><span>📣</span>Issue Notice</a>
`;

pageShell(`
<div class="page-head">
<div>
<div class="kicker">Government Portal</div>
<h1 class="page-title">District Performance Reports</h1>
<p class="page-sub">
Farmer, transaction, and relief activities by district.
</p>
</div>
</div>

<div class="card">

<div class="table">

<table>

<thead>
<tr>
<th>District</th>
<th>Farmers</th>
<th>Transactions</th>
<th>Relief Cases</th>
<th>Performance</th>
</tr>
</thead>

<tbody>

<tr>
<td>Sylhet</td>
<td>184,220</td>
<td>32,480</td>
<td>12,480</td>
<td><span class="badge ok">Strong</span></td>
</tr>

<tr>
<td>Rangpur
<td>210,540</td>
<td>39,820</td>
<td>2,120</td>
<td><span class="badge ok">Strong</span></td>
</tr>

<tr>
<td>Mymensingh
<td>225,110</td>
<td>41,200</td>
<td>3,980</td>
<td><span class="badge gold-badge">Stable</span></td>
</tr>

</tbody>

</table>

</div>

</div>
`);