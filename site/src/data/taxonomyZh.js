const taxonomyZh = {
  origin: {
    label: "基准来源",
    summary: "基准核心任务与实例的来源。",
    note: "如果同时包含多种来源，则按核心任务的主要来源归类。",
    items: {
      Composite: ["组合型", "核心任务集由已有基准组装、改编或重新组织而成，通常用于构建统一的任务流或评测协议。"],
      Original: ["原创型", "论文自行设计或生成核心任务、实例或数据，而不是以整合已有基准为主。"],
    },
  },
  mode: {
    label: "RSI 模式",
    summary: "系统以何种方式获得经验，以及改进效果是否在留出的任务上评测。",
    note: "这里采用本合集的操作性定义；论文对 online 和 offline 的用法可能有所不同。",
    items: {
      Online: ["在线", "不存在严格隔离的留出阶段：系统一边处理任务一边积累经验，并在后续任务中观察改进。"],
      "Random order": ["随机顺序", "将在线任务打乱，以减弱固定任务顺序带来的影响。"],
      Curriculum: ["课程式", "任务按预先设计的顺序展开，通常从较简单或作为前置条件的任务逐步过渡到更难任务。"],
      Streaming: ["流式", "任务以数据流形式持续到达，系统不假设能够提前获知完整的后续任务序列。"],
      "Repeated / iterative": ["重复／迭代", "智能体围绕同一目标反复修改产物或方法，并利用前几次尝试的反馈继续改进。"],
      Offline: ["离线", "系统先从训练集学习，再在严格分离的留出测试集上评估。"],
      "Offline → Online": ["离线 → 在线", "混合流程：先在离线阶段形成初始能力或技能库，再在实际在线使用中继续演化。"],
    },
  },
  artifact: {
    label: "RSI 产物",
    summary: "在递归或长程过程中被持续保留并改进的内容。",
    note: "如果一个固定的训练智能体只产出单个后训练目标模型，本分类不会将其视为参数式 RSI。",
    items: {
      Parametric: ["参数式", "仅指真正跨模型代际的递归：A1 训练 A2，随后 A2 参与训练 A3，并在后续代际中持续循环。"],
      "Non-parametric": ["非参数式", "基础模型权重保持不变，能力通过智能体长程运行中的外部状态或产物不断积累。"],
      Skill: ["技能", "创建并修订可复用的流程、提示词、程序、工作流或技能说明。"],
      Memory: ["记忆", "保存事实、经验、轨迹、反馈或检索条目，并在后续任务中复用。"],
      "Harness code": ["Harness 代码", "修改智能体外围系统，包括提示词、工具、控制流、编排方式或执行代码。"],
      Other: ["其他", "演化的是其他外部产物，例如数据策略、训练方案、实验配置或任务解法。"],
    },
    optionLabels: { "Other artifact": "其他" },
  },
  construction: {
    label: "构建标准",
    summary: "作者在构建基准任务时有意优化或筛选的属性。",
    note: "提升空间关注的是能否继续进步；泛化性关注的是这种进步能否迁移。",
    items: {
      Headroom: ["提升空间", "当前系统仍有明显的改进余地，强基线尚未使这些任务趋于饱和。"],
      Diversity: ["多样性", "任务集覆盖不同领域、能力、难度、工作流或环境，而不是局限于单一模式。"],
      Generalization: ["泛化性", "检验改进能否迁移到未见任务、留出数据、新领域或不同模型。"],
      Other: ["其他", "其他标准，例如抗污染性、路径依赖、任务敏感性、经济价值或可审计性。"],
    },
    optionLabels: { "Other criteria": "其他" },
  },
  metric: {
    label: "评测指标",
    summary: "基准用哪些结果衡量 RSI 过程。",
    note: "如果系统起点已经很强，即使最终准确率很高，RSI 带来的增益也可能很小。",
    items: {
      Accuracy: ["准确性", "最终任务的正确性或质量，包括准确率、通过率、奖励或量表评分。"],
      Gain: ["增益", "由改进带来的变化，通常指演化后表现减去匹配的非演化基线或初始基线。"],
      Cost: ["成本", "改进过程消耗的 token、API、算力、训练资源、工具调用或资金。"],
      Latency: ["耗时", "完成任务、实验、搜索或一次完整改进循环所需的时间。"],
    },
  },
  creation: {
    label: "基准创建方式",
    summary: "创建基准本身需要多少人工参与。",
    note: "这里描述的是谁来构建基准，而不是谁运行或改进接受评测的智能体。",
    items: {
      "Fully automated": ["全自动", "任务、实例或基准数据主要通过自动化生成流水线产出。"],
      "Human-in-the-loop": ["人机协同", "自动化流程与人工设计、审核、纠错、筛选或评分标准验证相结合。"],
      Manual: ["人工", "基准的核心任务、数据、流程或评分规则主要由人工编写。"],
    },
  },
  evaluation: {
    label: "评分方式",
    summary: "如何为提交结果或智能体输出给出最终得分。",
    note: "同一基准可以混合两种方式，例如用规则检查正确性，再由 LLM 评判开放式输出质量。",
    items: {
      "Rule-based": ["规则评分", "由单元测试、程序执行、精确答案、结构化验证器或环境奖励等确定性检查给出分数。"],
      "LLM-as-a-judge": ["LLM 评审", "由另一个语言模型依据评分标准、参考答案、偏好比较或定性条件为输出打分。"],
    },
  },
};

export function localizeFilterDimensions(dimensions, lang) {
  if (lang !== "zh") return dimensions;

  return dimensions.map((dimension) => {
    const translation = taxonomyZh[dimension.id];
    const displayTerm = (term) => translation.items[term]?.[0] ?? term;

    return {
      ...dimension,
      label: translation.label,
      options: dimension.options.map((option) => ({
        ...option,
        label: translation.optionLabels?.[option.value]
          ?? translation.items[option.value]?.[0]
          ?? option.label,
        parentLabel: option.parent ? displayTerm(option.parent) : undefined,
      })),
      help: {
        summary: translation.summary,
        items: dimension.help.items.map((item) => ({
          term: displayTerm(item.term),
          parent: item.parent ? displayTerm(item.parent) : undefined,
          description: translation.items[item.term]?.[1] ?? item.description,
        })),
        note: translation.note,
      },
    };
  });
}
