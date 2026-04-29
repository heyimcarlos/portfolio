---
title: 'How Data Selectively Shows Where Feature Engineering Matter'
description: 'Part 1 of a series on the polymer ML project I worked on. This post is about the data: what it looked like, what was hard about it, and what I learned from trying to make it tractable. The next post is about the model architectures I tried.'
pubDate: 'Apr 24 2026'
tag: notes
heroImage: '../../assets/projects/polymer-part1-1.png'
featured: true
draft: true
---

I came into this project thinking feature engineering enhances how supervised models learn. You aggregate, you transform, you encode domain knowledge. The model gets better. That's how it should go.

But actually, feature engineering is a precision tool. On most targets measured, raw ingredients were already enough. On one property, only engineered features contributed to convergence. Knowing which case you're in is most of the work.

This post is about how I figured that out.

---

## The data, briefly

I worked with ~500 polymer compounding trials from a Tier 1 automotive manufacturer. Each sample is a trial, roughly twenty ingredient categories, percentages summing to 100 and paired with a set of measured material properties: mechanical, thermal, rheological. The goal was to train a model that predicts properties from a recipe, then later invert that to propose recipes from target specs.

[VISUALIZATION OPPORTUNITY: A simple "trial = recipe + measured properties" diagram. Recipe on the left as a stack of ingredient bars summing to 100%, arrow into a stylized extruder/mixer, properties on the right as a list of measurements. Could anchor what the dataset actually is, since most ML readers haven't worked with industrial trial data before.]

A few things make industrial polymer data different from the data ML practitioners usually work with:

**It's small.** 500 trials, not 500,000. Every row was a real physical experiment that took hours, materials, and a working extruder line. There's no scaling this with more compute.

**It's unbalanced across targets.** Some properties (melt flow rate, density) get measured on every trial. Others get measured rarely — sometimes only a handful of times across the full dataset. On the held-out test set, the most-measured property has 94 samples. The least-measured has 1. That 94× spread shapes everything downstream, especially how you compute loss and what claims you can make per-property.

**It's noisy at the source.** Run the same recipe through the same machine on the same day and you'll get measurements that vary by roughly ±5%. This isn't a model failure — it's the irreducible noise floor of the physical process. Even a perfect model that captured every relationship in the data would still be wrong by ±5% on average. Every R² number in this post should be read against that ceiling.

[VISUALIZATION OPPORTUNITY: A per-property test sample count bar chart, sorted descending. The visual cliff after the top six properties tells the unbalanced-targets story in one image. Could be the post's strongest single visual for "this isn't a clean dataset."]

That last point matters more than it sounds. It means there's a ceiling on how good any prediction can be, set by the physics of the process rather than the cleverness of the model. When a property's R² is 0.97, that's not "near perfect" — it's brushing up against the noise floor. When a property's R² is 0.43, the model is missing real recoverable signal, but the gap to perfection isn't all the way to 1.0 — it's closer to 0.95 or so. Knowing where the ceiling is changes how you read the numbers.

---

## Null augmentation: the data's own bias against itself

The first problem I ran into wasn't model-related. It was that the data — clean, real, hard-won as it was — contained patterns that looked like physics but were actually operational residue.

I covered this in detail in [the LinkedIn version of this post](LINK), but the short version: I noticed during EDA that *stabilizer percentage was correlated with material density at r = −0.44*. Stabilizers are protective additives — they prevent oxidation and UV damage. They don't determine how dense a plastic is. There was no physical reason for that correlation to exist.

But the model was learning it. And the model was confident.

The reason the correlation existed: at this plant, certain polymer families ship with certain standard stabilizer packages. Over 470 trials, those operational choices created patterns that *looked* like causal physics. Stabilizers tracked polymer choices, polymer choices drove density, and the model collapsed the chain into "stabilizers cause density."

The fix was not synthetic data. I tried that — TVAE, CTGAN, GaussianCopula — and all three failed because they couldn't respect the constraint that ingredient percentages must sum to 100. They produced negative values, recipes totaling 47% or 130%, garbage.

What worked was simpler: duplicate each real recipe ten times and randomize *only* the passive ingredients (colorants, stabilizers) that don't actually affect mechanical properties. Same active ingredients, same measured properties, different stabilizer values. The spurious correlation collapses because stabilizer values are no longer tied to anything real.

After augmentation: stabilizer × density dropped from r = −0.44 to r = −0.08. The dataset went from 376 unique trials to 4,136 augmented training rows. The model could no longer cheat on the operational residue, and it had to learn the real relationships instead.

[VISUALIZATION OPPORTUNITY: Before/after correlation matrix for the passive ingredient × property pairs. Red cells (real correlations) before, faded cells after. Visually drives home what augmentation actually did.]

That was the first lesson: **with small datasets, the residue of how the data was collected can look indistinguishable from physics.** Generating more data doesn't help. Breaking the residue does.

---

## What I expected feature engineering to do

By the time I started feature engineering, I had a working pipeline: 4,136 augmented training rows, six dense target properties to predict, an MLP architecture I'd validated separately. The expectation was straightforward: raw ingredient percentages aren't enough to capture polymer physics, so I'd need engineered features to give the model a fighting chance.

I built up a feature pipeline in stages. Aggregations first (total filler, total inorganic content, glass-talc interactions). Then ratios and binary indicators for the presence or absence of specific filler types. Then mechanical features (filler size ratios, fiber-to-matrix ratios). Eighteen domain-engineered features in total, on top of the twenty raw ingredient columns.

Then a separate, more ambitious layer: physics features. Twelve features encoding material science directly — blended MFR via the log-mixing rule, weighted-average density, polymer-archetype features. Plus 24 group-physics features that gave each polymer cluster three "effective" contribution signals (effective MFR, density, modulus, weighted by recipe percentage). Seventy-four features total when everything was on.

I ran an ablation. Same data, same model, same training config. Only the feature set varied. I expected a clean staircase: raw ingredients at the bottom, each layer of features adding R², all features at the top.

That's not what happened.

---

## Why a neural network can already learn most of polymer physics

Before the ablation results, it's worth saying why a neural network can learn most of these properties from raw ingredient percentages at all. The framing matters because it explains everything that follows.

Polymer compounding produces materials whose properties are *smooth* functions of composition. Density is roughly additive — a weighted sum of component densities. Flex modulus rises non-linearly with filler loading, but along a continuous, monotonic curve. Heat deflection temperature and Charpy impact have transitions, but smooth regions on either side. These are exactly the kinds of relationships a neural network excels at: small, well-behaved non-linearities that an MLP with enough samples can interpolate.

When the training data covers the relevant ingredient ranges densely enough — and 4,136 augmented rows on twenty ingredient columns is *barely* enough — the network can discover these relationships from raw fractions. No feature engineering required. The right inductive bias is already implicit in the architecture.

Melt flow rate is different. The MFR of a polymer blend depends on the *log* of each component's MFR, weighted by mass fraction:

> MFR_blend = exp( Σ wᵢ · ln(MFRᵢ) )

A 50/50 blend of an MFR=1 grade and an MFR=100 grade does not have MFR=50. It has MFR≈10. Arithmetic interpolation overestimates MFR by 5×.

[VISUALIZATION OPPORTUNITY: This is the post's hero diagram. Two curves on the same axes: x-axis is blend ratio (0 to 100% of the high-MFR component), y-axis is resulting MFR. One curve is the arithmetic-mean prediction (a straight line from MFR=1 to MFR=100). The other is the log-mixing-rule curve (concave down). Mark the 50/50 point on both — 50 vs 10. A single annotation: "Same recipe. 5× different prediction." This single image is the post's most concrete teaching moment.]

That's a fundamentally non-smooth relationship in the space of raw ingredient fractions. A neural network *can* learn it, given enough data — but with 376 unique base recipes covering a high-dimensional ingredient space, there aren't enough examples in the right places for the network to discover the log transform implicitly. So it doesn't.

This is the gap that physics features fill. They don't add information the network couldn't theoretically learn — they add the right *inductive bias*, encoded explicitly so the network can use it. The log-mixing rule appears as a feature; the network learns to weight that feature; MFR predictions stop being broken.

---

## The ablation, in one table

Same train/test split. Same MLP architecture. Same training config. Same seed. Only the feature set varies.

| Feature set | # eng. features | Avg R² (6 targets) | MFR R² |
|---|---:|---:|---:|
| **none** (raw ingredients only) | 0 | 0.876 | 0.582 |
| basic (aggregations) | 5 | 0.853 | 0.409 |
| basic + interactions | 6 | 0.869 | 0.501 |
| all_no_physics (18 domain features) | 18 | 0.858 | 0.430 |
| **all** (+ physics + group archetypes) | 54 | 0.937 | 0.916 |

[VISUALIZATION OPPORTUNITY: Per-property heatmap, 5 rows × 6 columns. Rows are feature sets, columns are properties. Cell colors show R² (white→dark green). The MFR column tells the entire story visually — uniformly pale across the first four rows, then suddenly dark green for "all". Every other column stays dark green throughout. Worth including in the post — it's the strongest visual evidence for the precision-tool framing.]

[VISUALIZATION OPPORTUNITY: A waterfall chart showing avg R² across the five feature sets. Visualizes the dip-then-jump pattern (none → basic_no_physics dropping slightly, then all jumping to 0.937).]

Three things in this table are surprising on first read.

**The raw model is already strong.** R² 0.876 across six dense properties without any engineered features. That's not what you'd expect — small dataset, twenty raw ingredient columns, no domain encoding, and the model still hits 88%. This is the smooth-physics-is-learnable point, made concrete: density, ash content, flex modulus, HDT, and Charpy impact all sit between R² 0.93 and 0.97 with raw inputs alone.

**Domain features alone make MFR worse.** Adding aggregations like total filler content and inorganic loading drops MFR R² from 0.58 to 0.41. Adding more domain features (the 18-feature `all_no_physics` set) keeps MFR at 0.43 — better than basic alone, but still below the raw baseline. The added features push the model toward filler-driven signals that anti-correlate with melt flow. More features, in this regime, isn't better. It's worse.

**Physics features don't lift everything — they specifically rescue MFR.** Adding the 12 physics features and 24 group-physics features takes MFR from 0.43 to 0.92 — a +0.49 R² jump. On the other five properties, the same features change R² by less than 0.03 in either direction. Physics features aren't a global lift. They're a precision tool aimed at one property.

---

## What this changes about how I think about feature engineering

The naive version of feature engineering goes: raw inputs are bad, engineered features are good, more is more. The data didn't support that. What it supported instead:

- For most relationships in the dataset, raw inputs already gave the model what it needed. The MLP architecture's capacity to learn smooth non-linearities was sufficient.
- For one specific relationship — melt flow rate's log-mixing rule — raw inputs were structurally insufficient. The function form is wrong in the input space. No amount of training data on raw ingredients would have fixed it.
- For that one specific case, the right feature is one that encodes the right inductive bias explicitly. Once you have the log-mixing rule as a feature, the network can use it. Without it, the network has to discover it, and there isn't enough data for that.

That's the deeper version of "feature engineering matters." It's not a default. It's a response to a specific failure mode — the case where the function the model needs to learn is fundamentally the wrong shape for the inputs you're giving it. When that's not the failure mode you're looking at, feature engineering can hurt as easily as it helps.

The work isn't building features. The work is figuring out which relationships in the data your model can find on its own and which ones need explicit help. That's mostly a question about the physics, not about ML.

---

## The ceiling and what's next

One last thing about that R² 0.937 average with all features in. Recipe-level measurement variance is ±5%, which puts an upper bound on how good any prediction can be. R² 0.94 to 0.97 on these properties is essentially the ceiling. The model isn't going to get materially better on this data with more features or a better architecture.

What this means for the next post: when I compared four neural network architectures on the same six dense targets — single MLP, ResNet, deep ensemble, and a per-target committee — they all landed within a 1.4 R² point band of each other. At first I thought this was a finding about how dataset size limits architecture choice. After the ablation, I think it's something different: most of these properties were already near the noise floor with any reasonable architecture. The architecture choice couldn't move the needle because the needle was already pinned by physics.

The architecture comparison post is next. I'll cover what I tried, why MLP won (or rather, why the field tied), and the production setup that gave the RL agent its uncertainty signal — including a couple of bugs I found in my own code while writing this series.

---

*Feedback and corrections welcome — especially if you've worked with industrial datasets and have your own stories about features that helped or hurt unexpectedly.*
