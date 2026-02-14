const categories = ["Water", "Lube Oil", "Grease", "Diesel", "Misc"];
const zones = ["CR", "ECR", "ER", "NCR", "NER", "NFR", "NR", "NWR", "SCR", "SECR", "SER", "SWR", "SR", "WCR", "WR", "ECOR", "RWF", "CLW"];
const standards = {
  "IS 10500": ["pH", "TDS", "Turbidity", "Chloride"],
  "IS 1448": ["Flash Point", "Viscosity", "Density", "Acidity"],
  "ASTM D975": ["Cetane Index", "Water Content", "Sulphur", "Cloud Point"]
};

const state = {
  category: null,
  sampleMeta: null,
  samples: [],
  selectedTests: [],
  dataEntry: {},
  records: JSON.parse(localStorage.getItem("cmt_records") || "[]")
};

const el = (id) => document.getElementById(id);
const cap = (s) => s.replace(/\b\w/g, c => c.toUpperCase());

function init() {
  renderCategoryButtons();
  renderZoneOptions();
  renderStandardList();
  wireEvents();
}

function renderCategoryButtons() {
  const wrap = el("categoryButtons");
  wrap.innerHTML = "";
  categories.forEach((cat) => {
    const btn = document.createElement("button");
    btn.textContent = cat;
    btn.onclick = () => selectCategory(cat, btn);
    wrap.appendChild(btn);
  });
}

function selectCategory(cat, btn) {
  state.category = cat;
  document.querySelectorAll("#categoryButtons button").forEach((b) => b.classList.remove("selected"));
  btn.classList.add("selected");
  el("sampleDetailsCard").classList.remove("hidden");
  renderEntryModeArea();
  loadTestsFromStandard("IS 10500");
}

function renderZoneOptions() {
  const zoneSelect = el("zoneSelect");
  zoneSelect.innerHTML = `<option value="">Select Zone</option>${zones.map(z => `<option>${z}</option>`).join("")}`;
}

function renderStandardList() {
  const dl = el("standardList");
  dl.innerHTML = Object.keys(standards).map((s) => `<option value="${s}"></option>`).join("");
}

function wireEvents() {
  el("zoneSelect").addEventListener("change", (e) => {
    const isNWR = e.target.value === "NWR";
    el("divisionWrapper").classList.toggle("hidden", !isNWR);
    el("divisionInput").required = isNWR;
  });

  el("standardSearch").addEventListener("input", (e) => loadTestsFromStandard(e.target.value));

  el("sampleForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    state.sampleMeta = Object.fromEntries(fd.entries());
    state.samples = getSamplesFromEntryArea();
    if (!state.samples.length) return alert("Please add at least one sample entry");
    renderDataEntryUI();
    el("dataEntryCard").classList.remove("hidden");
  });

  el("saveDataBtn").addEventListener("click", () => {
    el("submitCard").classList.remove("hidden");
    renderBillingTable();
  });

  el("chargesApplicable").addEventListener("change", renderBillingTable);
  el("finalSubmitBtn").addEventListener("click", submitRecord);

  document.querySelectorAll("[data-query]").forEach((btn) => {
    btn.addEventListener("click", () => runQuery(btn.dataset.query));
  });
}

function renderEntryModeArea() {
  const area = el("entryModeArea");
  const isBatch = ["Water", "Diesel"].includes(state.category);
  if (isBatch) {
    area.innerHTML = `
      <h3>Batch Entry Table</h3>
      <table class="sample-table" id="batchTable">
        <thead><tr><th>Lab No</th><th>Source</th><th>Location</th><th></th></tr></thead>
        <tbody></tbody>
      </table>
      <button type="button" id="addRowBtn">+ Add Sample</button>
    `;
    el("addRowBtn").onclick = () => addBatchRow();
    addBatchRow();
  } else {
    area.innerHTML = `
      <h3>Single Form (Lube / Grease / Misc)</h3>
      <div class="grid-2">
        <label>Lab No <input id="singleLabNo" required /></label>
        <label>PO No <input id="poNo" required /></label>
        <label>PL No <input id="plNo" required /></label>
        <label>PO Date <input id="poDate" type="date" required /></label>
      </div>
    `;
  }
}

