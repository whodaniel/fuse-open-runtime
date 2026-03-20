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
3. backend SharedState client/facade split

## Still Pending Extraction Out Of This Repo

1. private orchestration internals
2. agency provisioning and entitlement logic

## Extracted Away From This Repo

1. `cloudflare-sharedstate` implementation moved to `whodaniel/fuse-control-plane`
2. this repo retains only public SharedState client and contract surfaces
3. `packages/relay-core/src/master-clock.ts` is now a public boundary stub only
4. `packages/relay-core/src/broker-agent.ts` is now a public boundary stub only
