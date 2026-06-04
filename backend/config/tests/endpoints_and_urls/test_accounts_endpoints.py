from django.test import SimpleTestCase
from django.urls import resolve


class AccountEndpointUrlTests(SimpleTestCase):
    """
    ACCOUNT ENDPOINT URL TEST CHECKLIST
    -----------------------------------
    URL Availability
    - Verify account deactivate endpoint resolves
    - Verify reactivation request endpoint resolves
    - Verify reactivation confirm endpoint resolves
    """

    def test_account_deactivate_endpoint_resolves(self):
        """
        Arrange: Define the documented account deactivate endpoint.
        Act: Resolve the URL.
        Assert: The endpoint exists in the URL configuration.
        """
        resolver = resolve("/api/account/deactivate/")

        self.assertIsNotNone(resolver)

    def test_reactivation_request_endpoint_resolves(self):
        """
        Arrange: Define the documented reactivation request endpoint.
        Act: Resolve the URL.
        Assert: The endpoint exists in the URL configuration.
        """
        resolver = resolve("/api/account/reactivate/request/")

        self.assertIsNotNone(resolver)

    def test_reactivation_confirm_endpoint_resolves(self):
        """
        Arrange: Define the documented reactivation confirm endpoint.
        Act: Resolve the URL.
        Assert: The endpoint exists in the URL configuration.
        """
        resolver = resolve("/api/account/reactivate/confirm/")

        self.assertIsNotNone(resolver)
