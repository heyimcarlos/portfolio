---
title: 'The Boring Model Won'
description: 'Building a Forward Model for Polymer Properties. Part 2 of a series on the polymer ML project I built during my time at TI Automotive. I tried four neural network architectures — a plain MLP, a ResNet, an ensemble, and a committee and the plain MLP won.'
pubDate: 'Apr 24 2026'
tag: notes
heroImage: '../../assets/blog-placeholder-3.jpg'
featured: true
---
# The Boring Model Won: Building a Forward Model for Polymer Properties

*Part 2 of a series on the polymer ML project I built during my final year at Centennial College. [Part 1](LINK) covered null augmentation — how I turned 470 real manufacturing trials into 4,136 training samples without generating synthetic data.*

*This post is about what happened after. I tried four neural network architectures — a plain MLP, a ResNet, an ensemble, and a committee — and the plain MLP won. That finding is the headline. But the three decisions that mattered more than architecture are the reason I'm writing this post.*

---

## The four contenders

Before the results, the four architectures I compared:

[IMAGE: forward_model_architecture_shootout.svg — the 4-panel diagram]

**MLP.** A plain multilayer perceptron. Two hidden layers of 256 units, ReLU activations, dropout in between. One trunk, shared by all 16 output heads. The simplest baseline.

**ResNet.** Same two-layer structure, but each hidden block has a skip connection that adds its input back to its output. The idea — borrowed from computer vision — is that skip connections help gradients flow through deeper networks and let the network learn the *residual* on top of an identity mapping. Good when the true function is close to identity; useful for very deep networks. I tried it at 3 blocks of 128 hidden units.

**Ensemble.** Five MLPs trained with different random seeds, predictions averaged at test time. The idea is variance reduction: each individual MLP makes different mistakes, and averaging cancels some of them out. Works well when the bottleneck is model variance rather than bias. Comes with a 5× compute cost at training and inference.

**Committee.** A separate MLP per target property — 16 independent models, each specialized in one output. The idea is that each property might have its own relationship with recipe inputs, so forcing them to share a trunk is giving up information. Comes with a 16× parameter cost and loses all the regularization benefit of multi-task learning.

Each of these has a reason to try. None of them are crazy. They reflect four different intuitions about what the bottleneck is: capacity (ResNet), variance (Ensemble), per-target specialization (Committee), or nothing — the simplest thing works (MLP).

## The shootout

Same data. Same train/test split. Same 6 dense target properties. Same training budget.

| Architecture | Parameters | Avg R² |
|---|---:|---:|
| **MLP (single)** | **17,094** | **0.877** |
| Ensemble (5× MLP) | 128,670 | 0.853 |
| Committee (1 MLP per target) | 150,534 | 0.847 |
| ResNet (128 hidden, 3 blocks) | 107,910 | 0.748 |

Test set: 30 samples across 6 properties. The gaps are consistent across every property and large enough that they're not explained by sampling noise at that size.

**The single MLP wins with ~7× fewer parameters than the next-best architecture.** The ensemble trails by 2.4 R² points despite averaging five models. The committee is slightly worse still — giving each property its own model threw away the regularization of sharing a trunk across correlated targets. ResNet is the clear loser, 13 points below the winner on 7× the parameters.

[IMAGE: training_curves.png — validation loss vs epoch, all four architectures]

Looking at the training curves explains a lot of this. The single MLP converges to the lowest validation loss and stays there. The ensemble tracks closely but never gets lower — averaging five models that all overfit in similar ways doesn't save you. The committee shows real per-target specialization but lacks cross-target regularization. ResNet plateaus visibly higher from the start.

## Why the boring model won

The usual mistake is to reach for more capacity when the model underperforms. At 4,136 training samples, capacity wasn't the problem. More parameters just gave the model more ways to overfit — to memorize the augmented copies instead of generalizing from the base recipes underneath them.

The winning MLP is almost comically simple:

```yaml
hidden_dims: [256, 256]
dropout: 0.17
weight_decay: 0.00022
learning_rate: 0.001
batch_size: 32
epochs: 50, early stopping patience 50
```

