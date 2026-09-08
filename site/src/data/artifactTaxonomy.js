// Shared artifact options and definitions for benchmarks and methods.
const artifacts = [
  { value: "Parametric", zh: "参数", description: "Model parameters change, and the updated model participates in later tasks or improvement.", descriptionZh: "模型参数发生变化，更新后的模型继续参与后续任务或改进。" },
  { value: "Non-parametric", zh: "非参数", description: "Improvement is carried forward in the agent's external state or artifacts, including within a continuous run.", descriptionZh: "改进通过智能体的外部状态或产物保留和积累，也包括同一次连续运行中的积累。" },
  { value: "Harness code", zh: "Harness 代码", parent: "Non-parametric", description: "Executable agent, harness, control-flow, self-improvement, or tool code is modified.", descriptionZh: "修改智能体框架、Harness、控制流、自我改进机制或工具的可执行代码。" },
  { value: "Context", zh: "上下文", parent: "Non-parametric", description: "Prompts or working context are updated. Observations, feedback, and experience can accumulate or be reorganized during a continuous run to guide later actions or tasks.", descriptionZh: "更新 Prompt 或工作上下文，也包括在连续运行中积累、压缩或重组观察、反馈和经验，用于指导后续行动或任务。" },
  { value: "Memory", zh: "记忆", parent: "Non-parametric", description: "Information or experience is stored, updated, and retrieved across steps, trajectories, or tasks.", descriptionZh: "跨步骤、轨迹或任务存储、更新和检索信息或经验。" },
  { value: "Skill", zh: "技能", parent: "Non-parametric", description: "Reusable strategies, procedures, workflows, or skill resources are created and revised.", descriptionZh: "创建和修改可复用的策略、流程、工作流或技能资源。" },
  { value: "Other artifact", label: "Other", zh: "其他", parent: "Non-parametric", description: "Other artifacts evolve, such as data strategies, experiment configurations, or task solutions.", descriptionZh: "演化其他产物，例如数据策略、实验配置或任务解法。" },
];

export const artifactDimension = {
  id: "artifact",
  label: "RSI artifact",
  help: {
    summary: "What is updated and carried forward during recursive self-improvement or long-horizon learning.",
    items: artifacts.map(({ value, label, parent, description }) => ({
      term: label ?? value,
      description,
      ...(parent ? { parent } : {}),
    })),
  },
  options: artifacts.map(({ value, label, parent }) => ({
    value,
    label: label ?? value,
    ...(parent ? { parent } : {}),
  })),
};

export const artifactTranslationZh = {
  label: "RSI 产物",
  summary: "递归自我改进或长程学习中被更新，并继续用于后续工作的内容。",
  items: Object.fromEntries(artifacts.flatMap(({ value, label, zh, descriptionZh }) => {
    const translation = [zh, descriptionZh];
    return label ? [[value, translation], [label, translation]] : [[value, translation]];
  })),
};
