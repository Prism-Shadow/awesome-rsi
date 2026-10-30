export const appCopy = {
  en: {
    pageTitle: "Awesome RSI — Recursive Self-Improvement Papers",
    pageDescription: "A curated, filterable collection of papers, books, and courses on Recursive Self-Improvement.",
    themeToggle: "Toggle theme",
    language: "Language",
    english: "English",
    chinese: "Chinese",
    navigation: "Main navigation",
    tabs: {
      home: "Home",
      methods: "Methods & Systems",
      papers: "Benchmarks",
      graph: "Citation Graph",
    },
    footerTagline: "A curated collection of benchmarks, methods, and systems for Recursive Self-Improvement.",
    footerExplore: "Explore",
    footerProject: "Project",
    footerLinks: [
      ["GitHub repository", ""],
      ["Suggest a paper", "/issues"],
      ["Cite the survey", "#citation"],
      ["WeChat group", "#wechat-group"],
    ],
  },
  zh: {
    pageTitle: "Awesome RSI — 递归自我改进研究",
    pageDescription: "一个可筛选、可检索的递归自我改进论文、书籍与课程精选合集。",
    themeToggle: "切换主题",
    language: "语言",
    english: "英文",
    chinese: "中文",
    navigation: "主导航",
    tabs: {
      home: "首页",
      methods: "方法与系统",
      papers: "基准论文",
      graph: "引用图谱",
    },
    footerTagline: "递归自我改进（RSI）基准、方法与系统精选合集。",
    footerExplore: "浏览",
    footerProject: "项目",
    footerLinks: [
      ["GitHub 仓库", ""],
      ["推荐论文", "/issues"],
      ["引用综述", "#citation"],
      ["微信群", "#wechat-group"],
    ],
  },
};

export const homeCopy = {
  en: {
    title: { before: "", keep: "RSI,", gap: " ", emphasis: "mapped", after: "." },
    lede: "Every RSI method, taken apart along nine dimensions",
    stats: { methods: "methods", systems: "systems", benchmarks: "benchmarks", citations: "citation links" },
    recentTitle: "Recently added",
    allMethods: "Methods & Systems",
    allBenchmarks: "Benchmarks",
    kinds: { method: "Method", system: "System", benchmark: "Benchmark" },
    blogTitle: "From the blog",
  },
  zh: {
    title: { before: "", keep: "RSI", gap: " ", emphasis: "研究图谱", after: "" },
    lede: "用九个维度，拆解每一种 RSI 方法",
    stats: { methods: "个方法", systems: "个系统", benchmarks: "篇基准论文", citations: "条引用关系" },
    recentTitle: "最新收录",
    allMethods: "方法与系统",
    allBenchmarks: "基准论文",
    kinds: { method: "方法", system: "系统", benchmark: "基准" },
    blogTitle: "博客",
  },
};

export const surveyCopy = {
  en: {
    eyebrow: "Our survey",
    summary: "A nine-dimension taxonomy of RSI methods and insights from traditional deep learning to inspire new research.",
    imageAlt: "Survey overview: a tree connects agent resources, the RSI taxonomy, feedback-driven improvement, and insights from traditional deep learning.",
  },
  zh: {
    eyebrow: "我们的综述",
    summary: "通过九维分类框架和传统深度学习机制，梳理已有 RSI 方法，探索新的研究思路。",
    imageAlt: "综述概览：一棵树连接智能体资源、RSI 分类框架、反馈驱动的改进，以及来自传统深度学习的启发。",
  },
};

export const papersCopy = {
  en: {
    noPapers: "No papers found",
    noPapersHint: "Try removing one of the filters or widening a range.",
    reset: "Reset all filters",
  },
  zh: {
    noPapers: "没有符合条件的论文",
    noPapersHint: "可以尝试减少筛选条件，或扩大数值范围。",
    reset: "重置全部筛选",
  },
};

