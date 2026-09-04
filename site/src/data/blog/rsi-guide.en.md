# Understanding RSI: A Taxonomy of Self-Evolving Agents

Recursive self-improvement (RSI) has become a recurring theme in recent agent research. Related terms include self-evolution, self-evolving agents, and self-improving systems.

The field is moving quickly, and no single technical recipe has emerged. Some systems update model parameters; others accumulate context or memory, evolve skills, or directly modify tools, control flow, and harness code. This variety makes RSI difficult to capture with a single method or technical path.

This guide draws on the [Awesome RSI repository](https://github.com/Prism-Shadow/awesome-rsi) ([website](https://prism-shadow.github.io/awesome-rsi/)) to organize existing work along several dimensions. The goal is to provide a practical framework for comparing self-evolving systems and placing new work alongside existing approaches.

![An RSI taxonomy](图片和附件/codex-rsi-taxonomy-overview-gpt-en.png)

![RSI works by improvement target and update timing](图片和附件/codex-rsi-artifact-mode-matrix-en.png)

## 1 What Exactly Is RSI?

In this guide, RSI means that an agent uses task trajectories and feedback from its interaction with an environment to update itself, then carries that update into future tasks to improve its performance.

![The basic RSI loop](图片和附件/codex-rsi-loop-en.png)

$A_{t+1}=U(A_t,\tau_t,f_t)$

Here, $A_t$ is the agent used in round $t$, $\tau_t$ is its task trajectory, $f_t$ is the feedback it receives, and $U$ is the update mechanism. $A_t$ includes both the model and its harness. An update may change model parameters or the harness's context, memory, skills, tools, or code. The resulting agent, $A_{t+1}$, is then used on later tasks. The agent does not have to execute $U$ itself; a teacher, meta-agent, or external training procedure may perform the update.

## 2 What RSI Changes: Parameters, Context, Memory, Skills, and Harness Code

A modern agent can be viewed as **Agent = Model + Harness**. The model provides the underlying capabilities for understanding, reasoning, and generation. The harness determines what information the model receives, how experience is stored, which tools it can call, and how tasks are executed. It includes context, memory, skills, tools, and harness code.

Different RSI methods change different parts of this system. Parameter evolution updates the model itself. Context, memory, and skill evolution change information managed by the harness. Tool and harness-code evolution can alter both the agent's available actions and the logic used to execute them.

![Agent anatomy and major improvement targets](图片和附件/codex-agent-anatomy-en.png)

### 2.1 Parameter Evolution

Parameter evolution writes experience back into model weights. Its advantage is that knowledge can be internalized directly by the model without retrieving external material each time. The tradeoff is that updates are expensive, difficult to locate and reverse, and one faulty training update may affect many unrelated tasks.

**Representative work:** [**Self-Adapting Language Models**](https://arxiv.org/abs/2506.10943)

![01\-seal\-fig1\.png](图片和附件/01-seal-fig1.png)

SEAL starts from a simple problem: language models encounter new knowledge and tasks after deployment, but their weights usually stay fixed. SEAL lets the model decide how to train itself. Given new input, the model produces a self-edit alongside its answer. This self-edit may reorganize the source material, generate training examples, set optimization hyperparameters, or call tools for data augmentation and gradient updates.

The system follows the self-edit to run supervised fine-tuning, turning a temporary piece of text into a persistent change in the model's weights. Because the model does not initially know which self-edits will work, SEAL adds an outer reinforcement-learning loop. After applying a self-edit, the system measures the updated model's downstream performance and uses that score to train the model to produce better self-edits.

The authors test SEAL on knowledge incorporation and few-shot learning. A self-edit can specify the training data, its organization, and the training configuration. Each candidate must still be executed through fine-tuning and evaluated on downstream tasks, so exploring many self-edits remains computationally expensive.



### 2.2 Context Evolution

Context is the material the model can read during its current inference: task requirements, conversation history, the current plan, prompts, rules, and selected external information. Context evolution reorganizes this material for the next inference. A system might remove irrelevant details, compress a long history, add lessons from failures, or rewrite the current plan.

Memory sits outside the active context until the system retrieves it. Once retrieved and inserted into the model input, it becomes part of the current context.

**Representative work:** [**Prime Agent: A Self-Improving RLM Harness**](https://arxiv.org/abs/2608.23552)

![02\-prime\-agent\-fig1\.png](图片和附件/02-prime-agent-fig1.png)

Long-horizon tasks may last far beyond a single model call. In a large software project, for example, an agent may work for hours, repeatedly reading code, running tests, recording results, and revising its plan. The model cannot keep the entire history in its active context, but discarding that history would erase its progress.

Prime Agent gives the model an external workspace that persists across calls. A persistent IPython REPL retains code, variables, files, and computation results, allowing the model to process long texts, access external resources, and perform test-time computation. The Continual Harness preserves task history, memory, skills, prompts, and subagent configurations. If work is interrupted, background processes keep the workspace alive so the agent can resume without rereading everything.

Prime Agent can also split a task across several subagents. Each subagent handles a separate problem and sends its result back to the main agent, enabling parallel exploration and result aggregation.

Prime Agent leaves model parameters unchanged. Instead, it stores task history and intermediate results outside the model, then retrieves the material needed for the next call and assembles it into context.

### 2.3 Memory Evolution

Memory evolution stores experience outside the active context and retrieves it when needed on later tasks. The system must decide what to keep, turn specific events into reusable lessons, and revise old memories when new evidence appears. Otherwise, failed attempts and incorrect explanations can keep affecting future work.

**Representative work:** [**ReasoningBank: Scaling Agent Self-Evolving with Reasoning Memory**](https://arxiv.org/abs/2509.25140)

![03\-reasoningbank\-fig2\.png](图片和附件/03-reasoningbank-fig2.png)

ReasoningBank is designed for a continuing stream of tasks. An agent may discover a useful approach while solving one task, only to lose it when the task ends and repeat the same mistake later. Keeping the whole trajectory is not a good solution either: raw trajectories are long and full of incidental details. ReasoningBank instead condenses successful and failed trajectories into short, reusable memories.

For a new task, the agent retrieves relevant entries from the memory bank and uses them to guide its actions. When the task ends, it determines whether the attempt succeeded, extracts new experience from the trajectory, and writes that experience back. Successful trajectories contribute useful approaches; failed trajectories record decisions to avoid.

The authors also propose memory-aware test-time scaling (MaTTS). The agent attempts the same task several times, producing a richer mix of successes and failures from which it can distill better memories. Those memories then guide later attempts.

On WebArena, ReasoningBank improves overall success rate by 3.7–6.2 percentage points over methods that store raw trajectories or only successful procedures. On SWE-Bench Verified, it improves the solution rate by 3.4–4.0 points.

### 2.4 Skill Evolution

A memory records what happened in a particular task. A skill captures what to do when a similar problem appears again. It may take the form of tool-use rules, behavioral constraints, an operating procedure, or a script. Skill evolution revises these reusable practices as the system accumulates successes and failures.

**Representative work:** [**TRACE: A Self-Evolving Skill Bank for Consistent, Limit-Aware LLM Agents**](https://arxiv.org/abs/2608.22793)

![04\-trace\-fig2\.png](图片和附件/04-trace-fig2.png)

TRACE studies the reliability of in-vehicle assistants. In CAR-bench, simulated users make incomplete or ambiguous requests. The agent must clarify the user's intent through multi-turn dialogue, call the appropriate tools, and follow automotive safety rules. Many models can complete a task occasionally but fail to do so consistently across repeated runs.

TRACE maintains a Skill Bank in which each skill covers a particular situation and records the relevant tool-use rules and behavioral requirements. After an evaluation round, the system groups successful and failed trajectories by the skills they used and compares their behavior. Failures may come from missing a necessary clarification, acting too early, or promising an unsupported operation. The system then revises the relevant skill, using successful trajectories as examples of better behavior, without rewriting a single global prompt.

For each new task, the agent selects skills based on the current dialogue. The outcome is then used in the next update round. With GPT-5.5, TRACE raises the proportion of tasks completed successfully in all three consecutive attempts from 59.9% to 94.5%.

### 2.5 Harness-Code Evolution

Harness code assembles the model's context and turns its decisions into tool calls and task workflows. Skills usually describe how the agent should act. Harness-code evolution can go further by changing how context is assembled, adding or removing tools, and revising execution logic.

**Representative work:** [**SkillSmith: Co-Evolving Skills and Tools for Self-Improving Agent Systems**](https://arxiv.org/abs/2606.01314)

![05\-skillsmith\-fig2\.png](图片和附件/05-skillsmith-fig2.png)

Many skill-evolution methods assume a fixed tool set. If a task fails because a tool lacks the required capability, rewriting instructions will not solve the problem. SkillSmith can modify both skills and tools. When its reflection module finds a capability gap, it proposes a coordinated change that may revise a skill and edit, combine, split, or retire the relevant tools.

Testing skills one at a time can miss conflicts that appear when several are used together. SkillSmith estimates which skills complement one another and which tend to interfere, based on their execution trajectories. An ecosystem-inspired utility model uses these relationships to influence retrieval, modification, and retirement.

The system also records past failure patterns, their likely causes, and the corresponding repairs. It can reject a new proposal that repeats a known error before running the same failed experiment again.

The paper evaluates five Qwen3.5 model sizes on three benchmarks. SkillSmith's advantage grows on more complex tasks that activate several skills at once. Because it changes both tools and their invocation, skills and tools must be validated together: a local repair can otherwise break another component.

## 3 Evolution Topologies: Chains, Trees, and Graphs

The previous section covered what an agent can change. This section looks at how each new version relates to its history. A system may continue along one path, preserve several branches, or let a new version draw on multiple historical sources. These choices affect how broadly the system can explore, how much evaluation it requires, and how easily it can recover from a harmful update. The three main topologies are:

1. Chain evolution updates versions one after another along a single path;

2. Tree evolution allows historical versions to produce multiple branches, while each new version still has only one direct parent;

3. Graph evolution allows experience from multiple tasks, versions, or lineages to converge in one update.

![Chain, tree, and graph evolution topologies](图片和附件/codex-evolution-topologies-en.png)

### 3.1 Chain

Chain evolution maintains one active version. The system modifies $A_t$ to obtain $A_{t+1}$, then uses $A_{t+1}$ as the basis for the next update: $A_0\rightarrow A_1\rightarrow A_2\rightarrow\cdots$. It does not need to maintain or select among multiple branches, but each version also inherits problems left by the previous one.

**Representative work:** [**SkillFlow: Benchmarking Lifelong Skill Discovery and Evolution for Autonomous Agents**](https://arxiv.org/abs/2604.17308)

![10\-skillflow\-fig1\.png](图片和附件/10-skillflow-fig1.png)

SkillFlow follows a chain. Each task family starts with an empty skill library. After the agent completes a task, the model generates a skill patch from the execution trajectory and verification feedback. The patch may add, revise, or delete skills and helper scripts. The updated library is used directly on the next task, forming $S_0\rightarrow S_1\rightarrow S_2\rightarrow\cdots$. At every step, there is only one current version and no parallel candidate branches.

The benchmark tests whether an agent can derive skills from experience, repair them after failures, and maintain one skill library across a task sequence. It contains 20 task families and 166 executable tasks spanning finance, supply chains, healthcare, governance, and data processing.

Tasks in the same family share an operating procedure but use different inputs and requirements, with difficulty increasing over time. The agent can reuse earlier practices without copying earlier answers.

The paper evaluates 11 models with four agent harnesses. With Claude Opus 4.6, continual skill updates raise task success from 62.65% to 71.08%, although some configurations remain flat or decline. Stronger configurations tend to revise a small set of general skills; weaker ones keep adding similar entries and fragment the library. An incorrect skill can therefore continue down the chain until a later patch repairs it.

### 3.2 Tree

Tree evolution preserves multiple agent versions. One version may produce several children, and later updates may resume from any saved version, creating separate lines of improvement. A temporarily weak version can remain in the tree if one of its changes may prove useful later. More branches, however, require more parent selection and evaluation.

**Representative work:** [**Darwin Gödel Machine: Open-Ended Evolution of Self-Improving Agents**](https://arxiv.org/abs/2505.22954)

![10\-dgm\-fig3\.png](图片和附件/10-dgm-fig3.png)



DGM builds a tree of coding-agent versions. Starting from one initial agent, it saves every version it creates. Each round selects a saved version as the parent, then modifies its prompt, tools, or workflow code to produce a child. The underlying model stays fixed.

The selected agent examines its benchmark results, proposes an improvement, and implements the change in its own code. It might add a finer-grained code-editing tool, change how it handles long contexts, or introduce repeated attempts and peer review.

A new version must pass basic checks showing that its code runs and can still edit a codebase. It is then evaluated on SWE-bench or Polyglot. Passing versions remain in the collection even when they score below their parents, and historical versions may be selected again later. A parent can produce several children, which can in turn evolve separately. Higher-scoring versions are selected more often, but lower-scoring branches are not immediately discarded. Parent selection and collection management still follow fixed rules rather than evolving with the agent.

DGM takes its name from the Gödel Machine, a theoretical self-modifying system that applies a change only after proving that it will improve utility. Such proofs are impractical for a complex coding agent, so DGM runs each modified version and measures it on benchmarks instead.

Over the course of evolution, DGM raises its SWE-bench score from 20.0% to 50.0% and its Polyglot score from 14.2% to 30.7%. A complete SWE-bench evolution run takes about two weeks and consumes many tokens. DGM shows the cost of this form of tree search: every additional branch must be generated and evaluated.

### 3.3 Graph

In a tree, each new version has one parent and usually draws its update evidence from that parent. Graph evolution lets one update use several sources—for example, trajectories from the same agent on different tasks or results from another branch. The stored parent-child links may still look like a tree, while update information flows across tasks and branches.

**Representative work:** [**Mendel Gödel Machine: Recursive Self-Improving Coding Agents via Comparative Evolution**](https://arxiv.org/abs/2608.07645)

![11\-mgm\-fig1\.png](图片和附件/11-mgm-fig1.png)

MGM keeps DGM's version tree but changes the evidence used to produce a child. DGM generally modifies code from one failed trajectory on one task. Because that failure may involve the task, tool use, and workflow at the same time, a single trajectory often does not reveal what needs to change. MGM compares it with other trajectories already stored in the version collection.

The original single-trajectory update remains as **clonal mutation**. MGM adds two comparison-based alternatives.

**Reaction-norm mutation** compares the same agent's trajectories across different tasks. A problem that recurs on several tasks is more likely to come from the agent than from an edge case in one task. The child still descends from that agent, but its update draws on evidence from several tasks.

**Cross-lineage hybridization** compares agents from different branches on the same task. If one fails and the other succeeds, the successful trajectory can guide the failing version. If both fail, their differences can still expose complementary failure modes. The agent being modified receives both trajectories and outcomes, extracts useful behavior from the comparison, and implements it in its own code.

Both methods reuse evaluation trajectories already present in the version collection. Cross-task and cross-branch comparisons narrow the set of likely causes and make the resulting edits more targeted.

Under the same evaluation budget, MGM outperforms a single-trajectory tree baseline on both SWE-bench Verified and Polyglot. On Polyglot, the score rises from 50.8% to 93.2%, compared with 77.9% for the tree baseline. The update methods use similar numbers of tokens, and the evolved harness is also tested on other programming benchmarks and underlying models.



## 4 Who Updates the Agent: Self, Teacher, and Joint Updates



An RSI system must perform tasks and turn task trajectories and feedback into updates. The same agent may do both jobs, or an external updater may handle part or all of the second. This section calls the task-performing agent the student and the external participant in the update the teacher. A teacher may be another agent, a reflection module, or an optimization process.

Based on who carries out the modification, RSI systems can be divided into three categories:

1. In self-update, the student summarizes experience and modifies itself;

2. In teacher update, the student performs tasks while an independent teacher carries out the update;

3. In joint update, the student and teacher each shape part of the modification. One may diagnose a problem while the other implements the change, or one may summarize experience while the other organizes and writes it back. The order and division of labor vary across methods.

### 4.1 Self-Update

In self-update, the student both performs the task and makes the modification. The environment may provide scores, errors, or other feedback, but no separate updater interprets the trajectory or writes the result. The student decides what to retain and changes the memory, skills, rules, or code used in future tasks.

![Self-update](图片和附件/codex-self-update-en.png)

No update information needs to pass between separate agents, but the student must interpret the feedback and implement the change on its own. A mistaken diagnosis may therefore be written into a persistent artifact and affect later tasks.

### 4.2 Teacher Update

In teacher update, the student performs the task but does not directly modify the persistent artifact used later. An external teacher reads demonstrations, task trajectories, evaluation results, or prior experience, then generates or reorganizes memories, skills, tools, or harness code.

Depending on the method, the teacher may summarize successful experience, diagnose failures, or merge, filter, and retire existing content. Supplying only a score or an acceptance result is not enough: the teacher must help decide what is written back or how it changes.

![Teacher update](图片和附件/codex-teacher-update-en.png)

**Representative work:** [**Recursive Experiential-Working Memory Evolution for Long-Horizon Agent Harnesses**](https://arxiv.org/abs/2608.24876)

![13\-recuris\-fig3\.png](图片和附件/13-recuris-fig3.png)

Recuris separates task execution from skill updates. An agent performs long-horizon tasks, while a fixed Meta-Agent collects failure records across tasks and modifies the Skill Memory used on future tasks. In this section's terminology, the task agent is the student and the Meta-Agent is the teacher.

During a long-horizon task, the agent must track current progress while drawing on earlier experience. Recuris uses Working Memory for the current objective, completed steps, and next plan; Experiential Memory stores experience and skills that can be reused across tasks. The system selects skills according to the progress and unfinished objectives in Working Memory, so retrieval stays aligned with the current step.

When a task goes wrong, Recuris links the failure to the memory components used in that run. If similar problems recur across tasks, the Meta-Agent analyzes the records and proposes a local change to the relevant skill. Only validated changes enter Skill Memory, after which the agent uses the revised skill on later tasks. The task agent produces the evidence; the Meta-Agent diagnoses the problem and writes the update.

Across four long-horizon benchmarks and ten models, Recuris improves 35 of 37 completed model–benchmark combinations. The largest gain on the longest tasks is 32.2 points.

### 4.3 Joint Update

In joint update, both the student and teacher shape the modification, but their roles are not fixed. The student may summarize candidate experience for the teacher to filter and write back; alternatively, the teacher may diagnose a problem for the student to implement. It counts as joint only when both sides affect the content of the update. Merely performing tasks or assigning scores is not enough.

![Joint update](图片和附件/codex-joint-update-en.png)

**Representative work:** [**Evo-Harness: Context-to-Harness Skill Compilation for Self-Evolving Agents**](https://arxiv.org/abs/2608.15071)

![14\-evo\-harness\-fig3\.png](图片和附件/14-evo-harness-fig3.png)

Evo-Harness divides the update between a Solver and an Evolver. The Solver performs each task and extracts candidate experience from the run. The Evolver reviews those candidates, decides how the existing skill harness should change, and writes the result back. In this section's terminology, the Solver is the student and the Evolver is the teacher.

Evo-Harness operates over a continual task stream in which each task may provide only one useful execution record. A record can contain reusable practices alongside paths, filenames, and conditions specific to that task.

When a task fails or receives negative feedback, the Solver extracts candidate experience from the instruction, trajectory, outcome, and feedback. It also records when the experience applies and what evidence supports it. At the end of a task batch, the Evolver compares these candidates with the current harness and decides what to add, merge, revise, or discard. The retained material becomes cross-task rules or procedures for a particular task type, and the updated skill harness is used on the next batch.

Evo-Harness outperforms other experience-reuse methods on all five evaluated benchmarks. Removing the Solver's candidate-extraction step lowers performance, showing that the update depends on both the Solver's reflection and the Evolver's organization.



## 5 Update Timing: Offline, Online, and Hybrid RSI

Two systems may update the same artifact but at different times. One may finish evolving before final testing, another may update throughout a task stream, and a third may start with offline experience and keep learning during deployment.

This gives three update modes:

1. Offline RSI completes updates on training tasks and remains fixed during testing;

2. Online RSI continually updates while handling tasks, so experience from earlier tasks affects later ones;

3. Hybrid RSI builds an initial version offline, then continues adapting after deployment.

![Offline, online, and hybrid RSI](图片和附件/codex-rsi-update-timing-en.png)

### 5.1 Offline RSI

Offline RSI separates evolution from final testing. The system first accumulates experience on training tasks, then freezes its updates and evaluates on unseen tasks. If training and test tasks are identical, the agent may simply memorize answers; if they are unrelated, the test says little about whether its experience can transfer.

**Representative work:** [**GDPevo: Evaluating Agent Self-Evolution on Real Business Tasks**](https://arxiv.org/abs/2608.03764)

![06\-gdpevo\-fig1\.png](图片和附件/06-gdpevo-fig1.png)

GDPevo evaluates whether offline evolution transfers to unseen tasks. Many benchmarks leave the relationship between training and test tasks unclear, making it difficult to separate genuine transfer from prior exposure to similar questions. GDPevo starts from business workflows in CRM, ERP, finance, healthcare, law, and data processing, then breaks each workflow into smaller rules.

Its task-construction method, Rule Hybridization, places the same basic rules in different combinations across five training tasks and recombines them into five test tasks. The agent may receive feedback and build memories or skills during training, but it stops updating once testing begins. The test tasks are new, while some of their component rules are familiar, so the benchmark can measure whether the agent recombines prior knowledge rather than recalls an answer.

GDPevo contains 12 groups of five training and five test tasks, for 120 tasks in total. An automated pipeline can generate another 12 groups within two days, making it easier to refresh the test set and reduce prior exposure.

Across four agents and four feedback types, the best configuration improves from 50.63% accuracy before evolution to 67.07% afterward, a gain of 16.44 points. Supplying all required test rules directly raises accuracy to 91.6%, leaving a 24.53-point gap. Current agents therefore recover only part of the reusable information available during training.

### 5.2 Online RSI

Online RSI interleaves task execution and updates. After each task, the agent retains experience from its result and feedback; that experience is available on the next task. There is no separate training phase, so improvement must be measured along the task sequence.

**Representative work:** [**FinEvo-Bench: A Longitudinal Benchmark for Self-Evolving Agents in Professional Financial Workflows**](https://arxiv.org/abs/2608.06144)

![09\-finevo\-bench\-fig2\.png](图片和附件/09-finevo-bench-fig2.png)

FinEvo-Bench places 120 financial tasks in one continual stream. Experience from each completed task remains available on later tasks, making the benchmark an online RSI setting. It covers six domains and 20 business scenarios; each scenario contains six tasks that share a procedure but use different data and questions.

Tasks from the same scenario are interleaved with other scenarios rather than placed together. The authors also test three randomized task orders. The agent must recover a procedure learned earlier and apply it to a related task after handling unrelated work in between.

After each task, the agent receives rubric-based feedback and writes useful lessons into memory, skills, or an operating manual. The session then closes, but the saved experience remains available to the next session. The agent is evaluated while it evolves rather than in a separate test phase.

Each experiment includes a state-reset control. Both groups use the same model, agent framework, task order, and scoring procedure; one retains earlier experience, while the other clears it before every task. Their score difference isolates the value of retained experience.

Across four agents built on Qwen3.7-Max, retaining experience raises average scores by 9.33 to 19.37 points. Within each scenario, the gain on the final three tasks exceeds the gain on the first three by 6.10 to 8.70 points, showing a larger benefit after more related experience has accumulated.

### 5.3 Hybrid RSI

Hybrid RSI begins with experience collected from demonstrations or training tasks, then continues updating during deployment. The agent starts with useful prior knowledge without giving up the ability to adapt to new situations.

**Representative work:** [**Mem²Evolve: Towards Self-Evolving Agents via Co-Evolutionary Capability Expansion and Experience Distillation**](https://arxiv.org/abs/2604.10923)

![08\-mem2evolve\-fig2\.png](图片和附件/08-mem2evolve-fig2.png)



Mem²Evolve first uses part of the task set to build initial experience, reusable tools, and expert agents. It then processes the remaining tasks while continuing to add new experience and components. This connects offline initialization with online updates in one pipeline.

The system stores these resources in two places. Experience Memory holds lessons from successful and failed tasks; Asset Memory holds tools and expert agents that can be invoked directly.

For a new task, the system first decomposes the problem and searches Asset Memory for suitable components. It reuses an existing component when possible; otherwise, it retrieves related experience and combines it with external information to create a new tool or expert agent. New tools must pass automatically generated unit tests. After the task, new experience and validated components are written back for future use.

Across six task categories and eight benchmarks, the complete system performs 11.80% better on average than a method that only accumulates experience and 6.46% better than one that only creates tools or expert agents. Initializing both memory stores also improves performance on every benchmark compared with starting from empty stores.



## 6 Other Classification Dimensions

The previous sections classified RSI by what changes, how versions relate, who performs the update, and when it happens. Five additional dimensions help distinguish individual methods: acceptance criteria, feedback source, feedback type, update frequency, and experience scope. A method may occupy more than one category within the same dimension.

### 6.1 Acceptance Criteria

After producing a modification, a system needs evidence to decide whether to keep it. Common acceptance criteria include:

- **Artifact validation:** Unit tests, compilation, interface checks, or other direct validation of the modified artifact.

- **Instance result:** Whether the current task instance succeeds or receives a higher reward.

- **Benchmark score:** Overall performance across a set of evaluation problems.

- **Combined metrics:** A combination of performance, cost, speed, stability, novelty, or other objectives.

- **No independent validation:** The modification is written back immediately after generation without a separate acceptance step.

### 6.2 Feedback Source

Feedback source describes where the evidence driving improvement comes from. It records the evidence actually used during evolution, not merely the testing method used for the final evaluation.

- **Benchmark:** Answers, verifiers, or scores taken directly from the benchmark under evaluation.

- **Train/dev set:** Evolution tasks or data splits kept separate from the final test set.

- **Environment:** State changes, observations, native rewards, or execution outcomes.

- **Executable verifier:** Unit tests, compilers, containers, or formal checkers.

- **LLM feedback:** Reviews, self-critique, self-consistency, or debate produced by the student, teacher, or another model.

- **Human:** Human labels, preferences, review, or intervention.

### 6.3 Feedback Type

Feedback type distinguishes outcome scores from non-score feedback containing concrete information.

- **Score:** A numerical value or category that evaluates the task outcome. Binary feedback distinguishes only success from failure or pass from fail. Non-binary feedback provides a reward, accuracy, utility, or another score with more than two possible values.

- **Non-score:** Concrete information beyond an outcome score. Ground truth includes a reference answer, target state, expected output, or reference implementation. LLM review includes textual judgments, explanations, or critiques produced by a language model. Other information includes observations, logs, diagnostics, causal attribution, constraints, or critiques produced by an agent.

A scalar produced by an LLM still counts as a score. Only textual judgments, explanations, or critiques count as LLM review. Feedback used solely to evolve the teacher is not counted here.

### 6.4 Update Frequency

Update frequency indicates how much student execution accumulates before a persistent artifact is updated:

- **Step:** After one action–observation pair within a trajectory.

- **Event-triggered:** Upon failure, discovery of a capability gap, receipt of a hint, or completion of a subgoal.

- **Trajectory:** After one complete task trajectory.

- **Batch:** After accumulating multiple trajectories or candidate sets, or completing a round of offline data collection.

This dimension does not record the teacher's own evolution cycle. Updates performed once per generation and offline aggregation of student experience are both categorized as Batch.

### 6.5 Experience Scope

Experience scope describes where an evolved artifact can be used:

- **General:** The artifact can be reused across task types or domains.

- **Specialized:** The artifact is restricted to a particular instance, task type, topic, or domain.

If a system maintains both global artifacts and task-specific artifacts, it may be categorized as both General and Specialized.



## References

1. Prism-Shadow: [Awesome RSI](https://github.com/Prism-Shadow/awesome-rsi)

2. Zweiger et al.: [Self-Adapting Language Models](https://arxiv.org/abs/2506.10943) (2025-06-12)

3. Karten et al.: [Prime Agent: A Self-Improving RLM Harness](https://arxiv.org/abs/2608.23552) (2026-08-24)

4. Ouyang et al.: [ReasoningBank: Scaling Agent Self-Evolving with Reasoning Memory](https://arxiv.org/abs/2509.25140) (2025-09-29)

5. Wu et al.: [TRACE: A Self-Evolving Skill Bank for Consistent, Limit-Aware LLM Agents](https://arxiv.org/abs/2608.22793) (2026-08-24)

6. Wei et al.: [SkillSmith: Co-Evolving Skills and Tools for Self-Improving Agent Systems](https://arxiv.org/abs/2606.01314) (2026-05-31)

7. Zhang et al.: [SkillFlow: Benchmarking Lifelong Skill Discovery and Evolution for Autonomous Agents](https://arxiv.org/abs/2604.17308) (2026-04-19)

8. Zhang et al.: [Darwin Gödel Machine: Open-Ended Evolution of Self-Improving Agents](https://arxiv.org/abs/2505.22954) (2025-05-29)

9. Liu et al.: [Mendel Gödel Machine: Recursive Self-Improving Coding Agents via Comparative Evolution](https://arxiv.org/abs/2608.07645) (2026-08-07)

10. Yu et al.: [Recursive Experiential-Working Memory Evolution for Long-Horizon Agent Harnesses](https://arxiv.org/abs/2608.24876) (2026-08-25)

11. Wei et al.: [Evo-Harness: Context-to-Harness Skill Compilation for Self-Evolving Agents](https://arxiv.org/abs/2608.15071) (2026-08-15)

12. Zhou et al.: [GDPevo: Evaluating Agent Self-Evolution on Real Business Tasks](https://arxiv.org/abs/2608.03764) (2026-08-04)

13. Deng et al.: [FinEvo-Bench: A Longitudinal Benchmark for Self-Evolving Agents in Professional Financial Workflows](https://arxiv.org/abs/2608.06144) (2026-08-06)

14. Cheng et al.: [Mem²Evolve: Towards Self-Evolving Agents via Co-Evolutionary Capability Expansion and Experience Distillation](https://arxiv.org/abs/2604.10923) (2026-04-13)