function addBatchRow() {
  const tbody = document.querySelector("#batchTable tbody");
  const row = document.createElement("tr");
  row.innerHTML = `
    <td><input placeholder="Lab No" required></td>
    <td><input list="sourceList" placeholder="e.g. Borewell / Mobile Tanker" required></td>
    <td><input list="locationList" placeholder="e.g. Platform" required></td>
    <td><button type="button">x</button></td>
  `;
  row.querySelector("button").onclick = () => row.remove();
  tbody.appendChild(row);

  if (!document.getElementById("sourceList")) {
    document.body.insertAdjacentHTML("beforeend", `
      <datalist id="sourceList"><option>Borewell</option><option>RO</option><option>Open Well</option><option>Mobile Tanker</option></datalist>
      <datalist id="locationList"><option>Platform</option><option>Waiting Room</option><option>Station Canteen</option></datalist>
    `);
  }
}

function loadTestsFromStandard(input) {
  const standard = Object.keys(standards).find((s) => s.toLowerCase().includes((input || "").toLowerCase())) || "IS 10500";
  const tests = standards[standard] || [];
  const container = el("testsContainer");
  container.innerHTML = tests.map((t, i) => `
    <label class="inline-row">
      ${t}
      <select data-test="${t}" ${i === 0 ? "" : ""}>
        <option value="yes">Facility Yes</option>
        <option value="no">Facility No</option>
      </select>
    </label>
  `).join("");
  state.selectedTests = tests;
}

function getSamplesFromEntryArea() {
  const isBatch = ["Water", "Diesel"].includes(state.category);
  if (isBatch) {
    return [...document.querySelectorAll("#batchTable tbody tr")].map((row) => {
      const [labNo, source, location] = [...row.querySelectorAll("input")].map((i) => i.value.trim());
      return { labNo, source, location };
    }).filter((s) => s.labNo);
  }

  return [{
    labNo: el("singleLabNo").value.trim(),
    poNo: el("poNo").value.trim(),
    plNo: el("plNo").value.trim(),
    poDate: el("poDate").value
  }].filter((s) => s.labNo);
}

function activeTests() {
  return [...el("testsContainer").querySelectorAll("select[data-test]")]
    .filter((s) => s.value === "yes")
    .map((s) => s.dataset.test);
}

function renderDataEntryUI() {
  const tests = activeTests();
  state.selectedTests = tests;
  const tabs = el("sampleTabs");
  tabs.innerHTML = "";
  const form = el("dataEntryForm");
  form.innerHTML = "";

  state.samples.forEach((sample, idx) => {
    const tab = document.createElement("button");
    tab.type = "button";
    tab.className = "tab-btn";
    tab.textContent = `Lab-${idx + 1} (${sample.labNo})`;
    tab.onclick = () => renderSampleEntryForm(idx, tests);
    tabs.appendChild(tab);
  });

  renderSampleEntryForm(0, tests);
  el("saveDataBtn").classList.remove("hidden");
}

function renderSampleEntryForm(sampleIdx, tests) {
  const form = el("dataEntryForm");
  const sample = state.samples[sampleIdx];
  const isWater = state.category === "Water";
  form.innerHTML = `<h3>Data Entry for ${sample.labNo}</h3>` + tests.map((test) => {
    return isWater
      ? `<label>${test} Value <input data-sample="${sampleIdx}" data-test="${test}" type="number" step="any"></label>`
      : `<div class="grid-3"><label>${test} Reading 1 <input data-sample="${sampleIdx}" data-test="${test}" data-kind="r1" type="number" step="any"></label><label>Reading 2 <input data-sample="${sampleIdx}" data-test="${test}" data-kind="r2" type="number" step="any"></label><label>Temperature <input data-sample="${sampleIdx}" data-test="${test}" data-kind="temp" type="number" step="any"></label></div>`;
  }).join("");

  form.oninput = () => captureFormData();
}

