#!/usr/bin/env node

const { program } = require('commander');
const { buildSite } = require('./build');
const { createNewPage } = require('./new');

program
    .name('markform')
    .description('Turn any folder of Markdown files into a beautiful, searchable static site')
    .version('1.2.2')
    .argument('[input]', 'folder of Markdown files')
    .option('-o, --output <dir>', 'output directory', './output')
    .option('-w, --watch', 'watch for changes and rebuild')
    .option('-n, --new <name>', 'create a new markdown file')
    .action((input, options) => {
        if (options.new) {
            createNewPage(options.new);
        } else if (input) {
            buildSite(input, options);
        } else {
            program.help();
        }
    });

program.parse();