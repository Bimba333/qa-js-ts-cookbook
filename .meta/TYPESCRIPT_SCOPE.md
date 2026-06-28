# .meta/TYPESCRIPT_SCOPE.md

# TypeScript Course Scope

Version: 1.0

Status: Draft

---

# Purpose

This document defines the exact scope of the TypeScript volume.

Its purpose is to prevent scope creep and keep the course focused.

Whenever a new topic is proposed, it must first be evaluated against this document.

---

# Target Audience

The reader has already completed the JavaScript volume.

The reader already understands:

* JavaScript execution model
* variables
* functions
* objects
* arrays
* closures
* this
* prototypes
* classes
* asynchronous programming
* modules
* Error objects
* JSON
* Date

This course does NOT repeat JavaScript.

It builds directly on that knowledge.

---

# Primary Goal

Teach TypeScript as a tool for building large, maintainable JavaScript applications.

The student should understand:

* why TypeScript exists;
* what problems it solves;
* how the type system works;
* how the compiler helps detect mistakes;
* how to use TypeScript in real engineering projects.

---

# Course Philosophy

Every TypeScript feature must answer one question:

"What JavaScript limitation does this solve?"

Do not introduce syntax before introducing the underlying problem.

Always teach:

problem

↓

JavaScript limitation

↓

TypeScript solution

↓

real Automation QA example

---

# Included Topics

## Fundamentals

* Why TypeScript
* Installing TypeScript
* Compiler
* tsconfig.json
* Type annotations
* Type inference
* Primitive types
* Object types
* Arrays
* Tuples
* Enums (if included)
* Literal types

---

## Type System

* Union types
* Intersection types
* Type aliases
* Interfaces
* Optional properties
* Readonly
* Index signatures
* keyof
* typeof
* indexed access types

---

## Functions

* Function typing
* Optional parameters
* Default parameters
* Rest parameters
* Overloads
* this parameter

---

## Generics

* Generic functions
* Generic interfaces
* Generic classes
* Constraints
* Default generic parameters

---

## Classes

* Typed classes
* Access modifiers
* Abstract classes
* Implements
* Overrides

---

## Advanced Types

* Type narrowing
* Type guards
* Discriminated unions
* Conditional types
* Mapped types
* Utility types

---

## Modules

* Type-only imports
* Declaration merging
* Declaration files
* Module resolution (conceptual)

---

## Configuration

* tsconfig.json
* compiler options
* strict mode
* incremental compilation

---

## Automation QA

Examples should use:

* Playwright
* Page Objects
* Fixtures
* API testing
* Helpers
* Configuration
* Test data
* Assertions
* Report generation

Automation QA must remain the primary practical domain.

---

# Excluded Topics

This course does NOT teach:

* React
* Angular
* Vue
* NestJS
* Express
* Electron
* Prisma
* Zod
* tRPC
* GraphQL
* Babel internals
* SWC internals
* ts-node internals
* ESLint configuration
* Build systems
* Webpack
* Vite
* Rollup
* CI/CD
* Monorepos

These belong to separate volumes.

---

# Teaching Rules

Never repeat JavaScript chapters.

Assume JavaScript knowledge.

Never explain JavaScript syntax again.

Only explain what changes in TypeScript.

---

# Chapter Structure

Every chapter must contain:

* Connection with previous chapter
* Main question
* Motivation
* Theory
* Internal mechanism
* Mental model
* Practical examples
* Automation QA example
* Common mistakes
* Practice
* Summary
* Transition

---

# Practice Requirements

Every practice file should include:

* conceptual questions;
* code reading;
* compiler prediction;
* type analysis;
* debugging;
* Automation QA task;
* mini-project.

---

# Solution Requirements

Every solution must contain:

* Answer
* Explanation
* Common mistake
* Automation QA connection

---

# Quality Standard

The student should leave the course able to:

* read professional TypeScript;
* understand compiler diagnostics;
* design maintainable types;
* confidently work with Playwright TypeScript projects;
* continue learning advanced TypeScript independently.

---

# Freeze Policy

The ROADMAP must be approved before writing chapters.

Major architectural changes after chapter writing begins are discouraged.

Modules are frozen only after:

* editorial review;
* technical review;
* terminology review;
* practice review;
* solution review;
* roadmap synchronization.

Only factual corrections are allowed after freeze.
