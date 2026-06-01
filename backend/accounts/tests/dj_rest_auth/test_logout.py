from rest_framework import status

from accounts.tests.dj_rest_auth.base_dj_rest_auth import (
    BaseDJRestAuthTestCase,
)


class LogoutTests(BaseDJRestAuthTestCase):
    """
    LOGOUT TEST CHECKLIST
    ---------------------
    Authenticated Logout
    - Verify authenticated user can logout

    ---------------------
    Logout Validation
    - Verify unauthenticated user cannot logout
    """

    # =====================
    # Authenticated Logout
    # =====================

    def test_authenticated_user_can_logout(self):
        """
        Arrange: Create a user and log in through the real login endpoint.
        Act: Send a POST request to the logout endpoint.
        Assert: Logout succeeds.
        """
        user = self.create_user(email=self.email)
        self.create_verified_email(user)

        login_response = self.client.post(
            self.get_login_url(),
            self.get_login_payload(),
            format="json",
        )

        self.assertEqual(
            login_response.status_code,
            status.HTTP_200_OK,
        )

        response = self.client.post(
            self.get_logout_url(),
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

    # =====================
    # Logout Validation
    # =====================

    def test_unauthenticated_user_cannot_logout(self):
        """
        Arrange: Ensure no user is authenticated.

        Act: Send a POST request to the logout endpoint.

        Assert: Logout fails because authentication is required.
        """
        self.unauthenticate()

        response = self.client.post(
            self.get_logout_url(),
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )