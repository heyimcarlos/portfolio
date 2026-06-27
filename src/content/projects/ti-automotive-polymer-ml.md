---
title: TI Automotive Polymer ML
year: '2026'
description: Applied ML/RL system for proposing polymer blend recipes from OEM target specs, built around a forward model, physics features, uncertainty, and model-based search.
stack: [Python, PyTorch, scikit-learn, pandas, model-based RL]
category: ai
cover: /src/assets/projects/ti-auto/model-based-rl.png
status: active
updatedDate: 'May 28 2026'
role: Applied ML engineer
featured: true
order: 0
---

**TI Automotive Polymer ML** is the applied AI case study behind my current positioning: not a pure research pitch, but a software-and-modeling problem around messy industrial data, domain constraints, and a workflow useful to lab technicians.

## The Problem

The team needed a way to answer an inverse materials question: given target properties from an OEM spec, what polymer blend might produce them?

The dataset was small, sparse, and noisy: roughly 500 recipes, 50+ ingredients, missing lab measurements, and plant-level process variance. A generic model architecture was not enough. The useful work was in shaping the data, encoding domain knowledge from subject matter experts, and building a modeling loop that respected the physical constraints of the problem.

## System Shape

- Built a forward model that predicts polymer properties from candidate recipes.
- Reduced false correlations with null augmentation for passive materials like colorants and stabilizers.
- Grouped ingredients with SME guidance instead of relying only on clustering.
- Encoded physics features for melt flow rate, where naive averages fail.
- Compared neural architectures, masking missing targets instead of imputing lab measurements.
- Used the forward model as the environment for model-based inverse search.

![Model-based reinforcement learning approach](/src/assets/projects/ti-auto/model-based-rl.png)

## Result

The clearest gain came from domain features, not a bigger model. Melt flow rate moved from about `R2 = 0.43` to `R2 = 0.92` after adding the SME-provided physics features. Across the project, the lesson was practical: applied AI work is often a systems problem first and a model-choice problem second.

I wrote the public technical narrative here:

- [Polymer Project: Introduction](/blog/polymer-project-intro/)

## What This Proves

This is the kind of work I want more of: applied AI systems where backend engineering, product constraints, data quality, model behavior, and domain expertise all matter at the same time.
