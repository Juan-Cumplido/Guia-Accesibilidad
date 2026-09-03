const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const root = path.resolve(__dirname, '..');
const server = http.createServer((req,res) => {
  const target = path.resolve(root, '.' + new URL(req.url,'http://localhost').pathname);
  if (!target.startsWith(root + path.sep)) return res.writeHead(403).end();
  fs.readFile(target,(err,body) => {
    if (err) return res.writeHead(404).end();
    res.setHeader('Content-Type', ({'.html':'text/html','.js':'text/javascript','.css':'text/css'}[path.extname(target)] || 'application/octet-stream') + '; charset=utf-8');
    res.end(body);
  });
});
(async () => {
  await new Promise(r => server.listen(0,'127.0.0.1',r));
  let browser;
  try {
    browser = await chromium.launch({channel:'msedge',headless:true});
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror',e => errors.push(e.message));
    const origin = 'http://127.0.0.1:' + server.address().port;
    for (const phase of ['requirements','design','implementation','testing']) {
      await page.goto(`${origin}/${phase}.html`);
      assert.match(await page.locator('.resource-card').first().getAttribute('class'), /resource-card--experiment/);
      await page.locator('.resource-card').first().locator('a').click();
      assert.equal(await page.locator('.experiment-group').count(),2);
      let baseline;
      for (const group of ['A','B']) {
        await page.goto(`${origin}/experiment.html?phase=${phase}&group=${group}`);
        const sample = await page.evaluate(() => ({task:document.querySelector('.experiment-task').textContent, fields:[...document.querySelectorAll('textarea')].map(x => x.value)}));
        if (group === 'A') baseline = sample; else assert.deepEqual(sample,baseline);
        assert.equal(await page.locator('.experiment-help').count(),group === 'B' ? 1 : 0);
        assert.equal(await page.locator('.main-nav').isVisible(),false);
        await page.locator('textarea').first().fill('Respuesta de prueba');
        await page.locator('[data-language="en"]').click();
        assert.equal(await page.locator('textarea').first().inputValue(),'Respuesta de prueba');
        await page.locator('[data-language="es"]').click();
        const downloaded = page.waitForEvent('download');
        await page.locator('#download-answer').click();
        const download = await downloaded;
        const result = fs.readFileSync(await download.path(),'utf8');
        assert(result.includes('Respuesta de prueba') && result.includes(`Grupo: ${group}`));
        assert(!result.includes('Ayuda paso a paso'));
        await page.setViewportSize({width:320,height:740});
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),'Mobile overflow');
        const broken = await page.evaluate(() => [...document.querySelectorAll('[aria-labelledby],[aria-describedby]')].flatMap(el => ['aria-labelledby','aria-describedby'].flatMap(a => (el.getAttribute(a)||'').split(/\s+/).filter(id => id && !document.getElementById(id)))));
        assert.deepEqual(broken,[]);
        await page.setViewportSize({width:1280,height:900});
      }
    }
    await page.goto(origin + '/artifacts.html');
    const top = await page.locator('.resource-card').evaluateAll(items => items.slice(0,4).every(el => el.classList.contains('resource-card--experiment')));
    assert(top);
    await page.goto(origin + '/experiment.html?phase=invalid&group=B');
    assert.equal(await page.locator('main li').count(),4);
    await page.goto(origin + '/experiment.html?phase=design&group=B');
    await page.screenshot({path:path.join(require('node:os').tmpdir(),'wapg-experiment.png'),fullPage:true});
    assert.deepEqual(errors,[]);
    console.log('PASS: 4 featured artifacts, 8 group sessions, equivalent templates, B-only help, downloads, languages, mobile and ARIA.');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch(e => { console.error(e); process.exitCode=1; });
