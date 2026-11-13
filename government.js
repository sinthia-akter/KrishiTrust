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
          <span class="brand-sub">Government Portal</span>
        </div>
      </a>

      <div class="nav-label">Workspace</div>

      <nav class="nav">

        <a class="active" href="government.html">
          <span>◉</span>Overview
        </a>

        <a class="active" href="disaster-management.html">
          <span>🌊</span>Disaster management
        </a>

        <a class="active" href="subsidy-allocation.html">
          <span>💰</span>Subsidy Allocation
        </a>

        <a class="active" href="store-inspection.html">
          <span>🏪</span>Store Inspection
        </a>

        <a class="active" href="district-reports.html">
          <span>📊</span>District Reports
        </a>

        <a class="active" href="issue-notice.html">
          <span>📣</span>Issue Notice
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

          <button class="menu-btn" id="menu">
            ☰
          </button>

          <div class="crumb">
            Government Portal /
            <b>Ministry of Agriculture, Bangladesh</b>
          </div>

        </div>

        <div class="top-right">
        <button id="themeToggle" type="button" class="theme-toggle" aria-label="Toggle theme">
  🌙
</button>

          <button
            class="icon-btn"
            onclick="alert('No new notifications')">
            🔔
          </button>

          <div class="avatar">NP</div>

        </div>

      </header>

      <main class="page">

        <div class="page-head">

          <div>

            <div class="kicker">
              KrishiTrust Platform
            </div>

            <h1 class="page-title">
              Ministry of Agriculture, Bangladesh
            </h1>

            <p class="page-sub">
              National agricultural intelligence, relief and policy monitoring.
            </p>

          </div>

          <div></div>

        </div>

        <div class="grid g4">

          <div class="card stat">
            <div class="stat-label">
              Registered Farmers
            </div>

            <div class="stat-value">
              2.4M
            </div>

            <div class="note">
              Across 64 districts
            </div>
          </div>

          <div class="card stat">
            <div class="stat-label">
              Active Relief Cases
            </div>

            <div class="stat-value orange">
              48.2K
            </div>

            <div class="note">
              Flood response
            </div>
          </div>

          <div class="card stat">
            <div class="stat-label">
              Subsidies Distributed
            </div>

            <div class="stat-value gold">
              ৳3.8B
            </div>

            <div class="note">
              FY 2024
            </div>
          </div>

          <div class="card stat">
            <div class="stat-label">
              Flagged Stores
            </div>

            <div class="stat-value red">
              184
            </div>

            <div class="note">
              Pending inspection
            </div>
          </div>

        </div>

        <div class="grid g2" style="margin-top:15px">

          <div class="card pad" id="disaster">

            <div class="kicker">
              🌊 Active Disaster Events
            </div>

            <div class="title">
              Sylhet Division Flooding
            </div>

            <div class="sub">
              48,200 farmers affected · Relief operations ongoing.
            </div>

            <div
              class="alert gold-alert"
              style="margin-top:14px">

              Damage Assessment Queue:
              12,480 reports waiting for field verification.

              <br>

              Relief Fund:
              ৳620M allocated · ৳410M committed.

            </div>

          </div>

          <div class="card pad">

            <div class="kicker">
              Production
            </div>

            <div class="title">
              Crop Production FY 2024
            </div>

            <div class="prow">

              <div class="ptop">
                <span>Rice</span>
                <span>39.8M MT</span>
              </div>

              <div class="progress">
                <i style="width:88%"></i>
              </div>

            </div>

            <div class="prow">

              <div class="ptop">
                <span>Potato</span>
                <span>10.6M MT</span>
              </div>

              <div class="progress">
                <i style="width:64%"></i>
              </div>

            </div>

            <div class="prow">

              <div class="ptop">
                <span>Jute</span>
                <span>1.7M MT</span>
              </div>

              <div class="progress">
                <i style="width:32%"></i>
              </div>

            </div>

          </div>

        </div>

        <div class="grid g2" style="margin-top:15px">

          <div class="card pad" id="subsidy">

            <div class="kicker">
              Subsidy Programs
            </div>

            <div class="list">

              <div class="row">
                <span>Fertilizer Subsidy</span>
                <b>৳1.8B</b>
              </div>

              <div class="row">
                <span>Seed Support</span>
                <b>৳820M</b>
              </div>

              <div class="row">
                <span>Diesel Support</span>
                <b>৳540M</b>
              </div>

            </div>

          </div>

          <div class="card pad" id="stores">

            <div class="kicker">
              Flagged Stores – Pending Inspection
            </div>

            <div class="list">

              <div class="row">
                <span>Mymensingh Agro Supply</span>
                <span class="badge bad">
                  Flagged
                </span>
              </div>

              <div class="row">
                <span>Rangpur Farm Inputs</span>
                <span class="badge bad">
                  Flagged
                </span>
              </div>

            </div>

          </div>

        </div>

        <div class="card" id="districts" style="margin-top:15px">

          <div class="head">

            <div>

              <div class="title">
                District Performance Report
              </div>

              <div class="sub">
                Farmer registration, marketplace and relief indicators
              </div>

            </div>

          </div>

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

                  <td>
                    <span class="badge ok">
                      Strong
                    </span>
                  </td>
                </tr>

                <tr>
                  <td>Rangpur</td>
                  <td>210,540</td>
                  <td>39,820</td>
                  <td>2,120</td>

                  <td>
                    <span class="badge ok">
                      Strong
                    </span>
                  </td>
                </tr>

                <tr>
                  <td>Mymensingh</td>
                  <td>225,110</td>
                  <td>41,200</td>
                  <td>3,980</td>

                  <td>
                    <span class="badge gold-badge">
                      Stable
                    </span>
                  </td>
                </tr>

              </tbody>

            </table>

          </div>

        </div>

        <div
          class="card pad"
          id="notices"
          style="margin-top:15px">

          <div class="kicker">
            Government communication
          </div>

          <div class="title">
            Issue Government Notice
          </div>

          <div class="form" style="margin-top:15px">

            <div class="field">

              <label>Notice Type</label>

              <select>

                <option>Disaster Relief</option>
                <option>Subsidy Distribution</option>
                <option>Crop Advisory</option>
                <option>Market Price Update</option>
                <option>Policy Change</option>

              </select>

            </div>

            <div class="field">

              <label>Target District</label>

              <select>

                <option>All Districts</option>
                <option>Sylhet Division</option>
                <option>Dhaka Division</option>
                <option>Chittagong Division</option>

              </select>

            </div>

            <div class="field full">

              <label>Notice Message</label>

              <textarea
                id="notice"
                placeholder="Write the official notice...">
              </textarea>

            </div>

            <div class="field full">

              <button
                class="btn gold-btn"
                onclick="
                  if(!document.getElementById('notice').value.trim())
                    done('Please write a notice message first.');
                  else
                    done('Notice Issued Successfully');
                ">

                Issue Notice

              </button>

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