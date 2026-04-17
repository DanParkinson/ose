from rest_framework import status
from .. import models
from .base import BaseAPITestCase


class BaseSubjectTestCase(BaseAPITestCase):
    def setUp(self):
        super().setUp()
        self.list_url = self.get_subject_list_url()
        self.subject1_detail_url = self.get_subject_detail_url(self.subject1)
        self.subject2_detail_url = self.get_subject_detail_url(self.subject2)

    def get_subject_payload(self, **overrides):
        payload = {
            "title": "Science",
            "level": "gcse",
            "language": "en",
            "is_published": True,
            "is_protected": False,
        }
        payload.update(overrides)
        return payload

    def assert_subject_matches(
        self,
        subject,
        *,
        title,
        slug,
        level,
        language,
        is_published,
        is_protected,
    ):
        self.assertEqual(subject.title, title)
        self.assertEqual(subject.slug, slug)
        self.assertEqual(subject.level, level)
        self.assertEqual(subject.language, language)
        self.assertEqual(subject.is_published, is_published)
        self.assertEqual(subject.is_protected, is_protected)


class SubjectListCreateViewTests(BaseSubjectTestCase):
    """
    LISTCREATE VIEW TEST CHECKLIST
    ------------------
    List - Permissions - Public
    - Verify All users recieve 200 OKAY
    ------------------
    List - Queryset / Returned Objects
    - Verify all expected objects are returned
    ------------------
    List - Response Structure
    - Verify expected fields are present
    - Verify response structure is consistent across returned objects
    ------------------
    List - Response Values
    - Verify returned values match database records
    - Verify returned values are correctly serialised
    ------------------
    Create - Permissions
    - Verify ADMIN users CAN create object and receive 201 CREATED
    - Verify UNAUTHORISED users CANNOT create object and receive 403 FORBIDDEN
    - Verify UNAUTHENTICATED users CANNOT create object and receive 401 UNAUTHORIZED
    ------------------
    Create - Payloads
    - Verify valid payload creates object successfully
    - Verify invalid payloads return 400
    - Verify missing required fields return 400 BAD REQUEST
    - Verify validation errors are included in the response body
    ------------------
    Create - Business Rules
    - Verify duplicate objects return 400 BAD REQUEST
    - Verify default/generated fields are set correctly after creation
    """

    # ==================
    # List - Permissions
    # ==================

    def test_any_user_can_access_subject_list(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    # =================================
    # List - Queryset / Returned Objects
    # =================================

    def test_subject_list_returns_all_subjects(self):
        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_subject_list_returns_empty_list_when_no_subjects_exist(self):
        models.Subject.objects.all().delete()

        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])

    # ==========================
    # List - Response Structure
    # ==========================

    def test_subject_list_returns_expected_fields(self):
        response = self.client.get(self.list_url)
        first = response.data[0]

        self.assertIn("subject_id", first)
        self.assertIn("title", first)
        self.assertIn("slug", first)
        self.assertIn("level", first)
        self.assertIn("language", first)
        self.assertIn("is_published", first)
        self.assertIn("is_protected", first)

    def test_subject_list_response_structure_is_consistent(self):
        response = self.client.get(self.list_url)

        keys = set(response.data[0].keys())
        for item in response.data:
            self.assertEqual(set(item.keys()), keys)

    # =======================
    # List - Response Values
    # =======================

    def test_subject_list_returns_expected_titles(self):
        response = self.client.get(self.list_url)

        titles = [s["title"] for s in response.data]
        self.assertIn(self.subject1.title, titles)
        self.assertIn(self.subject2.title, titles)

    def test_subject_list_returns_expected_subject_values(self):
        response = self.client.get(self.list_url)

        data = {s["title"]: s for s in response.data}

        self.assertEqual(data[self.subject1.title]["slug"], self.subject1.slug)
        self.assertEqual(data[self.subject2.title]["slug"], self.subject2.slug)

    # =====================
    # Create - Permissions
    # =====================

    def test_superuser_can_create_subject(self):
        self.authenticate_admin()

        response = self.client.post(
            self.list_url,
            self.get_subject_payload(),
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_authenticated_non_admin_cannot_create_subject(self):
        self.authenticate_user()

        response = self.client.post(
            self.list_url,
            self.get_subject_payload(),
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(models.Subject.objects.count(), 2)

    def test_unauthenticated_user_cannot_create_subject(self):
        response = self.client.post(
            self.list_url,
            self.get_subject_payload(),
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(models.Subject.objects.count(), 2)

    # ========================
    # Create - Valid Payloads
    # ========================

    def test_valid_payload_creates_subject_successfully(self):
        self.authenticate_admin()

        response = self.client.post(
            self.list_url,
            self.get_subject_payload(),
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(models.Subject.objects.count(), 3)

    # ==========================
    # Create - Invalid Payloads
    # ==========================

    def test_duplicate_subject_returns_400(self):
        self.authenticate_admin()

        response = self.client.post(
            self.list_url,
            self.get_subject_payload(title=self.subject1.title),
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_missing_required_fields_returns_400(self):
        self.authenticate_admin()

        response = self.client.post(
            self.list_url,
            {"title": "Science"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_invalid_payload_returns_validation_errors(self):
        self.authenticate_admin()

        response = self.client.post(
            self.list_url,
            {"title": "", "level": "invalid", "language": "invalid"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # =====================
    # Create - Business Rules
    # =====================

    def test_generated_slug_is_set_correctly_after_creation(self):
        self.authenticate_admin()

        self.client.post(
            self.list_url,
            self.get_subject_payload(title="Biology"),
            format="json",
        )

        subject = models.Subject.objects.get(title="Biology")

        self.assert_subject_matches(
            subject,
            title="Biology",
            slug="biology-gcse-en",
            level="gcse",
            language="en",
            is_published=True,
            is_protected=False,
        )


class SubjectDetailViewTests(BaseSubjectTestCase):
    """
    DETAIL VIEW TEST CHECKLIST
    --------------------------
    Retrieve - Permissions - Public
    - Verify PUBLIC users can retrieve a subject and receive 200 OK
    --------------------------
    Retrieve - Object Lookup
    - Verify correct object returned
    - Verify invalid ID/slug returns 404
    --------------------------
    Retrieve - Response Structure
    - Verify expected fields are present
    --------------------------
    Retrieve - Response Values
    - Verify returned values match database records
    --------------------------
    Update - Permissions
    - Verify ADMIN users can update the object and receive 200 OK
    - Verify UNAUTHORISED users cannot update the object and receive 403 FORBIDDEN
    - Verify UNAUTHENTICATED users cannot update the object and receive 403 FORBIDDEN
    --------------------------
    Update - Payloads
    - Verify valid payload updates the object successfully
    - Verify invalid payload returns 400 BAD REQUEST
    - Verify validation errors are included in the response body
    --------------------------
    Update - Business Rules
    - Verify unprotected objects allow updates where applicable
    - Verify protected objects prevent updates
    --------------------------
    Delete - Permissions
    - Verify AUTHORISED users can delete the object and receive 204 NO CONTENT
    - Verify UNAUTHORISED users cannot delete the object and receive 403 FORBIDDEN
    - Verify UNAUTHENTICATED users cannot delete the object and receive 403 FORBIDDEN
    --------------------------
    Delete - Business Rules
    - Verify protected objects cannot be deleted and return 403 FORBIDDEN where applicable
    - Verify unprotected objects can be deleted successfully
    """

    # =====================
    # Retrieve - Permissions - Public
    # =====================

    def test_public_user_can_retrieve_subject(self):
        response = self.client.get(self.subject1_detail_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    # =====================
    # Retrieve - Object Lookup
    # =====================

    def test_retrieve_subject_returns_correct_object(self):
        response = self.client.get(self.subject1_detail_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["subject_id"], str(self.subject1.subject_id))
        self.assertEqual(response.data["slug"], self.subject1.slug)

    def test_retrieve_subject_with_invalid_id_returns_404(self):
        url = self.subject1_detail_url.replace(
            str(self.subject1.subject_id),
            "999999",
        )

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_retrieve_subject_with_invalid_slug_returns_404(self):
        url = self.subject1_detail_url.replace(
            self.subject1.slug,
            "invalid-slug",
        )

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # =====================
    # Retrieve - Response Structure
    # =====================

    def test_retrieve_subject_response_contains_expected_fields(self):
        response = self.client.get(self.subject1_detail_url)

        expected_fields = {
            "subject_id",
            "title",
            "slug",
            "level",
            "language",
            "is_published",
            "is_protected",
        }

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(expected_fields.issubset(response.data.keys()))

    # =====================
    # Retrieve - Response Values
    # =====================

    def test_retrieve_subject_response_values_match_database(self):
        response = self.client.get(self.subject1_detail_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], self.subject1.title)
        self.assertEqual(response.data["slug"], self.subject1.slug)
        self.assertEqual(response.data["level"], self.subject1.level)
        self.assertEqual(response.data["language"], self.subject1.language)
        self.assertEqual(response.data["is_published"], self.subject1.is_published)
        self.assertEqual(response.data["is_protected"], self.subject1.is_protected)

    # =====================
    # Update - Permissions
    # =====================

    def test_admin_can_update_subject(self):
        self.authenticate_admin()
        payload = self.get_subject_payload(title="Biology")

        response = self.client.patch(self.subject1_detail_url, payload)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_authenticated_user_cannot_update_subject(self):
        self.authenticate_user()
        payload = self.get_subject_payload(title="Biology")

        response = self.client.patch(self.subject1_detail_url, payload)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthenticated_user_cannot_update_subject(self):
        payload = self.get_subject_payload(title="Biology")

        response = self.client.patch(self.subject1_detail_url, payload)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # =====================
    # Update - Payloads
    # =====================

    def test_valid_payload_updates_subject(self):
        self.authenticate_admin()
        payload = self.get_subject_payload(title="Science")

        response = self.client.patch(self.subject1_detail_url, payload)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.subject1.refresh_from_db()
        self.assertEqual(self.subject1.title, "Science")

    def test_invalid_payload_returns_400(self):
        self.authenticate_admin()
        payload = self.get_subject_payload(title="")

        response = self.client.patch(self.subject1_detail_url, payload)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_invalid_payload_returns_validation_errors(self):
        self.authenticate_admin()
        payload = self.get_subject_payload(title="")

        response = self.client.patch(self.subject1_detail_url, payload)

        self.assertIn("title", response.data)

    # =====================
    # Update - Business Rules
    # =====================

    def test_unprotected_subject_can_be_updated(self):
        self.authenticate_admin()
        payload = self.get_subject_payload(title="Chemistry")

        response = self.client.patch(self.subject1_detail_url, payload)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_protected_subject_cannot_be_updated(self):
        self.authenticate_admin()
        payload = self.get_subject_payload(title="Updated English")

        response = self.client.patch(self.subject2_detail_url, payload)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # =====================
    # Delete - Permissions
    # =====================

    def test_admin_can_delete_subject(self):
        self.authenticate_admin()

        response = self.client.delete(self.subject1_detail_url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_authenticated_user_cannot_delete_subject(self):
        self.authenticate_user()

        response = self.client.delete(self.subject1_detail_url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthenticated_user_cannot_delete_subject(self):
        response = self.client.delete(self.subject1_detail_url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # =====================
    # Delete - Business Rules
    # =====================

    def test_unprotected_subject_can_be_deleted(self):
        self.authenticate_admin()

        response = self.client.delete(self.subject1_detail_url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_protected_subject_cannot_be_deleted(self):
        self.authenticate_admin()

        response = self.client.delete(self.subject2_detail_url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
