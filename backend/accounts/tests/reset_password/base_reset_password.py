import re

from django.core import mail
from django.test import override_settings

from accounts.tests.base import BaseAccountAPITestCase


@override_settings(
    EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend",
    FRONTEND_URL="http://localhost:5173",
)
class BasePasswordResetTestCase(BaseAccountAPITestCase):
    def setUp(self):
        super().setUp()

        self.email = "user@example.com"
        self.unknown_email = "unknown@example.com"

        self.new_password1 = "newtestpass123"
        self.new_password2 = "newtestpass123"

        self.invalid_password = "short"

    def get_password_reset_url(self):
        return "/api/auth/password/reset/"

    def get_password_reset_confirm_url(self):
        return "/api/auth/password/reset/confirm/"

    def create_password_reset_user(self):
        return self.create_user(
            email=self.email,
            password=self.password,
        )

    def get_password_reset_payload(self, email=None):
        return {
            "email": email or self.email,
        }

    def get_password_reset_confirm_payload(
        self,
        uid=None,
        token=None,
        new_password1=None,
        new_password2=None,
    ):
        return {
            "uid": uid,
            "token": token,
            "new_password1": new_password1 or self.new_password1,
            "new_password2": new_password2 or self.new_password2,
        }

    def get_latest_email_body(self):
        return mail.outbox[-1].body

    def get_latest_email_subject(self):
        return mail.outbox[-1].subject

    def request_password_reset_for_user(self):
        return self.client.post(
            self.get_password_reset_url(),
            self.get_password_reset_payload(),
            format="json",
        )

    def get_uid_and_token_from_latest_email(self):
        email_body = self.get_latest_email_body()

        match = re.search(
            r"reset-password/([^/]+)/([^/]+)/",
            email_body,
        )

        return match.group(1), match.group(2)
