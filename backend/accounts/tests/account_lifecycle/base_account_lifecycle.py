from django.core import mail
from django.test import override_settings

from accounts.tests.base import BaseAccountAPITestCase


@override_settings(
    EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend",
)
class BaseAccountLifecycleTestCase(BaseAccountAPITestCase):
    def setUp(self):
        super().setUp()

        self.email = "user@example.com"
        self.inactive_email = "inactive@example.com"
        self.unknown_email = "unknown@example.com"

    def create_active_user(self):
        return self.create_user(
            email=self.email,
            password=self.password,
        )

    def create_inactive_user(self):
        return self.create_user(
            email=self.inactive_email,
            password=self.password,
            is_active=False,
        )

    def get_reactivation_request_payload(self, email=None):
        return {
            "email": email or self.inactive_email,
        }

    def get_reactivation_confirm_payload(self, uid=None, token=None):
        return {
            "uid": uid,
            "token": token,
        }

    def get_latest_email_body(self):
        return mail.outbox[-1].body

    def get_latest_email_subject(self):
        return mail.outbox[-1].subject