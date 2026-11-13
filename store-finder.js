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

<a class="active" href="store-finder.html">
<span>🏪</span>Store Finder
</a>

<a href="agri-loan.html">
<span>💳</span>Agri Loan
</a>

<a href="disaster-relief.html">
<span>🌊</span>Disaster Relief
</a>

<a href="aggregation.html">
<span>🤝</span>Total Quantity
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
Farmer Portal / <b>Store Finder</b>
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
<div class="kicker">Verified Marketplace</div>

<h1 class="page-title">
Authentic Store Finder
</h1>

<p class="page-sub">
Find a reliable shop · Find verified agricultural stores near you.
</p>
</div>

</div>

<div class="card pad">

<div class="filter">

<div class="search">
<span>⌕</span>
<input
class="input"
id="search"
placeholder="Search store, product or district...">
</div>

<select id="district" style="max-width:180px">
<option>All Districts</option>
<option>Sylhet</option>
<option>Dhaka</option>
<option>Rangpur</option>
<option>Mymensingh</option>
<option>Comilla</option>
</select>

</div>

<div id="stores"></div>

<div class="grid g3" style="margin-top:15px">

<div class="card pad">
<div class="kicker">Store Protection</div>
<div class="title">Verified Sellers</div>
<div class="stat-value green" id="statVerified">98,400</div>
<div class="note">Certified & inspected stores</div>
</div>

<div class="card pad">
<div class="kicker">Nearby</div>
<div class="title">Stores Around You</div>
<div class="stat-value" id="statShown">24</div>
<div class="note">Matching your search</div>
</div>

<div class="card pad">
<div class="kicker">Trust</div>
<div class="title">Average Rating</div>
<div class="stat-value gold" id="statRating">4.8/5</div>
<div class="note">Based on farmer reviews</div>
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

const search = document.getElementById("search");
const district = document.getElementById("district");
const list = document.getElementById("stores");

function esc(s) {
  const d = document.createElement("div");
  d.textContent = s ?? "";
  return d.innerHTML;
}

function storeRow(s) {
  const stars = s.rating ? "★".repeat(Math.round(s.rating)) + "☆".repeat(5 - Math.round(s.rating)) : "";
  return `
<div class="row store-row">
  <div class="item">
    <div class="icon">🏪</div>
    <div>
      <div class="ititle">${esc(s.name)}</div>
      <div class="meta">${esc(s.district)} · ${esc(s.area)} · ${esc(s.products)}</div>
      <div class="meta">${s.rating ? stars + " " + esc(s.rating) : "No ratings yet"}</div>
    </div>
  </div>
  <span class="badge ok">Verified</span>
</div>`;
}

function filterStores() {
  const text = search.value.toLowerCase();
  const selected = district.value.toLowerCase();
  let shown = 0;

  document.querySelectorAll(".store-row").forEach(row => {
    const content = row.textContent.toLowerCase();
    const ok = (!text || content.includes(text)) &&
               (selected === "all districts" || content.includes(selected));
    row.style.display = ok ? "flex" : "none";
    if (ok) shown++;
  });

  document.getElementById("statShown").textContent = shown;
}

search.oninput = filterStores;
district.onchange = filterStores;

(async function () {
  try {
    const data = await (await fetch("api/stores_public.php")).json();
    list.innerHTML = data.stores.length
      ? data.stores.map(storeRow).join("")
      : "<p>No verified stores found.</p>";

    document.getElementById("statVerified").textContent = Number(data.stats.verified).toLocaleString();
    document.getElementById("statRating").textContent =
      data.stats.avg_rating ? data.stats.avg_rating + "/5" : "-";
    filterStores();
  } catch (e) {
    list.innerHTML = "<p>Could not load stores. Please try again.</p>";
  }
})();