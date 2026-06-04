from allauth.account.models import EmailAddress

from accounts.tests.base import BaseAccountAPITestCase


class BaseJWTCookieTestCase(BaseAccountAPITestCase):
    def setUp(self):
        super().setUp()

        self.email = "jwtuser@example.com"
        self.password = "testpass123"
        self.invalid_password = "wrongpass123"

    def create_verified_user(self):
        user = self.create_user(
            email=self.email,
            password=self.password,
        )

        EmailAddress.objects.create(
            user=user,
            email=user.email,
            verified=True,
            primary=True,
        )

        return user

    def get_login_payload(self, email=None, password=None):
        return {
            "email": email or self.email,
            "password": password or self.password,
        }

    def login_verified_user(self):
        self.create_verified_user()

        return self.client.post(
            self.get_login_url(),
            self.get_login_payload(),
            format="json",
        )
