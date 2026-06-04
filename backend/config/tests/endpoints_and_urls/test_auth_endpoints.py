from django.test import SimpleTestCase
from django.urls import resolve


class AuthEndpointUrlTests(SimpleTestCase):
    """
    AUTH ENDPOINT URL TEST CHECKLIST
    --------------------------------
    URL Availability
    - Verify registration endpoint resolves
    - Verify login endpoint resolves
    - Verify logout endpoint resolves
    - Verify user detail endpoint resolves
    - Verify password reset endpoint resolves
    - Verify password reset confirm endpoint resolves
    """

    def test_registration_endpoint_resolves(self):
        """
        Arrange: Define the documented registration endpoint.
        Act: Resolve the URL.
        Assert: The endpoint exists in the URL configuration.
        """
        resolver = resolve("/api/auth/registration/")

        self.assertIsNotNone(resolver)

    def test_login_endpoint_resolves(self):
        """
        Arrange: Define the documented login endpoint.
        Act: Resolve the URL.
        Assert: The endpoint exists in the URL configuration.
        """
        resolver = resolve("/api/auth/login/")

        self.assertIsNotNone(resolver)

    def test_logout_endpoint_resolves(self):
        """
        Arrange: Define the documented logout endpoint.
        Act: Resolve the URL.
        Assert: The endpoint exists in the URL configuration.
        """
        resolver = resolve("/api/auth/logout/")

        self.assertIsNotNone(resolver)

    def test_user_detail_endpoint_resolves(self):
        """
        Arrange: Define the documented user detail endpoint.
        Act: Resolve the URL.
        Assert: The endpoint exists in the URL configuration.
        """
        resolver = resolve("/api/auth/user/")

        self.assertIsNotNone(resolver)

    def test_password_reset_endpoint_resolves(self):
        """
        Arrange: Define the documented password reset endpoint.
        Act: Resolve the URL.
        Assert: The endpoint exists in the URL configuration.
        """
        resolver = resolve("/api/auth/password/reset/")

        self.assertIsNotNone(resolver)

    def test_password_reset_confirm_endpoint_resolves(self):
        """
        Arrange: Define the documented password reset confirm endpoint.
        Act: Resolve the URL.
        Assert: The endpoint exists in the URL configuration.
        """
        resolver = resolve("/api/auth/password/reset/confirm/")

        self.assertIsNotNone(resolver)
