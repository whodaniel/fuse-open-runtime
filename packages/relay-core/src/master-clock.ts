#!/usr/bin/env node

/**
 * Public boundary stub.
 *
 * The authority-bearing Master Clock daemon has been extracted to the private
 * `whodaniel/fuse-control-plane` repository under `services/master-clock`.
 *
 * Open runtime keeps relay/runtime primitives, but it no longer carries the
 * orchestration-root daemon implementation.
 */

console.error(
  [
    'master-clock has moved to the private control-plane repo.',
    'Use whodaniel/fuse-control-plane/services/master-clock for the extracted daemon.',
    'This open-runtime package intentionally retains only a stub at this path.',
  ].join('\n')
);

process.exitCode = 1;
