(function () {
  "use strict";

  const data = window.WAPG_DATA;
  if (!data) return;
  const doodles = {
    requirements: '<svg aria-hidden="true" viewBox="0 0 64 64" focusable="false"><path d="M13 9h38v46H13zM20 20h24M20 30h18M20 40h21" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="m17 20 2 2 4-5m-6 15 2 2 4-5" fill="none" stroke="currentColor" stroke-width="2.5"/></svg>',
    design: '<svg aria-hidden="true" viewBox="0 0 64 64" focusable="false"><rect x="8" y="10" width="48" height="42" rx="3" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M8 21h48M17 16h2M24 16h2M17 29h18v14H17zm24 0h7v6h-7zm0 10h7v4h-7z" fill="none" stroke="currentColor" stroke-width="2.5"/></svg>',
    implementation: '<svg aria-hidden="true" viewBox="0 0 64 64" focusable="false"><path d="m23 17-14 15 14 15m18-30 14 15-14 15M37 10 27 54" fill="none" stroke="currentColor" stroke-width="3"/></svg>',
    testing: '<svg aria-hidden="true" viewBox="0 0 64 64" focusable="false"><path d="M18 8h28v48H18zM25 19h14M25 29h14M25 39h8" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="m38 43 4 4 8-10" fill="none" stroke="currentColor" stroke-width="3"/></svg>'
  };

  const createCard = (item) => {
    const level = data.levelDetails[item.level];
    const article = document.createElement("article");
    article.className = "resource-card resource-card--catalog";
    article.dataset.resourceType = item.type;
    article.dataset.phase = item.phase;
    article.dataset.level = item.level;
    article.dataset.searchText = `${item.title} ${item.summary} ${data.phaseDetails[item.phase].label}`.toLowerCase();
    article.innerHTML = `
      <div class="card-heading">
        ${doodles[item.phase]}
        <div>
          <span class="resource-type-badge">${item.type === "artifact" ? "artefacto" : "práctica"}</span>
          <h2>${item.title}</h2>
        </div>
      </div>
      <p>${item.summary}</p>
      <div class="card-meta">
        <span>${data.phaseDetails[item.phase].label}</span>
        <span class="level-pill level-pill--${item.level}">${level.label}</span>
      </div>
      <a class="card-link" href="${(item.type === "artifact" ? "artifacts" : "practices") + "/" + item.slug + ".html"}">${item.type === "artifact" ? "Ver artefacto" : "Ver práctica"}</a>`;
    return article;
  };

  document.querySelectorAll("[data-resource-catalog]").forEach((grid) => {
    const type = grid.dataset.resourceCatalog;
    data.resources.filter((item) => item.type === type).forEach((item) => grid.append(createCard(item)));
  });

  document.querySelectorAll("[data-phase-catalog]").forEach((grid) => {
    const phase = grid.dataset.phaseCatalog;
    data.resources.filter((item) => item.phase === phase).forEach((item) => grid.append(createCard(item)));
  });
})();
