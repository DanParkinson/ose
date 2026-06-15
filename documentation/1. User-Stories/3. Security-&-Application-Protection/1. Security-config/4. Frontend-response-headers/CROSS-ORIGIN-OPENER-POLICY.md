# Cross-Origin-Opener-Policy

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Why COOP Is Needed](#why-coop-is-needed)
- [Render Configuration](#render-configuration)
- [Frontend Behaviour](#frontend-behaviour)
- [Policy Behaviour](#policy-behaviour)

## Purpose

Cross-Origin-Opener-Policy (COOP) controls how the browser isolates the application's browsing context from pages opened from other origins.

This helps protect the application from certain cross-origin attacks and improves browser isolation.

## Why COOP Is Needed

By default, windows and tabs opened from different origins can sometimes retain references to one another.

Example:

```text
Application
        ↓
Opens External Website
        ↓
Window Relationship Maintained
```

This can expose communication channels between different origins.

COOP allows the application to request stronger browser isolation.

This recommendation was identified during Lighthouse security auditing.

## Render Configuration

The platform configures COOP through Render response headers.

```text
/*
Cross-Origin-Opener-Policy
same-origin
```

This header is applied to all frontend routes served by Render.

## Frontend Behaviour

With this header enabled, browsers receive:

```text
Cross-Origin-Opener-Policy: same-origin
```

This instructs the browser to place the application into its own browsing context group.

As a result:

```text
Application
        ↓
Browser Isolation Applied
        ↓
Cross-Origin Windows Separated
```

The application is isolated from documents originating from other domains.

## Policy Behaviour

The platform currently uses:

```text
same-origin
```

Under this policy:

```text
Same-origin pages
    ↓
Can remain in the same browsing context group

Cross-origin pages
    ↓
Are isolated into separate browsing context groups
```

This helps reduce the risk of:

```text
Cross-origin information leakage
Cross-window attacks
Unexpected cross-origin interactions
```

and aligns the application with modern browser security recommendations.