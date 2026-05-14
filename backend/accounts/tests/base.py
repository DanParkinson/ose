from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase


class BaseAccountAPITestCase(APITestCase):
    def setUp(self):
        self.User = get_user_model()

        # ===========
        # Users
        # ===========
        self.user = self.User.objects.create_user(
            email="user@example.com",
            password="testpass123",
        )
        self.other_user = self.User.objects.create_user(
            email="otheruser@example.com",
            password="testpass123",
        )
        self.superuser = self.User.objects.create_superuser(
            email="admin@example.com",
            password="testpass123",
        )
        self.inactive_user = self.User.objects.create_user(
            email="inactive@example.com",
            password="testpass123",
            is_active=False,
        )

    # =====================
    # Auth helpers
    # =====================
    def authenticate_user(self):
        self.client.force_authenticate(user=self.user)

    def authenticate_other_user(self):
        self.client.force_authenticate(user=self.other_user)

    def authenticate_admin(self):
        self.client.force_authenticate(user=self.superuser)

    def authenticate_inactive_user(self):
        self.client.force_authenticate(user=self.inactive_user)

    def unauthenticate(self):
        self.client.force_authenticate(user=None)

    # =====================
    # Auth URLs
    # =====================
    def get_registration_url(self):
        return "/api/auth/registration/"

    def get_login_url(self):
        return "/api/auth/login/"

    def get_logout_url(self):
        return "/api/auth/logout/"

    def get_user_detail_url(self):
        return "/api/auth/user/"

    def get_token_refresh_url(self):
        return "/api/auth/token/refresh/"

    # =====================
    # Account URLs
    # =====================
    def get_account_deactivate_url(self):
        return "/api/account/deactivate/"

    def get_reactivation_request_url(self):
        return "/api/account/reactivate/request/"

    def get_reactivation_confirm_url(self):
        return "/api/account/reactivate/confirm/"
