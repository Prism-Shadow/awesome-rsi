# RSI Is Retracing the Path of Deep Learning

Recently, RSI (Recursive Self-Improvement) has been moving from a distant possibility to something tangible. A growing body of papers and methods now offers systems we can experiment with. Some revise their own Skills, some organize their memories, some modify their Harness, and others generate training data to fine-tune their model weights.

If you have worked with deep learning, reading these papers may give you a strong sense of déjà vu. Many of the problems they encounter are familiar from deep learning, and their solutions often have recognizable predecessors there. Some methods make the connection explicit in their names: SkillAdam borrows from Adam to update Skills, TextGrad brings backpropagation to text, and RRSI applies regularization to changes in an agent's Harness.

The resemblance goes beyond the surface. Consider a concrete example: we want an agent to get better at a particular class of tasks. A common approach is to have it write a Skill. After each batch of tasks, it updates that Skill based on the results, recording lessons from failures and useful experience. Over multiple rounds, the agent should improve.

The first few rounds may produce immediate gains. By round 20, however, problems may start to appear:

- **Performance drops sharply on a new set of unseen tasks.** The Skill contains special cases tailored to the few tasks the agent has already encountered.
- **Tasks that the agent used to handle correctly now go wrong after an update.** A revision changed an old rule in the Skill, fixing new tasks while breaking old ones.
- **The Skill grows from one page to more than a dozen.** Many entries were added after a single failure, never proved useful again, and were never removed.

These problems are not new. From another perspective, repeatedly revising a Skill resembles repeatedly adjusting a neural network's parameters. They are familiar deep learning problems: worse performance on new tasks is overfitting, breaking previously solved tasks is catastrophic forgetting, and an ever-growing document reflects redundancy. Deep learning has spent years developing mechanisms such as regularization, replay, and pruning to address them.

The parallels extend further. Looking at the overall process, deep learning and RSI share a common pattern. Deep learning computes a loss from a learning signal and uses it to adjust neural network parameters. In RSI, an agent completes tasks and then uses the results and external feedback to modify its Skills or Harness.

