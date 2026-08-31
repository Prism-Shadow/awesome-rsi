const methodTaxonomyZh = {
  artifact: {
    label: "RSI 修改对象",
    summary: "改进结果保存在模型参数中，还是保存在非参数产物中。",
    items: {
      Parametric: ["参数", "模型权重发生变化，并将更新后的参数带入后续改进或任务。"],
      "Non-parametric": ["非参数", "Base model 权重保持不变，能力通过可持久化的外部产物积累。"],
      "Harness code": ["Harness 代码", "智能体框架、Harness、控制流、自我改进机制或工具的可执行代码。"],
      Context: ["上下文", "持续写入模型上下文的 Prompt、指令、规则、示例或其他材料。"],
      Memory: ["记忆", "跨步骤、轨迹或任务存储并检索的信息或经验。"],
      Skill: ["技能", "可复用的策略、流程、工作流或可执行能力。"],
    },
  },
  mode: {
    label: "RSI 模式",
    summary: "演化发生在最终评测或部署之前，还是发生在持续使用过程中。",
    note: "如果论文分别提供独立的在线与离线变体，则同时标记两项；只有前后串联的完整流程才标记“离线 → 在线”。",
    items: {
      Online: ["在线", "系统在处理任务流时持续更新，后续任务可以直接使用新状态。"],
      Offline: ["离线", "系统在最终评测前，通过独立的训练或搜索阶段完成演化。"],
      "Offline → Online": ["离线 → 在线", "系统先在离线阶段形成初始产物，再在使用过程中继续更新。"],
    },
  },
  topology: {
    label: "RSI 拓扑",
    summary: "历史版本以什么关系共同影响新版本的产生。",
    note: "即使生成的 Child 最终挂在一条主要谱系下，只要更新同时利用了多个历史版本的状态或证据，也归为图。",
    items: {
      Sequential: ["顺序", "每次更新只依赖一个当前状态，形成单一路径的连续版本。"],
      Tree: ["树", "历史版本可以分叉，但每个新版本只受一个直接父版本影响。"],
      Graph: ["图", "一个新版本可以综合多个历史版本或谱系的状态、证据或影响。"],
    },
  },
  selection: {
    label: "验收标准",
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
  updater: {
    label: "产物更新者",
    summary: "由谁参与形成 Student 后续会继续使用的持久产物更新。",
    note: "Student 指接受评测的任务执行智能体。“联合”不要求两个角色都亲自执行最终的文件写入。",
    items: {
      Self: ["自身", "由 Student 自己形成更新。"],
      Teacher: ["教师", "由独立 Teacher 根据 Student 的经验形成更新。"],
      Joint: ["联合", "Student 主动提出或修订更新，再由 Teacher 进一步整理、筛选或修改。"],
    },
  },
  source: {
    label: "反馈来源",
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
  feedback: {
    label: "反馈类型",
    summary: "针对 Student 工作结果的反馈是分数信号，还是包含具体信息的非分数反馈。",
    note: "不记录只用于演化 Teacher 的反馈。LLM 评审给出的标量仍属于分数；这里的“LLM 评审”专指它对 Student 给出的文字判断、解释或批评。",
    items: {
      Score: ["分数", "用数值或类别评价任务结果。"],
      Binary: ["二值", "只提供成功、失败、通过或未通过。"],
      "Non-binary": ["非二值", "提供多于两个取值的奖励、准确率、效用或其他分数。"],
      "Non-score": ["非分数", "反馈包含结果分数之外的具体信息。"],
      "Ground truth": ["标准答案", "提供参考答案、目标状态、预期输出或参考实现。"],
      "LLM-as-a-judge": ["LLM 评审", "语言模型给出文字判断、解释或批评。"],
      Other: ["其他", "包括 Observation、日志、诊断、责任定位、约束信息或智能体生成的批评。"],
    },
  },
  frequency: {
    label: "更新频率",
    summary: "积累多少 Student 执行过程后，会更新一次 Student 的持久产物。",
    note: "不记录 Teacher 自身的演化周期。按代更新与 Student 经验的离线集中整理统一归入“批次”。",
    items: {
      Step: ["单步", "在轨迹中的一次动作—Observation 之后更新。"],
      Event: ["事件触发", "在失败、能力缺口、提示或子目标完成等事件发生时更新。"],
      Trajectory: ["完整轨迹", "一条完整任务轨迹结束后更新。"],
      Batch: ["批次", "积累多条轨迹、多组候选，或完成一轮离线数据收集后统一更新。"],
    },
  },
  scope: {
    label: "经验作用范围",
    summary: "演化得到的产物是广泛复用，还是限制在特定任务语境中使用。",
    note: "如果系统同时维护全局产物和任务专用产物，则同时标记两项。",
    items: {
      General: ["通用", "产物可以跨任务类型或跨领域复用。"],
      Specialized: ["专用", "产物只用于特定实例、任务类型、主题或领域。"],
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
