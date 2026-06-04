from accounts.tests.base import BaseAccountAPITestCase


class BaseUserCreationTestCase(BaseAccountAPITestCase):
    def setUp(self):
        super().setUp()

        self.email = "user@example.com"
        self.admin_email = "admin@example.com"

        self.uppercase_email = "test@EXAMPLE.COM"
        self.normalised_email = "test@example.com"
