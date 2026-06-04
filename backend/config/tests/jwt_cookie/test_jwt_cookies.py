from django.conf import settings
from rest_framework import status

from config.tests.jwt_cookie.base_jwt_cookies import (
    BaseJWTCookieTestCase,
)


class JWTCookieTests(BaseJWTCookieTestCase):
    """
    JWT COOKIE AUTHENTICATION TEST CHECKLIST
    ----------------------------------------
    Login Cookies
    - Verify login sets access cookie
    - Verify login sets refresh cookie

    ----------------------------------------
    Authenticated User Access
    - Verify authenticated user endpoint works with JWT cookies
    - Verify unauthenticated user endpoint fails without JWT cookies

    ----------------------------------------
    Logout Cookies
    - Verify logout clears access cookie
    - Verify logout clears refresh cookie

    ----------------------------------------
    Token Refresh
    - Verify refresh endpoint works with refresh cookie
    - Verify refresh endpoint fails without refresh cookie

    ----------------------------------------
    Cookie Security Settings
    - Verify access cookie is HTTP only
    - Verify refresh cookie is HTTP only
    - Verify access cookie uses configured SameSite value
    - Verify refresh cookie uses configured SameSite value
    """

    # =====================
    # Login Cookies
    # =====================

    def test_login_sets_access_cookie(self):
        """
        Arrange: Create a verified user.

        Act: Log in through the login endpoint.

        Assert: The response includes an access cookie.
        """
        response = self.login_verified_user()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.cookies)

    def test_login_sets_refresh_cookie(self):
        """
        Arrange: Create a verified user.

        Act: Log in through the login endpoint.

        Assert: The response includes a refresh cookie.
        """
        response = self.login_verified_user()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("refresh", response.cookies)

    # =====================
    # Authenticated User Access
    # =====================

    def test_authenticated_user_endpoint_works_with_jwt_cookies(self):
        """
        Arrange: Create and log in a verified user.

        Act: Send a GET request to the authenticated user endpoint.

        Assert: The endpoint returns the authenticated user's details.
        """
        self.login_verified_user()

        response = self.client.get(
            self.get_user_detail_url(),
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], self.email)

    def test_unauthenticated_user_endpoint_fails_without_jwt_cookies(self):
        """
        Arrange: Ensure the client has no authentication cookies.

        Act: Send a GET request to the authenticated user endpoint.

        Assert: The request is rejected.
        """
        self.client.cookies.clear()

        response = self.client.get(
            self.get_user_detail_url(),
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # =====================
    # Logout Cookies
    # =====================

    def test_logout_clears_access_cookie(self):
        """
        Arrange: Create and log in a verified user.

        Act: Send a POST request to the logout endpoint.

        Assert: The access cookie is cleared.
        """
        self.login_verified_user()

        response = self.client.post(
            self.get_logout_url(),
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.cookies)
        self.assertEqual(response.cookies["access"].value, "")

    def test_logout_clears_refresh_cookie(self):
        """
        Arrange: Create and log in a verified user.

        Act: Send a POST request to the logout endpoint.

        Assert: The refresh cookie is cleared.
        """
        self.login_verified_user()

        response = self.client.post(
            self.get_logout_url(),
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("refresh", response.cookies)
        self.assertEqual(response.cookies["refresh"].value, "")

    # =====================
    # Token Refresh
    # =====================

    def test_refresh_endpoint_works_with_refresh_cookie(self):
        """
        Arrange: Create and log in a verified user so the client receives a refresh cookie.

        Act: Send a POST request to the token refresh endpoint.

        Assert: The refresh request succeeds.
        """
        self.login_verified_user()

        response = self.client.post(
            self.get_token_refresh_url(),
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_refresh_endpoint_fails_without_refresh_cookie(self):
        """
        Arrange: Ensure the client has no refresh cookie.

        Act: Send a POST request to the token refresh endpoint.

        Assert: The refresh request is rejected.
        """
        self.client.cookies.clear()

        response = self.client.post(
            self.get_token_refresh_url(),
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # =====================
    # Cookie Security Settings
    # =====================

    def test_access_cookie_is_http_only(self):
        """
        Arrange: Create and log in a verified user.

        Act: Read the access cookie settings.

        Assert: The access cookie is HTTP only.
        """
        response = self.login_verified_user()

        self.assertTrue(response.cookies["access"]["httponly"])

    def test_refresh_cookie_is_http_only(self):
        """
        Arrange: Create and log in a verified user.

        Act: Read the refresh cookie settings.

        Assert: The refresh cookie is HTTP only.
        """
        response = self.login_verified_user()

        self.assertTrue(response.cookies["refresh"]["httponly"])

    def test_access_cookie_uses_configured_samesite_value(self):
        """
        Arrange: Create and log in a verified user.

        Act: Read the access cookie SameSite value.

        Assert: The access cookie uses the configured SameSite setting.
        """
        response = self.login_verified_user()

        self.assertEqual(
            response.cookies["access"]["samesite"],
            settings.REST_AUTH["JWT_AUTH_SAMESITE"],
        )

    def test_refresh_cookie_uses_configured_samesite_value(self):
        """
        Arrange: Create and log in a verified user.

        Act: Read the refresh cookie SameSite value.

        Assert: The refresh cookie uses the configured SameSite setting.
        """
        response = self.login_verified_user()

        self.assertEqual(
            response.cookies["refresh"]["samesite"],
            settings.REST_AUTH["JWT_AUTH_SAMESITE"],
        )
