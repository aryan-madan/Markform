const fs = require('fs-extra');
const path = require('path');

function createNewPage(name) {
    const filename = name.endsWith('.md') ? name : `${name}.md`;
    const filepath = path.resolve(filename);

    if (fs.existsSync(filepath)) {
        console.error(`(˙◠˙ ) File already exists: ${filepath}`);
        process.exit(1);
    }

    const title = name
        .replace(/-/g, ' ')
        .replace(/\.md$/, '')
        .replace(/\b\w/g, c => c.toUpperCase());

    const date = new Date().toISOString().split('T')[0];

    const content = `---
title: ${title}
date: ${date}
description: 
---

# ${title}

Write something here...
`;

    fs.writeFileSync(filepath, content);
    console.log(`(ˆᗜˆ ) Created ${filepath}`);
}

module.exports = { createNewPage };