document.querySelectorAll(".filter-panel").forEach((panel) => {
  const searchForm = panel.querySelector(".search-control");
  const searchInput = searchForm?.querySelector('input[type="search"]');
  const viewButtons = panel.querySelectorAll("[data-view]");
  const cardGrid = panel.nextElementSibling;

  if (!searchForm || !searchInput || !cardGrid?.classList.contains("card-grid")) {
    return;
  }

  const cards = Array.from(cardGrid.querySelectorAll(".resource-card"));
  const levelControl = document.createElement("label");
  levelControl.className = "level-filter";
  levelControl.innerHTML = '<span>Level</span><select aria-label="Filter by level"><option value="all">All levels</option><option value="foundation">Basic</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></select>';
  panel.append(levelControl);
  const levelSelect = levelControl.querySelector("select");
  const itemName = searchInput.id.includes("practice") ? "practices" : "artifacts";
  const status = document.createElement("p");
  status.className = "filter-status";
  status.setAttribute("aria-live", "polite");
  status.setAttribute("data-no-translate", "");
  cardGrid.insertAdjacentElement("beforebegin", status);

  const normalizeText = (text) =>
    text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

  const filterCards = () => {
    const query = normalizeText(searchInput.value);
    let visibleCount = 0;

    cards.forEach((card) => {
      const title = card.querySelector(".card-heading h2, .card-heading h3")?.textContent || "";
      const matches = normalizeText(title).includes(query) && (levelSelect.value === "all" || card.dataset.level === levelSelect.value);
      card.hidden = !matches;

      if (matches) {
        visibleCount += 1;
      }
    });

    status.textContent = window.WAPG_I18N.language === "es"
      ? `${visibleCount} ${itemName === "practices" ? (visibleCount === 1 ? "práctica encontrada" : "prácticas encontradas") : (visibleCount === 1 ? "artefacto encontrado" : "artefactos encontrados")}.`
      : `${visibleCount} ${visibleCount === 1 ? itemName.slice(0, -1) : itemName} found.`;
  };

  const setView = (view) => {
    const listView = view === "list";
    cardGrid.classList.toggle("is-list-view", listView);

    viewButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.view === view));
    });
  };

  searchForm.addEventListener("submit", (event) => event.preventDefault());
  searchInput.addEventListener("input", filterCards);
  levelSelect.addEventListener("change", filterCards);
  document.addEventListener("wapg:languagechange", filterCards);

  viewButtons.forEach((button) => {
    button.addEventListener("click", () => setView(button.dataset.view));
  });
  filterCards();
});
