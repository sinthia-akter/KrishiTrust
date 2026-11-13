window.pageTitle = "Portfolio";

window.portalNav = `
<a href="bank.html"><span>◉</span>Dashboard</a>
<a href="loan-applications.html"><span>💳</span>Loan Applications</a>
<a href="farmer-verification.html"><span>👨‍🌾</span>Farmer Verification</a>
<a class="active" href="portfolio.html"><span>📊</span>Portfolio</a>
`;

pageShell(`
<div class="page-head">
  <div>
    <div class="kicker">Bank Portal</div>
    <h1 class="page-title">Loan Portfolio</h1>
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
    <div class="stat-value">1.8%</div>
  </div>

</div>

<div class="grid g2" style="margin-top:15px">

  <div class="card pad">

    <div class="kicker">Type of Loans</div>
    <div class="title">Distribution of Loan Disbursement</div>

    <div class="prow">
      <div class="ptop">
        <span>Crop Production</span>
        <span>৳4.1B</span>
      </div>
      <div class="progress">
        <i style="width:82%"></i>
      </div>
    </div>

    <div class="prow">
      <div class="ptop">
        <span>Agricultural Equipment</span>
        <span>৳2.6B</span>
      </div>
      <div class="progress">
        <i style="width:58%"></i>
      </div>
    </div>

    <div class="prow">
      <div class="ptop">
        <span>Working Capital</span>
        <span>৳2.0B</span>
      </div>
      <div class="progress">
        <i style="width:46%"></i>
      </div>
    </div>

  </div>

  <div class="card pad">

    <div class="kicker">Financial Status</div>
    <div class="title">Loan Repayment</div>

    <div class="list">

      <div class="row">
        <span>On-time Repayment</span>
        <span class="badge ok">92%</span>
      </div>

      <div class="row">
        <span>Late payment</span>
        <span class="badge warn">6.4%</span>
      </div>

      <div class="row">
        <span>Non-Performing Asset</span>
        <span class="badge bad">1.6%</span>
      </div>

    </div>

  </div>

</div>
`);