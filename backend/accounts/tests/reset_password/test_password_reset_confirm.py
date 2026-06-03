from rest_framework import status

from accounts.tests.reset_password.base_reset_password import (
    BasePasswordResetTestCase,
)


class PasswordResetConfirmTests(BasePasswordResetTestCase):
    """
    PASSWORD RESET CONFIRM TEST CHECKLIST
    -------------------------------------
    Password Reset Confirmation
    - Verify user can confirm password reset with valid uid and token
    - Verify password is changed after successful confirmation

    -------------------------------------
    Password Reset Validation
    - Verify invalid uid fails
    - Verify invalid token fails
    - Verify password mismatch fails
    - Verify weak password fails
    """

    # =====================
    # Password Reset Confirmation
    # =====================

    def test_user_can_confirm_password_reset_with_valid_uid_and_token(self):
        """
        Arrange: Create a user and request a password reset email.

        Act: Extract the uid and token from the email, then submit a password
        reset confirmation request.

        Assert: The password reset confirmation succeeds.
        """
        self.create_password_reset_user()

        self.request_password_reset_for_user()

        uid, token = self.get_uid_and_token_from_latest_email()

        payload = self.get_password_reset_confirm_payload(
            uid=uid,
            token=token,
        )

        response = self.client.post(
            self.get_password_reset_confirm_url(),
            payload,
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

    def test_password_is_changed_after_successful_confirmation(self):
        """
        Arrange: Create a user and request a password reset email.

        Act: Extract the uid and token from the email, then submit a password
        reset confirmation request.

        Assert: The user's password is updated.
        """
        user = self.create_password_reset_user()

        self.request_password_reset_for_user()

        uid, token = self.get_uid_and_token_from_latest_email()

        payload = self.get_password_reset_confirm_payload(
            uid=uid,
            token=token,
        )

        self.client.post(
            self.get_password_reset_confirm_url(),
            payload,
            format="json",
        )

        user.refresh_from_db()

        self.assertTrue(
            user.check_password(
                self.new_password1
            )
        )

    # =====================
    # Password Reset Validation
    # =====================

    def test_password_reset_confirm_with_invalid_uid_fails(self):
        """
        Arrange: Create a user and request a password reset email.

        Act: Extract the token from the email, then submit a password reset
        confirmation request with an invalid uid.

        Assert: The request fails.
        """
        self.create_password_reset_user()

        self.request_password_reset_for_user()

        uid, token = self.get_uid_and_token_from_latest_email()

        payload = self.get_password_reset_confirm_payload(
            uid="invalid-uid",
            token=token,
        )

        response = self.client.post(
            self.get_password_reset_confirm_url(),
            payload,
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_password_reset_confirm_with_invalid_token_fails(self):
        """
        Arrange: Create a user and request a password reset email.

        Act: Extract the uid from the email, then submit a password reset
        confirmation request with an invalid token.

        Assert: The request fails.
        """
        self.create_password_reset_user()

        self.request_password_reset_for_user()

        uid, token = self.get_uid_and_token_from_latest_email()

        payload = self.get_password_reset_confirm_payload(
            uid=uid,
            token="invalid-token",
        )

        response = self.client.post(
            self.get_password_reset_confirm_url(),
            payload,
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_password_reset_confirm_with_password_mismatch_fails(self):
        """
        Arrange: Create a user and request a password reset email.

        Act: Extract the uid and token from the email, then submit a password
        reset confirmation request with mismatched passwords.

        Assert: The request fails.
        """
        self.create_password_reset_user()

        self.request_password_reset_for_user()

        uid, token = self.get_uid_and_token_from_latest_email()

        payload = self.get_password_reset_confirm_payload(
            uid=uid,
            token=token,
            new_password1=self.new_password1,
            new_password2="differentpassword123",
        )

        response = self.client.post(
            self.get_password_reset_confirm_url(),
            payload,
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_password_reset_confirm_with_weak_password_fails(self):
        """
        Arrange: Create a user and request a password reset email.

        Act: Extract the uid and token from the email, then submit a password
        reset confirmation request with a weak password.

        Assert: The request fails.
        """
        self.create_password_reset_user()

        self.request_password_reset_for_user()

        uid, token = self.get_uid_and_token_from_latest_email()

        payload = self.get_password_reset_confirm_payload(
            uid=uid,
            token=token,
            new_password1=self.invalid_password,
            new_password2=self.invalid_password,
        )

        response = self.client.post(
            self.get_password_reset_confirm_url(),
            payload,
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )