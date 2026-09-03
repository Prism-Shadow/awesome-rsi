# 万字长文带你读懂RSI（自进化，Self\-Evolving）

RSI（Recursive Self\-Improvement）这个概念最近热度很高。与之相近的表述还有自进化、Self\-Evolving、Self\-Improving 等等概念。

目前，这个领域仍在飞速发展，尚未形成统一的技术范式。不同工作选择的改进对象和实现路径差异很大：有的更新模型参数，有的积累上下文或记忆，有的演化 Skill，还有的直接修改工具、控制流程和 Harness 代码。因此，RSI 很难用某一种具体方法或单一技术路线来概括。

本文参考了 [Awesome RSI 仓库](https://github.com/Prism-Shadow/awesome-rsi)（[网站](https://prism-shadow.github.io/awesome-rsi/)），尝试从分类的视角整理现有 RSI 工作。我们将从多个维度出发，分析不同自进化工作之间的联系和区别。读完本文后，你可以进一步理解 RSI 这个概念，也能建立一套分析 RSI 的坐标系：再遇到新的自进化工作时，可以迅速判断它与已有工作的联系和区别。

![codex\-rsi\-taxonomy\-overview\-gpt\-preview\-v1\.png](图片和附件/codex-rsi-taxonomy-overview-gpt-preview-v1.png)

![codex\-rsi\-artifact\-mode\-matrix\-v1\.png](图片和附件/codex-rsi-artifact-mode-matrix-v1.png)

## 1 RSI 到底是什么

本文把 RSI 定义为：Agent 在与环境交互后，利用任务轨迹与反馈，通过更新机制修改自身状态，并让更新后的状态参与后续任务，以提升未来表现。

![codex\-rsi\-loop\-v5\.png](图片和附件/codex-rsi-loop-v5.png)

$A_{t+1}=U(A_t,\tau_t,f_t)$

其中，$A_t$ 表示第 $t$ 轮使用的 Agent，$\tau_t$ 是它在任务中产生的轨迹，$f_t$ 是获得的反馈，$U$ 是更新机制。$A_t$ 包含 Model 与 Harness；更新可以发生在模型参数上，也可以发生在 Harness 的上下文、记忆、Skill、工具或代码上。更新后的 $A_{t+1}$ 将参与后续任务。$U$ 不一定由 Agent 自己执行，也可以由 Teacher、Meta\-Agent 或外部训练程序完成。

## 2 RSI 在进化什么：参数、上下文、记忆、Skill 与 Harness 代码

现代智能体可以抽象为 **Agent = Model \+ Harness**。Model 提供基础的理解、推理与生成能力；Harness 则组织模型如何接收信息、积累经验、调用工具并完成任务，具体包括上下文、记忆、Skill、工具和 Harness 代码。

不同的 RSI 方法可能修改其中不同的部分：参数进化修改 Model；上下文、记忆和 Skill 进化修改 Harness 中可持续积累的状态；工具与 Harness 代码进化则改变 Agent 的动作空间和控制流程。

![codex\-agent\-anatomy\-v3\.png](图片和附件/codex-agent-anatomy-v3.png)

### 2\.1 参数进化

参数进化把经验写回模型权重。它的优势是知识可以直接内化进模型，不必每次检索外部材料；代价是更新昂贵、难以定位和撤销，而且一次错误训练可能影响大量无关任务。

**代表工作：**[**Self\-Adapting Language Models**](https://arxiv.org/abs/2506.10943)

![01\-seal\-fig1\.png](图片和附件/01-seal-fig1.png)

SEAL 的出发点是：语言模型部署后会不断遇到新知识和新任务，但权重通常保持静止。作者希望模型不依赖单独的适配网络，而是自己决定“应该怎样训练自己”。为此，模型面对新输入时不只生成答案，还生成 self\-edit。self\-edit 是一份自我更新方案，可以重组原始信息、生成训练样本、指定优化超参数，或者调用工具做数据增强和梯度更新。

系统随后按照 self\-edit 的设置执行监督微调。经过 SFT 后，经验从一段临时文本变成持久权重变化。问题是，模型最初并不知道什么样的 self\-edit 真正有效，于是 SEAL 又在外面加了一层强化学习：执行某个 self\-edit 后，重新测量更新模型的下游表现，并把这个结果作为奖励，训练模型以后生成更有用的 self\-edit。

作者在知识吸收和少样本学习任务上测试了 SEAL。模型生成的 self\-edit 不仅包含训练数据，还可以指定数据的组织方式和训练配置。系统按照 self\-edit 实际更新模型，再根据更新后模型的下游得分筛选更有效的方案。因此，候选 self\-edit 的微调和评测仍会带来较高的计算开销。



### 2\.2 上下文进化

上下文可以理解为模型在当前这次推理中直接看到的材料，包括任务要求、历史对话、当前计划、Prompt、规则，以及经过整理的外部信息。上下文进化，就是根据任务执行结果重新组织这些材料，让模型下一次推理时看到更有用的内容。例如，系统可以删除无关信息、压缩过长的历史、补充失败教训，或者重写当前计划。

上下文与记忆的区别在于：记忆是存放在外部、等待检索的信息；记忆被取出并放入模型输入后，才成为当前上下文。

**代表工作：**[**Prime Agent: A Self\-Improving RLM Harness**](https://arxiv.org/abs/2608.23552)

![02\-prime\-agent\-fig1\.png](图片和附件/02-prime-agent-fig1.png)

长程任务的困难不只在于问题本身复杂，还在于任务持续时间可能远远超过一次模型调用。以大型软件开发为例，Agent 可能需要连续工作数小时，其间反复阅读代码、运行测试、记录结果并修改方案。但模型每次能够直接读取的上下文有限：保留全部历史很快就会超出窗口，丢掉历史又会让模型忘记任务进展。

Prime Agent 的做法是在模型之外提供一个可以长期保留的工作台。它使用持久化的 IPython REPL 保存代码、变量、文件和计算结果，模型可以通过程序处理长文本、调用外部资源或执行测试时计算。Continual Harness 则记录任务历史、记忆、Skill、Prompt 和子 Agent 配置。即使任务暂时中断，后台进程仍会保留这个工作现场；任务恢复时，Agent 可以从上次停止的位置继续，而不必重新阅读全部材料。

对于可以拆分的任务，Prime Agent 还允许主 Agent 创建多个子 Agent。子 Agent 分别处理不同问题，并将结果直接返回给主 Agent，从而支持并行探索和结果汇总。

Prime Agent 不更新模型参数。它把任务历史和中间结果保存在外部，模型再次运行时，Harness 再取出当前需要的内容组成上下文。

### 2\.3 记忆进化

记忆进化把经验写入独立的长期存储，并在后续任务中按需检索。系统需要从日志中筛选有价值的信息，将具体经历整理成可复用的经验，并根据新证据修订旧记忆；否则，失败经验和错误归因会持续影响后续任务。

**代表工作：**[**ReasoningBank: Scaling Agent Self\-Evolving with Reasoning Memory**](https://arxiv.org/abs/2509.25140)

![03\-reasoningbank\-fig2\.png](图片和附件/03-reasoningbank-fig2.png)

ReasoningBank 面向持续任务：Agent 在执行任务时可能产生可复用的经验，但传统系统通常在任务结束后丢弃这些信息，下一次又重复相同错误。直接保存整条轨迹也不理想，因为原始轨迹很长，还包含大量琐碎细节。因此，ReasoningBank 将成功和失败轨迹整理成简短、可复用的经验。

新任务到来时，Agent 从记忆库检索相关策略，用它们指导本轮交互；任务结束后，Agent 先判断任务是否完成，再从轨迹中提炼新的经验并写回记忆库。成功轨迹提供有效的做法，失败轨迹则记录应当避免的决策。

作者还提出 memory\-aware test\-time scaling（MaTTS）：让 Agent 针对同一任务进行更多次尝试，获得更丰富的成功和失败样本，再从中提炼出质量更高的记忆。这些记忆又会用于指导后续尝试。

在 WebArena 和 SWE\-Bench Verified 任务上，ReasoningBank 均优于直接保存原始轨迹或只保存成功流程的方法，前者的总体成功率提高了 3\.7—6\.2 个百分点，后者的解决率提高了 3\.4\-4\.0 个百分点。

### 2\.4 Skill 进化

单条记忆记录某次任务中发生了什么，Skill 则总结以后遇到同类问题时应该怎样处理。它可以是一组工具使用规则、行为要求、操作步骤，也可以是一段脚本。Skill 进化就是根据多次任务的成功和失败，持续修改这些可以重复使用的做法。

**代表工作：**[**TRACE: A Self\-Evolving Skill Bank for Consistent, Limit\-Aware LLM Agents**](https://arxiv.org/abs/2608.22793)

![04\-trace\-fig2\.png](图片和附件/04-trace-fig2.png)

TRACE 关注车载助手能否稳定完成任务。在 CAR\-bench 中，模拟用户会提出信息不完整或含糊的请求。Agent 需要先通过多轮对话确认用户意图，再调用工具完成操作，同时遵守车辆领域的安全规则。很多模型偶尔能够完成任务，但重复执行时并不稳定。

TRACE 维护一个由多个 Skill 组成的 Skill Bank。每个 Skill 负责一类具体情况，记录相关的工具使用规则和行为要求。每轮评测结束后，系统收集使用过同一 Skill 的成功和失败轨迹，并比较其中的行为。Agent 可能因为没有问清必要信息、过早执行操作，或者承诺了自身无法完成的事情而失败。系统根据这些问题修改对应的 Skill，成功轨迹则用于补充更合适的处理方法。这样，一类任务出现问题时，只需要修改相关 Skill，不必重写整套 Prompt。

处理新任务时，Agent 会根据当前对话选择合适的 Skill。任务结束后，系统再根据本轮的成功或失败继续修改这些 Skill。在 GPT\-5\.5 上，TRACE 将同一任务连续三次全部成功的比例从 59\.9% 提高到 94\.5%。

### 2\.5 Harness 代码进化

Harness 代码负责组织模型接收到的上下文，并把模型的决策转化为工具调用和任务流程。Skill 通常告诉 Agent 应该怎样做，而 Harness 代码进化还可以改变上下文的构造方式、增删工具或修改执行逻辑。

**代表工作：**[**SkillSmith: Co\-Evolving Skills and Tools for Self\-Improving Agent Systems**](https://arxiv.org/abs/2606.01314)

![05\-skillsmith\-fig2\.png](图片和附件/05-skillsmith-fig2.png)

许多 Skill 进化方法默认工具保持不变。如果任务失败是因为工具能力不足，那么反复修改工具的说明文字也无法解决问题。因此，SkillSmith 允许系统同时修改 Skill 和工具。发现能力缺口后，反思模块会生成一组配套修改：一边调整 Skill，一边编辑、组合、拆分或停用相关工具。

单独测试每个 Skill，还可能忽略多个 Skill 一起使用时的配合和冲突。SkillSmith 会根据执行轨迹记录哪些 Skill 经常互相帮助，哪些 Skill 容易产生干扰。作者借用了生态系统中合作与竞争的思路，用这些关系决定以后优先调用、修改或淘汰哪些组件。

系统还会保存过去的失败模式，包括问题表现、失败原因和修复方法。如果新的修改方案又犯了相同错误，系统可以提前将其排除，避免重复试错。

论文在三个 Benchmark 上，使用五个不同规模的 Qwen3\.5 模型进行评测。任务越复杂、需要同时使用的 Skill 越多，SkillSmith 相对基线的优势越明显。SkillSmith 会直接改动工具及其调用方式，因此要把更新后的 Skill 和工具放在一起测试，避免修好一个组件却破坏另一个。

## 3 RSI 的进化结构：链、树与图

前面讨论了 Agent 的哪些部分会被修改，这一章关注修改产生的新版本如何继承历史结果。每次更新后，系统可以只沿一个版本继续向前，也可以保留多个分支，或者让一个新版本同时利用多个历史来源。不同的组织方式会影响探索范围、评测成本，以及系统从错误更新中恢复的能力。按照新版本与历史版本之间的继承关系，可以将进化结构分为三类：

1. 链式进化沿一条路径依次更新；

2. 树形进化允许历史版本产生多个分支，但每个新版本仍然只有一个直接父代；

3. 图式进化则允许多个任务、版本或谱系的经验在一次更新中汇合。

![codex\-evolution\-topologies\-v1\.png](图片和附件/codex-evolution-topologies-v1.png)

### 3\.1 链

链式进化始终只有一个正在使用的版本。系统在当前版本 $A_t$ 上修改，得到 $A_{t+1}$，下一轮再以 $A_{t+1}$ 为基础继续更新：$A_0\rightarrow A_1\rightarrow A_2\rightarrow\cdots$。这种方式实现简单，不需要维护和选择多个分支；但前一轮留下的错误也会被下一轮直接继承。

**代表工作：**[**SkillFlow: Benchmarking Lifelong Skill Discovery and Evolution for Autonomous Agents**](https://arxiv.org/abs/2604.17308)

![10\-skillflow\-fig1\.png](图片和附件/10-skillflow-fig1.png)

SkillFlow 采用典型的链式更新。每个任务族从一个空的 Skill 库开始。Agent 完成任务后，模型根据执行轨迹和验证反馈生成 Skill patch，用来新增、改写或删除 Skill 和辅助脚本。更新后的 Skill 库直接用于下一项任务，依次形成 $S_0\rightarrow S_1\rightarrow S_2\rightarrow\cdots$。整个过程中始终只有一个当前版本，不会同时产生多个候选分支。

SkillFlow 用这套流程考察 Agent 能否从任务经历中生成 Skill、在失败后修正 Skill，并在连续任务中维护同一个 Skill 库。它包含 20 个任务族、共 166 个可执行任务，覆盖金融、供应链、医疗、治理和数据处理等领域。

同一任务族中的任务采用相似的操作流程，但输入和具体要求不同，难度也逐步提高。Agent 可以在后面的任务中复用已经总结的做法，却不能直接照搬前面任务的答案。

论文使用四种 Agent Harness 测试了 11 个模型。Claude Opus 4\.6 的任务成功率从 62\.65% 提高到 71\.08%，但也有部分配置持平或下降。论文发现，表现较好的配置通常反复修订少量通用 Skill，表现较差的配置则容易不断新增相似 Skill，使 Skill 库越来越碎。错误 Skill 写入后，后续任务也可能继续沿用同样的错误。

### 3\.2 树

树形进化会保留已经产生的多个 Agent 版本。一个版本可以生成多个子版本，后续更新也可以从任意历史版本继续，因此不同的改进方向会逐渐形成分支。暂时表现不好的版本也可以保留下来，其中的某项修改可能成为后续改进的基础。随着分支增多，选择父代和评测新版本所需的时间和计算资源也会增加。

**代表工作：**[**Darwin Gödel Machine: Open\-Ended Evolution of Self\-Improving Agents**](https://arxiv.org/abs/2505.22954)

![10\-dgm\-fig3\.png](图片和附件/10-dgm-fig3.png)



DGM 采用典型的树形进化。系统从一个初始编程 Agent 开始，将此后生成的版本保存在一个集合中。每轮更新时，系统从中选择一个版本作为父代，修改它的提示词、工具或工作流程代码，生成一个子版本。实验中的底层模型保持不变。

被选中的 Agent 会先查看自己的 Benchmark 评测记录，从中提出下一项改进，再把这项改进实现到自己的代码中。例如，它可以增加更细粒度的代码编辑工具，调整长上下文的处理方式，或者加入多次尝试和 peer review 流程。

生成的新版本需要通过基本检查，确保代码能够运行，并且仍然具备编辑代码库的能力；随后，系统使用 SWE\-bench 或 Polyglot 评测其编程能力。通过检查的版本会被保留下来，即使它的得分暂时低于父代。父代和其他历史版本也不会被覆盖，之后仍然可以再次被选中。同一个版本可以产生多个子版本，不同子版本又可以分别继续更新，版本树由此逐步展开。得分较高的版本更容易被选中，但其他版本也有机会继续演化。目前，选择父代和管理版本集合的规则由系统预先设定，不会随 Agent 一起更新。

DGM 的名字来自 Gödel Machine。Gödel Machine 是一种理论上的自修改系统：系统需要先证明某次修改能够提高收益，然后才执行修改。复杂的编程 Agent 很难完成这种形式证明，因此 DGM 直接运行修改后的版本，用 Benchmark 得分检验修改是否有效。

经过持续更新，DGM 的 SWE\-bench 得分从 20\.0% 提高到 50\.0%，Polyglot 得分从 14\.2% 提高到 30\.7%。论文中，一次完整的 SWE\-bench 自进化实验约需两周，Token 消耗也较高。这说明，像 DGM 这样需要持续生成并评测多个分支的树形搜索，通常需要投入更多时间和模型调用预算。

### 3\.3 图

树形进化中的新版本沿一个父代产生，修改依据通常也来自这个父代。图式进化允许一次修改同时参考多个来源，例如同一 Agent 在不同任务上的轨迹，或者另一条分支中 Agent 的执行结果。版本之间的父子关系仍然可以用树保存，但用于更新的信息已经能够跨任务和跨分支流动。

**代表工作：**[**Mendel Gödel Machine: Recursive Self\-Improving Coding Agents via Comparative Evolution**](https://arxiv.org/abs/2608.07645)

![11\-mgm\-fig1\.png](图片和附件/11-mgm-fig1.png)

MGM 延续了 DGM 的版本树，但改变了生成新版本时使用信息的方式。DGM 一般根据某个 Agent 在一项任务中的失败轨迹修改代码。单次失败可能同时受到任务内容、工具使用和工作流程等因素影响，只看这一条轨迹，很难确定真正需要修改的部分。因此，MGM 利用版本集合中已经积累的其他轨迹进行比较。

MGM 保留了根据单条失败轨迹进行修改的方式，称为 **clonal mutation**。除此之外，它增加了两种更新方式。

**Reaction\-norm mutation** 会比较同一个 Agent 在不同任务中的执行轨迹。如果多项任务反复出现相似问题，系统便可以据此判断问题更可能来自 Agent 自身，而非某一道题的特殊情况。修改后的子版本仍然来自这个 Agent，但修改依据来自多项任务。

**Cross\-lineage hybridization** 会比较不同分支的 Agent 在同一任务上的表现。当一个 Agent 失败而另一个 Agent 成功时，成功轨迹可以为失败版本的修改提供参考。如果两个 Agent 都失败，系统也会比较两条轨迹，从中识别互补的失败模式。进行修改时，系统会把两个 Agent 的执行轨迹及结果作为参考，由待修改的 Agent 从对照中提取可复用的做法，再将其加入到自己的代码中。

这两种更新使用版本集合中已有的评测轨迹。跨任务和跨分支的对照可以提供更具体的故障线索，缩小修改时需要排查的范围。

在相同的评测预算下，MGM 在 SWE\-bench Verified 和 Polyglot 上都超过了只使用单条轨迹修改的树式基线。以 Polyglot 为例，Agent 的得分从 50\.8% 提高到 93\.2%，单轨迹（树形）基线达到 77\.9%。不同更新方式的 Token 消耗相近，MGM 演化出的 Harness 在更换编程 Benchmark 或底层模型后也能继续发挥作用。



## 4 谁来更新 Agent：自身、教师与联合更新



RSI 系统既要执行任务，也要根据任务轨迹和反馈完成更新。这两项工作可以由同一个 Agent 承担，也可以交给不同的 Agent。为了方便讨论，本章把执行任务的 Agent 称为 Student，把分析 Student 的任务轨迹并参与修改的另一个 Agent 称为 Teacher。

按照由谁负责完成修改，可以将 RSI 系统分为三类：

1. 在自身更新中，Student 自己总结经验并修改自身；

2. 教师更新中，Student 负责执行任务，具体的更新则由独立的 Teacher 完成；

3. 联合更新则由 Student 和 Teacher 分别承担修改过程中的一部分，例如一方诊断问题、另一方实现修改，或者一方总结经验、另一方整理并写入。具体分工和先后顺序因方法而异。

### 4\.1 自身更新

自身更新中，执行任务和完成修改的是同一个 Student。环境可以提供得分、错误信息或其他反馈，但没有另一个 Agent 负责分析轨迹或编写更新。Student 根据反馈决定保留哪些经验，并修改后续任务会继续使用的记忆、Skill、规则或代码。

![codex\-self\-update\-v1\.png](图片和附件/codex-self-update-v1.png)

它省去了 Agent 之间的信息传递，但 Student 必须自己理解反馈并完成修改。如果 Student 错误理解出错，错误也可能被写入长期产物，并继续影响后面的任务。

### 4\.2 教师更新

教师更新中，执行任务的 Student 不直接修改后续会使用的持久产物，这一步由 Student 之外的 Teacher 完成。Teacher 可以读取示范、任务轨迹、评测结果或已有经验，并据此生成或整理新的记忆、Skill、工具或 Harness 代码。

这里的 Teacher 不一定是一个专门的 Agent，也可能是反思模块、优化器或带有验证规则的更新流程。不同方法中，Teacher 可能负责总结成功经验、分析失败原因，也可能合并、筛选或淘汰已有内容。需要注意的是，只提供分数或验收结果的模块不算 Teacher；Teacher 实际决定写回什么，以及怎样修改。

![codex\-teacher\-update\-v1\.png](图片和附件/codex-teacher-update-v1.png)

**代表工作：**[**Recursive Experiential\-Working Memory Evolution for Long\-Horizon Agent Harnesses**](https://arxiv.org/abs/2608.24876)

![13\-recuris\-fig3\.png](图片和附件/13-recuris-fig3.png)

Recuris 是教师更新的一种具体实现。论文中，Agent 负责执行长程任务；固定的 Meta\-Agent 汇总多个任务中的失败记录，并修改 Agent 后续使用的 Skill Memory。这里的 Agent 可以对应本章的 Student，而 Meta\-Agent 可以对应本章的 Teacher。

执行长程任务时，Agent 既要掌握当前进度，又要调用过去积累的经验。Recuris 用 Working Memory 记录当前目标、已经完成的步骤和下一步计划，用 Experiential Memory 保存可以跨任务复用的经验与 Skill。需要调用 Skill 时，系统根据 Working Memory 中记录的任务进度和未完成目标选择相关 Skill，使 Skill 的选择与当前步骤保持一致。

任务出现问题后，Recuris 根据执行轨迹，将失败与本轮使用的记忆组件关联起来。类似问题在多个任务中反复出现时，Meta\-Agent 会分析这些记录，并对相关 Skill 提出局部修改。候选修改通过验证后才会写入 Skill Memory，Agent 在后续任务中使用更新后的 Skill。整个过程中，执行 Agent 产生轨迹并使用 Skill，Meta\-Agent 分析问题并完成修改。

Recuris 在四个长程 Benchmark 和十种模型上进行了测试。在 37 个模型与 Benchmark 组合中，35 个取得提升，最长任务的得分最多提高了 32\.2 个点。

### 4\.3 联合更新

联合更新中，Student 和 Teacher 都会参与修改，但两者的分工没有固定形式。Student 可以先从任务中总结候选经验，再由 Teacher 筛选和写入；也可以由 Teacher 诊断问题，再由 Student 实现修改。判断联合更新的依据，是两者是否都影响了最终写回的内容。Student 只负责执行任务，或者 Teacher 只负责评分，都不属于联合更新。

![codex\-joint\-update\-v1\.png](图片和附件/codex-joint-update-v1.png)

**代表工作：**[**Evo\-Harness: Context\-to\-Harness Skill Compilation for Self\-Evolving Agents**](https://arxiv.org/abs/2608.15071)

![14\-evo\-harness\-fig3\.png](图片和附件/14-evo-harness-fig3.png)

在 Evo\-Harness 中，Solver 相当于 Student，Evolver 相当于 Teacher。Solver 先总结候选经验，Evolver 再筛选、整理并写入 Harness。Solver 不只负责执行任务，还会根据本次执行过程总结候选经验；Evolver 再检查这些经验，并决定如何修改现有的 Skill Harness。最终写入的内容由两者共同产生。

Evo\-Harness 处理的是连续任务流。Agent 完成一个任务后，会从本次执行中总结经验，再继续处理下一个任务。执行记录中既有可以复用的做法，也包含只与当前任务有关的路径、文件名和具体条件。

任务失败或收到负面反馈后，Solver 根据任务指令、执行轨迹、结果和反馈总结候选经验，并标明它适用的情况和依据。每批任务结束后，Evolver 将候选经验与当前 Harness 对照，决定新增、合并、修改或舍弃，并将其整理成跨任务规则或特定任务类型的操作流程。更新后的 Skill Harness 会用于下一批任务。

论文在多个 Benchmark 上进行了测试，Evo\-Harness 在五个 Benchmark 上都超过了其他经验复用方法。实验中去掉 Solver 生成候选经验的步骤后，效果低于完整方法，说明 Solver 的反思和 Evolver 的整理都对更新有正向作用。



## 5 RSI 的更新时机：离线、在线与混合模式

RSI 还可以按照更新发生的时间分类。即使修改的都是记忆或 Skill，不同方法安排更新的方式也不一样：有的在正式测试前先更新完全，有的在任务流中边执行边更新，还有的先建立一批初始经验，再在实际应用中继续积累。

按照任务执行与经验更新的时间关系，可以将 RSI 分为三种模式：

1. 离线 RSI 在训练任务中完成更新，进入测试阶段后保持不变；

2. 在线 RSI 在处理任务的同时持续更新，前面任务产生的经验会影响后续任务；

3. 混合模式先在离线阶段建立初始版本，上线后再根据新任务继续调整。

![codex\-rsi\-update\-timing\-v1\.png](图片和附件/codex-rsi-update-timing-v1.png)

### 5\.1 离线 RSI

离线 RSI 将更新和测试分成两个阶段。系统先在训练任务中积累经验，进入测试阶段后停止更新，再用没有见过的任务检查这些经验能否复用。训练题和测试题不能完全重复，否则 Agent 可能只是记住了答案；两者分布也不能完全不同，否则无法判断学到的经验是否有用。

**代表工作：**[**GDPevo: Evaluating Agent Self\-Evolution on Real Business Tasks**](https://arxiv.org/abs/2608.03764)

![06\-gdpevo\-fig1\.png](图片和附件/06-gdpevo-fig1.png)

GDPevo 是一套专门评测离线 RSI 的 Benchmark。现有评测通常没有清楚说明训练题与测试题之间有什么联系，因此分数提高后，很难判断 Agent 是学会了复用经验，还是曾经见过相似题目。GDPevo 从 CRM、ERP、金融、医疗、法律和数据处理等真实业务中选取任务，再把每个业务流程拆成更小的规则。

GDPevo 提出了 Rule Hybridization 方法来构造任务。同一批基础规则先以不同组合出现在五个训练任务中，再经过重新组合，形成五个测试任务。Agent 可以在训练阶段接受反馈，并形成记忆或 Skill；进入测试阶段后不再更新。测试任务虽然没有直接出现过，但其中包含训练阶段接触过的规则，因此可以检查 Agent 能否将已有经验用到新的规则组合上。

GDPevo 包含 12 组任务，每组由五个训练任务和五个测试任务组成，共 120 个任务。它还提供了自动生成流程，可以在两天内生成另外 12 组任务。这样可以定期更换测试题，降低题目被模型提前见过的可能性。

作者使用四种 Agent 和四类反馈进行了实验。表现最好的配置在更新前准确率为 50\.63%，更新后达到 67\.07%，提高了 16\.44 个百分点。如果直接提供测试所需的全部规则，准确率可以达到 91\.6%，比当前最佳结果高出 24\.53 个百分点。这个差距说明，现有 Agent 还只能从训练任务中学到部分规则。

### 5\.2 在线 RSI

在线 RSI 把任务排成连续序列。Agent 完成当前任务后，会从执行结果和反馈中整理经验并保留下来；下一项任务开始时，这些经验已经可以使用。任务执行与经验更新交替进行，没有单独划分训练阶段。评测时需要沿任务序列观察表现，才能看出经验是否在后续任务中发挥作用。

**代表工作：**[**FinEvo\-Bench: A Longitudinal Benchmark for Self\-Evolving Agents in Professional Financial Workflows**](https://arxiv.org/abs/2608.06144)

![09\-finevo\-bench\-fig2\.png](图片和附件/09-finevo-bench-fig2.png)

FinEvo\-Bench 是一个面向在线 RSI 的 Benchmark，它将 120 个金融任务组织成一条连续任务流。Agent 完成当前任务后保留经验，并在后续任务中继续使用。Benchmark 覆盖六个领域和 20 个业务场景；每个场景包含六个任务，这些任务采用同一流程，但数据和具体问题不同。

同一场景的六个任务不会连续出现，而是与其他场景的任务交错排列。论文还将任务顺序随机打乱了三次，避免结果只对某一种排列成立。Agent 必须在处理其他任务后，仍能找回此前学到的流程，并用它解决同类的新任务。

每完成一个任务，Agent 都会收到基于评分标准的反馈，并把反思后的有用内容写入记忆、Skill 或操作手册。当前会话随后关闭，但这些经验会保留下来，并在下一项任务中直接使用。整个评测过程没有独立的训练阶段，Agent 一边完成任务，一边更新自己。

为了单独测出这些经验带来的变化，论文为每次实验设置了一个状态重置的对照组。两组使用相同的模型、Agent 框架、任务顺序和评分方式；实验组保留过去的经验，对照组则在每项任务前清空状态。两组分数之差，就是保留经验带来的提升。

论文使用四种以 Qwen3\.7\-Max 为底层模型的 Agent 进行实验。保留经验后，平均得分提高了 9\.33 至 19\.37 分；同一场景中，后三个任务获得的提升比前三个任务高 6\.10 至 8\.70 分，表明随着相关任务增加，先前积累的经验产生了更明显的作用。

### 5\.3 混合模式

混合模式先从示范或训练任务中建立一批初始经验，再在实际使用过程中继续更新。这样，Agent 开始执行任务时已经有可用的经验，遇到新情况后也能继续补充。

**代表工作：**[**Mem²Evolve: Towards Self\-Evolving Agents via Co\-Evolutionary Capability Expansion and Experience Distillation**](https://arxiv.org/abs/2604.10923)

![08\-mem2evolve\-fig2\.png](图片和附件/08-mem2evolve-fig2.png)



Mem²Evolve 先用一部分任务积累初始经验，并建立一批可复用的工具和专家 Agent，再处理其余任务。在后续任务中，Agent 一边调用这些已有内容，一边继续补充新的经验和组件。因此，它既有离线初始化，也会在任务过程中持续更新，属于混合模式。

系统使用两类 Memory 保存这些内容：Experience Memory 保存从成功和失败任务中总结出的经验，Asset Memory 保存可以直接调用的工具和专家 Agent。

新任务到来后，系统先将任务拆成多个子任务，再从 Asset Memory 中寻找合适的组件。找到后直接复用；找不到时，系统会检索相关经验，并结合外部信息创建新的工具或专家 Agent。新工具需要先通过自动生成的单元测试，任务结束后，新经验和通过验证的组件会分别写入两类 Memory，供后续任务使用。

论文在六类任务和八个 Benchmark 上进行了测试。完整系统的平均表现比只积累经验的方法高 11\.80%，比只创建工具或专家 Agent 的方法高 6\.46%。与两类 Memory 均为空的设置相比，经过初始化的系统在所有 Benchmark 上表现都更好。



## 6 RSI 的其他分类维度

前面几章按照进化对象、版本结构、更新者和更新时机梳理了 RSI。阅读具体论文时，还可以从验收标准、反馈来源、反馈类型、更新频率和经验作用范围五个角度进行比较。这些维度需要分别判断，同一种方法也可能在同一维度中采用多种方式。

### 6\.1 验收标准

系统生成修改后，还要依据一定的证据决定是否保留。常见的验收标准包括：

- **产物验证：**通过单元测试、编译、接口检查或其他针对修改对象的直接验证。

- **单题结果：**依据当前任务实例是否成功，或是否获得更高 Reward。

- **Benchmark 得分：**依据一组评测问题上的总体表现。

- **组合指标：**同时考虑表现、成本、速度、稳定性、新颖性或其他目标。

- **无独立验证：**生成后直接写入，不设置单独的验收环节。

### 6\.2 反馈来源

反馈来源描述驱动改进的证据来自哪里。这里记录的是演化过程中实际使用的证据，不只看最终采用了什么测试方式。

- **Benchmark：**直接使用待测 Benchmark 的答案、Verifier 或分数。

- **训练／验证集：**使用与最终测试分离的进化任务或数据划分。

- **环境：**使用状态变化、Observation、原生 Reward 或执行结果。

- **可执行验证器：**使用单元测试、编译器、容器或形式检查器。

- **LLM 反馈：**由 Student、Teacher 或其他模型通过评审、自我批评、自洽性或辩论产生反馈。

- **人工：**使用人工标签、偏好、审核或干预。

### 6\.3 反馈类型

反馈类型关注系统获得的是结果分数，还是包含具体信息的非分数反馈。

- **分数：**用数值或类别评价任务结果。其中，二值反馈只区分成功、失败、通过或未通过；非二值反馈则提供多于两个取值的 Reward、准确率、效用或其他分数。

- **非分数：**提供结果分数之外的具体信息。其中，标准答案包括参考答案、目标状态、预期输出或参考实现；LLM 评审包括语言模型给出的文字判断、解释或批评；其他信息包括 Observation、日志、诊断、责任定位、约束信息或 Agent 生成的批评。

LLM 给出的标量仍属于分数；只有文字判断、解释或批评才归入 LLM 评审。只用于演化 Teacher 的反馈不计入这里。

### 6\.4 更新频率

更新频率表示积累多少 Student 执行过程后，会更新一次持久产物：

- **单步：**在轨迹中的一次动作—Observation 之后更新。

- **事件触发：**在失败、发现能力缺口、收到提示或完成子目标时更新。

- **完整轨迹：**一条完整任务轨迹结束后更新。

- **批次：**积累多条轨迹、多组候选，或完成一轮离线数据收集后统一更新。

这里不记录 Teacher 自身的演化周期；按代更新和对 Student 经验的离线集中整理统一归入批次。

### 6\.5 经验作用范围

经验作用范围描述演化得到的产物可以在哪里使用：

- **通用：**产物可以跨任务类型或跨领域复用。

- **专用：**产物只用于特定实例、任务类型、主题或领域。

如果一个系统同时维护全局产物和任务专用产物，可以同时归入通用和专用。



## 参考资料

1. Prism\-Shadow：[Awesome RSI](https://github.com/Prism-Shadow/awesome-rsi)

2. Zweiger et al\.：[Self\-Adapting Language Models](https://arxiv.org/abs/2506.10943)（2025\-06\-12）

3. Karten et al\.：[Prime Agent: A Self\-Improving RLM Harness](https://arxiv.org/abs/2608.23552)（2026\-08\-24）

4. Ouyang et al\.：[ReasoningBank: Scaling Agent Self\-Evolving with Reasoning Memory](https://arxiv.org/abs/2509.25140)（2025\-09\-29）

5. Wu et al\.：[TRACE: A Self\-Evolving Skill Bank for Consistent, Limit\-Aware LLM Agents](https://arxiv.org/abs/2608.22793)（2026\-08\-24）

6. Wei et al\.：[SkillSmith: Co\-Evolving Skills and Tools for Self\-Improving Agent Systems](https://arxiv.org/abs/2606.01314)（2026\-05\-31）

7. Zhang et al\.：[SkillFlow: Benchmarking Lifelong Skill Discovery and Evolution for Autonomous Agents](https://arxiv.org/abs/2604.17308)（2026\-04\-19）

8. Zhang et al\.：[Darwin Gödel Machine: Open\-Ended Evolution of Self\-Improving Agents](https://arxiv.org/abs/2505.22954)（2025\-05\-29）

9. Liu et al\.：[Mendel Gödel Machine: Recursive Self\-Improving Coding Agents via Comparative Evolution](https://arxiv.org/abs/2608.07645)（2026\-08\-07）

10. Yu et al\.：[Recursive Experiential\-Working Memory Evolution for Long\-Horizon Agent Harnesses](https://arxiv.org/abs/2608.24876)（2026\-08\-25）

11. Wei et al\.：[Evo\-Harness: Context\-to\-Harness Skill Compilation for Self\-Evolving Agents](https://arxiv.org/abs/2608.15071)（2026\-08\-15）

12. Zhou et al\.：[GDPevo: Evaluating Agent Self\-Evolution on Real Business Tasks](https://arxiv.org/abs/2608.03764)（2026\-08\-04）

13. Deng et al\.：[FinEvo\-Bench: A Longitudinal Benchmark for Self\-Evolving Agents in Professional Financial Workflows](https://arxiv.org/abs/2608.06144)（2026\-08\-06）

14. Cheng et al\.：[Mem²Evolve: Towards Self\-Evolving Agents via Co\-Evolutionary Capability Expansion and Experience Distillation](https://arxiv.org/abs/2604.10923)（2026\-04\-13）


