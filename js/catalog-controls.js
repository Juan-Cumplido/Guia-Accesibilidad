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
  levelControl.innerHTML = '<span>Nivel</span><select aria-label="Filtrar por nivel"><option value="all">Todos los niveles</option><option value="foundation">Básico</option><option value="intermediate">Intermedio</option><option value="advanced">Avanzado</option></select>';
  panel.append(levelControl);
  const levelSelect = levelControl.querySelector("select");
  const itemName = searchInput.id.includes("practice") ? "practices" : "artifacts";
  const status = document.createElement("p");
  status.className = "filter-status";
  status.setAttribute("aria-live", "polite");
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

    status.textContent = `${visibleCount} ${itemName === "practices" ? (visibleCount === 1 ? "práctica encontrada" : "prácticas encontradas") : (visibleCount === 1 ? "artefacto encontrado" : "artefactos encontrados")}.`;
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

  viewButtons.forEach((button) => {
    button.addEventListener("click", () => setView(button.dataset.view));
  });
  filterCards();
});
