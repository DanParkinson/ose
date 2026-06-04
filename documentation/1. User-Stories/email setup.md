# Production Email Infrastructure Setup Notes

## Overview

This document records the production email infrastructure setup completed for Open-Source Education.

The goal of this work was to establish a professional email foundation before connecting Django to a live email service.

At the conclusion of this setup:

```text
Domain Ownership
Google Workspace
MX Records
SPF
DKIM
DMARC
Professional Email Addresses
```

were successfully configured.

---

# Domain Configuration

## Domain

The project uses:

```text
open-source-education.co.uk
```

The domain is registered and managed through:

```text
GoDaddy
```

The domain was already connected to the deployed application infrastructure.

Existing DNS records included:

```text
A Records
CNAME Records
Render Application Records
```

These records were left unchanged throughout the email setup process.

---

# Google Workspace Setup

## Workspace Creation

A Google Workspace account was created and linked to:

```text
open-source-education.co.uk
```

The domain ownership verification process was completed successfully.

Google Workspace is now responsible for handling email services for the domain.

---

# Gmail Activation

## MX Record Configuration

Google Workspace required the domain MX records to be configured.

The MX records were added through GoDaddy DNS management.

Once DNS propagation completed:

```text
Gmail Activated
```

was successfully confirmed by Google Workspace.

At this point:

```text
Incoming Email
Outgoing Email
Mailbox Hosting
```

became available through Google Workspace.

---

# Email Authentication

Email authentication was configured to improve email trust and deliverability.

---

## SPF

An SPF record was configured.

Purpose:

```text
Identify authorised email senders
Prevent sender spoofing
Improve deliverability
```

Google Workspace SPF configuration was successfully activated.

---

## DKIM

A DKIM key was generated through Google Workspace.

Configuration process:

```text
Generate DKIM Key
↓
Create DNS TXT Record
↓
Wait For DNS Propagation
↓
Activate DKIM
```

The DKIM record was successfully verified.

Purpose:

```text
Digitally sign outgoing email
Allow recipient verification
Reduce spam classification
```

---

## DMARC

The domain already contained a DMARC record.

Purpose:

```text
Enforce email authentication policy
Provide reporting
Improve domain protection
```

The existing DMARC record remained active.

---

# Google Workspace User Structure

## Primary Mailbox

A single Google Workspace user account was created:

```text
admin@open-source-education.co.uk
```

This account acts as the primary mailbox and administrative account.

---

# Email Alias Strategy

Rather than purchasing multiple Google Workspace licences, email aliases were created.

Aliases currently configured:

```text
accounts@open-source-education.co.uk
support@open-source-education.co.uk
no-reply@open-source-education.co.uk
```

All aliases route to:

```text
admin@open-source-education.co.uk
```

Benefits:

```text
Single Inbox
Single Licence
Professional Email Addresses
Reduced Cost
Simplified Management
```

---

# Intended Email Usage

## Accounts Email

Planned use:

```text
User Registration
Email Verification
Resend Verification
Password Reset
Account Reactivation
```

Address:

```text
accounts@open-source-education.co.uk
```

---

## Support Email

Planned use:

```text
Contact Forms
User Support
Bug Reports
General Enquiries
```

Address:

```text
support@open-source-education.co.uk
```

---

## No Reply Email

Planned use:

```text
Future Automated Notifications
System Messages
Broadcast Emails
```

Address:

```text
no-reply@open-source-education.co.uk
```

---

# Current Status

The production email infrastructure has been successfully established.

Completed:

```text
✓ Domain Registered
✓ Google Workspace Configured
✓ Domain Verified
✓ Gmail Activated
✓ MX Records Configured
✓ SPF Configured
✓ DKIM Configured
✓ DMARC Active
✓ Primary Mailbox Created
✓ Email Aliases Created
```

Not Yet Completed:

```text
□ Django SMTP Configuration
□ Render Environment Variables
□ Production Email Backend
□ Live Email Sending Tests
□ Contact Form Integration
```

---

# Next Phase

