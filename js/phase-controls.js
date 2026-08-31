document.querySelectorAll(".phase-resource-controls").forEach((controls) => {
  const resourceGrid = controls.nextElementSibling;
  const typeButtons = controls.querySelectorAll("[data-resource-filter]");
  const viewButtons = controls.querySelectorAll("[data-view]");

  if (!resourceGrid?.classList.contains("card-grid")) {
    return;
  }

  const cards = Array.from(resourceGrid.querySelectorAll(".resource-card"));
  const status = document.createElement("p");
  status.className = "filter-status phase-filter-status";
  status.setAttribute("aria-live", "polite");
  resourceGrid.insertAdjacentElement("beforebegin", status);

  const setFilter = (filter) => {
    let visibleCount = 0;

    cards.forEach((card) => {
      const visible = filter === "all" || card.dataset.resourceType === filter;
      card.hidden = !visible;
      visibleCount += visible ? 1 : 0;
    });

    typeButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.resourceFilter === filter));
    });

    const filterLabel = filter === "all" ? "resources" : `${filter}s`;
    status.textContent = `${visibleCount} ${filterLabel} shown.`;
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

  viewButtons.forEach((button) => {
    button.addEventListener("click", () => setView(button.dataset.view));
  });

  setFilter("all");
});
