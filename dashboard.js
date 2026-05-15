/* ============================================================
   Vonovia Management Dashboard – Chart.js rendering
   Grouped by Balanced Scorecard perspectives
   ============================================================ */

(() => {
    "use strict";

    // ── Data ──
    const labels = [2019, 2020, 2021, 2022, 2023, 2024, 2025];

    const DATA = {
        ebitda:       [1760.1, 1909.8, 2254.4, 2606.1, 2583.8, 2641.8, 2800.8],
        ltv:          [43.1,   39.4,   45.4,   45.1,   47.3,   47.7,   45.4],
        roi:          [2.29,   5.35,   2.30,  -0.66,  -7.34,  -1.07,   4.49],
        csi:          [61.2,   69.8,   74.3,   75.6,   72.4,   75.2,   76.5],
        vacancy:      [2.6,    2.4,    2.2,    2.0,    2.0,    2.0,    2.1],
        rent:         [3.9,    3.1,    3.8,    3.3,    3.8,    4.1,    4.1],
        maintTotal:   [1971.1, 1935.9, 2185.6, 2266.3, 1527.0, 1601.0, 1972.7],
        maintSqm:     [12.20,  12.10,  13.01,  12.86,  12.41,  13.82,  14.46],
        newBuild:     [2092,   2088,   2200,   3749,   2460,   3747,   2090],
        co2:          [47.2,   39.5,   38.4,   33.0,   31.7,   31.2,   30.7],
        employeeSat:  [0,      0,      0,      0,      0,      0.75,   0.77],
        unitsPerEmp:  [47.8,   46.1,   40.1,   51.3,   51.7,   50.9,   47.8],
    };

    // ── Palette ──
    const C = {
        blue:      "#4f8cff",  blueFill:  "rgba(79,140,255,.15)",
        purple:    "#a78bfa",  purpleFill:"rgba(167,139,250,.15)",
        green:     "#34d399",  greenFill: "rgba(52,211,153,.15)",
        amber:     "#fbbf24",  amberFill: "rgba(251,191,36,.15)",
        red:       "#f87171",  redFill:   "rgba(248,113,113,.12)",
        cyan:      "#22d3ee",  cyanFill:  "rgba(34,211,238,.12)",
        pink:      "#f472b6",  pinkFill:  "rgba(244,114,182,.12)",
        muted:     "#8a94a8",
        grid:      "rgba(255,255,255,.06)",
    };

    // ── Shared defaults ──
    Chart.defaults.color = C.muted;
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.font.size = 12;
    Chart.defaults.plugins.legend.display = false;
    Chart.defaults.responsive = true;
    Chart.defaults.maintainAspectRatio = false;
    Chart.defaults.interaction.mode = "index";
    Chart.defaults.interaction.intersect = false;

    const gridOpts = (min) => ({
        x: { grid: { color: C.grid }, ticks: { font: { size: 11 } } },
        y: { grid: { color: C.grid }, ticks: { font: { size: 11 } }, beginAtZero: min === 0, suggestedMin: min },
    });

    const tooltipOpts = {
        interaction: { mode: "index", intersect: false },
        animation: { duration: 400 },
        plugins: {
            tooltip: {
                enabled: true,
                backgroundColor: "rgba(20,30,55,.96)",
                titleColor: "#fff",
                titleFont: { weight: "bold", size: 13 },
                bodyColor: "#e8ecf4",
                bodyFont: { size: 13 },
                borderColor: "rgba(79,140,255,.4)",
                borderWidth: 1,
                cornerRadius: 10,
                padding: 14,
                displayColors: false,
                animation: { duration: 150 },
            },
        },
    };

    // ── Helper builders ──
    function lineChart(id, data, color, fill, opts = {}) {
        const l = opts.labels || labels;
        return new Chart(document.getElementById(id), {
            type: "line",
            data: {
                labels: l,
                datasets: [{
                    data,
                    borderColor: color,
                    backgroundColor: fill,
                    borderWidth: 2.5,
                    pointRadius: 4,
                    pointHoverRadius: 7,
                    pointBackgroundColor: color,
                    tension: .35,
                    fill: true,
                }],
            },
            options: { scales: gridOpts(opts.min ?? undefined), ...tooltipOpts },
        });
    }

    function barChart(id, data, color, fillColor, opts = {}) {
        const l = opts.labels || labels;
        return new Chart(document.getElementById(id), {
            type: "bar",
            data: {
                labels: l,
                datasets: [{
                    data,
                    backgroundColor: data.map(() => fillColor || color),
                    borderColor: color,
                    borderWidth: 1.5,
                    borderRadius: 6,
                    hoverBackgroundColor: color,
                }],
            },
            options: { scales: gridOpts(opts.min ?? 0), ...tooltipOpts },
        });
    }

    /* ═══════════════════════════════════════
       BSC FINANZEN
       ═══════════════════════════════════════ */
    barChart("chart-ebitda", DATA.ebitda, C.blue, C.blueFill);
    lineChart("chart-ltv", DATA.ltv, C.amber, C.amberFill, { min: 35 });

    // ROI – colour-coded bars
    new Chart(document.getElementById("chart-roi"), {
        type: "bar",
        data: {
            labels,
            datasets: [{
                data: DATA.roi,
                backgroundColor: DATA.roi.map(v => v >= 0 ? C.greenFill : C.redFill),
                borderColor: DATA.roi.map(v => v >= 0 ? C.green : C.red),
                borderWidth: 1.5,
                borderRadius: 6,
            }],
        },
        options: { scales: gridOpts(undefined), ...tooltipOpts },
    });

    /* ═══════════════════════════════════════
       BSC KUNDEN
       ═══════════════════════════════════════ */
    lineChart("chart-csi", DATA.csi, C.green, C.greenFill, { min: 55 });
    lineChart("chart-vacancy", DATA.vacancy, C.red, C.redFill, { min: 1.5 });
    barChart("chart-rent", DATA.rent, C.cyan, C.cyanFill);

    /* ═══════════════════════════════════════
       BSC INTERNE GESCHÄFTSPROZESSE
       ═══════════════════════════════════════ */
    barChart("chart-maint-total", DATA.maintTotal, C.purple, C.purpleFill);
    barChart("chart-maint-sqm", DATA.maintSqm, C.amber, C.amberFill, { min: 10 });
    lineChart("chart-co2", DATA.co2, C.green, C.greenFill, { min: 25 });

    /* ═══════════════════════════════════════
       BSC MITARBEITER & NACHHALTIGKEIT
       ═══════════════════════════════════════ */
    lineChart("chart-employee-sat", DATA.employeeSat, C.cyan, C.cyanFill, { min: 0 });
    barChart("chart-units-per-emp", DATA.unitsPerEmp, C.blue, C.blueFill, { min: 30 });
    barChart("chart-newbuild", DATA.newBuild, C.pink, C.pinkFill);

    // ── Header date ──
    document.getElementById("header-date").textContent =
        new Date().toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" });

    // ── Staggered tile entrance ──
    document.querySelectorAll(".chart-tile").forEach((el, i) => {
        el.style.animationDelay = `${i * 0.07}s`;
    });

})();
