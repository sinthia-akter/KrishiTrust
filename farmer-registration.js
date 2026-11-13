(async function () {
  await loadUser();                                  
  if (!requireRole(["udc", "admin"])) return;        

  window.pageTitle = "Farmer Registration";

  window.portalNav = `
<a href="udc.html"><span>◉</span>Dashboard</a>
<a href="udc.html#assist"><span>👨‍🌾</span>Farmer Assistance</a>
<a href="udc.html#loan"><span>💳</span>Loan Processing</a>
<a href="udc.html#nid"><span>✓</span>NID Verification</a>
<a class="active" href="farmer-registration.html"><span>📝</span>Farmer Registration</a>
`;

  pageShell(`
<div class="page-head">
<div>
<div class="kicker">UDC Agent</div>
<h1 class="page-title">Farmer Registration</h1>
<p class="page-sub">
Register new farmers on the KrishiTrust platform.
</p>
</div>
</div>

<div class="card pad">

<form class="form" id="registration">

<div class="field">
<label>Full Name</label>
<input class="input" name="full_name" required placeholder="Full Name">
</div>

<div class="field">
<label>NID Number</label>
<input class="input" name="nid" required placeholder="NID Number">
</div>

<div class="field">
<label>Mobile Number</label>
<input class="input" name="phone" required placeholder="01XXXXXXXXX">
</div>

<div class="field">
<label>District</label>
<select name="district">
<option>Sylhet</option>
<option>Dhaka</option>
<option>Rangpur</option>
<option>Mymensingh</option>
</select>
</div>

<div class="field">
<label>Land Area (Bigha)</label>
<input class="input" name="land_bigha" type="number" step="0.01" min="0" placeholder="Bigha">
</div>

<div class="field">
<label>Primary Crop</label>
<select name="primary_crop">
<option>Aman Rice</option>
<option>Potato</option>
<option>Jute</option>
<option>Mustard</option>
</select>
</div>

<div class="field">
<label>Gram/Union</label>
<input class="input" name="union_name" placeholder="Gram/Union Name">
</div>

<div class="field full">
<button class="btn gold-btn" type="submit">
Register Farmer
</button>
</div>

</form>

</div>
`);


  document.getElementById("registration").onsubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector("button[type=submit]");
    btn.disabled = true;                             
    try {
      const data = await api("farmer_register.php", new FormData(form));
      showMessage("Farmer registered successfully.\nFarmer ID: " + data.farmer_code);
      form.reset();
    } catch (err) {
      showMessage(err.message);                       
    } finally {
      btn.disabled = false;
    }
  };
})();