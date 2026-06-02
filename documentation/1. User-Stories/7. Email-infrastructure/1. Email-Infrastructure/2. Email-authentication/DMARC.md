# DMARC

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Why DMARC Is Needed](#why-dmarc-is-needed)
- [How DMARC Works](#how-dmarc-works)
- [Platform Configuration](#platform-configuration)
- [Relationship With SPF And DKIM](#relationship-with-spf-and-dkim)
- [Email Delivery Impact](#email-delivery-impact)
- [Platform Impact](#platform-impact)

## Purpose

DMARC (Domain-based Message Authentication, Reporting and Conformance) is an email authentication standard that builds upon SPF and DKIM.

The platform uses DMARC to define how receiving email providers should handle emails that fail authentication checks.

DMARC helps protect the platform's domain from spoofing and unauthorised email use.

## Why DMARC Is Needed

SPF and DKIM provide authentication checks, but they do not define what should happen when those checks fail.

Without DMARC:

```text
Email providers decide their own actions
Domain spoofing protection is weaker
Authentication policies are inconsistent
```

DMARC provides a clear policy that receiving email providers can follow.

## How DMARC Works

When an email is received:

```text
SPF Check
        ↓
DKIM Check
        ↓
DMARC Policy Applied
```

The receiving email provider evaluates the authentication results and applies the policy defined by the domain owner.

This allows the domain to communicate how suspicious messages should be handled.

## Platform Configuration

DMARC was configured through the domain DNS settings.

The policy is published as a DNS TXT record associated with:

```text
_dmarc.open-source-education.co.uk
```

This record informs receiving email providers how to process emails that fail authentication checks.

## Relationship With SPF And DKIM

DMARC relies on SPF and DKIM.

The relationship can be summarised as:

```text
SPF
    ↓
Authorised Sender

DKIM
    ↓
Verified Message

DMARC
    ↓
Authentication Policy
```

Together these technologies provide a complete email authentication strategy.

## Email Delivery Impact

DMARC helps improve trust in emails sent from the platform.

Benefits include:

```text
Reduced spoofing risk
Improved sender reputation
Stronger domain protection
More consistent authentication handling
```

This is particularly important for authentication-related emails where trust and delivery reliability are essential.

## Platform Impact

DMARC forms the final layer of the platform's email authentication configuration.

The platform's email security strategy consists of:

```text
SPF
DKIM
DMARC
```

Working together, these technologies help ensure that emails sent from:

```text
open-source-education.co.uk
```

are recognised as legitimate and are less likely to be treated as suspicious by receiving email providers.

By defining a clear authentication policy, DMARC helps protect both the platform and its users from unauthorised use of the domain.