export const filterCopy = {
  en: {
    filterPapers: "Filter papers",
    resultCount: (visible, total) => ({ before: "", visible, middle: " of ", total, after: " papers" }),
    includes: "Includes",
    note: "Note",
    explain: (label) => `Explain ${label}`,
    definitions: (label) => `${label} definitions`,
    onlyValue: "Only value in the current collection",
    minimum: (label) => `${label} minimum`,
    maximum: (label) => `${label} maximum`,
    numericRange: "Numeric range",
    publicationYear: "Publication year",
    citations: "Citations",
    filters: "Filters",
    clearAll: "Clear all",
    removeFilter: (label) => `Remove filter: ${label}`,
    searchPlaceholder: "Search title, nickname, author, or arXiv ID",
    sortPapers: "Sort papers",
    sort: "Sort",
    newest: "Newest",
    mostCited: "Most cited",
    numericHelp: {
      summary: "Continuous filters for publication recency and global citation count.",
      items: [
        { term: "Publication year", description: "Keep papers published within the selected year interval." },
        { term: "Citations", description: "Keep papers whose current Semantic Scholar citation count falls within the selected interval." },
      ],
      note: "Drag either handle; both numeric filters combine with the categorical dimensions using AND.",
    },
  },
  zh: {
    filterPapers: "筛选论文",
    resultCount: (visible, total) => ({ before: "共 ", visible, middle: " / ", total, after: " 篇论文" }),
    includes: "包含",
    note: "说明",
    explain: (label) => `查看“${label}”的定义`,
    definitions: (label) => `${label}的定义`,
    onlyValue: "当前合集只有这一个取值",
    minimum: (label) => `${label}下限`,
    maximum: (label) => `${label}上限`,
    numericRange: "数值范围",
    publicationYear: "发表年份",
    citations: "引用次数",
    filters: "筛选",
    clearAll: "清除全部",
    removeFilter: (label) => `移除筛选：${label}`,
    searchPlaceholder: "搜索标题、简称、作者或 arXiv ID",
    sortPapers: "论文排序",
    sort: "排序",
    newest: "最新发表",
    mostCited: "引用最多",
    numericHelp: {
      summary: "按发表时间和全局引用次数连续筛选论文。",
      items: [
        { term: "发表年份", description: "只保留发表于所选年份区间内的论文。" },
        { term: "引用次数", description: "只保留当前 Semantic Scholar 引用次数落在所选区间内的论文。" },
      ],
      note: "拖动任一滑块即可调整范围；两个数值条件与上方分类条件之间均按“且”组合。",
    },
  },
};

export const paperCardCopy = {
  en: {
    citations: (count) => `${count} citation${count === 1 ? "" : "s"}`,
    authors: (count) => `${count} authors`,
    institutions: "Institutions",
    showAbstract: "Abstract ▾",
    hideAbstract: "Abstract ▴",
    showProfile: "Profile ▾",
    hideProfile: "Profile ▴",
    profileLabel: "Benchmark taxonomy profile",
  },
  zh: {
    citations: (count) => `${count} 次引用`,
    authors: (count) => `共 ${count} 位作者`,
    institutions: "机构",
    showAbstract: "摘要 ▾",
    hideAbstract: "摘要 ▴",
    showProfile: "维度档案 ▾",
    hideProfile: "维度档案 ▴",
    profileLabel: "基准维度档案",
  },
};

export const graphCopy = {
  en: {
    verifiedNetwork: "Verified bibliography network",
    title: "Citation topology",
    intro: "Arrows run from the citing paper to the paper it references. Search for a node to locate it without removing the surrounding network.",
    visiblePapers: "papers",
    verifiedEdges: "verified edges",
    controls: "Graph zoom controls",
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
    resetView: "Reset graph view",
    hint: "Drag to pan · scroll or pinch to zoom",
    networkLabel: (papers, edges) => `Citation network with ${papers} papers and ${edges} verified citation relationships`,
    citations: "citations",
    older: "Older",
    newer: "Newer",
    nodeSize: "Node size = global citations",
    cites: "cites",
    noEdges: "No verified citation relationships are available in this network.",
    globalCitations: "global citations",
    citedByCorpus: "cited by corpus",
    referencesInCorpus: "references in corpus",
    references: "References",
    citedBy: "Cited by",
    noReferences: "No verified references to another visible paper.",
    noCitations: "No visible paper cites this work yet.",
    originalPdf: "Original PDF",
    semanticScholar: "Semantic Scholar",
    openArxiv: "Open paper on arXiv ↗",
    openPaper: "Open paper ↗",
    pageIntro: (papers, edges) => `Arrows run from a benchmark paper to the papers it cites. ${papers} papers and ${edges} verified citations.`,
  },
  zh: {
    verifiedNetwork: "经核验的文献引用网络",
    title: "引用关系图谱",
    intro: "箭头从引用方指向被引用论文。搜索节点可以定位目标，同时保留完整的关系网络。",
    visiblePapers: "篇论文",
    verifiedEdges: "条已核验引用",
    controls: "图谱缩放控制",
    zoomIn: "放大",
    zoomOut: "缩小",
    resetView: "重置图谱视图",
    hint: "拖动平移 · 滚轮或双指缩放",
    networkLabel: (papers, edges) => `包含 ${papers} 篇论文和 ${edges} 条已核验引用关系的图谱`,
    citations: "次引用",
    older: "较早",
    newer: "较新",
    nodeSize: "节点大小代表全局引用次数",
    cites: "引用",
    noEdges: "当前网络中没有已核验的引用关系。",
    globalCitations: "全局引用",
    citedByCorpus: "被合集引用",
    referencesInCorpus: "引用合集论文",
    references: "参考文献",
    citedBy: "引用本文",
    noReferences: "没有已核验的、指向其他可见论文的引用。",
    noCitations: "当前可见论文中还没有工作引用本文。",
    originalPdf: "原始 PDF",
    semanticScholar: "Semantic Scholar",
    openArxiv: "在 arXiv 查看论文 ↗",
    openPaper: "查看论文 ↗",
    pageIntro: (papers, edges) => `箭头从基准论文指向它引用的论文。共 ${papers} 篇论文、${edges} 条已核验引用。`,
  },
};

