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

<a class="active" href="sell-crops.html">
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
Farmer Portal / <b>Sell Crops</b>
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
<div class="kicker">Marketplace</div>

<h1 class="page-title">
 List the crops
</h1>

<p class="page-sub">
List your crops and connect with verified buyers.
</p>
</div>

</div>

<div class="grid g2">

<div class="card pad">

<div class="kicker">
Create Listing
</div>

<div class="title">
Provide your crop information
</div>

<form id="listingForm" class="form" style="margin-top:18px">

<div class="field">
<label>Crop</label>

<select id="crop" name="crop">
<option>Aman Rice</option>
<option>Boro Rice</option>
<option>Wheat</option>
<option>Potato</option>
<option>Jute</option>
<option>Mustard</option>
<option>Lentils</option>
</select>
</div>

<div class="field">
<label>Quantity</label>
<input
class="input"
id="quantity"
name="quantity"
placeholder="e.g. 120 Bags"
required>
</div>

<div class="field">
<label>Expected Price / Unit</label>
<input
class="input"
id="price"
name="price"
placeholder="৳2,200"
required>
</div>

<div class="field">
<label>Quality Grade</label>

<select id="quality" name="quality">
<option>Grade A – Premium</option>
<option>Grade B – Standard</option>
<option>Grade C – Market</option>
</select>
</div>

<div class="field">
<label>Harvest Date</label>
<input
class="input"
name="harvest_date"
type="date">
</div>

<div class="field">
<label>Available Location</label>
<input
class="input"
name="location"
placeholder="District / Upazila">
</div>

<div class="field full">
<label>Additional Notes</label>

<textarea name="notes"
placeholder="Add details about your crop..."></textarea>
</div>

<div class="field full">

<button class="btn gold-btn">
Publish Crop Listing
</button>

</div>

</form>

</div>

<div class="card pad">

<div class="kicker">
Listing Preview
</div>

<div class="title">
Your Crop Listing
</div>

<div class="crop" style="margin-top:15px;border:1px solid var(--border);border-radius:12px">

<div class="crop-top">
<div class="crop-icon">🌾</div>
<span class="badge ok">Ready</span>
</div>

<div class="crop-name" id="previewCrop">
Aman Rice
</div>

<div class="crop-meta">

<div class="meta-box">
<div class="meta-label">Quantity</div>
<div class="meta-value" id="previewQty">
120 Bags
</div>
</div>

<div class="meta-box">
<div class="meta-label">Price</div>
<div class="meta-value" id="previewPrice">
৳2,200
</div>
</div>

<div class="meta-box">
<div class="meta-label">Quality</div>
<div class="meta-value" id="previewQuality">
Grade A
</div>
</div>

<div class="meta-box">
<div class="meta-label">Status</div>
<div class="meta-value green">
Live
</div>
</div>

</div>

<div class="alert gold-alert">
Your listing will be visible to verified buyers
after publishing.
</div>

</div>

</div>

</div>

<div class="card pad" style="margin-top:15px">

<div class="kicker">
Recent Listings
</div>

<div class="title">
Your published crop
</div>

   <div class="list" id="myCrops"></div>

</div>

<div class="card pad" style="margin-top:15px">
<div class="kicker">Buyer Requirements</div>
<div class="title">Buyers looking for crops</div>
<div class="list" id="reqBox"></div>
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

const crop = document.getElementById("crop");
const quantity = document.getElementById("quantity");
const price = document.getElementById("price");
const quality = document.getElementById("quality");

crop.onchange = () => {
document.getElementById("previewCrop").textContent = crop.value;
};

quantity.oninput = () => {
document.getElementById("previewQty").textContent =
quantity.value || "120 Bags";
};

price.oninput = () => {
document.getElementById("previewPrice").textContent =
price.value || "৳2,200";
};

quality.onchange = () => {
document.getElementById("previewQuality").textContent =
quality.value.split(" – ")[0];
};

function esc(s) {
  const d = document.createElement("div");
  d.textContent = s ?? "";
  return d.innerHTML;
}

async function loadMyCrops() {
  const box = document.getElementById("myCrops");
  if (!box) return;
  try {
    const data = await api("crop_mine.php");
    box.innerHTML = data.crops.length ? data.crops.map(c => `
<div class="row">
<div class="item">
<div class="icon">🌾</div>
<div>
<div class="ititle">${esc(c.crop_name)}</div>
<div class="meta">${esc(c.quantity)} ${esc(c.unit)} · ${esc(c.quality)} · ${esc(c.location)}</div>
</div>
</div>
<div>
<div class="price">৳${esc(c.price)}</div>
<span class="badge ok">Live & Active</span>
</div>
</div>`).join("") : "<p>No listings yet.</p>";
  } catch (err) {
    box.innerHTML = "";
  }
}

document.getElementById("listingForm").onsubmit = async (e) => {
  e.preventDefault();
  const form = e.currentTarget;
  const btn = form.querySelector("button");
  btn.disabled = true;
  try {
    const data = await api("crop_create.php", new FormData(form));
    alert("Listing Published Successfully!\n\nListing ID: " + data.listing_code + "\nStatus: Live & Active");
    form.reset();
    loadMyCrops();
  } catch (err) {
    alert(err.message);
  } finally {
    btn.disabled = false;
  }
};

loadMyCrops();

async function loadReqs() {
  const box = document.getElementById("reqBox");
  if (!box) return;
  try {
    const d = await api("req_open.php");
    box.innerHTML = d.requirements.length ? d.requirements.map(r => `
<div class="row">
<div>
<div class="ititle">${esc(r.crop_name)} · ${Number(r.quantity).toLocaleString()} ${esc(r.unit)}</div>
<div class="meta">${esc(r.buyer)} · ${esc(r.quality)} · ${esc(r.region)} · Budget ৳${Math.round(r.budget).toLocaleString()} · Deadline ${esc(r.deadline)}</div>
</div>
${Number(r.mine)
  ? '<span class="badge ok">You offered</span>'
  : `<button class="btn gold-btn" data-offer="${r.id}">I can supply</button>`}
</div>`).join("") : "<p style='padding:14px 0'>No open buyer requirements right now.</p>";
  } catch (err) {
    box.innerHTML = "";
  }
}

document.addEventListener("click", async (e) => {
  const b = e.target.closest("button[data-offer]");
  if (!b) return;
  b.disabled = true;
  try {
    await api("req_offer.php", { id: b.dataset.offer });
    alert("Done. The buyer can see that you can supply.");
    loadReqs();
  } catch (err) {
    alert(err.message);
    b.disabled = false;
  }
});

loadReqs();
