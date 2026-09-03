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
  { id: "home", label: "Home", href: "index.html" },
  { id: "requirements", label: "Requirements", href: "requirements.html" },
  { id: "design", label: "Design", href: "design.html" },
  { id: "implementation", label: "Implementation", href: "implementation.html" },
  { id: "testing", label: "Testing", href: "testing.html" },
  { id: "artifacts", label: "Artifacts", href: "artifacts.html" },
  { id: "practices", label: "Practices", href: "practices.html" }
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
      <div class="language-switch" role="group" aria-label="Language" data-no-translate>
        <button type="button" data-language="es" lang="es" aria-pressed="true">Español</button>
        <button type="button" data-language="en" lang="en" aria-pressed="false">English</button>
      </div>
      <h1 class="site-title"><a href="${siteHref("index.html")}">Web Accessibility Practices Guide (WAPG)</a></h1>
      <p class="site-subtitle">How to integrate web accessibility into software development</p>
      <a class="university-name" href="https://www.uv.mx/">Universidad Veracruzana</a>
    </div>

    <nav class="main-nav" aria-label="Main navigation">
      <ul>${navigationMarkup}</ul>
    </nav>
  `;
});

document.querySelectorAll("[data-language]").forEach((button) => {
  button.addEventListener("click", () => window.WAPG_I18N.setLanguage(button.dataset.language));
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
backToTop.innerHTML = '<span aria-hidden="true">↑</span> Back to Top';
document.body.append(backToTop);

const updateBackToTopVisibility = () => {
  backToTop.classList.toggle("is-visible", window.scrollY > 240);
};

window.addEventListener("scroll", updateBackToTopVisibility, { passive: true });
updateBackToTopVisibility();
