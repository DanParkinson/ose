# Dependencies

## Navigation

[← Back to README.md](/README.md)

[← Back to FRONTEND.md](/docs/documentation/frontend/FRONTEND.md)

## Table of Contents

- [Core Dependencies](#core-dependencies)
- [Testing Dependencies](#testing-dependencies)
- [Development Tools](#development-tools)

## Purpose

This document explains the main frontend dependencies used throughout the application.

The frontend uses a focused set of libraries for:

```text
UI rendering
routing
API communication
theming
testing
development tooling
```

Only explicitly installed and actively used dependencies are documented here.

## Core Dependencies

| Dependency            | Purpose                                                                 |
|-----------------------|-------------------------------------------------------------------------|
| `@chakra-ui/react`    | Component library used for UI, layout, theming, and design tokens       |
| `@emotion/react`      | Styling engine required by Chakra UI                                    |
| `axios`               | Handles communication with the Django REST Framework API                |
| `react-router-dom`    | Manages client-side routing and navigation                              |
| `react-icons`         | Provides reusable icon components                                       |
| `next-themes`         | Manages colour mode and theme support                                   |

## Testing Dependencies

| Dependency                   | Purpose                                                        |
|------------------------------|----------------------------------------------------------------|
| `vitest`                     | Test runner used for unit and component testing                |
| `@vitest/coverage-v8`        | Generates test coverage reports                                |
| `@testing-library/react`     | Tests components using user interaction patterns               |
| `@testing-library/jest-dom`  | Provides improved DOM assertions                               |
| `jsdom`                      | Simulates a browser environment for frontend testing           |

## Development Tools

| Dependency                     | Purpose                                                      |
|--------------------------------|--------------------------------------------------------------|
| `eslint`                       | Lints code and enforces code quality standards               |
| `@eslint/js`                   | Base ESLint configuration                                    |
| `eslint-plugin-react-hooks`    | Enforces correct usage of React Hooks                        |
| `eslint-plugin-react-refresh`  | Supports safe React Fast Refresh behaviour                   |
| `@vitejs/plugin-react`         | Enables React support in Vite                                |
| `@babel/core`                  | Babel compiler used for React compiler integration           |
| `@rolldown/plugin-babel`       | Babel integration for build tooling                          |
| `babel-plugin-react-compiler`  | Enables React compiler features                              |

## Dependency Philosophy

The frontend dependency stack is designed around:

```text
minimal abstraction
reusable UI systems
predictable API communication
lightweight tooling
component-driven architecture
modern React workflows
```

The project intentionally avoids unnecessary dependencies unless they provide clear architectural or development benefits.
