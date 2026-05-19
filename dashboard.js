/* ============================================================
   Vonovia Management Dashboard – Chart.js rendering
   Grouped by Balanced Scorecard perspectives
   ============================================================ */

(() => {
    "use strict";

    // ── Data ──
    const ALL_LABELS = [2019, 2020, 2021, 2022, 2023, 2024, 2025];

    const DATA = {
        ebitda: [1760.1, 1909.8, 2254.4, 2606.1, 2583.8, 2641.8, 2800.8],
        ltv: [43.1, 39.4, 45.4, 45.1, 47.3, 47.7, 45.4],
        roi: [2.29, 5.35, 2.30, -0.66, -7.34, -1.07, 4.49],
        csi: [61.2, 69.8, 74.3, 75.6, 72.4, 75.2, 76.5],
        vacancy: [2.6, 2.4, 2.2, 2.0, 2.0, 2.0, 2.1],
        rent: [3.9, 3.1, 3.8, 3.3, 3.8, 4.1, 4.1],
        maintTotal: [1971.1, 1935.9, 2185.6, 2266.3, 1527.0, 1601.0, 1972.7],
        maintSqm: [19.02, 22.31, 26.17, 24.81, 21.03, 22.46, 24.23],
        newBuild: [2092, 2088, 2200, 3749, 2460, 3747, 2090],
        co2: [47.2, 39.5, 38.4, 33.0, 31.7, 31.2, 30.7],
        employeeSat: [0, 0, 0, 0, 0, 75, 77],
        unitsPerEmp: [47.8, 46.1, 40.1, 51.3, 51.7, 50.9, 47.8],
    };

    // Zielwerte 2028
    const TARGETS = {
        ebitda: 3200, ltv: 40, roi: 5,
        csi: 73, vacancy: 2.0, rent: 4.0,
        maintTotal: 2200, maintSqm: 26, newBuild: 3000,
        employeeSat: 77, co2: 25, unitsPerEmp: 50,
    };

    // ── Filter state ──
    const activeYears = new Set(ALL_LABELS);
    let showTarget = true;

    // ── Palette ──
    const C = {
        blue: "#4f8cff", blueFill: "rgba(79,140,255,.15)",
        purple: "#a78bfa", purpleFill: "rgba(167,139,250,.15)",
        green: "#34d399", greenFill: "rgba(52,211,153,.15)",
        amber: "#fbbf24", amberFill: "rgba(251,191,36,.15)",
        red: "#f87171", redFill: "rgba(248,113,113,.12)",
        cyan: "#22d3ee", cyanFill: "rgba(34,211,238,.12)",
        pink: "#f472b6", pinkFill: "rgba(244,114,182,.12)",
        target: "#ffffff", targetFill: "rgba(255,255,255,.06)",
        muted: "#8a94a8",
        grid: "rgba(255,255,255,.06)",
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
        animation: { duration: 300 },
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
                filter: (tooltipItem) => {
                    return tooltipItem.raw !== null && tooltipItem.raw !== undefined;
                },
                callbacks: {
                    label: function (context) {
                        if (context.raw === null || context.raw === undefined) return null;
                        return context.dataset.label + ': ' + context.formattedValue;
                    }
                },
            },
            legend: {
                display: true,
                labels: {
                    boxWidth: 10, padding: 12, usePointStyle: true,
                    filter: (item) => item.text !== undefined
                },
            },
        },
    };

    // ── Chart registry ──
    const registry = [];

    function filterData(fullData) {
        return fullData.filter((_, i) => activeYears.has(ALL_LABELS[i]));
    }
    function getLabels(hasTarget) {
        const l = ALL_LABELS.filter(y => activeYears.has(y));
        if (hasTarget && showTarget) l.push("Ziel 2028");
        return l;
    }

    // ── Helper builders ──
    function barChart(id, dataKey, color, fillColor, opts = {}) {
        const cfg = { id, dataKey, color, fillColor, type: "bar", opts };
        registry.push(cfg);
        return buildBar(cfg);
    }

    function lineChart(id, dataKey, color, fill, opts = {}) {
        const cfg = { id, dataKey, color, fill, type: "line", opts };
        registry.push(cfg);
        return buildLine(cfg);
    }

    function buildBar(cfg) {
        const { id, dataKey, color, fillColor, opts } = cfg;
        const t = opts.target;
        const hasT = t !== undefined && showTarget;
        const filtered = filterData(DATA[dataKey]);
        const mainData = hasT ? [...filtered, null] : filtered;
        const datasets = [{
            label: "Ist-Wert",
            data: mainData,
            backgroundColor: mainData.map(() => fillColor || color),
            borderColor: color,
            borderWidth: 1.5,
            borderRadius: 6,
            hoverBackgroundColor: color,
        }];
        if (hasT) {
            datasets.push({
                label: "Ziel 2028",
                data: [...filtered.map(() => null), t],
                backgroundColor: C.targetFill,
                borderColor: C.target,
                borderWidth: 2,
                borderDash: [5, 3],
                borderRadius: 6,
            });
        }
        cfg.chart = new Chart(document.getElementById(id), {
            type: "bar",
            data: { labels: getLabels(t !== undefined), datasets },
            options: { scales: gridOpts(opts.min ?? 0), ...tooltipOpts },
        });
        return cfg.chart;
    }

    function buildLine(cfg) {
        const { id, dataKey, color, fill, opts } = cfg;
        const t = opts.target;
        const hasT = t !== undefined && showTarget;
        const filtered = filterData(DATA[dataKey]);
        const mainData = hasT ? [...filtered, null] : filtered;
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
            spanGaps: false,
        }];
        if (hasT) {
            datasets.push({
                label: "Ziel 2028",
                data: [...filtered.map(() => null), t],
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
        cfg.chart = new Chart(document.getElementById(id), {
            type: "line",
            data: { labels: getLabels(t !== undefined), datasets },
            options: { scales: gridOpts(opts.min ?? undefined), ...tooltipOpts },
        });
        return cfg.chart;
    }

    // ROI special builder (colour-coded bars)
    function buildRoi(cfg) {
        const filtered = filterData(DATA.roi);
        const hasT = showTarget;
        const mainData = hasT ? [...filtered, null] : filtered;
        const bgColors = filtered.map(v => v === null ? "transparent" : (v >= 0 ? C.greenFill : C.redFill));
        const borderColors = filtered.map(v => v === null ? "transparent" : (v >= 0 ? C.green : C.red));
        if (hasT) { bgColors.push("transparent"); borderColors.push("transparent"); }
        const datasets = [{
            label: "Ist-Wert",
            data: mainData,
            backgroundColor: bgColors,
            borderColor: borderColors,
            borderWidth: 1.5,
            borderRadius: 6,
        }];
        if (hasT) {
            datasets.push({
                label: "Ziel 2028",
                data: [...filtered.map(() => null), TARGETS.roi],
                backgroundColor: C.targetFill,
                borderColor: C.target,
                borderWidth: 2,
                borderDash: [5, 3],
                borderRadius: 6,
            });
        }
        cfg.chart = new Chart(document.getElementById("chart-roi"), {
            type: "bar",
            data: { labels: getLabels(true), datasets },
            options: { scales: gridOpts(undefined), ...tooltipOpts },
        });
        return cfg.chart;
    }

    // ── Rebuild all charts on filter change ──
    function rebuildAll() {
        registry.forEach(cfg => {
            if (cfg.chart) cfg.chart.destroy();
            if (cfg.type === "bar") buildBar(cfg);
            else if (cfg.type === "line") buildLine(cfg);
            else if (cfg.type === "roi") buildRoi(cfg);
        });
    }

    /* ═══════════════════════════════════════
       BSC FINANZEN
       ═══════════════════════════════════════ */
    barChart("chart-ebitda", "ebitda", C.blue, C.blueFill, { min: 1500, target: TARGETS.ebitda });
    lineChart("chart-ltv", "ltv", C.amber, C.amberFill, { min: 40, target: TARGETS.ltv });

    // ROI – special colour-coded
    const roiCfg = { id: "chart-roi", type: "roi", opts: {} };
    registry.push(roiCfg);
    buildRoi(roiCfg);

    /* ═══════════════════════════════════════
       BSC KUNDEN
       ═══════════════════════════════════════ */
    lineChart("chart-csi", "csi", C.green, C.greenFill, { min: 55, target: TARGETS.csi });
    lineChart("chart-vacancy", "vacancy", C.red, C.redFill, { min: 0, target: TARGETS.vacancy });
    lineChart("chart-rent", "rent", C.cyan, C.cyanFill, { min: 0, target: TARGETS.rent });

    /* ═══════════════════════════════════════
       BSC INTERNE GESCHÄFTSPROZESSE
       ═══════════════════════════════════════ */
    barChart("chart-maint-total", "maintTotal", C.purple, C.purpleFill, { target: TARGETS.maintTotal });
    lineChart("chart-maint-sqm", "maintSqm", C.amber, C.amberFill, { min: 10, target: TARGETS.maintSqm });
    barChart("chart-newbuild", "newBuild", C.pink, C.pinkFill, { target: TARGETS.newBuild });

    /* ═══════════════════════════════════════
       BSC MITARBEITER & NACHHALTIGKEIT
       ═══════════════════════════════════════ */
    lineChart("chart-employee-sat", "employeeSat", C.cyan, C.cyanFill, { min: 0, target: TARGETS.employeeSat });
    lineChart("chart-co2", "co2", C.green, C.greenFill, { min: 20, target: TARGETS.co2 });
    lineChart("chart-units-per-emp", "unitsPerEmp", C.blue, C.blueFill, { min: 30, target: TARGETS.unitsPerEmp });

    // ── Filter UI ──
    const filterBar = document.getElementById("year-filter");
    if (filterBar) {
        // Year toggle buttons
        ALL_LABELS.forEach(year => {
            const btn = document.createElement("button");
            btn.className = "filter-btn active";
            btn.textContent = year;
            btn.dataset.year = year;
            btn.addEventListener("click", () => {
                if (activeYears.has(year)) {
                    activeYears.delete(year);
                    btn.classList.remove("active");
                } else {
                    activeYears.add(year);
                    btn.classList.add("active");
                }
                rebuildAll();
            });
            filterBar.appendChild(btn);
        });

        // Target toggle
        const tBtn = document.createElement("button");
        tBtn.className = "filter-btn target-btn active";
        tBtn.textContent = "Ziel 2028";
        tBtn.addEventListener("click", () => {
            showTarget = !showTarget;
            tBtn.classList.toggle("active", showTarget);
            rebuildAll();
        });
        filterBar.appendChild(tBtn);

        // Separator + preset buttons
        const sep = document.createElement("span");
        sep.className = "filter-sep";
        sep.textContent = "|";
        filterBar.appendChild(sep);

        // Preset: All years
        const allBtn = document.createElement("button");
        allBtn.className = "filter-btn preset";
        allBtn.textContent = "Alle";
        allBtn.addEventListener("click", () => {
            ALL_LABELS.forEach(y => activeYears.add(y));
            filterBar.querySelectorAll(".filter-btn[data-year]").forEach(b => b.classList.add("active"));
            rebuildAll();
        });
        filterBar.appendChild(allBtn);

        // Preset: Crisis years
        const crisisBtn = document.createElement("button");
        crisisBtn.className = "filter-btn preset crisis";
        crisisBtn.textContent = "⚡ Krise 2022–2023";
        crisisBtn.addEventListener("click", () => {
            const crisisYears = [2021, 2022, 2023, 2024];
            ALL_LABELS.forEach(y => {
                if (crisisYears.includes(y)) activeYears.add(y);
                else activeYears.delete(y);
            });
            filterBar.querySelectorAll(".filter-btn[data-year]").forEach(b => {
                b.classList.toggle("active", activeYears.has(Number(b.dataset.year)));
            });
            rebuildAll();
        });
        filterBar.appendChild(crisisBtn);
    }

    // ── Header date ──
    document.getElementById("header-date").textContent =
        new Date().toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" });

    // ── Staggered tile entrance ──
    document.querySelectorAll(".chart-tile").forEach((el, i) => {
        el.style.animationDelay = `${i * 0.07}s`;
    });

    // ── Collapsible Sections ──
    document.querySelectorAll(".bsc-header").forEach(header => {
        // Create chevron element
        const chevron = document.createElement("span");
        chevron.className = "collapse-icon";
        chevron.textContent = "▼";
        header.appendChild(chevron);

        header.title = "Klicken, um die Sektion ein-/auszuklappen";

        header.addEventListener("click", () => {
            const section = header.parentElement;
            section.classList.toggle("collapsed");
        });
    });

})();
