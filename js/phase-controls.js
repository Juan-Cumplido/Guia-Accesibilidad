document.querySelectorAll(".phase-resource-controls").forEach((controls) => {
  const resourceGrid = controls.nextElementSibling;
  const typeButtons = controls.querySelectorAll("[data-resource-filter]");
  const viewButtons = controls.querySelectorAll("[data-view]");

  if (!resourceGrid?.classList.contains("card-grid")) {
    return;
  }

  const cards = Array.from(resourceGrid.querySelectorAll(".resource-card"));
  let activeType = "all";
  const levelControl = document.createElement("label");
  levelControl.className = "level-filter";
  levelControl.innerHTML = '<span>Nivel</span><select aria-label="Filtrar por nivel"><option value="all">Todos los niveles</option><option value="foundation">Básico</option><option value="intermediate">Intermedio</option><option value="advanced">Avanzado</option></select>';
  controls.append(levelControl);
  const levelSelect = levelControl.querySelector("select");
  const status = document.createElement("p");
  status.className = "filter-status phase-filter-status";
  status.setAttribute("aria-live", "polite");
  resourceGrid.insertAdjacentElement("beforebegin", status);

  const setFilter = (filter) => {
    activeType = filter;
    let visibleCount = 0;

    cards.forEach((card) => {
      const visible = (filter === "all" || card.dataset.resourceType === filter) && (levelSelect.value === "all" || card.dataset.level === levelSelect.value);
      card.hidden = !visible;
      visibleCount += visible ? 1 : 0;
    });

    typeButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.resourceFilter === filter));
    });

    status.textContent = `${visibleCount} ${filter === "all" ? "recurso" : filter === "artifact" ? "artefacto" : "práctica"}${visibleCount === 1 ? "" : "s"} ${visibleCount === 1 ? "disponible" : "disponibles"}.`;
  };

  const setView = (view) => {
    resourceGrid.classList.toggle("is-list-view", view === "list");

    viewButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.view === view));
    });
  };

  typeButtons.forEach((button) => {
    button.addEventListener("click", () => setFilter(button.dataset.resourceFilter));
  });
  levelSelect.addEventListener("change", () => setFilter(activeType));

  viewButtons.forEach((button) => {
    button.addEventListener("click", () => setView(button.dataset.view));
  });

  setFilter("all");
});
