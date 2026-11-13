(async function () {
  await loadUser();

  window.pageTitle = "Buyer Registration";

  window.portalNav = `
<a href="index.html"><span>⌂</span>Home</a>
<a href="farmer-registration-main.html">
<span>👨‍🌾</span>Farmer Registration
</a>
<a class="active" href="buyer-registration.html">
<span>🛒</span>Buyer Registration
</a>
`;

  pageShell(`
<div class="page-head">
<div>
<div class="kicker">KrishiTrust</div>
<h1 class="page-title">Buyer Registration</h1>
<p class="page-sub">
Create a buyer account to directly collect crops from farmers.
</p>
</div>
</div>

<div class="card pad">

<form class="form" id="buyerForm">

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

<div class="field">
<label>Email (optional)</label>
<input class="input" name="email" type="email" placeholder="example@email.com">
</div>

<div class="field">
<label>Password</label>
<input class="input" name="password" type="password" required minlength="12" maxlength="72" autocomplete="new-password" placeholder="At least 12 characters">
</div>

<div class="field">
<label>District</label>
<select name="district" required>
<option value="Dhaka">Dhaka</option>
<option value="Chattogram">Chattogram</option>
<option value="Sylhet">Sylhet</option>
<option value="Rangpur">Rangpur</option>
<option value="Mymensingh">Mymensingh</option>
</select>
</div>

<div class="field">
<label>Business Type</label>
<select name="business_type" required>
<option value="Retail Buyer">Retail Buyer</option>
<option value="Processing Company">Processing Company</option>
<option value="Food Company">Food Company</option>
<option value="Exporter">Exporter</option>
</select>
</div>

<div class="field full">
<button class="btn gold-btn" type="submit">
Create Buyer Account
</button>
</div>

</form>

</div>
`);

  document.getElementById("buyerForm").onsubmit = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;

    try {
      await api("buyer_signup.php", new FormData(form));
      showMessage("Buyer account created. You can log in with your mobile number now.");
      location.href = "login.html";
    } catch (err) {
      showMessage(err.message);
    } finally {
      btn.disabled = false;
    }
  };
})();