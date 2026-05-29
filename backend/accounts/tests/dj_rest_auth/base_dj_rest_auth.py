from accounts.tests.base import BaseAccountAPITestCase


class BaseDJRestAuthTestCase(BaseAccountAPITestCase):
    def setUp(self):
        super().setUp()

        self.email = "user@example.com"
        self.other_email = "other@example.com"
        self.password1 = self.password
        self.password2 = self.password
        self.invalid_password = "wrongpass123"

    def get_registration_payload(self, email=None, password1=None, password2=None):
        return {
            "email": email or self.email,
            "password1": password1 or self.password1,
            "password2": password2 or self.password2,
        }

    def get_login_payload(self, email=None, password=None):
        return {
            "email": email or self.email,
            "password": password or self.password,
        }