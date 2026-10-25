// Portfolio interactions. Every control performs a real action:
// project filters narrow the card grid, the About toggle expands the longer
// introduction, the K 12 explorer recomputes its cards, table, and bars from
// the project data embedded below, the CaseAssist classifier runs the same
// rules as the implemented Apex class, and the Healthcare explorer maps each
// business question to the deliverable that answers it.

(function () {
  // ---------- Project filters (homepage) ----------
  var chips = document.querySelectorAll(".chip[data-filter]");
  var cards = document.querySelectorAll(".project-card[data-areas]");
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      chips.forEach(function (c) { c.setAttribute("aria-pressed", "false"); });
      chip.setAttribute("aria-pressed", "true");
      var f = chip.getAttribute("data-filter");
      cards.forEach(function (card) {
        var areas = card.getAttribute("data-areas").split(" ");
        var show = f === "all" || areas.indexOf(f) !== -1;
        card.classList.toggle("hidden-card", !show);
      });
    });
  });

  // ---------- About longer version toggle (homepage) ----------
  var toggle = document.getElementById("about-toggle");
  var more = document.getElementById("about-more");
  if (toggle && more) {
    toggle.addEventListener("click", function () {
      var open = more.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.textContent = open ? "Show less" : "Read more";
    });
  }

  // ---------- K 12 explorer (project page) ----------
  // All values computed from the project processed data and reconciled
  // across Python, SQL, and Excel in the repository.
  var K12 = {
    all: {
      tiles: [["110", "Students in the analysis population"],
              ["91.84", "Average attendance rate, percent"],
              ["78.48", "Average assessment score"],
              ["75.7%", "Students at benchmark, 81 of 107"]],
      head: ["Measure", "Value", "Base"],
      rows: [["Analysis population", "110 students", "Active enrollments"],
             ["Students with attendance", "108", "Attendance records"],
             ["Students with assessment", "107", "Assessment records"],
             ["Chronic absence", "36 of 108 · 33.3%", "Attendance below 90 percent"]],
      barsTitle: "Percent at benchmark by subject",
      bars: [["ELA", 87.5], ["Math", 76.5], ["Science", 65.9]],
      note: "Each student took one subject, so the subject bars compare different groups of students and are read with that caution."
    },
    grade: {
      tiles: [["40", "Students in the largest grade, Grade 8"],
              ["80.52", "Highest grade average score, Grade 5"],
              ["81.8%", "Highest at benchmark, Grade 7"],
              ["63.6%", "Lowest at benchmark, Grade 6"]],
      head: ["Grade", "Students", "Avg attendance", "Avg score", "At benchmark", "Chronic absence"],
      rows: [["Grade 5", "25", "91.36", "80.52", "76.0%", "36.0%"],
             ["Grade 6", "22", "91.85", "76.50", "63.6%", "36.4%"],
             ["Grade 7", "23", "93.25", "77.05", "81.8%", "19.0%"],
             ["Grade 8", "40", "91.38", "79.11", "78.9%", "37.5%"]],
      barsTitle: "Percent at benchmark by grade",
      bars: [["Grade 5", 76.0], ["Grade 6", 63.6], ["Grade 7", 81.8], ["Grade 8", 78.9]],
      note: "Grade 6 is the weakest benchmark grade. Grade 7 pairs the strongest attendance with the strongest benchmark share."
    },
    program: {
      tiles: [["55", "Students in Core"],
              ["93.14", "Core average attendance, percent"],
              ["88.2%", "MTSS Tier 2 at benchmark, the highest share"],
              ["50.0%", "MTSS Tier 1 chronic absence"]],
      head: ["Program", "Students", "Avg attendance", "Avg score", "At benchmark", "Chronic absence"],
      rows: [["Core", "55", "93.14", "78.96", "79.2%", "20.0%"],
             ["MTSS Tier 1", "28", "90.08", "74.93", "60.7%", "50.0%"],
             ["MTSS Tier 2", "18", "90.72", "80.06", "88.2%", "44.4%"],
             ["MTSS Tier 3", "9", "91.16", "83.67", "77.8%", "44.4%"]],
      barsTitle: "Percent at benchmark by program",
      bars: [["Core", 79.2], ["Tier 1", 60.7], ["Tier 2", 88.2], ["Tier 3", 77.8]],
      note: "MTSS Tier 1 shows the weakest attendance and benchmark results, and half of that group sits in chronic absence."
    },
    subject: {
      tiles: [["87.5%", "ELA at benchmark"],
              ["76.5%", "Math at benchmark"],
              ["65.9%", "Science at benchmark"],
              ["26", "Students below benchmark overall"]],
      head: ["Subject", "At benchmark", "Reading note"],
      rows: [["ELA", "87.5%", "Strongest subject result"],
             ["Math", "76.5%", "Middle of the three subjects"],
             ["Science", "65.9%", "Holds 14 of the 26 Below results"]],
      barsTitle: "Percent at benchmark by subject",
      bars: [["ELA", 87.5], ["Math", 76.5], ["Science", 65.9]],
      note: "Each student took one subject, so these bars compare different groups of students, not the same students across subjects."
    }
  };
  var k12Btns = document.querySelectorAll("[data-k12view]");
  var k12Tiles = document.getElementById("k12-tiles");
  var k12Head = document.getElementById("k12-head");
  var k12Body = document.getElementById("k12-body");
  var k12Bars = document.getElementById("k12-bars");
  var k12BarsTitle = document.getElementById("k12-bars-title");
  var k12Note = document.getElementById("k12-note");
  function renderK12(key) {
    var v = K12[key];
    if (!v || !k12Tiles) return;
    k12Tiles.innerHTML = v.tiles.map(function (t) {
      return '<div class="kpi"><span class="value">' + t[0] + '</span><span class="label">' + t[1] + "</span></div>";
    }).join("");
    k12Head.innerHTML = "<tr>" + v.head.map(function (h) { return "<th>" + h + "</th>"; }).join("") + "</tr>";
    k12Body.innerHTML = v.rows.map(function (r) {
      return "<tr>" + r.map(function (c, i) { return i === 0 ? "<td><strong>" + c + "</strong></td>" : "<td>" + c + "</td>"; }).join("") + "</tr>";
    }).join("");
    k12BarsTitle.textContent = v.barsTitle;
    k12Bars.innerHTML = v.bars.map(function (b) {
      return '<div class="bar-row"><span>' + b[0] + '</span><div class="bar-track"><div class="bar-fill" style="width:' + b[1] + '%"></div></div><span>' + b[1] + "%</span></div>";
    }).join("");
    k12Note.textContent = v.note;
  }
  k12Btns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      k12Btns.forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
      btn.setAttribute("aria-pressed", "true");
      renderK12(btn.getAttribute("data-k12view"));
    });
  });
  if (k12Btns.length) renderK12("all");

  // ---------- CaseAssist classifier (project page) ----------
  // The same rules, in the same order, as ClaimRiskClassifier.cls in the
  // project repository. This is a web run of implemented Apex logic.
  var caRun = document.getElementById("ca-run");
  if (caRun) {
    var caPolicy = document.getElementById("ca-policy");
    var caAmount = document.getElementById("ca-amount");
    var caBlank = document.getElementById("ca-blank");
    var caResult = document.getElementById("ca-result");
    caRun.addEventListener("click", function () {
      var risk, rule, why;
      var raw = caAmount.value.trim();
      var amount = raw === "" ? null : parseFloat(raw);
      if (caBlank.checked) amount = null;
      if (caPolicy.value !== "Active") {
        risk = "High"; rule = "Rule 1";
        why = "The related policy is not Active, so the claim is High risk before the amount is considered.";
      } else if (amount === null || isNaN(amount)) {
        risk = "Medium"; rule = "Rule 2";
        why = "No estimated amount is recorded, so the classifier cannot place the claim in a lower band.";
      } else if (amount >= 10000) {
        risk = "High"; rule = "Rule 3";
        why = "The estimated amount is 10000 or more.";
      } else if (amount >= 2000) {
        risk = "Medium"; rule = "Rule 4";
        why = "The estimated amount is 2000 or more and below 10000.";
      } else {
        risk = "Low"; rule = "Rule 5";
        why = "The policy is Active and the estimated amount is below 2000.";
      }
      caResult.innerHTML =
        '<p style="margin:0"><span class="risk ' + risk.toLowerCase() + '">' + risk + " risk</span></p>" +
        '<p style="margin:10px 0 0"><strong>' + rule + ".</strong> " + why + "</p>" +
        '<p style="margin:6px 0 0;color:var(--ink-soft)">A claim created by ClaimCreationService starts with Claim_Status__c set to New. Classification runs as a separate step, exactly as it does here.</p>';
      caResult.style.display = "block";
    });
  }

  // ---------- Healthcare requirements explorer (project page) ----------
  var HC = {
    "1": ["SQL analysis", "The query set computes completion, cancellation, and no show performance across the full appointment population.", "sql/healthcare_analysis.sql"],
    "2": ["SQL analysis", "The specialty comparison in the query set ranks no show rates by specialty.", "sql/healthcare_analysis.sql"],
    "3": ["SQL analysis", "The location comparison in the query set ranks cancellation rates by location.", "sql/healthcare_analysis.sql"],
    "4": ["SQL analysis and Insights", "Lead time is compared against missed appointments in the query set, and the insights folder records what the pattern means for scheduling.", "sql/healthcare_analysis.sql"],
    "5": ["Dashboard material and SQL analysis", "Wait time distributions are computed in SQL and presented in the dashboard material.", "dashboard"],
    "6": ["Dashboard material and Insights", "Satisfaction is read against wait time in the dashboard material, with the reading recorded in insights.", "dashboard"],
    "7": ["SQL analysis", "Scheduled workload is aggregated per provider in the query set.", "sql/healthcare_analysis.sql"],
    "8": ["SQL analysis", "Appointment types are compared across the outcome measures in the query set.", "sql/healthcare_analysis.sql"]
  };
  var hcBtns = document.querySelectorAll("[data-hcq]");
  var hcPanel = document.getElementById("hc-panel");
  hcBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      hcBtns.forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
      btn.setAttribute("aria-pressed", "true");
      var item = HC[btn.getAttribute("data-hcq")];
      if (!item || !hcPanel) return;
      hcPanel.innerHTML =
        "<h3>Answered by: " + item[0] + "</h3>" +
        "<p>" + item[1] + "</p>" +
        '<p>Repository path: <a href="https://github.com/tariniakula01-pixel/healthcare-operations-analytics/tree/main/' + item[2].split("/")[0] + '">' + item[2] + "</a></p>" +
        '<p style="color:var(--ink-soft)">Every question is also traced in business-analysis/requirements-traceability-matrix.csv, which links each requirement to the analysis that answers it.</p>';
    });
  });

  // ---------- CaseAssist guided walkthrough (project page) ----------
  var stages = document.querySelectorAll(".walk-stage");
  var prev = document.getElementById("walk-prev");
  var next = document.getElementById("walk-next");
  var label = document.getElementById("walk-label");
  var current = 0;
  function showStage(i) {
    stages.forEach(function (s, idx) { s.classList.toggle("active", idx === i); });
    if (label) label.textContent = "Step " + (i + 1) + " of " + stages.length;
    if (prev) prev.disabled = i === 0;
    if (next) next.disabled = i === stages.length - 1;
  }
  if (stages.length && prev && next) {
    prev.addEventListener("click", function () { if (current > 0) { current--; showStage(current); } });
    next.addEventListener("click", function () { if (current < stages.length - 1) { current++; showStage(current); } });
    showStage(0);
  }
})();
