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
and `survey-overview.png` keep their original colors. The survey
image is the original Figure 1 artwork, displayed at full content width and linked
to the full-size image; do not recolor it for dark mode.

The WeChat QR code is maintained in
[penguin-harness-community](https://github.com/Prism-Shadow/penguin-harness-community/blob/main/assets/wechat/rsi.jpg).
The main README displays the externally hosted image and links to its source;
no QR image is stored here.
