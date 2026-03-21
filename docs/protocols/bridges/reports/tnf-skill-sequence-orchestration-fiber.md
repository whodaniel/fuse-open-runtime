# TNF Skill Sequence Orchestration Fiber

## Purpose

This bridge defines the connective fiber between sequential skill execution,
orchestrator scheduling, and live-session coordination.

It exists so the transition from one skill to the next is not implicit,
fragile, or dependent on human prompting alone.

## Meaning Of "Fiber"

The fiber is the durable connective tissue that carries:

1. the artifact produced by the current skill,
2. the normalized handoff schema for the next skill,
3. the execution order and ownership assigned by the orchestrator,
4. the scheduling or wakefulness requirements for when the next step should run,
5. temporal actor presence metadata when the orchestrator is invoked,
6. the coordination safety rule for live-session work.

In TNF terms, this is the bridge between:

1. skill implementation,
2. skill sequencing,
3. scheduling,
4. execution continuity.

## Why This Bridge Exists

Without an explicit fiber:

1. skills can execute correctly in isolation but fail at the handoff,
2. scheduling can exist without a stable artifact lineage,
3. live-session coordination can degrade into prompt-maintained attention,
4. fallback methods can accidentally become the architecture.

This bridge keeps the connective process explicit and protocol-shaped.

## Core Rule

Each sequential skill hop must preserve:

1. source artifact identity,
2. next-target declaration,
3. correlation/workstream continuity,
4. schedule or execution mode,
5. orchestrator presence or lease continuity when the step creates a coordinating actor,
6. safe coordination transport.

## Orchestrator Presence Rule

When a sequential bridge invokes `orchestrator-agent`, that invocation should
be treated as a temporal actor event rather than a purely internal thought.

The bridge should preserve enough metadata for:

1. local Sub-Director presence substantiation,
2. central actor recognition,
3. durable audit or replay of the orchestration act.

## Live Coordination Rule

When the next step involves a live Codex/terminal session:

1. shared-thread coordination is preferred,
2. repo artifacts are the durable fallback,
3. raw TTY injection is emergency-only operator knowledge,
4. unsafe transport must not be treated as the normal orchestration path.

## Architectural Implication

This bridge is one of the procedural structures TNF is aiming toward:

1. orchestration should not depend on repeated human nudging,
2. handoffs should remain durable across time and sessions,
3. scheduling should bind directly to skill lineage,
4. wakefulness should be externalized into protocol machinery such as heartbeat
   and Master Clock rather than left inside the prompt loop.
