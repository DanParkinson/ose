from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase

from .. import models


class BaseAPITestCase(APITestCase):
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

        # ===========
        # Subjects
        # ===========
        self.subject1 = models.Subject.objects.create(
            title="Mathematics",
            level="secondary",
            language="en",
            is_published=True,
            is_protected=False,
        )
        self.subject2 = models.Subject.objects.create(
            title="English",
            level="primary",
            language="en",
            is_published=False,
            is_protected=True,
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

    def unauthenticate(self):
        self.client.force_authenticate(user=None)

    # =====================
    # Active Subject URLs
    # =====================
    def get_subject_list_url(self):
        return reverse("subject-list")
