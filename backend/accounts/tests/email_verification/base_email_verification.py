from django.core import mail
from django.test import override_settings

from allauth.account.models import EmailAddress, EmailConfirmationHMAC

from accounts.tests.base import BaseAccountAPITestCase


@override_settings(
    EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend",
    FRONTEND_URL="http://localhost:5173",
)
class BaseEmailVerificationTestCase(BaseAccountAPITestCase):
    def setUp(self):
        super().setUp()

        self.email = "verify@example.com"
        self.other_email = "other@example.com"
        self.password1 = self.password
        self.password2 = self.password

    def get_registration_payload(self, email=None, password1=None, password2=None):
        return {
            "email": email or self.email,
            "password1": password1 or self.password1,
            "password2": password2 or self.password2,
        }

    def get_resend_verification_url(self):
        return "/api/auth/registration/resend-email/"

    def get_verify_email_url(self, key):
        return f"/api/auth/registration/account-confirm-email/{key}/"

    def get_email_address(self, email=None):
        return EmailAddress.objects.get(email=email or self.email)

    def create_unverified_email_address(self, email=None):
        user = self.create_user(email=email or self.email)

        email_address = EmailAddress.objects.create(
            user=user,
            email=email or self.email,
            primary=True,
            verified=False,
        )

        return user, email_address

    def create_email_confirmation(self, email_address):
        return EmailConfirmationHMAC(email_address)

    def get_latest_email_body(self):
        return mail.outbox[-1].body

    def get_latest_email_subject(self):
        return mail.outbox[-1].subject