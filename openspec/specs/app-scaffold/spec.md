# app-scaffold Specification

## Purpose

Define the base mobile application stack and architectural boundaries for Cashi Mobile.

## Requirements

### Requirement: Base stack and test runner

The system MUST initialize React Native + Expo + TypeScript with Expo Router and a runnable test command from the first scaffold commit.

#### Scenario: Scaffold ready

- GIVEN a repository for the mobile app
- WHEN the base scaffold is created
- THEN a route structure compatible with Expo Router exists under `app/`
- AND `npm test` or an equivalent test command executes at least one initial test

### Requirement: Hook-first boundaries

The system MUST enforce render-only components and SHALL keep business logic in hooks and services.

#### Scenario: Layer separation

- GIVEN UI screens and components
- WHEN imports and responsibilities are reviewed
- THEN components do not contain business rules
- AND logic resides in `useTransactions`, `useCategories`, `useTransactionForm`, and `useCategoryForm`
