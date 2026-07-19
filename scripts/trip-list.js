/*
 * Shared renderer for activity-category pages (Bicycle Trips, Walks, ...).
 *
 * Activities are defined once in SITE_DATA.activities, each tagged with the
 * categories it belongs to. A category page declares its category id via a
 * body attribute:
 *   <body data-activity-category="bicycle-trips">
 * and provides a <section id="cards"> to render into. This page lists every
 * activity whose `categories` include that id as a clickable preview card
 * (title, short `summary`, and photos), linking to the activity's own detail
 * page at activity.html?id=<id>.
 */
(function () {
  const data = window.SITE_DATA || {};
  const category = document.body.getAttribute("data-activity-category");
  const cardsEl = document.getElementById("cards");
  if (!cardsEl) return;

  const fromPage = (location.pathname.split("/").pop() || "things-to-do.html");

  const items = (data.activities || [])
    .filter(a => Array.isArray(a.categories) && a.categories.includes(category))
    .slice()
    .sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: "base" }));

  if (!items.length) {
    cardsEl.innerHTML = '<div class="empty-note">Nothing added yet.</div>';
    return;
  }

  items.forEach(item => {
    const card = document.createElement("a");
    card.className = "card card-link";
    card.href = `activity.html?id=${encodeURIComponent(item.id)}&from=${encodeURIComponent(fromPage)}`;

    const title = document.createElement("h2");
    title.className = "card-title";
    title.textContent = item.title;
    card.appendChild(title);

    const summaryText = item.summary ||
      (item.descriptionLines || []).find(Boolean) ||
      item.description || "";
    if (summaryText) {
      const desc = document.createElement("p");
      desc.className = "card-desc";
      desc.textContent = summaryText;
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
        gallery.appendChild(img);
      });
      card.appendChild(gallery);
    }

    cardsEl.appendChild(card);
  });
})();
