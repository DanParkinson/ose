# X-Content-Type-Options

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Why X-Content-Type-Options Is Needed](#why-x-content-type-options-is-needed)
- [Django Configuration](#django-configuration)
- [Backend Behaviour](#backend-behaviour)
- [Browser Protection](#browser-protection)

## Purpose

`X-Content-Type-Options` instructs browsers to respect the content type declared by the server.

This helps prevent browsers from attempting to guess the type of a response.

## Why X-Content-Type-Options Is Needed

Browsers can sometimes perform MIME type sniffing.

MIME type sniffing occurs when a browser ignores the declared content type and attempts to determine the content type itself.

This behaviour can introduce security risks if content is interpreted differently than intended.

For example:

```text
Server returns file
        ↓
Browser ignores declared content type
        ↓
Browser attempts to guess content type
        ↓
Unexpected execution or rendering behaviour
```

## Django Configuration

The platform enables content type protection through Django's security settings.

```py
SECURE_CONTENT_TYPE_NOSNIFF = True
```

## Backend Behaviour

With this setting enabled, Django automatically adds:

```text
X-Content-Type-Options: nosniff
```

to responses.

This instructs browsers to trust the content type declared by the server rather than attempting MIME type detection.

## Browser Protection

The header reduces the risk of content being interpreted incorrectly by the browser.

Protection includes:

```text
Preventing MIME type sniffing
Reducing unexpected content execution
Improving response handling consistency
```

This setting forms part of Django's built-in security hardening configuration.