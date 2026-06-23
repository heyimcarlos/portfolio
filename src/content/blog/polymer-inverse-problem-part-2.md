---
title: 'Architecture Was Not the Problem'
description: 'Building a forward model for polymer properties. Part 2 of the polymer ML project: I tried four neural network architectures, expecting one to win clearly. None did.'
pubDate: 'Apr 24 2026'
tag: notes
heroImage: '../../assets/blog-placeholder-3.jpg'
featured: true
draft: true
---
*Part 2 of a series on the polymer ML project I built during my final year at Centennial College. [Part 1](/blog/polymer-project-intro/) covered the data work: messy recipes, fake correlations, synthetic copies, ingredient grouping, and the SME features that rescued melt flow rate.*

This post is about what happened after that.

I had a forward model: recipe in, predicted properties out. The next question was obvious. Which neural network architecture should power it?

I tried four. I expected one to win clearly. None did.

That became the real finding. At this dataset size, with this feature set, architecture was not where the leverage lived.

---

## The four contenders

Before the results, the four architectures I compared:

[IMAGE: forward_model_architecture_shootout.svg - the 4-panel diagram]

**MLP.** A plain multilayer perceptron. Two hidden layers, ReLU activations, dropout in between, and one shared trunk for the six dense target properties. The simplest baseline.

**ResNet.** Same general idea, but with skip connections. Each block adds its input back to its output, which can help deeper networks learn residual corrections instead of rebuilding the whole function from scratch.

**Ensemble.** Five MLPs trained with different random seeds, with predictions averaged at test time. The idea is variance reduction: each model makes slightly different mistakes, and averaging cancels some of them out.

**Committee.** One separate MLP per target property. The idea is specialization: maybe density, melt flow rate, ash content, and impact properties each deserve their own model.

Each of these had a reason to exist. They represented four different guesses about the bottleneck: simplicity, depth, variance, or per-property specialization.

## The shootout

Same data. Same grouped train/test split. Same six dense target properties. Same training budget.

The project eventually predicted more than six properties, but the architecture shootout stayed on the six with enough measurements to make the comparison meaningful. Part 1 has the data sparsity story; this post uses the clean comparison set.

| Architecture | Parameters | Avg R2 |
|---|---:|---:|
| Ensemble (5x MLP) | 128,670 | 0.870 |
| ResNet (128 hidden, 3 blocks) | 107,910 | 0.866 |
| MLP (single) | 17,094 | 0.858 |
| Committee (1 MLP per target) | 150,534 | 0.856 |

The old draft of this post had a different headline: "the boring model won." That was based on an earlier shootout where the single MLP beat the others clearly.

The rerun corrected that. The Ensemble nominally won. ResNet came second. The MLP came third. The Committee came last.

But the whole field fit inside **1.4 R2 points**.

On a small held-out set, that is not a decisive win. Different random seeds could shuffle the ranking. The only result sharp enough to keep is that the Committee was both the most expensive and the least accurate. Sharing a trunk across correlated targets helped more than I expected.

[IMAGE: training_curves.png - validation loss vs epoch, all four architectures]

## Why none of them won

The tempting interpretation is to say the Ensemble won and stop there. That would be technically true and mostly useless.

The better reading is that none of the architectures pulled away. The smallest model and the largest model landed in the same neighborhood. More capacity did not create a breakthrough. More specialization did not create a breakthrough. Averaging five models helped a little, but not enough to change the shape of the project.

That matters because the rest of the system had much larger effects. Cleaning the data, respecting grouped splits, masking missing targets, and encoding SME knowledge moved the model more than choosing between these four architectures.

This is the part I wish I understood earlier. On small industrial datasets, architecture can feel like the most interesting decision because it has the most impressive names. But if the data is small, sparse, and physically constrained, architecture is often downstream of boring things being correct.

## The bottleneck was still melt flow rate

The clearest evidence was melt flow rate.

In Part 1, I walked through why melt flow rate was different: it needed a physics feature from the SME's spreadsheet. Without that feature, the model had to discover a sharp non-linear rule from a few hundred recipes. With the feature, melt flow rate jumped from roughly `R2 = 0.43` to `R2 = 0.92`.

The architecture shootout showed the same thing from the other side. Without those physics features, every architecture was stuck around `R2 = 0.42-0.48` on melt flow rate, while the other dense properties were mostly above `0.89`.

That is a clean result. If four different architectures all fail on the same property in the same way, the problem is probably not the architecture. It is the information you gave the model.

Architecture choice could not rescue melt flow rate. The SME feature could.

## Sidebar: two bugs I found while writing this post

While putting together the numbers for this post, I read through pieces of code I had not touched in months. I found two bugs.

**Bug 1.** The trainer constructs `nn.HuberLoss()` based on the config setting `loss_function: huber`, but the actual loss line in the training loop hardcodes squared error:

```python
loss = torch.sum((outputs[mask] - y_batch[mask]) ** 2) / mask.sum()
```

So every model that declared `huber` in its config actually trained with masked MSE. The config field was wired up as far as constructing the unused criterion. An earlier hyperparameter sweep had measured Huber as slightly better, about `+0.006 R2`, but that got silently reverted when I added NaN masking and inlined the squared-error computation.

The architecture ranking does not change because every model had the same bug. The production model was probably slightly worse than it could have been. Real, not catastrophic.

