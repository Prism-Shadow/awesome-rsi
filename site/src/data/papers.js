// Paper metadata fetched from the arXiv API; citation counts from Semantic Scholar (2026-08-13).
export const papers = [
  {
    "id": "2608.09096",
    "nickname": "Evo-Bench",
    "title": "Evo-Bench: Can Language Models Improve Agent Harness?",
    "authors": [
      "Lisheng Huang",
      "Chen Yang",
      "Hao Zhou",
      "Huatong Song",
      "Zongchao Chen",
      "Ran Le",
      "Yang Song",
      "Wayne Xin Zhao",
      "Tao Zhang"
    ],
    "published": "2026-08-10",
    "year": 2026,
    "tags": [
      "Harness Optimization",
      "Self-Evolution"
    ],
    "citations": 0,
    "abstract": "Large Language Models (LLMs) have driven rapid progress in autonomous agents, yet standard evaluations remain confined to static task solving. An emerging frontier is harness evolution---the agent's capacity to autonomously optimize its own operating harness. However, systematically benchmarking this capability remains challenging, as existing evaluations fail to isolate harness improvements from base model strength, prevent task-specific overfitting, or capture long-horizon iterative research. To address these challenges, we introduce Evo-Bench, the first benchmark designed to evaluate models' intrinsic harness-evolving capabilities across Search, Office, and General agent domains. To rigorously isolate this capability, Evo-Bench employs a novel harness-guided construction framework: it leverages auxiliary-task evolution to identify tasks genuinely sensitive to framework improvements, followed by sensitivity-aware stratified splitting to ensure robust cross-suite generalization. Extensive evaluations across nine frontier and open-weight models reveal that top models achieve massive absolute gains reaching 16.6 points, closely approaching state-of-the-art human-engineered baselines. Crucially, while autonomous evolution outpeforms artificial harness in General tasks and excels in Search tasks, it struggles in Office tasks that demand highly specific processing workflows. Furthermore, our analysis exposes critical temporal anomalies like early saturation, while demonstrating that the synthesized harnesses act as highly transferable reasoning structures, consistently boosting diverse policy models.",
    "arxiv": "https://arxiv.org/abs/2608.09096",
    "pdf": "https://arxiv.org/pdf/2608.09096"
  },
  {
    "id": "2608.06144",
    "nickname": "FinEvo-Bench",
    "title": "FinEvo-Bench: A Longitudinal Benchmark for Self-Evolving Agents in Professional Financial Workflows",
    "authors": [
      "Bo Deng",
      "Kang Zhou",
      "Lifan Guo",
      "Chongyang Tao",
      "Xuanren Chen",
      "Chenggang Xie",
      "Renzhao Liang",
      "Feng Chen",
      "Chi Zhang"
    ],
    "published": "2026-08-06",
    "year": 2026,
    "tags": [
      "Self-Evolution",
      "Finance & Business"
    ],
    "citations": 0,
    "abstract": "Most agent benchmarks evaluate tasks independently and cannot measure whether experience from one task helps with later tasks. Existing self-evolution benchmarks do not jointly cover professional workflows, open-ended deliverables, and multi-aspect evaluation. We introduce FinEvo-Bench, a longitudinal benchmark with 120 real-case-grounded tasks, 20 business scenes across six financial domains. Institution-provided professional procedures define the required operations and constraints. Eligible institution-provided and publicly documented cases supply the task facts. Each scene contains six related but substantively distinct cases that share a professional procedure and a manually reviewed rubric for task quality and financial compliance. We compare four self-evolving agent scaffolds using the same Qwen3.7-Max backbone and three independently shuffled, globally interleaved task streams. Paired non-evolving controls estimate each scaffold's self-evolution gain from retained experience, while an independent Claude Code scoring agent backed by Claude Opus 4.6 evaluates all outputs. Letta achieves the highest evolved score (91.65) and fewest compliance issues (0.09 per task); Codex achieves the largest self-evolution gain (+19.37). Across scaffolds, the evolving condition raises scores by 9.33-19.37 points and reduces compliance issues by 0.12-0.44 per task. Paired score gains at within-scene ranks 4-6 exceed those at ranks 1-3 by 6.10-8.70 points. In Claude Code, skill-only evolution produces higher task quality and fewer compliance issues than memory-only and combined memory-skill evolution. Across all four scaffolds, rubric feedback also yields higher scores and fewer compliance issues than reference-answer feedback. FinEvo-Bench measures both professional performance and self-evolution ability: how effectively an agent turns prior experience into later improvement.",
    "arxiv": "https://arxiv.org/abs/2608.06144",
    "pdf": "https://arxiv.org/pdf/2608.06144"
  },
  {
    "id": "2608.06301",
    "nickname": "HarnessOpt-Bench",
    "title": "HarnessOpt-Bench: Evaluating LLMs at Harness Optimization",
    "authors": [
      "Varun Ursekar",
      "Apaar Shanker",
      "Yash Maurya",
      "Shehab Yasser",
      "Vijay S. Kalmath",
      "Veronica Chatrath",
      "Yuan Xue"
    ],
    "published": "2026-08-06",
    "year": 2026,
    "tags": [
      "Harness Optimization"
    ],
    "citations": 0,
    "abstract": "As LLMs are increasingly deployed within agentic systems, their capabilities depend not only on the model weights but also on the harness: the prompts, tools, control flow, memory, and orchestration code surrounding them. This makes automated harness optimization -- the iterative and evaluation-guided improvement of a harness by an AI system -- both an important route to improving AI systems and a demanding capability for AI systems themselves. Yet the community lacks a common protocol for measuring how well frontier LLMs perform at this task. We introduce HarnessOpt-Bench, a benchmark for end-to-end harness optimization under expensive and stochastic evaluation. An optimizer, an LLM paired with a coding harness, receives a target agent's seed harness, graded evaluation feedback, and a fixed target-evaluation budget. It edits the harness and nominates a final candidate, which is scored by its normalized gain over the seed on a held-out test partition that remains inaccessible throughout search. A trusted execution environment enforces the evaluation boundary, meters target-agent resource use, and preserves candidate versions for audit. We evaluate 5 frontier LLMs as optimizers both under a shared coding harness and under their native harnesses across 4 downstream tasks, over 111 scored runs. Experiment results show that optimizer models separate more than the coding harnesses they act through, native harnesses are not consistently superior, and gains vary substantially across tasks and seed regimes. These results establish harness optimization as a measurable and discriminative capability with large space for improvement.",
    "arxiv": "https://arxiv.org/abs/2608.06301",
    "pdf": "https://arxiv.org/pdf/2608.06301"
  },
  {
    "id": "2608.03764",
    "nickname": "GDPevo",
    "title": "GDPevo: Evaluating Agent Self-Evolution on Real Business Tasks",
    "authors": [
      "Leijun Zhou",
      "Zhihao Liu",
      "Xiang Qu",
      "Chenxu Liu",
      "Yifei Liu",
      "Yanke Yu",
      "Jingzhe Xu",
      "Xuejun Wu",
      "Buyue Qian",
      "Xi Chen",
      "Yaowei Zheng",
      "Junhao Hu"
    ],
    "published": "2026-08-04",
    "year": 2026,
    "tags": [
      "Self-Evolution",
      "Finance & Business"
    ],
    "citations": 0,
    "abstract": "Agent self-evolution updates an agent's persistent state from prior experience and reuses it to solve related tasks more effectively. Evaluating self-evolution is difficult: existing benchmarks provide limited coverage of economically valuable task domains, do not always design training and test tasks such that test-time gains can be attributed to training experience, and remain vulnerable to data contamination. We present GDPevo, an evolution-native benchmark grounded in GDP-related enterprise workflows, together with the fully automated data pipeline that generates it. Its core mechanism, rule hybridization, decomposes each enterprise workflow into atomic business rules, distributes subsets of these rules across training tasks, and recombines them in held-out test tasks so that test-time gains are attributable. GDPevo spans CRM, ERP, finance, healthcare, legal, and data-centric workflows. Its V1 release contains 120 tasks in 12 groups, with five training and five held-out test tasks per group. Full automation enables the pipeline to expand the suite to 240 tasks in 24 groups (V2) within two days, providing a practical response to contamination. Using GDPevo, we evaluate four agents, each comprising a harness and a model, under four supervision types. Self-evolution consistently improves held-out accuracy by up to 16.44 percentage points. But the best evolved agents remain far below the fully informed oracle ceiling of 91.6%, indicating that the self-evolution ability of current agents remains far from fully realized. We publicly release the pipeline, benchmark, and full evaluation results at https://github.com/Prism-Shadow/GDPevo.",
    "arxiv": "https://arxiv.org/abs/2608.03764",
    "pdf": "https://arxiv.org/pdf/2608.03764"
  },
  {
    "id": "2608.04003",
    "nickname": "PAST-Bench",
    "title": "PAST-Bench: Benchmarking the Foundations of Recursive Self-Improvement in Personal Agents",
    "authors": [
      "Shuhan Xue",
      "Zixin Ding",
      "Yichen Shen",
      "Yinjie Wang",
      "Zhenfei Yin",
      "Yingcheng Wu",
      "Yuxin Chen",
      "Mengdi Wang",
      "Ling Yang"
    ],
    "published": "2026-08-04",
    "year": 2026,
    "tags": [
      "Self-Evolution",
      "Memory"
    ],
    "citations": 0,
    "abstract": "Recursive self-improvement requires agents to turn accumulated experience into better future behavior. Personal AI agents offer a concrete setting for studying this capability because they retain preferences, task histories, tool routines, and learned skills across sessions. Yet whether retained experience actually improves them over time has not been systematically tested. We introduce PAST-Bench, a benchmark designed to isolate this question. Each agent runs through ordered sequences of fresh-session tasks under matched conditions that turn retained experience on and off. It spans 26 scenarios and 204 episodes across memory, procedural reuse, information gathering, and update. We report both later-task gains and whether those gains follow the intended save, retrieve, and update pathway. Across seven base models and four agent frameworks, improvement is real but uneven across capabilities. Agents with the same headline gain can differ markedly in whether that gain is supported by evidence of the intended pathway. Guided by these findings, we develop Hermes+, which extends Hermes with five targeted interventions across stages of the agent loop. Hermes+ raises the average gain from retained experience and provides clearer pathway evidence, with its strongest improvement on tasks requiring outdated state to be replaced, although the effect remains capability- and model-dependent. Together, PAST-Bench and Hermes+ provide an evaluation and diagnostic foundation for studying how persistent agents can progress from retaining experience to systematically improving through it. Code: https://github.com/Gen-Verse/PAST-Bench",
    "arxiv": "https://arxiv.org/abs/2608.04003",
    "pdf": "https://arxiv.org/pdf/2608.04003"
  },
  {
    "id": "2608.03874",
    "nickname": "ContinualSkillBench",
    "title": "ContinualSkillBench: Can LLM Agents Truly Evolve Their Capabilities?",
    "authors": [
      "Tianyi Guan",
      "Yiding Wang",
      "Haotong Yang",
      "Siyuan Cao",
      "Shirui Liu",
      "Yi Hu",
      "Jiaqi Li",
      "Muhan Zhang"
    ],
    "published": "2026-08-04",
    "year": 2026,
    "tags": [
      "Skill Learning",
      "Continual Learning"
    ],
    "citations": 0,
    "abstract": "Modern agent frameworks equip large language models with external skill libraries to solve complex tasks. However, it remains unclear whether these systems can effectively evolve their skills and whether the resulting skills improve task-solving capabilities. To bridge this gap, we introduce ContinualSkillBench, a dynamic evaluation framework for in-context continual skill learning. It covers five representative domains, each containing 100 interconnected subtasks ordered by increasing difficulty and opportunities for cross-task skill reuse. Our experiments show that sequential execution generally improves performance, but the gains vary substantially across models and domains. Moreover, in-context learning performs comparably to explicit skill maintenance on average, suggesting that much of the improvement arises from adaptation to prior context and feedback rather than reusable skill abstraction alone. Explicit skills nevertheless provide selective benefits for tasks requiring reusable procedures or precise outputs. We further find that less capable models tend to accumulate larger, more fragmented collections of task-specific skills. These findings show that current in-context skill evolution mechanisms can support continual adaptation, but still struggle to consistently consolidate experience into robust and transferable skills.",
    "arxiv": "https://arxiv.org/abs/2608.03874",
    "pdf": "https://arxiv.org/pdf/2608.03874"
  },
  {
    "id": "2608.01149",
    "nickname": "PATH-Bench",
    "title": "PATH-Bench: Path-Dependent Evaluation of Lifelong Agents",
    "authors": [
      "Xidong Yang",
      "Xingyi Zhang",
      "Wenhao Li",
      "Wenyan Liu",
      "Junjie Sheng",
      "Yun Hua",
      "Wei Yin",
      "Tao Fang",
      "Chuyun Shen",
      "Xiangfeng Wang"
    ],
    "published": "2026-08-02",
    "year": 2026,
    "tags": [
      "Continual Learning",
      "Self-Evolution"
    ],
    "citations": 0,
    "abstract": "Lifelong LLM agents increasingly adapt through external learning states that store past interactions as retrievable memories or reusable skills, yet existing benchmarks rarely account for how the path of accumulated experience shapes what agents transfer and retain. In this work, we establish PATH-Bench, a benchmark for path-dependent evaluation of lifelong agents. PATH-Bench estimates directed task relationships via multi-model in-context learning, constructs probe-centered sequences with controlled helpful and interfering histories, and repeatedly evaluates probe tasks to measure average performance, forward transfer, backward transfer, and forgetting. We evaluate eight representative agents on single-turn code generation and multi-turn tool-use tasks under positive- and negative-dominant histories. Benchmark results show that experience utility depends jointly on how experience is represented and on the task's interaction structure, that strong transfer does not ensure retention, and that later experience can reshape gains acquired earlier in the learning path. Based on these findings, we propose Selective Experience Use (SEU), an agent harness that regulates how path-accumulated experience influences each new task, admitting helpful items while filtering out potential interference. SEU consistently reduces forgetting while improving forward transfer in the majority of settings. The PATH-Bench provides both a controlled evaluation framework and actionable guidance for designing more selective and robust lifelong agents.",
    "arxiv": "https://arxiv.org/abs/2608.01149",
    "pdf": "https://arxiv.org/pdf/2608.01149"
  },
  {
    "id": "2608.00155",
    "nickname": "AgentStream",
    "title": "AgentStream: How Well Do Self-Evolving LLM Agents Perform Under Streaming Tasks?",
    "authors": [
      "Dong Yan",
      "Jian Liang",
      "Dapeng Hu",
      "Ran He",
      "Nicholas Jing Yuan",
      "Qi Zhang",
      "Tieniu Tan"
    ],
    "published": "2026-07-31",
    "year": 2026,
    "tags": [
      "Self-Evolution",
      "Continual Learning"
    ],
    "citations": 0,
    "abstract": "Large language model (LLM) agents can self-evolve by continually improving from their own accumulated experience. However, existing studies predominantly adopt independent evaluation. Consequently, the behavior of self-evolving agents in realistic streaming settings, where agents adapt to diverse and complex task streams, remains poorly understood. To address this gap, we introduce AgentStream, a unified framework that evaluates self-evolving agents spanning diverse evolution components by organizing agentic benchmarks into a configurable task stream and instantiating the \\texttt{Isolated}, \\texttt{Sequential}, and \\texttt{Interleaved} streaming scenarios at test time, which progressively vary the scope and domain composition of the stream. Over these scenarios, we combinatorially evaluate five representative self-evolving methods across three frontier foundation models, disentangling how model capability, method architecture, and streaming scenario jointly shape self-evolution. Our results show that self-evolution reliability varies across streaming scenarios, the benefit of self-evolution is gated by model capability and non-monotonic in model strength, and no single method dominates across models and scenarios. These findings offer concrete guidance for selecting self-evolving methods across models and streaming scenarios. Overall, we advocate that self-evolving agents should be evaluated under realistic task streams rather than isolated single-task settings.",
    "arxiv": "https://arxiv.org/abs/2608.00155",
    "pdf": "https://arxiv.org/pdf/2608.00155"
  },
  {
    "id": "2607.25886",
    "nickname": "RSIBench-Data",
    "title": "RSIBench-Data: Benchmarking Data-Centric Research for Recursive Self-Improvement",
    "authors": [
      "Fanqing Meng",
      "Lingxiao Du",
      "Qiguang Chen",
      "Ziqi Zhao",
      "Haocheng Lu",
      "Mengkang Hu",
      "Michael Qizhe Shieh"
    ],
    "published": "2026-07-28",
    "year": 2026,
    "tags": [
      "Data-Centric",
      "Research Automation"
    ],
    "citations": 3,
    "abstract": "Recursive self-improvement requires turning evidence of model failures into better models. Data-centric post-training research entails diagnosing capability gaps, designing and validating training-data strategies, and learning from checkpoint feedback. Can LLM agents automate this loop? Existing benchmarks entangle research decisions with optimization, serving, evaluation, and systems implementation, obscuring agents' research capability. We introduce RSIBench-Data, a controlled benchmark of LLM agents as data-centric researchers with a fixed post-training stack. Agents iteratively revise training-data strategies for a fixed target model; training and serving use Tinker-backed services, official evaluation runs through Harbor and E2B sandboxes, and budgets are fixed across agents. We evaluate four frontier agents on six benchmarks across software engineering, terminal use, scientific question answering, and mathematics. Agents demonstrate core data-centric research capabilities: in 58.33\\% of settings, they improve upon the first valid attempt by refining strategies from feedback. However, improvement is inconsistent. Among searches continuing after the best observed score, 78.26\\% end with a lower-scoring final attempt, while the rest only recover the same peak. A strong candidate may therefore appear early or midway through a run even as later revisions fail. Trajectory analysis identifies four patterns in stronger runs: accurate hypotheses, validation-grounded supervision, behavior-aligned data, and preservation of strong checkpoints. These findings suggest that current agents can make useful data-centric discoveries but cannot yet translate feedback into consistent improvements. RSIBench-Data provides a measurable, auditable testbed for the research capabilities required for recursive self-improvement. We open-source our code at https://github.com/evolvent-ai/RSIBench-Data.",
    "arxiv": "https://arxiv.org/abs/2607.25886",
    "pdf": "https://arxiv.org/pdf/2607.25886"
  },
  {
    "id": "2607.05202",
    "nickname": "EvoAgentBench",
    "title": "EvoAgentBench: Benchmarking Agent Self-Evolution via Ability Transfer",
    "authors": [
      "Xingze Gao",
      "Chuanrui Hu",
      "Hongda Chen",
      "Pengfei Yao",
      "Zhao Wang",
      "Yi Bai",
      "Zhengwei Wu",
      "Yunyun Han",
      "Xiaofeng Cong",
      "Jie Gui",
      "Yafeng Deng",
      "Teng Li"
    ],
    "published": "2026-07-06",
    "year": 2026,
    "tags": [
      "Self-Evolution",
      "Continual Learning"
    ],
    "citations": 5,
    "abstract": "Agent self-evolution in long-horizon LLM systems is largely procedural: useful experience is not merely stored information, but reusable procedures for searching, debugging, and verification. Yet current evaluations do not isolate this form of transfer. Agent benchmarks test single-episode task solving; memory benchmarks target information retention rather than procedural reuse. We introduce EvoAgentBench, a benchmark for agent self-evolution via Ability-guided transfer across four agentic domains: web research, algorithmic reasoning, software engineering, and knowledge work. EvoAgentBench extracts trace-grounded Abilities from agent executions, canonicalizes them into operational units, and builds domain-specific Ability Graphs linking tasks that share procedural overlap. By design, every test task is backed by verified training-side Ability support. Across a 528/267 train/test split, two scaffolds, and three backbones, curated Ability content transfers reliably across model families, but no current automatic method sustains positive gain in all settings. EvoAgentBench shifts self-evolution evaluation from aggregate accuracy comparison to fine-grained diagnosis of experience encoding, routing, and uptake. The benchmark is publicly available at https://huggingface.co/datasets/EverMind-AI/EvoAgentBench.",
    "arxiv": "https://arxiv.org/abs/2607.05202",
    "pdf": "https://arxiv.org/pdf/2607.05202"
  },
  {
    "id": "2607.05155",
    "nickname": "EdgeBench",
    "title": "EdgeBench: Unveiling Scaling Laws of Learning from Real-World Environments",
    "authors": [
      "Deyao Zhu",
      "Xin Zhou",
      "Shengling Qin",
      "Xuekai Zhu",
      "Hangliang Ding",
      "Shu Zhong",
      "Zixin Wen",
      "Zhonglin Xie",
      "Chenhui Gou",
      "Linxuan Ren",
      "Yueyang Wang",
      "Junfeng Zhong",
      "Rui Liu",
      "Tian Gao",
      "Yangguang Lin",
      "Jingyuan Zhang",
      "Maojia Song",
      "Xuan Qi",
      "Jinhong Wu",
      "Chenyang Zhang",
      "Yinzhu Piao",
      "Ziru Niu",
      "Hongbin Lin",
      "Lingxiang Meng",
      "Peng Tang",
      "Chengyao Tang",
      "Shanyu Wu",
      "Huanyu Zheng",
      "Yu Liu",
      "Liya Zhu",
      "He Wang",
      "Ming Ding",
      "Ziyu Wan",
      "Hao Liu",
      "Sibo Wang",
      "Haotian Zhu",
      "Xintian Zhang",
      "Nan Chai",
      "Yipeng Liu",
      "Panhao Lai",
      "Sihang Yuan",
      "Zixin Su",
      "Ge Zhang",
      "Wangchunshu Zhou",
      "Yantao Du",
      "Wenhao Huang",
      "Guang Shi"
    ],
    "published": "2026-07-06",
    "year": 2026,
    "tags": [
      "Learning Dynamics",
      "Self-Evolution"
    ],
    "citations": 3,
    "abstract": "Pretraining scaling laws reveal that model capability improves predictably with data and compute. But learning from real world environments after deployment remains far less understood. Analyzing roughly 38,000 hours of agent interaction with the environment across 134 real world tasks, we find, to the best of our knowledge, the first evidence that overall performance during environment learning follows a log-sigmoid scaling law with remarkably high precision, reaching R^2 = 0.998. Across model generations, we also find that agent learning speed roughly doubles every three months. This discovery stems from EdgeBench, a suite of 134 real world tasks with ultra-long horizons, spanning scientific discovery, software engineering, combinatorial optimization, professional knowledge work, formal mathematics, and interactive games. Each task sustains at least 12 hours of continuous agent operation under rich, multilevel feedback, and is built through substantial expert effort. We publicly release 51 tasks and our full evaluation framework to accelerate the study of how agents learn from real world experience.",
    "arxiv": "https://arxiv.org/abs/2607.05155",
    "pdf": "https://arxiv.org/pdf/2607.05155"
  },
  {
    "id": "2606.05661",
    "nickname": "CL-Bench",
    "title": "Continual Learning Bench: Evaluating Frontier AI Systems in Real-World Stateful Environments",
    "authors": [
      "Parth Asawa",
      "Christopher M. Glaze",
      "Gabriel Orlanski",
      "Ramya Ramakrishnan",
      "Benji Xu",
      "Asim Biswal",
      "Vincent Sunn Chen",
      "Frederic Sala",
      "Matei Zaharia",
      "Joseph E. Gonzalez"
    ],
    "published": "2026-06-04",
    "year": 2026,
    "tags": [
      "Continual Learning",
      "Self-Evolution"
    ],
    "citations": 3,
    "abstract": "Continual learning, the ability of AI systems to improve through sequential experience, has attracted substantial interest, but no high-quality benchmark exists to evaluate it. We introduce Continual Learning Bench (CL-Bench), the first difficult, expert-validated benchmark designed to measure whether LLM-based systems genuinely improve with experience. CL-Bench spans six diverse domains (software engineering, signal processing, disease outbreak forecasting, database querying, strategic game-playing, and demand forecasting), each validated by domain experts and designed so that tasks share a learnable latent structure (codebase layout, disease outbreak dynamics, opponent strategies) that a stateful system can discover online but a stateless one cannot. We evaluate frontier models across several agent architectures, from naive in-context learning (ICL) to dedicated memory systems, introducing a gain metric to isolate learning from prior capabilities. We find that these systems leave headroom for improved continual learning: agents frequently overfit to immediate observations or fail to reuse knowledge across instances, and dedicated memory systems do not fix this -- in fact, naive ICL outperforms systems dedicated to memory management. CL-Bench is the first benchmark to evaluate continual learning across diverse real-world domains with expert-validated tasks and isolate online learning from underlying model capability, showing a need for better continual learning systems.",
    "arxiv": "https://arxiv.org/abs/2606.05661",
    "pdf": "https://arxiv.org/pdf/2606.05661"
  },
  {
    "id": "2606.05080",
    "nickname": "AutoLab",
    "title": "AutoLab: Can Frontier Models Solve Long-Horizon Auto Research and Engineering Tasks?",
    "authors": [
      "Zhangchen Xu",
      "Junda Chen",
      "Yue Huang",
      "Dongfu Jiang",
      "Jiefeng Chen",
      "Hang Hua",
      "Zijian Wu",
      "Zheyuan Liu",
      "Zexue He",
      "Lichi Li",
      "Shizhe Diao",
      "Jiaxin Pei",
      "Jinsung Yoon",
      "Hao Zhang",
      "Mengdi Wang",
      "Radha Poovendran",
      "Misha Sra",
      "Alex Pentland",
      "Zichen Chen"
    ],
    "published": "2026-06-03",
    "year": 2026,
    "tags": [
      "Research Automation"
    ],
    "citations": 2,
    "abstract": "Scientific and engineering progress is fundamentally a long-horizon iterative process: proposing changes, running experiments, measuring outcomes, and continuously refining artifacts. Yet existing benchmarks for frontier models primarily evaluate either single-turn responses or short-horizon agent trajectories, failing to capture the challenges of sustained iterative improvement over extended time horizons. To address this gap, we introduce AutoLab, a new benchmark for ultra long-horizon closed-loop optimization. AutoLab consists of 36 realistic, expert-curated tasks spanning four diverse domains: system optimization, puzzle & challenge, model development, and CUDA kernel optimization. Each task begins with a correct but deliberately suboptimal baseline and challenges agents to improve it within a strict wall-clock budget. Evaluating 17 state-of-the-art models reveals the dominant predictor of success is not the quality of an agent's initial attempt, but its persistence in repeatedly benchmarking, editing, and incorporating empirical feedback. While claude-opus-4.6 exhibits strong long-horizon optimization capabilities, most frontier models, including several proprietary ones, either terminate prematurely or exhaust their budgets with minimal progress. These results underscore the importance of time awareness and persistent iteration in autonomous agents. We open-source the full benchmark, evaluation harness, and task artifacts, to accelerate research toward truly capable long-horizon agents.",
    "arxiv": "https://arxiv.org/abs/2606.05080",
    "pdf": "https://arxiv.org/pdf/2606.05080"
  },
  {
    "id": "2606.04261",
    "nickname": "Curation-Bench",
    "title": "Can Generalist Agents Automate Data Curation?",
    "authors": [
      "Feiyang Kang",
      "Hanze Li",
      "Adam Nguyen",
      "Mahavir Dabas",
      "Jiaqi W. Ma",
      "Frederic Sala",
      "Dawn Song",
      "Ruoxi Jia"
    ],
    "published": "2026-06-02",
    "year": 2026,
    "tags": [
      "Data-Centric",
      "Research Automation"
    ],
    "citations": 2,
    "abstract": "Curating training data is among the most consequential yet labor-intensive parts of modern AI development: practitioners iteratively propose, implement, evaluate, and revise data policies against noisy benchmark feedback. We ask whether generalist coding agents can automate this data-curation loop. We introduce *Curation-Bench*, an agent-centric benchmark that fixes the model, training recipe, and evaluation suite while giving agents command-line access to inspect data, implement policies, submit them to a fixed training/evaluation pipeline, and revise. In a vision-language instruction-tuning instantiation, out-of-the-box agents reach strong published data-selection baselines within ten iterations. However, trajectory analysis reveals a persistent *execution-research gap*: agents mainly tune local policy variants rather than explore new policy families, even when given strategy guides and paper references. Scaffolds requiring each iteration to cite, instantiate, and adapt a prior method shift agents toward method-guided exploration. The scaffolded agent autonomously composes -- without human design input -- a data-selection policy that outperforms strong published baselines at one-tenth their data budget. Overall, current agents can run the curation loop, but reliable data research requires scaffolded method adaptation, not open-ended prompting alone. Code and benchmark are open-sourced.",
    "arxiv": "https://arxiv.org/abs/2606.04261",
    "pdf": "https://arxiv.org/pdf/2606.04261"
  },
  {
    "id": "2605.18421",
    "nickname": "EvoMemBench",
    "title": "EvoMemBench: Benchmarking Agent Memory from a Self-Evolving Perspective",
    "authors": [
      "Yuyao Wang",
      "Zhongjian Zhang",
      "Mo Chi",
      "Kaichi Yu",
      "Yuhan Li",
      "Miao Peng",
      "Bing Tong",
      "Chen Zhang",
      "Yan Zhou",
      "Jia Li"
    ],
    "published": "2026-05-18",
    "year": 2026,
    "tags": [
      "Memory",
      "Self-Evolution"
    ],
    "citations": 3,
    "abstract": "Recent benchmarks for Large Language Model (LLM) agents mainly evaluate reasoning, planning, and execution. However, memory is also essential for agents, as it enables them to store, update, and retrieve information over time. This ability remains under-evaluated, largely because existing benchmarks do not provide a systematic way to assess memory mechanisms. In this paper, we study agent memory from a self-evolving perspective and introduce EvoMemBench, a unified benchmark organized along two axes: memory scope (in-episode vs. cross-episode) and memory content (knowledge-oriented vs. execution-oriented). We compare 15 representative memory methods with strong long-context baselines under a standardized protocol. Results show that current memory systems are still far from a general solution: long-context baselines remain highly competitive, memory helps most when the current context is insufficient or tasks are difficult, and no single memory form works consistently across all settings. Retrieval-based methods remain strong for knowledge-intensive settings, whereas procedural and long-term memory methods are more effective for execution-oriented tasks when their stored experience matches the task structure. We hope EvoMemBench facilitates future research on more effective memory systems for LLM-based agents. Our code is available at https://github.com/DSAIL-Memory/EvoMemBench.",
    "arxiv": "https://arxiv.org/abs/2605.18421",
    "pdf": "https://arxiv.org/pdf/2605.18421"
  },
  {
    "id": "2604.20087",
    "nickname": "SkillLearnBench",
    "title": "SkillLearnBench: Benchmarking Continual Learning Methods for Agent Skill Generation on Real-World Tasks",
    "authors": [
      "Shanshan Zhong",
      "Yi Lu",
      "Jingjie Ning",
      "Yibing Wan",
      "Lihan Feng",
      "Yuyi Ao",
      "Leonardo F. R. Ribeiro",
      "Markus Dreyer",
      "Sean Ammirati",
      "Chenyan Xiong"
    ],
    "published": "2026-04-22",
    "year": 2026,
    "tags": [
      "Skill Learning",
      "Continual Learning"
    ],
    "citations": 28,
    "abstract": "Skills have become the de facto way to enable LLM agents to perform complex real-world tasks with customized instructions, workflows, and tools, but how to learn them automatically and effectively remains unclear. We introduce SkillLearnBench, the first benchmark for evaluating continual skill learning methods, comprising 20 verified, skill-dependent tasks across 15 sub-domains derived from a real-world skill taxonomy , evaluated at three levels: skill quality, execution trajectory, and task outcome. Using this benchmark, we evaluate recent continual learning techniques, those leveraging one-shot, self/teacher feedback, and skill creator to generate skills from agent experiences. We find that all continual learning methods improve over the no-skill baseline, yet consistent gains remain elusive: no method leads across all tasks and LLMs, and scaling to stronger LLMs does not reliably help. Continual learning improves tasks with clear, reusable workflows but struggles on open-ended tasks, and using stronger LLM backbones does not consistently produce better skills. Our analysis also revealed that multiple iterations in continual learning facilitate genuine improvement via external feedback, whereas self-feedback alone induces recursive drift. Our data and code are open-source at https://github.com/cxcscmu/SkillLearnBench to enable further studies of automatic skill generation and continual learning techniques.",
    "arxiv": "https://arxiv.org/abs/2604.20087",
    "pdf": "https://arxiv.org/pdf/2604.20087"
  },
  {
    "id": "2604.17308",
    "nickname": "SkillFlow",
    "title": "SkillFlow: Benchmarking Lifelong Skill Discovery and Evolution for Autonomous Agents",
    "authors": [
      "Ziao Zhang",
      "Kou Shi",
      "Shiting Huang",
      "Avery Nie",
      "Yu Zeng",
      "Yiming Zhao",
      "Zhen Fang",
      "Qishen Su",
      "Haibo Qiu",
      "Wei Yang",
      "Qingnan Ren",
      "Shun Zou",
      "Wenxuan Huang",
      "Lin Chen",
      "Zehui Chen",
      "Feng Zhao"
    ],
    "published": "2026-04-19",
    "year": 2026,
    "tags": [
      "Skill Learning",
      "Continual Learning"
    ],
    "citations": 15,
    "abstract": "As the capability frontier of autonomous agents continues to expand, they are increasingly able to complete specialized tasks through plug-and-play external skills. Yet current benchmarks mostly test whether models can use provided skills, leaving open whether they can discover skills from experience, repair them after failure, and maintain a coherent library over time. We introduce SkillFlow, a benchmark of 166 tasks across 20 families in which task construction within each family follows a Domain-Agnostic Execution Flow (DAEF) that defines an agent workflow framework, allowing these tasks to share a consistent workflow. Agents are evaluated under an Agentic Lifelong Learning protocol in which they begin without skills, solve tasks sequentially within each family, externalize lessons through trajectory- and rubric-driven skill patches, and carry the updated library forward. Experiments reveal a substantial capability gap. For Claude Opus 4.6, lifelong skill evolution improves task success from 62.65% to 71.08% (+8.43 points). However, high skill usage does not necessarily imply high utility: Kimi K2.5 gains only +0.60 points despite 66.87% skill usage, while Qwen-Coder-Next reaches only a 44.58% task completion rate and still regresses relative to the vanilla setting. SkillFlow contributes a structured testbed for this direction and an in-depth empirical analysis of skill discovery, patching, transfer, and their failure modes under lifelong evaluation.",
    "arxiv": "https://arxiv.org/abs/2604.17308",
    "pdf": "https://arxiv.org/pdf/2604.17308"
  },
  {
    "id": "2604.10547",
    "nickname": "Agent² RL-Bench",
    "title": "Agent² RL-Bench: Can LLM Agents Engineer Agentic RL Post-Training?",
    "authors": [
      "Wanyi Chen",
      "Xiao Yang",
      "Xu Yang",
      "Tianming Sha",
      "Qizheng Li",
      "Zhuo Wang",
      "Bowen Xian",
      "Fang Kong",
      "Weiqing Liu",
      "Jiang Bian"
    ],
    "published": "2026-04-12",
    "year": 2026,
    "tags": [
      "Post-Training & RL",
      "Research Automation"
    ],
    "citations": 1,
    "abstract": "We introduce Agent2 RL-Bench, a compact diagnostic benchmark for evaluating agentic RL post-training, which tests whether LLM agents can autonomously design, implement, debug, and execute post-training pipelines that improve foundation models. RL post-training increasingly drives model alignment and specialization, yet existing benchmarks are largely static, rewarding supervised fine-tuning or script generation without assessing an agent's ability to close an interactive RL loop. Agent2 RL-Bench provides a unified agent-facing interface: each run starts from an isolated workspace containing a base model, task data, instructions, and a grading API, and agents must iterate within a fixed budget by training models and submitting artifacts for evaluation. The benchmark spans six tasks across three levels, from static rule-based training to judge-based optimization and closed-loop online RL with trajectory collection. Two diagnostic skills, namely runtime recording and post-hoc summarization, enable structured analysis of agent behavior, facilitating smooth and effective iteration of the benchmark's evaluation framework. Across five agent systems and six driver LLMs, agents show intelligent behavior but clear limitations: one RL-oriented run improves ALFWorld from 4.85 to 93.28 via SFT warm-up and GRPO with online rollouts, yet DeepSearchQA remains difficult, most successful routes rely on supervised pipelines, and interactive outcomes show large single-run differences across agent stacks. Overall, Agent2 RL-Bench shows that current agents can sometimes engineer online RL, but stable agent-driven RL post-training remains rare under fixed budgets. It also demonstrates that our benchmark provides a strong and effective evaluation framework for future research in this direction. Code is available at https://github.com/microsoft/RD-Agent/blob/main/rdagent/scenarios/rl/autorl_bench/README.md",
    "arxiv": "https://arxiv.org/abs/2604.10547",
    "pdf": "https://arxiv.org/pdf/2604.10547"
  },
  {
    "id": "2603.08640",
    "nickname": "PostTrainBench",
    "title": "PostTrainBench: Can LLM Agents Automate LLM Post-Training?",
    "authors": [
      "Ben Rank",
      "Hardik Bhatnagar",
      "Ameya Prabhu",
      "Shira Eisenberg",
      "Karina Nguyen",
      "Matthias Bethge",
      "Maksym Andriushchenko"
    ],
    "published": "2026-03-09",
    "year": 2026,
    "tags": [
      "Post-Training & RL",
      "Research Automation"
    ],
    "citations": 24,
    "abstract": "AI agents have become surprisingly proficient at software engineering over the past year, largely due to improvements in reasoning capabilities. This raises a deeper question: can these systems extend their capabilities to automate AI research itself? In this paper, we explore post-training, the critical phase that turns base LLMs into useful assistants. We introduce PostTrainBench to benchmark how well LLM agents can perform post-training autonomously under bounded compute constraints (10 hours on one H100 GPU). We ask frontier agents (e.g., Claude Code with Opus 4.6) to optimize the performance of a base LLM on a particular benchmark (e.g., Qwen3-4B on AIME). Importantly, we do not provide any predefined strategies to the agents and instead give them full autonomy to find necessary information on the web, run experiments, and curate data. We find that frontier agents make substantial progress but generally lag behind instruction-tuned LLMs from leading providers: 23.2% for the best agent vs. 51.1% for official instruction-tuned models. However, agents can exceed instruction-tuned models in targeted scenarios: GPT-5.1 Codex Max achieves 89% on BFCL with Gemma-3-4B vs. 67% for the official model. We also observe several failure modes worth flagging. Agents sometimes engage in reward hacking: training on the test set, downloading existing instruction-tuned checkpoints instead of training their own, and using API keys they find to generate synthetic data without authorization. These behaviors are concerning and highlight the importance of careful sandboxing as these systems become more capable. Overall, we hope PostTrainBench will be useful for tracking progress in AI R&D automation and for studying the risks that come with it. Website and code are available at https://posttrainbench.com/.",
    "arxiv": "https://arxiv.org/abs/2603.08640",
    "pdf": "https://arxiv.org/pdf/2603.08640"
  },
  {
    "id": "2511.20857",
    "nickname": "Evo-Memory",
    "title": "Evo-Memory: Benchmarking LLM Agent Test-time Learning with Self-Evolving Memory",
    "authors": [
      "Tianxin Wei",
      "Noveen Sachdeva",
      "Benjamin Coleman",
      "Zhankui He",
      "Yuanchen Bei",
      "Xuying Ning",
      "Mengting Ai",
      "Yunzhe Li",
      "Jingrui He",
      "Ed H. Chi",
      "Chi Wang",
      "Shuo Chen",
      "Fernando Pereira",
      "Wang-Cheng Kang",
      "Derek Zhiyuan Cheng"
    ],
    "published": "2025-11-25",
    "year": 2025,
    "tags": [
      "Self-Evolution",
      "Memory",
      "Continual Learning"
    ],
    "citations": 113,
    "abstract": "Statefulness is essential for large language model (LLM) agents to perform long-term planning and problem-solving. This makes memory a critical component, yet its management and evolution remain largely underexplored. Existing evaluations mostly focus on static conversational settings, where memory is passively retrieved from dialogue to answer queries, overlooking the dynamic ability to accumulate and reuse experience across evolving task streams. In real-world environments such as interactive problem assistants or embodied agents, LLMs are required to handle continuous task streams, yet often fail to learn from accumulated interactions, losing valuable contextual insights, a limitation that calls for test-time evolution, where LLMs retrieve, integrate, and update memory continuously during deployment. To bridge this gap, we introduce Evo-Memory, a comprehensive streaming benchmark and framework for evaluating self-evolving memory in LLM agents. Evo-Memory structures datasets into sequential task streams, requiring LLMs to search, adapt, and evolve memory after each interaction. We unify and implement over ten representative memory modules and evaluate them across 10 diverse multi-turn goal-oriented and single-turn reasoning and QA datasets. To better benchmark experience reuse, we provide a baseline method, ExpRAG, for retrieving and utilizing prior experience, and further propose ReMem, an action-think-memory refine pipeline that tightly integrates reasoning, task actions, and memory updates to achieve continual improvement.",
    "arxiv": "https://arxiv.org/abs/2511.20857",
    "pdf": "https://arxiv.org/pdf/2511.20857"
  },
  {
    "id": "2510.17281",
    "nickname": "MemoryBench",
    "title": "MemoryBench: A Benchmark for Memory and Continual Learning in LLM Systems",
    "authors": [
      "Qingyao Ai",
      "Yichen Tang",
      "Changyue Wang",
      "Jianming Long",
      "Weihang Su",
      "Yiqun Liu"
    ],
    "published": "2025-10-20",
    "year": 2025,
    "tags": [
      "Memory",
      "Continual Learning",
      "Self-Evolution"
    ],
    "citations": 47,
    "abstract": "Scaling up data, parameters, and test-time computation has been the mainstream methods to improve LLM systems (LLMsys), but their upper bounds are almost reached due to the gradual depletion of high-quality data and marginal gains obtained from larger computational resource consumption. Inspired by the abilities of human and traditional AI systems in learning from practice, constructing memory and continual learning frameworks for LLMsys has become an important and popular research direction in recent literature. Yet, existing benchmarks for LLM memory often focus on evaluating the system on homogeneous reading comprehension tasks with long-form inputs rather than testing their abilities to learn from accumulated user feedback in service time. Therefore, we propose a user feedback simulation framework and a comprehensive benchmark covering multiple domains, languages, and types of tasks to evaluate the continual learning abilities of LLMsys. Experiments show that the effectiveness and efficiency of state-of-the-art baselines are far from satisfying, and we hope this benchmark could pave the way for future studies on LLM memory and optimization algorithms.",
    "arxiv": "https://arxiv.org/abs/2510.17281",
    "pdf": "https://arxiv.org/pdf/2510.17281"
  },
  {
    "id": "2508.19005",
    "nickname": "StuLife",
    "title": "Building Self-Evolving Agents via Experience-Driven Lifelong Learning: A Framework and Benchmark",
    "authors": [
      "Yuxuan Cai",
      "Yipeng Hao",
      "Jie Zhou",
      "Hang Yan",
      "Zhikai Lei",
      "Rui Zhen",
      "Zhenhua Han",
      "Yutao Yang",
      "Junsong Li",
      "Qianjun Pan",
      "Tianyu Huai",
      "Qin Chen",
      "Xin Li",
      "Kai Chen",
      "Bo Zhang",
      "Xipeng Qiu",
      "Liang He"
    ],
    "published": "2025-08-26",
    "year": 2025,
    "tags": [
      "Self-Evolution",
      "Memory",
      "Skill Learning",
      "Continual Learning"
    ],
    "citations": 37,
    "abstract": "As AI advances toward general intelligence, the focus is shifting from systems optimized for static tasks to creating open-ended agents that learn continuously. In this paper, we introduce Experience-driven Lifelong Learning (ELL), a framework for building self-evolving agents capable of continuous growth through real-world interaction. The framework is built on four core principles: (1) Experience Exploration: Agents learn through continuous, self-motivated interaction with dynamic environments, navigating interdependent tasks and generating rich experiential trajectories. (2) Long-term Memory: Agents preserve and structure historical knowledge, including personal experiences, domain expertise, and commonsense reasoning, into a persistent memory system. (3) Skill Learning: Agents autonomously improve by abstracting recurring patterns from experience into reusable skills, which are actively refined and validated for application in new tasks. (4) Knowledge Internalization: Agents internalize explicit and discrete experiences into implicit and intuitive capabilities as \"second nature\". We also introduce StuLife, a benchmark dataset for ELL that simulates a student's holistic college journey, from enrollment to academic and personal development, across three core phases and ten detailed sub-scenarios. StuLife is designed around three key paradigm shifts: From Passive to Proactive, From Context to Memory, and From Imitation to Learning. In this dynamic environment, agents must acquire and distill practical skills and maintain persistent memory to make decisions based on evolving state variables. StuLife provides a comprehensive platform for evaluating lifelong learning capabilities, including memory retention, skill transfer, and self-motivated behavior. Beyond evaluating SOTA LLMs on the StuLife benchmark, we also explore the role of context engineering in advancing AGI.",
    "arxiv": "https://arxiv.org/abs/2508.19005",
    "pdf": "https://arxiv.org/pdf/2508.19005"
  },
  {
    "id": "2507.05257",
    "nickname": "MemoryAgentBench",
    "title": "Evaluating Memory in LLM Agents via Incremental Multi-Turn Interactions",
    "authors": [
      "Yuanzhe Hu",
      "Yu Wang",
      "Julian McAuley"
    ],
    "published": "2025-07-07",
    "year": 2025,
    "tags": [
      "Memory",
      "Continual Learning",
      "Self-Evolution"
    ],
    "citations": 193,
    "abstract": "Recent benchmarks for Large Language Model (LLM) agents primarily focus on evaluating reasoning, planning, and execution capabilities, while another critical component-memory, encompassing how agents memorize, update, and retrieve long-term information-is under-evaluated due to the lack of benchmarks. We term agents with memory mechanisms as memory agents. In this paper, based on classic theories from memory science and cognitive science, we identify four core competencies essential for memory agents: accurate retrieval, test-time learning, long-range understanding, and selective forgetting. Existing benchmarks either rely on limited context lengths or are tailored for static, long-context settings like book-based QA, which do not reflect the interactive, multi-turn nature of memory agents that incrementally accumulate information. Moreover, no existing benchmarks cover all four competencies. We introduce MemoryAgentBench, a new benchmark specifically designed for memory agents. Our benchmark transforms existing long-context datasets and incorporates newly constructed datasets into a multi-turn format, effectively simulating the incremental information processing characteristic of memory agents. By carefully selecting and curating datasets, our benchmark provides comprehensive coverage of the four core memory competencies outlined above, thereby offering a systematic and challenging testbed for assessing memory quality. We evaluate a diverse set of memory agents, ranging from simple context-based and retrieval-augmented generation (RAG) systems to advanced agents with external memory modules and tool integration. Empirical results reveal that current methods fall short of mastering all four competencies, underscoring the need for further research into comprehensive memory mechanisms for LLM agents.",
    "arxiv": "https://arxiv.org/abs/2507.05257",
    "pdf": "https://arxiv.org/pdf/2507.05257"
  },
  {
    "id": "2505.11942",
    "nickname": "LifelongAgentBench",
    "title": "LifelongAgentBench: Evaluating LLM Agents as Lifelong Learners",
    "authors": [
      "Junhao Zheng",
      "Xidi Cai",
      "Qiuke Li",
      "Duzhen Zhang",
      "ZhongZhi Li",
      "Yingying Zhang",
      "Le Song",
      "Qianli Ma"
    ],
    "published": "2025-05-17",
    "year": 2025,
    "tags": [
      "Continual Learning",
      "Memory",
      "Self-Evolution"
    ],
    "citations": 46,
    "abstract": "Lifelong learning is essential for intelligent agents operating in dynamic environments. Current large language model (LLM)-based agents, however, remain stateless and unable to accumulate or transfer knowledge over time. Existing benchmarks treat agents as static systems and fail to evaluate lifelong learning capabilities. We present LifelongAgentBench, the first unified benchmark designed to systematically assess the lifelong learning ability of LLM agents. It provides skill-grounded, interdependent tasks across three interactive environments, Database, Operating System, and Knowledge Graph, with automatic label verification, reproducibility, and modular extensibility. Extensive experiments reveal that conventional experience replay has limited effectiveness for LLM agents due to irrelevant information and context length constraints. We further introduce a group self-consistency mechanism that significantly improves lifelong learning performance. We hope LifelongAgentBench will advance the development of adaptive, memory-capable LLM agents.",
    "arxiv": "https://arxiv.org/abs/2505.11942",
    "pdf": "https://arxiv.org/pdf/2505.11942"
  }
];
