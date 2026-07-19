(function () {
  function getParams() {
    const params = new URLSearchParams(window.location.search);
    return {
      q: (params.get("q") || "").trim(),
      target: (params.get("target") || "").trim(),
      hit: parseInt(params.get("hit") || "0", 10)
    };
  }

  function normalizeForSearch(value) {
    return (value || "")
      .toLocaleLowerCase()
      // Fold Norwegian letters so names are findable without them (\u00f8->o, \u00e6->ae, \u00e5->a).
      .replace(/\u00f8/g, "o").replace(/\u00e6/g, "ae").replace(/\u00e5/g, "a")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function getSearchableElements() {
    return Array.from(document.querySelectorAll(
      ".page-subtitle, .card-title, .card-desc, .manual-link, .guide-title, .guide-desc, .step-text, .step-number, .item-label, h1, h2, h3, p, a"
    )).filter(el => {
      if (!el) return false;
      if (el.closest("script, style, noscript")) return false;
      if (el.classList.contains("back-link")) return false;
      return true;
    });
  }

  function applyHighlightStyle() {
    if (document.getElementById("search-target-style")) return;
    const style = document.createElement("style");
    style.id = "search-target-style";
    style.textContent = ".search-active-hit{outline:2px solid var(--accent);outline-offset:2px;border-radius:8px;}";
    document.head.appendChild(style);
  }

  function focusHit() {
    const { q, target, hit } = getParams();
    const normalizedQuery = normalizeForSearch(q);
    const normalizedTarget = normalizeForSearch(target);
    if (!normalizedQuery && !normalizedTarget) return;

    const searchableElements = getSearchableElements();

    let candidates = [];
    if (normalizedTarget) {
      candidates = searchableElements.filter(el =>
        normalizeForSearch(el.textContent || "").includes(normalizedTarget)
      );
    }

    if (!candidates.length && normalizedQuery) {
      candidates = searchableElements.filter(el =>
        normalizeForSearch(el.textContent || "").includes(normalizedQuery)
      );
    }

    if (!candidates.length) return;

    const index = Number.isFinite(hit) && hit >= 0 ? (hit % candidates.length) : 0;
    const targetElement = candidates[index];
    if (!targetElement) return;

    applyHighlightStyle();
    targetElement.classList.add("search-active-hit");
    targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", focusHit);
  } else {
    focusHit();
  }
})();
