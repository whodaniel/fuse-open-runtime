# Cloudflare SharedState Boundary Stub

The live `cloudflare-sharedstate` implementation has been extracted to the
private `whodaniel/fuse-control-plane` repository.

This open-runtime repo intentionally keeps only:

1. public SharedState contracts in `packages/control-plane-contracts`,
2. public backend client adapters in `apps/backend/src/modules/shared-state`.

It no longer carries the private Cloudflare Worker implementation, schemas, or
deployment configuration.
