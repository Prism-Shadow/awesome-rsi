export const blogPosts = [
  {
    id: "introducing-awesome-rsi",
    kind: "Introduction",
    title: "Awesome RSI: A Comprehensive Collection with Dimensioned Definitions",
    published: "2026-08-21",
    summary:
      "Recursive self-improvement is moving faster than its own vocabulary. This post introduces our own dimensioned definition; comparison views over the papers; and a curated shelf of books and courses.",
    tags: ["intro", "RSI", "definition", "benchmarks"],
    sections: [
      {
        heading: "What is recursive self-improvement?",
        blocks: [
          {
            type: "p",
            text: "The idea is old. In 1965 I.J. Good described an *intelligence explosion*: since designing machines is itself an intellectual task, a capable enough machine could design a better one, which designs a better one still — **\"the first ultraintelligent machine is the last invention that man need ever make.\"** Yudkowsky's self-rewriting \"seed AI\" and Bostrom's *Superintelligence* (2014) carried the theme forward, but for decades it stayed a thought experiment about a hypothetical future.",
          },
        ],
      },
      {
        heading: "Three things that make RSI hard to follow",
        blocks: [
          {
            type: "p",
            text: "The field is exciting precisely because it is unsettled — which also makes it hard to navigate. Three problems stand out:",
          },
          {
            type: "list",
            ordered: true,
            items: [
              "**The definition won't sit still.** Like \"world model,\" the term is used loosely — editing a prompt and retraining weights both get called \"RSI\" — so everyone means something slightly different.",
              "**It grows faster than anyone can summarize.** A July 2026 survey ([arXiv:2607.07663](https://arxiv.org/abs/2607.07663)) scanned **1,250** arXiv papers on recursive self-improvement from 2024–2026, yet there is little synthesis of how they relate or compare.",
              "**The learning materials can't keep up.** The field moves too fast for a settled course or textbook, so a newcomer has no obvious on-ramp.",
            ],
          },
        ],
      },
      {
        heading: "What this project does about it",
        blocks: [
          {
            type: "p",
            text: "Awesome RSI answers each of those three problems in turn:",
          },
          {
            type: "list",
            ordered: true,
            items: [
              "**Dimensions instead of one label.** We define RSI along a set of orthogonal dimensions, so systems are described by *where they sit* on each axis rather than by whether they earn the label.",
              "**Comparison views over the corpus.** The same collection is offered as a filterable benchmark list, sortable by date or citations, plus a citation graph — a timeline, a leaderboard, and a map that let benchmarks and methods be compared horizontally and vertically.",
              "**A curated learning shelf.** We surveyed the books, courses, and materials on RSI and collected the worthwhile ones in one place, so there is finally a single on-ramp.",
            ],
          },
        ],
      },
      {
        heading: "The definition, and how we slice it",
        blocks: [
          {
            type: "p",
            text: "Large language model agents turned it into an engineering question. Today RSI usually means something concrete and measurable: an agent that improves its **own** future performance by editing one of its **own** building blocks — parametric ones such as model parameters, or non-parametric ones such as **context**, **memory**, **skills**, and **harness/scaffold code** — using feedback drawn from its own work. The question is no longer *when the singularity arrives*, but which block changes, what signal drives the change, and whether anything measurably improved.",
          },
          {
            type: "p",
            text: "Those questions are really a set of dimensions. Rather than police who counts as \"real\" RSI, we describe each system along a few axes:",
          },
          {
            type: "list",
            ordered: false,
            items: [
              "**What evolves.** Which building block actually changes — non-parametric context, memory, skills, or harness code, versus genuinely parametric recursion where one model generation trains the next.",
              "**How it evolves.** Whether experience arrives online as a stream or curriculum, through a clean offline train/test split, or a hybrid that seeds a skill library offline and keeps evolving in use.",
              "**Where the signal comes from.** What supervises the improvement — a rule-based check, an external verifier, an LLM judge, or a self-generated reward.",
              "**How far the loop closes.** How much human involvement remains, from human-in-the-loop to a fully closed loop.",
              "**What we measure.** Final accuracy, the *gain* over a non-evolving baseline, cost, or latency — gain, not accuracy, is often the honest metric.",
            ],
          },
          {
            type: "p",
            text: "These are the same axes the benchmark list is tagged with, so you can filter the corpus by the definition itself.",
          },
        ],
      },
      {
        heading: "Reading the corpus from several angles",
        blocks: [
          {
            type: "p",
            text: "The same papers can be read in more than one way:",
          },
          {
            type: "list",
            ordered: false,
            items: [
              "**Benchmark Paper List** — the benchmark corpus with a seven-dimension filter board (origin, RSI mode, artifact, construction, metric, creation, evaluation), plus full-text search and sorting by date or citations.",
              "**Citation graph** — a verified graph of how the papers cite one another, with pan-and-zoom, to read the corpus as a map rather than a list.",
              "**Methods & Systems** — the methods side of the field: how self-improvement is actually done, kept alongside the benchmarks that measure it.",
              "**Books & Courses** — the curated learning shelf of technical books, university courses, and other materials.",
            ],
          },
        ],
      },
      {
        heading: "Contribute",
        blocks: [
          {
            type: "p",
            text: "This is a living map, and it improves with more eyes on it. If a benchmark, method, or resource is missing — or a taxonomy label looks wrong — open a pull request or an issue; new entries carry the taxonomy metadata so they drop straight into the filter views.",
          },
          {
            type: "list",
            ordered: false,
            items: [
              "Repository and contribution guide: [github.com/Prism-Shadow/awesome-rsi](https://github.com/Prism-Shadow/awesome-rsi)",
              "Background reading — the survey behind the 1,250-paper figure: [Recursive Self-Improvement in AI (arXiv:2607.07663)](https://arxiv.org/abs/2607.07663)",
            ],
          },
        ],
      },
    ],
  },
];
