# Open Runtime Reconstruction Bootstrap

Date: 2026-03-20
Status: Bootstrap
Repo: `whodaniel/fuse-open-runtime`

## Purpose

This repository is the isolated destination for the open-source Fuse runtime,
protocol, SDK, local-node, and client-facing surfaces.

It exists so structural split work does not collide with ongoing feature work in
the live `whodaniel/fuse` monorepo.

## Intended Scope

This repo should become the home for:

1. public protocol definitions,
2. SDK and client contracts,
3. local runtimes and installable tooling,
4. public relay/runtime primitives,
5. wallet and NFT integration interfaces,
6. BYOK-compatible execution layers,
7. public adapters to proprietary control-plane services.

It should not become the home for:

1. Master Director implementation,
2. proprietary orchestration governance,
3. agency provisioning,
4. entitlement enforcement,
5. institutional control-plane automation.

## Current Bootstrap State

This repo was seeded from a snapshot of `whodaniel/fuse` `origin/main`.

That means:

1. the codebase still contains mixed public/private material,
2. nothing here should be treated as already-clean separation,
3. structural pruning and extraction still need to happen deliberately.

## Starting Artifacts

The initial boundary work happened in the source monorepo and should be treated
as the design input for this split:

1. `TNF_AUTHORITY_BOUNDARY_AND_AGENCY_STACK_SPEC`
2. `PROPRIETARY_CONTROL_PLANE_REPO_SPLIT_PLAN`
3. `PUBLIC_PRIVATE_REVIEW_COMPONENT_INVENTORY_2026-03-20`
4. `CONTROL_PLANE_FILE_LEVEL_EXTRACTION_MANIFEST_2026-03-20`

## First Migration Targets Into This Repo

1. `packages/control-plane-contracts`
2. public portions of `packages/relay-core`
3. SharedState public DTOs and client adapters
4. public runtime/client docs explaining the proprietary boundary

## Immediate Rules

1. Do not reintroduce proprietary control-plane logic here.
2. Do not depend on private source imports.
3. Prefer public contracts, clients, and stubs over hidden coupling.
4. Any mixed file must be split before it is treated as part of the open layer.

## Next Execution Steps

1. Migrate the current public boundary docs into this repo in cleaned form.
2. Move `packages/control-plane-contracts` here as an authoritative public package.
3. Split `packages/relay-core/src/broker-agent.ts` into:
   - public relay/runtime behavior
   - private governance and escalation behavior
4. Keep the public SharedState client surface here while removing admin-only
   control-plane facades.

## Migrated Into This Repo

1. `packages/control-plane-contracts`
2. backend SharedState public contract imports
3. backend SharedState public client boundary
4. backend SharedState admin controller/module removed from `AppModule`

## Still Pending Extraction Out Of This Repo

1. private orchestration internals
2. agency provisioning and entitlement logic

## Extracted Away From This Repo

1. `cloudflare-sharedstate` implementation moved to `whodaniel/fuse-control-plane`
2. this repo retains only public SharedState client and contract surfaces
3. admin-only `apps/backend/src/modules/shared-state` ingress moved to the private control plane
4. `packages/relay-core/src/master-clock.ts` is now a public boundary stub only
5. policy and escalation ownership for `packages/relay-core/src/broker-agent.ts` moved to `whodaniel/fuse-control-plane`

## Rebuilt In This Repo

1. runtime-only `packages/relay-core/src/broker-agent.ts`
2. broker heartbeat, worker selection, and relay dispatch behavior

## Still Private In Control Plane

1. broker policy gates
2. Director escalation
3. TWIP context-risk enforcement
4. orchestration ledger mutation

## Rebuilt As Public Facade

1. `apps/backend/src/modules/orchestrator` controller + client boundary
2. contract-based DTOs for orchestrator health, agents, registration, and execute
3. open-runtime no longer carries `AgentLifecycleManager`
4. open-runtime controller routes now depend directly on `OrchestratorClient`

The Redis-backed lifecycle manager, onboarding flow, and failure-recovery logic
belong in the private control-plane orchestrator package rather than the public
backend facade.

`orchestrator.service.ts` remains only as a compatibility shim for old imports;
it is no longer part of the runtime authority path.

## Private Control-Plane Integration

Open-runtime now expects a private orchestrator ingress reachable through:

1. `ORCHESTRATOR_API_BASE`
2. optional `ORCHESTRATOR_EXEC_AUTH`

The current bootstrap private server lives in
`whodaniel/fuse-control-plane/services/backend-orchestrator/src/server.ts` and
implements the route shape already consumed by `OrchestratorClient`.

## Confirmed Public Runtime Surfaces

1. `apps/backend/src/modules/relay`
2. relay REST management endpoints
3. relay WebSocket gateway
4. local relay fallback stores used when `@the-new-fuse/relay-core` is unavailable

The relay module remains in open-runtime because it is transport and messaging
infrastructure rather than control-plane authority.
