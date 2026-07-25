from django.conf import settings
from django.test import SimpleTestCase
from django.test import override_settings

@override_settings(
    REST_FRAMEWORK={
        "DEFAULT_THROTTLE_CLASSES": [
            "rest_framework.throttling.AnonRateThrottle",
            "rest_framework.throttling.UserRateThrottle",
        ],
        "DEFAULT_THROTTLE_RATES": {
            "anon": "100/hour",
            "user": "1000/hour",
        },
    }
)

class ThrottlingSettingsTests(SimpleTestCase):
    """
    API THROTTLING TEST CHECKLIST
    -----------------------------
    Configuration
    - Verify anon throttling is configured
    - Verify authenticated throttling is configured
    - Verify anon throttling rate is configured
    - Verify authenticated throttling rate is configured
    """

    def test_anon_rate_throttling_is_configured(self):
        """
        Arrange: Read the REST framework throttle settings
        Act: Get the configured throttle classes.
        Assert: AnonRateThrottel is configured
        """
        throttle_classes = settings.REST_FRAMEWORK["DEFAULT_THROTTLE_CLASSES"]

        self.assertIn(
            "rest_framework.throttling.AnonRateThrottle",
            throttle_classes,
        )

    def test_authenticated_rate_throttling_is_configured(self):
        """
        Arrange: Read the REST framweork throttle settings
        Act: Get the configured throttle class
        Assert: UserRateThrottle is configured
        """

        throttle_classes = settings.REST_FRAMEWORK["DEFAULT_THROTTLE_CLASSES"]

        self.assertIn("rest_framework.throttling.UserRateThrottle", throttle_classes)

    def test_anon_throttle_rates_are_configured(self):
        """
        Arrange: Read the Rest framework throttle settings
        Act: get the configured throttle rate
        Assert: anon rate matches expected
        """

        throttle_rates = settings.REST_FRAMEWORK["DEFAULT_THROTTLE_RATES"]

        self.assertIn(
            throttle_rates["anon"],
            "100/hour",
        )

    def test_auth_throttle_rates_are_configured(self):
        """
        Arrange: Read the REST framework throttle settings
        Act: ge the configured throttle rate
        Assert: user rate matches expected
        """

        throttle_rates = settings.REST_FRAMEWORK["DEFAULT_THROTTLE_RATES"]

        self.assertIn(throttle_rates["user"], "1000/hour")
