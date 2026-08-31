document.querySelectorAll(".filter-panel").forEach((panel) => {
  const searchForm = panel.querySelector(".search-control");
  const searchInput = searchForm?.querySelector('input[type="search"]');
  const viewButtons = panel.querySelectorAll("[data-view]");
  const cardGrid = panel.nextElementSibling;

  if (!searchForm || !searchInput || !cardGrid?.classList.contains("card-grid")) {
    return;
  }

  const cards = Array.from(cardGrid.querySelectorAll(".resource-card"));
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
      const matches = normalizeText(title).includes(query);
      card.hidden = !matches;

      if (matches) {
        visibleCount += 1;
      }
    });

    status.textContent = query
      ? `${visibleCount} ${visibleCount === 1 ? itemName.slice(0, -1) : itemName} found.`
      : "";
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

  viewButtons.forEach((button) => {
    button.addEventListener("click", () => setView(button.dataset.view));
  });
});
