export const blogPosts = [
  {
    id: "introducing-awesome-rsi",
    kind: "Introduction",
    title: "Awesome RSI: A Map for a Field That Won't Hold Still",
    published: "2026-08-21",
    summary:
      "Recursive self-improvement is moving faster than its own vocabulary. This post introduces the field, names the three things that make it hard to follow, and explains how this project responds — a precise, dimensioned definition; comparison views over the corpus; and a curated shelf of books and courses.",
    tags: ["intro", "RSI", "definition", "benchmarks"],
    sections: [
      {
        heading: "What is recursive self-improvement?",
        blocks: [
          {
            type: "p",
            text: "The idea is old. In 1965 I.J. Good, who had worked alongside Turing at Bletchley Park, described an *intelligence explosion*: since designing machines is itself an intellectual task, a sufficiently capable machine could design an even better machine, which could design a better one still. In his words, **\"the first ultraintelligent machine is the last invention that man need ever make.\"** The theme was carried forward by Yudkowsky's notion of a self-rewriting \"seed AI\" and by Bostrom's *Superintelligence* (2014) — but for decades it stayed a thought experiment about a hypothetical future.",
          },
          {
            type: "p",
            text: "Large language model agents have turned it into an engineering question. Today, recursive self-improvement (RSI) most often means something concrete and measurable: an agent that improves its own future performance by editing one of its own building blocks — its **context**, **memory**, **skills**, **harness/scaffold code**, or **model parameters** — using feedback drawn from its own work. The singularity framing has given way to a practical one: which building block changes, what signal drives the change, and can we actually measure that anything got better.",
          },
        ],
      },
      {
        heading: "Three things that make RSI hard to follow",
        blocks: [
          {
            type: "p",
            text: "The field is exciting precisely because it is unsettled. But that also makes it hard to navigate. Three problems stand out:",
          },
          {
            type: "list",
            ordered: true,
            items: [
              "**The definition won't sit still.** Much like \"world model,\" the term is used loosely and inconsistently. \"RSI,\" \"self-evolving,\" \"self-improving,\" and \"lifelong\" get applied to systems that differ on almost every axis — editing a prompt versus retraining weights, a single self-refinement pass versus genuine multi-generation recursion, a human in the loop versus a fully closed one. You say one thing, I say another, and the same word covers all of it.",
              "**It's growing faster than anyone can summarize.** A July 2026 survey ([arXiv:2607.07663](https://arxiv.org/abs/2607.07663)) scanned **1,250** arXiv papers on recursive self-improvement from 2024–2026. New benchmarks and methods appear month over month, but there is little synthesis of how they relate, where they overlap, and how they should be compared side by side.",
              "**The learning materials can't keep up.** Because the field moves so quickly, there is no settled course or textbook to follow. A newcomer who wants to get oriented has no obvious on-ramp, and good material is scattered across preprints, lecture playlists, and blog posts.",
            ],
          },
        ],
      },
      {
        heading: "What this project does about it",
        blocks: [
          {
            type: "p",
            text: "Awesome RSI responds to each of those three problems directly:",
          },
          {
            type: "list",
            ordered: true,
            items: [
              "**A precise, dimensioned definition.** We give a concrete working definition and — more usefully — break it into orthogonal dimensions, so \"RSI\" stops being one word doing too much work. Two systems can then be described by *where they sit* on each dimension rather than by whether they earn the label.",
              "**Comparison views over the corpus.** We host the same collection as several views — a benchmark paper list backed by a multi-dimensional filter board, sortable by date or by citations, plus a verified citation graph — so the corpus can be read as a timeline, a leaderboard, or a map, and papers can be compared across dimensions horizontally and vertically.",
              "**A curated learning shelf.** We surveyed the books, courses, and learning materials on RSI from across the web and collected the worthwhile ones in one place, so there is finally a single on-ramp to point newcomers to.",
            ],
          },
        ],
      },
      {
        heading: "The definition, and how we slice it",
        blocks: [
          {
            type: "p",
            text: "Here is our current working definition — a draft, meant to be argued with and refined:",
          },
          {
            type: "p",
            text: "*A recursive self-improvement system improves its own future performance by modifying one of its own building blocks — context, memory, skills, harness/scaffold code, or model parameters — using a feedback signal derived from its own activity, with the improvement carried forward to later tasks.*",
          },
          {
            type: "p",
            text: "A single label can't capture that. So rather than police who counts as \"real\" RSI, we describe each system along a set of dimensions:",
          },
          {
            type: "list",
            ordered: false,
            items: [
              "**What evolves (the artifact).** Which building block actually changes? This ranges from non-parametric artifacts — context, memory, skills, harness code — to genuinely parametric recursion where one model generation trains the next. \"Improving the context\" and \"retraining the weights\" are both self-improvement, but they are not the same thing.",
              "**How it evolves (the mode).** Does experience arrive online as a stream or curriculum, is there a clean offline train/test split, or is it a hybrid that seeds a skill library offline and keeps evolving in use?",
              "**Where the signal comes from.** What supervises the improvement — a rule-based check or execution result, an external verifier, an LLM acting as judge, or a self-generated reward? Every improvement loop is an implicit claim that some signal can stand in for human judgment.",
              "**How far the loop closes.** How much human involvement remains, from human-in-the-loop at one end to a fully closed loop at the other.",
              "**What we measure.** Final accuracy, the *gain* over a matched non-evolving baseline, the cost (tokens, compute, money), or the latency. A system can post high final accuracy with almost no RSI gain if it simply started strong — which is why gain, not accuracy, is often the honest metric.",
            ],
          },
          {
            type: "p",
            text: "These are the same axes the benchmark list is tagged with, so the definition isn't just prose — you can filter the corpus by it.",
          },
        ],
      },
      {
        heading: "Reading the corpus from several angles",
        blocks: [
          {
            type: "p",
            text: "The site is built so the same papers can be examined in more than one way:",
          },
          {
            type: "list",
            ordered: false,
            items: [
              "**Benchmark Paper List** — the curated benchmark corpus, with a filter board spanning seven dimensions (benchmark origin, RSI mode, RSI artifact, construction criteria, metric, benchmark creation, and evaluation). Values within a dimension combine with OR and dimensions combine with AND, so you can isolate, say, streaming online benchmarks that report gain and are scored by rule-based checks. Search across titles and abstracts, and sort by recency or by citation count.",
              "**Citation graph** — a verified graph of how these papers cite one another, with pan-and-zoom on desktop and mobile, to read the corpus as a map rather than a list.",
              "**Methods & Systems** — the methods side of the field: how self-improvement is actually done, kept alongside the benchmarks that measure it.",
              "**Books & Courses** — the curated learning shelf: technical books, university courses, and other learning materials for getting oriented.",
            ],
          },
        ],
      },
      {
        heading: "Contribute",
        blocks: [
          {
            type: "p",
            text: "This is meant to be a living map, and it gets better with more eyes on it. If a benchmark, method, or learning resource is missing — or a taxonomy label looks wrong — please open a pull request or an issue on the repository. New entries come with the taxonomy metadata described above so they slot straight into the filter views.",
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
  {
    id: "release-notes-2026-08",
    kind: "Release notes",
    title: "Awesome RSI — The First Release",
    published: "2026-08-19",
    summary: "A benchmark-focused research map for tracking how agents improve through memory, skills, feedback, and long-horizon interaction.",
    tags: ["release", "benchmark", "citation graph"],
    highlights: [
      "Expanded the collection to 24 RSI benchmark papers with reviewed taxonomy metadata.",
      "Added multi-dimensional filtering across benchmark origin, RSI mode, evolving artifacts, construction criteria, metrics, creation, and evaluation.",
      "Introduced a verified citation graph with desktop and mobile pan-and-zoom interactions.",
      "Improved responsive navigation, dark mode, paper search, sorting, and citation inspection.",
    ],
  },
];
