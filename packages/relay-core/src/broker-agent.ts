#!/usr/bin/env node

/**
 * Public boundary stub.
 *
 * The mixed authority-bearing Broker Agent has been extracted to the private
 * `whodaniel/fuse-control-plane` repository under `services/broker-agent`.
 *
 * Open runtime will later receive only the public relay/runtime slice, after
 * policy gates, Director escalation, and orchestration-side control logic are
 * carved away.
 */

console.error(
  [
    'broker-agent has moved to the private control-plane repo.',
    'Use whodaniel/fuse-control-plane/services/broker-agent for the extracted ownership path.',
    'This open-runtime package intentionally retains only a stub at this path',
    'until the runtime-only broker slice is rebuilt.',
  ].join('\n')
);

process.exitCode = 1;
