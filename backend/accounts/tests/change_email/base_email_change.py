from accounts.tests.base import BaseAccountAPITestCase


class BaseEmailChangeTestCase(BaseAccountAPITestCase):
    def setUp(self):
        super().setUp()

        self.current_email = "user@example.com"
        self.new_email = "new@example.com"

    def get_email_change_request_url(self):
        return "/api/account/update-email/"

    def get_email_change_confirm_url(self):
        return "/api/account/update-email/confirm/"

    def get_email_change_cancel_url(self):
        return "/api/account/update-email/cancel/"
