from unittest.mock import patch

from django.test import override_settings

from accounts.adapter import CustomAccountAdapter
from accounts.tests.email_verification.base_email_verification import (
    BaseEmailVerificationTestCase,
)


class CustomAccountAdapterTests(BaseEmailVerificationTestCase):
    """
    CUSTOM ACCOUNT ADAPTER TEST CHECKLIST
    -------------------------------------
    Email Context
    - Verify frontend_url is added to the email context

    -------------------------------------
    Parent Behaviour
    - Verify parent send_mail method is called
    """

    # =====================
    # Email Context
    # =====================

    @override_settings(FRONTEND_URL="http://localhost:5173")
    def test_frontend_url_is_added_to_email_context(self):
        """
        Arrange: Prepare a custom account adapter and an empty email context.

        Act: Call send_mail through the custom adapter.

        Assert: The frontend URL is added to the context.
        """
        adapter = CustomAccountAdapter()
        context = {}

        with patch("allauth.account.adapter.DefaultAccountAdapter.send_mail"):
            adapter.send_mail(
                "account/email/email_confirmation_signup",
                self.email,
                context,
            )

        self.assertEqual(
            context["frontend_url"],
            "http://localhost:5173",
        )

    @override_settings(FRONTEND_URL="http://localhost:5173")
    def test_parent_send_mail_method_is_called(self):
        """
        Arrange: Prepare a custom account adapter and patch the parent
        send_mail method.

        Act: Call send_mail through the custom adapter.

        Assert: The parent adapter send_mail method is called.
        """
        adapter = CustomAccountAdapter()
        context = {}

        with patch(
            "allauth.account.adapter.DefaultAccountAdapter.send_mail"
        ) as mock_send_mail:
            adapter.send_mail(
                "account/email/email_confirmation_signup",
                self.email,
                context,
            )

        mock_send_mail.assert_called_once()
