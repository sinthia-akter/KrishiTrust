(async function () {
  await loadUser();

  window.pageTitle = "Farmer Registration";

  window.portalNav = `
<a href="index.html"><span>⌂</span>Home</a>
<a class="active" href="farmer-registration-main.html">
<span>👨‍🌾</span>Farmer Registration
</a>
<a href="buyer-registration.html">
<span>🛒</span>Buyer Registration
</a>
`;

  pageShell(`
<div class="page-head">
<div>
<div class="kicker">KrishiTrust</div>
<h1 class="page-title">Farmer Registration</h1>
<p class="page-sub">
Create your Farmer account on the KrishiTrust platform.
</p>
</div>
</div>

<div class="card pad">

<form class="form" id="farmerForm">

<div class="field">
<label>Full Name</label>
<input class="input" name="full_name" required autocomplete="name" placeholder="Your Full Name">
</div>

<div class="field">
<label>Mobile Number</label>
<input class="input" name="phone" type="tel" required autocomplete="tel" placeholder="01XXXXXXXXX">
</div>

<div class="field">
<label>Password</label>
<input class="input" name="password" type="password" required minlength="12" maxlength="72" autocomplete="new-password" placeholder="At least 12 characters">
</div>

<div class="field">
<label>District</label>
<select name="district" required>
<option value="Sylhet">Sylhet</option>
<option value="Dhaka">Dhaka</option>
<option value="Chattogram">Chattogram</option>
<option value="Rangpur">Rangpur</option>
<option value="Mymensingh">Mymensingh</option>
</select>
</div>

<div class="field">
<label>Land Area (Bigha)</label>
<input class="input" name="land_area" type="number" min="0.01" step="0.01" placeholder="Land Area">
</div>

<div class="field">
<label>Primary Crop</label>
<select name="primary_crop">
<option value="Aman Rice">Aman Rice</option>
<option value="Potato">Potato</option>
<option value="Jute">Jute</option>
<option value="Mustard">Mustard</option>
</select>
</div>

<div class="field full">
<button class="btn gold-btn" type="submit">
Create Farmer Account
</button>
</div>

</form>

</div>
`);

  document.getElementById("farmerForm").onsubmit = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;

    try {
      const data = await api("farmer_signup.php", new FormData(form));
      showMessage(
        "Account has been created successfully!\nFarmer ID: " + data.farmer_code +
        "\n\nUDC agent or admin will verify your account before you can sell crops."
      );
      location.href = "login.html";
    } catch (err) {
      showMessage(err.message);
    } finally {
      btn.disabled = false;
    }
  };
})();