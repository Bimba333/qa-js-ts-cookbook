# Course Change Policy

> Version: 2.1
> Status: Active
> Content-status authority: This document

---

## Purpose

This document defines how course architecture, specifications and completed educational content are frozen and modified.

The goal is to preserve:

- roadmap stability;
- chapter architecture;
- learning progression;
- scope boundaries;
- reviewed educational content.

---

## Freeze Terminology and Authority

The repository uses three independent freeze statuses.

### ROADMAP FROZEN

`ROADMAP FROZEN` protects chapter numbers, titles, order, module boundaries, prerequisites and scope. `.meta/ROADMAP.md` is the authority for roadmap architecture.

Roadmap freeze does not declare chapter content complete or reviewed.

### SPECIFICATION FROZEN

`SPECIFICATION FROZEN` protects an approved project specification: mandatory scope, exclusions, scenario minimums, milestones, Definition of Done and review rubric. The specification and its status are recorded in `.meta/ROADMAP.md`.

Specification freeze does not declare the educational content that implements the specification complete or reviewed.

### CONTENT FROZEN

`CONTENT FROZEN` protects the completed educational content of an explicit chapter range and all associated artifacts listed in this policy.

This file is the sole authority for content-freeze status. A module is `CONTENT FROZEN` only when the Content Freeze Registry contains an entry with that exact status. A conversational report, roadmap status or specification status alone is not a content-freeze record.

---

## Content Status Vocabulary

Only the following workflow statuses are used for module content:

- `DRAFT`: creation or review is incomplete;
- `TECHNICALLY READY`: technical review passed, but final editorial review or audit remains;
- `READY TO FREEZE`: required reviews passed, but the final freeze audit or registry update remains;
- `REVIEWED BASELINE`: a completed milestone inside a larger roadmap module has passed the required technical and final quality reviews but is not content-frozen;
- `CONTENT FROZEN`: the final audit passed and the authoritative registry records the freeze;
- `REOPENED`: previously frozen content is undergoing an approved semantic change or full re-review.

Intermediate statuses may appear in review reports. `REVIEWED BASELINE` may also appear in the subordinate Reviewed Baseline Log defined below. Only `CONTENT FROZEN` and `REOPENED` are recorded in the authoritative Content Freeze Registry.

---

## Freeze Granularity and Reviewed Baselines

### Module-level Content Freeze

New `CONTENT FROZEN` records must use the complete module boundary defined by `.meta/ROADMAP.md`. A module that contains one chapter may therefore use a single-chapter range, but an individual chapter inside a multi-chapter roadmap module cannot receive a separate `CONTENT FROZEN` record.

The Content Freeze Registry is non-overlapping:

- ranges cannot overlap or be nested;
- partial-module rows cannot later be merged into or replaced by an aggregate module row;
- existing rows cannot be deleted or replaced to change their range;
- a new module row is appended only after the complete roadmap module passes its final freeze audit;
- reopening and refreezing update the status and freeze basis of the existing row for the same exact range;
- duplicate rows for the same range are prohibited.

Existing registry rows remain authoritative and are not retroactively reinterpreted by this clarification.

### REVIEWED BASELINE

`REVIEWED BASELINE` is a reviewed-but-unfrozen milestone state for completed chapters or contiguous completed milestones inside a larger roadmap module. It is subordinate review evidence, not a content-freeze status, and does not create a second content-status authority.

A baseline may be recorded only in the Reviewed Baseline Log in this policy after the relevant technical and final quality reviews pass with no blocker or unresolved major finding. Baseline ranges may overlap the eventual complete module range because they do not appear in the Content Freeze Registry and do not assert `CONTENT FROZEN`.

For a `REVIEWED BASELINE`:

