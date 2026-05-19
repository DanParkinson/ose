from django.urls import reverse
from rest_framework import status

from core import models
from core.tests.base import BaseAPITestCase


class SubjectDetailViewTests(BaseAPITestCase):
    """
    SUBJECT DETAIL VIEW TEST CHECKLIST
    ----------------------------------
    Retrieve - Permissions
    - Verify admin users can retrieve subject detail
    - Verify authenticated non-admin users cannot retrieve subject detail
    - Verify unauthenticated users cannot retrieve subject detail

    Retrieve - Response Values
    - Verify returned subject detail matches the database record

    Update - Permissions
    - Verify admin users can update subjects
    - Verify authenticated non-admin users cannot update subjects
    - Verify unauthenticated users cannot update subjects

    Update - Protected Logic
    - Verify protected subjects cannot be updated
    - Verify non-protected subjects can be updated
    - Verify protected update attempts return 403 FORBIDDEN
    - Verify protected subjects remain unchanged after failed update attempts

    Delete - Permissions
    - Verify admin users can delete subjects
    - Verify authenticated non-admin users cannot delete subjects
    - Verify unauthenticated users cannot delete subjects

    Delete - Protected Logic
    - Verify protected subjects cannot be deleted
    - Verify non-protected subjects can be deleted
    - Verify protected delete attempts return 403 FORBIDDEN
    - Verify protected subjects remain in the database after failed delete attempts

    Not Found
    - Verify invalid or deleted subject returns 404 NOT FOUND
    """

    def setUp(self):
        super().setUp()
        self.detail_url = self.get_subject_detail_url(self.subject1)

    def get_subject_detail_url(self, subject):
        return reverse(
            "subject-detail",
            kwargs={"subject_id": subject.subject_id},
        )

    # ==================
    # Retrieve - Permissions
    # ==================

    def test_admin_can_retrieve_subject_detail(self):
        self.authenticate_admin()

        response = self.client.get(self.detail_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_authenticated_non_admin_cannot_retrieve_subject_detail(self):
        self.authenticate_user()

        response = self.client.get(self.detail_url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthenticated_user_cannot_retrieve_subject_detail(self):
        response = self.client.get(self.detail_url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # ==================
    # Retrieve - Response Values
    # ==================

    def test_subject_detail_returns_expected_values(self):
        self.authenticate_admin()

        response = self.client.get(self.detail_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["subject_id"], str(self.subject1.subject_id))
        self.assertEqual(response.data["title"], self.subject1.title)
        self.assertEqual(response.data["slug"], self.subject1.slug)
        self.assertEqual(response.data["level"], self.subject1.level)
        self.assertEqual(response.data["language"], self.subject1.language)
        self.assertEqual(response.data["is_published"], self.subject1.is_published)
        self.assertEqual(response.data["is_protected"], self.subject1.is_protected)

    # ==================
    # Update - Permissions
    # ==================

    def test_admin_can_update_subject(self):
        self.authenticate_admin()

        response = self.client.patch(
            self.detail_url,
            {
                "title": "Updated Mathematics",
                "is_published": False,
            },
            format="json",
        )

        self.subject1.refresh_from_db()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.subject1.title, "Updated Mathematics")
        self.assertFalse(self.subject1.is_published)

    def test_authenticated_non_admin_cannot_update_subject(self):
        self.authenticate_user()

        response = self.client.patch(
            self.detail_url,
            {"title": "Updated Mathematics"},
            format="json",
        )

        self.subject1.refresh_from_db()

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(self.subject1.title, "Mathematics")

    def test_unauthenticated_user_cannot_update_subject(self):
        response = self.client.patch(
            self.detail_url,
            {"title": "Updated Mathematics"},
            format="json",
        )

        self.subject1.refresh_from_db()

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(self.subject1.title, "Mathematics")

    # ==================
    # Delete - Permissions
    # ==================

    def test_admin_can_delete_subject(self):
        self.authenticate_admin()

        response = self.client.delete(self.detail_url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(
            models.Subject.objects.filter(subject_id=self.subject1.subject_id).exists()
        )

    def test_authenticated_non_admin_cannot_delete_subject(self):
        self.authenticate_user()

        response = self.client.delete(self.detail_url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(
            models.Subject.objects.filter(subject_id=self.subject1.subject_id).exists()
        )

    def test_unauthenticated_user_cannot_delete_subject(self):
        response = self.client.delete(self.detail_url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertTrue(
            models.Subject.objects.filter(subject_id=self.subject1.subject_id).exists()
        )

    # ==================
    # Not Found
    # ==================

    def test_subject_detail_returns_404_for_deleted_subject(self):
        self.authenticate_admin()

        self.subject1.delete()

        response = self.client.get(self.detail_url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # ==================
    # Update - Protected Logic
    # ==================

    def test_admin_can_update_subject_when_not_protected(self):
        self.authenticate_admin()

        self.subject1.is_protected = False
        self.subject1.save()

        response = self.client.patch(
            self.detail_url,
            {"title": "Updated Mathematics"},
            format="json",
        )

        self.subject1.refresh_from_db()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.subject1.title, "Updated Mathematics")

    def test_admin_cannot_update_subject_when_protected(self):
        self.authenticate_admin()

        self.subject1.is_protected = True
        self.subject1.save()

        response = self.client.patch(
            self.detail_url,
            {"title": "Updated Mathematics"},
            format="json",
        )

        self.subject1.refresh_from_db()

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(self.subject1.title, "Mathematics")
        self.assertEqual(
            response.data["detail"],
            "This Subject is protected and cannot be updated. Contact Admin",
        )

    # ==================
    # Delete - Protected Logic
    # ==================

    def test_admin_can_delete_subject_when_not_protected(self):
        self.authenticate_admin()

        self.subject1.is_protected = False
        self.subject1.save()

        response = self.client.delete(self.detail_url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(
            models.Subject.objects.filter(subject_id=self.subject1.subject_id).exists()
        )

    def test_admin_cannot_delete_subject_when_protected(self):
        self.authenticate_admin()

        self.subject1.is_protected = True
        self.subject1.save()

        response = self.client.delete(self.detail_url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(
            models.Subject.objects.filter(subject_id=self.subject1.subject_id).exists()
        )
        self.assertEqual(
            response.data["detail"],
            "This Subject cannot be deleted. Contact Admin",
        )
