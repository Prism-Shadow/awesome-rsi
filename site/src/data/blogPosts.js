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
            text: "The idea is old. In 1965 I.J. Good described an **intelligence explosion**: since designing machines is itself an intellectual task, a capable enough machine could design a better one, which designs a better one still — **\"the first ultraintelligent machine is the last invention that man need ever make.\"** Yudkowsky's self-rewriting \"seed AI\" and Bostrom's **Superintelligence** (2014) carried the theme forward, but for decades it stayed a thought experiment about a hypothetical future.",
          },
          {
            type: "p",
            text: "However, it is no longer hypothetical now. The capabilities of large language models have made recursive self-improvement (RSI) appear reachable, and the literature is expanding accordingly. Three difficulties follow. First, the term is unstable: much as with \"world model,\" it is applied loosely and few authors mean quite the same thing. Second, the field is growing faster than it is being organized — a July 2026 survey ([arXiv:2607.07663](https://arxiv.org/abs/2607.07663)) catalogues **1,250** arXiv papers from 2024–2026 — yet little of it has been brought together so the papers can be compared. Third, the pace has outrun its pedagogy: there is no settled course or textbook, and newcomers lack an obvious entry point.",
          },
          {
            type: "p",
            text: "Awesome RSI addresses each in turn. First, rather than adjudicate what qualifies as \"real\" RSI, we define the notion along a set of orthogonal dimensions and locate each system by its position on them. Second, we present the same corpus through complementary views — a filterable, sortable benchmark list and a verified citation graph — so that benchmarks and methods may be compared as a timeline, a leaderboard, or a map. Third, we assemble the books and courses worth reading into a single curated shelf. The remainder of this post treats each in order.",
          },
        ],
      },
      {
        heading: "The definition and its dimensions",
        blocks: [
          {
            type: "p",
            text: "We define RSI as a process where an agent improves its **own** future performance by editing one of its **own** building blocks — parametric ones such as model parameters, or non-parametric ones such as **context**, **memory**, **skills**, and **harness/scaffold code** — using feedback drawn from its own work.",
          },
          {
            type: "p",
            text: "This definition is broad. To make it precise — and to compare different kinds of RSI — we sharpen it along the three dimensions that are most often misread; further dimensions are documented on the site.",
          },
          {
            type: "p",
            text: "**1. Which building block is edited.** The edited block may be *parametric* (the model's own weights) or *non-parametric* (anything outside the weights: context, memory, skills, or harness code). The distinction is smaller than it looks. An agent's output is drawn from P(y | θ, C), where y is the output, θ the model parameters, and C the context given to the model. Parametric edits change θ; every non-parametric edit ultimately changes C, or what enters it. Both act on the same distribution.",
          },
          {
            type: "p",
            text: "This dimension is easy to misattribute. In PostTrainBench ([arXiv:2603.08640](https://arxiv.org/abs/2603.08640)) a teacher agent trains a student model and raises its accuracy over successive rounds. It is tempting to call the student the self-improving system, but the system performing RSI is the teacher agent: when a round underperforms — say, the loss is high — the teacher adjusts the learning rate, the training-data distribution, or the model architecture, and the resulting experience accumulates in its context and, as the run lengthens, is written out to memory or skills. The setup is essentially meta-learning — the teacher learns how to make the student learn — so training the student is merely the task on which the teacher improves.",
          },
          {
            type: "p",
            text: "**2. How the improvement is structured.** Three arrangements recur. *Offline RSI* resembles supervised learning: the agent attempts labeled training tasks, receives a supervision signal, consolidates the experience into skills or memory (or trains it back into the base model), and is then evaluated on a held-out test set — for example, GDPevo ([arXiv:2608.03764](https://arxiv.org/abs/2608.03764)). *Online RSI* resembles reinforcement learning, with training and test on the same task: the agent works a single task continuously, accumulating knowledge in its environment to maximize expected reward over a long horizon, balancing exploration and exploitation — for example, EdgeBench ([arXiv:2607.05155](https://arxiv.org/abs/2607.05155)) and the PostTrainBench setup above. *Mixed RSI* combines the two, continuing to consolidate new experience during the test phase of an otherwise offline protocol.",
          },
          {
            type: "p",
            text: "**3. The remaining axes.** Others distinguish systems further. The evaluation *metric* need not be accuracy alone; cost and time matter too, since useful self-improvement should be faster and cheaper as well as more accurate. The *source of the supervision signal* is a separate axis — a score or a reference answer, drawn from the environment or from a labeled training set. And for benchmarks specifically, two more: whether the benchmark is built from scratch or assembled from existing ones, and whether it is authored by hand or generated automatically by an agent.",
          },
          {
            type: "p",
            text: "These are among the axes the benchmark list is tagged with, so the corpus can be filtered by the definition itself.",
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