The next stage is integrating Django with Google Workspace SMTP.

This will involve:

```text
SMTP Credentials
Environment Variables
Django Email Backend Configuration
Production Email Testing
Replacing Console Email Backend
```

Once completed, authentication emails will be delivered through:

```text
accounts@open-source-education.co.uk
```

rather than the local development console backend.


---

# Django SMTP Preparation

## Overview

Once the email infrastructure was successfully configured, preparation began for connecting Django to Google Workspace SMTP.

The goal is to replace the local console email backend in production while retaining the console backend during development.

---

## Google App Password

A Google App Password was generated for the Workspace administrator account.

Account:

```text
admin@open-source-education.co.uk
```

Purpose:

```text
Allow Django to authenticate with Google SMTP
Avoid using the primary Google account password
Provide a dedicated credential for application email sending
```

The App Password is treated as a secret and is stored in environment variables.

It is never committed to source control.

---

## SMTP Provider

The platform will use Google Workspace SMTP.

Configuration:

```text
SMTP Host: smtp.gmail.com
Port: 587
Encryption: TLS
```

Google Workspace will act as the outgoing email provider for all authentication-related emails.

---

## Sender Strategy

The application authenticates using:

```text
admin@open-source-education.co.uk
```

However, emails should appear to users as being sent from:

```text
accounts@open-source-education.co.uk
```

This maintains a professional separation between administrative access and user-facing communications.

Current structure:

```text
Mailbox:
admin@open-source-education.co.uk

Aliases:
accounts@open-source-education.co.uk
support@open-source-education.co.uk
no-reply@open-source-education.co.uk
```

---

## Environment Variables

Production email configuration will be stored in environment variables.

Planned variables:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True

EMAIL_HOST_USER=admin@open-source-education.co.uk
EMAIL_HOST_PASSWORD=<google_app_password>

DEFAULT_FROM_EMAIL=accounts@open-source-education.co.uk
```

Purpose:

```text
Prevent sensitive credentials being stored in source control
Allow environment-specific configuration
Support secure deployment on Render
```

---

## Django Email Backend Strategy

Development and production environments will use different email backends.

Development:

```py
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
```

Purpose:

```text
Display email content directly in the terminal
Avoid sending real emails during development
Simplify testing
```

Production:

```py
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
```

Purpose:

```text
Send real emails through Google Workspace SMTP
Deliver verification and password reset emails to users
```

The backend selection is controlled through the Django DEBUG setting.

---

## Planned Production Email Flow

Authentication email workflow:

```text
User submits request
↓
Django generates email
↓
Google Workspace SMTP authenticates using admin account
↓
Email delivered as accounts@open-source-education.co.uk
↓
User receives email
```

This approach allows all authentication-related emails to be centrally managed while presenting a professional sender identity.

---

## Current Status

Completed:

```text
✓ Google Workspace Configured
✓ Gmail Activated
✓ SPF Configured
✓ DKIM Configured
✓ DMARC Configured
✓ Email Aliases Created
✓ Google App Password Generated
✓ SMTP Configuration Planned
```

Pending:

```text
□ Configure Django SMTP Settings
□ Add Render Environment Variables
□ Deploy SMTP Configuration
□ Send First Live Verification Email
□ Production Email Testing
```

# SMTP Integration & Production Email Delivery

## Overview

Following the completion of the email infrastructure setup, the platform was configured to support production email delivery through Google Workspace.

The objective was to replace the development console email backend with a real SMTP provider while maintaining the existing authentication email workflows.

---

## Render SMTP Restriction Discovery

During production testing, authentication email requests failed despite local development working correctly.

Affected functionality:

```text
User Registration
Email Verification
Resend Verification Email
Password Reset
```

Investigation showed that Django was unable to establish an SMTP connection.

Error location:

```text
django.core.mail.backends.smtp
↓
smtplib
↓
socket.create_connection()
```

The SMTP connection attempt timed out and Gunicorn terminated the worker process.

---

## Root Cause

The application was originally deployed using a free Render web service.

Render restricts outbound SMTP traffic on free web services.

As a result:

```text
Google Workspace SMTP
Port 587
TLS Connection
```

could not be reached from the application.

This caused:

```text
Email sending failures
500 Server Errors
Worker timeouts
```

during email-related requests.

---

## Render Upgrade

To allow SMTP connectivity, the web service instance was upgraded from:

```text
Free Instance
```

to:

```text
Starter Instance
```

Purpose:

```text
Allow outbound SMTP traffic
Support Google Workspace integration
Enable production email delivery
```

No application code changes were required as part of the Render upgrade.

---

## Google Workspace SMTP

Google Workspace was selected as the production SMTP provider.

Configuration:

```text
Host: smtp.gmail.com
Port: 587
Encryption: TLS
```

The platform authenticates using:

```text
admin@open-source-education.co.uk
```

while user-facing emails are sent from:

```text
accounts@open-source-education.co.uk
```

---

## Google App Password

A dedicated Google App Password was created for the Workspace account.

Purpose:

```text
Allow Django SMTP authentication
Avoid using the primary Google password
Provide a dedicated application credential
```

The App Password is stored as an environment variable and is never committed to source control.

---

## Environment Variables

The following production email variables were configured:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True

EMAIL_HOST_USER=admin@open-source-education.co.uk
EMAIL_HOST_PASSWORD=<google_app_password>

DEFAULT_FROM_EMAIL=accounts@open-source-education.co.uk

EMAIL_TIMEOUT=10
```

