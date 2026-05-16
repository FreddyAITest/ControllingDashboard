/* ============================================================
   Vonovia Management Dashboard – Chart.js rendering
   Grouped by Balanced Scorecard perspectives
   ============================================================ */

(() => {
    "use strict";

    // ── Data ──
    const labels = [2019, 2020, 2021, 2022, 2023, 2024, 2025];
    const labelsT = [...labels, "Ziel 2028"];

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

    // Zielwerte 2028
    const TARGETS = {
        ebitda: 3200, ltv: 40, roi: 5,
        csi: 73, vacancy: 2.0, rent: 4.0,
        maintTotal: 2100, maintSqm: 26, newBuild: 3000,
        employeeSat: 0.77, co2: 25, unitsPerEmp: 47.5,
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
        target:    "#ffffff",  targetFill:"rgba(255,255,255,.06)",
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
                displayColors: true,
                animation: { duration: 150 },
            },
            legend: {
                display: true,
                labels: { boxWidth: 10, padding: 12, usePointStyle: true,
                    filter: (item) => item.text !== undefined },
            },
        },
    };

    // ── Helper: build datasets with optional Ziel 2028 ──
    function barChart(id, data, color, fillColor, opts = {}) {
        const t = opts.target;
        const l = t !== undefined ? labelsT : (opts.labels || labels);
        const mainData = t !== undefined ? [...data, null] : data;
        const datasets = [{
            label: "Ist-Wert",
            data: mainData,
            backgroundColor: mainData.map(() => fillColor || color),
            borderColor: color,
            borderWidth: 1.5,
            borderRadius: 6,
            hoverBackgroundColor: color,
        }];
        if (t !== undefined) {
            datasets.push({
                label: "Ziel 2028",
                data: [...data.map(() => null), t],
                backgroundColor: C.targetFill,
                borderColor: C.target,
                borderWidth: 2,
                borderDash: [5, 3],
                borderRadius: 6,
            });
        }
        return new Chart(document.getElementById(id), {
            type: "bar",
            data: { labels: l, datasets },
            options: { scales: gridOpts(opts.min ?? 0), ...tooltipOpts },
        });
    }

    function lineChart(id, data, color, fill, opts = {}) {
        const t = opts.target;
        const l = t !== undefined ? labelsT : (opts.labels || labels);
        const mainData = t !== undefined ? [...data, null] : data;
        const datasets = [{
            label: "Ist-Wert",
            data: mainData,
            borderColor: color,
            backgroundColor: fill,
            borderWidth: 2.5,
            pointRadius: 4,
            pointHoverRadius: 7,
            pointBackgroundColor: color,
            tension: .35,
            fill: true,
        }];
        if (t !== undefined) {
            datasets.push({
                label: "Ziel 2028",
                data: [...data.map(() => null), t],
                borderColor: C.target,
                backgroundColor: C.targetFill,
                borderWidth: 2,
                borderDash: [5, 3],
                pointRadius: 7,
                pointHoverRadius: 9,
                pointBackgroundColor: C.targetFill,
                pointBorderColor: C.target,
                pointBorderWidth: 2,
                pointStyle: "crossRot",
                fill: false,
            });
        }
        return new Chart(document.getElementById(id), {
            type: "line",
            data: { labels: l, datasets },
            options: { scales: gridOpts(opts.min ?? undefined), ...tooltipOpts },
        });
    }

    /* ═══════════════════════════════════════
       BSC FINANZEN
       ═══════════════════════════════════════ */
    barChart("chart-ebitda", DATA.ebitda, C.blue, C.blueFill, { target: TARGETS.ebitda });
    lineChart("chart-ltv", DATA.ltv, C.amber, C.amberFill, { min: 35, target: TARGETS.ltv });

    // ROI – colour-coded bars + target
    new Chart(document.getElementById("chart-roi"), {
        type: "bar",
        data: {
            labels: labelsT,
            datasets: [{
                label: "Ist-Wert",
                data: [...DATA.roi, null],
                backgroundColor: DATA.roi.map(v => v >= 0 ? C.greenFill : C.redFill).concat(["transparent"]),
                borderColor: DATA.roi.map(v => v >= 0 ? C.green : C.red).concat(["transparent"]),
                borderWidth: 1.5,
                borderRadius: 6,
            }, {
                label: "Ziel 2028",
                data: [...DATA.roi.map(() => null), TARGETS.roi],
                backgroundColor: C.targetFill,
                borderColor: C.target,
                borderWidth: 2,
                borderDash: [5, 3],
                borderRadius: 6,
            }],
        },
        options: { scales: gridOpts(undefined), ...tooltipOpts },
    });

    /* ═══════════════════════════════════════
       BSC KUNDEN
       ═══════════════════════════════════════ */
    lineChart("chart-csi", DATA.csi, C.green, C.greenFill, { min: 55, target: TARGETS.csi });
    lineChart("chart-vacancy", DATA.vacancy, C.red, C.redFill, { min: 1.5, target: TARGETS.vacancy });
    barChart("chart-rent", DATA.rent, C.cyan, C.cyanFill, { target: TARGETS.rent });

    /* ═══════════════════════════════════════
       BSC INTERNE GESCHÄFTSPROZESSE
       ═══════════════════════════════════════ */
    barChart("chart-maint-total", DATA.maintTotal, C.purple, C.purpleFill, { target: TARGETS.maintTotal });
    barChart("chart-maint-sqm", DATA.maintSqm, C.amber, C.amberFill, { min: 10, target: TARGETS.maintSqm });
    lineChart("chart-co2", DATA.co2, C.green, C.greenFill, { min: 20, target: TARGETS.co2 });

    /* ═══════════════════════════════════════
       BSC MITARBEITER & NACHHALTIGKEIT
       ═══════════════════════════════════════ */
    lineChart("chart-employee-sat", DATA.employeeSat, C.cyan, C.cyanFill, { min: 0, target: TARGETS.employeeSat });
    barChart("chart-units-per-emp", DATA.unitsPerEmp, C.blue, C.blueFill, { min: 30, target: TARGETS.unitsPerEmp });
    barChart("chart-newbuild", DATA.newBuild, C.pink, C.pinkFill, { target: TARGETS.newBuild });

    // ── Header date ──
    document.getElementById("header-date").textContent =
        new Date().toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" });

    // ── Staggered tile entrance ──
    document.querySelectorAll(".chart-tile").forEach((el, i) => {
        el.style.animationDelay = `${i * 0.07}s`;
    });

})();
