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
        blocks: [
          {
            type: "p",
            text: "The idea is old. In 1965 I.J. Good described an **intelligence explosion**: since designing machines is itself an intellectual task, a capable enough machine could design a better one, which designs a better one still — **\"the first ultraintelligent machine is the last invention that man need ever make.\"** Yudkowsky's self-rewriting \"seed AI\" and Bostrom's *Superintelligence* (2014) carried the theme forward, but for decades it stayed a thought experiment about a hypothetical future.",
          },
          {
            type: "p",
            text: "It is no longer hypothetical. The capabilities of large language model agents have made recursive self-improvement (RSI) appear reachable, and the literature is expanding accordingly. Three difficulties follow. **First**, the term is unstable: much as with \"world model,\" it is applied loosely, so that editing a prompt and retraining model weights are both called RSI and few authors mean quite the same thing. **Second**, the field is growing faster than it is being organized — a July 2026 survey ([arXiv:2607.07663](https://arxiv.org/abs/2607.07663)) catalogues **1,250** arXiv papers from 2024–2026 — yet little of this work has been synthesized into a comparable whole. **Third**, the pace has outrun its pedagogy: there is no settled course or textbook, and newcomers lack an obvious entry point.",
          },
          {
            type: "p",
            text: "Awesome RSI addresses each in turn. **First**, rather than adjudicate what qualifies as \"real\" RSI, we define the notion along a set of orthogonal dimensions and locate each system by its position on them. **Second**, we present the same corpus through complementary views — a filterable, sortable benchmark list and a verified citation graph — so that benchmarks and methods may be compared as a timeline, a leaderboard, or a map. **Third**, we assemble the books and courses worth reading into a single curated shelf. The remainder of this post treats each in order.",
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
            text: "Those questions are, in effect, a set of dimensions. Rather than adjudicate membership, we characterize each system along a few axes:",
          },
          {
            type: "list",
            ordered: false,
            items: [
              "**What evolves.** Which building block changes — non-parametric context, memory, skills, or harness code, as against genuinely parametric recursion in which one model generation trains the next.",
              "**How it evolves.** Whether experience arrives online as a stream or curriculum, through a fixed offline train/test split, or a hybrid that seeds a skill library offline and continues to adapt in use.",
              "**Where the signal originates.** What supervises the improvement — a rule-based check, an external verifier, an LLM judge, or a self-generated reward.",
              "**How far the loop closes.** The degree of remaining human involvement, from human-in-the-loop to a fully closed loop.",
              "**What is measured.** Final accuracy, the *gain* over a non-evolving baseline, cost, or latency — of which gain, rather than final accuracy, is often the more informative.",
            ],
          },
          {
            type: "p",
            text: "These are the axes the benchmark list is tagged with, so the corpus can be filtered by the definition itself.",
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
              "**Benchmark Paper List** — the benchmark corpus with a seven-dimension filter board (origin, RSI mode, artifact, construction, metric, creation, evaluation), full-text search, and sorting by date or citations.",
              "**Citation graph** — a verified graph of how the papers cite one another, with pan-and-zoom, presenting the corpus as a map rather than a list.",
              "**Methods & Systems** — the methods side of the field: how self-improvement is carried out, kept alongside the benchmarks that measure it.",
            ],
          },
        ],
      },
      {
        heading: "Books & courses",
        blocks: [
          {
            type: "p",
            text: "As no textbook yet exists, we have gathered the material worth reading into a single shelf: technical books on agent memory and self-evolution, university courses such as Stanford's CS329A and Harvard's CS2881R, and surveys and harness write-ups that survey the field. It is collected under the **Books & Courses** tab and is updated as strong material appears.",
          },
        ],
      },
      {
        heading: "Contribute",
        blocks: [
          {
            type: "p",
            text: "Awesome RSI is intended as a living map, and it improves with additional review. If a paper, method, or resource is missing — or a taxonomy label appears incorrect — please open a pull request or an issue at [github.com/Prism-Shadow/awesome-rsi](https://github.com/Prism-Shadow/awesome-rsi). New entries carry the taxonomy metadata and integrate directly into the filter views.",
          },
        ],
      },
    ],
  },
];
