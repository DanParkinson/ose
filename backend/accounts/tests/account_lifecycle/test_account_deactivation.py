from rest_framework import status

from accounts.tests.account_lifecycle.base_account_lifecycle import (
    BaseAccountLifecycleTestCase,
)


class AccountDeactivationTests(BaseAccountLifecycleTestCase):
    """
    ACCOUNT DEACTIVATION TEST CHECKLIST
    -----------------------------------
    Deactivation Permissions
    - Verify authenticated user can deactivate account
    - Verify unauthenticated user cannot deactivate account

    -----------------------------------
    Deactivation Behaviour
    - Verify account is set to inactive
    - Verify deactivated_at is set
    - Verify access cookie is deleted
    - Verify refresh cookie is deleted
    """

    # =====================
    # Deactivation Permissions
    # =====================

    def test_authenticated_user_can_deactivate_account(self):
        """
        Arrange: Create and authenticate an active user.

        Act: Send a POST request to the account deactivate endpoint.

        Assert: The request succeeds.
        """
        user = self.create_active_user()
        self.authenticate_user(user)

        response = self.client.post(
            self.get_account_deactivate_url(),
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

    def test_unauthenticated_user_cannot_deactivate_account(self):
        """
        Arrange: Ensure no user is authenticated.

        Act: Send a POST request to the account deactivate endpoint.

        Assert: The request is rejected.
        """
        self.unauthenticate()

        response = self.client.post(
            self.get_account_deactivate_url(),
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

    # =====================
    # Deactivation Behaviour
    # =====================

    def test_deactivation_sets_account_inactive(self):
        """
        Arrange: Create and authenticate an active user.

        Act: Send a POST request to deactivate the account.

        Assert: The user's is_active field is set to False.
        """
        user = self.create_active_user()
        self.authenticate_user(user)

        self.client.post(
            self.get_account_deactivate_url(),
            format="json",
        )

        user.refresh_from_db()

        self.assertFalse(
            user.is_active
        )

    def test_deactivation_sets_deactivated_at(self):
        """
        Arrange: Create and authenticate an active user.

        Act: Send a POST request to deactivate the account.

        Assert: The user's deactivated_at field is populated.
        """
        user = self.create_active_user()
        self.authenticate_user(user)

        self.client.post(
            self.get_account_deactivate_url(),
            format="json",
        )

        user.refresh_from_db()

        self.assertIsNotNone(
            user.deactivated_at
        )

    def test_deactivation_deletes_access_cookie(self):
        """
        Arrange: Create and authenticate an active user.

        Act: Send a POST request to deactivate the account.

        Assert: The response deletes the access cookie.
        """
        user = self.create_active_user()
        self.authenticate_user(user)

        response = self.client.post(
            self.get_account_deactivate_url(),
            format="json",
        )

        self.assertIn(
            "access",
            response.cookies,
        )

        self.assertEqual(
            response.cookies["access"].value,
            "",
        )

    def test_deactivation_deletes_refresh_cookie(self):
        """
        Arrange: Create and authenticate an active user.

        Act: Send a POST request to deactivate the account.

        Assert: The response deletes the refresh cookie.
        """
        user = self.create_active_user()
        self.authenticate_user(user)

        response = self.client.post(
            self.get_account_deactivate_url(),
            format="json",
        )

        self.assertIn(
            "refresh",
            response.cookies,
        )

        self.assertEqual(
            response.cookies["refresh"].value,
            "",
        )