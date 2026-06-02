from rest_framework import status

from accounts.tests.email_verification.base_email_verification import (
    BaseEmailVerificationTestCase,
)


class VerifyEmailTests(BaseEmailVerificationTestCase):
    """
    VERIFY EMAIL TEST CHECKLIST
    ---------------------------
    Email Verification Status
    - Verify registered user starts with unverified email

    ---------------------------
    Email Confirmation
    - Verify valid email confirmation key verifies email address
    - Verify invalid email confirmation key fails
    """

    def test_registered_user_starts_with_unverified_email(self):
        """
        Arrange: Register a new user account.
        Act: Retrieve the associated EmailAddress record.
        Assert: The email address starts as unverified.
        """
        payload = self.get_registration_payload()

        self.client.post(
            self.get_registration_url(),
            payload,
            format="json",
        )

        email_address = self.get_email_address()

        self.assertFalse(email_address.verified)

    def test_valid_email_confirmation_key_verifies_email_address(self):
        """
        Arrange: Create an unverified email address and generate a valid confirmation key.
        Act: Submit the confirmation key to the verify email endpoint.
        Assert: The email address becomes verified.
        """
        user, email_address = self.create_unverified_email_address()
        confirmation = self.create_email_confirmation(email_address)

        response = self.client.post(
            self.get_verify_email_url(confirmation.key),
            {"key": confirmation.key},
            format="json",
        )

        email_address.refresh_from_db()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(email_address.verified)

    def test_invalid_email_confirmation_key_fails(self):
        """
        Arrange: Prepare an invalid email confirmation key.
        Act: Submit the invalid key to the verify email endpoint.
        Assert: The verification request fails.
        """
        response = self.client.post(
            self.get_verify_email_url("invalid-key"),
            {"key": "invalid-key"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)