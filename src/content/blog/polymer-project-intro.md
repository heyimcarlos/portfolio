---
title: "Polymer Project: Introduction"
description: "This is the story of how I got the chance to work on a AI/ML project for the largest manufacturing company in North America."
pubDate: "May 28 2026"
tag: notes
featured: false
draft: true
---
![Talking to the SMEs](../../assets/projects/ti-auto/abc-team1.jpg)

## The Journey

While in the fifth semester of the Software Eng Tech - AI degree at Centennial College, taking courses like Deep Learning and Reinforcement Learning, my professor announced that they were looking for a student to participate in a polymer manufacturing project. She invited a couple of students to apply, and to my surprise, I was one of them.

I applied and was selected for the interview. In the interview, I was given a problem: imagine having a document describing the scientific properties a cake must have, either as intervals or set values for glucose level, density, thickness, colour, etc. They then asked whether I believed I could build a model to predict a cake recipe that would meet the targets specified in the document. I replied that I thought I could do this, to which they asked, "How?"

The semester before, I studied supervised learning and neural networks, focusing on tree-based models, classifiers, ensemble methods, and basic perceptron theory. With my limited knowledge, I decided to give the problem a try. I asked about the available data and was told there were fewer than 500 samples, each with a recipe (percentage of materials adding up to 100%) and the resulting properties. I thought for a moment, running an elimination process in my mind. “A neural network wouldn’t converge on such a small dataset.” “The output is continuous, so rule out binary classifiers.” The only feasible solution I could think of was using a Random Forest model to branch out on material impacts on properties. So, I began to explain how I would approximate the solution using branching logic, for example, whether the glucose level was above a certain threshold, and then let the tree algorithm find the best correlations.

This whole time, I was so excited to even be introduced to such a complex topic; the thought of talking about it made me question if this was even possible, and if so, why nobody had already solved it? Fast-forward two days, and the professor ended up liking how optimistic (and naive) I was about my ability to do this! And I was hired.

When I joined, the project was already in its second phase. Phase 1 had just been delivered (funnily enough, using a Random Forest model) and was being used by lab technicians at the polymer research lab.

Several subject matter experts supported the team as the product was built. I met them during a plant visit, which made it clear I was working with a large international company and very smart people. This made me realize the impact of the work I was about to do.

The goal of phase 2, was to improve on what we delivered.

![Talking to the SMEs](../../assets/projects/ti-auto/abc-team2.jpg)

## The Inheritance

The first thing I did was to review what was already there.

The team had built product-specific models. In the repo, this showed up literally: folders for different customer specs, material blends for each one, and a backend loading separate Random Forests. They also tried neural networks, active learning, CNNs, and synthetic data, but Random Forest performed best, so they deployed it.

And honestly, this was fairly obvious given the limited amount of data they had, so the Random Forest approach was a reasonable choice. Some products had fewer than twenty trials. One had around forty. In that dimensionality, no deep learning approach will ever converge. So, building the best approximator you can and wrapping it in something people can use is the next best approach.

## The Problem

Train a model that takes an OEM specification (scientific properties ranges) as input and predicts a material composition that meets the OEM targets.

Essentially, train a model to give lab technicians a head start at first, but eventually make it the tool for generating the correct compositional blend for the production line.

Answering the question: "I want a plastic with x stiffness, melt rate, colour, and elongation, what material blend would make it?"

A widely known problem in material informatics, coined the "inverse problem". A somewhat unsolvable problem... until now, maybe?

Most machine learning research focuses on the forward problem: given a manufacturing recipe, predict the resulting product's scientific properties. The inverse problem is different because there isn't just one answer. Many recipes can yield similar properties, something I hadn’t seen covered in my curriculum.

That paragraph surprisingly covers nearly everything I've studied in the field and more: supervised models to learn the forward mapping, neural networks to learn non-linearities and handle high dimensions, and reinforcement learning to search a large observation space.

As I mentioned before, when I joined the project, a tree-based model had already been deployed and was in production. The model was better than nothing, but lacked in key areas:

* A model had to be trained for every new product
* Tree-based models are probabilistic (the predictions have zero creativity)
* The model couldn’t handle the non-linearity of the blending process
* The model couldn’t handle the dimensionality of the data if all trials were merged
* The model couldn’t learn from SME feedback

I realized that building a model that could solve the abovementioned areas would provide real value, real hours saved, and a reduced testing budget. Money not spent is earnings, no? Maybe?

## The Research

The professor (now my lead) gave me a week to look into ways we could improve the existing model, the data, and any issues surrounding its implementation. I spent a week reading papers, articles and talking with LLMs. This took me down several rabbit holes in different areas of supervised learning. I explored extreme trees, cube regression, and neural network architectures.

During one of my Reinforcement Learning classes, the professor was doing a deep dive on environments. It's important to highlight that by this time, I understood the Markov Decision Process, basic reward systems, and what policies and learning algorithms were. I had built at least two simple OpenAI gym environments with games like Space Lander and Asteroids, and trained a DQN to play them.

While in class I had a bit of an epiphany. I was asking myself, "How hard could it be to turn this into an RL problem?” I quickly concluded that implementing the environment (extruders, testing machines, ovens, etc) and replicating the lab's physics would be insanely hard.

I kept on pondering, “What if the environment wasn’t an issue?” We could train an agent to explore the recipe space and find the best material blend for any OEM specification. After all, artificial neural networks thrive at learning non-linear relationships, like those that happen while the cake is baking. Then I started thinking about long-term benefits: using a Markov Decision Process with a single model instead of a model per product. A single agent that converges across all product trials and works alongside the lab technicians to give them a solid starting point for their material blend generation process.

The agent would generate a recipe and place it in the oven (environment) to bake, yielding a set of properties used to calculate a reward, which is then applied to the policy via the learning algorithm. With each completed recipe, the agent aligns itself a little more closely with the target properties. As it generates more recipes, it discovers what it should and shouldn't do and bam! We solved the unsolvable inverse problem of material informatics (I’m such a dreamer.. I was absolutely convinced that it would work, without doing any of the math, I just felt it).

Then came the sudden realization: I grew up in a country that rewards money and power and penalizes intellectual work. My parents forced me to go to business school, and until I was in my 20s, I had never stopped to think who I was and what I truly wanted. When I did, I realized I love science and engineering, hence why I’m here.

I’m awful at physics. There’s absolutely no way I could build a physics simulator of the scale needed to replicate the lab environment, and to be truthful, the capacity level I felt we had at Centennial College didn’t give me confidence to ask my professors or professors of the mechanical engineering or physics department how to do this (maybe I should have). So I finally gave up on the idea. We only had 4 months, and I needed years of physics and engineering knowledge to even start building such an environment.

I kept researching, mostly using LLMs to help me find and understand scientific papers. I couldn't find any work similar to what I wanted to do until I was lucky enough to find a presentation by Jessica Hamrick, a brilliant research scientist at DeepMind. She introduced the idea of model-based reinforcement learning and gave a tutorial on how to use these methods. In her presentation, she explained in simple terms how to learn a model of the environment and use it to train an agent.

This is when it clicked! We already have trials of real OEM specifications used to achieve the production recipes! All this data is used to train the current tree-based model, but what if we used it to train a model (I named it the forward-model) that learns the physics and acts as a personal physics simulator/oven. I could then go back to my original idea and use the forward model instead of the real lab environment, training the agent to generate recipes against it (essentially distilling the physical interactions between the polymer).

![Model-based Reinforcement Learning approach](../../assets/projects/ti-auto/model-based-rl.png)

Going back to Jessica Hamrick's presentation, she used the diagram above to explain where the simulated environment would fit into the RL setup. At this point, my mind was blown. I couldn’t believe how simple it was to understand the concept of model-based reinforcement learning, and how it could be applied to solve the inverse problem in material informatics.

I immediately started talking to LLMs about this idea, generating research documents that pointed to papers on MBRL, and reading those to see how they used this for cement manufacturing, robotics, and other fields where building a real environment is either too expensive or too dangerous.

## The Pitch

The week flies by, and I find myself in the meeting where I’m reporting my findings to which I start the conversation with the question: “If our task was the opposite, to build a model that predicts recipe -> properties, could we build a highly accurate model?” for which my professor said “Yes, we have the past experience (data), and supervised learning/ANN’s is a mature field”. Okay, forward model validated (small win).

Then I asked, “What if we present the problem as an RL problem?” to which my professor said, “The environment would be too expensive, wait… things clicked, and she said, ' Interesting!" Then I proceeded to introduce the idea of using this forward model as the environment for a reinforcement learning approach and highlighted that there’s a branch of RL doing this already called model-based reinforcement learning, for which I pointed everyone to the presentation by Jessica Hamrick (and the diagram) to explain how this could work. I explained the potential benefits, and the prof was sold.

Since there were two students on the project and the other student who built the supervised approach was already working on phase two, I got the green light to explore this new option. The professor gave me freedom to research and experiment, treating it as a long shot. But if it worked, who knows, it could be a game-changer for the company. I think the professor hired me for this reason: I’m an unconscious dreamer, I believe anything is possible, even if it ends up biting me in the ass.

## First contact with the data

While in the clouds with the new possibility, I never stopped to think about the constraints. This came crashing down when I reviewed the dataset: a mere ~200 samples with over 50 materials, and 20 mechanical, thermal, and electrical properties, most of which were missing. I ended up requesting all available data and salvaged an extra ~300 samples, so we ended up with ~500 total samples. More on how later. After analyzing feature availability, I chose six properties which were available in at least 70% of the trials. I thought missing data wouldn’t be a big problem, like in class, we can always impute the empty gaps. But this was quickly shut down because we cannot impute the realities or conditions of lab testing.

![The samples](../../assets/projects/ti-auto/01-samples-dark.png)

_Figure: A blend as ingredient percentages, pushed through the manufacturing process, with lab-measured properties on the other side._

![Test sample count by target property](../../assets/projects/ti-auto/05-target-sparsity.png)

_Figure: the held-out test set had 94 rows, but most properties were not measured on all 94. The six targets I used in the controlled feature comparison had 64-94 measurements._

I brought up the data inconsistency when talking to the SMEs, and they said, “This is the real world.” Not all OEM specs require all target properties, so we only test for what the customer requests. So again, I didn’t know what to do, barely any data, most of it not clean and with tons of targets missing. This meant our dataset was extremely short, but abundantly wide, something I had never encountered in class.

Before any model conversation made sense, I had to understand what a recipe even meant. Every material blend, or recipe, had multiple categories of materials that came together to make the product. Like a cake, you need baking powder, and in polymer blends that maps closer to a stabilizer: a small ingredient that helps the product fuse in processing.

There were organic materials like polypropylene families, copolymers, and homopolymers. There were also inorganic materials (fillers), like talc and glass fibre, sometimes with different shapes or diameters. The simplest way I could understand it was this:

