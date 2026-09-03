(function () {
  "use strict";

  const data = window.WAPG_DATA;
  const host = document.querySelector("[data-resource-detail]");
  if (!data || !host) return;

  const type = host.dataset.resourceType;
  const slug = host.dataset.resourceSlug;
  const item = data.resourcesBySlug.get(`${type}:${slug}`);
  if (!item) {
    host.innerHTML = '<h1>Resource not found</h1><p>The requested guide page is not available.</p>';
    return;
  }

  const phase = data.phaseDetails[item.phase];
  const level = data.levelDetails[item.level];
  const sourceTable = type === "practice"
    ? { requirements: "Table 24", design: "Table 25", implementation: "Table 26", testing: "Table 27" }[item.phase]
    : { requirements: "Table 28", design: "Table 29", implementation: "Table 30", testing: "Table 31" }[item.phase];
  const counterpartType = type === "artifact" ? "practice" : "artifact";
  const counterpart = data.resourcesBySlug.get(`${counterpartType}:${item.related}`);

  const wcagByPhase = {
    requirements: [
      ["1.3.1", "Info and Relationships", "A"],
      ["2.1.1", "Keyboard", "A"],
      ["3.3.1", "Error Identification", "A"],
      ["3.3.2", "Labels or Instructions", "A"]
    ],
    design: [
      ["1.4.3", "Contrast (Minimum)", "AA"],
      ["1.4.10", "Reflow", "AA"],
      ["2.4.3", "Focus Order", "A"],
      ["2.4.7", "Focus Visible", "AA"]
    ],
    implementation: [
      ["1.3.1", "Info and Relationships", "A"],
      ["2.1.1", "Keyboard", "A"],
      ["2.4.3", "Focus Order", "A"],
      ["4.1.2", "Name, Role, Value", "A"]
    ],
    testing: [
      ["1.4.10", "Reflow", "AA"],
      ["2.1.1", "Keyboard", "A"],
      ["2.4.7", "Focus Visible", "AA"],
      ["4.1.2", "Name, Role, Value", "A"]
    ]
  };

  const resourcesByPhase = {
    requirements: [
      ["W3C Planning and Managing Accessibility", "https://www.w3.org/WAI/planning-and-managing/"],
      ["W3C Accessibility Roles and Responsibilities Mapping", "https://www.w3.org/WAI/planning/arrm/"],
      ["WCAG 2.2 Quick Reference", "https://www.w3.org/WAI/WCAG22/quickref/"],
      ["W3C video: How People with Disabilities Use the Web", "https://www.w3.org/WAI/people-use-web/videos/"]
    ],
    design: [
      ["W3C Design and Develop overview", "https://www.w3.org/WAI/design-develop/"],
      ["W3C Web Accessibility Tutorials", "https://www.w3.org/WAI/tutorials/"],
      ["ARIA Authoring Practices Guide patterns", "https://www.w3.org/WAI/ARIA/apg/patterns/"],
      ["W3C video: Perspectives on Web Accessibility", "https://www.w3.org/WAI/perspective-videos/"]
    ],
    implementation: [
      ["W3C Developing for Web Accessibility", "https://www.w3.org/WAI/tips/developing/"],
      ["ARIA Authoring Practices Guide", "https://www.w3.org/WAI/ARIA/apg/"],
      ["W3C Page Structure Tutorial", "https://www.w3.org/WAI/tutorials/page-structure/"],
      ["WCAG 2.2 Quick Reference", "https://www.w3.org/WAI/WCAG22/quickref/"]
    ],
    testing: [
      ["W3C Easy Checks", "https://www.w3.org/WAI/test-evaluate/easy-checks/"],
      ["W3C Evaluation Tools List", "https://www.w3.org/WAI/test-evaluate/tools/list/"],
      ["W3C Involving Users in Evaluation", "https://www.w3.org/WAI/test-evaluate/involving-users/"],
      ["W3C WCAG-EM overview and video", "https://www.w3.org/WAI/test-evaluate/conformance/wcag-em/"]
    ]
  };

  const examples = {
    requirements: {
      bad: "The page must be accessible.",
      good: "Given a keyboard-only user on the registration form, when they press Tab, focus moves through every interactive control in the same logical order as the content, without entering a keyboard trap. Verify manually and record the result against WCAG 2.1.1 and 2.4.3."
    },
    design: {
      bad: "The prototype shows only the default visual state. Focus, errors, reading order, and responsive reflow are not specified.",
      good: "The prototype annotates heading and landmark structure, keyboard order, focus destination after updates, visible focus, error text, accessible names, contrast values, and the layout at 320 CSS pixels."
    },
    implementation: {
      bad: '<div class="button" onclick="save()">Save</div>',
      good: '<button type="button" id="save">Save</button>\n<p id="save-status" role="status"></p>'
    },
    testing: {
      bad: "Lighthouse score: 100. Result: the product is fully accessible.",
      good: "Automated scan: 0 confirmed critical violations in scope. Manual review: keyboard, 400% reflow, focus, labels, and errors passed except issue A11Y-24. User evaluation: 4 of 5 participants completed the critical task; one screen-reader barrier remains. Conformance is not claimed until the open failure is resolved."
    }
  };

  const steps = type === "artifact"
    ? [
        `Define the scope and audience of the ${item.title.toLowerCase()}. State which feature, flow, release, and WCAG 2.2 level it supports.`,
        `Collect inputs from the previous phase, relevant users, standards, and existing evidence. Do not invent needs when they can be investigated.`,
        `Create the first version. The expected deliverable is: ${item.deliverable}`,
        `Review the artifact with the roles that will use it. Apply every quality checkpoint below and record decisions or unresolved risks.`,
        "Link the approved artifact to related requirements, design, implementation, tests, and backlog items. Version it when the product changes."
      ]
    : [
        `Agree on the goal, scope, owner, participants, and evidence expected from ${item.title.toLowerCase()}.`,
        `Prepare accessible materials, tools, environments, and the related ${counterpart ? counterpart.title.toLowerCase() : "project artifact"}.`,
        `Execute the practice on a complete critical user flow, not only on an isolated screen or component.`,
        "Record observations and results separately from assumptions. Prioritize findings by impact on task completion and affected users.",
        "Apply corrections, repeat the verification, and preserve the evidence so the result remains traceable in later phases."
      ];

  const checklist = item.checkpoints.map((checkpoint) => `<li>${checkpoint}</li>`).join("");
  const stepsMarkup = steps.map((step, index) => `<li><strong>Step ${index + 1}.</strong> ${step}</li>`).join("");
  const wcagMarkup = wcagByPhase[item.phase].map(([number, name, wcagLevel]) => `<li><a href="https://www.w3.org/WAI/WCAG22/Understanding/${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}.html"><strong>${number} ${name} — Level ${wcagLevel}</strong></a><span>Evaluate applicability in this resource's actual product context.</span></li>`).join("");
  const linksMarkup = resourcesByPhase[item.phase].map(([label, href]) => `<li><a href="${href}">${label}</a> <span class="external-note">(external W3C resource)</span></li>`).join("");
  const example = examples[item.phase];
  const levelClass = item.level === "advanced" ? " level-callout--advanced" : "";

  document.title = `${item.title} | WAPG`;
  host.innerHTML = `
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <ol>
        <li><a href="../index.html">Home</a></li>
        <li><a href="../${phase.href}">${phase.label}</a></li>
        <li><a href="../${type === "artifact" ? "artifacts.html" : "practices.html"}">${type === "artifact" ? "Artifacts" : "Practices"}</a></li>
        <li aria-current="page">${item.title}</li>
      </ol>
    </nav>

    <div class="practice-layout resource-detail-layout">
      <aside class="side-card" aria-labelledby="page-contents-title">
        <h2 id="page-contents-title">Page contents</h2>
        <nav aria-label="Resource sections">
          <ul>
            <li><a href="#about">About</a></li>
            <li><a href="#steps">Step by step</a></li>
            <li><a href="#example">Accessible example</a></li>
            <li><a href="#criteria">Acceptance criteria</a></li>
            <li><a href="#relationship">Related resource</a></li>
            <li><a href="#resources">Learning resources</a></li>
          </ul>
        </nav>
      </aside>

      <article class="practice-main">
        <div class="detail-eyebrow"><span>${type}</span><span>${phase.label}</span></div>
        <h1>${item.title}</h1>
        <p class="practice-lead">${item.summary}</p>

        <div class="level-callout${levelClass}" role="note" aria-label="Student level guidance">
          <strong>${level.label}: ${level.semesters}</strong>
          <span>${level.note}</span>
        </div>

        <section id="about" class="content-box" aria-labelledby="about-title">
          <h2 id="about-title">About this ${type}</h2>
          <div class="content-box-body">
            <dl class="definition-list">
              <div><dt>What it is</dt><dd>${item.summary}</dd></div>
              <div><dt>Expected result</dt><dd>${item.deliverable}</dd></div>
              <div><dt>When to use it</dt><dd>Use it during the ${phase.label.toLowerCase()} phase and revisit it whenever a related requirement, design, component, or test changes.</dd></div>
              <div><dt>Barrier it helps prevent</dt><dd>${phase.barrier}</dd></div>
              <div><dt>Evidence base</dt><dd>Identified in the systematic literature review, ${sourceTable}, and translated here into student-facing guidance.</dd></div>
            </dl>
          </div>
        </section>

        <section id="steps" class="content-box" aria-labelledby="steps-title">
          <h2 id="steps-title">How to ${type === "artifact" ? "create it" : "apply it"}: step by step</h2>
          <div class="content-box-body"><ol class="step-list">${stepsMarkup}</ol></div>
        </section>

        <section id="example" class="content-box" aria-labelledby="example-title">
          <h2 id="example-title">Compare the result</h2>
          <div class="content-box-body example-comparison">
            <div class="example-panel example-panel--bad"><h3>Does not provide enough accessibility</h3><pre><code>${example.bad.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre><p>Why it fails: it is vague, incomplete, or treats a partial check as proof of accessibility.</p></div>
            <div class="example-panel example-panel--good"><h3>Accessible and verifiable</h3><pre><code>${example.good.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre><p>Why it works: it states context, observable behavior, verification evidence, and remaining limits.</p></div>
          </div>
        </section>

        <section id="criteria" class="content-box" aria-labelledby="criteria-title">
          <h2 id="criteria-title">Acceptance and quality criteria</h2>
          <div class="content-box-body"><ul class="criteria-list">${checklist}<li>The result is linked to applicable WCAG 2.2 criteria and has enough evidence for another person to verify it.</li><li>Any limitation, assumption, exception, or unresolved risk is explicit.</li></ul></div>
        </section>

        <section id="relationship" class="content-box" aria-labelledby="relationship-title">
          <h2 id="relationship-title">Association with ${counterpartType === "artifact" ? "an artifact" : "a practice"}</h2>
          <div class="content-box-body">
            ${counterpart ? `<p>This ${type} is directly associated with <a href="../${counterpartType === "artifact" ? "artifacts" : "practices"}/${counterpart.slug}.html"><strong>${counterpart.title}</strong></a>. Use both to connect the activity with durable evidence.</p>` : "<p>Connect this resource to the project artifact or practice that preserves its evidence.</p>"}
          </div>
        </section>

        <section id="resources" class="content-box" aria-labelledby="resources-title">
          <h2 id="resources-title">Resources and videos for learning</h2>
          <div class="content-box-body"><ul class="resource-links">${linksMarkup}</ul><p>External links open in the same tab so browser Back continues to work predictably.</p></div>
        </section>
      </article>

      <aside class="wcag-card" aria-labelledby="wcag-title">
        <h2 id="wcag-title">WCAG 2.2 starting points</h2>
        <p class="wcag-note">This mapping is a starting point. Select all criteria that apply to the actual content and functionality.</p>
        <ul class="wcag-list">${wcagMarkup}</ul>
      </aside>
    </div>`.replaceAll('href="../', 'href="' + (host.dataset.resourceBase || "../"));
})();