export const methodGraphCopy = {
  en: {
    ...graphCopy.en,
    verifiedNetwork: "Verified method bibliography network",
    title: "Method citation topology",
    intro: "Arrows run from a method paper to another method paper in its bibliography. Search for a node to locate it without removing the surrounding network.",
    visiblePapers: "method papers",
    networkLabel: (papers, edges) => `Method citation network with ${papers} papers and ${edges} verified citation relationships`,
    nodeSize: "Node size = citations inside this collection",
    primaryMetric: "first posted",
    corpusCitations: "in-corpus citations",
    pageIntro: (papers, edges) => `Arrows run from a method to the methods it cites. ${papers} papers and ${edges} citations, each checked against the citing paper's bibliography.`,
  },
  zh: {
    ...graphCopy.zh,
    verifiedNetwork: "经核验的方法论文引用网络",
    title: "方法引用图谱",
    intro: "箭头从引用方指向其参考文献中的另一篇方法论文。搜索节点可以定位目标，同时保留完整的关系网络。",
    visiblePapers: "篇方法论文",
    networkLabel: (papers, edges) => `包含 ${papers} 篇方法论文和 ${edges} 条已核验引用关系的图谱`,
    nodeSize: "节点大小代表在本合集内被引用的次数",
    primaryMetric: "首次公开",
    corpusCitations: "合集内引用",
    pageIntro: (papers, edges) => `箭头从方法指向它引用的方法。共 ${papers} 篇论文、${edges} 条引用，均已对照施引论文的参考文献核验。`,
  },
};

export const graphExplorerCopy = {
  en: {
    title: "Citation graph explorer",
    datasetLabel: "Citation graph collection",
    benchmark: "Benchmark papers",
    methods: "Methods & Systems",
    searchLabel: "Find a node",
    searchPlaceholder: "Search title, nickname, author, or arXiv ID",
    noResults: "No matching node found.",
  },
  zh: {
    title: "引用图谱浏览器",
    datasetLabel: "引用图谱类别",
    benchmark: "基准论文",
    methods: "方法与系统",
    searchLabel: "查找节点",
    searchPlaceholder: "搜索标题、简称、作者或 arXiv ID",
    noResults: "没有匹配的节点。",
  },
};

export const methodsCopy = {
  en: {
    noMethods: "No methods or systems found",
    noMethodsHint: "Try removing one of the filters or widening the publication range.",
    reset: "Reset all filters",
  },
  zh: {
    noMethods: "没有符合条件的方法或系统",
    noMethodsHint: "可以尝试减少筛选条件，或扩大发表年份范围。",
    reset: "重置全部筛选",
  },
};

export const systemCardCopy = {
  en: {
    researchPreview: "Research preview",
    maintainers: "Maintained by",
    showProfile: "Profile ▾",
    hideProfile: "Profile ▴",
    profileLabel: "RSI system profile",
  },
  zh: {
    researchPreview: "研究预览",
    maintainers: "维护者",
    showProfile: "维度档案 ▾",
    hideProfile: "维度档案 ▴",
    profileLabel: "RSI 系统维度档案",
  },
};

