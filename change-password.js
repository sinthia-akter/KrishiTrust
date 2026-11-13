(async function () {
  await loadUser();
  const me = window.currentUser;
  if (!me) { location.href = "login.html"; return; }

  const forced = Number(me.must_change) === 1;

  window.pageTitle = "Change Password";
  window.portalNav = `<a class="active" href="change-password.html"><span>🔑</span>Change Password</a>`;

  pageShell(`
<div class="page-head">
  <div>
    <div class="kicker">Account Security</div>
    <h1 class="page-title">Change your password</h1>
    <p class="page-sub">${forced
      ? "You are using a temporary password. Choose your own to continue."
      : "Choose a new password for your account."}</p>
  </div>
</div>

${forced ? `<div class="alert gold-alert" style="margin-bottom:15px">
You must change your temporary password before you can use KrishiTrust.
</div>` : ""}

<div class="card pad" style="max-width:520px">
  <form class="form" id="pwForm" style="grid-template-columns:1fr">
    <div class="field">
      <label>${forced ? "Temporary password" : "Current password"}</label>
      <input class="input" name="current_password" type="password" required autocomplete="current-password">
    </div>
    <div class="field">
      <label>New password</label>
      <input class="input" name="new_password" type="password" required minlength="12" maxlength="72" autocomplete="new-password" placeholder="At least 12 characters">
    </div>
    <div class="field">
      <label>Repeat new password</label>
      <input class="input" id="again" type="password" required minlength="12" maxlength="72" autocomplete="new-password">
    </div>
    <div class="field">
      <button class="btn gold-btn" type="submit">Change Password</button>
    </div>
  </form>
</div>
`);

  const HOME = {
    farmer: "farmer-dashboard.html", buyer: "buyer-dashboard.html", admin: "admin.html",
    government: "government.html", bank: "bank.html", udc: "udc.html", store: "store-registry.html",
  };

  document.getElementById("pwForm").onsubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.new_password.value !== document.getElementById("again").value) {
      alert("The two new passwords do not match.");
      return;
    }
    const btn = form.querySelector("button[type=submit]");
    btn.disabled = true;
    try {
      const r = await api("password_change.php", new FormData(form));
      alert("Password changed.");
      location.href = HOME[r.role] || "index.html";
    } catch (err) {
      alert(err.message);
    } finally {
      btn.disabled = false;
    }
  };
})();