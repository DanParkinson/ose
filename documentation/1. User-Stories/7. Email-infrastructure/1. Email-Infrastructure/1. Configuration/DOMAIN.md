# Domain Configuration

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Why Domain Configuration Is Needed](#why-domain-configuration-is-needed)
- [Domain Provider](#domain-provider)
- [Project Domain](#project-domain)
- [Existing Application Records](#existing-application-records)
- [Email Infrastructure Relationship](#email-infrastructure-relationship)
- [Platform Impact](#platform-impact)

## Purpose

Domain configuration provides the foundation for the platform's production email infrastructure.

The platform uses a custom domain so that application emails can be sent from professional project email addresses instead of personal or development accounts.

## Why Domain Configuration Is Needed

Before production email can work, the domain must be able to support email services.

This requires the domain DNS to connect to:

```text
Application hosting
Google Workspace
Email authentication records
Mailbox routing
```

The domain acts as the central identity for both the deployed website and the email system.

## Domain Provider

The domain is managed through:

```text
GoDaddy
```

GoDaddy is used to manage the DNS records required for the project.

This includes records for:

```text
Application hosting
Google Workspace email routing
Email authentication
```

## Project Domain

The project uses the domain:

```text
open-source-education.co.uk
```

This domain is used for:

```text
Production frontend access
Professional email addresses
Google Workspace setup
Email verification delivery
```

## Existing Application Records

Before email setup, the domain was already connected to the deployed application.

Existing DNS records included:

```text
A records
CNAME records
Render application records
```

These records were left unchanged during email configuration.

This allowed email infrastructure to be added without disrupting the deployed application.

## Email Infrastructure Relationship

The domain is required for Google Workspace email setup.

Google Workspace uses the domain to provide:

```text
Mailbox hosting
Incoming email routing
Outgoing email identity
Email aliases
```

The domain also supports the records needed for email authentication, including:

```text
SPF
DKIM
DMARC
```

These records help receiving email providers trust mail sent from the platform's domain.

## Platform Impact

The completed domain configuration allows the platform to send user-facing emails from addresses using the project domain.

Example:

```text
accounts@open-source-education.co.uk
```

This improves the professionalism and trustworthiness of authentication emails such as:

```text
Email verification
Password reset
Account reactivation
```

The domain configuration is therefore the first layer of the platform's production email infrastructure.