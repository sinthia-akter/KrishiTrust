(async function () {
  await loadUser();

  window.pageTitle = "Register";
  window.portalNav = `
<a href="index.html"><span>⌂</span>Home</a>
<a class="active" href="register.html"><span>📝</span>Register</a>
<a href="login.html"><span>🔑</span>Login</a>
`;

  pageShell(`
<div class="page-head">
  <div>
    <div class="kicker">KrishiTrust</div>
    <h1 class="page-title">Create your account</h1>
    <p class="page-sub">Choose your role, then fill in your details.</p>
  </div>
</div>

<div class="card pad">
  <form class="form" id="regForm">

    <div class="field full">
      <label>I am a</label>
      <select name="role" id="role">
        <option value="farmer">Farmer</option>
        <option value="buyer">Buyer</option>
        <option value="store">Store Owner</option>
      </select>
    </div>

    <div id="fields" style="display:contents"></div>

    <div class="field full">
      <button class="btn gold-btn" type="submit">Create Account</button>
    </div>

  </form>
</div>
`);

  const form = document.getElementById("regForm");
  const roleSel = document.getElementById("role");
  const box = document.getElementById("fields");

  const DISTRICTS = ["Dhaka", "Chattogram", "Sylhet", "Rangpur", "Mymensingh"];
  const STORE_DISTRICTS = ["Dhaka", "Chattogram", "Sylhet", "Rangpur", "Mymensingh", "Rajshahi", "Comilla"];
  const opts = list => list.map(d => `<option value="${d}">${d}</option>`).join("");

  const PASSWORD = `
<div class="field">
  <label>Password</label>
  <input class="input" name="password" type="password" required minlength="12" maxlength="72" autocomplete="new-password" placeholder="At least 12 characters">
</div>`;

  function render() {

    const keep = {};
    ["phone", "password", "district", "email"].forEach(n => {
      if (form.elements[n]) keep[n] = form.elements[n].value;
    });

    const role = roleSel.value;
    let html = "";

    if (role === "farmer") {
      html = `
<div class="field">
  <label>Full Name</label>
  <input class="input" name="full_name" required autocomplete="name" placeholder="Your Full Name">
</div>
<div class="field">
  <label>Mobile Number (used for login)</label>
  <input class="input" name="phone" type="tel" required autocomplete="tel" placeholder="01XXXXXXXXX">
</div>
${PASSWORD}
<div class="field">
  <label>District</label>
  <select name="district" required>${opts(DISTRICTS)}</select>
</div>
<div class="field">
  <label>Land Area (Bigha)</label>
  <input class="input" name="land_area" type="number" min="0.01" step="0.01" placeholder="Land Area">
</div>
<div class="field">
  <label>Primary Crop</label>
  <select name="primary_crop">${opts(["Aman Rice", "Potato", "Jute", "Mustard"])}</select>
</div>`;
    } else if (role === "buyer") {
      html = `
<div class="field">
  <label>Company Name</label>
  <input class="input" name="company_name" required placeholder="Company Name">
</div>
<div class="field">
  <label>Contact Person's Name</label>
  <input class="input" name="contact_name" required autocomplete="name" placeholder="Full Name">
</div>
<div class="field">
  <label>Mobile Number (used for login)</label>
  <input class="input" name="phone" type="tel" required autocomplete="tel" placeholder="01XXXXXXXXX">
</div>
${PASSWORD}
<div class="field">
  <label>District</label>
  <select name="district" required>${opts(DISTRICTS)}</select>
</div>
<div class="field">
  <label>Email (optional)</label>
  <input class="input" name="email" type="email" placeholder="example@email.com">
</div>
<div class="field">
  <label>Business Type</label>
  <select name="business_type" required>${opts(["Retail Buyer", "Processing Company", "Food Company", "Exporter"])}</select>
</div>`;
    } else {
      html = `
<div class="field">
  <label>Your Name</label>
  <input class="input" name="name" required maxlength="100" autocomplete="name" placeholder="Owner's full name">
</div>
<div class="field">
  <label>Email (used for login)</label>
  <input class="input" name="email" type="email" required autocomplete="email" placeholder="shop@example.com">
</div>
${PASSWORD}
<div class="field">
  <label>District</label>
  <select name="district" required>${opts(STORE_DISTRICTS)}</select>
</div>
<div class="field">
  <label>Store Name</label>
  <input class="input" name="store_name" required maxlength="120" placeholder="e.g. Green Agro Store">
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
</div>`;
    }

    box.innerHTML = html;
    Object.keys(keep).forEach(n => { if (form.elements[n]) form.elements[n].value = keep[n]; });
  }

  roleSel.onchange = render;

  const wanted = new URLSearchParams(location.search).get("role");
  if (["farmer", "buyer", "store"].includes(wanted)) roleSel.value = wanted;
  render();

  const ENDPOINT = { farmer: "farmer_signup.php", buyer: "buyer_signup.php", store: "store_signup.php" };

  form.onsubmit = async (e) => {
    e.preventDefault();
    const role = roleSel.value;
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    try {
      const data = await api(ENDPOINT[role], new FormData(form));
      alert(
        role === "farmer"
          ? "Account created.\nFarmer ID: " + data.farmer_code +
            "\n\nA UDC agent or admin must verify you before you can sell crops."
          : role === "buyer"
          ? "Buyer account created. You can log in with your mobile number now."
          : "Store account created.\n\nYour store appears in the Store Finder once an admin verifies it.\nLog in with your email."
      );
      location.href = "login.html";
    } catch (err) {
      alert(err.message);
    } finally {
      btn.disabled = false;
    }
  };
})();