from django.core import mail
from rest_framework import status

from accounts.tests.email_verification.base_email_verification import (
    BaseEmailVerificationTestCase,
)


class ResendVerifyEmailTests(BaseEmailVerificationTestCase):
    """
    RESEND VERIFY EMAIL TEST CHECKLIST
    ----------------------------------
    Resend Verification Email
    - Verify unverified user can request verification email resend
    - Verify resend creates a verification email
    - Verify resent email contains frontend verification URL

    ----------------------------------
    Safe Response Behaviour
    - Verify unknown email returns safe success response
    - Verify already verified email returns safe success response
    """

    # ==============================
    # Resend Verification Email
    # ==============================

    def test_unverified_user_can_request_verification_email_resend(self):
        """
        Arrange: Create an unverified email address.

        Act: Send a POST request to the resend verification endpoint.

        Assert: The request returns a successful response.
        """
        self.create_unverified_email_address()

        response = self.client.post(
            self.get_resend_verification_url(),
            {
                "email": self.email,
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

    def test_resend_creates_verification_email(self):
        """
        Arrange: Create an unverified email address.

        Act: Send a POST request to the resend verification endpoint.

        Assert: A verification email is added to the test email outbox.
        """
        self.create_unverified_email_address()

        self.client.post(
            self.get_resend_verification_url(),
            {
                "email": self.email,
            },
            format="json",
        )

        self.assertEqual(
            len(mail.outbox),
            1,
        )

    def test_resent_email_contains_frontend_verification_url(self):
        """
        Arrange: Create an unverified email address.

        Act: Send a POST request to the resend verification endpoint and read
        the email body.

        Assert: The resent email contains the frontend verification URL.
        """
        self.create_unverified_email_address()

        self.client.post(
            self.get_resend_verification_url(),
            {
                "email": self.email,
            },
            format="json",
        )

        email_body = self.get_latest_email_body()

        self.assertIn(
            "http://localhost:5173/verify-email/",
            email_body,
        )

    # ==============================
    # Safe Response Behaviour
    # ==============================

    def test_unknown_email_returns_safe_success_response(self):
        """
        Arrange: Prepare an email address that does not belong to any account.

        Act: Send a POST request to the resend verification endpoint.

        Assert: The endpoint still returns success to avoid account enumeration.
        """
        response = self.client.post(
            self.get_resend_verification_url(),
            {
                "email": "unknown@example.com",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

    def test_already_verified_email_returns_safe_success_response(self):
        """
        Arrange: Create a verified email address.

        Act: Send a POST request to the resend verification endpoint.

        Assert: The endpoint returns success without exposing verification state.
        """
        user, email_address = self.create_unverified_email_address()

        email_address.verified = True
        email_address.save(update_fields=["verified"])

        response = self.client.post(
            self.get_resend_verification_url(),
            {
                "email": self.email,
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )
