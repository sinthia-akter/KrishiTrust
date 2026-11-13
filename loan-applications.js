window.pageTitle = "Loan Applications";
window.portalNav = `
<a href="bank.html"><span>◉</span>Dashboard</a>
<a class="active" href="loan-applications.html"><span>💳</span>Loan Applications</a>
<a href="farmer-verification.html"><span>👨‍🌾</span>Farmer Verification</a>
<a href="portfolio.html"><span>📊</span>Portfolio</a>
`;

pageShell(`
<div class="page-head">
  <div>
    <div class="kicker">Bank Portal</div>
    <h1 class="page-title">Loan Applications</h1>
    <p class="page-sub">
      Review and manage loan applications submitted by farmers.
    </p>
  </div>
</div>

<div class="grid g4">

  <div class="card stat">
    <div class="stat-label">Total Applications</div>
    <div class="stat-value">186</div>
    <div class="note">This Month</div>
  </div>

  <div class="card stat">
    <div class="stat-label">Pending</div>
    <div class="stat-value">24</div>
    <div class="note">Review Required</div>
  </div>

  <div class="card stat">
    <div class="stat-label">Approved</div>
    <div class="stat-value green">142</div>
    <div class="note">76% Approval Rate</div>
  </div>

  <div class="card stat">
    <div class="stat-label">Rejected</div>
    <div class="stat-value red">20</div>
    <div class="note">This Month</div>
  </div>

</div>

<div class="card" style="margin-top:15px">

  <div class="head">
    <div>
      <div class="title">Recent Loan Applications</div>
      <div class="sub">Details of applicants</div>
    </div>
  </div>

  <div class="table">

    <table>

      <thead>
        <tr>
          <th>Applicant</th>
          <th>Division</th>
          <th>Purpose</th>
          <th>Amount</th>
          <th>Risk</th>
          <th>Status</th>
          <th></th>
        </tr>
      </thead>

      <tbody>

        <tr>
          <td>rafiq islam</td>
          <td>Sylhet</td>
          <td>Crop Production</td>
          <td>৳250,000</td>
          <td>Low</td>
          <td><span class="badge warn">Pending</span></td>
          <td>
            <button class="btn ghost"
              onclick="showMessage('The application has been opened for review')">
              Review
            </button>
          </td>
        </tr>

        <tr>
          <td>Sumaiya Begum</td>
          <td>Rangpur</td>
          <td>Working Capital</td>
          <td>৳180,000</td>
          <td>Low</td>
          <td><span class="badge ok">Approved</span></td>
          <td>
            <button class="btn dark-btn">Details</button>
          </td>
        </tr>

        <tr>
          <td>Jobbar ali</td>
          <td>Mymensingh</td>
          <td>Agricultural Equipment</td>
          <td>৳420,000</td>
          <td>Medium</td>
          <td><span class="badge warn">Pending</span></td>
          <td>
            <button class="btn ghost">Review</button>
          </td>
        </tr>

      </tbody>

    </table>

  </div>

</div>
`);