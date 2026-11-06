const currentPath = window.location.pathname.split("/").pop().toLowerCase();
const pathSegments = window.location.pathname.toLowerCase().split("/").filter(Boolean);
const scriptUrl = document.currentScript ? document.currentScript.src : new URL("js/site-header.js", window.location.href).href;
const siteRoot = new URL("..", scriptUrl);
const siteHref = (path) => new URL(path, siteRoot).href;

let currentSection = "home";

if (currentPath === "artifacts.html" || pathSegments.includes("artifacts")) {
  currentSection = "artifacts";
} else if (currentPath === "practices.html" || currentPath === "user-stories.html" || pathSegments.includes("practices")) {
  currentSection = "practices";
} else if (["requirements", "design", "implementation", "testing"].some((phase) => currentPath === `${phase}.html`)) {
  currentSection = currentPath.replace(".html", "");
}

const navigationItems = [
  { id: "home", label: "Inicio", href: "index.html" },
  { id: "requirements", label: "Requisitos", href: "requirements.html" },
  { id: "design", label: "Diseño", href: "design.html" },
  { id: "implementation", label: "Implementación", href: "implementation.html" },
  { id: "testing", label: "Pruebas", href: "testing.html" },
  { id: "artifacts", label: "Artefactos", href: "artifacts.html" },
  { id: "practices", label: "Prácticas", href: "practices.html" }
];

const navigationMarkup = navigationItems
  .map(({ id, label, href }) => {
    const currentAttribute = id === currentSection ? ' aria-current="page"' : "";
    return `<li><a href="${siteHref(href)}"${currentAttribute}>${label}</a></li>`;
  })
  .join("");

document.querySelectorAll(".site-header").forEach((header) => {
  header.innerHTML = `
    <div class="brand-bar">
      <h1 class="site-title"><a href="${siteHref("index.html")}">Guía Práctica de Accesibilidad Web (GPAW)</a></h1>
      <p class="site-subtitle">Cómo integrar la accesibilidad web en el desarrollo de software</p>
      <a class="university-name" href="https://www.uv.mx/"><img src="${siteHref("assets/LogotipoUV.png")}" alt="" width="36" height="36" />Universidad Veracruzana</a>
    </div>

    <nav class="main-nav" aria-label="Navegación principal">
      <ul>${navigationMarkup}</ul>
    </nav>
  `;
});

const primaryHeader = document.querySelector(".site-header");
if (primaryHeader && "ResizeObserver" in window) {
  const headerObserver = new ResizeObserver(([entry]) => {
    document.documentElement.style.setProperty("--site-header-height", `${entry.contentRect.height}px`);
  });
  headerObserver.observe(primaryHeader);
}

document.body.id = document.body.id || "top";

const backToTop = document.createElement("a");
backToTop.className = "back-to-top";
backToTop.href = "#top";
backToTop.innerHTML = '<span aria-hidden="true">↑</span> Volver arriba';
document.body.append(backToTop);

const updateBackToTopVisibility = () => {
  backToTop.classList.toggle("is-visible", window.scrollY > 240);
};

window.addEventListener("scroll", updateBackToTopVisibility, { passive: true });
updateBackToTopVisibility();
