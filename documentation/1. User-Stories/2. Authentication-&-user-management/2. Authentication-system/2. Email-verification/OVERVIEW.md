# Email Verification Overview

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

* [Purpose](#purpose)
* [Why Email Verification Exists](#why-email-verification-exists)
* [System Overview](#system-overview)
* [Verification Architecture](#verification-architecture)
* [Core Components](#core-components)
* [Verification Workflow](#verification-workflow)
* [Authentication Relationship](#authentication-relationship)
* [Frontend Relationship](#frontend-relationship)
* [Related Documentation](#related-documentation)

## Purpose

Email verification confirms ownership of an email address before a user is allowed to access authenticated areas of the platform.

The system helps ensure:

```text
Valid account ownership
Reliable password recovery
Reliable account communications
Reduced fake account creation
```

The platform requires users to verify their email address before they can successfully authenticate.

## Why Email Verification Exists

The authentication system uses email addresses as the primary user identifier.

Because email addresses are central to:

```text
Authentication
Password resets
Account recovery
Platform communication
```

the platform must confirm that the user owns the supplied email address.

Without verification:

```text
Users could register with invalid addresses
Password recovery would fail
Platform emails could not be trusted
```

## System Overview

The platform uses:

```text
Django Allauth
DJ-Rest-Auth
Custom User Model
Custom Account Adapter
Frontend Verification Pages
```

to provide a complete email verification workflow.

The verification process is handled primarily by Django Allauth, while DJ-Rest-Auth exposes the required API endpoints for frontend integration.

## Verification Architecture

The verification system consists of several independent parts.

```text
User Registration
        ↓
Email Confirmation Generation
        ↓
Verification Email Delivery
        ↓
Verification Link Submission
        ↓
Verification Status Update
        ↓
Authentication Access Granted
```

Each part is responsible for a specific section of the verification workflow.

## Core Components

### Django Allauth

Responsible for:

```text
Email confirmation generation
Verification token management
Verification state management
EmailAddress records
```

### DJ-Rest-Auth

Responsible for:

```text
Registration endpoints
Verification endpoints
Resend verification endpoints
Authentication integration
```

### Custom Account Adapter

Responsible for:

```text
Frontend URL injection
Verification link customisation
Email template context
```

### Frontend

Responsible for:

```text
Displaying verification pages
Submitting verification requests
Displaying success messages
Displaying verification errors
Providing resend verification functionality
```

## Verification Workflow

High-level workflow:

```text
User registers
        ↓
User account created
        ↓
Verification email generated
        ↓
Verification email delivered
        ↓
User opens verification link
        ↓
Verification request submitted
        ↓
Email marked as verified
        ↓
User can authenticate
```

The detailed implementation is documented separately.

## Authentication Relationship

Email verification is part of the authentication system.

Authentication depends on successful verification.

```text
User registered
        ↓
Email not verified
        ↓
Login denied
```

```text
User registered
        ↓
Email verified
        ↓
Login allowed
```

Verification therefore acts as a gateway between registration and authentication.

## Frontend Relationship

The frontend participates in the verification workflow but does not control verification status.

The frontend is responsible for:

```text
User experience
Verification pages
Verification requests
Verification feedback
```

The backend remains responsible for:

```text
Verification state
Verification validation
Authentication permissions
Email delivery
```

Verification status is always determined by the backend.

## Related Documentation

The following documents provide implementation details for specific areas of the verification system:

```text
Mandatory Verification
Verification Workflow
Custom Account Adapter
Verification Email Template
Resend Verification
```

This document provides the high-level overview of how those components work together.
