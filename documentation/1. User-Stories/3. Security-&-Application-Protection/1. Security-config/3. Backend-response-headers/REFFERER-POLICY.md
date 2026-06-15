# Referrer Policy

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Why Referrer Policies Are Needed](#why-referrer-policies-are-needed)
- [Django Configuration](#django-configuration)
- [Backend Behaviour](#backend-behaviour)
- [Policy Behaviour](#policy-behaviour)

## Purpose

The Referrer Policy controls how much referral information browsers include when users navigate between pages and websites.

This helps reduce the amount of potentially sensitive URL information shared with external sites.

## Why Referrer Policies Are Needed

When a user follows a link, browsers may send a `Referer` header containing information about the page the user came from.

Example:

```text
Current Page
        ↓
User Clicks Link
        ↓
Browser Sends Referer Header
        ↓
Destination Website Receives Referrer Information
```

Without a policy, more information than necessary may be shared with external websites.

## Django Configuration

The platform configures a Referrer Policy through Django security settings.

```py
SECURE_REFERRER_POLICY = "strict-origin-when-cross-origin"
```

## Backend Behaviour

With this setting enabled, Django automatically sends:

```text
Referrer-Policy: strict-origin-when-cross-origin
```

with responses.

This instructs browsers how referral information should be handled when navigating away from the platform.

## Policy Behaviour

The `strict-origin-when-cross-origin` policy behaves as follows:

### Same-Origin Requests

When navigating within the same site:

```text
https://open-source-education.co.uk/page-a
        ↓
https://open-source-education.co.uk/page-b
```

the full referrer URL is sent.

### Cross-Origin HTTPS Requests

When navigating to another secure website:

```text
https://open-source-education.co.uk/page-a
        ↓
https://example.com
```

only the origin is sent.

Example:

```text
https://open-source-education.co.uk
```

The full page path is not shared.

### HTTPS To HTTP Requests

When navigating from a secure site to a non-secure site:

```text
https://open-source-education.co.uk
        ↓
http://example.com
```

no referrer information is sent.

This prevents secure page information from being exposed to insecure destinations.