**Bug 2.** The `MCDropoutPredictor.predict` method called `add_engineered_features(df, feature_set="all")`, regardless of which feature set the model was trained on.

For the deployed model, which was trained on `all`, the bug was invisible. For a model trained on `all_no_physics`, this would build the wrong feature dataframe and then slice it back down through `feature_cols.json`. Probably correct predictions, wasted compute, and a landmine for future models.

Two bugs is more than I want to find in a post-hoc audit. They are also exactly the kind of bug ML research code accumulates: a refactor reverting an earlier decision, or a hardcoded value staying correct only by coincidence. The fix is reading your own code with fresh eyes more often than I did. This post counted as that exercise.

## Three things that mattered more than architecture

This is the part I actually want people to remember.

### 1. NaN-masked loss

The dataset had missing target values everywhere. A recipe might have density and melt flow rate measured, but not every impact or tensile property. Dropping rows with missing values would throw away most of the dataset. Imputing missing lab measurements would teach the model fake ground truth.

The fix was a per-element mask in the loss:

```python
mask = ~torch.isnan(y_batch)
loss = torch.sum((outputs[mask] - y_batch[mask]) ** 2) / mask.sum()
```

`mask` is shaped like `(batch_size, n_targets)`. A single sample can contribute gradient to whichever target properties were actually measured. The model sees the row, but only updates the heads with real lab values.

This mattered more than the architecture. Without it, the real manufacturing dataset basically stops being modelable.

### 2. Group-aware train/test splits

The synthetic-copy pipeline created several variants of each base recipe. A naive random split can put copies of the same base recipe in both train and test. Then the model has effectively seen the test recipe already, and R2 inflates.

The fix was to split by base recipe ID:

```python
def extract_base_lot_id(id_str):
    if "_synthetic_" in id_str:
        return id_str.split("_synthetic_")[0]
    return id_str

groups = df[id_column].apply(extract_base_lot_id)
gss = GroupShuffleSplit(n_splits=1, test_size=test_size, random_state=42)
train_idx, test_idx = next(gss.split(df, groups=groups))
```

All copies of a base recipe go to the same side of the split. I also added a leakage check that asserts zero overlap between train and test base IDs.

Every R2 number in the project depends on that being right. This is one of those details that sounds small until it invalidates an entire experiment.

### 3. MC Dropout for uncertainty

The forward model was not only used for predictions. It was supposed to become the environment for a reinforcement learning agent in Part 3. That agent needed a rough uncertainty signal, because recipes far away from training data should be penalized.

I used MC Dropout: at inference time, leave dropout on, run several forward passes, use the mean as the prediction and the standard deviation as uncertainty.

```python
self.model.train()  # leave dropout on at inference
predictions = []
with torch.no_grad():
    for _ in range(self.n_samples):
        predictions.append(self.model(x).cpu().numpy())

mean = np.mean(predictions, axis=0)
std = np.std(predictions, axis=0)
```

Production used `n_samples=10`. For calibration, I tested `n_samples=50` on the held-out set and compared predicted standard deviation against actual absolute error.

[IMAGE: mc_dropout_calibration.png - scatter plot, global r = 0.313]

Global Pearson `r = 0.313`. Directionally useful. Far from well calibrated.

The per-property story was mixed. On melt flow rate, `r = 0.76`, which means the model had a real sense of when it did not know. On a couple of sparse tensile properties, the correlation was negative, meaning the model was confident where it was wrong. Across the dense properties, predicted uncertainty was generally lower than actual residual.

That does not make MC Dropout useless. It means I should treat it as a cheap, biased uncertainty signal. For an RL reward that only needs to avoid high-uncertainty regions, that can be enough. For confidence intervals shown to a lab technician, it would not be enough. I would use conformal prediction instead.

There is also an honest production footnote here: the deep Ensemble nominally won the architecture shootout, but MC Dropout shipped. The reason was not a principled trade-off I carefully wrote down at the time. MC Dropout was already integrated when the Ensemble experiment ran, and the Ensemble's gain was not decisive enough to justify swapping it in.

## What I would do with 10x the data

Almost none of what I would try next starts with architecture.

With 10x more real samples, I would first improve uncertainty: conformal prediction for calibrated intervals, and probably a real deep ensemble if inference cost stayed acceptable. Then active learning: use model uncertainty to recommend which recipes the lab should run next. Then maybe tabular transformers like TabNet or FT-Transformer, once the dataset was large enough for them not to overfit immediately.

But the order matters. The single biggest lever would still be more real lab trials. Everything else sits downstream of data.

## The general point

The original version of this post wanted to say the boring model won.

The more honest version is that every architecture landed in the same neighborhood. The model choice mattered, but not as much as the decisions around it:

- The loss function had to ignore missing targets without throwing away rows.
- The train/test split had to respect synthetic-copy groups.
- The uncertainty signal had to be useful enough for an RL agent without pretending to be calibrated.
- Melt flow rate needed physics knowledge, not a fancier network.

That is the lesson I trust now. At small-to-moderate dataset sizes, on real industrial data, the architecture is rarely the main character. The work that moves the needle is usually the stuff around the model.

---

*Next in the series: the inverse problem — how this forward model became the environment for a PPO agent that proposes recipes from OEM specs.*
