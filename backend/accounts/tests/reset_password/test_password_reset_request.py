from django.core import mail
from rest_framework import status

from accounts.tests.reset_password.base_reset_password import (
    BasePasswordResetTestCase
)


class PasswordResetRequestTests(BasePasswordResetTestCase):
    """
    PASSWORD RESET REQUEST TEST CHECKLIST
    -------------------------------------
    Password Reset Request
    - Verify existing user can request password reset
    - Verify password reset request sends email
    - Verify password reset email contains reset-password URL
    - Verify password reset email contains uid and token

    -------------------------------------
    Safe Response Behaviour
    - Verify unknown email returns success response
    - Verify missing email fails
    - Verify invalid email format fails
    """

    # =====================
    # Password Reset Request
    # =====================

    def test_existing_user_can_request_password_reset(self):
        """
        Arrange: Create a user with a valid email address.

        Act: Send a POST request to the password reset endpoint.

        Assert: The request returns a successful response.
        """
        self.create_password_reset_user()

        payload = self.get_password_reset_payload()

        response = self.client.post(
            self.get_password_reset_url(),
            payload,
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

    def test_password_reset_request_sends_email(self):
        """
        Arrange: Create a user with a valid email address.

        Act: Send a POST request to the password reset endpoint.

        Assert: A password reset email is sent.
        """
        self.create_password_reset_user()

        payload = self.get_password_reset_payload()

        self.client.post(
            self.get_password_reset_url(),
            payload,
            format="json",
        )

        self.assertEqual(
            len(mail.outbox),
            1,
        )

    def test_password_reset_email_contains_reset_password_url(self):
        """
        Arrange: Create a user and request a password reset.

        Act: Read the password reset email body.

        Assert: The email contains the reset password URL.
        """
        self.create_password_reset_user()

        payload = self.get_password_reset_payload()

        self.client.post(
            self.get_password_reset_url(),
            payload,
            format="json",
        )

        email_body = self.get_latest_email_body()

        self.assertIn(
            "reset-password",
            email_body,
        )

    def test_password_reset_email_contains_uid_and_token(self):
        """
        Arrange: Create a user and request a password reset.

        Act: Read the password reset email body.

        Assert: The email contains both uid and token path values.
        """
        self.create_password_reset_user()

        payload = self.get_password_reset_payload()

        self.client.post(
            self.get_password_reset_url(),
            payload,
            format="json",
        )

        email_body = self.get_latest_email_body()

        self.assertIn(
            "reset-password/",
            email_body,
        )

        self.assertGreaterEqual(
            email_body.count("/"),
            2,
        )

    # =====================
    # Safe Response Behaviour
    # =====================

    def test_unknown_email_returns_success_response(self):
        """
        Arrange: Prepare an email address that does not belong to any user.

        Act: Send a POST request to the password reset endpoint.

        Assert: The endpoint returns success to avoid exposing account existence.
        """
        payload = self.get_password_reset_payload(
            email=self.unknown_email,
        )

        response = self.client.post(
            self.get_password_reset_url(),
            payload,
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

    def test_password_reset_without_email_fails(self):
        """
        Arrange: Prepare a password reset payload without an email field.

        Act: Send a POST request to the password reset endpoint.

        Assert: The request fails because email is required.
        """
        payload = self.get_password_reset_payload()
        payload.pop("email")

        response = self.client.post(
            self.get_password_reset_url(),
            payload,
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_password_reset_with_invalid_email_format_fails(self):
        """
        Arrange: Prepare a password reset payload with an invalid email format.

        Act: Send a POST request to the password reset endpoint.

        Assert: The request fails because email format is invalid.
        """
        payload = self.get_password_reset_payload(
            email="not-an-email",
        )

        response = self.client.post(
            self.get_password_reset_url(),
            payload,
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )