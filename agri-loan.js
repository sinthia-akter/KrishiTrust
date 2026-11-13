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
<span>🏪</span>Find Stores
</a>

<a class="active" href="agri-loan.html">
<span>💳</span>Agri Loan
</a>

<a href="disaster-relief.html">
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
Farmer Portal / <b>Agri Loan</b>
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
<div class="kicker">Financial Services</div>

<h1 class="page-title">
Agri Loan Platform
</h1>

<p class="page-sub">
Access institutional credit through verified farmer data.
</p>
</div>

</div>

<div class="grid g4">

<div class="card stat">
<div class="stat-label">Eligibility</div>
<div class="stat-value green">Eligible</div>
<div class="note">Based on verified profile</div>
</div>

<div class="card stat">
<div class="stat-label">Maximum Loan</div>
<div class="stat-value gold">৳5L</div>
<div class="note">Estimated limit</div>
</div>

<div class="card stat">
<div class="stat-label">Interest Range</div>
<div class="stat-value">8–10%</div>
<div class="note">Institution dependent</div>
</div>

<div class="card stat">
<div class="stat-label">NID Status</div>
<div class="stat-value green">Verified</div>
<div class="note">Identity confirmed</div>
</div>

</div>

<div class="grid g2" style="margin-top:15px">

<div class="card pad">

<div class="kicker">
Your Eligibility
</div>

<div class="title">
Loan Eligibility Assessment
</div>

<div class="alert gold-alert" style="margin-top:15px">
Based on your farming history, marketplace activity
and verified identity, you are eligible to apply for
an agricultural loan.
</div>

<div class="prow">

<div class="ptop">
<span>Eligibility score</span>
<span>92%</span>
</div>

<div class="progress">
<i style="width:92%"></i>
</div>

</div>

<div class="list">

<div class="row">
<span>Farmer verification</span>
<span class="badge ok">Verified</span>
</div>

<div class="row">
<span>Land / crop information</span>
<span class="badge ok">Verified</span>
</div>

<div class="row">
<span>Marketplace history</span>
<span class="badge ok">Strong</span>
</div>

<div class="row">
<span>Credit assessment</span>
<span class="badge gold">Ready</span>
</div>

</div>

</div>

<div class="card pad">

<div class="kicker">
Apply Now
</div>

<div class="title">
Loan Application
</div>

<form id="loanForm" style="margin-top:18px">

<div class="field">
<label>Requested Amount</label>

<input
class="input"
id="amount"
placeholder="৳300,000"
required>
</div>

<div class="field" style="margin-top:13px">
<label>Loan Purpose</label>

<select id="purpose">
<option>Crop Production</option>
<option>Farm Equipment</option>
<option>Seeds & Fertilizer</option>
<option>Livestock</option>
<option>Irrigation</option>
</select>
</div>

<div class="field" style="margin-top:13px">
<label>Preferred Bank</label>

<select>
<option>Krishi Bank</option>
<option>Sonali Bank</option>
<option>BRAC Bank</option>
<option>City Bank</option>
</select>
</div>

<button
class="btn gold-btn"
style="width:100%;margin-top:15px">
Apply for Loan
</button>

</form>

</div>

</div>

<div class="card pad" style="margin-top:15px">

<div class="kicker">
Application Process
</div>

<div class="title">
How it works
</div>

<div class="grid g4" style="margin-top:15px">

<div>
<div class="dot">1</div>
<div class="ititle" style="margin-top:8px">
Verify
</div>
<div class="meta">
NID and farmer profile
</div>
</div>

<div>
<div class="dot">2</div>
<div class="ititle" style="margin-top:8px">
Match
</div>
<div class="meta">
Find suitable bank
</div>
</div>

<div>
<div class="dot">3</div>
<div class="ititle" style="margin-top:8px">
Apply
</div>
<div class="meta">
Submit loan request
</div>
</div>

<div>
<div class="dot">4</div>
<div class="ititle" style="margin-top:8px">
Receive
</div>
<div class="meta">
Bank approval & disbursement
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

document.getElementById("loanForm").onsubmit = e => {

e.preventDefault();

alert(
"Loan Application Submitted Successfully!\n\n" +
"Application ID: KT-LOAN-02418\n" +
"Status: Pending Bank Review"
);

};