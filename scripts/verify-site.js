const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const errors = [];
const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root, "js", "resource-data.js"), "utf8"), context);

const { resources, resourcesBySlug } = context.window.WAPG_DATA;

for (const item of resources) {
  const folder = item.type === "artifact" ? "artifacts" : "practices";
  const detailPath = path.join(root, folder, `${item.slug}.html`);
  if (!fs.existsSync(detailPath)) errors.push(`Missing detail page: ${detailPath}`);

  const otherType = item.type === "artifact" ? "practice" : "artifact";
  if (item.related && !resourcesBySlug.has(`${otherType}:${item.related}`)) {
    errors.push(`Broken related resource: ${item.type}:${item.slug} -> ${otherType}:${item.related}`);
  }
}

const htmlFiles = [];
const collectHtml = (directory) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "tmp") continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) collectHtml(absolute);
    else if (entry.name.endsWith(".html")) htmlFiles.push(absolute);
  }
};
collectHtml(root);

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  const idSet = new Set(ids);
  if (idSet.size !== ids.length) errors.push(`Duplicate static id in ${file}`);

  for (const match of html.matchAll(/\s(?:aria-labelledby|aria-describedby)="([^"]+)"/g)) {
    for (const id of match[1].split(/\s+/)) {
      if (!idSet.has(id)) errors.push(`Broken static ARIA reference ${id} in ${file}`);
    }
  }

  for (const match of html.matchAll(/\shref="([^"]+)"/g)) {
    const href = match[1];
    if (/^(?:https?:|mailto:|#)/.test(href)) continue;
    const target = href.split(/[?#]/)[0];
    if (!target.endsWith(".html")) continue;
    const resolved = path.resolve(path.dirname(file), target);
    if (!fs.existsSync(resolved)) errors.push(`Broken internal link in ${file}: ${href}`);
  }
}

const counts = resources.reduce((result, item) => {
  result[item.type] = (result[item.type] || 0) + 1;
  result[item.phase] = (result[item.phase] || 0) + 1;
  return result;
}, {});

if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify({ htmlFiles: htmlFiles.length, resources: resources.length, counts, errors: 0 }, null, 2));
}
