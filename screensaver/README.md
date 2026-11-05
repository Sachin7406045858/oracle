# Tech Mahindra — Oracle Partner Award 2026 Screen Saver

1920 × 1080 (16:9, Full HD) desktop screen saver / wallpaper.

| File | Purpose |
|---|---|
| `TechMahindra_Oracle_Partner_Award_2026_1920x1080.png` | Current render (shows marked logo slots until official logos are added) |
| `TechMahindra_Oracle_Partner_Award_2026_1920x1080_logo-ready.png` | Same design with a clean white logo plate, for placing logos in Photoshop/Figma |
| `screensaver.html` | Source design (HTML/CSS/Canvas) |
| `render.js` | Exports the PNG at exactly 1920 × 1080 |

## Adding the official logos

The official logo files were not in the repository, and logos must not be recreated, so the design has two logo slots on a white plate (top left) to keep the original brand colours.

1. Copy the official files into `screensaver/assets/logos/`, named:
   - `techmahindra.svg` (or `.png` / `.webp` / `.jpg`)
   - `oracle-partner.svg` (or `.png` / `.webp` / `.jpg`)
2. Re-render:

```bash
node screensaver/render.js
```

The logos are shown at a fixed 52 px height with width `auto`, so they keep their proportions and are never stretched or recoloured. If you use reversed (white) logo versions, add `--no-plate` to drop the white plate.

## Design notes
- Background: Blueprint Navy `#0A0838` with soft blue depth and a faint Impact Red `#5F0229` glow in the lower-left corner.
- Highlights: Mahindra Red `#E31837` (accent bars, dashes, light trail, one cloud node).
- Typography: Inter Display, white. Main title 118 px ExtraBold; award categories 38 px Bold.
- Gold (`#D4B26A` range) is used only for the two identical laurel emblems and the year.
- The Global and APAC award cards share one style and size, so they carry equal weight.
