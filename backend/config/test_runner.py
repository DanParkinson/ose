from django.test.runner import DiscoverRunner
from django.conf import settings

class NoThrottleTestRunner(DiscoverRunner):
    def setup_test_environment(self, **kwargs):
        super().setup_test_environment(**kwargs)

        # Disable throttling for all tests by default
        settings.REST_FRAMEWORK["DEFAULT_THROTTLE_CLASSES"] = []
        settings.REST_FRAMEWORK["DEFAULT_THROTTLE_RATES"] = {}
