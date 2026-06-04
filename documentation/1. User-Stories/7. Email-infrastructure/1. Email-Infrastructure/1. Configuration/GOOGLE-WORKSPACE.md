# Google Workspace

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Why Google Workspace Was Chosen](#why-google-workspace-was-chosen)
- [Role Within The Platform](#role-within-the-platform)
- [Domain Integration](#domain-integration)
- [Mailbox Management](#mailbox-management)
- [Email Delivery Relationship](#email-delivery-relationship)
- [Platform Impact](#platform-impact)

## Purpose

Google Workspace provides the production email service used by the platform.

It is responsible for hosting the project's mailboxes and handling the delivery and receipt of emails associated with the platform.

Google Workspace forms the core of the production email infrastructure.

## Why Google Workspace Was Chosen

The platform requires a reliable email provider capable of supporting:

```text
Authentication emails
Password reset emails
Account recovery emails
Future platform communications
```

Google Workspace was chosen because it provides:

```text
Professional email hosting
High delivery reliability
Custom domain support
Strong spam protection
Industry-standard email infrastructure
```

This allows the platform to send emails using project-owned email addresses rather than personal accounts.

## Role Within The Platform

Google Workspace is responsible for:

```text
Hosting mailboxes
Receiving incoming mail
Sending outgoing mail
Managing domain email identities
```

The platform itself does not send email directly.

Instead, Django authenticates with Google Workspace, which then delivers the email on behalf of the platform.

## Domain Integration

Google Workspace is connected to:

```text
open-source-education.co.uk
```

through DNS records managed by GoDaddy.

Once configured, Google Workspace becomes the authorised email provider for the domain.

This allows emails to be sent from project addresses such as:

```text
accounts@open-source-education.co.uk
```

rather than generic development addresses.

## Mailbox Management

Google Workspace provides the mailbox used by the platform for email delivery.

The mailbox credentials are used by Django's SMTP configuration when sending emails.

This mailbox acts as the sender identity for authentication-related emails.

Examples include:

```text
Email verification
Password reset
Account reactivation
```

## Email Delivery Relationship

The email delivery process follows this flow:

```text
User action
        ↓
Django email system
        ↓
Google Workspace SMTP
        ↓
Recipient email provider
        ↓
User inbox
```

Google Workspace acts as the bridge between the platform and external email providers.

Without Google Workspace, the platform would have no production email delivery service.

## Platform Impact

Google Workspace allows the platform to operate using professional domain-based email addresses.

This improves:

```text
User trust
Brand consistency
Email deliverability
Professional appearance
```

It also provides the foundation required for authentication workflows that depend on reliable email delivery.

Examples include:

```text
Email verification
Password recovery
Account recovery
```

As a result, Google Workspace is a critical part of the platform's authentication and communication infrastructure.