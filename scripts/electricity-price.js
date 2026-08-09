/*
 * Live electricity spot price for the cabin (Os i Østerdalen).
 *
 * Source: HvaKosterStrømmen free API (no key). Price area NO3 (Midt-Norge).
 * The displayed value is the spot price INCLUDING 25% VAT only — no grid fee
 * or supplier markup. Fetched client-side (the API sends CORS *), refreshed
 * periodically so a permanently-open cabin screen stays current, and it
 * re-selects the active hour every minute (handling midnight and DST).
 */
(function () {
  "use strict";

  const ELECTRICITY_PRICE_AREA = "NO3";
  const ELECTRICITY_TIMEZONE = "Europe/Oslo";
  const VAT_MULTIPLIER = 1.25; // 25% VAT (Os i Østerdalen)
  const NORGESPRIS_NOK_PER_KWH = 0.50; // "Norgespris" baseline incl. VAT (50 øre = 40 øre + 25% mva); compared like-for-like with the VAT-inclusive spot price
  const API_BASE = "https://www.hvakosterstrommen.no/api/v1/prices";
  const DATA_REFRESH_MS = 10 * 60 * 1000; // re-fetch the JSON every 10 min
  const TICK_MS = 60 * 1000;              // re-select the active hour every min
  const STORAGE_PREFIX = "spotprice:";    // offline fallback cache

  // ---- date / timezone helpers --------------------------------------------
  const dateKeyFmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: ELECTRICITY_TIMEZONE, year: "numeric", month: "2-digit", day: "2-digit"
  });

  // "YYYY-MM-DD" for the given instant, in Europe/Oslo (not the device tz).
  function getNorwayDateKey(date) {
    return dateKeyFmt.format(date || new Date());
  }

  function buildElectricityPriceUrl(dateKey) {
    const [y, m, d] = dateKey.split("-");
    return `${API_BASE}/${y}/${m}-${d}_${ELECTRICITY_PRICE_AREA}.json`;
  }

  // Add whole days to a YYYY-MM-DD key via UTC noon (DST-safe), reformat in Oslo.
  function addDaysToKey(dateKey, days) {
    const [y, m, d] = dateKey.split("-").map(Number);
    const dt = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
    dt.setUTCDate(dt.getUTCDate() + days);
    return getNorwayDateKey(dt);
  }

  // ---- number / time formatting -------------------------------------------
  const priceFmt = new Intl.NumberFormat("nb-NO", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const clockFmt = new Intl.DateTimeFormat("nb-NO", {
    timeZone: ELECTRICITY_TIMEZONE, hour: "2-digit", minute: "2-digit", hourCycle: "h23"
  });

  function withVat(nokPerKwh) { return nokPerKwh * VAT_MULTIPLIER; }
  function formatElectricityPrice(nokInclVat) { return `${priceFmt.format(nokInclVat)} kr/kWh`; }
  function formatClock(iso) { return "kl. " + clockFmt.format(new Date(iso)); }

  // ---- pure calculations ---------------------------------------------------
  function getCurrentPrice(prices, now) {
    now = now || new Date();
    return prices.find(p => now >= new Date(p.time_start) && now < new Date(p.time_end)) || null;
  }

  function getNextPrice(todayPrices, current, tomorrowPrices) {
    if (current) {
      const endMs = new Date(current.time_end).getTime();
      const inToday = todayPrices.find(p => new Date(p.time_start).getTime() === endMs);
      if (inToday) return inToday;
    }
    if (tomorrowPrices && tomorrowPrices.length) return tomorrowPrices[0];
    return null;
  }

  function calculatePriceStatistics(prices) {
    if (!prices || !prices.length) return { min: null, max: null, avg: null, count: 0 };
    let min = prices[0], max = prices[0], sum = 0;
    prices.forEach(p => {
      sum += p.NOK_per_kWh;
      if (p.NOK_per_kWh < min.NOK_per_kWh) min = p;
      if (p.NOK_per_kWh > max.NOK_per_kWh) max = p;
    });
    return { min, max, avg: withVat(sum / prices.length), count: prices.length };
  }

  // ---- fetching ------------------------------------------------------------
  // Returns { status: "ok", prices } | { status: "not-published" }; throws on
  // network / other HTTP errors so the caller can distinguish the two.
  async function fetchElectricityPrices(dateKey) {
    const url = buildElectricityPriceUrl(dateKey);
    const res = await fetch(url, { cache: "no-store" });
    if (res.status === 404) return { status: "not-published", prices: null };
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    const prices = await res.json();
    if (!Array.isArray(prices) || !prices.length) throw new Error("Empty price data");
    return { status: "ok", prices };
  }

  function cacheStore(dateKey, prices) {
    try { localStorage.setItem(STORAGE_PREFIX + dateKey, JSON.stringify(prices)); } catch (e) { /* ignore */ }
  }
  function cacheLoad(dateKey) {
    try { const raw = localStorage.getItem(STORAGE_PREFIX + dateKey); return raw ? JSON.parse(raw) : null; }
    catch (e) { return null; }
  }

  // ---- export pure functions for testing (Node) ----------------------------
  if (typeof module !== "undefined" && module.exports) {
    module.exports = {
      getNorwayDateKey, buildElectricityPriceUrl, addDaysToKey, withVat,
      getCurrentPrice, getNextPrice, calculatePriceStatistics, formatElectricityPrice, formatClock
    };
  }

  // ---- everything below is browser-only ------------------------------------
  if (typeof document === "undefined") return;

  const state = { todayKey: null, today: null, tomorrowKey: null, tomorrow: null, lastError: false };
  const el = (id) => document.getElementById(id);

  async function refreshData() {
    const todayKey = getNorwayDateKey();
    const tomorrowKey = addDaysToKey(todayKey, 1);

    // Today's prices are required for the main display.
    try {
      const r = await fetchElectricityPrices(todayKey);
      if (r.status !== "ok") throw new Error("Today's prices not published");
      state.today = r.prices; state.todayKey = todayKey; state.lastError = false;
      cacheStore(todayKey, r.prices);
    } catch (err) {
      console.error("[spotprice] Could not fetch today's prices:", err);
      state.lastError = true;
      if (state.todayKey !== todayKey) {           // no in-memory data for today yet
        const cached = cacheLoad(todayKey);
        if (cached) { state.today = cached; state.todayKey = todayKey; }
      }
    }

    // Tomorrow's prices are optional (published in the afternoon).
    try {
      const r = await fetchElectricityPrices(tomorrowKey);
      state.tomorrowKey = tomorrowKey;
      state.tomorrow = r.status === "ok" ? r.prices : null;
      if (r.status === "ok") cacheStore(tomorrowKey, r.prices);
    } catch (err) {
      console.warn("[spotprice] Tomorrow's prices not available yet (normal):", err.message);
      state.tomorrow = null;
    }

    render();
  }

  // Re-select the active hour each minute; refetch on a new Oslo day.
  function tick() {
    if (getNorwayDateKey() !== state.todayKey) { refreshData(); return; }
    render();
  }

  function buildGraph(prices, current) {
    const W = 320, H = 110, padTop = 6, padBottom = 2;
    const chartH = H - padTop - padBottom;
    const n = prices.length;
    const values = prices.map(p => withVat(p.NOK_per_kWh));
    // Include the Norgespris baseline in the scale so its line is always visible.
    const maxV = Math.max.apply(null, values.concat(NORGESPRIS_NOK_PER_KWH, 0.0001));
    const bw = W / n;
    const barW = Math.max(1, bw * 0.72);
    const nowStart = current ? new Date(current.time_start).getTime() : null;
    let bars = "";
    prices.forEach((p, i) => {
      const h = Math.max(1, (values[i] / maxV) * chartH);
      const x = i * bw + (bw - barW) / 2;
      const y = padTop + (chartH - h);
      const isNow = nowStart !== null && new Date(p.time_start).getTime() === nowStart;
      // Colour from the Norgespris customer's view: spot below Norgespris =
      // you overpay (red); spot above = Norgespris saves you money (green).
      const cls = "bar" + (isNow ? " now" : "") + (values[i] < NORGESPRIS_NOK_PER_KWH ? " overpay" : " saving");
      bars += `<rect class="${cls}" x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${barW.toFixed(1)}" height="${h.toFixed(1)}" rx="1"></rect>`;
    });
    const baseY = padTop + chartH - (NORGESPRIS_NOK_PER_KWH / maxV) * chartH;
    const baseline = `<line class="baseline" x1="0" y1="${baseY.toFixed(1)}" x2="${W}" y2="${baseY.toFixed(1)}"></line>`;
    return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="Strømpris per time i dag, med Norgespris som referanse">${bars}${baseline}</svg>`;
  }

  // From a Norgespris customer's point of view: how much more/less you pay on
  // the fixed Norgespris than the current spot price. Positive = you pay MORE
  // than spot (spot is cheaper than Norgespris) → bad, shown red. Negative =
  // you pay less than spot (Norgespris shields you from a high spot) → good,
  // shown green.
  function norgesprisComparison(currentSpotInclVat) {
    const pct = Math.round((NORGESPRIS_NOK_PER_KWH - currentSpotInclVat) / currentSpotInclVat * 100);
    const sign = pct > 0 ? "+" : pct < 0 ? "−" : "±";
    return { pct: pct, text: sign + Math.abs(pct) + " %", over: pct > 0, under: pct < 0 };
  }

  function renderTomorrow() {
    const box = el("spot-tomorrow");
    if (!box) return;
    if (!state.tomorrow) { box.innerHTML = ""; box.hidden = true; return; }
    const s = calculatePriceStatistics(state.tomorrow);
    box.hidden = false;
    box.innerHTML =
      '<div class="spot-tomorrow-title">I morgen</div>' +
      '<div class="spot-tomorrow-row">' +
        `<span>Lavest ${formatElectricityPrice(withVat(s.min.NOK_per_kWh))} (${formatClock(s.min.time_start)})</span>` +
        `<span>Snitt ${formatElectricityPrice(s.avg)}</span>` +
        `<span>Høyest ${formatElectricityPrice(withVat(s.max.NOK_per_kWh))} (${formatClock(s.max.time_start)})</span>` +
      '</div>';
  }

  function render() {
    const statusEl = el("spot-status");
    const prices = state.today;
    if (!prices) {
      if (el("spot-current")) el("spot-current").textContent = "–";
      if (statusEl) statusEl.textContent = state.lastError ? "Kunne ikke oppdatere strømpris" : "Laster strømpris …";
      if (statusEl) statusEl.classList.toggle("spot-status--error", !!state.lastError);
      return;
    }

    const now = new Date();
    const current = getCurrentPrice(prices, now);
    const next = getNextPrice(prices, current, state.tomorrow);
    const stats = calculatePriceStatistics(prices);

    el("spot-current").textContent = current ? formatElectricityPrice(withVat(current.NOK_per_kWh)) : "–";
    el("spot-next").textContent = next ? `Neste: ${formatElectricityPrice(withVat(next.NOK_per_kWh))}` : "";

    // Green/red comparison of the current price vs the Norgespris baseline.
    const vsEl = el("spot-vs");
    if (vsEl) {
      if (current) {
        const cmp = norgesprisComparison(withVat(current.NOK_per_kWh));
        vsEl.hidden = false;
        vsEl.textContent = cmp.text;
        vsEl.title = `Norgespris (${Math.round(NORGESPRIS_NOK_PER_KWH * 100)} øre) mot spotpris — positivt/rødt = du betaler mer enn spotprisen`;
        vsEl.classList.toggle("spot-vs--over", cmp.over);
        vsEl.classList.toggle("spot-vs--under", cmp.under);
      } else {
        vsEl.hidden = true;
      }
    }
    el("spot-min").textContent = stats.min ? `${formatElectricityPrice(withVat(stats.min.NOK_per_kWh))} · ${formatClock(stats.min.time_start)}` : "–";
    el("spot-avg").textContent = stats.avg != null ? formatElectricityPrice(stats.avg) : "–";
    el("spot-max").textContent = stats.max ? `${formatElectricityPrice(withVat(stats.max.NOK_per_kWh))} · ${formatClock(stats.max.time_start)}` : "–";
    el("spot-graph").innerHTML = buildGraph(prices, current);
    renderTomorrow();

    statusEl.textContent = state.lastError ? "Kunne ikke oppdatere strømpris" : `Oppdatert ${clockFmt.format(now)}`;
    statusEl.classList.toggle("spot-status--error", !!state.lastError);
  }

  function init() {
    if (!el("spot-price")) return; // only on pages that include the card
    refreshData();
    setInterval(tick, TICK_MS);
    setInterval(refreshData, DATA_REFRESH_MS);
    document.addEventListener("visibilitychange", () => { if (!document.hidden) tick(); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
