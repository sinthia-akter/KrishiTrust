window.pageTitle = "Issue Notice";

window.portalNav = `
<a href="government.html"><span>◉</span>Overview</a>
<a href="disaster-management.html"><span>🌊</span>Disaster management</a>
<a href="subsidy-allocation.html"><span>💰</span>Subsidy Allocation</a>
<a href="store-inspection.html"><span>🏪</span>Store Inspection</a>
<a href="district-reports.html"><span>📊</span>District Reports</a>
<a class="active" href="issue-notice.html"><span>📣</span>Issue Notice</a>
`;

pageShell(`
<div class="page-head">
<div>
<div class="kicker">Government Portal</div>
<h1 class="page-title">Issue Notice</h1>
<p class="page-sub">
Notify farmers and related institutions about government directives.
</p>
</div>
</div>

<div class="card pad">

<div class="form">

<div class="field">
<label>Notice Type</label>
<select id="type">
<option>Flood Relief</option>
<option>Subsidy Distribution</option>
<option>Crop Advisory</option>
<option>Market Price Update</option>
<option>Policy Change</option>
</select>
</div>

<div class="field">
<label>Target District</label>
<select id="district">
<option>All Districts</option>
<option>Sylhet Division</option>
<option>Dhaka Division</option>
<option>Chittagong Division</option>
</select>
</div>

<div class="field full">
<label>Notice Message</label>
<textarea id="notice"
placeholder="Enter the notice message..."></textarea>
</div>

<div class="field full">
<button class="btn gold-btn" id="issue">
Issue Notice
</button>
</div>

</div>

</div>
`);

document.getElementById("issue").onclick = () => {

const message =
document.getElementById("notice").value.trim();

if (!message) {
showMessage("Please enter the notice message.");
return;
}

showMessage("Notice issued successfully.");

};