/*
 * Shared renderer for activity-category pages (Bicycle Trips, Walks, ...).
 *
 * Activities are defined once in SITE_DATA.activities, each tagged with the
 * categories it belongs to. A category page declares its category id via a
 * body attribute:
 *   <body data-activity-category="bicycle-trips">
 * and provides a <section id="cards"> to render into. This page then lists
 * every activity whose `categories` include that id — with title,
 * descriptionLines/description, images[], and links[] (rendered as buttons,
 * e.g. a UT.no route link and a Google Maps car-park link).
 */
(function () {
  const data = window.SITE_DATA || {};
  const category = document.body.getAttribute("data-activity-category");
  const cardsEl = document.getElementById("cards");
  if (!cardsEl) return;

  const items = (data.activities || [])
    .filter(a => Array.isArray(a.categories) && a.categories.includes(category))
    .slice()
    .sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: "base" }));

  if (!items.length) {
    cardsEl.innerHTML = '<div class="empty-note">Nothing added yet.</div>';
    return;
  }

  items.forEach(item => {
    const card = document.createElement("article");
    card.className = "card";

    const title = document.createElement("h2");
    title.className = "card-title";
    title.textContent = item.title;
    card.appendChild(title);

    const lines = item.descriptionLines || (item.description ? [item.description] : []);
    if (lines.length) {
      const desc = document.createElement("p");
      desc.className = "card-desc";
      lines.forEach((line, i) => {
        if (i > 0) desc.appendChild(document.createElement("br"));
        desc.appendChild(document.createTextNode(line));
      });
      card.appendChild(desc);
    }

    if (item.images && item.images.length) {
      const gallery = document.createElement("div");
      gallery.className = "image-gallery";
      item.images.forEach(src => {
        const img = document.createElement("img");
        img.className = "card-image";
        img.loading = "lazy";
        img.decoding = "async";
        img.src = src;
        img.alt = item.title;
        img.addEventListener("click", () => window.open(src, "_blank"));
        gallery.appendChild(img);
      });
      card.appendChild(gallery);
    }

    const links = item.links || item.descriptionLinks || [];
    if (links.length) {
      const wrap = document.createElement("div");
      wrap.className = "trip-links";
      links.forEach(l => {
        if (!l.href) return;
        const a = document.createElement("a");
        a.className = "trip-link";
        a.href = l.href;
        a.textContent = l.label || "Open";
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        wrap.appendChild(a);
      });
      if (wrap.children.length) card.appendChild(wrap);
    }

    cardsEl.appendChild(card);
  });
})();
