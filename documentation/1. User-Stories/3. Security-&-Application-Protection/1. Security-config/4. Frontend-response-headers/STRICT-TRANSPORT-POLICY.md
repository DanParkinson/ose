# Strict-Transport-Security

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Why HSTS Is Needed](#why-hsts-is-needed)
- [Render Configuration](#render-configuration)
- [Frontend Behaviour](#frontend-behaviour)
- [Policy Breakdown](#policy-breakdown)

## Purpose

Strict-Transport-Security (HSTS) instructs browsers to always communicate with the application using HTTPS.

This helps protect users from insecure connections and protocol downgrade attacks.

## Why HSTS Is Needed

Without HSTS, a browser may initially attempt to connect using HTTP before being redirected to HTTPS.

Example:

```text
User Visits Website
        ↓
HTTP Request
        ↓
HTTPS Redirect
```

During this process, attackers may attempt to intercept or modify traffic.

HSTS removes this risk by instructing browsers to automatically use HTTPS for future requests.

## Render Configuration

The platform configures HSTS through Render response headers.

```text
/*
Strict-Transport-Security
max-age=31536000; includeSubDomains; preload
```

This header is applied to all frontend routes served by Render.

## Frontend Behaviour

With this header enabled, browsers receive:

```text
Strict-Transport-Security:
max-age=31536000; includeSubDomains; preload
```

After receiving the header, supported browsers automatically use HTTPS when accessing the domain.

Future requests follow:

```text
User Visits Website
        ↓
Browser Uses HTTPS Immediately
        ↓
Secure Connection Established
```

No HTTP request is attempted first.

## Policy Breakdown

### max-age

```text
max-age=31536000
```

Instructs browsers to remember the HTTPS requirement for:

```text
31536000 seconds
=
1 year
```

### includeSubDomains

```text
includeSubDomains
```

Extends the policy to all subdomains of the site.

Example:

```text
open-source-education.co.uk
api.open-source-education.co.uk
admin.open-source-education.co.uk
```

### preload

```text
preload
```

Indicates that the domain is eligible for inclusion in browser HSTS preload lists.

Preloaded domains are hardcoded into supported browsers and are always accessed using HTTPS.