const body = document.body;

body.innerHTML = `
<div class="landing">

  <section class="hero">
    <div class="hero-inner">

      <nav class="landing-nav">
        <a class="brand" href="index.html">
          <div class="brand-mark">KT</div>
          <div>
            <div class="brand-text">KrishiTrust</div>
            <span class="brand-sub">Agricultural Intelligence Platform</span>
          </div>
        </a>

        <div class="landing-links">
          <a href="#services">Services</a>
          <a href="#platform">Platform</a>
          <a href="browse-crops.html">Browse Crops</a>
          <a href="store-finder.html">Find Stores</a>
          <div id="authLinks" style="display:flex;align-items:center;gap:28px;margin-top:-20px"></div>
          <button id="themeToggle" type="button" class="theme-toggle" aria-label="Toggle theme">
  🌙
</button>
      
        </div>

      </nav>

      <div class="kicker">Bangladesh Agricultural Intelligence</div>

      <h1>
        Trust Between
        <span class="gold-text">Farmer, Market & Government</span>
      </h1>

      <p>
        Bangladesh’s premier agricultural intelligence platform —
        connecting 2.4 million farmers with verified markets,
        institutional credit, and real-time government support.
      </p>

            <div class="hero-actions">
        <a class="btn gold-btn" href="browse-crops.html">
          Browse Crops →
        </a>

        <a class="btn ghost-btn" href="store-finder.html">
          Find Stores →
        </a>
      </div>

      <div class="roles">

        <a class="role" href="farmer-dashboard.html">
          <div class="role-icon">🌾</div>
          <b>Farmer</b>
          <span>Sell crops & access services</span>
        </a>

        <a class="role" href="buyer-dashboard.html">
          <div class="role-icon">🛒</div>
          <b>Buyer</b>
          <span>Procure verified crops</span>
        </a>

        <a class="role" href="bank.html">
          <div class="role-icon">🏦</div>
          <b>Bank</b>
          <span>Agri finance platform</span>
        </a>

        <a class="role" href="government.html">
          <div class="role-icon">🏛️</div>
          <b>Government</b>
          <span>Policy & disaster response</span>
        </a>

        <a class="role" href="udc.html">
          <div class="role-icon">🏢</div>
          <b>UDC Agent</b>
          <span>Local digital services</span>
        </a>

        <a class="role" href="admin.html">
          <div class="role-icon">⚙️</div>
          <b>Admin</b>
          <span>Platform administration</span>
        </a>

      </div>
    </div>
  </section>

  <section class="landing-section" id="platform">

    <div class="center">
      <div class="kicker">National Agricultural Network</div>
      <h2 class="landing-title">Built for Bangladesh’s Agriculture</h2>
      <p class="landing-sub">
        One connected platform for farmers, buyers, banks and government.
      </p>
    </div>

    <div class="stats">

      <div class="strip">
        <b>2.4M+</b>
        <span>Registered Farmers<br>Across 64 Districts</span>
      </div>

      <div class="strip">
        <b>৳18.7B</b>
        <span>Loans Disbursed<br>In FY 2023–24</span>
      </div>

      <div class="strip">
        <b>98,400</b>
        <span>Verified Agri Stores<br>Certified & Inspected</span>
      </div>

      <div class="strip">
        <b>340K</b>
        <span>Transactions Monthly<br>Marketplace Volume</span>
      </div>

    </div>

  </section>

  <section class="landing-section" id="services">

    <div class="center">
      <div class="kicker">Platform Modules</div>
      <h2 class="landing-title">
        Integrated Agricultural Intelligence
      </h2>
      <p class="landing-sub">
        Six interconnected modules covering every stage of the agricultural value chain.
      </p>
    </div>

    <div class="modules">

      <div class="module">
        <div class="module-icon">🏪</div>
        <h3>Local Verified Sales Centers</h3>
        <p>
          Find verified agricultural input stores near you.
        </p>
      </div>

      <div class="module">
        <div class="module-icon">💳</div>
        <h3>Agriculture loan help</h3>
        <p>
          Access institutional agricultural financing.
        </p>
      </div>

      <div class="module">
        <div class="module-icon">🌊</div>
        <h3>Disaster relief support</h3>
        <p>
          Register crop damage and access relief support.
        </p>
      </div>

      <div class="module">
        <div class="module-icon">🌾</div>
        <h3>Crop Market</h3>
        <p>
          Connect farmers directly with verified buyers.
        </p>
      </div>

      <div class="module">
        <div class="module-icon">🤝</div>
        <h3>Joint Crop Collection</h3>
        <p>
          Combine farmer supply for larger procurement.
        </p>
      </div>

      <div class="module">
        <div class="module-icon">🏛️</div>
        <h3>Government Portal</h3>
        <p>
          Real-time agricultural monitoring and support.
        </p>
      </div>

    </div>

  </section>

  <footer class="footer">
    © 2026 KrishiTrust · Bangladesh Agricultural Intelligence Platform
  </footer>

</div>
`;

(async function () {
  const box = document.getElementById("authLinks");
  if (!box) return;

  box.innerHTML = `
    <a href="login.html">Login</a>
    <a href="register.html">Register</a>
  `;

  let u = null;
  try {
    const res = await fetch("api/me.php");
    const data = await res.json();
    u = data.user;
  } catch (err) {
    console.log("me.php failed:", err);
    return;
  }
  if (!u) return;

  const home = {
    farmer: "farmer-dashboard.html",
    buyer: "buyer-dashboard.html",
    admin: "admin.html",
    government: "government.html",
    bank: "bank.html",
    udc: "udc.html",
    store: "store-registry.html",
  };

 
  box.innerHTML = `
    <a href="${home[u.role] || "index.html"}">My Dashboard</a>
    <a href="#" id="logoutLink">Logout</a>
  `;

  document.getElementById("logoutLink").onclick = async (e) => {
    e.preventDefault();
    await fetch("api/logout.php", { method: "POST" });
    location.reload();
  };
})();
