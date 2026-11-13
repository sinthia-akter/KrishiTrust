(async function () {
  await loadUser();
  const me = window.currentUser;
  if (!me) { location.href = "login.html"; return; }

  const params = new URLSearchParams(location.search);
  let id = Number(params.get("id")) || 0;
  const cropId = Number(params.get("crop_id")) || 0;

  if (cropId && me.role === "buyer") {
    try {
      const r = await api("neg_open.php", { crop_id: cropId });
      id = r.id;
      history.replaceState(null, "", "negotiations.html?id=" + id);
    } catch (err) { alert(err.message); }
  }

  const isBuyer = me.role === "buyer";
  const nav = isBuyer ? `
<a href="buyer-dashboard.html"><span>▦</span>Dashboard</a>
<a href="post-requirements.html"><span>＋</span>Post Requirements</a>
<a href="browse-crops.html"><span>🌾</span>Browse Crops</a>
<a href="multi-farmer-orders.html"><span>🤝</span>Multi-Farmer Orders</a>
<a href="order-tracking.html"><span>◎</span>Order Tracking</a>
<a class="active" href="negotiations.html"><span>⇄</span>Negotiations</a>` : `
<a href="farmer-dashboard.html"><span>🏠</span>Dashboard</a>
<a href="sell-crops.html"><span>🌾</span>Sell Crops</a>
<a href="order-tracking.html"><span>◎</span>Order Tracking</a>
<a class="active" href="negotiations.html"><span>⇄</span>Negotiations</a>`;

  document.body.innerHTML = `
<div class="app">
<div class="layout">
<div class="overlay" id="overlay"></div>

<aside class="sidebar" id="side">
<a class="brand" href="index.html">
<div class="brand-mark">KT</div>
<div>
<div class="brand-text">KrishiTrust</div>
<span class="brand-sub">${isBuyer ? "Buyer Portal" : "Farmer Portal"}</span>
</div>
</a>
<div class="nav-label">${isBuyer ? "Buyer Portal" : "Workspace"}</div>
<nav class="nav">${nav}</nav>
<div class="side-footer">
Verified procurement network<br>
<span class="green">● Platform operational</span>
</div>
</aside>

<section class="main">
<header class="topbar">
<div class="top-left">
<button class="menu-btn" id="menu">☰</button>
<div class="crumb">${isBuyer ? "Buyer" : "Farmer"} Portal / <b>Negotiations</b></div>
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
<div class="kicker">Marketplace Negotiation</div>
<h1 class="page-title">Negotiations</h1>
<p class="page-sub">Discuss price and procurement terms with verified ${isBuyer ? "farmers" : "buyers"}.</p>
</div>
</div>

<div class="grid g3">

<div class="card pad">
<div class="kicker">Selected Crop</div>
<div class="title" id="cropTitle">-</div>
<div class="sub" id="party"></div>
<div class="crop-meta">
<div class="meta-box">
<div class="meta-label">Current Offer</div>
<div class="meta-value gold" id="offerVal">-</div>
</div>
<div class="meta-box">
<div class="meta-label">Available</div>
<div class="meta-value" id="availVal">-</div>
</div>
</div>
<div class="sub" id="listedVal" style="margin-top:10px"></div>
<span class="badge ok" id="statusBadge">Verified Farmer</span>
<div class="sub" id="contact" style="margin-top:12px"></div>
<button class="btn gold-btn" id="orderBtn" style="display:none;margin-top:12px;width:100%">Place Order</button>
</div>

<div class="card pad" style="grid-column:span 2">
<div class="kicker">Negotiation Room</div>
<div class="title">Price Discussion</div>

<div id="messages" style="height:280px;overflow-y:auto;margin-top:15px;padding:5px;"></div>

<form id="messageForm" style="display:flex;gap:8px;margin-top:12px;">
<input class="input" id="message" placeholder="Write a message..." maxlength="500" required>
<button class="btn gold-btn">Send</button>
</form>

<div style="display:flex;gap:8px;margin-top:10px;">
<button class="btn ghost-gold" id="offerBtn">Make Price Offer</button>
<button class="btn dark-btn" id="acceptBtn">Accept Current Offer</button>
</div>
</div>

</div>

<div class="card pad" style="margin-top:15px">
<div class="kicker">Negotiations</div>
<div class="title">Active Conversations</div>
<div class="list" id="convList"></div>
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
  const money = n => "৳" + Number(n).toLocaleString();

  const box = document.getElementById("messages");
  let current = null;
  let lastCount = -1;

   function bubble(m, otherName) {
    const mine = m.sender_role === me.role;
    let text;
    if (m.kind === "offer") text = (m.body ? esc(m.body) + ": " : "Offer: ") + money(m.amount) + " per unit";
    else if (m.kind === "accept") text = "✔ Accepted the offer of " + money(m.amount) + " per unit";
    else text = esc(m.body);

    return `
<div class="bubble-row ${mine ? "mine" : ""}">
  <div class="bubble">
    ${text}
    <div class="meta">${mine ? "You" : esc(otherName)} · ${esc((m.created_at || "").slice(11, 16))}</div>
  </div>
</div>`;
  }

  async function load() {
    let d;
    try {
      d = await api("neg_get.php" + (id ? "?id=" + id : ""));
    } catch (err) {
      box.innerHTML = "<p>" + esc(err.message) + "</p>";
      return;
    }

    document.getElementById("convList").innerHTML = d.list.length ? d.list.map(x => `
<a class="row" href="negotiations.html?id=${x.id}" style="text-decoration:none;color:inherit">
<div class="item">
<div class="icon">🌾</div>
<div>
<div class="ititle">${esc(x.crop_name)}</div>
<div class="meta">${esc(x.other)} ${x.district ? "· " + esc(x.district) : ""}</div>
</div>
</div>
<span class="badge ${x.status === "accepted" ? "ok" : "gold"}">${x.status === "accepted" ? "Agreed" : "Open"}</span>
</a>`).join("") : "<p>No negotiations yet. Open Browse Crops and click Negotiate.</p>";

    const n = d.negotiation;
    current = n;
    if (!n) {
      box.innerHTML = "";
      return;
    }
    id = n.id;

    const other = isBuyer ? n.farmer_name : n.buyer_name;
    document.getElementById("cropTitle").textContent = n.crop_name;
    document.getElementById("party").textContent = isBuyer ? n.farmer_name + " · " + n.district : n.buyer_name;
    document.getElementById("offerVal").textContent = money(n.current_offer);
    document.getElementById("availVal").textContent = Number(n.quantity).toLocaleString() + " " + n.unit;
    document.getElementById("listedVal").textContent = "Listed price: " + money(n.listed_price);

    const accepted = n.status === "accepted";
    document.getElementById("statusBadge").textContent = accepted ? "Agreed" : "Negotiating";

    const contact = document.getElementById("contact");
    if (accepted && isBuyer && n.phone) contact.innerHTML = "📞 Farmer's phone: <b>" + esc(n.phone) + "</b>";
    else if (accepted) contact.textContent = "Agreed. The buyer will place the order.";
    else contact.textContent = isBuyer ? "The farmer's phone is shown after the offer is accepted." : "";

 
    document.getElementById("acceptBtn").disabled = accepted || n.offered_by === me.role;
    document.getElementById("offerBtn").disabled = accepted;
    document.getElementById("orderBtn").style.display = (accepted && isBuyer) ? "block" : "none";
    document.getElementById("message").disabled = accepted;

    if (d.messages.length !== lastCount) {
      box.innerHTML = d.messages.map(m => bubble(m, other)).join("");
      box.scrollTop = box.scrollHeight;
      lastCount = d.messages.length;
    }
  }

  document.getElementById("messageForm").onsubmit = async (e) => {
    e.preventDefault();
    if (!current) return;
    const input = document.getElementById("message");
    const text = input.value.trim();
    if (!text) return;
    try {
      await api("neg_send.php", { id: current.id, kind: "text", body: text });
      input.value = "";
      load();
    } catch (err) { alert(err.message); }
  };

  document.getElementById("offerBtn").onclick = async () => {
    if (!current) return;
    const offer = prompt("Enter your price per unit:", Number(current.current_offer));
    if (!offer) return;
    try {
      await api("neg_send.php", { id: current.id, kind: "offer", amount: offer });
      load();
    } catch (err) { alert(err.message); }
  };

  document.getElementById("acceptBtn").onclick = async () => {
    if (!current) return;
    if (!confirm("Accept the current offer of " + money(current.current_offer) + " per unit?")) return;
    try {
      await api("neg_send.php", { id: current.id, kind: "accept" });
      alert(isBuyer
        ? "Offer accepted! The farmer's phone number is now visible."
        : "Offer accepted!");
      load();
    } catch (err) { alert(err.message); }
  };

    document.getElementById("orderBtn").onclick = async () => {
    if (!current) return;
    const qty = prompt("How many " + current.unit + " do you want to order?\n(Available: " + current.quantity + ")", current.quantity);
    if (!qty) return;
    try {
      const r = await api("order_create.php", { crop_id: current.crop_id, negotiation_id: current.id, quantity: qty });
      alert("Order placed!\nOrder ID: " + r.order_code + "\nTotal: ৳" + Number(r.total).toLocaleString());
      location.href = "order-tracking.html";
    } catch (err) { alert(err.message); }
  };

  load();
  setInterval(load, 5000);  
})();