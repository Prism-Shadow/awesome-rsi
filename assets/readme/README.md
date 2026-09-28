# README artwork

The main README uses `<picture>` with `prefers-color-scheme: dark`, following
GitHub's theme-aware image pattern. The original SVG is the light-theme fallback;
its `-dark.svg` counterpart keeps the same text and geometry with a dark palette.

To change the logo, website entry, or either tree:

1. Edit the corresponding original SVG (without `-dark` in its name).
2. Run `node scripts/generate-readme-themes.mjs` from the repository root.
3. Run `node scripts/generate-readme.mjs` if the README template also changed.

Dark colors are defined in `scripts/generate-readme-themes.mjs`. Generated dark
files should not be edited directly. CI checks that both themes stay in sync.
The unused demo placeholder is not part of the themed set. The walkthrough video
and WeChat QR image keep their original colors.
