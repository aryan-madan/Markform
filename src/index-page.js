const path = require('path');
const matter = require('gray-matter');

function buildIndexPage(mdFiles, inputDir, template, searchIndexJson) {
  const cards = mdFiles.map((filePath) => {
    const relativePath = path.relative(inputDir, filePath);
    const href = relativePath.replace(/\.md$/, '.html');
    const raw = require('fs-extra').readFileSync(filePath, 'utf-8');
    const { data: frontmatter } = matter(raw);
    const title = frontmatter.title || path.basename(filePath, '.md').replace(/-/g, ' ');
    const folder = path.dirname(relativePath) === '.' ? 'root' : path.dirname(relativePath);

    return `
      <a href="${href}" class="card">
        <span class="card-folder">${folder}</span>
        <span class="card-title">${title}</span>
      </a>`;
  }).join('\n');

  const content = `
    <div class="index-header">
      <h1>markform</h1>
      <p>${mdFiles.length} page${mdFiles.length !== 1 ? 's' : ''}</p>
    </div>
    <div class="card-grid">${cards}</div>
  `;

  return template
    .replace('{{search_index}}', () => searchIndexJson)
    .replace('{{content}}', () => content)
    .replace('{{nav}}', () => '')
    .replace('{{title}}', () => 'Home')
    .replace('<body>', '<body data-page="index">');
}

module.exports = { buildIndexPage };