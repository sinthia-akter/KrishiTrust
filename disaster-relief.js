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
<span class="brand-sub">Farmer Portal</span>
</div>
</a>

<div class="nav-label">Workspace</div>

<nav class="nav">

<a href="farmer-dashboard.html">
<span>🏠</span>Dashboard
</a>

<a href="sell-crops.html">
<span>🌾</span>Sell Crops
</a>
<a href="negotiations.html">
  <span>⇄</span>Negotiations
</a>
<a href="store-finder.html">
<span>🏪</span>Store Finder
</a>

<a href="agri-loan.html">
<span>💳</span>Agri Loan
</a>

<a class="active" href="disaster-relief.html">
<span>🌊</span>Disaster Relief
</a>

<a href="aggregation.html">
<span>🤝</span>Aggregation
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
Farmer Portal / <b>Disaster Relief</b>
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
<div class="kicker">Emergency Support</div>

<h1 class="page-title">
Disaster Relief
</h1>

<p class="page-sub">
Report crop damage and access government relief support.
</p>
</div>

</div>

<div class="alert gold-alert">

🌊 <b>Active Event:</b>
Sylhet Division Flooding · Relief operations ongoing.

</div>

<div class="grid g4" style="margin-top:15px">

<div class="card stat">
<div class="stat-label">Your Cases</div>
<div class="stat-value">01</div>
<div class="note">Current season</div>
</div>

<div class="card stat">
<div class="stat-label">Damage Status</div>
<div class="stat-value gold">Verified</div>
<div class="note">Field assessment complete</div>
</div>

<div class="card stat">
<div class="stat-label">Relief Amount</div>
<div class="stat-value">৳25K</div>
<div class="note">Estimated support</div>
</div>

<div class="card stat">
<div class="stat-label">Case Status</div>
<div class="stat-value green">Active</div>
<div class="note">Under processing</div>
</div>

</div>

<div class="grid g2" style="margin-top:15px">

<div class="card pad">

<div class="kicker">
Register Damage
</div>

<div class="title">
Please share the details of the loss.
</div>

<form id="damageForm" class="form" style="margin-top:18px">

<div class="field">
<label>Disaster Type</label>

<select>
<option>Flood</option>
<option>Cyclone</option>
<option>Drought</option>
<option>River Erosion</option>
<option>Heavy Rainfall</option>
</select>
</div>

<div class="field">
<label>Affected Crop</label>

<select>
<option>Aman Rice</option>
<option>Boro Rice</option>
<option>Potato</option>
<option>Jute</option>
<option>Mustard</option>
</select>
</div>

<div class="field">
<label>Affected Area</label>

<input
class="input"
placeholder="e.g. 2 acres"
required>
</div>

<div class="field">
<label>Estimated Loss</label>

<input
class="input"
placeholder="৳150,000"
required>
</div>

<div class="field full">
<label>Description</label>

<textarea
placeholder="Describe the damage..."></textarea>
</div>

<div class="field full">

<button class="btn gold-btn">
Register Damage
</button>

</div>

</form>

</div>

<div class="card pad">

<div class="kicker">
Your Case
</div>

<div class="title">
Damage Case KT-DR-1048
</div>

<div class="timeline" style="margin-top:18px">

<div class="t">

<div class="dot">✓</div>

<div>
<div class="ititle">
Damage Report Submitted
</div>

<div class="meta">
10 September 2026
</div>
</div>

</div>

<div class="t">

<div class="dot">✓</div>

<div>
<div class="ititle">
Field Verification Complete
</div>

<div class="meta">
Verified by local agriculture officer
</div>
</div>

</div>

<div class="t">

<div class="dot">✓</div>

<div>
<div class="ititle">
Relief Approved
</div>

<div class="meta">
Estimated support: ৳25,000
</div>
</div>

</div>

<div class="t">

<div class="dot">✓</div>

<div>
<div class="ititle">
Payment Processing
</div>

<div class="meta">
Awaiting final disbursement
</div>
</div>

</div>

</div>

</div>

</div>

</main>
</section>
</div>
</div>
`;

const side = document.getElementById("side");
const overlay = document.getElementById("overlay");

document.getElementById("menu").onclick = () => {
side.classList.toggle("open");
overlay.classList.toggle("show");
};

overlay.onclick = () => {
side.classList.remove("open");
overlay.classList.remove("show");
};

document.getElementById("damageForm").onsubmit = e => {

e.preventDefault();

alert(
"Damage Report Submitted Successfully!\n\n" +
"Case ID: KT-DR-1048\n" +
"Status: Under Verification"
);

};