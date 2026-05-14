from django.core import mail
from rest_framework import status

from ..base import BaseAccountAPITestCase


class BaseReactivationRequestTestCase(BaseAccountAPITestCase):
    def setUp(self):
        super().setUp()
        self.url = self.get_reactivation_request_url()

    def get_reactivation_request_payload(self, **overrides):
        payload = {
            "email": self.inactive_user.email,
        }
        payload.update(overrides)
        return payload


class ReactivationRequestViewTests(BaseReactivationRequestTestCase):
    """
    REACTIVATION REQUEST VIEW TEST CHECKLIST
    ------------------
    Permissions
    - Verify public users CAN request account reactivation
    ------------------
    Response Structure
    - Verify reactivation request always returns 200 OK
    - Verify response returns expected detail message
    ------------------
    Business Rules
    - Verify inactive user receives reactivation email
    - Verify unknown email does not raise an error
    - Verify active user does not receive reactivation email
    - Verify missing email does not raise an error
    - Verify response does not expose whether an account exists
    """

    # ==================
    # Permissions
    # ==================

    def test_public_user_can_request_account_reactivation(self):
        """
        Arrange: Prepare a payload using an inactive user's email.
        Act: Send a POST request to the reactivation request endpoint.
        Assert: The response returns 200 OK without authentication.
        """
        response = self.client.post(
            self.url,
            self.get_reactivation_request_payload(),
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    # ==================
    # Response Structure
    # ==================

    def test_reactivation_request_returns_success_message(self):
        """
        Arrange: Prepare a payload using an inactive user's email.
        Act: Send a POST request to the reactivation request endpoint.
        Assert: The response contains the expected generic detail message.
        """
        response = self.client.post(
            self.url,
            self.get_reactivation_request_payload(),
            format="json",
        )

        self.assertEqual(
            response.data["detail"],
            "If a deactivated account exists with that email, a reactivation link has been sent.",
        )

    def test_reactivation_request_with_unknown_email_returns_200(self):
        """
        Arrange: Prepare a payload using an email address that does not exist.
        Act: Send a POST request to the reactivation request endpoint.
        Assert: The response still returns 200 OK to avoid account enumeration.
        """
        response = self.client.post(
            self.url,
            self.get_reactivation_request_payload(
                email="unknown@example.com",
            ),
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_reactivation_request_with_active_user_returns_200(self):
        """
        Arrange: Prepare a payload using an active user's email address.
        Act: Send a POST request to the reactivation request endpoint.
        Assert: The response still returns 200 OK to avoid account enumeration.
        """
        response = self.client.post(
            self.url,
            self.get_reactivation_request_payload(
                email=self.user.email,
            ),
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_reactivation_request_with_missing_email_returns_200(self):
        """
        Arrange: Prepare an empty payload without an email address.
        Act: Send a POST request to the reactivation request endpoint.
        Assert: The response returns 200 OK without exposing validation details.
        """
        response = self.client.post(
            self.url,
            {},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    # ==================
    # Business Rules
    # ==================

    def test_reactivation_request_sends_email_for_inactive_user(self):
        """
        Arrange: Prepare a payload using an inactive user's email.
        Act: Send a POST request to the reactivation request endpoint.
        Assert: One reactivation email is sent.
        """
        self.client.post(
            self.url,
            self.get_reactivation_request_payload(),
            format="json",
        )

        self.assertEqual(len(mail.outbox), 1)

    def test_reactivation_request_email_is_sent_to_inactive_user(self):
        """
        Arrange: Prepare a payload using an inactive user's email.
        Act: Send a POST request to the reactivation request endpoint.
        Assert: The email is sent to the inactive user's email address.
        """
        self.client.post(
            self.url,
            self.get_reactivation_request_payload(),
            format="json",
        )

        self.assertEqual(mail.outbox[0].to, [self.inactive_user.email])

    def test_reactivation_request_email_contains_reactivation_url(self):
        """
        Arrange: Prepare a payload using an inactive user's email.
        Act: Send a POST request to the reactivation request endpoint.
        Assert: The email body contains the frontend reactivation URL.
        """
        self.client.post(
            self.url,
            self.get_reactivation_request_payload(),
            format="json",
        )

        self.assertIn(
            "http://localhost:5173/reactivate-account/",
            mail.outbox[0].body,
        )

    def test_reactivation_request_does_not_send_email_for_unknown_email(self):
        """
        Arrange: Prepare a payload using an unknown email address.
        Act: Send a POST request to the reactivation request endpoint.
        Assert: No email is sent.
        """
        self.client.post(
            self.url,
            self.get_reactivation_request_payload(
                email="unknown@example.com",
            ),
            format="json",
        )

        self.assertEqual(len(mail.outbox), 0)

    def test_reactivation_request_does_not_send_email_for_active_user(self):
        """
        Arrange: Prepare a payload using an active user's email address.
        Act: Send a POST request to the reactivation request endpoint.
        Assert: No email is sent because only inactive users can be reactivated.
        """
        self.client.post(
            self.url,
            self.get_reactivation_request_payload(
                email=self.user.email,
            ),
            format="json",
        )

        self.assertEqual(len(mail.outbox), 0)

    def test_reactivation_request_does_not_send_email_when_email_missing(self):
        """
        Arrange: Prepare an empty payload without an email address.
        Act: Send a POST request to the reactivation request endpoint.
        Assert: No email is sent.
        """
        self.client.post(
            self.url,
            {},
            format="json",
        )

        self.assertEqual(len(mail.outbox), 0)