export const methodFilterCopy = {
  en: {
    filterPapers: "Filter methods and systems",
    resultCount: (visible, total) => ({ before: "", visible, middle: " of ", total, after: " methods and systems" }),
    includes: "Includes",
    note: "Note",
    explain: (label) => `Explain ${label}`,
    definitions: (label) => `${label} definitions`,
    onlyValue: "Only value in the current collection",
    minimum: (label) => `${label} minimum`,
    maximum: (label) => `${label} maximum`,
    numericRange: "Publication range",
    publicationYear: "First posted",
    citations: "Citations",
    filters: "Filters",
    clearAll: "Clear all",
    removeFilter: (label) => `Remove filter: ${label}`,
    searchPlaceholder: "Search title, nickname, author, or arXiv ID",
    sortPapers: "Methods and systems sorting",
    sort: "Sort",
    newest: "Newest",
    mostCited: "Most cited",
    numericHelp: {
      summary: "Filter entries by the year they were first publicly released.",
      items: [
        { term: "First posted", description: "Use the first arXiv submission for papers and the listed release date for systems." },
      ],
      note: "Paper venue badges and system release labels are shown separately from this date filter.",
    },
  },
  zh: {
    filterPapers: "筛选方法与系统",
    resultCount: (visible, total) => ({ before: "共 ", visible, middle: " / ", total, after: " 项方法与系统" }),
    includes: "包含",
    note: "说明",
    explain: (label) => `查看“${label}”的定义`,
    definitions: (label) => `${label}的定义`,
    onlyValue: "当前合集只有这一个取值",
    minimum: (label) => `${label}下限`,
    maximum: (label) => `${label}上限`,
    numericRange: "发表时间",
    publicationYear: "首次公开年份",
    citations: "引用次数",
    filters: "筛选",
    clearAll: "清除全部",
    removeFilter: (label) => `移除筛选：${label}`,
    searchPlaceholder: "搜索标题、简称、作者或 arXiv ID",
    sortPapers: "方法与系统排序",
    sort: "排序",
    newest: "最新公开",
    mostCited: "引用最多",
    numericHelp: {
      summary: "按照条目首次公开的年份筛选方法与系统。",
      items: [
        { term: "首次公开年份", description: "论文使用首次 arXiv 提交时间，系统使用页面列出的版本发布时间。" },
      ],
      note: "论文会议标签和系统版本信息会与该日期筛选项分开展示。",
    },
  },
};

export const methodCardCopy = {
  en: {
    authors: (count) => `${count} authors`,
    institutions: "Institutions",
    accepted: "Accepted",
    preprint: "Recent preprint",
    showAbstract: "Abstract ▾",
    hideAbstract: "Abstract ▴",
    showProfile: "Profile ▾",
    hideProfile: "Profile ▴",
    profileLabel: "RSI method profile",
  },
  zh: {
    authors: (count) => `共 ${count} 位作者`,
    institutions: "机构",
    accepted: "已录用",
    preprint: "近期预印本",
    showAbstract: "摘要 ▾",
    hideAbstract: "摘要 ▴",
    showProfile: "维度档案 ▾",
    hideProfile: "维度档案 ▴",
    profileLabel: "RSI 方法维度档案",
  },
};

export const blogCopy = {
  en: {
    back: "← All posts",
    included: "What’s included",
    contents: "In this guide",
  },
  zh: {
    back: "← 全部文章",
    included: "本次更新内容",
    contents: "本文目录",
  },
};

export const tagLabelsZh = {
  "Self-Evolution": "自我演化",
  "Skill Learning": "技能学习",
  Memory: "记忆",
  "Continual Learning": "持续学习",
  "Data-Centric": "数据中心方法",
  "Post-Training & RL": "后训练与强化学习",
  "Harness Optimization": "Harness 优化",
  "Research Automation": "研究自动化",
  "Learning Dynamics": "学习动力学",
  "Finance & Business": "金融与商业",
};

export function getInitialLanguage() {
  try {
    const saved = localStorage.getItem("awesome-rsi-lang");
    if (saved === "en" || saved === "zh") return saved;
  } catch {}
  return navigator.language?.toLowerCase().startsWith("zh") ? "zh" : "en";
}

export function localizedValue(item, field, lang) {
  return lang === "zh" ? item[`${field}Zh`] ?? item[field] : item[field];
}
