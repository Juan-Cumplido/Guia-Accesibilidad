$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $PSScriptRoot

$phases = @(
  @{
    Slug = "requirements"; Title = "Requirements"; Challenge = "Accessibility needs are often discovered after scope and acceptance criteria are already fixed. This turns accessibility into expensive rework. Begin with diverse users, critical tasks, contexts, assistive technologies, WCAG 2.2, and measurable outcomes.";
    Actions = @("Elicit needs with standards, existing-system analysis, interviews, surveys, and participation by people with disabilities.", "Express needs as stories, use cases, catalog entries, and testable acceptance criteria.", "Prioritize accessibility in the backlog and preserve traceability to design, code, and tests.")
  },
  @{
    Slug = "design"; Title = "Design"; Challenge = "A visually polished prototype can still conceal an illogical reading order, missing focus and error states, poor contrast, cognitive overload, or interactions that require a mouse. Make these decisions visible and test them before coding.";
    Actions = @("Prototype complete critical flows, including focus, errors, loading, responsive reflow, and assistive-technology annotations.", "Use accessible patterns, design systems, and reusable component specifications.", "Review and iterate designs with accessibility specialists and people with disabilities.")
  },
  @{
    Slug = "implementation"; Title = "Implementation"; Challenge = "Custom components, framework abstractions, and late fixes can remove semantics, hide state, or break keyboard and focus behavior. Use native HTML and validated components, then verify them in the real product context.";
    Actions = @("Implement semantic structure, keyboard operation, visible focus, adaptable presentation, and reliable names, roles, states, and values.", "Reuse validated components and templates without overriding their accessible contracts.", "Use an accessible Definition of Done and return every confirmed defect to a traceable correction cycle.")
  },
  @{
    Slug = "testing"; Title = "Testing"; Challenge = "Automated tools detect only a subset of WCAG. A high score can coexist with keyboard traps, confusing announcements, inaccessible tasks, or barriers experienced by real users. Testing must combine complementary evidence.";
    Actions = @("Run automated checks continuously for reliably detectable failures.", "Inspect keyboard, focus, zoom, reflow, semantics, errors, and assistive-technology behavior manually.", "Evaluate critical tasks with representative users and combine conformance findings with task outcomes.")
  }
)

foreach ($phase in $phases) {
  $slug = $phase.Slug
  $title = $phase.Title
  $actionItems = ($phase.Actions | ForEach-Object { "<li>$_</li>" }) -join ""
  $testingMethods = if ($slug -eq "testing") { @"
    <section class="testing-methods" aria-labelledby="testing-evidence-title">
      <h2 id="testing-evidence-title">Combine qualitative and quantitative evidence</h2>
      <p>No single branch can demonstrate accessibility. Plan at least one method from each side when project scope and ethics allow it, and always explain remaining coverage gaps.</p>
      <div class="testing-branches">
        <article class="testing-branch"><span class="branch-label">Qualitative branch 1</span><h3>Expert and manual review</h3><p>Use WCAG checklists, keyboard and focus inspection, screen readers, heuristic review, and Barrier Walkthroughs to explain why a barrier occurs and how severe its impact is.</p></article>
        <article class="testing-branch"><span class="branch-label">Qualitative branch 2</span><h3>Evaluation with users</h3><p>Use observation, interviews, focus groups, think-aloud, and accessible co-evaluation with people with disabilities. Do not generalize a small sample to every user.</p></article>
        <article class="testing-branch"><span class="branch-label">Quantitative branch 1</span><h3>Conformance and technical measures</h3><p>Count confirmed WCAG violations by criterion and severity, track coverage, and use tool scores only as a trend indicator—not as proof of conformance.</p></article>
        <article class="testing-branch"><span class="branch-label">Quantitative branch 2</span><h3>Task performance measures</h3><p>Measure task completion, time, errors, assistance, and workload or satisfaction scales. Interpret numbers together with observations and participant context.</p></article>
      </div>
      <div class="combination-callout"><strong>Recommendation:</strong> triangulate automation, manual or expert review, assistive technology, and user evidence before a release decision.</div>
    </section>
"@ } else { "" }

  $html = @"
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=2.0" />
  <title>$title | WAPG</title>
  <link rel="stylesheet" href="./css/styles.css" />
  <link rel="stylesheet" href="./css/site-header.css" />
  <script src="./js/translations-es.js" defer></script>
  <script src="./js/resource-translations-es.js" defer></script>
  <script src="./js/i18n.js" defer></script>
  <script src="./js/site-header.js" defer></script>
  <script src="./js/resource-data.js" defer></script>
  <script src="./js/catalog-renderer.js" defer></script>
  <script src="./js/phase-controls.js" defer></script>
</head>
<body>
  <a class="skip-link" href="#main-content">Skip to main content</a>
  <header class="site-header"></header>
  <main id="main-content" class="page-shell">
    <h1 class="page-title">$title</h1>
    <section class="read-first" aria-labelledby="$slug-challenge-title">
      <img src="./assets/read-first-guide.png" alt="Illustration of a woman presenting an accessibility challenge in the $slug phase" />
      <div><h2 id="$slug-challenge-title">Read this first: the $slug barrier</h2><p>$($phase.Challenge)</p></div>
    </section>
    <section class="phase-overview" aria-labelledby="$slug-actions-title">
      <div><span class="section-kicker">What to do</span><h2 id="$slug-actions-title">Integrate accessibility during $slug</h2></div>
      <ol>$actionItems</ol>
    </section>
$testingMethods
    <section class="phase-resource-controls" aria-labelledby="$slug-resources-title">
      <h2 id="$slug-resources-title">$title practices and artifacts</h2>
      <div class="phase-control-row">
        <div class="resource-filter-actions" aria-label="Filter by resource type">
          <button class="filter-button" type="button" data-resource-filter="all" aria-pressed="true">All</button>
          <button class="filter-button" type="button" data-resource-filter="artifact" aria-pressed="false">Artifacts</button>
          <button class="filter-button" type="button" data-resource-filter="practice" aria-pressed="false">Practices</button>
        </div>
        <div class="view-actions" aria-label="View options">
          <button class="icon-button" type="button" data-view="list" aria-label="Show resources as a list" aria-pressed="false"><svg aria-hidden="true" viewBox="0 0 44 44"><path d="M8 10h7v7H8zm0 13h7v7H8zm12-11h17M20 25h17" stroke="currentColor" stroke-width="4" fill="none" /></svg></button>
          <button class="icon-button" type="button" data-view="grid" aria-label="Show resources as a grid" aria-pressed="true"><svg aria-hidden="true" viewBox="0 0 44 44"><path d="M7 7h13v13H7zm17 0h13v13H24zM7 24h13v13H7zm17 0h13v13H24z" fill="currentColor" /></svg></button>
        </div>
      </div>
    </section>
    <section class="card-grid" data-phase-catalog="$slug" aria-label="$title accessibility practices and artifacts"></section>
  </main>
</body>
</html>
"@
  Set-Content -LiteralPath (Join-Path $projectRoot "$slug.html") -Value $html -Encoding UTF8
}

Write-Output "Generated $($phases.Count) phase pages."
