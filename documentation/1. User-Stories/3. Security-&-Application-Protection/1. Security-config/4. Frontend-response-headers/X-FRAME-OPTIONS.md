# X-Frame-Options

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Why The Frontend Header Was Added](#why-the-frontend-header-was-added)
- [Render Configuration](#render-configuration)
- [Frontend Behaviour](#frontend-behaviour)
- [Relationship With Backend Setting](#relationship-with-backend-setting)

## Purpose

The frontend `X-Frame-Options` header controls whether the deployed React application can be embedded inside an iframe.

This was added as part of the Lighthouse security header recommendations.

## Why The Frontend Header Was Added

Lighthouse reported that the frontend did not have a frame control policy.

This warning relates to clickjacking protection.

Without a frame control header, another website may be able to embed the frontend application inside an iframe.

## Render Configuration

The header was added in the Render frontend static site header configuration.

```text
/*
X-Frame-Options
DENY
```

This applies the header to all frontend routes.

## Frontend Behaviour

With this header enabled, the browser receives:

```text
X-Frame-Options: DENY
```

This means the frontend application cannot be embedded inside another website.

This protects the deployed React application from iframe-based clickjacking attacks.

## Relationship With Backend Setting

The frontend header is configured in Render because the React application is served as a static site.

The backend header is configured in Django because backend responses are served by the Django application.

Together they protect:

```text
Frontend React pages
Backend Django pages
```

from being embedded inside iframes.