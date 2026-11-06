(function () {
  "use strict";

  const data = window.WAPG_DATA;
  const host = document.querySelector("[data-resource-detail]");
  if (!data || !host) return;

  const type = host.dataset.resourceType;
  const slug = host.dataset.resourceSlug;
  const item = data.resourcesBySlug.get(`${type}:${slug}`);
  if (!item) {
    host.innerHTML = '<h1>Recurso no encontrado</h1><p>La página solicitada no está disponible.</p>';
    return;
  }

  const phase = data.phaseDetails[item.phase];
  const level = data.levelDetails[item.level];
  const sourceTable = type === "practice"
    ? { requirements: "tabla 24", design: "tabla 25", implementation: "tabla 26", testing: "tabla 27" }[item.phase]
    : { requirements: "tabla 28", design: "tabla 29", implementation: "tabla 30", testing: "tabla 31" }[item.phase];
  const counterpartType = type === "artifact" ? "practice" : "artifact";
  const counterpart = data.resourcesBySlug.get(`${counterpartType}:${item.related}`);

  const resourcesByPhase = {
    requirements: [
      ["W3C: planificación y gestión de la accesibilidad", "https://www.w3.org/WAI/planning-and-managing/"],
      ["W3C: asignación de roles y responsabilidades de accesibilidad", "https://www.w3.org/WAI/planning/arrm/"],
      ["Referencia rápida de WCAG 2.2", "https://www.w3.org/WAI/WCAG22/quickref/"],
      ["Video del W3C: cómo usan la web las personas con discapacidad", "https://www.w3.org/WAI/people-use-web/videos/"]
    ],
    design: [
      ["W3C: introducción al diseño y desarrollo", "https://www.w3.org/WAI/design-develop/"],
      ["Tutoriales de accesibilidad web del W3C", "https://www.w3.org/WAI/tutorials/"],
      ["Patrones de la guía de prácticas de autoría ARIA", "https://www.w3.org/WAI/ARIA/apg/patterns/"],
      ["Video del W3C: perspectivas sobre accesibilidad web", "https://www.w3.org/WAI/perspective-videos/"]
    ],
    implementation: [
      ["W3C: desarrollo para la accesibilidad web", "https://www.w3.org/WAI/tips/developing/"],
      ["Guía de prácticas de autoría ARIA", "https://www.w3.org/WAI/ARIA/apg/"],
      ["W3C: tutorial de estructura de páginas", "https://www.w3.org/WAI/tutorials/page-structure/"],
      ["Referencia rápida de WCAG 2.2", "https://www.w3.org/WAI/WCAG22/quickref/"]
    ],
    testing: [
      ["W3C: comprobaciones sencillas", "https://www.w3.org/WAI/test-evaluate/easy-checks/"],
      ["W3C: lista de herramientas de evaluación", "https://www.w3.org/WAI/test-evaluate/tools/list/"],
      ["W3C: participación de usuarios en la evaluación", "https://www.w3.org/WAI/test-evaluate/involving-users/"],
      ["W3C: introducción y video de WCAG-EM", "https://www.w3.org/WAI/test-evaluate/conformance/wcag-em/"]
    ]
  };

  const exampleLibrary = window.GPAW_EXAMPLES;
  const resourceKey = `${type}:${slug}`;
  const example = exampleLibrary?.examples[resourceKey];
  const resourceBase = host.dataset.resourceBase || "../";
  const escapeHtml = (text) => text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
  const renderRecord = (fields) => `<dl class="worked-example-record">${fields.map(([label, value]) =>
    `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join("")}</dl>`;

  const renderUseCase = (useCase) => `
    <section class="worked-example-detail" aria-labelledby="use-case-description">
      <h3 id="use-case-description">Descripción textual del caso de uso</h3>
      ${renderRecord(useCase.context)}
      <h4>Flujo principal</h4>
      <ol class="worked-example-flow">${useCase.main.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol>
      <h4>Flujos alternativos</h4>
      ${renderRecord(useCase.alternatives)}
      <h4>Poscondiciones y pruebas</h4>
      ${renderRecord(useCase.outcomes)}
    </section>`;

  const renderScreens = (views) => `
    <div class="worked-example-screens">${views.map(([heading, fields, layout]) => `
      <section class="worked-example-screen${layout === "columns" ? " worked-example-screen--columns" : ""}">
        <h3>${escapeHtml(heading)}</h3>
        ${fields.map(([label, value, kind]) => `
          <div class="worked-example-control worked-example-control--${kind}">
            <strong>${escapeHtml(label)}</strong>
            ${value ? `<span>${escapeHtml(value)}</span>` : ""}
          </div>`).join("")}
      </section>`).join("")}</div>
    <p class="worked-example-meta">Maqueta de referencia. Controles ilustrativos.</p>`;

  function renderVisual(visual) {
    switch (visual.kind) {
      case "record":
        return renderRecord(visual.fields);
      case "table":
        return `<table class="worked-example-table" role="table" aria-labelledby="worked-example-title">
          <thead role="rowgroup"><tr role="row">${visual.headers.map((label) =>
            `<th scope="col" role="columnheader">${escapeHtml(label)}</th>`).join("")}</tr></thead>
          <tbody role="rowgroup">${visual.rows.map(([label, ...values]) => `
            <tr role="row"><th scope="row" role="rowheader">${escapeHtml(label)}</th>
              ${values.map((value, index) => `<td role="cell"><strong class="worked-example-cell-label" aria-hidden="true">${escapeHtml(visual.headers[index + 1])}</strong>${escapeHtml(value)}</td>`).join("")}
            </tr>`).join("")}</tbody></table>`;
      case "flow":
        return `<ol class="worked-example-flow" role="list">${visual.nodes.map(([label, value]) =>
          `<li><strong>${escapeHtml(label)}</strong><span>${escapeHtml(value)}</span></li>`).join("")}</ol>`;
      case "screens":
        return renderScreens(visual.views);
      case "code":
        return `<pre class="worked-example-code"><code>${escapeHtml(visual.snippet)}</code></pre>${visual.preview ? renderScreens(visual.preview) : ""}`;
      case "diagram": {
        const path = `${resourceBase}assets/examples/${visual.file}`;
        return `<img class="worked-example-diagram" src="${path}" alt="${escapeHtml(visual.alt)}">
          <p class="worked-example-meta"><a href="${path}">Abrir el diagrama a tamaño completo</a></p>
          <ul class="worked-example-description">${visual.description.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul>`;
      }
    }
    return "";
  }

  function renderExample() {
    if (!example) return "<p>No se pudo cargar el ejemplo de este recurso.</p>";
    const track = exampleLibrary.tracks[example.track];
    const [before, change, check] = exampleLibrary.comparisons[resourceKey];
    const route = track.route.map((key) => {
      const stop = data.resourcesBySlug.get(key);
      const label = data.phaseDetails[stop.phase].label;
      const folder = stop.type === "artifact" ? "artifacts" : "practices";
      const title = `${label} · ${stop.title}`;
      return key === resourceKey
        ? `<li><strong aria-current="step">${title}</strong></li>`
        : `<li><a href="${resourceBase}${folder}/${stop.slug}.html#example">${title}</a></li>`;
    }).join("");
    return `
      <p class="worked-example-meta">Portal de talleres · Caso ficticio · ${escapeHtml(track.label)}</p>
      <figure class="worked-example">
        <figcaption id="worked-example-title">${escapeHtml(example.title)}</figcaption>
        ${renderVisual(example.visual)}
      </figure>
      ${example.visual.useCase ? renderUseCase(example.visual.useCase) : ""}
      <section class="worked-example-detail" aria-labelledby="worked-example-comparison">
        <h3 id="worked-example-comparison">Qué cambió y por qué</h3>
        ${renderRecord([
          ["Qué falla en la versión inicial", before],
          ["Qué se agregó", change],
          ["Cómo comprobarlo", check]
        ])}
      </section>
      <p>${escapeHtml(example.note)}</p>
      <p class="worked-example-meta">Referencia técnica · <a href="${example.source[1]}">${escapeHtml(example.source[0])}</a></p>
      <nav class="worked-example-route" aria-labelledby="worked-example-route-title">
        <h3 id="worked-example-route-title">Seguir el mismo caso</h3>
        <ol>${route}</ol>
      </nav>`;
  }

  const steps = type === "artifact"
    ? [
        `Define el alcance y los destinatarios de «${item.title}». Indica la funcionalidad, el flujo, la versión y el nivel de WCAG 2.2 que abarca.`,
        `Reúne información de la fase anterior, los usuarios, los estándares y las evidencias existentes. Investiga las necesidades antes de asumirlas.`,
        `Crea la primera versión. El entregable esperado es: ${item.deliverable}`,
        `Revisa el artefacto con quienes lo usarán. Aplica los criterios de calidad siguientes y registra decisiones o riesgos pendientes.`,
        "Vincula el artefacto aprobado con requisitos, diseño, implementación, pruebas y elementos del backlog. Actualiza su versión cuando cambie el producto."
      ]
    : [
        `Acuerda el objetivo, alcance, responsable, participantes y evidencias esperadas de «${item.title}».`,
        `Prepara materiales, herramientas y entornos accesibles, junto con el recurso relacionado: ${counterpart ? counterpart.title : "artefacto del proyecto"}.`,
        `Aplica la práctica en un flujo crítico completo, además de comprobar las pantallas y componentes individuales.`,
        "Registra observaciones y resultados por separado de las suposiciones. Prioriza los hallazgos según su impacto en las tareas y los usuarios afectados.",
        "Aplica las correcciones, repite la verificación y conserva las evidencias para mantener la trazabilidad en las fases siguientes."
      ];

  const checklist = item.checkpoints.map((checkpoint) => `<li>${checkpoint}</li>`).join("");
  const stepsMarkup = steps.map((step, index) => `<li><strong>Paso ${index + 1}.</strong> ${step}</li>`).join("");
  const wcagMarkup = (example?.criteria || []).map(([number, check]) => {
    const [name, level, fragment] = exampleLibrary.wcag[number];
    return `<li><a href="https://www.w3.org/TR/WCAG22/#${fragment}"><strong>${number} ${name} · Nivel ${level}</strong></a><span>${escapeHtml(check)}</span></li>`;
  }).join("");
  const linksMarkup = resourcesByPhase[item.phase].map(([label, href]) => `<li><a href="${href}">${label}</a> <span class="external-note">(recurso externo del W3C)</span></li>`).join("");
  const levelClass = item.level === "advanced" ? " level-callout--advanced" : "";

  document.title = `${item.title} | GPAW`;
  host.innerHTML = `
    <nav class="breadcrumb" aria-label="Ruta de navegación">
      <ol>
        <li><a href="../index.html">Inicio</a></li>
        <li><a href="../${phase.href}">${phase.label}</a></li>
        <li><a href="../${type === "artifact" ? "artifacts.html" : "practices.html"}">${type === "artifact" ? "Artefactos" : "Prácticas"}</a></li>
        <li aria-current="page">${item.title}</li>
      </ol>
    </nav>

    <div class="practice-layout resource-detail-layout">
      <aside class="side-card" aria-labelledby="page-contents-title">
        <h2 id="page-contents-title">Contenido de la página</h2>
        <nav aria-label="Secciones del recurso">
          <ul>
            <li><a href="#about">Descripción</a></li>
            <li><a href="#steps">Paso a paso</a></li>
            <li><a href="#example">Ejemplo completo</a></li>
            <li><a href="#criteria">Criterios de aceptación</a></li>
            <li><a href="#relationship">Recurso relacionado</a></li>
            <li><a href="#resources">Recursos de aprendizaje</a></li>
          </ul>
        </nav>
      </aside>

      <article class="practice-main">
        <div class="detail-eyebrow"><span>${type === "artifact" ? "artefacto" : "práctica"}</span><span>${phase.label}</span></div>
        <h1>${item.title}</h1>
        <p class="practice-lead">${item.summary}</p>

        <div class="level-callout${levelClass}" role="note" aria-label="Orientación sobre el nivel">
          <strong>${level.label}: ${level.semesters}</strong>
          <span>${level.note}</span>
        </div>

        <section id="about" class="content-box" aria-labelledby="about-title">
          <h2 id="about-title">Acerca de ${type === "artifact" ? "este artefacto" : "esta práctica"}</h2>
          <div class="content-box-body">
            <dl class="definition-list">
              <div><dt>Qué es</dt><dd>${item.summary}</dd></div>
              <div><dt>Resultado esperado</dt><dd>${item.deliverable}</dd></div>
              <div><dt>Cuándo usarlo</dt><dd>Úsalo durante la fase de ${phase.label.toLowerCase()} y revísalo cuando cambie un requisito, diseño, componente o prueba relacionado.</dd></div>
              <div><dt>Barrera que ayuda a prevenir</dt><dd>${phase.barrier}</dd></div>
              <div><dt>Base de evidencia</dt><dd>Identificado en la revisión sistemática de literatura, ${sourceTable}, y adaptado aquí como orientación para estudiantes.</dd></div>
            </dl>
          </div>
        </section>

        <section id="steps" class="content-box" aria-labelledby="steps-title">
          <h2 id="steps-title">Cómo ${type === "artifact" ? "crearlo" : "aplicarla"}: paso a paso</h2>
          <div class="content-box-body"><ol class="step-list">${stepsMarkup}</ol></div>
        </section>

        <section id="example" class="content-box" aria-labelledby="example-title">
          <h2 id="example-title">Ejemplo completo</h2>
          <div class="content-box-body">${renderExample()}</div>
        </section>

        <section id="criteria" class="content-box" aria-labelledby="criteria-title">
          <h2 id="criteria-title">Criterios de aceptación y calidad</h2>
          <div class="content-box-body"><ul class="criteria-list">${checklist}<li>El resultado se vincula con los criterios WCAG 2.2 aplicables y tiene evidencias suficientes para que otra persona lo verifique.</li><li>Se indican las limitaciones, suposiciones, excepciones y riesgos pendientes.</li></ul></div>
        </section>

        <section id="relationship" class="content-box" aria-labelledby="relationship-title">
          <h2 id="relationship-title">Relación con ${counterpartType === "artifact" ? "un artefacto" : "una práctica"}</h2>
          <div class="content-box-body">
            ${counterpart ? `<p>Este recurso se relaciona directamente con <a href="../${counterpartType === "artifact" ? "artifacts" : "practices"}/${counterpart.slug}.html"><strong>${counterpart.title}</strong></a>. Usa ambos para vincular la actividad con evidencias duraderas.</p>` : "<p>Vincula este recurso con el artefacto o la práctica del proyecto que conserva sus evidencias.</p>"}
          </div>
        </section>

        <section id="resources" class="content-box" aria-labelledby="resources-title">
          <h2 id="resources-title">Recursos y videos para aprender</h2>
          <div class="content-box-body"><ul class="resource-links">${linksMarkup}</ul><p>Los enlaces externos se abren en la misma pestaña para que puedas volver con el botón Atrás del navegador.</p></div>
        </section>
      </article>

      <aside class="wcag-card" aria-labelledby="wcag-title">
        <h2 id="wcag-title">WCAG 2.2 en este ejemplo</h2>
        <p class="wcag-note">Esta correspondencia es un punto de partida. Selecciona todos los criterios aplicables al contenido y la funcionalidad reales.</p>
        <ul class="wcag-list">${wcagMarkup}</ul>
      </aside>
    </div>`.replaceAll('href="../', 'href="' + (host.dataset.resourceBase || "../"));
})();
