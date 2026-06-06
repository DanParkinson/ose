# Content Security Policy (CSP)

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Why CSP Is Needed](#why-csp-is-needed)
- [Render Configuration](#render-configuration)
- [Policy Configuration](#policy-configuration)
- [Trusted Types](#trusted-types)
- [Current Implementation](#current-implementation)

## Purpose

Content Security Policy (CSP) controls which resources the browser is allowed to load and execute.

The platform uses CSP to reduce the risk of Cross-Site Scripting (XSS) attacks and to restrict the application to trusted resources.

## Why CSP Is Needed

Without a Content Security Policy, browsers may load scripts, styles, images, and other resources from unexpected locations.

Example:

```text
Application
        ↓
Browser Loads Resource
        ↓
Resource Executes
```

CSP allows the application to explicitly define which resources are trusted.

This recommendation was identified through Lighthouse security auditing.

## Render Configuration

The policy is configured through Render response headers.

Applied to:

```text
/*
```

Header:

```http
Content-Security-Policy:
default-src 'self';
script-src 'self';
style-src 'self' 'unsafe-inline';
img-src 'self' data:;
connect-src 'self' https://api.open-source-education.co.uk;
font-src 'self';
object-src 'none';
base-uri 'self';
frame-ancestors 'none';
form-action 'self';
upgrade-insecure-requests;
require-trusted-types-for 'script';
```

## Policy Configuration

The current policy allows:

### Scripts

```http
script-src 'self';
```

Only JavaScript served from the frontend application origin may execute.

### Styles

```http
style-src 'self' 'unsafe-inline';
```

Styles may be loaded from the application origin and inline styles required by Chakra UI.

### Images

```http
img-src 'self' data:;
```

Images may be loaded from the application origin and data URIs.

### API Requests

```http
connect-src 'self' https://api.open-source-education.co.uk;
```

The frontend may communicate with the deployed Django API.

### Fonts

```http
font-src 'self';
```

Fonts must originate from the application origin.

### Forms

```http
form-action 'self';
```

Forms may only submit to the application's own origin.

### Frames

```http
frame-ancestors 'none';
```

The application cannot be embedded inside an iframe.

### Objects

```http
object-src 'none';
```

Embedded browser plugins and object resources are blocked.

### HTTPS Enforcement

```http
upgrade-insecure-requests;
```

Insecure HTTP resource requests are automatically upgraded to HTTPS.

## Trusted Types

The policy includes:

```http
require-trusted-types-for 'script';
```

This enables Trusted Types enforcement in supported browsers.

Trusted Types helps prevent unsafe DOM-based script injection and provides additional protection against DOM-based XSS vulnerabilities.

## Current Implementation

The policy was designed around the current application architecture:

```text
React
Vite
Chakra UI
Django REST Framework API
```

The CSP was deployed through Render response headers and validated against the production application.

At the time of implementation, the policy successfully passed Lighthouse CSP checks and did not generate Content Security Policy violations during deployment testing.