function captureFormData() {
  document.querySelectorAll("#dataEntryForm input").forEach((inp) => {
    const s = inp.dataset.sample;
    const t = inp.dataset.test;
    const k = inp.dataset.kind || "value";
    state.dataEntry[s] ??= {};
    state.dataEntry[s][t] ??= {};
    state.dataEntry[s][t][k] = Number(inp.value || 0);
    if (k !== "value") {
      const { r1 = 0, r2 = 0, temp = 0 } = state.dataEntry[s][t];
      state.dataEntry[s][t].calculated = Number(((r1 + r2) / 2 + temp * 0.01).toFixed(3));
    }
  });
}

function renderBillingTable() {
  const wrap = el("billingTable");
  if (el("chargesApplicable").value === "no") {
    wrap.innerHTML = "<p>No charges will be attached.</p>";
    return;
  }

  wrap.innerHTML = `<table class="sample-table"><thead><tr><th>Test</th><th>Amount (₹)</th></tr></thead><tbody>
    ${state.selectedTests.map((t) => `<tr><td>${t}</td><td><input data-charge="${t}" type="number" min="0" value="0"></td></tr>`).join("")}
  </tbody></table>`;
}

function submitRecord() {
  const billing = {};
  let total = 0;
  if (el("chargesApplicable").value === "yes") {
    document.querySelectorAll("input[data-charge]").forEach((i) => {
      const amt = Number(i.value || 0);
      billing[i.dataset.charge] = amt;
      total += amt;
    });
  }

  const payload = {
    id: `REC-${Date.now()}`,
    category: state.category,
    meta: state.sampleMeta,
    tests: state.selectedTests,
    samples: state.samples,
    dataEntry: state.dataEntry,
    chargesApplicable: el("chargesApplicable").value === "yes",
    billing,
    total,
    createdAt: new Date().toISOString()
  };

  state.records.push(payload);
  localStorage.setItem("cmt_records", JSON.stringify(state.records));
  generateDocxLikeReport(payload);
  el("submitStatus").textContent = `Saved ${payload.id}. Total Charges: ₹${total}`;
}

function generateDocxLikeReport(record) {
  const lines = [
    "Indian Railways Laboratory Management System (CMT)",
    `Record: ${record.id}`,
    `Category: ${record.category}`,
    `Zone: ${record.meta.zone}`,
    `Division: ${record.meta.division || "-"}`,
    `Letter No: ${record.meta.letterNo}`,
    "",
    "Samples:",
    ...record.samples.map((s, i) => `${i + 1}. ${JSON.stringify(s)}`),
    "",
    "Tests:",
    ...record.tests,
    "",
    `Total Charges: ₹${record.total}`
  ].join("\n");

  const blob = new Blob([lines], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${record.id}.docx`;
  a.click();
  URL.revokeObjectURL(a.href);
}

function runQuery(type) {
  const year = Number(el("queryYear").value);
  const zone = el("queryZone").value.trim();
  const division = el("queryDivision").value.trim();
  const testName = el("queryTestName").value.trim();

  let rows = state.records.filter((r) => new Date(r.createdAt).getFullYear() === year);
  if (zone) rows = rows.filter((r) => r.meta.zone === zone);
  if (division) rows = rows.filter((r) => r.meta.division === division);

  const output = (() => {
    switch (type) {
      case "waterCount":
        return { query: "Water Count", count: rows.filter((r) => r.category === "Water").length };
      case "lubeCount":
        return { query: "Lube Count", count: rows.filter((r) => r.category === "Lube Oil").length };
      case "dieselCount":
        return { query: "Diesel Count", count: rows.filter((r) => r.category === "Diesel").length };
      case "testLoad":
        return { query: "Specific Test Load", testName, count: rows.filter((r) => r.tests.includes(testName)).length };
      case "totalWorkload":
        return {
          query: "Total Workload",
          testsPerformed: rows.reduce((acc, r) => acc + (r.tests.length * r.samples.length), 0),
          records: rows.length
        };
      default:
        return { error: "Unknown query" };
    }
  })();

  el("queryOutput").textContent = JSON.stringify(output, null, 2);
}

init();