- `REOPENED` does not apply because the content is not `CONTENT FROZEN`;
- a technical or conceptual change, practice or solution logic change, or semantic diagram change invalidates the affected review evidence and requires the relevant technical and final quality reviews again;
- an editorial-only change requires the affected final quality review again;
- an obvious typo, punctuation, formatting or link-only correction requires a lightweight review and directly affected validation;
- corrections required by later integration are allowed within the frozen roadmap and specification boundaries, but the affected baseline reviews must be repeated before the baseline can again be relied upon;
- normal development of later chapters does not invalidate an unchanged baseline;
- the final module freeze incorporates all baseline evidence but still requires complete full-range reviews and validations.

Baseline log entries are append-only historical evidence. Each entry attests only the artifact state identified by its review basis at the time of the audit. A later semantic change makes that entry inapplicable to the current artifact state until a successful affected review appends new baseline evidence. Entries are not removed, replaced or marked `REOPENED`. When the complete module later becomes `CONTENT FROZEN`, its authoritative registry row supersedes baseline records for content-status decisions while the baseline entries remain as review history.

#### Reviewed Baseline Log

| Chapter range | Roadmap module | Status | Review basis |
| --- | --- | --- | --- |
| 250 | Финальный промышленный проект — Требования и критерии готовности проекта | REVIEWED BASELINE | Technical review: 9.7/10, TECHNICALLY READY; final quality review: 9.9/10, READY FOR CHAPTER FREEZE; governance baseline audit passed. |
| 251 | Финальный промышленный проект — Архитектурные решения и план реализации | REVIEWED BASELINE | Technical review: 9.7/10, TECHNICALLY READY; final quality review: 9.9/10, READY FOR REVIEWED BASELINE; governance baseline audit passed. |
| 252 | Финальный промышленный проект — Каркас, configuration и environments | REVIEWED BASELINE | Technical/runtime review: 9.8/10, TECHNICALLY READY; final quality review: 9.9/10, READY FOR REVIEWED BASELINE; governance baseline audit passed. |

No baseline is created automatically by a review report. Adding a baseline log entry requires a separate baseline audit that confirms the range, review evidence and unchanged roadmap/specification boundaries.

---

## Content Freeze Eligibility

A complete roadmap module may become `CONTENT FROZEN` only when all of the following conditions pass:

1. Module creation is complete and its boundary matches `.meta/ROADMAP.md`.
2. All required theory files exist.
3. All required examples exist and required example checks pass.
4. All required practice files exist.
5. All required solution files exist and correspond to the practice.
6. Required local assets and module-specific configuration exist where applicable.
7. `SUMMARY.md` entries are complete, ordered and synchronized.
8. Technical review passes with no blocker or unresolved major finding.
9. Editorial, language and pedagogical review passes with no blocker or unresolved major finding.
10. The final freeze audit passes.
11. Every validation command required by repository policy and the module review exits successfully.
12. No future-topic leakage or scope expansion remains.
13. Earlier frozen content remains unchanged unless separately approved under this policy.
14. The final audit records its evidence and updates the Content Freeze Registry to `CONTENT FROZEN`.

Passing reviews without the registry update means `READY TO FREEZE`, not `CONTENT FROZEN`.

---

## Frozen Artifact Boundary

For a registry chapter range, `CONTENT FROZEN` includes:

- theory files in `docs/`;
- examples and their observable behavior;
- practice files and task requirements;
- solution files and solution logic;
- local assets used by the module;
- module-specific configuration where applicable;
- diagrams and their educational meaning;
- the corresponding `SUMMARY.md` alignment.

Shared repository infrastructure is outside a module's content boundary unless the registry freeze basis explicitly includes module-specific behavior. Changes to shared infrastructure must still preserve all frozen content and pass the applicable validation.

---

## Content Freeze Registry

This table is the authoritative, persistent content-freeze record. One row represents one frozen or reopened module range. Git history provides the audit trail for registry changes.

| Chapter range | Module | Status | Freeze basis | Future edits |
| --- | --- | --- | --- | --- |
| 1-96 | JavaScript | CONTENT FROZEN | Legacy repository record: the previous policy declared this range `FROZEN`, and repository tag `v1.0-javascript` preserves the completed volume. A detailed historical review record is not stored in metadata. | This policy applies. |
| 166-175 | Playwright Test и основы UI-автоматизации | CONTENT FROZEN | Technical review, final quality review, final freeze audit and required validations passed. | This policy applies. |
| 176-185 | Fixtures и архитектура UI-слоя | CONTENT FROZEN | Technical review, final quality review, final freeze audit and required validations passed. | This policy applies. |
| 186-196 | Тестирование REST API | CONTENT FROZEN | Technical review, final quality review, final freeze audit and required validations passed. | This policy applies. |
| 197-206 | Тестирование gRPC | CONTENT FROZEN | Technical review, final quality review, final freeze audit and required validations passed. | This policy applies. |
| 207-215 | Тестирование PostgreSQL | CONTENT FROZEN | Technical review, final quality review, final freeze audit and required validations passed. | This policy applies. |
| 216-224 | Конфигурация, тестовые данные и общая инфраструктура | CONTENT FROZEN | Technical review, final quality review, final freeze audit and required validations passed. | This policy applies. |
| 225-231 | Диагностика и отчётность | CONTENT FROZEN | Technical review, final quality review, final freeze audit and required validations passed. | This policy applies. |
| 232-238 | Стабильность и масштабирование выполнения | CONTENT FROZEN | Technical review, final quality review, final freeze audit and required validations passed. | This policy applies. |
| 239-244 | CI и эксплуатация проекта | CONTENT FROZEN | Technical review, final quality review, validator technical re-review, final freeze audit and required validations passed. | This policy applies. |
| 245-249 | Интеграция Automation Framework | CONTENT FROZEN | Technical review, final quality review, final freeze audit and required validations passed. | This policy applies. |

### Legacy Protected Content Without a Registry Freeze

The following ranges have been treated as frozen in prior review workflows, but the repository does not contain sufficient persistent evidence to certify them retroactively as `CONTENT FROZEN`:

| Chapter range | Module | Repository-recorded status | Policy treatment |
| --- | --- | --- | --- |
| 97-159 | TypeScript | `ROADMAP FROZEN`; module freeze conditions are described in `.meta/TYPESCRIPT_SCOPE.md`, but no persistent final content-freeze record exists. | Preserve as legacy protected content. A confirmation audit may add a `CONTENT FROZEN` registry row without rewriting the module. |
| 160-165 | Основы Automation QA Framework | Prior freeze is report-only; no persistent content-freeze record exists. | Preserve as legacy protected content. A confirmation audit may add a `CONTENT FROZEN` registry row without rewriting the module. |

Legacy protected content follows the same edit restrictions as `CONTENT FROZEN`. The label does not claim that the new registry mechanism was completed historically.

---

## Recording a Content Freeze

The final freeze audit must:

1. identify the exact roadmap module and chapter range;
2. verify every eligibility condition;
3. list the review evidence and validation commands used;
4. confirm the frozen artifact boundary;
5. confirm that earlier frozen content and future chapters were not changed;
6. add or update exactly one registry row with status `CONTENT FROZEN` and a concise freeze basis;
7. report the registry change in the final audit result.

No marker file, checksum, release tag or one-file-per-module manifest is required.

The freeze is auditable by reading this policy, checking the registry row, reviewing its Git history and rerunning the validations named in the freeze basis or final audit.

For a multi-chapter module developed incrementally, the final freeze audit additionally requires:

1. every chapter in the roadmap module to be complete;
2. all milestone reviews to be complete or superseded by full-range review evidence;
3. a full-range technical review and final quality review;
4. the final execution audit and all required frozen regressions;
5. final repository and course-consistency checks;
6. completion of any final scoring or readiness chapter assigned by the roadmap;
7. exactly one non-overlapping Content Freeze Registry row for the complete module boundary.

Reviewed baselines do not reduce these final module requirements.

---

## Changes After Content Freeze

No frozen artifact may be edited silently.

### Lightweight Review

The following non-semantic corrections may be made without reopening the module:

