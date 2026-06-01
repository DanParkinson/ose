from accounts.tests.base import BaseAccountAPITestCase


class BaseEmailAuthenticationTestCase(BaseAccountAPITestCase):
    def setUp(self):
        super().setUp()

        self.email = "user@example.com"
        self.other_email = "other@example.com"
        self.admin_email = "admin@example.com"

        self.uppercase_email = "test@EXAMPLE.COM"
        self.normalised_email = "test@example.com"

        self.duplicate_email_error = (
            "A user with this email address already exists."
        )