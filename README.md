![Markdown Banner](https://github.com/aryan-madan/Markform/blob/main/images/Markform%20%7C%20Banner.png?raw=true)

Turn any folder of Markdown files into a beautiful, searchable static site — in one command.
```bash
markform ./my-notes -o ./output
```

I saw on reddit that people had folders of markdown files that needed to be sorted, and no good way to share them. Most static site generators are either too complex or too opinionated. So I built this :D

---

## (ˆᗜˆ ) Usage

**Build your site:**
```bash
markform ./my-notes -o ./output
```

**Watch mode** — auto-rebuilds and live-reloads the browser on file changes:
```bash
markform ./my-notes -o ./output --watch
```

---


## (≖_≖ ) Options

| Flag | Default | Description |
|------|---------|-------------|
| `-o, --output <dir>` | `./output` | Where to write the site |
| `-w, --watch` | off | Watch for changes and live reload |
| `--theme <name>` | `default` | Theme to use |

---

## ↺ Contributing

PRs and issues are very welcome. If you add a theme, fix a bug, or build something cool with markform, I'd love to hear about it.

---

## License

GPL-3.0