---
title: TryAgent CA
year: '2026'
description: Multi-tenant agent-box platform with isolated customer runtimes, runtime-node allocation, lifecycle operations, and five live OVHcloud nodes generating roughly $120 MRR.
stack: [TypeScript, Effect TS, Go, OVHcloud]
category: ai
status: active
updatedDate: 'Jun 26 2026'
role: Founder / product engineer
featured: true
order: 1
---

**TryAgent CA** is the agent platform I am building around a control-plane model for isolated customer runtimes.

The core architecture separates tenants, boxes, allocations, runtime nodes, and operations. A tenant owns one or more boxes; a box is the purchased isolated runtime; an allocation binds that box to infrastructure; runtime nodes provide capacity; operations handle lifecycle work like provision, start, stop, repair, and delete.

[![TryAgent Box Control Plane diagram showing client billing, the control plane, box allocation, runtime nodes, runtime backends, and the edge gateway](/projects/tryagent-box-control-plane.png)](/projects/tryagent-box-control-plane.png)

## Control Plane Model

The diagram is the system model I am working toward. Client and billing events enter the control plane, where Postgres acts as the source of truth for boxes, placement, operations, node registry state, and observed events. The allocator decides where a box should run, then runtime-node agents reconcile local state by executing box operations.

The important design choice is that a stable box identity is separate from the machine currently running it. The edge gateway routes by box identity, while allocations and runtime nodes describe placement. That makes future movement, repair, draining, and pooled-node execution possible without rewriting the customer-facing product object.

## Current Shape

- Five small runtime nodes are live on OVHcloud.
- Boxes are modeled as customer-owned runtimes instead of vague deployments.
- Allocation records separate product identity from infrastructure placement.
- Lifecycle work is handled as box operations, which keeps provisioning, repair, and future migration flows explicit.
- The system is currently generating roughly `$120 MRR`.

## Why It Matters

This is the kind of product engineering I want to keep doing: applied AI infrastructure where product boundaries, backend systems, runtime isolation, and operational clarity matter as much as the model-facing layer.
