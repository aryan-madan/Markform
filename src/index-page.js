const path = require('path');

function buildIndexPage(mdFiles, inputDir, template) {
  const cards = mdFiles.map((filePath) => {
    const relativePath = path.relative(inputDir, filePath);
    const href = relativePath.replace(/\.md$/, '.html');
    const title = path.basename(filePath, '.md').replace(/-/g, ' ');
    const folder = path.dirname(relativePath) === '.' ? 'root' : path.dirname(relativePath);

    return `
      <a href="/${href}" class="card">
        <span class="card-folder">${folder}</span>
        <span class="card-title">${title}</span>
      </a>`;
  }).join('\n');

  return template
    .replace('{{content}}', `
      <h1>All Pages</h1>
      <div class="card-grid">${cards}</div>
    `)
    .replace('{{nav}}', '')
    .replace('{{title}}', 'Home');
}

module.exports = { buildIndexPage };