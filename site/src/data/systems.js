export const systems = [
  {
    id: "proteus",
    nickname: "Proteus",
    title: "Proteus: A Harness-Agnostic Self-Evolution Framework for AI Agents",
    version: "v0.3.0",
    released: "2026-08-24",
    maintainers: "Proteus Authors",
    summary: "An open-source, harness-agnostic framework for running and measuring iterative self-evolution. Each episode starts with a fresh model context, lets the agent edit declared harness surfaces, activates source changes only after validation, and preserves versioned snapshots of the evolution history.",
    summaryZh: "一个与具体 Harness 解耦的开源自我演化框架，用于运行和测量迭代式自我改进。每个 episode 都使用全新的模型上下文，Agent 可以修改预先声明的 Harness 区域；代码改动通过验证后才会启用，版本化快照则保留完整的演化历史。",
    taxonomy: {
      artifact: ["Non-parametric", "Harness code", "Context", "Memory", "Skill"],
      mode: ["Offline"],
      topology: ["Sequential"],
      selection: ["Artifact validation", "Instance result"],
      updater: ["Self"],
      source: ["Environment", "Executable verifier", "LLM feedback"],
      feedback: ["Score", "Binary", "Non-binary", "Non-score", "Other"],
      frequency: ["Trajectory"],
      scope: ["General", "Specialized"],
    },
    links: [
      { label: "GitHub", labelZh: "GitHub", url: "https://github.com/proteus-evolve/Proteus" },
      { label: "v0.3.0 release", labelZh: "v0.3.0 版本", url: "https://github.com/proteus-evolve/Proteus/releases/tag/v0.3.0" },
      { label: "Documentation", labelZh: "文档", url: "https://github.com/proteus-evolve/Proteus/tree/main/docs" },
      { label: "Website", labelZh: "网站", url: "https://proteus-evolve.github.io/" },
    ],
  },
];
