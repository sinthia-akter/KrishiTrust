(async function () {
  await loadUser();
  const me = window.currentUser;
  const isStore = me && me.role === "store";
  const canManage = me && (me.role === "admin" || me.role === "government");

  window.pageTitle = isStore ? "My Stores" : "Store Registry";

  window.portalNav = me && me.role === "admin" ? `
<a href="admin.html"><span>◉</span>Admin Overview</a>
<a href="user-management.html"><span>👤</span>User Management</a>
<a class="active" href="store-registry.html"><span>🏪</span>Store Registry</a>
<a href="loan-oversight.html"><span>💳</span>Loan Oversight</a>
<a href="analytics.html"><span>📈</span>Analytics</a>
<a href="system-health.html"><span>⚙️</span>System Health</a>
` : `
<a class="active" href="store-registry.html"><span>🏪</span>Store Registry</a>
`;

  pageShell(`
<div class="page-head">
<div>
<div class="kicker">${isStore ? "Store Owner" : "Admin"}</div>
<h1 class="page-title">${isStore ? "My Stores" : "Store Registry"}</h1>
<p class="page-sub">
${isStore
  ? "Register your store. It appears in the public Store Finder once it is verified."
  : "Management of registered agricultural stores on the platform."}
</p>
</div>
</div>

<div class="grid g3">

<div class="card stat">
<div class="stat-label">Total Registered</div>
<div class="stat-value" id="sTotal">-</div>
</div>

<div class="card stat">
<div class="stat-label">Pending Inspection</div>
<div class="stat-value gold" id="sPending">-</div>
</div>

<div class="card stat">
<div class="stat-label">Flagged</div>
<div class="stat-value" id="sFlagged" style="color:var(--red)">-</div>
</div>

</div>

<div class="card pad" id="addCard" style="margin-top:15px;display:none">
<div class="kicker">New Store</div>
<div class="title">${isStore ? "Register your store" : "Add a store to the registry"}</div>
<form class="form" id="addForm" style="margin-top:14px">
<div class="field">
<label>Store Name</label>
<input class="input" name="name" required maxlength="120" placeholder="e.g. Green Agro Store">
</div>
<div class="field">
<label>District</label>
<select name="district">
<option>Sylhet</option>
<option>Dhaka</option>
<option>Chattogram</option>
<option>Rangpur</option>
<option>Mymensingh</option>
<option>Rajshahi</option>
<option>Comilla</option>
</select>
</div>
<div class="field">
<label>Area / Market</label>
<input class="input" name="area" maxlength="100" placeholder="e.g. Amberkhana">
</div>
<div class="field">
<label>Store Type</label>
<select name="products">
<option>Agricultural Inputs</option>
<option>Seeds &amp; Fertilizers</option>
<option>Seeds &amp; Pesticides</option>
<option>Fertilizer &amp; Seeds</option>
<option>Farm Equipment</option>
</select>
</div>
<div class="field full">
<button class="btn gold-btn" type="submit">${isStore ? "Submit for Verification" : "Add Store"}</button>
</div>
</form>
</div>

<div class="card" style="margin-top:15px">

<div class="head">
<div class="title">Store List</div>
<button class="btn gold-btn" id="addBtn">+ Add Store</button>
</div>

<div class="table">

<table>

<thead>
<tr>
<th>Store Name</th>
<th>District</th>
<th>Area</th>
<th>Type</th>
<th>Status</th>
<th></th>
</tr>
</thead>

<tbody id="storeRows"></tbody>

</table>

</div>

</div>
`);

  function esc(s) {
    const d = document.createElement("div");
    d.textContent = s ?? "";
    return d.innerHTML;
  }
  const $ = id => document.getElementById(id);
  const BADGE = { verified: ["ok", "Active"], pending: ["warn", "Pending"], suspended: ["bad", "Flagged"] };

  function actions(s) {
    if (!canManage) return "";
    const b = (act, text, cls) => `<button class="btn ${cls}" data-act="${act}" data-id="${s.id}">${text}</button>`;
    if (s.status === "pending")   return b("verify", "Verify", "gold-btn") + " " + b("flag", "Flag", "dark-btn");
    if (s.status === "verified")  return b("flag", "Flag", "dark-btn");
    return b("verify", "Reinstate", "ghost-gold");
  }

  async function load() {
    try {
      const d = await api("stores_list.php");
      $("sTotal").textContent = Number(d.stats.total).toLocaleString();
      $("sPending").textContent = Number(d.stats.pending).toLocaleString();
      $("sFlagged").textContent = Number(d.stats.flagged).toLocaleString();

      $("storeRows").innerHTML = d.stores.length ? d.stores.map(s => {
        const bd = BADGE[s.status] || ["warn", s.status];
        return `
<tr>
<td>${esc(s.name)}</td>
<td>${esc(s.district)}</td>
<td>${esc(s.area || "-")}</td>
<td>${esc(s.products)}</td>
<td><span class="badge ${bd[0]}">${bd[1]}</span></td>
<td>${actions(s)}</td>
</tr>`;
      }).join("") : "<tr><td colspan='6'>No stores yet.</td></tr>";
    } catch (err) {
      $("storeRows").innerHTML = "<tr><td colspan='6'>" + esc(err.message) + "</td></tr>";
    }
  }

  $("addBtn").onclick = () => {
    const c = $("addCard");
    c.style.display = c.style.display === "none" ? "block" : "none";
  };

  $("addForm").onsubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const btn = form.querySelector("button[type=submit]");
    btn.disabled = true;
    try {
      const r = await api("store_add.php", new FormData(form));
      alert(r.status === "pending"
        ? "Store submitted. It will appear in the Store Finder once it is verified."
        : "Store added and verified.");
      form.reset();
      $("addCard").style.display = "none";
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      btn.disabled = false;
    }
  };

  $("storeRows").onclick = async (e) => {
    const b = e.target.closest("button[data-act]");
    if (!b) return;
    const text = { verify: "Verify / reinstate this store?", flag: "Flag this store? It will disappear from the Store Finder." }[b.dataset.act];
    if (!confirm(text)) return;
    b.disabled = true;
    try {
      await api("store_status.php", { id: b.dataset.id, action: b.dataset.act });
      load();
    } catch (err) {
      alert(err.message);
      b.disabled = false;
    }
  };

  load();
})();