Two hidden layers. Square. 89,104 parameters in the final form. No skip connections, no attention, no tricks.

The hyperparameter sweep that got there was an autoresearch loop — 18 iterations, each one testing a single change against the current best. The patterns that held up across both sweeps: dropout around 0.17 is a narrow plateau (0.13 and 0.19 were both clearly worse); weight decay 0.00022 was the single biggest win in the entire sweep (+0.026 R² in one step); and every architectural change — wider, narrower, deeper, asymmetric, batch-normed, skip-connected — made the model worse.

At ~4k samples, on this kind of tabular data, everything that added capacity hurt more than it helped.

## Sidebar: the trainer bug I found while writing this post

While assembling the numbers for this post, I noticed something uncomfortable. My trainer constructs `nn.HuberLoss()` or `nn.MSELoss()` based on a config setting — but the actual line that computes the loss in the training loop hardcodes squared error:

```python
loss = torch.sum((outputs[mask] - y_batch[mask]) ** 2) / mask.sum()
```

My config says `loss_function: huber`. The code is actually training with masked MSE.

The hyperparameter sweep had found that Huber beat MSE by +0.006 R² on an earlier trainer revision that used `self.criterion`. That finding was real at the time. It got silently reverted in a later rewrite I did — I added the NaN masking logic and inlined the squared-error computation in the process, which quietly replaced the criterion dispatch.

I'm flagging this because (a) it's honest, (b) it's exactly the kind of bug ML research code is riddled with, and (c) the final model is probably 0.006 R² worse than it could have been — real but not catastrophic. The architecture shootout ranking doesn't change; every architecture was trained with the same bug.

If this were a production model I'd fix it and rerun. For a handoff-stage research project, I'm writing it down and moving on. That's a judgment call I'd defend.

## The three things that mattered more than architecture

This is the part I actually want people to remember. Each of these decisions had more effect on model quality than the difference between the best and worst architecture in the shootout.

### 1. NaN-masked loss

My 16 target properties are wildly unbalanced in how often they were measured. Some had 94 test samples. Three had only 3.

| Property | Test samples |
|---|---:|
| melt_flow_rate, density, flex_modulus | 94 each |
| ash_content | 91 |
| hdt_180mpa | 89 |
| charpy_notched_23c, tensile_yield_50mm | 64 |
| izod_notched_23c | 33 |
| *...9 more...* | |
| elongation_break_50mm, izod_notched_n30c | 4 |
| tensile_break_5mm | 3 |

A 24× spread between the most- and least-measured property. If you drop rows with any missing values, you're left with almost nothing. If you impute missing values, you're teaching the model that the imputed numbers are ground truth. Both destroy signal.

The fix is a per-element mask in the loss:

```python
mask = ~torch.isnan(y_batch)
loss = torch.sum((outputs[mask] - y_batch[mask]) ** 2) / mask.sum()
```

`mask` is `(batch_size, n_targets)`. A single training sample can contribute gradient to any subset of the 16 outputs — whichever properties were actually measured for that row. The model sees every sample; it just updates only the heads that had a real target.

I think of this as the most underrated detail in small-data tabular ML. You almost never see it discussed in tutorials, but without it, real manufacturing or scientific datasets become un-modelable.

### 2. Group-aware train/test splits

The augmentation pipeline produces ~9 synthetic copies per base recipe, with IDs like `D620GC_1201314_synthetic_3`. A naive random split puts copies of the same base recipe in both train and test. The model has effectively seen a near-duplicate of every test row during training, and R² inflates by 10–20 points.

This is the kind of bug that's invisible unless you look for it specifically. You get great validation numbers, ship the model, watch it fall apart in production, and spend two weeks trying to figure out why.

The fix uses sklearn's `GroupShuffleSplit`:

```python
def extract_base_lot_id(id_str):
    if "_synthetic_" in id_str:
        return id_str.split("_synthetic_")[0]
    return id_str

groups = df[id_column].apply(extract_base_lot_id)
gss = GroupShuffleSplit(n_splits=1, test_size=test_size, random_state=42)
train_idx, test_idx = next(gss.split(df, groups=groups))
```

