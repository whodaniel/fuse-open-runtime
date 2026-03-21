# Prompt Composer Recovery Spec

Date: 2026-03-21
Status: Recovery specification
Repo: `whodaniel/fuse-open-runtime`

## Purpose

Recover the missing Prompt Composer as a first-class TNF product surface with:

1. reusable user-managed prompt snippets,
2. drag-and-drop composition into larger prompts,
3. workflow-builder embedding,
4. side-menu access,
5. drag-and-drop customizable menu structure.

## Current Diagnosis

In the current sparse open-runtime checkout, Prompt Composer is not present as
live product code.

What exists instead:

1. prompt template and snippet intent in docs such as
   `docs/PROMPT_TEMPLATING_ARCH.md`,
2. workflow-builder specs in docs such as
   `docs/guides/workflow-builder.md`,
3. archived Browser Hub HTML prototypes with drag/drop behavior under
   `docs/archive/electron-browser-hub/browser-hub-static-html/`.

What is missing:

1. live frontend route or module implementation,
2. active side-menu entry,
3. persisted prompt composer state contract in the current UI layer,
4. drag-and-drop menu customization in live product code.

## Product Rule

Prompt Composer should be treated as:

1. a workflow-builder module,
2. a side-menu surface,
3. a persistent personal workspace for snippets, groups, and prompts.

It should not be implemented as an isolated modal or hidden admin-only tool.

## Core User Capabilities

Every user should be able to:

1. create and save prompt snippets,
2. tag and reorder snippets,
3. group snippets into reusable collections,
4. compose larger prompts from snippets via drag-and-drop,
5. save those composed prompts,
6. launch Prompt Composer from the side menu,
7. embed Prompt Composer inside workflow builder,
8. customize side-menu ordering through drag-and-drop.

## Recovery Module Contract

The canonical contract lives in:

1. `packages/control-plane-contracts/src/prompt-composer.ts`

Key contract surfaces:

1. `PromptSnippet`
2. `PromptGroup`
3. `PromptDocument`
4. `PromptComposerState`
5. `PromptSidebarCustomization`
6. `PromptComposerModuleConfig`
7. `PromptComposerSnapshot`

## Required Placements

### Workflow Builder

Prompt Composer should be embeddable as a workflow-builder module so prompts
can be assembled as part of larger agentic flows.

Minimum workflow-builder responsibilities:

1. open composer inside builder context,
2. bind a composed prompt to a workflow step,
3. preserve snippet/group lineage in the workflow state.

### Side Menu

Prompt Composer should also be available as a persistent side-menu entry.

Minimum side-menu responsibilities:

1. launch composer directly,
2. pin recent prompts or groups,
3. support drag-and-drop reordering,
4. persist user menu customization.

## Drag-And-Drop Menu Customization

Menu customization should be a first-class behavior, not a separate hidden
preference screen.

Minimum requirements:

1. drag-and-drop reorder for menu items,
2. nested child items where supported,
3. visibility toggles,
4. persistence per user workspace,
5. safe defaults when no customization exists.

## Persistence Model

Prompt Composer persistence should capture:

1. snippets,
2. groups,
3. prompts,
4. active workspace selection,
5. side-menu customization,
6. workflow-builder placement settings.

The recovery contract does not yet prescribe the final storage backend, but the
shape should match `PromptComposerSnapshot`.

## Implementation Gap

This sparse repo does not currently contain the live frontend surface needed to
wire the module.

So the immediate recovery action in this repo is:

1. define the canonical contract,
2. define the implementation spec,
3. preserve the product requirements so the missing UI can be rebuilt against a
   stable interface.

## Next Implementation Step

When the live frontend surface is available again, implementation should start
by:

1. restoring the active app route for workflow builder,
2. adding a `PromptComposer` workspace page,
3. adding a side-menu entry backed by `PromptSidebarCustomization`,
4. binding workflow steps to `PromptDocument`,
5. implementing drag-and-drop ordering for snippets, groups, and menu items.
