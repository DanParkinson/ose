# Production Email Setup

## Google Workspace

Create a Google Workspace account.

Connect it to:

```text
open-source-education.co.uk
```

Complete Google's domain verification process.

## MX Records

Google Workspace requires MX records to activate Gmail.

Add the records provided by Google Workspace through:

```text
GoDaddy DNS Management
```

Wait for DNS propagation.

Verify Gmail activation through:

```text
Google Workspace
↓
Admin Console
↓
Gmail
```

## SPF

Add the SPF TXT record provided by Google Workspace.

Example:

```text
Type: TXT
Host: @
Value: v=spf1 include:_spf.google.com ~all
```

Purpose:

```text
Authorise Google Workspace to send email for the domain.
```

## DKIM

Generate DKIM through:

```text
Google Workspace
↓
Apps
↓
Google Workspace
↓
Gmail
↓
Authenticate Email
```

Google generates a TXT record.

Add the generated record to:

```text
GoDaddy DNS
```

Wait for propagation.

Return to Google Workspace and activate DKIM.

## DMARC

Add a DMARC record.

Example:

```text
Type: TXT
Host: _dmarc

Value:
v=DMARC1; p=none;
```

The existing DMARC record was retained.

## Primary Mailbox

Create mailbox:

```text
admin@open-source-education.co.uk
```

This mailbox is used for:

```text
Google Workspace Administration
SMTP Authentication
Email Management
```

## Email Aliases

Create aliases:

```text
accounts@open-source-education.co.uk
support@open-source-education.co.uk
no-reply@open-source-education.co.uk
```

Configure all aliases to route to:

```text
admin@open-source-education.co.uk
```

## Google App Password

Generate an App Password for:

```text
admin@open-source-education.co.uk
```

Location:

```text
Google Account
↓
Security
↓
2-Step Verification
↓
App Passwords
```

Store securely.

## Render SMTP Limitation

Production email failed on:

```text
Render Free Instance
```

Error:

```text
SMTP connection timeout
```

Cause:

```text
Free instances do not allow outbound SMTP.
```

Upgrade backend service:

```text
Free
↓
Starter
```

## Render Environment Variables

Backend service:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True

EMAIL_HOST_USER=admin@open-source-education.co.uk
EMAIL_HOST_PASSWORD=<google_app_password>

DEFAULT_FROM_EMAIL=accounts@open-source-education.co.uk

EMAIL_TIMEOUT=10

FRONTEND_URL=https://open-source-education.co.uk
```

## Django Email Backend

Development:

```py
EMAIL_BACKEND =
    "django.core.mail.backends.console.EmailBackend"
```

Production:

```py
EMAIL_BACKEND =
    "django.core.mail.backends.smtp.EmailBackend"
```

Settings:

```py
EMAIL_HOST = os.environ["EMAIL_HOST"]
EMAIL_PORT = int(os.environ["EMAIL_PORT"])

EMAIL_USE_TLS = (
    os.environ.get("EMAIL_USE_TLS") == "True"
)

EMAIL_HOST_USER = os.environ["EMAIL_HOST_USER"]
EMAIL_HOST_PASSWORD = os.environ["EMAIL_HOST_PASSWORD"]

DEFAULT_FROM_EMAIL = os.environ["DEFAULT_FROM_EMAIL"]

EMAIL_TIMEOUT = int(
    os.environ.get("EMAIL_TIMEOUT", 10)
)
```

## Frontend URL Configuration

Settings:

```py
FRONTEND_URL = os.environ.get(
    "FRONTEND_URL",
    "http://localhost:5173"
)
```

Render:

```env
FRONTEND_URL=https://open-source-education.co.uk
```

Local:

```env
FRONTEND_URL=http://localhost:5173
```

## Custom Account Adapter

Settings:

```py
ACCOUNT_ADAPTER =
    "accounts.adapter.CustomAccountAdapter"
```

Used to inject:

```text
frontend_url
```

into email templates.

## Verification Email Template

Template:

```text
{{ frontend_url }}/verify-email/{{ key }}
```

This allows the same template to work in:

```text
Local Development
Production
```

without modification.

## Email Subject Prefix

Verification emails included:

```text
[example.com]
```

Disable subject prefix:

```py
ACCOUNT_EMAIL_SUBJECT_PREFIX = ""
```

This removes the default Django Allauth site prefix from authentication emails.
