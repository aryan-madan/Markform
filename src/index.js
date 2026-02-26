const { program } = require('commander');
const { buildSite } = require('./build');

program
    .name('markform')
    .description('Turn any folder of Markdown files into a beautiful, searchable static site.')
    .version('1.0.0')
    .argument('<input>', 'folder of Markdown files')
    .option('-o, --output <dir>', 'output directory', './output')
    .action((input, options) => {
        buildSite(input, options);
    });

program.parse();