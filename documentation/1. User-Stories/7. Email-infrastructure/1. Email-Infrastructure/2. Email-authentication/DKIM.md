# DKIM

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Why DKIM Is Needed](#why-dkim-is-needed)
- [How DKIM Works](#how-dkim-works)
- [Platform Configuration](#platform-configuration)
- [Relationship With Google Workspace](#relationship-with-google-workspace)
- [Email Delivery Impact](#email-delivery-impact)
- [Platform Impact](#platform-impact)

## Purpose

DKIM (DomainKeys Identified Mail) is an email authentication standard used to verify that an email was authorised by the domain it claims to originate from.

The platform uses DKIM to help receiving email providers confirm that emails sent from:

```text
open-source-education.co.uk
```

have not been altered during delivery.

## Why DKIM Is Needed

When emails travel across the internet, receiving providers need a way to verify that the message genuinely originated from the claimed domain.

Without DKIM:

```text
Email authenticity is harder to verify
Email trust is reduced
Deliverability may suffer
```

DKIM helps establish trust by digitally signing outgoing emails.

## How DKIM Works

Outgoing emails are signed by Google Workspace before delivery.

When the email reaches the recipient:

```text
Email Received
        ↓
DKIM Signature Checked
        ↓
Public Key Retrieved From DNS
        ↓
Signature Validated
```

If the signature is valid, the receiving provider can confirm that the message was authorised by the domain and was not modified after being sent.

## Platform Configuration

DKIM was configured through:

```text
Google Workspace
GoDaddy DNS
```

Google Workspace generated the DKIM signing configuration and DNS record.

The generated DNS record was then added to the domain's DNS configuration through GoDaddy.

Once DNS propagation completed, DKIM signing was enabled within Google Workspace.

## Relationship With Google Workspace

Google Workspace is responsible for signing outgoing emails.

Examples include:

```text
Email verification
Password reset
Account recovery
```

Every email sent through Google Workspace is automatically signed using the configured DKIM settings.

## Email Delivery Impact

DKIM improves trust between the platform and receiving email providers.

Successful DKIM validation helps:

```text
Reduce spam classification
Improve inbox delivery
Verify message authenticity
```

This is particularly important for authentication-related emails where reliable delivery is essential.

## Platform Impact

DKIM forms part of the platform's email authentication strategy.

It works alongside:

```text
SPF
DMARC
```

to improve email trust and delivery reliability.

By digitally signing outgoing emails, DKIM helps receiving providers verify that messages genuinely originated from the platform's authorised email infrastructure.