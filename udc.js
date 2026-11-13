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
          <span class="brand-sub">
            UDC Agent Portal
          </span>
        </div>

      </a>

      <div class="nav-label">
        Workspace
      </div>

      <nav class="nav">

        <a class="active" href="udc.html">
          <span>◉</span>Dashboard
        </a>

        <a class="active" href="farmer-registration.html">
          <span>👨‍🌾</span>Farmer Registration
        </a>

        <a class="active" href="udc-applications.html">
          <span>📄</span>Applications
        </a>

        <a class="active" href="udc-reports.html">
          <span>📊</span>Reports
        </a>

      </nav>

      <div class="side-footer">

        Secure agricultural intelligence platform<br>

        <span class="green">
          ● System operational
        </span>

      </div>

    </aside>

    <section class="main">

      <header class="topbar">

        <div class="top-left">

          <button class="menu-btn" id="menu">
            ☰
          </button>

          <div class="crumb">
            UDC Agent Portal /
            <b>UDC Agent Dashboard</b>
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

          <div class="avatar">
            NP
          </div>

        </div>

      </header>

      <main class="page">

        <div class="page-head">

          <div>

            <div class="kicker">
              KrishiTrust Platform
            </div>

            <h1 class="page-title">
              UDC Agent Dashboard
            </h1>

            <p class="page-sub">
              Union Digital Centre service desk for local farmers.
            </p>

          </div>

          <div></div>

        </div>

        <div class="grid g4">

          <div class="card stat">

            <div class="stat-label">
              Farmers Served
            </div>

            <div class="stat-value" id="sServed">
              1,284
            </div>

            <div class="note">
              This month
            </div>

          </div>

          <div class="card stat">

            <div class="stat-label">
              Registrations
            </div>

            <div class="stat-value green" id="sMonth">
              186
            </div>

            <div class="note">
              This month
            </div>

          </div>

          <div class="card stat">

            <div class="stat-label">
              Loan Applications
            </div>

            <div class="stat-value" id="sServed">
              94
            </div>

            <div class="note">
              Assisted
            </div>

          </div>

          <div class="card stat">

            <div class="stat-label">
              Cases Resolved
            </div>

            <div class="stat-value gold">
              97%
            </div>

            <div class="note">
              Service level
            </div>

          </div>

        </div>

        <div class="grid g2" style="margin-top:15px">

          <div class="card pad" id="farmers">

            <div class="kicker">
              Local service desk
            </div>

            <div class="title">
              Farmer Registration
            </div>

            <form id="udcform" class="form" style="margin-top:18px">

<div class="field">
<label>Farmer Name</label>
<input class="input" name="full_name" required placeholder="Full name">
</div>

<div class="field">
<label>NID Number</label>
<input class="input" name="nid" required placeholder="NID">
</div>

<div class="field">
<label>Mobile Number (farmer's login)</label>
<input class="input" name="phone" type="tel" required placeholder="01XXXXXXXXX">
</div>

<div class="field">
<label>District</label>
<select name="district">
<option>Sylhet</option>
<option>Dhaka</option>
<option>Rangpur</option>
<option>Mymensingh</option>
</select>
</div>

<div class="field">
<label>Upazila / Union</label>
<input class="input" name="union_name" placeholder="Upazila">
</div>

<div class="field">
<label>Main Crop</label>
<select name="primary_crop">
<option>Aman Rice</option>
<option>Potato</option>
<option>Jute</option>
<option>Mustard</option>
</select>
</div>

<div class="field">
<label>Farm Area (Bigha)</label>
<input class="input" name="land_bigha" type="number" step="0.01" min="0" placeholder="2.5">
</div>

<div class="field full">
<button class="btn gold-btn" type="submit">Register Farmer</button>
</div>

</form>

          </div>

          <div class="card" id="applications">

            <div class="head">

              <div>

                <div class="title">
                  Service Applications
                </div>

                <div class="sub">
                  Recent UDC-assisted applications
                </div>

              </div>

            </div>

            <div class="body list">

              <div class="row">

                <div>

                  <div class="ititle">
                    Rafiq Islam · Agri Loan
                  </div>

                  <div class="meta">
                    KT-LOAN-02418 · Submitted today
                  </div>

                </div>

                <span class="badge warn">
                  Pending
                </span>

              </div>

              <div class="row">

                <div>

                  <div class="ititle">
                    Sumaya Begum · Disaster Relief
                  </div>

                  <div class="meta">
                    KT-DR-1048 · Verified
                  </div>

                </div>

                <span class="badge ok">
                  Complete
                </span>

              </div>

              <div class="row">

                <div>

                  <div class="ititle">
                    Abdul Karim · Store Finder
                  </div>

                  <div class="meta">
                    Assisted with 3 store options
                  </div>

                </div>

                <span class="badge ok">
                  Resolved
                </span>

              </div>

            </div>

          </div>

        </div>

        <div
          class="card pad"
          id="reports"
          style="margin-top:15px">

          <div class="kicker">
            Reports
          </div>

          <div class="title">
            Monthly service performance
          </div>

          <div class="prow">

            <div class="ptop">

              <span>Farmer registrations</span>
              <span>186</span>

            </div>

            <div class="progress">
              <i style="width:74%"></i>
            </div>

          </div>

          <div class="prow">

            <div class="ptop">

              <span>Applications supported</span>
              <span>312</span>

            </div>

            <div class="progress">
              <i style="width:88%"></i>
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

async function loadStats() {
  try {
    const s = await api("udc_stats.php");
    document.getElementById("sServed").textContent = s.served.toLocaleString();
    document.getElementById("sMonth").textContent = s.this_month.toLocaleString();
  } catch (err) {}
}

document.getElementById("udcform").onsubmit = async (e) => {
  e.preventDefault();
  const form = e.currentTarget;
  const btn = form.querySelector("button[type=submit]");
  btn.disabled = true;
  try {
    const data = await api("farmer_register.php", new FormData(form));
    alert(
      "Farmer registered successfully.\n" +
      "Farmer ID: " + data.farmer_code + "\n" +
      "Login: " + form.phone.value + "\n" +
      "Temporary password: " + data.temp_password + "\n\n" +
      "Give this password to the farmer."
    );
    form.reset();
    loadStats();
  } catch (err) {
    alert(err.message);
  } finally {
    btn.disabled = false;
  }
};

loadStats();