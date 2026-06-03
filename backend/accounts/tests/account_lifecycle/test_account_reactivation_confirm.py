from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from rest_framework import status

from accounts.tests.account_lifecycle.base_account_lifecycle import (
    BaseAccountLifecycleTestCase,
)


class ReactivationConfirmTests(BaseAccountLifecycleTestCase):
    """
    REACTIVATION CONFIRM TEST CHECKLIST
    -----------------------------------
    Reactivation Confirmation
    - Verify inactive user can reactivate account with valid uid and token
    - Verify account is set to active after successful reactivation
    - Verify deactivated_at is cleared after successful reactivation

    -----------------------------------
    Reactivation Validation
    - Verify invalid uid fails
    - Verify invalid token fails
    - Verify active user cannot use reactivation confirmation
    """

    # =====================
    # Helpers
    # =====================

    def get_uid(self, user):
        return urlsafe_base64_encode(
            force_bytes(user.pk)
        )

    def get_token(self, user):
        return default_token_generator.make_token(user)

    # =====================
    # Reactivation Confirmation
    # =====================

    def test_inactive_user_can_reactivate_with_valid_uid_and_token(self):
        """
        Arrange: Create an inactive user and generate a valid uid and token.

        Act: Send a POST request to the reactivation confirm endpoint.

        Assert: The request succeeds.
        """
        user = self.create_inactive_user()

        uid = self.get_uid(user)
        token = self.get_token(user)

        payload = self.get_reactivation_confirm_payload(
            uid=uid,
            token=token,
        )

        response = self.client.post(
            self.get_reactivation_confirm_url(),
            payload,
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

    def test_successful_reactivation_sets_account_active(self):
        """
        Arrange: Create an inactive user and generate a valid uid and token.

        Act: Send a POST request to the reactivation confirm endpoint.

        Assert: The user's is_active field is set to True.
        """
        user = self.create_inactive_user()

        uid = self.get_uid(user)
        token = self.get_token(user)

        payload = self.get_reactivation_confirm_payload(
            uid=uid,
            token=token,
        )

        self.client.post(
            self.get_reactivation_confirm_url(),
            payload,
            format="json",
        )

        user.refresh_from_db()

        self.assertTrue(
            user.is_active
        )

    def test_successful_reactivation_clears_deactivated_at(self):
        """
        Arrange: Create an inactive user and generate a valid uid and token.

        Act: Send a POST request to the reactivation confirm endpoint.

        Assert: The user's deactivated_at field is cleared.
        """
        user = self.create_inactive_user()
        user.deactivated_at = user.date_joined
        user.save(update_fields=["deactivated_at"])

        uid = self.get_uid(user)
        token = self.get_token(user)

        payload = self.get_reactivation_confirm_payload(
            uid=uid,
            token=token,
        )

        self.client.post(
            self.get_reactivation_confirm_url(),
            payload,
            format="json",
        )

        user.refresh_from_db()

        self.assertIsNone(
            user.deactivated_at
        )

    # =====================
    # Reactivation Validation
    # =====================

    def test_reactivation_confirm_with_invalid_uid_fails(self):
        """
        Arrange: Create an inactive user and generate a valid token.

        Act: Send a POST request with an invalid uid.

        Assert: The request fails.
        """
        user = self.create_inactive_user()

        token = self.get_token(user)

        payload = self.get_reactivation_confirm_payload(
            uid="invalid-uid",
            token=token,
        )

        response = self.client.post(
            self.get_reactivation_confirm_url(),
            payload,
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_reactivation_confirm_with_invalid_token_fails(self):
        """
        Arrange: Create an inactive user and generate a valid uid.

        Act: Send a POST request with an invalid token.

        Assert: The request fails.
        """
        user = self.create_inactive_user()

        uid = self.get_uid(user)

        payload = self.get_reactivation_confirm_payload(
            uid=uid,
            token="invalid-token",
        )

        response = self.client.post(
            self.get_reactivation_confirm_url(),
            payload,
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_active_user_cannot_use_reactivation_confirmation(self):
        """
        Arrange: Create an active user and generate a valid uid and token.

        Act: Send a POST request to the reactivation confirm endpoint.

        Assert: The request fails because only inactive accounts can be reactivated.
        """
        user = self.create_active_user()

        uid = self.get_uid(user)
        token = self.get_token(user)

        payload = self.get_reactivation_confirm_payload(
            uid=uid,
            token=token,
        )

        response = self.client.post(
            self.get_reactivation_confirm_url(),
            payload,
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )