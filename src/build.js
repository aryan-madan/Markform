const fs = require('fs-extra');
const path = require('path');
const { marked } = require('marked');
const { buildNav } = require('./nav');
const chokidar = require('chokidar');

async function buildSite(input, options) {
    const inputDir = path.resolve(input);
    const outputDir = path.resolve(options.output);

    if (!fs.existsSync(inputDir)) {
        console.error(`(˙◠˙ ) Input folder not found: ${inputDir}`);
        process.exit(1);
    }

    console.log(`⛏ Building site from ${inputDir} to ${outputDir}...`);
    await compile(inputDir, outputDir);
    console.log(`(ˆᗜˆ ) Site built to ${outputDir}`);

    if (options.watch) {
        console.log(`(≖_≖ ) Watching for changes...`);
        chokidar.watch(inputDir).on('change', async (filePath) => {
            console.log(`↺ Changed: ${filePath}, rebuilding...`);
            await compile(inputDir, outputDir);
            console.log(`(ˆᗜˆ ) Site rebuilt to ${outputDir}`);
        });
    }
}

async function compile(inputDir, outputDir) {
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

        const html = template
            .replace('{{content}}', htmlContent)
            .replace('{{nav}}', nav)
            .replace('{{title}}', path.basename(filePath, '.md'));

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
        const content = fs.readFileSync(filePath, 'utf-8');
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