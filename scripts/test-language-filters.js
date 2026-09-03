// Run with the bundled playwright package available on NODE_PATH.
const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const vm = require("node:vm");
const root = path.resolve(__dirname, "..");
const context = { window: {} };
vm.createContext(context);
for (const file of ["resource-data.js", "translations-es.js", "resource-translations-es.js"]) {
  vm.runInContext(fs.readFileSync(path.join(root, "js", file), "utf8"), context);
}
const data = context.window.WAPG_DATA.resources;
for (const item of data) {
  const translated = context.window.WAPG_ES_RESOURCES[item.type + ":" + item.slug];
  assert(translated && translated.length === 4, "Missing translation: " + item.slug);
  assert.equal(translated[3].length, item.checkpoints.length);
}
const server = http.createServer((req, res) => {
  const relative = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  const target = path.resolve(root, "." + (relative === "/" ? "/index.html" : relative));
  if (!target.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".png": "image/png" };
  fs.readFile(target, (error, body) => {
    if (error) { res.writeHead(404).end(); return; }
    res.setHeader("Content-Type", (types[path.extname(target)] || "application/octet-stream") + "; charset=utf-8");
    res.end(body);
  });
});

(async () => {
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  const origin = "http://127.0.0.1:" + server.address().port;
  let browser;
  try {
    browser = await chromium.launch({ channel: "msedge", headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(origin);
    assert.equal(await page.locator("html").getAttribute("lang"), "es");
    assert.equal(await page.locator('[data-language="es"]').getAttribute("aria-pressed"), "true");
    assert.equal(await page.locator("#guide-levels-title").innerText(), "Cómo funciona la guía y cómo elegir tu nivel");
    const alignment = await page.evaluate(() => {
      const a = document.querySelector(".language-switch").getBoundingClientRect();
      const b = document.querySelector(".university-name").getBoundingClientRect();
      return { difference: Math.abs(a.y + a.height / 2 - b.y - b.height / 2), left: a.x < b.x };
    });
    assert(alignment.left && alignment.difference < 2, "Language control must align with university");
    await page.screenshot({ path: path.join(require("node:os").tmpdir(), "wapg-language-desktop.png") });
    await page.locator('[data-language="en"]').click();
    assert.equal(await page.locator("#guide-levels-title").innerText(), "How to use the guide and choose your level");
    await page.reload();
    assert.equal(await page.locator("html").getAttribute("lang"), "en");
    await page.locator('[data-language="es"]').click();

    for (const name of ["requirements", "design", "implementation", "testing", "artifacts", "practices"]) {
      await page.goto(origin + "/" + name + ".html");
      assert.equal(await page.locator("html").getAttribute("lang"), "es");
      assert.equal(await page.locator(".student-pathway,.learning-path").count(), 0);
      const select = page.locator(".level-filter select");
      const cards = page.locator(".resource-card:not([hidden])");
      const total = await cards.count();
      for (const level of ["foundation", "intermediate", "advanced"]) {
        await select.selectOption(level);
        const expected = data.filter(item => (["artifacts", "practices"].includes(name) ? item.type === name.slice(0, -1) : item.phase === name) && item.level === level).length;
        assert.equal(await cards.count(), expected, name + ": " + level);
        assert(await cards.evaluateAll((items, selected) => items.every(item => item.dataset.level === selected), level));
      }
      await page.locator('[data-view="list"]').click();
      assert(await page.locator(".card-grid").evaluate(el => el.classList.contains("is-list-view")));
      if (["artifacts", "practices"].includes(name)) {
        await select.selectOption("foundation");
        await page.locator('input[type="search"]').fill("historia");
        assert.equal(await cards.count(), 1);
        await page.locator('[data-language="en"]').click();
        assert.equal(await select.inputValue(), "foundation");
        assert.equal(await page.locator('input[type="search"]').inputValue(), "historia");
        await page.locator('input[type="search"]').fill(name === "artifacts" ? "story" : "stories");
        assert.equal(await cards.count(), 1);
        await page.locator('input[type="search"]').fill("no-such-resource");
        assert.equal(await cards.count(), 0);
        await page.locator('input[type="search"]').fill("");
        await page.locator('[data-language="es"]').click();
      } else {
        await page.locator('[data-resource-filter="artifact"]').click();
        assert(await cards.evaluateAll(items => items.every(item => item.dataset.resourceType === "artifact" && item.dataset.level === "advanced")));
        await page.locator('[data-language="en"]').click();
        assert.equal(await select.inputValue(), "advanced");
        assert.equal(await page.locator('[data-resource-filter="artifact"]').getAttribute("aria-pressed"), "true");
        await page.locator('[data-language="es"]').click();
        await page.locator('[data-resource-filter="all"]').click();
      }
      await select.selectOption("all");
      assert.equal(await cards.count(), total);
      await page.setViewportSize({ width: 320, height: 700 });
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), name + ": mobile overflow");
      assert.equal(await page.locator(".site-header").evaluate(el => getComputedStyle(el).position), "static");
      if (name === "artifacts") await page.screenshot({ path: path.join(require("node:os").tmpdir(), "wapg-language-mobile.png"), fullPage: false });
      await page.setViewportSize({ width: 1440, height: 1000 });
    }
    const untranslated = new Set();
    for (const url of ["index.html", "user-stories.html", "requirements.html", "design.html", "implementation.html", "testing.html", "artifacts.html", "practices.html", ...data.map(item => (item.type === "artifact" ? "artifacts/" : "practices/") + item.slug + ".html")]) {
      await page.goto(origin + "/" + url);
      const issues = await page.evaluate(() => {
        const result = [];
        for (const el of document.querySelectorAll("[aria-labelledby],[aria-describedby]")) {
          for (const attr of ["aria-labelledby", "aria-describedby"]) for (const id of (el.getAttribute(attr) || "").split(/\s+/).filter(Boolean)) if (!document.getElementById(id)) result.push(id);
        }
        return result;
      });
      assert.equal(issues.length, 0, url + ": ARIA");
      await page.locator('[data-language="en"]').click();
      const source = await page.evaluate(() => {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        const result = [];
        let node;
        while ((node = walker.nextNode())) if (node.textContent.trim() && !node.parentElement.closest("script,style,[data-no-translate]")) result.push(node.textContent.trim());
        return result;
      });
      await page.locator('[data-language="es"]').click();
      const localized = await page.evaluate(() => {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        const result = [];
        let node;
        while ((node = walker.nextNode())) if (node.textContent.trim() && !node.parentElement.closest("script,style,[data-no-translate]")) result.push(node.textContent.trim());
        return result;
      });
      source.forEach((value, index) => {
        if (value === localized[index] && value.split(/\s+/).length > 3 && !value.includes("<") && !value.includes("Universidad Veracruzana")) untranslated.add(value);
      });
    }
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ resources: data.length, testedPages: data.length + 8, filters: "pass", persistence: "pass", mobile: "pass", consoleErrors: errors, untranslated: [...untranslated] }, null, 2));
    assert.equal(untranslated.size, 0, "Untranslated prose");
  } finally {
    if (browser) await browser.close();
    server.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
