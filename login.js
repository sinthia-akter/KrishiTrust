(async function () {
  await loadUser();

  window.pageTitle = "Login";
  window.portalNav = `<a href="index.html"><span>🏠</span>Home</a>`;

  pageShell(`
    <div class="card" style="max-width:420px;margin:40px auto;padding:24px">
      <h2>Login</h2>
      <form id="loginForm">
        <label>Mobile number (farmer / buyer) or email (staff)</label>
        <input type="text" name="login" required placeholder="01XXXXXXXXX or name@example.com" style="width:100%;margin-bottom:12px">

        <label>Password</label>
        <input type="password" name="password" required style="width:100%;margin-bottom:12px">

        <button type="submit">Login</button>
      </form>
    </div>
  `);

  document.getElementById("loginForm").onsubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await api("login.php", new FormData(e.target));
            if (Number(data.must_change) === 1) { location.href = "change-password.html"; return; }

      const home = {
        farmer: "farmer-dashboard.html",
        buyer: "buyer-dashboard.html",
        admin: "admin.html",
        government: "government.html",
        bank: "bank.html",
        udc: "udc.html",
        store: "store-registry.html",
      };
      location.href = home[data.role] || "index.html";
    } catch (err) {
      showMessage(err.message);
    }
  };
})();