| Recipe role | Material categories | How I understood them |
|---|---|---|
| Passive (shouldn't affect properties) | Colourants, stabilizers | Ingredients that help with colour, stability, or surface behaviour. |
| Active organic materials (affect properties) | Homopolymers, copolymers, impact modifiers | The main polymer families. The most important ingredients, drives the product behaviour. |
| Active inorganic materials (affect properties) | Talc, glass fibre, glass spheres | Mineral that can change stiffness, density, and has a linear relation with ash content. |
| Active edge cases | Coupling agents and masterbatches | Pre-blended situational materials. |

With a vague idea of the observation space, I continued, quickly realizing the reality was disappointing.

The first dataset I received was only the phase 2 trials. This made sense from the project perspective because phase 1 had trained a model per product, each with its own subset of trials. But from my perspective, trying to train one model that could learn across all products, this was a huge constraint. I needed every recipe I could get.

So I started asking for more data. I asked for the phase 1 trials and got the dataset to ~350 samples. Later, while grilling the SMEs for anything else, they told me there were production samples too. These were not trials in the experimental sense, but production blends that were tested. After merging those, we got to ~500 samples.

This wasn't easy. I had to practically beg and explain why any sample mattered. At this point, the biggest factor of success was not a model architecture, or the reinforcement learning idea. It was data. If we had no data, we had nothing to learn from. And even after all that, ~500 samples was tiny. Neural networks are data hungry, and need at least a couple thousand samples to vaguely converge. We were nowhere near that.

The SMEs also explained that there's a baseline variance given the conditions of the plant. Essentially, if you put the exact same recipe in the exact same machine at the exact same time, the output is not deterministic. It can vary +-5%.

Between the missing properties, the tiny sample count, and the baseline variance, I wasn't feeling too optimistic about next steps.

## The Surprise

The dataset was lying to me.

With the largest dataset I could realistically get, I started asking basic questions. The first one was simple: which materials move which properties? I ran the usual correlation calculation (e.g., Spearman, Pearson) and to my surprise found that all materials had some sort of correlation with properties that we were told they didn't affect.

The most explicit example was colourant having a correlation with all six main properties.


![passive ingredients and properties correlation before](../../assets/projects/ti-auto/02-passive-correlation-before.png)

_Figure: Weird correlation between stabilizers and density (`r = -0.44`). Stabilizers protect against oxidation and UV, but don't influence density. Density is determined by the base polymer._

This led me down a rabbit hole that made me understand that correlation was not measuring causality. It was measuring how much x moved with y. And in this dataset, some variables moved together because of mutual exclusivity, not because one caused the other.

Colourant is a perfect example of this, since it is always used in exterior products. These parts must have high-impact properties because they are the first to be hit in a collision. So, because colourant kept showing up alongside high-impact recipes, the data made it look like it was contributing to stiffness and impact strength, which is completely untrue.

The same thing was happening with stabilizers. In a manufacturing plant, stabilizer selection depends on polymer types. So the pattern between stabilizer and density came from stabilizers being linked to polymer families, which also affected density. Again, a pattern was formed, but the story behind it was wrong.

## The Fix

The main insight that worked was to avoid generating property values. Instead, I duplicated recipes and altered passive materials such as colourants and stabilizers. By duplicating and randomizing those features, the properties remain consistent (same ingredients and properties) while debiasing artificial correlations.

I called this method **null augmentation**.

Each of the original rows was duplicated ~10x, yielding 4,136 training samples.

After applying this method, the correlation between stabilizer loading and density, the original problem, decreased from r = -0.44 to r = -0.08. The correlations involving colourants also disappeared.

![Passive ingredient correlations after null augmentation](../../assets/projects/ti-auto/02-passive-correlation-after.png)

_Figure: after randomizing the passive ingredients, colourants and stabilizers mostly stop correlating with the target properties. Coupling agents are the warning row: they look passive because they are small, but they still carry real signal._

This is the main lesson. Whether an ingredient is passive or not depends on the physics, not just on the ingredient itself. Colourants are passive because they do not affect properties. Coupling agents seem passive because they are only a small part of the recipe, but they actually have a large effect. The augmentation method must respect this difference.

On the forward model, null augmentation lifted R2 on the main property from 0.84 to 0.93, the single biggest gain on any property. On the other core properties, the model was already in the 0.93-0.97 range without augmentation, so the gains were small (within +-0.01).

I found out later that this idea has a name. The paper Nuisances via Negativa (arxiv 2210.01302) frames it as varying non-causal features to force the model to learn causal ones. A cleaner formulation than I had.

The takeaway: Before synthesizing, it is important to know what your data is correlated with. Small datasets lack signal and often contain patterns that appear to be real physics but are actually artifacts of data collection. Making more synthetic rows amplifies unwanted patterns.

## The Detour

This is the thing I had to learn the hard way, because before this clicked, I tried the obvious path: generate more data.

Luckily, this was a problem the other student had faced in phase 1, for which they had built a synthetic data pipeline using synthetic data vault (SDV) to generate more samples. I wanted to further explore this, so I went a rabbit hole and implemented the following synthesizers:

- GaussianCopula: uses statistical methods to train a model that generates data (runs GMM under the hood?)
- TVAE: uses a variational auto encoder-based approach to train a model that generates synthetic data. Encoder <-> Decoder architecture which reduces the dimensionality of the data (by reducing noise) and then passes it to decoder to try and reconstruct it.
- CTGAN: a general adversarial network approach, deep learning methods to train a model to generate synthetic data.

All three methods failed. They could not keep the constraint that the material blend must sum to 100%.

We wanted to try the Bootstrap synthesizer but it was behind a pay wall, and after reaching out to DataCebo 10 times to try to purchase it, we couldn't gain access to it. This was really said, becuse this synthesizer is built for our usecase. From their website: "The BootstrapSynthesizer is a synthesizer specifically designed to work when you only have a few rows of data — or if your data is "short and wide", containing more columns than rows. This synthesizer internally bootstraps your real data, and then uses the bootstrapped data to build a model."

As you might imagine, the GaussianCopula won, not because it was the best, but because the neural network approaches couldn't converge due to the missing data. But still, I ended up not using any synthetic data, because even with GaussianCopula, the distribution of the data was not good enough.

![Distribution comparison between original, physics-augmented, and SDV synthetic data](../../assets/projects/ti-auto/distribution-comparison.png)

_Figure: the SDV rows looked close enough to be tempting, but they still drifted away from the real distributions in places where I needed the data to be faithful. The physics-shaped copies were not magic, but they stayed closer to the original target distributions._

For all synthesizers, I built some custom constraints like:

- recipes must sum to 100%
- limit the usage amount of certain materials (colorant >= 0 <= 4%)

## The clustering moment

<!-- TODO: draft this from the outline.

Current outline beat:
- original data had 40+ distinct ingredients
- too many for ~500 trials
- SME helped group ingredients with similar chemistry and similar role
- down to about 20 ingredient groups
- trade-off: lose specificity, gain generalization
-->

The original dataset had 50+ distinct ingredients, and ~500 trials available. I needed to reduce dimensionality without losing important information. The SMEs were clear when saying some ingredients did not contribute to the overall properties of a prouduct, which we later coined as passive ingredients.

So, intuitively, the first phase of material grouping was focused on passive ingredients. All colourants materials became a single `colourant` feature, same for stabilizers, process aids, and coupling agents. This brought down the total amount of materials to around 20, which was still a lot for the amount of data we had, but it was a good start.

The second round of clustering was focused on active inorganic materials, so fillers. I grouped all talc variants into a single `talc` feature, and all glass fibre variants into a single `glass fibre` feature. These groups vaguely map 1:1 with a single property ash content.

The third and last round of clustering was the hardest. Polymers are large, complex molecules (macromolecules) that are made up of monomers. The can come in many different forms, and the way they are structured can affect the properties of the resulting product. Given their specialty, they are tested for different properties, and these properties can them be tested with different units of measurement, strength loads, etc. An example of this is Tensile, variants of tensile include: strength, modulus, elongation, stress, strain, etc. Each one of those variants also have variants like tensile strength at break, tensile strength at yield, elongation at yield, strain at yield, etc. And these are unique values, approximating one with the other is not possible, and if tried, it could introduce devastating noise to the data. So, continuing, I focused on active organic materials, so polypropylene-based materials. The SMEs gave us a lot of insight on how to group these materials, they explained that the key property that differentiates these materials is the melt flow rate, and the kind of polymer they are, they can be homopolymer, copolymer, or impact modifiers. Before I decided to group by their melt flow rate only, as a supervised learning student, I learned multiple clustering techniquest and wanted to apply them to see how supervised and semi-supervised clustering techniques would group these materials.

<insert plot showcasing the clustering results here>

After applying k-means, hierarchical clustering, and DBSCAN, I found that the clusters were objectively successful, but bias because the same properties were not present for every available polymer. Material technical sheets (sourced from UL) had a set of properties that varies per country, unit of measurement, and the kind of polymer could be focused on properties like ten but some constraints were not respected (if I could go back I would have a meeting solely to talk clustering, and have the SMEs explain where the traditional clustering techniques failed in their eyes). For example, the clustering techniques grouped together polymers with similar properties, but they didn't respect the chemistry of the materials, for example, they grouped together homopolymers with copolymers, which have different chemical structures and properties. The SMEs gave us various constraints for clustering: use melt flow rate as the key property for clustering, and then group by polymer type (homopolymer, copolymer, impact modifier). This led to a more meaningful clustering that respected the chemistry of the materials and the insights from the SMEs.

<insert plot showcasing the SME clustering results here>

By this point we ended up with around 20 features, all generic groups like high-mfr homopolymer, low-mfr copolymer, talc, colourant, etc. And some situational features like talc master batch, which is a pre-blend of 70% talc and 30% unknown polymer, which is used in some specific cases.


## Feature engineering - and the SME's spreadsheet

<!-- TODO: draft this from the outline.

Current outline beat:
- dataset was usable, but the model still did not know polymer chemistry
- SME had a spreadsheet / mental model for melt flow rate
- encode that spreadsheet as features in one batch
- no iterative "add feature, retrain" story
- bottleneck was getting the right domain knowledge
-->

By this point, we had a usable dataset and a model that still did not know polymer chemistry. The accuacy of the forward model was ~60% average R2, with some properties like ash content in the high 80s, and some like melt flow rate in the low 40s. The model was learning some relationships, but it needed extra hand-holding mainly because the lack of variance in the dataset, and the fact that the data was confounded with spurious correlations.

The next step was obvious, I needed to add some domain knowledge to the dataset via feature engineering. The first thing i did was to clarify to the model the total amount of inorganic material (filler) there was in every recipe, i would sum the total talc and the percentage of talc in the 70 and 80% master batches. This taught the model the masterbatches were an ash content contributor. 

<insert the rest of feature engineered features and explained them as above, also highlight the accuracy gain/loss of each feature here>

![Average R2 as feature complexity grows](../../assets/projects/ti-auto/06-feature-waterfall.png)

_Figure: the average score does not improve just because the feature set gets bigger. The jump only appears when the physics features enter._


## The melt flow rate exception

Most of the polymer properties were smooth enough for a neural network to learn. If you add a little more talc, stiffness moves a little, and ash content moves linearly. If you change the base polymer, density moves in a way that is not perfectly linear, but still learnable. Small recipe changes usually make small property changes, and neural networks are good at learning that kind of shape.

Melt flow rate was the exception.

Melt flow rate is how easily melted plastic flows. Higher means it flows faster. A manufacturer cares about it for almost every plastic part because it tells you how the material behaves when it is being processed.

The weird part is that melt flow rate does not behave like a normal average. If I blend two polymers 50/50, and one has melt flow rate of 1 while the other has melt flow rate of 100, the naive answer is:

```text
(1 + 100) / 2 = 50.5
```

But the real answer is closer to 10.

The way the SME explained it, you do not average the melt flow rates directly. You take the log of each one, average those logs by recipe percentage, then turn it back into a normal number.

```text
log10(1)   = 0
log10(100) = 2

50/50 blend:
(0.5 * 0) + (0.5 * 2) = 1

10^1 = 10
```

So the arithmetic answer says 50. The physical answer says 10. That is a 5x difference from one of the simplest possible blends.

A neural network could probably learn that if I had tens of thousands of recipes covering every kind of blend. I did not. I had about 500 real trials, then about 4,100 variants built from those same trials. That is not enough for the model to discover this rule by itself, especially when the important range is compressed and the examples are unevenly distributed.

This is where the SME's spreadsheet mattered. It did not replace the model. It gave the model a number it could not have computed on its own from this much data.

![Blending two polymers: arithmetic vs reality](../../assets/projects/ti-auto/04-mfr-blending.png)

_Figure: a 50/50 blend of a slow polymer and a fast polymer does not land halfway between them. That was the kind of rule the network needed help with._

And the result was almost too clean. Across the other properties, adding the physics features barely changed the score. Density, ash content, stiffness, HDT, Charpy, all of those were already in good shape. Melt flow rate was the one that moved.

Without the physics features, melt flow rate was stuck around R2 = 0.43. With the SME's melt flow features included, it jumped to R2 = 0.92.

That told me something important. The model architecture was not the main character here. The data work was. The model already knew how to learn smooth relationships. What it needed was help with the one rule that looked simple to a polymer expert and invisible to a small neural network.

![Where physics features actually help](../../assets/projects/ti-auto/03-feature-heatmap.png)

_Figure: across the other five targets, the scores barely move. Melt flow rate is the one target that changes shape when the physics features are added._





## Closing - where this leaves us

<!-- TODO: choose the closing style from the outline.

Recommendation from outline:
- state the punchline number: MFR R2 went from 0.43 to 0.92 when the physics features went in
- forward pointer to Part 2: four model designs, small spread, architecture mattered less than the data work
-->
