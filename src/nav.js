const path = require('path');

function buildNav(mdFiles, inputDir) {
    const links = mdFiles.map((filePath) => {
        const relative = path.relative(inputDir, filePath);
        const href = relative.replace(/\.md$/, '.html');
        const label = path.basename(filePath, '.md').replace(/-/g, ' ');
        return `<li><a href="${href}">${label}</a></li>`;
    });

    return `<ul>${links.join('\n')}</ul>`;
}

module.exports = { buildNav };