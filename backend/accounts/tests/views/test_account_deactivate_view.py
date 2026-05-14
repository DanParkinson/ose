from rest_framework import status

from ..base import BaseAccountAPITestCase


class BaseAccountDeactivateTestCase(BaseAccountAPITestCase):
    def setUp(self):
        super().setUp()
        self.url = self.get_account_deactivate_url()


class AccountDeactivateViewTests(BaseAccountDeactivateTestCase):
    """
    ACCOUNT DEACTIVATE VIEW TEST CHECKLIST
    ------------------
    Permissions
    - Verify authenticated users CAN deactivate their account
    - Verify unauthenticated users CANNOT deactivate their account
    ------------------
    Response Structure
    - Verify successful response returns expected detail message
    ------------------
    Business Rules
    - Verify user is marked as inactive
    - Verify deactivated_at timestamp is set
    - Verify access cookie is deleted
    - Verify refresh cookie is deleted
    """

    # ==================
    # Permissions
    # ==================

    def test_authenticated_user_can_deactivate_account(self):
        """
        Arrange: Authenticate as a regular user.
        Act: Send a POST request to the account deactivation endpoint.
        Assert: The response returns 200 OK.
        """
        self.authenticate_user()

        response = self.client.post(self.url, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_unauthenticated_user_cannot_deactivate_account(self):
        """
        Arrange: Do not authenticate the request.
        Act: Send a POST request to the account deactivation endpoint.
        Assert: The response returns 401 UNAUTHORIZED.
        """
        response = self.client.post(self.url, format="json")

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # ==================
    # Response Structure
    # ==================

    def test_deactivate_account_returns_success_message(self):
        """
        Arrange: Authenticate as a regular user.
        Act: Send a POST request to the account deactivation endpoint.
        Assert: The response contains the expected success detail message.
        """
        self.authenticate_user()

        response = self.client.post(self.url, format="json")

        self.assertEqual(
            response.data["detail"],
            "Account deactivated successfully.",
        )

    # ==================
    # Business Rules
    # ==================

    def test_deactivate_account_sets_user_inactive(self):
        """
        Arrange: Authenticate as a regular user.
        Act: Send a POST request to deactivate the account.
        Assert: The user's is_active field is set to False.
        """
        self.authenticate_user()

        self.client.post(self.url, format="json")
        self.user.refresh_from_db()

        self.assertFalse(self.user.is_active)

    def test_deactivate_account_sets_deactivated_at(self):
        """
        Arrange: Authenticate as a regular user.
        Act: Send a POST request to deactivate the account.
        Assert: The user's deactivated_at field is set.
        """
        self.authenticate_user()

        self.client.post(self.url, format="json")
        self.user.refresh_from_db()

        self.assertIsNotNone(self.user.deactivated_at)

    def test_deactivate_account_deletes_access_cookie(self):
        """
        Arrange: Authenticate as a regular user.
        Act: Send a POST request to deactivate the account.
        Assert: The response deletes the access cookie.
        """
        self.authenticate_user()

        response = self.client.post(self.url, format="json")

        self.assertEqual(response.cookies["access"].value, "")

    def test_deactivate_account_deletes_refresh_cookie(self):
        """
        Arrange: Authenticate as a regular user.
        Act: Send a POST request to deactivate the account.
        Assert: The response deletes the refresh cookie.
        """
        self.authenticate_user()

        response = self.client.post(self.url, format="json")

        self.assertEqual(response.cookies["refresh"].value, "")
