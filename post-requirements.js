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
<a class="active" href="post-requirements.html"><span>＋</span>Post Requirements</a>
<a href="browse-crops.html"><span>🌾</span>Browse Crops</a>
<a href="multi-farmer-orders.html"><span>🤝</span>Multi-Farmer Orders</a>
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
<div class="crumb">Buyer Portal / <b>Post Requirements</b></div>
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
<div class="kicker">Procurement Request</div>
<h1 class="page-title">Post Requirements</h1>
<p class="page-sub">Tell verified farmers exactly what you need.</p>
</div>
</div>

<div class="grid g2">

<div class="card pad">
<div class="kicker">New Requirement</div>
<div class="title">Create Procurement Requirement</div>

<form id="requirementForm" class="form" style="margin-top:18px">

<div class="field full">
<label>Crop Required</label>
<select id="crop" name="crop">
<option>Aman Rice</option>
<option>Boro Rice</option>
<option>Potato</option>
<option>Jute</option>
<option>Mustard</option>
<option>Wheat</option>
<option>Lentils</option>
</select>
</div>

<div class="field">
<label>Quantity Needed</label>
<input class="input" id="quantity" name="quantity" placeholder="500 Bags" required>
</div>

<div class="field">
<label>Budget</label>
<input class="input" id="budget" name="budget" placeholder="৳1,100,000" required>
</div>

<div class="field">
<label>Delivery Deadline</label>
<input class="input" id="deadline" name="deadline" type="date" required>
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
<label>Preferred Region</label>
<select id="region" name="region">
<option>Any District</option>
<option>Sylhet</option>
<option>Dhaka</option>
<option>Rangpur</option>
<option>Rajshahi</option>
<option>Mymensingh</option>
</select>
</div>

<div class="field full">
<label>Additional Notes</label>
<textarea name="notes" maxlength="1000" placeholder="Add delivery, packaging or quality requirements..."></textarea>
</div>

<div class="field full">
<button class="btn gold-btn" type="submit">Post Requirement</button>
</div>

</form>
</div>

<div class="card pad">
<div class="kicker">Requirement Preview</div>
<div class="title">Your request</div>

<div class="card pad" style="margin-top:16px">
<div class="crop-top">
<div class="crop-icon">🌾</div>
<span class="badge gold">Draft</span>
</div>

<div class="crop-name" id="previewCrop">Aman Rice</div>

<div class="crop-meta">
<div class="meta-box"><div class="meta-label">Quantity</div><div class="meta-value" id="previewQuantity">500 Bags</div></div>
<div class="meta-box"><div class="meta-label">Budget</div><div class="meta-value" id="previewBudget">৳1,100,000</div></div>
<div class="meta-box"><div class="meta-label">Grade</div><div class="meta-value" id="previewGrade">Grade A</div></div>
<div class="meta-box"><div class="meta-label">Region</div><div class="meta-value" id="previewRegion">Any District</div></div>
</div>

<div class="alert gold-alert">
Your requirement will be visible to verified farmers after publishing.
</div>
</div>
</div>

</div>

<div class="card pad" style="margin-top:15px">
<div class="kicker">Previous Requests</div>
<div class="title">Your Requirements</div>
<div class="list" id="reqList"></div>
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

  function esc(s) {
    const d = document.createElement("div");
    d.textContent = s ?? "";
    return d.innerHTML;
  }
  const money = n => "৳" + Math.round(Number(n)).toLocaleString();
  const $ = id => document.getElementById(id);

  $("deadline").min = new Date().toISOString().slice(0, 10);

  $("crop").onchange = e => $("previewCrop").textContent = e.target.value;
  $("quantity").oninput = e => $("previewQuantity").textContent = e.target.value || "500 Bags";
  $("budget").oninput = e => $("previewBudget").textContent = e.target.value || "৳1,100,000";
  $("quality").onchange = e => $("previewGrade").textContent = e.target.value.split(" – ")[0];
  $("region").onchange = e => $("previewRegion").textContent = e.target.value;

  async function load() {
    try {
      const d = await api("req_mine.php");
      $("reqList").innerHTML = d.requirements.length ? d.requirements.map(r => {
        const expired = r.status === "open" && r.deadline < d.today;
        const state = r.status === "closed" ? ["Closed", "bad"] : expired ? ["Expired", "warn"] : ["Open", "ok"];
        const n = Number(r.offers);
        return `
<div class="row">
<div>
<div class="ititle">${esc(r.crop_name)} · ${Number(r.quantity).toLocaleString()} ${esc(r.unit)}</div>
<div class="meta">${esc(r.quality)} · ${esc(r.region)} · Budget ${money(r.budget)} · Deadline ${esc(r.deadline)}</div>
<div class="meta">${n ? "Farmers ready to supply: " + esc(r.farmers) : "No offers yet"}</div>
</div>
<div style="display:flex;gap:8px;align-items:center">
<span class="badge ${n ? "gold" : "warn"}">${n} Offer${n === 1 ? "" : "s"}</span>
<span class="badge ${state[1]}">${state[0]}</span>
${state[0] === "Open" ? `<button class="btn dark-btn" data-close="${r.id}">Close</button>` : ""}
</div>
</div>`;
      }).join("") : "<p style='padding:14px 0'>No requirements yet.</p>";
    } catch (err) {
      $("reqList").innerHTML = "<p>" + esc(err.message) + "</p>";
    }
  }

  $("requirementForm").onsubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const btn = form.querySelector("button[type=submit]");
    btn.disabled = true;
    try {
      const r = await api("req_create.php", new FormData(form));
      alert("Requirement Posted Successfully!\n\nRequirement ID: " + r.req_code +
            "\nVerified farmers can now offer to supply.");
      form.reset();
      ["previewCrop", "previewQuantity", "previewBudget", "previewGrade", "previewRegion"].forEach((id, i) =>
        $(id).textContent = ["Aman Rice", "500 Bags", "৳1,100,000", "Grade A", "Any District"][i]);
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      btn.disabled = false;
    }
  };

  $("reqList").onclick = async (e) => {
    const b = e.target.closest("button[data-close]");
    if (!b || !confirm("Close this requirement? Farmers will no longer see it.")) return;
    b.disabled = true;
    try {
      await api("req_close.php", { id: b.dataset.close });
      load();
    } catch (err) {
      alert(err.message);
      b.disabled = false;
    }
  };

  load();
  setInterval(load, 10000);
})();