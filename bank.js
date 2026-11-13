const body = document.body;

body.innerHTML = `
<div class="app">
  <div class="layout">

    <div class="overlay" id="overlay"></div>

    <aside class="sidebar" id="side">

      <a class="brand" href="index.html">
        <div class="brand-mark">KT</div>
        <div>
          <div class="brand-text">KrishiTrust</div>
          <span class="brand-sub">Agricultural Service Platform</span>
        </div>
      </a>

      <div class="nav-label">Workspace</div>

      <nav class="nav">
        <a class="active" href="bank.html">
          <span>◉</span>Dashboard
        </a>

        <a class="active" href="loan-applications.html">
          <span>💳</span>Loan Applications
        </a>

        <a class="active" href="farmer-verification.html">
          <span>👨‍🌾</span>Farmer Verification
        </a>

        <a class="active" href="portfolio.html">
          <span>📊</span>Portfolio
        </a>
      </nav>

      <div class="side-footer">
        Secure agricultural intelligence platform<br>
        <span class="green">● System operational</span>
      </div>

    </aside>

    <section class="main">

      <header class="topbar">

        <div class="top-left">
          <button class="menu-btn" id="menu">☰</button>

          <div class="crumb">
            Bank Portal / <b>Bank Dashboard</b>
          </div>
        </div>

        <div class="top-right">
        <button id="themeToggle" type="button" class="theme-toggle" aria-label="Toggle theme">
  🌙
</button>
          <button class="icon-btn"
            onclick="alert('No new notifications')">
            🔔
          </button>

          <div class="avatar">NP</div>
        </div>

      </header>

      <main class="page">

        <div class="page-head">

          <div>
            <div class="kicker">KrishiTrust Platform</div>

            <h1 class="page-title">
              Bank Dashboard
            </h1>

            <p class="page-sub">
              Institutional agricultural finance and farmer credit oversight.
            </p>
          </div>

          <div></div>

        </div>

        <div class="grid g4">

          <div class="card stat">
            <div class="stat-label">Applications</div>
            <div class="stat-value">186</div>
            <div class="note">This month</div>
          </div>

          <div class="card stat">
            <div class="stat-label">Approved</div>
            <div class="stat-value green">142</div>
            <div class="note">76% approval</div>
          </div>

          <div class="card stat">
            <div class="stat-label">Disbursed</div>
            <div class="stat-value gold">৳8.7M</div>
            <div class="note">This quarter</div>
          </div>

          <div class="card stat">
            <div class="stat-label">Recovery Rate</div>
            <div class="stat-value">96.4%</div>
            <div class="note">Portfolio health</div>
          </div>

        </div>

        <div class="card" id="loans" style="margin-top:15px">

          <div class="head">

            <div>
              <div class="title">Recent Loan Applications</div>
              <div class="sub">
                Farmer applications requiring review
              </div>
            </div>

            <span class="badge warn">24 Pending</span>

          </div>

          <div class="table">

            <table>

              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>District</th>
                  <th>Purpose</th>
                  <th>Amount</th>
                  <th>Risk</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>

                <tr>
                  <td>Rafiq Islam</td>
                  <td>Sylhet</td>
                  <td>Crop Production</td>
                  <td>৳250,000</td>
                  <td>Low</td>

                  <td>
                    <span class="badge warn">
                      Pending
                    </span>
                  </td>

                  <td>
                    <button
                      class="btn ghost"
                      onclick="done('Application opened')">
                      Review
                    </button>
                  </td>
                </tr>

                <tr>
                  <td>Sumaya Begum</td>
                  <td>Rangpur</td>
                  <td>Working Capital</td>
                  <td>৳180,000</td>
                  <td>Low</td>

                  <td>
                    <span class="badge ok">
                      Approved
                    </span>
                  </td>

                  <td>
                    <button class="btn dark-btn">
                      Details
                    </button>
                  </td>
                </tr>

                <tr>
                  <td>Jabbar Ali</td>
                  <td>Mymensingh</td>
                  <td>Equipment</td>
                  <td>৳420,000</td>
                  <td>Medium</td>

                  <td>
                    <span class="badge warn">
                      Review
                    </span>
                  </td>

                  <td>
                    <button class="btn ghost">
                      Review
                    </button>
                  </td>
                </tr>

              </tbody>

            </table>

          </div>

        </div>

        <div class="grid g2" style="margin-top:15px">

          <div class="card pad" id="farmers">

            <div class="kicker">
              Farmer verification
            </div>

            <div class="title">
              Identity & profile checks
            </div>

            <div class="prow">

              <div class="ptop">
                <span>NID verified</span>
                <span>98.2%</span>
              </div>

              <div class="progress">
                <i style="width:98%"></i>
              </div>

            </div>

            <div class="prow">

              <div class="ptop">
                <span>Farm profile complete</span>
                <span>91%</span>
              </div>

              <div class="progress">
                <i style="width:91%"></i>
              </div>

            </div>

          </div>

          <div class="card pad" id="portfolio">

            <div class="kicker">
              Portfolio
            </div>

            <div class="title">
              Agricultural loan book
            </div>

            <div class="list">

              <div class="row">
                <span>Crop production</span>
                <b>৳4.1M</b>
              </div>

              <div class="row">
                <span>Equipment</span>
                <b>৳2.6M</b>
              </div>

              <div class="row">
                <span>Working capital</span>
                <b>৳2.0M</b>
              </div>

            </div>

          </div>

        </div>

      </main>

    </section>

  </div>
</div>
`;

const side = document.getElementById('side');
const overlay = document.getElementById('overlay');

document.getElementById('menu').onclick = () => {
  side.classList.toggle('open');
  overlay.classList.toggle('show');
};

overlay.onclick = () => {
  side.classList.remove('open');
  overlay.classList.remove('show');
};

function done(message) {
  alert(message);
}