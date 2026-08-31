const methodTaxonomyZh = {
  artifact: {
    label: "RSI 修改对象",
    summary: "改进结果保存在模型参数中，还是保存在非参数产物中。",
    note: "工具归入 Harness 代码。同一篇论文可以同时修改多种非参数产物。",
    items: {
      Parametric: ["参数", "模型权重发生变化，并将更新后的参数带入后续改进或任务。"],
      "Non-parametric": ["非参数", "Base model 权重保持不变，能力通过可持久化的外部产物积累。"],
      "Harness code": ["Harness 代码", "智能体框架、Harness、控制流、自我改进机制或工具的可执行代码。"],
      Context: ["上下文", "持续写入模型上下文的 Prompt、指令、规则、示例或其他材料。"],
      Memory: ["记忆", "跨步骤、轨迹或任务存储并检索的信息或经验。"],
      Skill: ["技能", "可复用的策略、流程、工作流或可执行能力。"],
    },
  },
  topology: {
    label: "演化拓扑",
    summary: "历史版本以什么关系共同影响新版本的产生。",
    note: "即使生成的 Child 最终挂在一条主要谱系下，只要更新同时利用了多个历史版本的状态或证据，也归为图。",
    items: {
      Sequential: ["顺序", "每次更新只依赖一个当前状态，形成单一路径的连续版本。"],
      Tree: ["树", "历史版本可以分叉，但每个新版本只受一个直接父版本影响。"],
      Graph: ["图", "一个新版本可以综合多个历史版本或谱系的状态、证据或影响。"],
    },
  },
  selection: {
    label: "保留标准",
    summary: "依据什么证据决定是否保留一次修改。",
    note: "产物通过局部验证，不等于整个智能体的 Benchmark 能力一定提升。",
    items: {
      "Artifact validation": ["产物验证", "通过单元测试、编译、接口检查或其他针对修改对象的直接验证。"],
      "Task result": ["任务结果", "依据当前任务是否成功，或是否获得更高奖励。"],
      "Benchmark score": ["Benchmark 得分", "依据一组评测问题上的总体表现。"],
      "Combined metrics": ["组合指标", "同时考虑表现、成本、速度、稳定性、新颖性或其他目标。"],
      "No validation": ["无独立验证", "生成后直接写入，不设置单独的验收环节。"],
    },
  },
  actor: {
    label: "更新执行者",
    summary: "谁读取执行证据，并参与提出或写入修改。",
    note: "Solver 自己反思、同一模型的 Evolver 再整理写回时，可以同时选择“自己”和“同模型角色”。",
    items: {
      Self: ["自己", "执行任务的智能体分析证据，并参与修改自身。"],
      "Same-model role": ["同模型角色", "同一 Backbone 以独立的 Critic、Reflector、Curator 或 Evolver 角色参与更新。"],
      "External teacher": ["外部教师", "另一个模型或 Checkpoint 分析并修改 Student。"],
      Peer: ["同伴", "其他智能体或群体成员参与评价、选择或修改候选。"],
    },
  },
  depth: {
    label: "更新深度",
    summary: "反馈是直接写回、分阶段整理，还是连改进机制本身也会变化。",
    note: "元递归强调改进逻辑本身会变化，而不是固定更新流程被重复执行。",
    items: {
      "Direct update": ["直接更新", "一个更新者根据反馈直接修改目标产物。"],
      "Propose–curate": ["提出—整理", "一个阶段提出经验或改动，另一个阶段负责审核、合并或写回。"],
      "Meta-recursive": ["元递归", "更新器、评价器或决定如何改进的逻辑也会变化，并在后续轮次继续使用。"],
    },
  },
  source: {
    label: "监督来源",
    summary: "驱动改进的证据来自哪里。",
    note: "这里记录演化过程中实际使用的证据，而不只记录最终测试协议。",
    items: {
      Benchmark: ["Benchmark", "直接使用待测 Benchmark 的答案、Verifier 或分数。"],
      "Train/dev set": ["训练／验证集", "使用与最终测试分离的进化任务或数据划分。"],
      Environment: ["环境", "使用状态变化、Observation、原生 Reward 或执行结果。"],
      "Executable verifier": ["可执行验证器", "使用单元测试、编译器、容器或形式检查器。"],
      "LLM judge": ["LLM 评审", "用语言模型评价器近似真实任务质量。"],
      "Agent feedback": ["智能体反馈", "使用自我批评、自洽性、辩论或其他智能体的判断。"],
      Human: ["人工", "使用人工标签、偏好、审核或干预。"],
    },
  },
  detail: {
    label: "监督信息量",
    summary: "单次监督信号提供多少信息。",
    note: "Self-consistency 只是聚合多次 rollout；没有外部验证时，一致答案仍是伪标签而不是 Ground truth。",
    items: {
      "Binary feedback": ["二值反馈", "只告诉系统成功或失败、通过或未通过。"],
      Score: ["分数", "提供 Reward、准确率或其他标量得分。"],
      Observation: ["观察", "提供环境状态、工具返回值或其他可核验事实。"],
      "Ground truth": ["标准答案", "提供参考答案、目标状态或参考实现。"],
      Diagnostic: ["诊断信息", "提供测试日志、错误位置、失败类型或约束违规。"],
      Critique: ["文字批评", "用自然语言解释失败原因和可能的改进方法。"],
      Attribution: ["责任定位", "指出导致结果的具体步骤或轨迹片段。"],
    },
  },
  timing: {
    label: "更新时机",
    summary: "执行到什么时候会发生一次持久更新。",
    note: "同一个系统中的不同持久化产物可以采用不同更新时机。",
    items: {
      Step: ["单步", "在轨迹中的一次动作—观察之后更新。"],
      Event: ["事件触发", "检测到失败、能力缺口、提示或子目标完成时更新。"],
      Trajectory: ["完整轨迹", "一条完整任务轨迹结束后更新。"],
      Batch: ["批次", "积累多条轨迹后统一更新。"],
      Generation: ["代际", "一代候选完成评估后更新。"],
      Offline: ["离线阶段", "先收集数据，再在单独阶段集中整理或训练。"],
    },
  },
  scope: {
    label: "经验作用范围",
    summary: "系统从多大范围的证据中提取经验，又把经验用于多大范围。",
    note: "把专用经验限制在任务类型或领域内，可以减少过拟合与负迁移。",
    items: {
      "Step → Instance": ["单步 → 实例", "保留局部事件，只用于当前实例或高度相似的状态。"],
      "Step → Global": ["单步 → 全局", "把局部事件写入后续任务都能访问的状态。"],
      "Trajectory → Task-type": ["轨迹 → 任务类型", "从完整轨迹提炼经验，用于同类任务。"],
      "Trajectory → Domain": ["轨迹 → 领域", "从完整轨迹提炼可复用的领域知识。"],
      "Trajectory → Global": ["轨迹 → 全局", "把完整轨迹的经验作为全局指导。"],
      "Cross-trajectory → Task-type": ["跨轨迹 → 任务类型", "比较多条轨迹，形成面向同类任务的知识。"],
      "Cross-trajectory → Domain": ["跨轨迹 → 领域", "整合多条轨迹，形成领域级知识。"],
      "Cross-trajectory → Global": ["跨轨迹 → 全局", "整合多条轨迹，形成全局可复用状态。"],
    },
  },
};

export function localizeMethodDimensions(dimensions, lang) {
  if (lang !== "zh") return dimensions;

  return dimensions.map((dimension) => {
    const translation = methodTaxonomyZh[dimension.id];
    const displayTerm = (term) => translation.items[term]?.[0] ?? term;
    return {
      ...dimension,
      label: translation.label,
      options: dimension.options.map((option) => ({
        ...option,
        label: translation.items[option.value]?.[0] ?? option.label,
        parentLabel: option.parent ? displayTerm(option.parent) : undefined,
      })),
      help: {
        summary: translation.summary,
        items: dimension.help.items.map((item) => ({
          ...item,
          term: displayTerm(item.term),
          parent: item.parent ? displayTerm(item.parent) : undefined,
          description: translation.items[item.term]?.[1] ?? item.description,
        })),
        note: translation.note,
      },
    };
  });
}

export function localizeMethodValue(dimensionId, value, lang) {
  if (lang !== "zh") return value;
  return methodTaxonomyZh[dimensionId]?.items[value]?.[0] ?? value;
}
