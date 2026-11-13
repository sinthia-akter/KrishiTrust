(async function () {
  await loadUser();
  const me = window.currentUser;
  if (!me) { location.href = "login.html"; return; }

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
<div class="nav-label">Buyer Portal</div>
<nav class="nav">
<a href="buyer-dashboard.html"><span>▦</span>Dashboard</a>
<a href="post-requirements.html"><span>＋</span>Post Requirements</a>
<a href="browse-crops.html"><span>🌾</span>Browse Crops</a>
<a class="active" href="multi-farmer-orders.html"><span>🤝</span>Multi-Farmer Orders</a>
<a href="order-tracking.html"><span>◎</span>Order Tracking</a>
<a href="negotiations.html"><span>⇄</span>Negotiations</a>
</nav>
<div class="side-footer">
Verified procurement network<br>
<span class="green">● Platform operational</span>
</div>
</aside>

<section class="main">
<header class="topbar">
<div class="top-left">
<button class="menu-btn" id="menu">☰</button>
<div class="crumb">Buyer Portal / <b>Multi-Farmer Orders</b></div>
</div>
<div class="top-right">
<button id="themeToggle" type="button" class="theme-toggle" aria-label="Toggle theme">🌙</button>
<button class="icon-btn" onclick="logout()">Logout</button>
<div class="avatar">${initials(me.name)}</div>
</div>
</header>

<main class="page">

<div class="page-head">
<div>
<div class="kicker">Bulk Procurement</div>
<h1 class="page-title">Multi-Farmer Orders</h1>
<p class="page-sub">Take one product from up to 3 farmers in a single order.</p>
</div>
</div>

<div class="grid g3">
<div class="card stat"><div class="stat-label">Bulk Orders</div><div class="stat-value" id="sOrders">-</div><div class="note">Placed so far</div></div>
<div class="card stat"><div class="stat-label">Farmers Involved</div><div class="stat-value" id="sFarmers">-</div><div class="note">Across active orders</div></div>
<div class="card stat"><div class="stat-label">Total Quantity</div><div class="stat-value gold" id="sQty">-</div><div class="note">Active orders</div></div>
</div>

<div class="card pad" style="margin-top:15px">
<div class="kicker">New Bulk Order</div>
<div class="title">Choose a product and up to 3 farmers</div>

<div class="field" style="margin-top:14px;max-width:320px">
<label>Product</label>
<select id="product"></select>
</div>

<div class="list" id="farmerPick"></div>

<div class="alert gold-alert" id="summary" style="margin-top:14px">Select a product.</div>

<button class="btn gold-btn" id="placeBtn" style="margin-top:14px;width:100%" disabled>Place Bulk Order</button>
</div>

<div id="bulkList" style="margin-top:15px"></div>

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

  function esc(s) {
    const d = document.createElement("div");
    d.textContent = s ?? "";
    return d.innerHTML;
  }
  const money = n => "৳" + Number(n).toLocaleString();
  const MAX = 3;

  const LABEL = { placed: "Waiting", confirmed: "Confirmed", in_transit: "In Transit", delivered: "Delivered", cancelled: "Cancelled" };
  const BADGE = { placed: "warn", confirmed: "ok", in_transit: "gold", delivered: "ok", cancelled: "bad" };

  
  const productSel = document.getElementById("product");
  const pick = document.getElementById("farmerPick");
  const summary = document.getElementById("summary");
  const placeBtn = document.getElementById("placeBtn");
  let byProduct = {};

  async function loadCrops() {
    const d = await api("crops_public.php");
    byProduct = {};
    d.crops.forEach(c => (byProduct[c.crop_name] ||= []).push(c));
    const names = Object.keys(byProduct);
    productSel.innerHTML = names.length
      ? names.map(n => `<option value="${esc(n)}">${esc(n)} (${byProduct[n].length} farmers)</option>`).join("")
      : "<option value=''>No crops on sale</option>";
    renderFarmers();
  }

  function renderFarmers() {
    const list = byProduct[productSel.value] || [];
    pick.innerHTML = list.length ? list.map(c => `
<div class="row">
<label class="item" style="cursor:pointer">
<input type="checkbox" class="pickBox" value="${c.id}" data-price="${c.price}">
<div>
<div class="ititle">${esc(c.farmer_name)} · ${esc(c.district)}</div>
<div class="meta">${Number(c.quantity).toLocaleString()} ${esc(c.unit)} available · ${esc(c.quality)}</div>
</div>
</label>
<div style="display:flex;gap:8px;align-items:center">
<div class="price">${money(c.price)}</div>
<input class="input qtyBox" type="number" min="1" max="${c.quantity}" step="any" placeholder="Qty" style="width:90px" disabled data-id="${c.id}">
</div>
</div>`).join("") : "<p>No farmers are selling this product right now.</p>";
    update();
  }

  function update() {
    const boxes = [...document.querySelectorAll(".pickBox")];
    const chosen = boxes.filter(b => b.checked);

    boxes.forEach(b => { if (!b.checked) b.disabled = chosen.length >= MAX; });
    document.querySelectorAll(".qtyBox").forEach(q => {
      const box = boxes.find(b => b.value === q.dataset.id);
      q.disabled = !box.checked;
      if (!box.checked) q.value = "";
    });

    let qty = 0, total = 0, ready = chosen.length >= 2;
    chosen.forEach(b => {
      const v = Number(document.querySelector(`.qtyBox[data-id="${b.value}"]`).value) || 0;
      if (v <= 0) ready = false;
      qty += v;
      total += v * Number(b.dataset.price);
    });

    summary.textContent = chosen.length
      ? `${chosen.length} of ${MAX} farmers · ${qty.toLocaleString()} units · Total ${money(total)}` +
        (chosen.length < 2 ? " (choose at least 2 farmers)" : "")
      : "Tick 2 or 3 farmers and enter a quantity for each.";
    placeBtn.disabled = !ready;
  }

  pick.onchange = update;
  pick.oninput = update;
  productSel.onchange = renderFarmers;

  placeBtn.onclick = async () => {
    const items = [...document.querySelectorAll(".pickBox")]
      .filter(b => b.checked)
      .map(b => b.value + ":" + document.querySelector(`.qtyBox[data-id="${b.value}"]`).value)
      .join(",");
    if (!confirm("Place this bulk order?\n" + summary.textContent)) return;

    placeBtn.disabled = true;
    try {
      const r = await api("bulk_create.php", { items });
      alert("Bulk order placed!\nOrder ID: " + r.bulk_code + "\nFarmers: " + r.farmers + "\nTotal: " + money(r.total));
      await Promise.all([loadCrops(), loadBulks()]);
    } catch (err) {
      alert(err.message);
      update();
    }
  };

  function bulkCard(b) {
    const live = b.parts.filter(p => p.status !== "cancelled");
    const confirmed = live.filter(p => ["confirmed", "in_transit", "delivered"].includes(p.status)).length;
    const qty = live.reduce((s, p) => s + Number(p.quantity), 0);
    const total = live.reduce((s, p) => s + Number(p.total), 0);
    const pct = live.length ? Math.round(100 * confirmed / live.length) : 0;

    let status = "In progress";
    if (!live.length) status = "Cancelled";
    else if (live.every(p => p.status === "delivered")) status = "Delivered";
    else if (live.some(p => p.status === "placed")) status = "Waiting for farmers";

    const unit = b.parts[0].unit;

    return `
<div class="card pad" style="margin-bottom:15px">
<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px">
<div>
<div class="kicker">${esc(b.bulk_code)}</div>
<div class="title">${esc(b.crop_name)} · ${qty.toLocaleString()} ${esc(unit)}</div>
<div class="sub">${live.length} farmer${live.length === 1 ? "" : "s"} · ${money(total)} · ${esc((b.created_at || "").slice(0, 10))}</div>
</div>
<span class="badge ${status === "Delivered" ? "ok" : status === "Cancelled" ? "bad" : "warn"}">${status}</span>
</div>

<div class="prow">
<div class="ptop"><span>${confirmed} of ${live.length} farmers confirmed</span><span>${pct}%</span></div>
<div class="progress"><i style="width:${pct}%"></i></div>
</div>

<div class="grid g3" style="margin-top:16px">
${b.parts.map(p => `
<div class="card pad">
<div class="icon">👨‍🌾</div>
<div class="ititle" style="margin-top:9px">${esc(p.farmer)}</div>
<div class="meta">${esc(p.district)} · ${Number(p.quantity).toLocaleString()} ${esc(p.unit)} × ${money(p.unit_price)}</div>
${p.phone ? `<div class="meta">📞 ${esc(p.phone)}</div>` : ""}
<span class="badge ${BADGE[p.status]}" style="display:inline-block;margin-top:9px">${LABEL[p.status]}</span>
</div>`).join("")}
</div>

<a class="btn ghost-gold" href="order-tracking.html" style="margin-top:14px">Track in Order Tracking →</a>
</div>`;
  }

  async function loadBulks() {
    const box = document.getElementById("bulkList");
    try {
      const d = await api("bulk_list.php");
      let farmers = 0, qty = 0;
      d.bulks.forEach(b => b.parts.filter(p => p.status !== "cancelled").forEach(p => { farmers++; qty += Number(p.quantity); }));
      document.getElementById("sOrders").textContent = d.bulks.length;
      document.getElementById("sFarmers").textContent = farmers;
      document.getElementById("sQty").textContent = qty.toLocaleString();
      box.innerHTML = d.bulks.length ? d.bulks.map(bulkCard).join("") : "<p>No bulk orders yet.</p>";
    } catch (err) {
      box.innerHTML = "<p>" + esc(err.message) + "</p>";
    }
  }

  try { await loadCrops(); } catch (err) { pick.innerHTML = "<p>" + esc(err.message) + "</p>"; }
  loadBulks();
  setInterval(loadBulks, 8000);
})();