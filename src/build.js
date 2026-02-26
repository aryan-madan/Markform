const fs = require('fs-extra');
const path = require('path');
const { marked } = require('marked');
const { buildNav } = require('./nav');
const chokidar = require('chokidar');
const express = require('express');
const { buildIndexPage } = require('./index-page');

async function buildSite(input, options) {
  const inputDir = path.resolve(input);
  const outputDir = path.resolve(options.output);

  if (!fs.existsSync(inputDir)) {
    console.error(`(˙◠˙ ) Input folder not found: ${inputDir}`);
    process.exit(1);
  }

  console.log(`⛏ Building site from ${inputDir} to ${outputDir}...`);
  await compile(inputDir, outputDir, options.watch || false);
  console.log(`(ˆᗜˆ ) Site built to ${outputDir}`);

  if (options.watch) {
    let shouldReload = false;

    const app = express();
    app.use(express.static(outputDir));
    app.get('/__reload', (req, res) => {
      res.json({ reload: shouldReload });
      shouldReload = false;
    });

    app.listen(3000, () => {
      const mdFiles = getMdFiles(inputDir);
      const firstHref = path.relative(inputDir, mdFiles[0]).replace(/\.md$/, '.html');
      console.log(`(°ㅁ°) Serving at http://localhost:3000/index.html`);
    });

    chokidar.watch(inputDir).on('change', async (filePath) => {
      console.log(`↺ Changed: ${filePath}, rebuilding...`);
      await compile(inputDir, outputDir, true);
      shouldReload = true;
      console.log(`(ˆᗜˆ ) Site rebuilt to ${outputDir}`);
    });

    console.log(`(≖_≖ ) Watching for changes...`);
  }
}

async function compile(inputDir, outputDir, watch = false) {
  await fs.emptyDir(outputDir);

  const mdFiles = getMdFiles(inputDir);
  const nav = buildNav(mdFiles, inputDir);
  const template = fs.readFileSync(
    path.join(__dirname, '../themes/default.html'), 'utf-8'
  );

  await buildSearchIndex(mdFiles, inputDir, outputDir);

  for (const filePath of mdFiles) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const htmlContent = marked(content);
    const relativePath = path.relative(inputDir, filePath);
    const outputPath = path.join(outputDir, relativePath.replace(/\.md$/, '.html'));

    let html = template
      .replace('{{content}}', htmlContent)
      .replace('{{nav}}', nav)
      .replace('{{title}}', path.basename(filePath, '.md'));

    if (watch) {
      html = html.replace('</body>', `
  <script>
    setInterval(() => {
      fetch('/__reload')
        .then(r => r.json())
        .then(data => { if (data.reload) location.reload(); });
    }, 1000);
  </script>
</body>`);
    }

    const indexHtml = buildIndexPage(mdFiles, inputDir, template);
    await fs.writeFile(path.join(outputDir, 'index.html'), indexHtml);

    await fs.ensureDir(path.dirname(outputPath));
    await fs.writeFile(outputPath, html);
  }
}

function getMdFiles(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(getMdFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      results.push(fullPath);
    }
  }
  return results;
}

async function buildSearchIndex(mdFiles, inputDir, outputDir) {
  const index = mdFiles.map((filePath) => {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const content = raw
      .replace(/#{1,6}\s/g, '')        // headings
      .replace(/\*\*|__|\*|_/g, '')    // bold/italic
      .replace(/`{1,3}[^`]*`{1,3}/g, '') // code
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links
      .replace(/^\s*[-*+]\s/gm, '')    // list items
      .replace(/\n+/g, ' ')            // newlines
      .trim();
    const relativePath = path.relative(inputDir, filePath);
    const href = relativePath.replace(/\.md$/, '.html');
    const title = path.basename(filePath, '.md').replace(/-/g, ' ');
    return { title, href, content };
  });

  await fs.writeFile(
    path.join(outputDir, 'search-index.json'),
    JSON.stringify(index, null, 2)
  );
}

module.exports = { buildSite };