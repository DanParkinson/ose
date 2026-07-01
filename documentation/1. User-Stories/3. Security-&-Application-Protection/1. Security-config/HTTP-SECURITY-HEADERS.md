# HTTP Security Headers

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [X-Frame-Options](#x-frame-options)
- [X-Content-Type-Options](#x-content-type-options)
- [Referrer Policy](#referrer-policy)

## Purpose

The application uses several HTTP response headers to provide additional browser security.

These headers help protect against clickjacking, MIME type sniffing, and the unnecessary sharing of referrer information.

---

## X-Frame-Options

The backend prevents pages from being embedded within iframes using:

```python
X_FRAME_OPTIONS = "DENY"
```

This protects Django-served pages, such as the admin interface and API documentation, from clickjacking attacks.

---

## X-Content-Type-Options

Browsers are instructed not to perform MIME type sniffing using:

```python
SECURE_CONTENT_TYPE_NOSNIFF = True
```

Django automatically returns:

```text
X-Content-Type-Options: nosniff
```

ensuring browsers respect the declared content type of each response.

---

## Referrer Policy

The application limits the amount of referrer information shared with external websites using:

```python
SECURE_REFERRER_POLICY = "strict-origin-when-cross-origin"
```

This allows full referrer information for same-origin requests while only sending the site origin to external HTTPS domains and no referrer when navigating from HTTPS to HTTP.