Purpose:

```text
Secure credential storage
Environment-specific configuration
Production email delivery
```

---

## Django Email Backend

Development environment:

```py
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
```

Purpose:

```text
Display emails in terminal output
Avoid sending real emails
Simplify local testing
```

Production environment:

```py
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
```

Purpose:

```text
Send real emails through Google Workspace
Support authentication workflows
Enable production account management
```

---

## Frontend URL Configuration

Email templates originally contained a hardcoded development URL:

```text
http://localhost:5173
```

This prevented verification links from working correctly in production.

A dedicated frontend URL configuration was introduced.

Environment variable:

```env
FRONTEND_URL
```

Local Development:

```env
FRONTEND_URL=http://localhost:5173
```

Production:

```env
FRONTEND_URL=https://open-source-education.co.uk
```

Purpose:

```text
Generate environment-specific links
Support local development
Support production deployments
```

---

## Custom Account Adapter

A custom Allauth account adapter was introduced.

Purpose:

```text
Inject frontend_url into email templates
Support environment-specific email links
Remove hardcoded URLs
```

This allows email templates to reference:

```text
{{ frontend_url }}
```

rather than a fixed development address.

---

## Verification Email Template Update

Verification email templates were updated to use the injected frontend URL.

Previous:

```text
http://localhost:5173/verify-email/{{ key }}
```

Current:

```text
{{ frontend_url }}/verify-email/{{ key }}
```

Benefits:

```text
Single template for all environments
No hardcoded URLs
Environment-driven configuration
```

---

## Email Subject Investigation

Verification emails were observed using:

```text
[example.com] Verify your email address
```

This behaviour originates from Django Sites and Allauth.

Investigation confirmed:

```text
Subject templates were customised
Site configuration requires further review
```

The issue does not affect email functionality and was deferred for later resolution during database and production configuration cleanup.

---

## Current Status

Completed:

```text
✓ Google Workspace SMTP Configured
✓ Google App Password Generated
✓ Render Starter Instance Enabled
✓ SMTP Environment Variables Added
✓ Django SMTP Backend Configured
✓ Frontend URL Configuration Added
✓ Custom Account Adapter Added
✓ Verification Email Template Updated
✓ Production Emails Successfully Delivered
```

Outstanding:

```text
□ Final Verification Link Testing
□ Django Sites Configuration Cleanup
□ Production Authentication Flow Validation
□ Spam Deliverability Monitoring
```
ACCOUNT_EMAIL_SUBJECT_PREFIX = ""