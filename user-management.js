(async function () {
  await loadUser();

  window.pageTitle = "User Management";

  window.portalNav = `
<a href="admin.html"><span>◉</span>Admin Overview</a>
<a class="active" href="user-management.html"><span>👤</span>User Management</a>
<a href="farmer-verification.html"><span>👨‍🌾</span>Farmer Verification</a>
<a href="store-registry.html"><span>🏪</span>Store Registration</a>
<a href="loan-oversight.html"><span>💳</span>Loan Oversight</a>
<a href="analytics.html"><span>📈</span>Analytics</a>
<a href="system-health.html"><span>⚙️</span>System Health</a>
`;

  pageShell(`
<div class="page-head">
<div>
<div class="kicker">Admin</div>
<h1 class="page-title">User Management</h1>
<p class="page-sub">
Information and account management for all KrishiTrust users
</p>
</div>
</div>

<div class="grid g4">
<div class="card stat"><div class="stat-label">Total Users</div><div class="stat-value" id="sTotal">-</div></div>
<div class="card stat"><div class="stat-label">Farmers</div><div class="stat-value" id="sFarmers">-</div></div>
<div class="card stat"><div class="stat-label">Buyers</div><div class="stat-value" id="sBuyers">-</div></div>
<div class="card stat"><div class="stat-label">Active</div><div class="stat-value green" id="sActive">-</div></div>
</div>

<div class="card pad" id="addCard" style="margin-top:15px;display:none">
<div class="kicker">New Staff Account</div>
<div class="title">Create a UDC, Bank, Government or Store login</div>
<form class="form" id="addForm" style="margin-top:14px">
<div class="field">
<label>Full Name</label>
<input class="input" name="name" required maxlength="100" placeholder="Full name or organisation">
</div>
<div class="field">
<label>Role</label>
<select name="role">
<option value="udc">UDC Agent</option>
<option value="bank">Bank</option>
<option value="government">Government</option>
<option value="store">Store</option>
</select>
</div>
<div class="field">
<label>Email (used for login)</label>
<input class="input" name="email" type="email" required placeholder="name@example.com">
</div>
<div class="field">
<label>Password</label>
<input class="input" name="password" type="password" required minlength="12" maxlength="72" autocomplete="new-password" placeholder="At least 12 characters">
</div>
<div class="field full">
<button class="btn gold-btn" type="submit">Create Account</button>
</div>
</form>
</div>

<div class="card" style="margin-top:15px">

<div class="head">
<div class="title">User List</div>
<button class="btn gold-btn" id="addBtn">+ Add User</button>
</div>

<div style="padding:14px 17px 0">
<div class="filter" style="margin-bottom:6px">
<div class="search">
<span>⌕</span>
<input class="input" id="search" placeholder="Search name, email or phone...">
</div>
<select id="roleFilter" style="max-width:160px">
<option value="">All roles</option>
<option value="farmer">Farmer</option>
<option value="buyer">Buyer</option>
<option value="udc">UDC</option>
<option value="bank">Bank</option>
<option value="government">Government</option>
<option value="store">Store</option>
<option value="admin">Admin</option>
</select>
</div>
</div>

<div class="table">
<table>
<thead>
<tr>
<th>Name</th>
<th>Role</th>
<th>Login</th>
<th>District</th>
<th>Joining Date</th>
<th>Status</th>
<th></th>
</tr>
</thead>
<tbody id="userRows"></tbody>
</table>
</div>

</div>
`);

  function esc(s) {
    const d = document.createElement("div");
    d.textContent = s ?? "";
    return d.innerHTML;
  }
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const STATUS = { active: "ok", pending: "warn", blocked: "bad" };

  let all = [];
  let meId = 0;

  function render() {
    const q = document.getElementById("search").value.toLowerCase().trim();
    const role = document.getElementById("roleFilter").value;
    const rows = all.filter(u =>
      (!role || u.role === role) &&
      (!q || (u.name + " " + (u.contact || "")).toLowerCase().includes(q)));

    document.getElementById("userRows").innerHTML = rows.length ? rows.map(u => {
      let action = "";
      if (u.role !== "admin" && Number(u.id) !== meId) {
        action = u.status === "blocked"
          ? `<button class="btn ghost-gold" data-act="unblock" data-id="${u.id}">Unblock</button>`
          : `<button class="btn dark-btn" data-act="block" data-id="${u.id}">Block</button>`;
      }
      return `
<tr>
<td>${esc(u.name)}</td>
<td>${esc(cap(u.role))}</td>
<td>${esc(u.contact)}</td>
<td>${esc(u.district)}</td>
<td>${esc((u.created_at || "").slice(0, 10))}</td>
<td><span class="badge ${STATUS[u.status] || "warn"}">${esc(cap(u.status))}</span></td>
<td>${action}</td>
</tr>`;
    }).join("") : "<tr><td colspan='7'>No users found.</td></tr>";
  }

  async function load() {
    try {
      const d = await api("users_list.php");
      all = d.users;
      meId = Number(d.me);
      document.getElementById("sTotal").textContent = Number(d.stats.total).toLocaleString();
      document.getElementById("sFarmers").textContent = Number(d.stats.farmers).toLocaleString();
      document.getElementById("sBuyers").textContent = Number(d.stats.buyers).toLocaleString();
      document.getElementById("sActive").textContent =
        d.stats.total ? Math.round(100 * d.stats.active / d.stats.total) + "%" : "-";
      render();
    } catch (err) {
      document.getElementById("userRows").innerHTML = "<tr><td colspan='7'>" + esc(err.message) + "</td></tr>";
    }
  }

  document.getElementById("search").oninput = render;
  document.getElementById("roleFilter").onchange = render;

  document.getElementById("addBtn").onclick = () => {
    const c = document.getElementById("addCard");
    c.style.display = c.style.display === "none" ? "block" : "none";
  };

  document.getElementById("addForm").onsubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const btn = form.querySelector("button[type=submit]");
    btn.disabled = true;
    try {
      await api("user_create.php", new FormData(form));
      alert("Account created.\nLogin email: " + form.email.value +
            "\n\nGive the password to the user in person.");
      form.reset();
      document.getElementById("addCard").style.display = "none";
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      btn.disabled = false;
    }
  };

  document.getElementById("userRows").onclick = async (e) => {
    const btn = e.target.closest("button[data-act]");
    if (!btn) return;
    const verb = btn.dataset.act === "block" ? "Block" : "Unblock";
    if (!confirm(verb + " this user?")) return;
    btn.disabled = true;
    try {
      await api("user_status.php", { id: btn.dataset.id, action: btn.dataset.act });
      load();
    } catch (err) {
      alert(err.message);
      btn.disabled = false;
    }
  };

  load();
})();