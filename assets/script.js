// Portfolio interactions. Every control on the site performs a real action:
// project filters narrow the card grid, the About toggle expands the longer
// introduction, the K 12 evidence switch changes the tool used to verify the
// same KPI values, and the CaseAssist walkthrough advances through labeled
// demonstration stages.

(function () {
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

  var toggle = document.getElementById("about-toggle");
  var more = document.getElementById("about-more");
  if (toggle && more) {
    toggle.addEventListener("click", function () {
      var open = more.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.textContent = open ? "Show less" : "Read more";
    });
  }

  var toolBtns = document.querySelectorAll("[data-tool]");
  var toolNote = document.getElementById("tool-note");
  var notes = {
    python: "Computed with pandas in scripts and the analysis notebook. The notebook prints each value beside the chart it supports.",
    sql: "Computed with DuckDB SQL in the sql folder. The runner writes each result to outputs so it can be compared line by line.",
    excel: "Computed with live Excel formulas over the summary table in the reporting workbook. Change a source value and the KPIs update."
  };
  toolBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      toolBtns.forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
      btn.setAttribute("aria-pressed", "true");
      if (toolNote) toolNote.textContent = notes[btn.getAttribute("data-tool")] || "";
    });
  });

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
