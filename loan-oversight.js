window.pageTitle = "Loan Oversight";

window.portalNav = `
<a href="admin.html"><span>◉</span>Admin Oversight</a>
<a href="user-management.html"><span>👤</span>User Management</a>
<a href="store-registry.html"><span>🏪</span>Store Registry</a>
<a class="active" href="loan-oversight.html"><span>💳</span>Loan Oversight</a>
<a href="analytics.html"><span>📈</span>Analytics</a>
<a href="system-health.html"><span>⚙️</span>System Health</a>
`;

pageShell(`
<div class="page-head">
<div>
<div class="kicker">Admin</div>
<h1 class="page-title">Loan Oversight</h1>
<p class="page-sub">
A comprehensive view of all agricultural loan operations across banks.
</p>
</div>
</div>

<div class="grid g4">

<div class="card stat">
<div class="stat-label">Total Disbursement</div>
<div class="stat-value gold">৳18.7B</div>
</div>

<div class="card stat">
<div class="stat-label">Active Loans</div>
<div class="stat-value">84.2K</div>
</div>

<div class="card stat">
<div class="stat-label">Repayment Rate</div>
<div class="stat-value green">96.4%</div>
</div>

<div class="card stat">
<div class="stat-label">NPA Ratio</div>
<div class="stat-value red">1.8%</div>
</div>

</div>

<div class="card pad" style="margin-top:15px">

<div class="kicker">Bank Performance</div>
<div class="title">Loan Operation Comparison</div>

<div class="prow">
<div class="ptop">
<span>Bank A</span>
<span>৳7.2B</span>
</div>
<div class="progress">
<i style="width:88%"></i>
</div>
</div>

<div class="prow">
<div class="ptop">
<span>Bank B</span>
<span>৳6.1B</span>
</div>
<div class="progress">
<i style="width:74%"></i>
</div>
</div>

<div class="prow">
<div class="ptop">
<span>Bank C</span>
<span>৳5.4B</span>
</div>
<div class="progress">
<i style="width:66%"></i>
</div>
</div>

</div>
`);