from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase


class BaseAccountAPITestCase(APITestCase):
    def setUp(self):
        self.User = get_user_model()
        self.password = "testpass123"

    # =====================
    # User helpers
    # =====================
    def create_user(self, email="user@example.com", password=None, **extra_fields):
        return self.User.objects.create_user(
            email=email,
            password=password or self.password,
            **extra_fields,
        )

    def create_superuser(
        self,
        email="admin@example.com",
        password=None,
        **extra_fields,
    ):
        return self.User.objects.create_superuser(
            email=email,
            password=password or self.password,
            **extra_fields,
        )

    # =====================
    # Auth helpers
    # =====================
    def authenticate_user(self, user):
        self.client.force_authenticate(user=user)

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