Drawing on Chapter 4 of the survey [From Existing Methods to New Research Ideas: Two Perspectives on Recursive Self-Improvement](http://arxiv.org/abs/2610.14625), this article examines the connections between current RSI methods and deep learning. The survey identifies eleven mechanisms that RSI methods borrow from deep learning: optimization, backpropagation, reinforcement learning, meta-learning, distillation, regularization, data augmentation, continual learning, pruning, ensemble learning, and adversarial learning. The figure below summarizes these mechanisms and representative methods:

![Mechanisms from traditional deep learning and the RSI methods that borrow from them](blog/rsi-deep-learning/learning-mechanisms.png)

The following sections explore these connections through four questions:

- **How should each update work?** What should change, by how much, and which component is responsible for a failure? These questions connect to optimizers and backpropagation.
- **Where do learning signals come from?** Without ready-made labels, how can agents learn from rewards, learning outcomes, their own training trajectories, opponents, and peers? These sources connect to reinforcement learning, meta-learning, distillation, adversarial learning, and ensemble learning.
- **How can we avoid overfitting?** How do we keep a Skill from working only on tasks it has already seen—the first problem in our opening example? This connects to regularization and data augmentation.
- **How can improvement continue over time?** How can repeated updates preserve old capabilities without making the system increasingly bloated—the other two problems in our example? This connects to continual learning and pruning.

Finally, we will explore what further research directions these connections might suggest.

## 1. How Should Each Update Work?

### Optimizers: What to Change, and by How Much

In deep learning, an optimizer determines the direction and magnitude of parameter updates. Basic gradient descent takes a small step opposite the gradient at each iteration. Later optimizers use historical information in two ways. First, they average gradients over recent steps to stabilize the update direction and reduce sensitivity to noise in a single observation. Second, they adjust each parameter's step size according to how much its gradients fluctuate, taking more cautious steps for parameters with greater variation. Adam, one of the most widely used optimizers, does both.

Iterative Skill revision faces the same questions: what should change in each round, and how large should the change be? Earlier methods often use predefined rules to decide what to modify, then rewrite the entire Skill each round. Parts that were already improved may be changed again in the next revision (left side of the figure). SkillAdam borrows from Adam to address both problems. It records the issues discovered, the edits attempted, and their outcomes so that later revisions can use earlier experience. This parallels Adam's use of historical gradients. It also compares task performance before and after a revision to decide how much editing to allow in the next round. If the gains from an edit vary greatly across evaluation cases, the next round receives a smaller editing budget; if the gains are consistent, broader changes are allowed. This follows the same intuition as Adam reducing step sizes when gradients fluctuate strongly.

![Left: earlier methods use predefined revision rules and rewrite the whole Skill each round. Right: SkillAdam uses optimization memory and an editing budget to decide what to change and by how much](blog/rsi-deep-learning/skilladam.png)

### Backpropagation: Which Component Is Responsible?

Training a neural network requires determining which layers and parameters are responsible for the final error. Backpropagation handles this in two stages. In the forward pass, the input moves through the network layer by layer, producing an output and a loss. In the backward pass, computation starts at the loss and proceeds in reverse. Each layer uses the gradient received from downstream and its own computation to derive parameter gradients through the chain rule, then passes gradients to the preceding layer. A single backward traversal tells us which direction each parameter should move.

Agent systems face a similar credit assignment problem. When a task fails, is the problem in the retrieval instructions, the extraction code, or the final summarization prompt? TextGrad brings the idea of backpropagation to text. Consider the system on the right of the figure: several prompts are passed to a language model, a search engine, and tool calls, whose outputs are then combined by a downstream language model into a final answer. TextGrad first asks a language model to evaluate the final answer against the evaluation criteria and produce textual feedback, serving a role analogous to the loss. It then works backward through the system. At each step, a language model uses that step's inputs, outputs, and downstream feedback to describe how the upstream inputs should change. These textual suggestions serve as gradients. An optimizer then uses them to revise variables such as prompts and code. A task-level evaluation is thus progressively translated into edits to specific components.

![Left: a neural network backpropagates numerical gradients. Right: TextGrad propagates textual revision feedback backward through an agent system](blog/rsi-deep-learning/textgrad.png)

## 2. Where Do Learning Signals Come From?

Many deep learning settings provide labels and loss functions in advance. Agents improving themselves often have no such prepared supervision and must find their own signals: from environmental rewards, from the effects of learning, from their own training trajectories, from opponents, and from peers. The five mechanisms in this section correspond to those five sources.

### Reinforcement Learning: Learning to Select Memories from Rewards

Reinforcement learning improves decisions through interaction with an environment. A learner makes a choice, receives a reward, and adjusts future choices accordingly. One common approach estimates a value for each choice: how much return it is expected to yield. Each new reward is used to refine the corresponding estimate. As the estimates improve, the learner becomes better informed about what to choose.

This principle can be applied to memory retrieval. Many agents store records of completed tasks and retrieve semantically similar records as references for new tasks. The problem is that apparently similar records are not necessarily useful and can even interfere with the current task. MemRL attaches an additional utility value to each memory, indicating how well tasks tend to go when that memory is used. Retrieval has two stages: semantic similarity first retrieves a set of candidates; similarity and utility then jointly determine which memories the agent actually receives. If the task succeeds, the utility values of the memories used are adjusted upward; otherwise, they are adjusted downward, as shown by the update equation at the bottom right of the figure. Memories that repeatedly help the agent are consequently more likely to be selected. The language model's parameters remain unchanged throughout. What improves is the way the system selects memories from existing records.

![MemRL: retrieve candidate memories by similarity, select among them using utility values Q, and update Q after the task](blog/rsi-deep-learning/memrl.png)

### Meta-Learning: Learning How to Learn from Learning Outcomes

Meta-learning aims to learn how to learn. Ordinary training optimizes a model for a task. Meta-learning repeatedly goes through the learning process across many tasks and uses the results to improve the learning procedure itself—for example, the model's initial parameters, its parameter update rules, or the training data it receives. The goal is to learn faster and better when a new task arrives.

SEAL applies this idea to model self-adaptation. Its question is how to make a model internalize new material in its parameters. Simply fine-tuning on the original text has limited effectiveness. SEAL instead has the model read the material and write its own training content, such as several implications derived from the text. The paper calls this a “self-edit,” abbreviated SE in the figure. The model then fine-tunes itself on that content and answers related questions without seeing the original material.

The key is to judge the generated training content by how well the model answers after learning from it. In each round, SEAL has the model produce several alternative self-edits, fine-tunes and evaluates a model on each one, and retains the self-edits that lead to better answers. It then trains the model to generate more content of that kind, as illustrated below. There are therefore two levels of learning: the inner level updates parameters using the generated training content, while the outer level improves the ability to generate that content. This is the meta-learning principle of using learning outcomes to improve the learning procedure itself.

![SEAL: generate several self-edits (SE), fine-tune and evaluate each one, and train the model on those that produce better results](blog/rsi-deep-learning/seal.png)

### Distillation: Constructing a Teacher from the Model's Own Training Trajectory

Knowledge distillation was originally developed to compress large models into smaller ones. A large, strong teacher is trained first, and a smaller student then learns to imitate it. Rather than imitating only a labeled correct answer, the student learns from the teacher's probabilities over candidate outputs. Compared with a label identifying a single correct answer, these probabilities also convey relative preferences among outputs—for example, which incorrect answers are closer to the correct one. Students trained this way often outperform equally sized models trained directly on labels.

RISE brings distillation into reinforcement learning. It focuses on training models to solve mathematics problems using reinforcement learning, where the signal is coarse: only the correctness of the final answer is checked, so the model does not know which intermediate steps were good or bad. Distillation offers a finer-grained signal because a teacher can guide the next token at every position. But that requires a teacher stronger than the student whose output style is also sufficiently close to the student's.

RISE addresses this by extrapolating along the direction of a reinforcement learning update. After one update, it moves the parameters further in the same direction—or extrapolates the model's outputs—to construct a model expected to be stronger, then uses it as a teacher to distill into the student. Because this teacher is extrapolated from the student itself, their output distributions remain close enough for the student to learn from it. Each round repeats the same sequence: reinforcement learning, teacher extrapolation, and distillation.

![RISE: perform a reinforcement learning update, extrapolate a teacher, and distill back into the student](blog/rsi-deep-learning/rise.png)

### Adversarial Learning: Finding Weaknesses through an Opponent

Adversarial learning lets two models improve through competition. One tries to accomplish a task, such as generating convincing samples; the other looks for weaknesses, such as distinguishing generated samples from real ones. They update in turn. When one improves, the other must discover new weaknesses; each weakness that is found indicates what the first model should improve next. The opponent thus becomes a continually changing training signal, without requiring a person to identify every problem.

Coding agents also need opponents that can find faults. Earlier approaches to self-improving code generation commonly pair a solver that writes code with a verifier that writes tests. But those tests often merely confirm that the code works on common inputs. Once the solver becomes a little stronger, such tests struggle to reveal the remaining errors.

The ACE code generation framework takes a different approach. The same model alternates between solver and adversary, reproducing this adversarial interaction. The solver generates candidate programs, while the adversary generates test inputs specifically intended to trigger execution failures, such as errors, crashes, or failure to terminate. The system evaluates the programs using both existing correctness tests and generated inputs, then fine-tunes the solver on selected programs. Execution outcomes also supply preference signals for the adversary: the system prefers tests that cause some candidate programs to fail while allowing others to execute successfully. The updated solver and adversary enter the next round, allowing fault discovery and code generation to improve through continued interaction.

![ACE: the same model alternates between solver and adversary, with both trained using code execution outcomes](blog/rsi-deep-learning/ace.png)

### Ensemble Learning: Learning from Complementary Peers

Ensemble learning combines the predictions of multiple learners to benefit from their complementary strengths. Several models are trained, each makes a prediction for the same input, and voting, averaging, or weighting produces the final result. This works because different models tend to make different errors, some of which cancel out when their predictions are combined. Ensemble members therefore need to be individually capable and sufficiently diverse. Their predictions can be combined using a fixed rule, or an additional module can learn which members to trust more for a given input.

In agent systems, the corresponding questions are how multiple agents should solve a problem together and how the system can learn to assign them to tasks. Many multi-agent systems fix their collaboration structure in advance, as in panels (a), (b), and (c) of the figure: who acts first, who follows, and who passes results to whom. This resembles combining ensemble members using fixed rules.

DMoA instead lets the system learn how to combine its members. It maintains a pool of agents built from different combinations of language models, roles, and tools—the ensemble's complementary learners. At each inference step, a router uses the current question and available context to select a small number of agents from the pool, as in panel (d). Their responses enter the next step's context, and a summarizer eventually produces the final answer. The router corresponds to the ensemble module that learns which members to trust for a particular input. Training the router requires no labeled answers, and the underlying language models remain unchanged throughout. What is learned is how the agents collaborate.

![(a), (b), and (c): multi-agent systems with predefined collaboration structures. (d): DMoA selects agents from a pool at each step](blog/rsi-deep-learning/dmoa.png)

## 3. How Can We Avoid Overfitting?

### Regularization: Controlling Complexity and Introducing Perturbations

Regularization aims to reduce overfitting so that a model performs well beyond its training data. Two broad approaches are common. One constrains complexity by adding a penalty to the loss and optimizing $\mathcal{L}(\theta) + \lambda \Omega(\theta)$. Here, $L_0$ regularization penalizes the number of nonzero parameters, while $L_1$ penalizes the sum of their absolute values; both encourage sparsity. $L_2$ penalizes the sum of squared parameter values, discouraging excessively large weights. The other approach introduces perturbations. Dropout is a typical example: randomly masking some units during training reduces the network's reliance on particular combinations of features.

RSI faces the same risk. Repeated revisions can make a Harness or Skill highly adapted to the tasks used during improvement while leaving it unable to transfer to unseen tasks. The RRSI paper observes this pattern: earlier methods for automatically modifying a Harness gain substantially on the task set used for improvement, but most of those gains disappear on unseen tasks, and some versions perform worse than before improvement.

RRSI therefore applies complexity control from regularization to Harness evolution. It progressively reduces the number of independent edits allowed in each proposal, limiting how much change a single round of feedback can introduce. Components that repeatedly fail to provide gains become candidates for removal. When selecting candidate versions, increases in execution cost must be justified by better task performance, and changes tailored solely to a particular benchmark are filtered out.

![RRSI: constraints on how edits are proposed on the left, and on which edits are retained on the right](blog/rsi-deep-learning/rrsi.png)

SkillEvoReg applies the idea of Dropout to Skill revision. It randomly masks some instructions or procedural steps in the current Skill, lets the agent perform training tasks using this incomplete version, and asks an updater to propose revisions based on the execution records. The system then restores the masked content and integrates the proposed edits into the full Skill. The intention is to reduce excessive dependence on particular existing instructions during revision. Like RRSI, it also restricts unnecessary growth in the Skill.

![SkillEvoReg: randomly mask parts of a Skill during revision and constrain unnecessary growth](blog/rsi-deep-learning/skillevoreg.png)

### Data Augmentation: Creating Variants of Hard Problems

Data augmentation expands a training set by constructing variations of existing examples. In image classification, a labeled image can be randomly cropped, flipped horizontally, or slightly recolored. The object remains the same and the label stays valid, but the model sees several different versions. This discourages memorizing incidental details in the training images and encourages learning the features that determine the class. The transformation must preserve the example's essential meaning; otherwise, the original label no longer applies.

TTCS applies data augmentation to model self-improvement. It considers a setting in which a model has a collection of difficult problems but no reference answers and must improve by practicing on them. Without reference answers, it can generate several responses to each problem and learn from the most frequent answer as if it were correct. But when a problem is too difficult, most responses are wrong, and the most frequent answer is often wrong as well. The model then learns from its own mistakes as though they were correct.

To address this, TTCS generates variants of those problems. A question synthesizer preserves the underlying solution approach while changing objects, scenarios, or conditions to produce new questions at an appropriate difficulty. Appropriate difficulty means the model gets a question neither consistently right nor consistently wrong. If roughly half of its repeated responses agree with the most frequent answer, the synthesizer receives a higher reward; questions that are too easy or too difficult receive lower rewards. The model trains on both the original problems and the new questions. With a suitable level of difficulty, majority answers are more reliable and the model can learn the right things. As the model improves through practice, the synthesizer becomes better at posing questions.

## 4. How Can Improvement Continue Over Time?

### Continual Learning: Preserving Old Capabilities through Replay

Continual learning studies how a model can keep learning from subsequent tasks or data while retaining existing capabilities. The challenge is that training on new data adjusts parameters toward the new tasks, potentially overwriting knowledge acquired earlier. This is catastrophic forgetting. Replay is a classic response: store some old examples and mix them into training on new material, so that adapting to new tasks also reminds the model how to perform old ones.

An agent repeatedly revising its Skills can face the same problem: fixing new tasks may break old ones. SEEK is a search evaluation system developed at Kuaishou. When a user searches for a term, the platform returns a page of short videos. SEEK uses a language model to judge the quality of those results and, when they are poor, explain what is wrong. There are many evaluation criteria, and they change frequently, so SEEK stores them as individual Skills in a Skill library and retrieves only the relevant ones for each evaluation.

Over time, human review may reveal that SEEK repeatedly misjudges a particular kind of case, prompting revisions to the corresponding Skill. But changing one criterion can turn previously correct judgments into mistakes. SEEK therefore maintains a fixed collection of historical cases whose correct judgments have been confirmed by people. After each Skill revision, the system checks both whether judgments improve on the newly identified cases and whether they remain reliable on the historical collection. The revision is retained only when the new cases improve and historical performance does not materially deteriorate. This historical collection serves the role of replay.

![SEEK: a router selects relevant Skills for the evaluator; revised Skills must pass replay checks before being written back to the library](blog/rsi-deep-learning/seek.png)

### Pruning: Slimming Down Skills

Pruning removes network weights or structures that contribute little to the target behavior, usually followed by further training. A trained network often contains many weights that do very little. Pruning first estimates the importance of each weight or structure, perhaps from its magnitude or from the change in loss when it is removed. It then deletes the least important parts and trains the remaining network to recover lost accuracy. Repeating this process can yield a much smaller network with similar performance.

Repeated Skill revision can likewise accumulate content that contributes little and is no longer worth keeping. SkillProx explicitly simplifies a Skill after revision. It first divides the Skill into units, such as a section of instructions or a reference file. It then removes one unit at a time and reruns validation tasks to measure the effect. If removing a unit barely changes performance, that unit becomes a candidate for simplification: delete it outright, merge useful parts into another section, or compress overly detailed content into shorter steps. A simplification is retained only if the Skill becomes shorter, its structure remains intact, and validation performance does not substantially decline. Otherwise, the change is rolled back.

## 5. Going Further: What New Directions Can We Explore?

The first four sections covered mechanisms already used by existing methods. What other mechanisms might these connections lead us to borrow? Here are five directions. The first three come from deep learning, the fourth from machine learning more broadly, and the fifth from evolutionary algorithms.

![Sources of new directions: deep learning (the lottery ticket hypothesis, adversarial dropout, and plasticity), Bayesian optimization, and modular evolution](blog/rsi-deep-learning/research-directions.png)

### The Lottery Ticket Hypothesis: How Much Does an Agent Need at the Start?

The lottery ticket hypothesis suggests that a large network may contain a small subnetwork which, when trained on its own from its original initial weights, can reach similar accuracy in roughly the same number of training iterations.

Does an agent really need so many Skills and so much code when it begins self-improvement? If a small subset is enough, we may be able to find a simpler starting point that remains just as capable of continued improvement.

### Adversarial Dropout: Can Perturbations Be More Targeted?

Dropout randomly masks some neurons during training. Adversarial dropout goes further: within an allowed range, it deliberately seeks masking patterns that make the model fail, then trains the network to handle them.

As discussed earlier, SkillEvoReg already uses random masking during Skill revision. Could we instead target the parts of a Skill that an agent relies on most, forcing it to find alternative ways to complete the task?

### Plasticity: Does an Agent Become Less Able to Learn as It Improves?

Continual learning requires more than remembering old knowledge. A model must remain able to acquire new knowledge—an ability known as plasticity. Research has found that plasticity can gradually decline after a network trains on many tasks in succession. Continual backpropagation was proposed to address this: during training, it continually reinitializes a small number of low-contributing neurons so that they can learn new features.

If an agent keeps training on its own generated data, might it gradually become less able to learn new methods? This is a question worth testing.

### Freeze-Thaw Bayesian Optimization: Which Branch Deserves More Training?

Freeze-Thaw Bayesian optimization uses observed learning curves to predict how a training run will perform next. It then decides whether to continue the run, pause it, or resume a previously paused run.

Many RSI systems pursue several improvement branches simultaneously. DGM, for example, maintains an archive of agents and repeatedly selects versions for further modification. Could we similarly use the first few rounds of each branch to predict how much improvement remains, then decide which branches to continue and which to pause?

### Modular Evolution: Can Skills Learn to Split into Modules?

An intriguing evolutionary experiment shows that when objectives switch among different combinations of subgoals, networks can evolve reusable modules on their own. Current RSI methods such as ModularRSI, by contrast, define module boundaries first and then improve the modules separately.

Could an agent also learn to split its Skills into reusable modules as tasks change, without requiring people to design the boundaries in advance?

The original survey discusses these directions in more detail for readers who want to explore them further.

## Conclusion

Agent self-improvement is encountering familiar deep learning problems one after another: how to update, where to obtain learning signals, how to avoid overfitting, and how to keep improving over time. Existing methods have already borrowed ideas from optimizers, backpropagation, reinforcement learning, meta-learning, distillation, regularization, data augmentation, continual learning, pruning, ensemble learning, and adversarial learning.

RSI also introduces something beyond ordinary deep learning: the system proposing changes can itself be changed. Adam does not modify itself during training. In SEAL, however, the model both updates itself using training content it writes and learns how to write better training content. The improver is itself being improved—that is where the recursion comes in.

There is much more to borrow. Learning-rate warmup, early stopping, curriculum learning, and many other deep learning techniques are worth exploring in RSI.

This article draws on the survey [From Existing Methods to New Research Ideas: Two Perspectives on Recursive Self-Improvement](http://arxiv.org/abs/2610.14625). The curated list of RSI methods is available in the [Prism-Shadow/awesome-rsi](https://github.com/Prism-Shadow/awesome-rsi) GitHub repository.

## References

1. [From Existing Methods to New Research Ideas: Two Perspectives on Recursive Self-Improvement](https://arxiv.org/abs/2610.14625)
2. [Awesome RSI](https://github.com/Prism-Shadow/awesome-rsi)
3. [SkillAdam: Stable and Efficient Skill Evolution for Agents](https://arxiv.org/abs/2609.08944)
4. [Optimizing generative AI by backpropagating language model feedback](https://doi.org/10.1038/s41586-025-08661-4)
5. [MemRL: Self-Evolving Agents via Runtime Reinforcement Learning on Episodic Memory](https://arxiv.org/abs/2601.03192)
6. [Self-Adapting Language Models](https://arxiv.org/abs/2506.10943)
7. [RISE: Recursive Improvement via Self-Extrapolating Policy Distillation](https://arxiv.org/abs/2609.05295)
8. [ACE: Self-Evolving LLM Coding Framework via Adversarial Unit Test Generation and Preference Optimization](https://arxiv.org/abs/2605.16299)
9. [Differentiable Mixture-of-Agents Incentivizes Swarm Intelligence of Large Language Models](https://arxiv.org/abs/2605.15706)
10. [RRSI: Regularized Recursive Self-Improvement of Agent Harnesses](https://arxiv.org/abs/2609.24972)
11. [SkillEvoReg: Regularizing Agent Skill Evolution Against Overfitting](https://arxiv.org/abs/2609.30861)
12. [TTCS: Test-Time Curriculum Synthesis for Self-Evolving](https://arxiv.org/abs/2601.22628)
13. [SEEK: Skill-Routed Evaluation with Evolvable Knowledge for Industrial Search](https://arxiv.org/abs/2609.29803)
14. [SkillProx: Self-Evolving Agent Skills via Proximal Textual Gradient Descent](https://arxiv.org/abs/2608.07449)
15. [Darwin Gödel Machine: Open-Ended Evolution of Self-Improving Agents](https://arxiv.org/abs/2505.22954)
16. [ModularRSI: Modular and Generalizable Recursive Harness Self-Improvement](https://arxiv.org/abs/2609.14857)
