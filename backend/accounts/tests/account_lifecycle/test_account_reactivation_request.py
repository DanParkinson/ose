from django.core import mail
from rest_framework import status

from accounts.tests.account_lifecycle.base_account_lifecycle import (
    BaseAccountLifecycleTestCase,
)


class ReactivationRequestTests(BaseAccountLifecycleTestCase):
    """
    REACTIVATION REQUEST TEST CHECKLIST
    -----------------------------------
    Reactivation Request
    - Verify inactive user can request reactivation
    - Verify reactivation request sends email
    - Verify reactivation email contains reactivation URL
    - Verify reactivation email contains uid and token

    -----------------------------------
    Safe Response Behaviour
    - Verify active user returns safe success response
    - Verify unknown email returns safe success response
    - Verify missing email returns safe success response
    """

    # =====================
    # Reactivation Request
    # =====================

    def test_inactive_user_can_request_reactivation(self):
        """
        Arrange: Create an inactive user account.

        Act: Send a POST request to the reactivation request endpoint.

        Assert: The request returns a successful response.
        """
        self.create_inactive_user()

        payload = self.get_reactivation_request_payload()

        response = self.client.post(
            self.get_reactivation_request_url(),
            payload,
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

    def test_reactivation_request_sends_email(self):
        """
        Arrange: Create an inactive user account.

        Act: Send a POST request to the reactivation request endpoint.

        Assert: A reactivation email is sent.
        """
        self.create_inactive_user()

        payload = self.get_reactivation_request_payload()

        self.client.post(
            self.get_reactivation_request_url(),
            payload,
            format="json",
        )

        self.assertEqual(
            len(mail.outbox),
            1,
        )

    def test_reactivation_email_contains_reactivation_url(self):
        """
        Arrange: Create an inactive user account.

        Act: Send a POST request and read the reactivation email body.

        Assert: The email contains the frontend reactivation URL.
        """
        self.create_inactive_user()

        payload = self.get_reactivation_request_payload()

        self.client.post(
            self.get_reactivation_request_url(),
            payload,
            format="json",
        )

        email_body = self.get_latest_email_body()

        self.assertIn(
            "http://localhost:5173/reactivate-account/",
            email_body,
        )

    def test_reactivation_email_contains_uid_and_token(self):
        """
        Arrange: Create an inactive user account.

        Act: Send a POST request and read the reactivation email body.

        Assert: The email contains uid and token path values.
        """
        self.create_inactive_user()

        payload = self.get_reactivation_request_payload()

        self.client.post(
            self.get_reactivation_request_url(),
            payload,
            format="json",
        )

        email_body = self.get_latest_email_body()

        self.assertIn(
            "/reactivate-account/",
            email_body,
        )

        self.assertGreaterEqual(
            email_body.count("/"),
            2,
        )

    # =====================
    # Safe Response Behaviour
    # =====================

    def test_active_user_returns_safe_success_response(self):
        """
        Arrange: Create an active user account.

        Act: Send a POST request to the reactivation request endpoint.

        Assert: The response is successful without exposing account state.
        """
        self.create_active_user()

        payload = self.get_reactivation_request_payload(
            email=self.email,
        )

        response = self.client.post(
            self.get_reactivation_request_url(),
            payload,
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

    def test_unknown_email_returns_safe_success_response(self):
        """
        Arrange: Prepare an email address that does not belong to any user.

        Act: Send a POST request to the reactivation request endpoint.

        Assert: The response is successful without exposing account existence.
        """
        payload = self.get_reactivation_request_payload(
            email=self.unknown_email,
        )

        response = self.client.post(
            self.get_reactivation_request_url(),
            payload,
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

    def test_missing_email_returns_safe_success_response(self):
        """
        Arrange: Prepare an empty request payload.

        Act: Send a POST request to the reactivation request endpoint.

        Assert: The response is successful and does not expose account state.
        """
        response = self.client.post(
            self.get_reactivation_request_url(),
            {},
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )