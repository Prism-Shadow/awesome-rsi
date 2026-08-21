# Awesome RSI (Recursive Self-Improvement) [![Awesome](https://awesome.re/badge.svg)](https://awesome.re) [![Website](https://img.shields.io/badge/%F0%9F%8C%90%20Website-live-2ea44f)](https://prism-shadow.github.io/awesome-rsi/) [![Blog](https://img.shields.io/badge/%F0%9F%93%9D%20Blog-read%20the%20intro-8A2BE2)](https://prism-shadow.github.io/awesome-rsi/#blog)

> A curated list of **benchmarks** and **methods** for **Recursive Self-Improvement (RSI)** — AI agents that improve *themselves*.

We track the research on agents that get better by editing their own building blocks — whether that's their **context**, **memory**, **skills**, **harness code**, or **model parameters**. The goal is a living map of *how* self-improvement is done and *how* we measure whether it worked.

🌐 **Live site:** [prism-shadow.github.io/awesome-rsi](https://prism-shadow.github.io/awesome-rsi/) — browse, filter, and compare the full collection.

📝 **New here?** Start with the [introductory blog post](https://prism-shadow.github.io/awesome-rsi/#blog) — it explains what RSI is, why the field is hard to navigate, and how this collection defines and compares the work.

## What this repo is for

1. **A paper list** — the curated core: RSI **methods** (how self-improvement is done) and **benchmarks** (how it's measured), each with a one-line "what it is and why it matters."
2. **A website** — a [GitHub Pages site](https://prism-shadow.github.io/awesome-rsi/) that hosts the corpus as several views: a benchmark list with a multi-dimensional filter board, sortable by **date** or **citations**; a **citation graph**; a **Methods & Systems** list; and a **Books & Courses** shelf — so the same work can be read as a timeline, a leaderboard, or a map.
3. **A blog** — longer-form writing on the field, starting with the introduction to this project.

## Methods & Systems

| System | Method | RSI mode | Artifact | Description |
|---|---|---|---|---|
| [Proteus](https://github.com/proteus-evolve/Proteus) ([v0.2.0](https://github.com/proteus-evolve/Proteus/releases/tag/v0.2.0)) | Agent system / evolution loop | Repeated / iterative | Harness code and declared surfaces | Harness-agnostic framework for context-fresh self-evolution episodes, validation-gated self-edits, snapshots, and measurement. |

## Contributing

Contributions are welcome. If a benchmark, method, or learning resource is missing — or a taxonomy label looks wrong — please open a pull request or an issue. New entries should carry the taxonomy metadata used by the site's filter views (benchmark origin, RSI mode, artifact, construction criteria, metric, creation, and evaluation) so they slot directly into the comparison views.

## Citation

If this collection is useful in your work, please cite it:

```bibtex
@misc{awesomersi2026,
  title        = {Awesome RSI: A Curated Collection of Recursive Self-Improvement Benchmarks and Methods},
  author       = {Prism-Shadow},
  year         = {2026},
  howpublished = {\url{https://github.com/Prism-Shadow/awesome-rsi}},
}
```
