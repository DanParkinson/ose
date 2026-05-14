from django.contrib.auth.tokens import default_token_generator
from django.utils import timezone
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from rest_framework import status

from ..base import BaseAccountAPITestCase


class BaseReactivationConfirmTestCase(BaseAccountAPITestCase):
    def setUp(self):
        super().setUp()
        self.url = self.get_reactivation_confirm_url()
        self.inactive_user.deactivated_at = timezone.now()
        self.inactive_user.save(update_fields=["deactivated_at"])

    def get_valid_uid(self):
        return urlsafe_base64_encode(force_bytes(self.inactive_user.pk))

    def get_valid_token(self):
        return default_token_generator.make_token(self.inactive_user)

    def get_reactivation_confirm_payload(self, **overrides):
        payload = {
            "uid": self.get_valid_uid(),
            "token": self.get_valid_token(),
        }
        payload.update(overrides)
        return payload


class ReactivationConfirmViewTests(BaseReactivationConfirmTestCase):
    """
    REACTIVATION CONFIRM VIEW TEST CHECKLIST
    ------------------
    Permissions
    - Verify public users CAN confirm account reactivation
    ------------------
    Response Structure
    - Verify valid reactivation returns expected success message
    - Verify invalid uid returns expected error message
    - Verify invalid token returns expected error message
    ------------------
    Business Rules
    - Verify valid uid and token reactivate inactive user
    - Verify valid reactivation clears deactivated_at
    - Verify invalid uid does not reactivate user
    - Verify invalid token does not reactivate user
    - Verify active user cannot be reactivated through inactive-user flow
    """

    # ==================
    # Permissions
    # ==================

    def test_public_user_can_confirm_account_reactivation(self):
        """
        Arrange: Prepare a valid reactivation uid and token.
        Act: Send a POST request to the reactivation confirm endpoint.
        Assert: The response returns 200 OK without authentication.
        """
        response = self.client.post(
            self.url,
            self.get_reactivation_confirm_payload(),
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    # ==================
    # Response Structure
    # ==================

    def test_valid_reactivation_returns_success_message(self):
        """
        Arrange: Prepare a valid reactivation uid and token.
        Act: Send a POST request to the reactivation confirm endpoint.
        Assert: The response contains the expected success detail message.
        """
        response = self.client.post(
            self.url,
            self.get_reactivation_confirm_payload(),
            format="json",
        )

        self.assertEqual(
            response.data["detail"],
            "Account reactivated successfully.",
        )

    def test_invalid_uid_returns_error_message(self):
        """
        Arrange: Prepare a payload with an invalid uid.
        Act: Send a POST request to the reactivation confirm endpoint.
        Assert: The response contains the expected invalid link message.
        """
        response = self.client.post(
            self.url,
            self.get_reactivation_confirm_payload(uid="invalid-uid"),
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data["detail"],
            "Invalid reactivation link.",
        )

    def test_invalid_token_returns_error_message(self):
        """
        Arrange: Prepare a payload with a valid uid and invalid token.
        Act: Send a POST request to the reactivation confirm endpoint.
        Assert: The response contains the expected invalid token message.
        """
        response = self.client.post(
            self.url,
            self.get_reactivation_confirm_payload(token="invalid-token"),
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data["detail"],
            "Invalid or expired reactivation link.",
        )

    # ==================
    # Business Rules
    # ==================

    def test_valid_reactivation_sets_user_active(self):
        """
        Arrange: Prepare a valid reactivation uid and token for an inactive user.
        Act: Send a POST request to the reactivation confirm endpoint.
        Assert: The inactive user is reactivated.
        """
        self.client.post(
            self.url,
            self.get_reactivation_confirm_payload(),
            format="json",
        )

        self.inactive_user.refresh_from_db()

        self.assertTrue(self.inactive_user.is_active)

    def test_valid_reactivation_clears_deactivated_at(self):
        """
        Arrange: Prepare a valid reactivation uid and token for an inactive user.
        Act: Send a POST request to the reactivation confirm endpoint.
        Assert: The user's deactivated_at field is cleared.
        """
        self.client.post(
            self.url,
            self.get_reactivation_confirm_payload(),
            format="json",
        )

        self.inactive_user.refresh_from_db()

        self.assertIsNone(self.inactive_user.deactivated_at)

    def test_invalid_uid_does_not_reactivate_user(self):
        """
        Arrange: Prepare a payload with an invalid uid.
        Act: Send a POST request to the reactivation confirm endpoint.
        Assert: The inactive user remains inactive.
        """
        self.client.post(
            self.url,
            self.get_reactivation_confirm_payload(uid="invalid-uid"),
            format="json",
        )

        self.inactive_user.refresh_from_db()

        self.assertFalse(self.inactive_user.is_active)

    def test_invalid_token_does_not_reactivate_user(self):
        """
        Arrange: Prepare a payload with a valid uid and invalid token.
        Act: Send a POST request to the reactivation confirm endpoint.
        Assert: The inactive user remains inactive.
        """
        self.client.post(
            self.url,
            self.get_reactivation_confirm_payload(token="invalid-token"),
            format="json",
        )

        self.inactive_user.refresh_from_db()

        self.assertFalse(self.inactive_user.is_active)

    def test_active_user_cannot_be_reactivated_through_inactive_flow(self):
        """
        Arrange: Prepare a valid uid and token for an already active user.
        Act: Send a POST request to the reactivation confirm endpoint.
        Assert: The response returns 400 BAD REQUEST because the view only targets inactive users.
        """
        uid = urlsafe_base64_encode(force_bytes(self.user.pk))
        token = default_token_generator.make_token(self.user)

        response = self.client.post(
            self.url,
            {
                "uid": uid,
                "token": token,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data["detail"],
            "Invalid reactivation link.",
        )