- an obvious spelling or punctuation correction;
- a broken local link fix that does not change learning flow;
- a formatting defect;
- non-semantic whitespace.

A lightweight review must confirm that the change is non-semantic, affects no learning outcome, preserves roadmap and scope, and passes the directly affected validation plus repository-required checks. The change report must identify the frozen range and correction. The registry status remains `CONTENT FROZEN`.

### Full Content Review

The module must be set to `REOPENED` in the registry before any of the following changes:

- technical or conceptual correction;
- example behavior change;
- practice requirement change;
- solution logic change;
- chapter scope or learning-outcome change within the approved roadmap boundary;
- adding or removing an example;
- changing the educational meaning of a diagram;
- changing a public API or dependency used by module artifacts;
- changing module-specific configuration behavior;
- any other change that affects learning outcomes or validation behavior.

The approved change must receive the relevant technical, editorial, practice, solution and validation reviews. The module returns to `CONTENT FROZEN` only through the complete refreeze procedure.

`REOPENED` applies only to content already recorded as `CONTENT FROZEN`. Reviewed but unfrozen content follows the `REVIEWED BASELINE` change rules and does not require a registry status change.

### Architecture Review

Architecture review and prior `.meta/ROADMAP.md` approval are always required before changing:

- chapter numbering;
- chapter title;
- chapter order;
- roadmap scope;
- module boundary;
- prerequisite relationship;
- movement of content between chapters;
- roadmap structure;
- final-project specification scope or acceptance criteria.

Content review cannot authorize an architecture or specification change.

---

## Reopening and Refreezing

To reopen a `CONTENT FROZEN` module:

1. obtain explicit approval for the exact semantic change;
2. verify whether architecture review is also required;
3. change the registry status to `REOPENED` and state the approved reason in the freeze-basis column;
4. modify only the approved artifact boundary;
5. run the full relevant review and validation set.

To refreeze the module:

1. satisfy every Content Freeze Eligibility condition again;
2. resolve every blocker and major finding;
3. complete a new final freeze audit;
4. update the registry status to `CONTENT FROZEN` with the new freeze basis.

A failed or incomplete refreeze leaves the module `REOPENED`.

---

## Roadmap Freeze Mechanism

A future roadmap section becomes `ROADMAP FROZEN` only when:

1. an explicit architecture review approves the complete section;
2. all approval checks required by that review pass;
3. `.meta/ROADMAP.md` records the approved architecture with status `FROZEN`;
4. the final review report records the successful freeze.

No separate marker file is required.

A detailed project specification embedded in `.meta/ROADMAP.md` uses the independent `SPECIFICATION FROZEN` status. Its mandatory scope, optional scope, exclusions, scenario minimums, milestone deliverables, Definition of Done and review rubric remain fixed until a new explicit specification architecture review is approved.

---

## Codex Workflow

Before modifying existing course content, Codex must:

1. read `.meta/ROADMAP.md`;
2. read the relevant scope document;
3. read `.meta/CHANGE_POLICY.md`;
4. locate the range in the Content Freeze Registry or Legacy Protected Content table;
5. classify the requested change as lightweight, full content review or architecture review;
6. validate that approval and review requirements are satisfied.

If the change violates this policy:

```text
STOP
```

Codex must not modify files. Instead Codex must report:

- affected section;
- requested change;
- policy conflict;
- possible resolutions.

Codex must wait for explicit confirmation before continuing.

---

## Policy Precedence

- `.meta/ROADMAP.md` owns course architecture and frozen project specifications.
- `.meta/CHANGE_POLICY.md` owns content status and post-freeze change control.
- Volume scope documents define topic boundaries and may add stricter review requirements.
- `.meta/PROJECT.md`, `.meta/CODEX_RULES.md` and `AGENTS.md` require these checks but do not duplicate the content registry.
- If two authority documents impose different restrictions, the stricter compatible rule applies. A true contradiction requires `STOP` and policy review before any content edit.
