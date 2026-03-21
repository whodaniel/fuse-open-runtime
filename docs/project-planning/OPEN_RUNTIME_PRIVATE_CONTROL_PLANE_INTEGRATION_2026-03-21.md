# Open Runtime Private Control-Plane Integration

Date: 2026-03-21
Status: Bootstrap
Repo: `whodaniel/fuse-open-runtime`
Depends On:

1. `docs/project-planning/OPEN_RUNTIME_RECONSTRUCTION_BOOTSTRAP_2026-03-20.md`

## Purpose

Document the minimal integration contract between the public open-runtime repo
and the private `whodaniel/fuse-control-plane` orchestrator ingress.

## Environment Contract

The backend orchestrator client reads:

1. `ORCHESTRATOR_API_BASE`
2. `ORCHESTRATOR_EXEC_AUTH`

Recommended local bootstrap values:

```bash
ORCHESTRATOR_API_BASE=http://127.0.0.1:4010
ORCHESTRATOR_EXEC_AUTH=
```

`ORCHESTRATOR_EXEC_AUTH` is optional for the current bootstrap server and should
be left blank locally unless the private ingress has been hardened to require a
bearer token.

## Expected Private Routes

`apps/backend/src/modules/orchestrator/orchestrator.client.ts` expects:

1. `GET /orchestrator/health`
2. `POST /orchestrator/register`
3. `POST /orchestrator/heartbeat`
4. `GET /orchestrator/agents`
5. `GET /orchestrator/agents/:agentId`
6. `POST /orchestrator/execute`
7. `GET /orchestrator/tnf-status`

## Bootstrap Flow

1. In `whodaniel/fuse-control-plane`, start the private ingress:

```bash
cd services/backend-orchestrator
npm run dev
```

2. In `whodaniel/fuse-open-runtime`, point backend env to that ingress:

```bash
ORCHESTRATOR_API_BASE=http://127.0.0.1:4010
ORCHESTRATOR_EXEC_AUTH=
```

3. Start the open-runtime backend normally.

4. Verify private linkage from the open-runtime side:

```bash
curl http://127.0.0.1:4010/orchestrator/health
curl http://127.0.0.1:4010/orchestrator/tnf-status
```

## Current Boundary

Open-runtime owns:

1. controller routes and DTO contracts,
2. `OrchestratorClient`,
3. environment-driven connectivity to the private ingress.

Control-plane owns:

1. heartbeat authority,
2. lifecycle management,
3. gateway execution policy and idempotency,
4. TNF health and status aggregation,
5. the private `/orchestrator/*` ingress implementation.

## Next Hardening Steps

1. require `ORCHESTRATOR_EXEC_AUTH` on the private ingress,
2. replace in-memory adapters with real persistence and policy backends,
3. add a deployment target for the private orchestrator server,
4. add integration tests that hit the private ingress from open-runtime.
