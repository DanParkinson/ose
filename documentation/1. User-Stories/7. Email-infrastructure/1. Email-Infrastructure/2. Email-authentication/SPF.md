# SPF

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Why SPF Is Needed](#why-spf-is-needed)
- [How SPF Works](#how-spf-works)
- [Platform Configuration](#platform-configuration)
- [Relationship With Google Workspace](#relationship-with-google-workspace)
- [Email Delivery Impact](#email-delivery-impact)
- [Platform Impact](#platform-impact)

## Purpose

SPF (Sender Policy Framework) is an email authentication standard used to identify which mail servers are authorised to send emails on behalf of a domain.

The platform uses SPF to help receiving email providers verify that authentication emails originate from approved sources.

## Why SPF Is Needed

Without SPF, receiving email providers have no reliable way to determine whether an email claiming to come from:

```text
open-source-education.co.uk
```

was actually sent by an authorised service.

This can lead to:

```text
Reduced email trust
Increased spam classification
Email spoofing risks
Poor deliverability
```

SPF helps establish trust between the platform's domain and recipient email providers.

## How SPF Works

When an email is received, the recipient's email provider checks the domain's SPF record.

The SPF record lists which email services are authorised to send mail on behalf of the domain.

The receiving provider compares:

```text
Sending server
        ↓
SPF Record
        ↓
Authorised?
```

If the sending service matches an approved provider, the SPF check passes.

## Platform Configuration

SPF was implemented as a DNS TXT record in GoDaddy.
It authorises Google Workspace to send email on behalf of open-source-education.co.uk.

The platform's SPF record authorises Google Workspace to send emails on behalf of:

```text
open-source-education.co.uk
```

Example SPF record:

```text
v=spf1 include:_spf.google.com ~all
```

This tells receiving email providers that Google Workspace is an authorised sender for the domain.

The SPF record is configured through the domain DNS provider.

## Relationship With Google Workspace

Google Workspace is responsible for sending platform emails.

Examples include:

```text
Email verification
Password reset
Account recovery
```

Because Google Workspace sends these emails, it must be explicitly authorised within the SPF record.

Without this authorisation, many email providers may treat platform emails as suspicious.

## Email Delivery Impact

SPF contributes to email deliverability by helping receiving providers trust messages sent from the platform.

Successful SPF validation improves the likelihood that emails will:

```text
Reach the inbox
Avoid spam filtering
Be accepted by receiving servers
```

SPF is particularly important for authentication emails where reliable delivery is essential.

## Platform Impact

SPF forms one part of the platform's email authentication strategy.

It works alongside:

```text
DKIM
DMARC
```

to improve email trust and reduce spoofing risks.

By authorising Google Workspace as a legitimate sender, SPF helps ensure that authentication emails are delivered reliably and recognised as originating from the platform.