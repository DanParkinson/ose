from accounts.tests.base import BaseAccountAPITestCase


class BaseUserDetailsTestCase(BaseAccountAPITestCase):
    def setUp(self):
        super().setUp()

        self.email = "user@example.com"
        self.staff_email = "staff@example.com"
        self.admin_email = "admin@example.com"
