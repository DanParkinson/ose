# Email Aliases

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

* [Purpose](#purpose)
* [Alias Strategy](#alias-strategy)
* [Configured Aliases](#configured-aliases)
* [Current Routing](#current-routing)
* [Platform Usage](#platform-usage)
* [Future Expansion](#future-expansion)

## Purpose

The platform uses email aliases to provide role-specific email addresses without requiring multiple Google Workspace mailboxes.

This allows different areas of the platform to use dedicated email addresses while keeping mailbox management simple.

## Alias Strategy

A single primary mailbox is used for the platform.

Additional addresses are configured as aliases and route messages to the same inbox.

This approach:

```text
Reduces mailbox management
Reduces Google Workspace licensing requirements
Provides role-specific sender identities
Supports future expansion
```

## Configured Aliases

The following aliases have been configured:

```text
accounts@open-source-education.co.uk
admin@open-source-education.co.uk
noreply@open-source-education.co.uk
support@open-source-education.co.uk
```

## Current Routing

All configured aliases currently route to:

```text
admin@open-source-education.co.uk
```

As a result:

```text
Email sent to any alias
        ↓
Delivered to admin mailbox
```

This provides a single location for managing platform email communications.

## Platform Usage

The aliases exist to support different platform responsibilities.

Examples:

```text
accounts@ → account management
admin@    → platform administration
noreply@  → automated system emails
support@  → user support
```

Although they currently share the same destination mailbox, using dedicated addresses helps maintain clear separation of responsibilities.

## Future Expansion

The alias structure allows the platform to introduce dedicated mailboxes later if required.

For example:

```text
support@ → separate support mailbox
accounts@ → separate account management mailbox
```

without changing the public-facing email addresses already used throughout the platform.