All augmented copies of a base recipe go to the same side of the split. I also shipped an explicit leakage-check function that runs after every data load and asserts zero overlap between train and test base IDs. Defense in depth — when the cost of a silent bug is "every R² number in your paper is wrong," belt and suspenders is the correct posture.

Every R² in this entire project depends on the group split being right. This detail matters more than any model architecture choice I made.

### 3. MC Dropout for uncertainty — and a reality check

The forward model's job wasn't just to predict properties. It was to be the environment for a reinforcement learning agent that proposes recipes from OEM specs (coming up in Post 3 of this series). The RL agent needs to know not just what the model predicts, but *how confident the model is*. A recipe that the forward model is very uncertain about is one the agent should avoid — it's probably in a region of ingredient space where the model doesn't have training data.

I used MC Dropout: at inference time, leave dropout on, run 10 forward passes, take the mean as the prediction and the standard deviation as the uncertainty estimate.

```python
self.model.train()  # leave dropout on at inference
predictions = []
with torch.no_grad():
    for _ in range(self.n_samples):
        predictions.append(self.model(x).cpu().numpy())

mean = np.mean(predictions, axis=0)
std = np.std(predictions, axis=0)
```

The RL agent's reward subtracts a term proportional to this std, so the agent learns to prefer recipes the forward model is confident about.

This all works in theory. But does it actually work? I hadn't checked until I started writing this post. So I wrote a calibration script: run MC Dropout with N=50 samples on the held-out test set, and for every (sample, property) pair, compute the model's predicted std and the absolute residual. If MC Dropout is well calibrated, they should correlate strongly.

[IMAGE: mc_dropout_calibration.png — scatter plot, global r = 0.313]

**Global Pearson r = 0.313.** Directionally useful. Far from well calibrated.

The per-property story is more honest. On melt flow rate, per-property r = 0.76 — the model really does know when it doesn't know. On elongation at break (only 4 test samples), r = 0.89 but the n is too small to trust. And on tensile_break_50mm and tensile_yield_50mm, per-property r is *negative* — the model is actively confident where it's wrong. Mean predicted std is consistently lower than mean actual residual across every dense property, which means MC Dropout is *underestimating* uncertainty in this setup.

This isn't a failure of the technique. It's a reality check on what MC Dropout is: a cheap approximation to Bayesian inference that gives you a useful-but-biased uncertainty signal. For my downstream use — driving exploration in an RL agent that just needs to know which regions are more uncertain than others — it's probably good enough. But if I were reporting confidence intervals to a lab technician who was going to manufacture a recipe based on my prediction, MC Dropout would not be the right tool. Conformal prediction would be the principled fix.

## What I'd do with 10× the data

Almost none of what I'd try next is about architecture. At 15k+ real samples, tabular transformers like TabNet or FT-Transformer would start to pay off where they currently overfit. Conformal prediction would replace MC Dropout for calibrated intervals. Active learning — using model uncertainty to pick which recipes the lab should run next — would close the loop on data collection. Multi-task learning with property groupings (thermal, impact, tensile) might help the sparse targets.

But ordering matters. The single biggest lever on this model is still a lab technician running more trials. Everything else sits downstream of data.

## The general point

Almost all of this post is about things that aren't model architecture. That's the pattern I wish someone had told me when I started. At small-to-moderate dataset sizes, on real industrial data:

- The loss function handling missing values matters more than the architecture.
- The train/test split respecting the data's group structure matters more than the architecture.
- Knowing when your uncertainty estimates are lying to you matters more than the architecture.
- Picking a reasonable MLP and tuning dropout and weight decay gets you to within a few points of any fancier approach.

The boring model won. It won because of the un-boring decisions around it.

---

*Next in the series: the inverse problem — how this forward model became the environment for a PPO agent that proposes recipes from OEM specs. Coming soon.*

*Feedback and corrections welcome, especially if you've hit the group-split bug in your own work.*
