# HTTP Strict Transport Security (HSTS)

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [HSTS Configuration](#hsts-configuration)
- [How HSTS Works](#how-hsts-works)
- [Development Configuration](#development-configuration)
- [Production Configuration](#production-configuration)
- [Subdomain Protection](#subdomain-protection)
- [Preload Support](#preload-support)
- [Relationship With HTTPS](#relationship-with-https)

## Purpose

HTTP Strict Transport Security (HSTS) instructs browsers to always use HTTPS when communicating with the application.

Once a browser receives an HSTS policy, future requests automatically use HTTPS instead of HTTP.

This helps protect users from accidentally connecting over insecure connections.

## HSTS Configuration

The platform configures HSTS using:

```py
SECURE_HSTS_SECONDS = 0 if DEBUG else 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = not DEBUG
SECURE_HSTS_PRELOAD = not DEBUG
```

These settings are only enabled in production environments.

## How HSTS Works

After a user successfully visits the application using HTTPS:

```text
Browser receives HSTS policy
    ↓
Policy stored by browser
    ↓
Future HTTP requests blocked
    ↓
Browser automatically uses HTTPS
```

This happens automatically without requiring user interaction.

## Development Configuration

HSTS is disabled during local development.

```py
SECURE_HSTS_SECONDS = 0
```

Local development commonly uses HTTP:

```text
http://localhost:5173
http://localhost:8000
```

Disabling HSTS prevents development environments from being forced to use HTTPS.

## Production Configuration

Production enables HSTS for one year.

```py
SECURE_HSTS_SECONDS = 31536000
```

This value represents:

```text
31,536,000 seconds
= 365 days
= 1 year
```

Once a browser receives the HSTS policy, it will continue enforcing HTTPS for the configured duration.

## Subdomain Protection

The platform enables HSTS protection for all subdomains.

```py
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
```

Example:

```text
open-source-education.co.uk
api.open-source-education.co.uk
```

All protected subdomains must support HTTPS before enabling this setting.

## Preload Support

The platform enables HSTS preload support.

```py
SECURE_HSTS_PRELOAD = True
```

This indicates that the domain may be submitted to browser-maintained HSTS preload lists.

Browsers that include the domain in their preload list automatically enforce HTTPS before the user's first visit.

## Relationship With HTTPS

HSTS works alongside HTTPS redirects.

The platform also enables:

```py
SECURE_SSL_REDIRECT = not DEBUG
```

Together these settings provide:

```text
Automatic HTTPS redirects
Browser HTTPS enforcement
Protection against insecure connections
Improved transport security
```

HTTPS redirects protect the current request, while HSTS helps ensure future requests are made securely.