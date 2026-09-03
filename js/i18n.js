(function () {
  "use strict";
  const dictionary = window.WAPG_ES || {};
  const textRecords = new WeakMap();
  const attributeRecords = new WeakMap();
  let language = "es";
  try { language = localStorage.getItem("wapg-language") === "en" ? "en" : "es"; } catch (_) { /* Storage is optional. */ }
  document.documentElement.lang = language;
  const normalize = (text) => text.replace(/\s+/g, " ").trim();
  const add = (source, translated) => { if (source && translated) dictionary[normalize(source)] = translated; };

  function registerResources() {
    const data = window.WAPG_DATA;
    if (!data) return;
    const translations = window.WAPG_ES_RESOURCES || {};
    for (const item of data.resources) {
      const es = translations[item.type + ":" + item.slug];
      if (!es) continue;
      const [title, summary, deliverable, checkpoints] = es;
      add(item.title, title);
      add(item.title + " | WAPG", title + " | WAPG");
      add(item.summary, summary);
      add(item.deliverable, deliverable);
      item.checkpoints.forEach((text, index) => add(text, checkpoints[index]));
      add("Define the scope and audience of the " + item.title.toLowerCase() + ". State which feature, flow, release, and WCAG 2.2 level it supports.",
        "Define el alcance y los destinatarios de «" + title + "». Indica la funcionalidad, el flujo, la versión y el nivel de WCAG 2.2 que abarca.");
      add("Create the first version. The expected deliverable is: " + item.deliverable, "Crea la primera versión. El entregable esperado es: " + deliverable);
      add("Agree on the goal, scope, owner, participants, and evidence expected from " + item.title.toLowerCase() + ".",
        "Acuerda el objetivo, alcance, responsable, participantes y evidencias esperadas de «" + title + "».");
      add("Prepare accessible materials, tools, environments, and the related " + item.title.toLowerCase() + ".",
        "Prepara materiales, herramientas y entornos accesibles, junto con el recurso relacionado: " + title + ".");
    }
    for (const [key, phase] of Object.entries(data.phaseDetails)) {
      const label = dictionary[phase.label];
      add("Use it during the " + phase.label.toLowerCase() + " phase and revisit it whenever a related requirement, design, component, or test changes.",
        "Úsalo durante la fase de " + label.toLowerCase() + " y revísalo cuando cambie un requisito, diseño, componente o prueba relacionado.");
      add("Read this first: the " + key + " barrier", "Lee esto primero: una barrera en " + label.toLowerCase());
      add("Integrate accessibility during " + key, "Integra la accesibilidad durante " + label.toLowerCase());
      add(phase.label + " practices and artifacts", "Prácticas y artefactos de " + label.toLowerCase());
      add(phase.label + " accessibility practices and artifacts", "Prácticas y artefactos de accesibilidad de " + label.toLowerCase());
      add(phase.label + " | WAPG", label + " | WAPG");
      add("Illustration of a woman presenting an accessibility challenge in the " + key + " phase", "Ilustración de una mujer presentando un desafío de accesibilidad en " + label.toLowerCase());
    }
    for (let n = 24; n <= 31; n++) add("Identified in the systematic literature review, Table " + n + ", and translated here into student-facing guidance.", "Identificado en la revisión sistemática de literatura, tabla " + n + ", y adaptado aquí como orientación para estudiantes.");
  }

  function translate(source) {
    if (language === "en") return source;
    const key = normalize(source);
    const translated = dictionary[key];
    return translated ? source.replace(source.trim(), translated) : source;
  }

  function apply() {
    const walker = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (!node.textContent.trim() || node.parentElement?.closest("script,style,[data-no-translate]")) continue;
      let record = textRecords.get(node);
      if (!record || node.textContent !== record.last) record = { source: node.textContent };
      record.last = translate(record.source);
      if (node.textContent !== record.last) node.textContent = record.last;
      textRecords.set(node, record);
    }
    document.querySelectorAll("[aria-label],[placeholder],[alt],[title]").forEach((element) => {
      if (element.closest("[data-no-translate]")) return;
      const records = attributeRecords.get(element) || {};
      for (const name of ["aria-label", "placeholder", "alt", "title"]) {
        const value = element.getAttribute(name);
        if (!value) continue;
        if (!records[name] || value !== records[name].last) records[name] = { source: value };
        records[name].last = translate(records[name].source);
        element.setAttribute(name, records[name].last);
      }
      attributeRecords.set(element, records);
    });
    document.documentElement.lang = language;
    document.querySelectorAll("[data-language]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.language === language)));
    document.querySelectorAll(".language-switch").forEach((group) => group.setAttribute("aria-label", language === "es" ? "Idioma" : "Language"));
    document.dispatchEvent(new CustomEvent("wapg:languagechange", { detail: { language } }));
  }

  window.WAPG_I18N = {
    get language() { return language; },
    translate,
    setLanguage(value) {
      if (!["es", "en"].includes(value)) return;
      language = value;
      try { localStorage.setItem("wapg-language", language); } catch (_) { /* Private mode fallback. */ }
      apply();
    }
  };
  document.addEventListener("DOMContentLoaded", () => { registerResources(); apply(); });
})();
