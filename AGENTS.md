# AGENTS.md

# Repository Agent Instructions

Version: 1.0

---

# Purpose

This repository contains a long-form educational course.

The course teaches:

* JavaScript
* TypeScript
* Automation QA
* Playwright
* API Testing
* gRPC
* Database Testing
* Framework Architecture

The repository is written in Russian.

Before making any changes always read:

1. `.meta/PROJECT.md`
2. `.meta/STYLE_GUIDE.md`
3. `.meta/ROADMAP.md`
4. `SUMMARY.md`

These files define the architecture of the project.

---

# Agent Responsibilities

The agent is responsible for:

* creating chapters;
* updating existing chapters;
* creating examples;
* creating practice;
* creating solutions;
* updating the table of contents.

The agent is not allowed to redesign the course architecture.

---

# Repository Structure

```text
docs/
examples/
practice/
solutions/
assets/
playground/

.meta/

README.md
SUMMARY.md
AGENTS.md
```

Never change this structure unless explicitly requested.

---

# Chapter Workflow

When creating a new chapter:

1. Read `.meta/ROADMAP.md`.
2. Determine the next chapter.
3. Create the Markdown file.
4. Create example code if needed.
5. Create the corresponding practice file.
6. Create the corresponding solutions file.
7. Update `SUMMARY.md`.
8. Verify links and filenames.

---

# Mandatory Chapter Structure

Every chapter must contain:

1. Title
2. Learning objectives
3. Motivation
4. Theory
5. Internal mechanics
6. Mental model
7. Code examples
8. Common mistakes
9. Practical usage
10. Automation QA usage
11. Practice
12. Summary

Do not omit sections.

---

# Writing Rules

Follow `.meta/STYLE_GUIDE.md`.

Never invent a different writing style.

Keep terminology consistent.

Always explain:

* what;
* why;
* how;
* internal behavior;
* practical usage.

Mechanisms are more important than syntax.

---

# Practice Rules

Every chapter must have a corresponding practice file.

Practice must include:

* understanding questions;
* code reading;
* implementation tasks;
* debugging tasks;
* QA-oriented tasks;
* one mini project.

Practice files must never contain answers.

---

# Solution Rules

Each practice file must have a matching solution file.

Every solution contains:

* complete solution;
* explanation;
* common mistakes;
* possible improvements.

---

# Example Rules

Examples must:

* compile unless intentionally demonstrating an error;
* be minimal;
* demonstrate one concept at a time;
* use meaningful names.

Avoid unnecessary complexity.

---

# Intentional Invalid Examples

Some files in `/examples/` are intentionally invalid JavaScript.

These files are used to demonstrate syntax errors, invalid code, and debugging situations.

They must NOT be:

* fixed;
* rewritten;
* deleted;
* validated with `node --check`;
* normalized into valid JavaScript.

Examples include:

* syntax-error demos;
* broken code for debugging tasks;
* educational invalid examples.

If a file contains:

```javascript
// INTENTIONAL SYNTAX ERROR
```

or:

```javascript
// EDUCATIONAL INVALID EXAMPLE
```

then:

* it MUST be excluded from validation;
* it MUST be treated as documentation material;
* Codex must preserve the intentional mistake.

Validation rule:

* `node --check` applies only to `examples/**/valid/**` or files without intentional-error markers;
* files marked as intentional-error are excluded;
* files named or organized as syntax-error, invalid, or broken examples must be reviewed as teaching material before any validation or edit.

Codex must NEVER:

* "fix" syntax-error examples;
* "clean" broken code in the examples folder;
* remove intentional mistakes;
* normalize invalid code that exists for teaching.

---

# Automation QA Rules

Whenever possible connect the topic with:

* Playwright;
* REST API;
* gRPC;
* PostgreSQL;
* helpers;
* fixtures;
* assertions;
* reporting;
* framework architecture.

---

# File Naming

Use lowercase.

Use kebab-case.

Examples:

```text
01-what-is-javascript.md
02-execution-context.md
03-call-stack.md
```

Do not use spaces.

Do not use CamelCase.

---

# Updating SUMMARY.md

Whenever a new chapter is created:

* add it to `SUMMARY.md`;
* preserve the learning order;
* do not add chapters that do not exist.

---

# Quality Checklist

Before finishing any task verify:

* the chapter is complete;
* no placeholder text exists;
* no TODO exists;
* examples are explained;
* practice exists;
* solutions exist;
* links are valid;
* filenames follow project conventions.

---

# Forbidden

Do not:

* redesign the roadmap;
* change project architecture;
* skip mandatory sections;
* leave empty files;
* leave unfinished chapters;
* duplicate existing content;
* introduce unexplained concepts.

---

# Completion Rule

A task is complete only if:

* requested files are created or updated;
* all related files are synchronized;
* the repository remains internally consistent.

If a request conflicts with `.meta/PROJECT.md` or `.meta/ROADMAP.md`, follow those documents rather than inventing a new structure.
