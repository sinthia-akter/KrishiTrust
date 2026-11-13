document.body.innerHTML = `
<div class="app">
<div class="layout">

<div class="overlay" id="overlay"></div>

<aside class="sidebar" id="side">

<a class="brand" href="index.html">

<div class="brand-mark">KT</div>

<div>
<div class="brand-text">KrishiTrust</div>
<span class="brand-sub">Buyer Portal</span>
</div>

</a>

<div class="nav-label">
Buyer Portal
</div>

<nav class="nav">

<a href="buyer-dashboard.html">
<span>▦</span>Dashboard
</a>

<a href="post-requirements.html">
<span>＋</span>Post Requirements
</a>

<a class="active" href="browse-crops.html">
<span>🌾</span>Browse Crops
</a>

<a href="multi-farmer-orders.html">
<span>🤝</span>Multi-Farmer Orders
</a>

<a href="order-tracking.html">
<span>◎</span>Order Tracking
</a>

<a href="negotiations.html">
<span>⇄</span>Negotiations
</a>

</nav>

<div class="side-footer">
Verified procurement network<br>
<span class="green">● Platform operational</span>
</div>

</aside>


<section class="main">

<header class="topbar">

<div class="top-left">

<button class="menu-btn" id="menu">
☰
</button>

<div class="crumb">
Buyer Portal / <b>Browse Crops</b>
</div>

</div>

<div class="top-right">
<button id="themeToggle" type="button" class="theme-toggle" aria-label="Toggle theme">
  🌙
</button>

<button class="icon-btn">
🔔
</button>

<div class="avatar">
BY
</div>

</div>

</header>


<main class="page">

<div class="page-head">

<div>

<div class="kicker">
Marketplace
</div>

<h1 class="page-title">
Browse Crops
</h1>

<p class="page-sub">
Discover verified crops from farmers across Bangladesh.
</p>

</div>

</div>


<div class="filter">

<div class="search">

<span>⌕</span>

<input
class="input"
id="search"
placeholder="Search crops, farmers or district...">

</div>

<select id="cropFilter"
style="max-width:150px">

<option>
All Crops
</option>

<option>
Rice
</option>

<option>
Potato
</option>

<option>
Jute
</option>

<option>
Mustard
</option>

<option>
Wheat
</option>

<option>
Lentils
</option>

</select>

<button
class="btn ghost-gold"
id="filterBtn">
☷ Filter
</button>

</div>
<div class="crop-grid" id="cropGrid"></div>
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
const cropFilter = document.getElementById("cropFilter");
const grid = document.getElementById("cropGrid");

let me = null; 

function esc(s) {
  const d = document.createElement("div");
  d.textContent = s ?? "";
  return d.innerHTML;
}

const ICONS = { "Potato": "🥔", "Jute": "🌿", "Mustard": "🌼", "Lentils": "🫘" };

function cropCard(c) {
  const text = [c.crop_name, c.farmer_name, c.district, c.location].join(" ").toLowerCase();
  const qty = Number(c.quantity).toLocaleString();
  const price = Number(c.price).toLocaleString();
  return `
<div class="card crop crop-item" data-search="${esc(text)}">
  <div class="crop-top">
    <div class="crop-icon">${ICONS[c.crop_name] || "🌾"}</div>
    <span class="badge ${c.quality === "Grade A" ? "ok" : "warn"}">${esc(c.quality)}</span>
  </div>
  <div class="crop-name">${esc(c.crop_name)}</div>
  <div class="sub">${esc(c.farmer_name)} · ${esc(c.district)}</div>
  <div class="crop-meta">
    <div class="meta-box">
      <div class="meta-label">Quantity</div>
      <div class="meta-value">${qty} ${esc(c.unit)}</div>
    </div>
    <div class="meta-box">
      <div class="meta-label">Price / Unit</div>
      <div class="meta-value gold">৳${price}</div>
    </div>
  </div>
  <div class="actions">
    <button class="btn ghost-gold negotiate" data-id="${c.id}">Negotiate</button>
    <button class="btn gold-btn buy" data-id="${c.id}">Buy</button>
  </div>
</div>`;
}

function filterCrops() {
  const query = search.value.toLowerCase().trim();
  const selected = cropFilter.value.toLowerCase();
  document.querySelectorAll(".crop-item").forEach(card => {
    const text = card.dataset.search;
    const ok = (!query || text.includes(query)) &&
               (selected === "all crops" || text.includes(selected));
    card.style.display = ok ? "block" : "none";
  });
}

search.oninput = filterCrops;
cropFilter.onchange = filterCrops;

grid.onclick = (e) => {
  const btn = e.target.closest("button[data-id]");
  if (!btn) return;

  if (!me) {
    alert("Please log in as a buyer to negotiate or buy.");
    location.href = "login.html";
    return;
  }
  if (me.role !== "buyer") {
    alert("Only buyer accounts can negotiate or buy.");
    return;
  }
  if (btn.classList.contains("negotiate")) {
    location.href = "negotiations.html?crop_id=" + btn.dataset.id;
    } else {
    const card = btn.closest(".crop-item");
    const qty = prompt("How much do you want to buy?\n(Listed price will be used. Use Negotiate for a better price.)", "1");
    if (!qty) return;
    api("order_create.php", { crop_id: btn.dataset.id, quantity: qty })
      .then(r => {
        alert("Order placed!\nOrder ID: " + r.order_code + "\nTotal: ৳" + Number(r.total).toLocaleString());
        location.href = "order-tracking.html";
      })
      .catch(err => alert(err.message));
  }
};

(async function () {
  try {
    me = (await (await fetch("api/me.php")).json()).user;
  } catch (e) { me = null; }

  try {
    const data = await (await fetch("api/crops_public.php")).json();
    grid.innerHTML = data.crops.length
      ? data.crops.map(cropCard).join("")
      : "<p>No crops are listed right now.</p>";
  } catch (e) {
    grid.innerHTML = "<p>Could not load crops. Please try again.</p>";
  }
})();