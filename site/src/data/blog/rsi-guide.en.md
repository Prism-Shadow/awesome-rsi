# A Comprehensive Guide to RSI (Self-Evolution, Self-Evolving Agents)

RSI (Recursive Self-Improvement) has recently attracted considerable attention. Closely related terms include self-evolution, Self-Evolving, and Self-Improving.

The field is still developing rapidly and has yet to converge on a single technical paradigm. Existing work differs widely in both what it improves and how: some methods update model parameters, some accumulate context or memory, some evolve Skills, and others directly modify tools, control flows, or Harness code. RSI is therefore difficult to describe through any single method or technical path.

Drawing on the [Awesome RSI repository](https://github.com/Prism-Shadow/awesome-rsi) ([website](https://prism-shadow.github.io/awesome-rsi/)), this article organizes existing RSI work from a taxonomic perspective. We compare the connections and differences among self-evolving systems across several dimensions. By the end, you should have a clearer understanding of RSI and a framework for analyzing it: when you encounter a new self-evolving system, you will be able to quickly identify how it relates to and differs from existing work.

![An RSI taxonomy](图片和附件/codex-rsi-taxonomy-overview-gpt-en.png)

![RSI works by improvement target and update timing](图片和附件/codex-rsi-artifact-mode-matrix-en.png)

## 1 What Exactly Is RSI?

This article defines RSI as follows: after interacting with an environment, an Agent uses task trajectories and feedback to modify its own state through an update mechanism, and the updated state then participates in later tasks to improve future performance.

![The basic RSI loop](图片和附件/codex-rsi-loop-en.png)

$A_{t+1}=U(A_t,\tau_t,f_t)$

Here, $A_t$ denotes the Agent used in round $t$, $\tau_t$ is the trajectory it produces while performing the task, $f_t$ is the feedback it receives, and $U$ is the update mechanism. $A_t$ consists of the Model and the Harness. Updates may affect model parameters or the Harness's context, memory, Skills, tools, or code. The updated $A_{t+1}$ then participates in subsequent tasks. $U$ does not have to be executed by the Agent itself; it may instead be carried out by a Teacher, a Meta-Agent, or an external training procedure.

## 2 RSI artifact: Parameters, Context, Memory, Skills, and Harness Code

A modern intelligent agent can be abstracted as **Agent = Model + Harness**. The Model provides the basic capabilities for understanding, reasoning, and generation. The Harness organizes how the model receives information, accumulates experience, calls tools, and completes tasks; it includes context, memory, Skills, tools, and Harness code.

Different RSI methods may modify different parts of this system. Parameter evolution changes the Model. Context, memory, and Skill evolution modify persistent state within the Harness. Tool and Harness-code evolution changes the Agent's action space and control flow.

![Agent anatomy and major improvement targets](图片和附件/codex-agent-anatomy-en.png)

### 2.1 Parameter Evolution

Parameter evolution writes experience back into model weights. Its advantage is that knowledge can be internalized directly by the model without retrieving external material each time. The tradeoff is that updates are expensive, difficult to locate and reverse, and one faulty training update may affect many unrelated tasks.

**Representative work:** [**Self-Adapting Language Models**](https://arxiv.org/abs/2506.10943)

![01\-seal\-fig1\.png](图片和附件/01-seal-fig1.png)

SEAL begins from the observation that language models continually encounter new knowledge and tasks after deployment, while their weights usually remain fixed. The authors want a model to decide for itself "how it should train itself," without relying on a separate adaptation network. When presented with new input, the model therefore generates not only an answer but also a self-edit. A self-edit is a self-update plan that may reorganize the original information, generate training examples, specify optimization hyperparameters, or call tools for data augmentation and gradient updates.

The system then performs supervised fine-tuning according to the self-edit. After SFT, the experience changes from temporary text into a persistent weight update. The model initially does not know which self-edits are genuinely useful, so SEAL adds an outer reinforcement-learning loop: after a self-edit is applied, the updated model's downstream performance is measured again. That result becomes a reward used to train the model to generate more useful self-edits in the future.

The authors evaluate SEAL on knowledge incorporation and few-shot learning tasks. The model's self-edits can specify not only training data, but also how that data should be organized and how training should be configured. The system actually updates the model according to each self-edit and then selects more effective plans based on the updated model's downstream score. As a result, fine-tuning and evaluating candidate self-edits still incur substantial computational cost.



### 2.2 Context Evolution

Context can be understood as the material directly visible to the model during the current inference, including task requirements, conversation history, the current plan, Prompts, rules, and organized external information. Context evolution reorganizes this material according to task outcomes so that the model sees more useful information during its next inference. A system may, for example, remove irrelevant information, compress an overlong history, add lessons from failures, or rewrite the current plan.

The distinction between context and memory is that memory is information stored externally and waiting to be retrieved. Only after a memory is retrieved and inserted into the model input does it become part of the current context.

**Representative work:** [**Prime Agent: A Self-Improving RLM Harness**](https://arxiv.org/abs/2608.23552)

![02\-prime\-agent\-fig1\.png](图片和附件/02-prime-agent-fig1.png)

Long-horizon tasks are difficult not only because the problems themselves are complex, but also because they may continue far beyond a single model call. In large-scale software development, for example, an Agent may work for hours, repeatedly reading code, running tests, recording results, and revising its plan. Yet the context that a model can read directly on each call is limited: retaining the entire history soon exceeds the context window, while discarding it causes the model to forget its progress.

Prime Agent addresses this problem by giving the model an external workspace that can persist over time. It uses a persistent IPython REPL to retain code, variables, files, and computational results. The model can use programs to process long texts, access external resources, or perform test-time computation. The Continual Harness records task history, memory, Skills, Prompts, and sub-Agent configurations. Even if the task is temporarily interrupted, background processes preserve the workspace. When work resumes, the Agent can continue from where it stopped without rereading everything.

For tasks that can be decomposed, Prime Agent also lets the main Agent create multiple sub-Agents. These sub-Agents handle separate problems and return their results directly to the main Agent, supporting parallel exploration and result aggregation.

Prime Agent does not update model parameters. It stores task history and intermediate results externally. When the model runs again, the Harness retrieves the material currently needed and assembles it into context.

### 2.3 Memory Evolution

Memory evolution writes experience into a separate long-term store and retrieves it as needed for later tasks. The system must select valuable information from its logs, turn specific experiences into reusable lessons, and revise old memories in light of new evidence. Otherwise, failed experiences and incorrect causal attributions may continue to affect future tasks.

**Representative work:** [**ReasoningBank: Scaling Agent Self-Evolving with Reasoning Memory**](https://arxiv.org/abs/2509.25140)

![03\-reasoningbank\-fig2\.png](图片和附件/03-reasoningbank-fig2.png)

ReasoningBank targets continual tasks. An Agent may produce reusable experience while completing a task, but traditional systems usually discard this information afterward and then repeat the same mistakes on the next task. Saving an entire trajectory is also unsatisfactory because raw trajectories are long and contain many incidental details. ReasoningBank therefore turns successful and failed trajectories into concise, reusable experiences.

When a new task arrives, the Agent retrieves relevant strategies from the memory bank to guide the current interaction. After the task ends, the Agent first determines whether the task was completed, then extracts new experience from the trajectory and writes it back to the memory bank. Successful trajectories provide effective approaches, while failed trajectories record decisions that should be avoided.

The authors also propose memory-aware test-time scaling (MaTTS): the Agent makes more attempts at the same task, producing a richer set of successful and failed examples from which higher-quality memories can be distilled. These memories then guide later attempts.

On WebArena and SWE-Bench Verified, ReasoningBank outperforms methods that store raw trajectories directly or retain only successful procedures. It improves overall success rate by 3.7–6.2 percentage points on the former and solution rate by 3.4–4.0 percentage points on the latter.

### 2.4 Skill Evolution

A single memory records what happened in a particular task, while a Skill summarizes what should be done when a similar problem appears in the future. A Skill may consist of tool-use rules, behavioral requirements, operating procedures, or a script. Skill evolution continually revises these reusable practices based on successes and failures across multiple tasks.

**Representative work:** [**TRACE: A Self-Evolving Skill Bank for Consistent, Limit-Aware LLM Agents**](https://arxiv.org/abs/2608.22793)

![04\-trace\-fig2\.png](图片和附件/04-trace-fig2.png)

TRACE studies whether an in-vehicle assistant can complete tasks reliably. In CAR-bench, simulated users make requests that are incomplete or ambiguous. The Agent must first clarify the user's intent through multi-turn dialogue, then call tools to complete the operation while obeying safety rules for the automotive domain. Many models can occasionally complete a task, but their behavior is inconsistent across repeated runs.

TRACE maintains a Skill Bank containing multiple Skills. Each Skill covers a particular type of situation and records the relevant tool-use rules and behavioral requirements. After each evaluation round, the system gathers the successful and failed trajectories that used the same Skill and compares their behavior. An Agent may fail because it did not ask for necessary information, acted too early, or promised something it could not accomplish. The system revises the corresponding Skill based on these problems, while successful trajectories provide better ways of handling the situation. When one type of task goes wrong, the system only needs to modify the relevant Skill instead of rewriting the entire Prompt.

When handling a new task, the Agent selects an appropriate Skill based on the current dialogue. After the task ends, the system continues updating these Skills based on the success or failure of the current run. With GPT-5.5, TRACE raises the proportion of tasks completed successfully in all three consecutive attempts from 59.9% to 94.5%.

### 2.5 Harness-Code Evolution

Harness code organizes the context received by the model and translates the model's decisions into tool calls and task workflows. Skills usually tell the Agent how it should act, whereas Harness-code evolution can also change how context is assembled, add or remove tools, or revise execution logic.

**Representative work:** [**SkillSmith: Co-Evolving Skills and Tools for Self-Improving Agent Systems**](https://arxiv.org/abs/2606.01314)

![05\-skillsmith\-fig2\.png](图片和附件/05-skillsmith-fig2.png)

Many Skill-evolution methods assume that tools remain fixed. If a task fails because a tool lacks the necessary capability, repeatedly revising the tool's instructions cannot solve the problem. SkillSmith therefore allows the system to modify both Skills and tools. After detecting a capability gap, its reflection module generates a coordinated set of changes: it adjusts the Skill while editing, composing, splitting, or retiring the relevant tools.

Testing each Skill in isolation may also miss coordination problems and conflicts that emerge when several Skills are used together. SkillSmith records which Skills frequently help each other and which tend to interfere, based on execution trajectories. Inspired by cooperation and competition in ecosystems, the authors use these relationships to decide which components to prioritize for invocation, modification, or retirement.

The system also stores past failure patterns, including the observed problem, its cause, and the repair. If a new modification proposal repeats the same error, the system can reject it early and avoid repeating the same failed experiment.

The paper evaluates five Qwen3.5 models of different sizes on three Benchmarks. SkillSmith's advantage over its baselines becomes more pronounced as tasks grow more complex and require more Skills to be used together. Because SkillSmith directly changes tools and how they are called, updated Skills and tools must be tested together to avoid repairing one component while breaking another.

## 3 RSI topology: Chain, Tree, and Graph

The previous section discussed which parts of an Agent can be modified. This section asks how newly created versions inherit from prior results. After each update, a system may continue from only one version, preserve several branches, or let a new version draw on multiple historical sources at once. These organizational choices affect the breadth of exploration, evaluation cost, and the system's ability to recover from harmful updates. Based on the inheritance relationship between new and historical versions, RSI topology can be divided into three categories:

1. Chain evolution updates versions one after another along a single path;

2. Tree evolution allows historical versions to produce multiple branches, while each new version still has only one direct parent;

3. Graph evolution allows experience from multiple tasks, versions, or lineages to converge in one update.

![Chain, tree, and graph evolution topologies](图片和附件/codex-evolution-topologies-en.png)

### 3.1 Chain

Chain evolution maintains only one active version. The system modifies the current version $A_t$ to obtain $A_{t+1}$, then uses $A_{t+1}$ as the basis for the next update: $A_0\rightarrow A_1\rightarrow A_2\rightarrow\cdots$. This structure is simple to implement and does not require maintaining or choosing among multiple branches, but errors introduced in one round are inherited directly by the next.

**Representative work:** [**SkillFlow: Benchmarking Lifelong Skill Discovery and Evolution for Autonomous Agents**](https://arxiv.org/abs/2604.17308)

![10\-skillflow\-fig1\.png](图片和附件/10-skillflow-fig1.png)

SkillFlow uses a typical chain update process. Each task family starts with an empty Skill library. After the Agent completes a task, the model generates a Skill patch from the execution trajectory and verification feedback. The patch may add, revise, or delete Skills and helper scripts. The updated Skill library is then used directly for the next task, forming $S_0\rightarrow S_1\rightarrow S_2\rightarrow\cdots$. There is only one current version throughout the process, and the system never creates multiple candidate branches at the same time.

SkillFlow uses this process to examine whether an Agent can generate Skills from task experience, correct Skills after failures, and maintain a single Skill library across a sequence of tasks. It contains 20 task families and 166 executable tasks in total, spanning finance, supply chains, healthcare, governance, and data processing.

Tasks within a family follow similar operating procedures but use different inputs and specific requirements, with difficulty increasing gradually. The Agent can reuse practices learned from earlier tasks, but cannot simply copy their answers.

The paper evaluates 11 models using four Agent Harnesses. Claude Opus 4.6 improves from a 62.65% task success rate to 71.08%, although some configurations remain flat or decline. The authors find that stronger configurations repeatedly revise a small number of general Skills, while weaker ones tend to keep adding similar Skills and fragment the library. Once an incorrect Skill is written, later tasks may continue to reuse the same error.

### 3.2 Tree

Tree evolution preserves multiple Agent versions that have already been created. One version may produce several children, and later updates may resume from any historical version, causing different directions of improvement to form separate branches. Versions that perform poorly for the moment can remain in the tree because one of their changes may later become the basis of further improvement. As the number of branches grows, however, selecting parents and evaluating new versions requires more time and compute.

**Representative work:** [**Darwin Gödel Machine: Open-Ended Evolution of Self-Improving Agents**](https://arxiv.org/abs/2505.22954)

![10\-dgm\-fig3\.png](图片和附件/10-dgm-fig3.png)



DGM uses a typical tree topology. The system starts with an initial coding Agent and keeps every version generated afterward in a collection. In each round, it selects one version as the parent and modifies its Prompt, tools, or workflow code to produce a child. The underlying model remains fixed throughout the experiments.

The selected Agent first examines its own Benchmark evaluation records, proposes the next improvement, and then implements that change in its own code. For example, it may add a more fine-grained code-editing tool, revise how it handles long context, or introduce repeated attempts and peer review.

A new version must pass basic checks to ensure that its code runs and that it retains the ability to edit a codebase. The system then evaluates its programming ability on SWE-bench or Polyglot. Versions that pass the checks remain in the collection even if their scores are temporarily lower than their parents'. Their parents and other historical versions are not overwritten and may be selected again later. One version can produce multiple children, and different children may continue evolving separately, gradually expanding the version tree. Higher-scoring versions are more likely to be selected, but other versions retain a chance to evolve. At present, the rules for parent selection and collection management are predefined by the system and do not evolve with the Agent.

DGM takes its name from the Gödel Machine, a theoretical self-modifying system that must first prove that a change will improve its utility before applying it. Such formal proofs are difficult for complex coding Agents, so DGM instead runs modified versions and tests their effectiveness using Benchmark scores.

After continued evolution, DGM's SWE-bench score rises from 20.0% to 50.0%, while its Polyglot score rises from 14.2% to 30.7%. In the paper, one complete SWE-bench self-evolution experiment takes about two weeks and also consumes a large number of tokens. This illustrates that tree search systems such as DGM, which continually generate and evaluate multiple branches, generally require substantial time and model-call budgets.

### 3.3 Graph

In tree evolution, a new version descends from one parent, and the evidence used to modify it usually comes from that parent as well. Graph evolution allows a single update to draw on multiple sources, such as trajectories from the same Agent across different tasks or execution results from an Agent on another branch. Parent-child relationships between versions may still be stored as a tree, but the information used for updating can flow across tasks and branches.

**Representative work:** [**Mendel Gödel Machine: Recursive Self-Improving Coding Agents via Comparative Evolution**](https://arxiv.org/abs/2608.07645)

![11\-mgm\-fig1\.png](图片和附件/11-mgm-fig1.png)

MGM retains DGM's version tree but changes what information is used to generate a new version. DGM generally modifies code based on one Agent's failed trajectory on a single task. A single failure may be shaped by the task itself, tool use, workflow, and several other factors at once, making it difficult to identify what truly needs to change. MGM therefore compares that trajectory with other trajectories already accumulated in the version collection.

MGM retains the update method based on a single failed trajectory, calling it **clonal mutation**. It also introduces two additional update methods.

**Reaction-norm mutation** compares trajectories produced by the same Agent on different tasks. When similar problems recur across several tasks, the system has stronger grounds to attribute the problem to the Agent itself rather than to an edge case in one task. The modified child still descends from that Agent, but evidence for the change comes from multiple tasks.

**Cross-lineage hybridization** compares Agents from different branches on the same task. When one Agent fails and another succeeds, the successful trajectory can guide changes to the failing version. If both Agents fail, the system can still compare the two trajectories to identify complementary failure patterns. During the update, the system provides both Agents' trajectories and outcomes as evidence. The Agent being modified extracts reusable practices from the comparison and adds them to its own code.

Both methods use evaluation trajectories that already exist in the version collection. Comparisons across tasks and branches provide more specific clues about failures and narrow the range of issues that must be investigated during modification.

Under the same evaluation budget, MGM outperforms a tree-based baseline that modifies Agents using only a single trajectory on both SWE-bench Verified and Polyglot. On Polyglot, for example, the Agent's score increases from 50.8% to 93.2%, while the single-trajectory tree baseline reaches 77.9%. The different update methods have similar token costs, and MGM's evolved Harness remains useful when the programming Benchmark or underlying model is changed.



## 4 Artifact updater: Self, Teacher, and Joint Updating



An RSI system must both perform tasks and update itself from task trajectories and feedback. These two jobs may be handled by the same Agent or assigned to different Agents. For convenience, this section calls the task-performing Agent the Student and the other Agent that analyzes the Student's task trajectory and participates in modification the Teacher.

Based on who carries out the modification, RSI systems can be divided into three categories:

1. In self-update, the Student summarizes experience and modifies itself;

2. In teacher update, the Student performs tasks while an independent Teacher carries out the actual update;

3. In joint update, the Student and Teacher each handle part of the modification process. For example, one may diagnose the problem while the other implements the change, or one may summarize experience while the other organizes and writes it back. The exact division of labor and sequence vary across methods.

### 4.1 Self-Update

In self-update, the same Student both performs the task and carries out the modification. The environment may provide scores, errors, or other feedback, but no separate Agent analyzes the trajectory or writes the update. The Student decides which experiences to retain and modifies the memory, Skills, rules, or code that will be used in future tasks.

![Self-update](图片和附件/codex-self-update-en.png)

This avoids communication between Agents, but the Student must interpret feedback and implement the modification itself. If the Student misunderstands what went wrong, that error may be written into a persistent artifact and continue to affect later tasks.

### 4.2 Teacher Update

In teacher update, the Student that performs the task does not directly modify the persistent artifact that will be used later. This step is carried out by a Teacher outside the Student. The Teacher may read demonstrations, task trajectories, evaluation results, or prior experience, then generate or organize new memories, Skills, tools, or Harness code.

The Teacher does not have to be a dedicated Agent. It may instead be a reflection module, an optimizer, or an update process equipped with validation rules. Depending on the method, a Teacher may summarize successful experience and analyze failure causes, or merge, filter, and retire existing content. A module that only supplies a score or acceptance result is not a Teacher. To count as one, it must actually decide what is written back and how it is changed.

![Teacher update](图片和附件/codex-teacher-update-en.png)

**Representative work:** [**Recursive Experiential-Working Memory Evolution for Long-Horizon Agent Harnesses**](https://arxiv.org/abs/2608.24876)

![13\-recuris\-fig3\.png](图片和附件/13-recuris-fig3.png)

Recuris provides one concrete implementation of teacher update. In the paper, an Agent performs long-horizon tasks, while a fixed Meta-Agent aggregates failure records from multiple tasks and modifies the Skill Memory used by the Agent in the future. The Agent can be viewed as the Student in this section, and the Meta-Agent as the Teacher.

When performing a long-horizon task, the Agent must both track current progress and invoke experience accumulated in the past. Recuris uses Working Memory to record the current objective, completed steps, and next plan, while Experiential Memory stores experience and Skills reusable across tasks. When a Skill is needed, the system selects relevant Skills according to the task progress and unfinished objectives recorded in Working Memory, keeping Skill selection aligned with the current step.

After a problem occurs during a task, Recuris uses the execution trajectory to associate the failure with the memory components used in that round. When similar problems recur across multiple tasks, the Meta-Agent analyzes these records and proposes a local modification to the relevant Skill. A candidate modification is written into Skill Memory only after validation, and the Agent uses the updated Skill in subsequent tasks. Throughout this process, the task-performing Agent produces trajectories and uses Skills, while the Meta-Agent analyzes problems and carries out modifications.

Recuris is evaluated on four long-horizon Benchmarks and ten models. It improves performance in 35 of 37 model-Benchmark combinations, with gains of up to 32.2 points on the longest tasks.

### 4.3 Joint Update

In joint update, both the Student and Teacher participate in modification, although their roles are not fixed. The Student may first summarize candidate experience from a task and the Teacher may then filter and write it back; alternatively, the Teacher may diagnose the problem and the Student may implement the change. The key criterion is whether both parties influence the final content written back. A Student that only performs tasks, or a Teacher that only assigns scores, does not constitute joint updating.

![Joint update](图片和附件/codex-joint-update-en.png)

**Representative work:** [**Evo-Harness: Context-to-Harness Skill Compilation for Self-Evolving Agents**](https://arxiv.org/abs/2608.15071)

![14\-evo\-harness\-fig3\.png](图片和附件/14-evo-harness-fig3.png)

In Evo-Harness, the Solver corresponds to the Student and the Evolver to the Teacher. The Solver first summarizes candidate experiences, after which the Evolver filters, organizes, and writes them into the Harness. The Solver does more than perform tasks: it also summarizes candidate experience from each execution. The Evolver then reviews those experiences and decides how to modify the existing Skill Harness. The final content written back is jointly produced by the two roles.

Evo-Harness operates over a continual task stream. After completing one task, the Agent summarizes experience from that execution and then proceeds to the next. Execution records contain reusable practices, but also paths, filenames, and specific conditions relevant only to the current task.

When a task fails or receives negative feedback, the Solver summarizes candidate experience from the task instruction, execution trajectory, outcome, and feedback, and identifies the circumstances in which the experience applies and the evidence supporting it. At the end of each task batch, the Evolver compares candidate experiences against the current Harness and decides whether to add, merge, revise, or discard them. It then organizes retained experiences into cross-task rules or procedures for a particular type of task. The updated Skill Harness is used for the next task batch.

The paper evaluates Evo-Harness on multiple Benchmarks. It outperforms other experience-reuse methods on all five Benchmarks. Removing the step in which the Solver generates candidate experience reduces performance relative to the full method, suggesting that both the Solver's reflection and the Evolver's organization contribute positively to the update.



## 5 When Does RSI Update? Offline, Online, and Hybrid Modes

RSI can also be classified by when updates occur. Even when two methods both modify memory or Skills, they may schedule their updates differently: some finish updating before formal testing, some update while working through a task stream, and others build an initial body of experience before continuing to accumulate more during deployment.

Based on the temporal relationship between task execution and experience updates, RSI mode can be divided into three categories:

1. Offline RSI completes updates on training tasks and remains fixed during testing;

2. Online RSI continually updates while handling tasks, so experience from earlier tasks affects later ones;

3. Hybrid RSI first builds an initial version offline and then continues adapting to new tasks after deployment.

![Offline, online, and hybrid RSI](图片和附件/codex-rsi-update-timing-en.png)

### 5.1 Offline RSI

Offline RSI separates updating from testing. The system first accumulates experience on training tasks, then stops updating during the test phase and uses unseen tasks to evaluate whether this experience can be reused. Training and test tasks cannot be identical, or the Agent may merely memorize answers. Their distributions also cannot be completely different, or the evaluation cannot determine whether the learned experience is useful.

**Representative work:** [**GDPevo: Evaluating Agent Self-Evolution on Real Business Tasks**](https://arxiv.org/abs/2608.03764)

![06\-gdpevo\-fig1\.png](图片和附件/06-gdpevo-fig1.png)

GDPevo is a Benchmark designed specifically to evaluate offline RSI. Existing evaluations often do not clearly explain how training and test tasks relate. When a score rises, it is therefore difficult to tell whether the Agent learned to reuse experience or had previously seen a similar task. GDPevo selects tasks from real business workflows in CRM, ERP, finance, healthcare, law, and data processing, then decomposes each workflow into smaller rules.

GDPevo proposes Rule Hybridization to construct tasks. One set of basic rules first appears in different combinations across five training tasks and is then recombined into five test tasks. The Agent may receive feedback and form memories or Skills during training, but it stops updating once testing begins. Although the test tasks have not appeared before, they contain rules encountered during training, allowing the Benchmark to test whether the Agent can apply prior experience to new rule combinations.

GDPevo contains 12 task groups, each with five training tasks and five test tasks, for a total of 120 tasks. It also provides an automated pipeline that can generate another 12 task groups within two days. This makes it possible to refresh test questions regularly and reduces the chance that the model has encountered them beforehand.

The authors evaluate four Agents with four types of feedback. The best-performing configuration improves from 50.63% accuracy before updating to 67.07% afterward, a gain of 16.44 percentage points. When all rules needed for the test are supplied directly, accuracy reaches 91.6%, which is 24.53 percentage points above the current best result. This gap shows that existing Agents still learn only part of the available rules from training tasks.

### 5.2 Online RSI

Online RSI arranges tasks into a continual sequence. After completing the current task, the Agent organizes and retains experience from the execution result and feedback. That experience is already available when the next task begins. Task execution and experience updates alternate without a separate training phase. Performance must be observed along the task sequence to determine whether accumulated experience helps on later tasks.

**Representative work:** [**FinEvo-Bench: A Longitudinal Benchmark for Self-Evolving Agents in Professional Financial Workflows**](https://arxiv.org/abs/2608.06144)

![09\-finevo\-bench\-fig2\.png](图片和附件/09-finevo-bench-fig2.png)

FinEvo-Bench is a Benchmark for online RSI that organizes 120 financial tasks into one continual stream. The Agent retains experience after completing each task and uses it on subsequent tasks. The Benchmark covers six domains and 20 business scenarios. Each scenario contains six tasks that follow the same procedure but use different data and ask different specific questions.

The six tasks from one scenario do not appear consecutively; they are interleaved with tasks from other scenarios. The paper also randomizes the task order three times to ensure that the result does not depend on one particular ordering. After handling other tasks in between, the Agent must still retrieve a previously learned procedure and apply it to a new task of the same type.

After each task, the Agent receives rubric-based feedback and writes useful reflections into memory, Skills, or an operating manual. The current session then closes, but these experiences persist and are used directly on the next task. There is no separate training phase during the evaluation: the Agent completes tasks and updates itself at the same time.

To isolate the effect of retained experience, the paper includes a state-reset control for every experiment. Both groups use the same model, Agent framework, task order, and scoring procedure. The experimental group retains prior experience, while the control group clears its state before each task. The difference between their scores measures the gain from retaining experience.

The paper evaluates four Agents built on Qwen3.7-Max. Retaining experience improves average scores by 9.33 to 19.37 points. Within the same scenario, the gain on the final three tasks is 6.10 to 8.70 points greater than on the first three, indicating that earlier experience becomes more useful as the number of related tasks increases.

### 5.3 Hybrid RSI

Hybrid RSI first builds a body of initial experience from demonstrations or training tasks, then continues updating during real use. This gives the Agent usable experience when it begins performing tasks while still allowing it to incorporate new situations later.

**Representative work:** [**Mem²Evolve: Towards Self-Evolving Agents via Co-Evolutionary Capability Expansion and Experience Distillation**](https://arxiv.org/abs/2604.10923)

![08\-mem2evolve\-fig2\.png](图片和附件/08-mem2evolve-fig2.png)



Mem²Evolve first uses part of the task set to accumulate initial experience and build a set of reusable tools and expert Agents, then processes the remaining tasks. During later tasks, the Agent uses these existing resources while continuing to add new experience and components. It therefore combines offline initialization with continued updates during the task stream, making it a hybrid method.

The system stores these resources in two types of Memory: Experience Memory holds lessons summarized from successful and failed tasks, while Asset Memory holds tools and expert Agents that can be invoked directly.

When a new task arrives, the system first decomposes it into subtasks and searches Asset Memory for suitable components. It reuses a component when one is available. When none is available, the system retrieves related experience and combines it with external information to create a new tool or expert Agent. New tools must first pass automatically generated unit tests. After the task, new experience and validated components are written into the two Memories for future use.

The paper evaluates the system across six task categories and eight Benchmarks. The complete system performs 11.80% better on average than a method that only accumulates experience, and 6.46% better than one that only creates tools or expert Agents. Compared with a setting in which both Memories are empty, the initialized system performs better on every Benchmark.



## 6 Other RSI Taxonomy Dimensions

The preceding sections organized RSI by its artifact, version structure, updater, and update timing. When reading individual papers, five additional dimensions are useful for comparison: Acceptance criterion, Feedback source, Feedback type, Update frequency, and Experience scope. These dimensions must be assessed separately, and one method may use more than one category within the same dimension.

### 6.1 Acceptance criterion

After producing a modification, a system still needs evidence to decide whether to retain it. Common Acceptance criteria include:

- **Artifact validation:** Unit tests, compilation, interface checks, or other direct validation of the modified artifact.

- **Instance result:** Whether the current task instance succeeds or receives a higher Reward.

- **Benchmark score:** Overall performance across a set of evaluation problems.

- **Combined metrics:** A combination of performance, cost, speed, stability, novelty, or other objectives.

- **No independent validation:** The modification is written back immediately after generation without a separate acceptance step.

### 6.2 Feedback source

Feedback source describes where the evidence driving improvement comes from. It records the evidence actually used during evolution, not merely the testing method used for the final evaluation.

- **Benchmark:** Answers, Verifiers, or scores taken directly from the Benchmark under evaluation.

- **Train/dev set:** Evolution tasks or data splits kept separate from the final test set.

- **Environment:** State changes, Observations, native Rewards, or execution outcomes.

- **Executable verifier:** Unit tests, compilers, containers, or formal checkers.

- **LLM feedback:** Reviews, self-critique, self-consistency, or debate produced by the Student, Teacher, or another model.

- **Human:** Human labels, preferences, review, or intervention.

### 6.3 Feedback type

Feedback type distinguishes outcome scores from non-score feedback containing concrete information.

- **Score:** A numerical value or category that evaluates the task outcome. Binary feedback distinguishes only success from failure or pass from fail. Non-binary feedback provides a Reward, accuracy, utility, or another score with more than two possible values.

- **Non-score:** Concrete information beyond an outcome score. Ground truth includes a reference answer, target state, expected output, or reference implementation. LLM review includes textual judgments, explanations, or critiques produced by a language model. Other information includes Observations, logs, diagnostics, causal attribution, constraints, or critiques produced by an Agent.

A scalar produced by an LLM still counts as a score. Only textual judgments, explanations, or critiques count as LLM review. Feedback used solely to evolve the Teacher is not counted here.

### 6.4 Update frequency

Update frequency indicates how much Student execution is accumulated before a persistent artifact is updated:

- **Step:** After one action–Observation pair within a trajectory.

- **Event-triggered:** Upon failure, discovery of a capability gap, receipt of a hint, or completion of a subgoal.

- **Trajectory:** After one complete task trajectory.

- **Batch:** After accumulating multiple trajectories or candidate sets, or completing a round of offline data collection.

This dimension does not record the Teacher's own evolution cycle. Updates performed once per generation and offline aggregation of Student experience are both categorized as Batch.

### 6.5 Experience scope

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
