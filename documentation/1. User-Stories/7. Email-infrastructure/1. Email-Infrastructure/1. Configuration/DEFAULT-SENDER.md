# Default Sender

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

* [Purpose](#purpose)
* [Default Sender Role](#default-sender-role)
* [Configuration](#configuration)
* [Development Behaviour](#development-behaviour)
* [Production Relationship](#production-relationship)

## Purpose

The default sender defines the email address used when the platform generates outgoing email messages.

This provides a consistent sender identity across all email functionality.

## Default Sender Role

When an email is generated, Django uses the configured default sender address as the email's sender.

The sender address appears in the email headers and identifies the source of the message.

The default sender is used unless a specific sender address is explicitly provided.

## Configuration

The platform uses Django's default email sender configuration.

Example:

```py
DEFAULT_FROM_EMAIL = "noreply@example.com"
```

Django uses this value when generating outgoing email messages.

## Development Behaviour

During local development, email messages are written to the Django terminal by the configured email backend.

The default sender is still included in the generated email output and can be inspected during testing.

## Production Relationship

Production environments should use a sender address associated with the application's verified email domain.

This allows email providers to validate message authenticity and helps improve email deliverability.
