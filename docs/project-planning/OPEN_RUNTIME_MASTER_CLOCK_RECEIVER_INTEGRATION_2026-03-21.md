# Open Runtime Master Clock Receiver Integration

Date: 2026-03-21
Status: Bootstrap
Repo: `whodaniel/fuse-open-runtime`

## Purpose

Define the public open-runtime side of the TNF Master Clock boundary now that
the canonical issuer lives in the private control-plane repo.

This document covers the receiver path only:

1. local node registration,
2. signal retrieval,
3. signature verification,
4. signal decryption,
5. Local Sub-Director dispatch,
6. signed acknowledgement back to TNF Central.

## Boundary

Private control-plane owns:

1. pulse issuance,
2. canonical schedule,
3. membership gating,
4. central signing,
5. encrypted signal generation,
6. acknowledgement ledgering.

Open-runtime owns:

1. receiver-side verification,
2. receiver-side decryption,
3. local dispatch into runtime continuity and stall-defense hooks,
4. signed node acknowledgement,
5. local polling/bootstrap path.

## Current Public Receiver Components

1. `packages/control-plane-contracts/src/master-clock.ts`
2. `packages/relay-core/src/services/MasterClockControlClient.ts`
3. `packages/relay-core/src/services/MasterClockSignalReceiver.ts`
4. `packages/relay-core/src/services/RelayRuntimeSubDirector.ts`
5. `packages/relay-core/src/services/MasterClockPollingReceiver.ts`
6. `packages/relay-core/src/master-clock.ts`

## Runtime Trust Shape

Current bootstrap behavior is:

1. signal signature is mandatory,
2. per-node encryption is mandatory,
3. wallet and NFT provide enrollment evidence,
4. node signing and encryption keys provide runtime cryptographic identity.

If `MASTER_CLOCK_TRUSTED_SIGNING_PUBLIC_KEY_PEM` is configured, receiver trust
is anchored to that key.

If it is not configured, the receiver can still verify cryptographic integrity
using the envelope signing key, but that is only `envelope_bootstrap` trust and
should not be treated as the final production trust model.

## Receiver Bootstrap Env

Required:

1. `MASTER_CLOCK_API_BASE`
2. `MASTER_CLOCK_NODE_ID`
3. `MASTER_CLOCK_WALLET_ADDRESS`
4. `MASTER_CLOCK_NFT_ID`
5. `MASTER_CLOCK_NODE_SIGNING_PRIVATE_KEY_PEM`
6. `MASTER_CLOCK_NODE_ENCRYPTION_PRIVATE_KEY_PEM`

Optional:

1. `MASTER_CLOCK_NODE_TENANT_SCOPE`
2. `MASTER_CLOCK_AGENCY_ID`
3. `MASTER_CLOCK_NODE_LABEL`
4. `MASTER_CLOCK_TRUSTED_SIGNING_PUBLIC_KEY_PEM`
5. `MASTER_CLOCK_EXPECTED_ID`
6. `MASTER_CLOCK_CONTROL_AUTH`
7. `MASTER_CLOCK_AUTO_REGISTER`
8. `MASTER_CLOCK_POLL_INTERVAL_MS`
9. `MASTER_CLOCK_SUBDIRECTOR_AGENT_ID`
10. `MASTER_CLOCK_STALL_CHANNELS`

## Receiver Flow

1. open-runtime boots `packages/relay-core/src/master-clock.ts`
2. node derives its public keys from configured private keys
3. node auto-registers with TNF Central unless disabled
4. node polls `GET /master-clock/signals/latest/:nodeId`
5. receiver verifies the central signature
6. receiver decrypts the envelope with the local node encryption key
7. receiver validates target node, wallet, NFT, and freshness
8. Local Sub-Director dispatch runs
9. node signs and posts `POST /master-clock/signals/ack`

## Local Sub-Director Behavior

The bootstrap runtime adapter currently does the minimum needed to keep local
continuity active:

1. records a local heartbeat for the configured Sub-Director agent id,
2. records local runtime activity for the verified signal,
3. touches configured continuity channels in the stall detector when
   `stall_defense.required` is true.

This is intentionally public/runtime behavior, not central orchestration
authority.

## Remaining Gaps

1. certificate or attestation-backed runtime trust is not implemented yet
2. receiver-side persistent state is still memory-only
3. local continuity dispatch should eventually feed a broader node-health and
   agent-state export back to TNF Central
