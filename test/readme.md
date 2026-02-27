![Markdown Banner](images/Markform%20|%20Banner.png)

Turn any folder of Markdown files into a beautiful, searchable static site — in one command.
```bash
markform ./my-notes -o ./output
```

I saw on reddit that people had folders of markdown files that needed to be sorted, and no good way to share them. Most static site generators are either too complex or too opinionated. So I built this :D

---

## ⛏ Installation
```bash
npm install -g markform-cli
```

---

## (ˆᗜˆ ) Usage

**Build your site:**
```bash
markform ./my-notes -o ./output
```

If it doesn't work (mainly on Windows), use:
```bash
npx markform-cli ./my-notes -o ./output
```

**Watch mode** — auto-rebuilds and live-reloads the browser on file changes:
```bash
markform ./my-notes -o ./output --watch
```

**Create a new page:**
```bash
markform --new my-page
```

This scaffolds a new Markdown file with frontmatter ready to fill in:
```markdown
---
title: My Page
date: 2026-02-27
description: 
---

# My Page

Write something here...
```

---

## (≖_≖ ) Options

| Flag | Default | Description |
|------|---------|-------------|
| `-o, --output <dir>` | `./output` | Where to write the site |
| `-w, --watch` | off | Watch for changes and live reload |
| `-n, --new <name>` | — | Scaffold a new Markdown file |

---

## ↺ Contributing

PRs and issues are very welcome. If you add a theme, fix a bug, or build something cool with markform, I'd love to hear about it.

---

## License

GPL-3.0