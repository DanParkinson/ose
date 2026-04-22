from .. import models
import uuid
from rest_framework import status
from .base import BaseAPITestCase


class BaseLessonNameTestCase(BaseAPITestCase):
    def setUp(self):
        super().setUp()
        self.list_url = self.get_lesson_name_list_url()
        self.lesson_name1_detail_url = self.get_lesson_name_detail_url(
            self.lesson_name1
        )
        self.lesson_name2_detail_url = self.get_lesson_name_detail_url(
            self.lesson_name2
        )

    def get_lesson_name_payload(self, **overrides):
        payload = {
            "title": "Quadratic Equations",
            "subjects": [self.subject1.title],
            "is_protected": False,
        }
        payload.update(overrides)
        return payload

    def assert_lesson_name_matches(
        self,
        lesson_name,
        *,
        title,
        slug,
        subjects,
        is_protected,
    ):
        self.assertEqual(lesson_name.title, title)
        self.assertEqual(lesson_name.slug, slug)
        self.assertCountEqual(
            lesson_name.subjects.values_list("title", flat=True),
            subjects,
        )
        self.assertEqual(lesson_name.is_protected, is_protected)


class LessonNameListCreateViewTests(BaseLessonNameTestCase):
    """
    LISTCREATE VIEW TEST CHECKLIST
    ------------------
    List - Permissions
    - Verify ADMIN users recieve 200 OKAY
    - Verify UNAUTHORISED users recieve 403 FORBIDDEN
    - Verify UNAUTHENTICATED users recieve 403 FORBIDDEN
    ------------------
    List - Queryset / Returned Objects
    - Verify all expected objects are returned
    - Verify empty queryset returns 200 OK with an empty list
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
    - Verify UNAUTHENTICATED users CANNOT create object and receive 403 FORBIDDEN
    ------------------
    Create - Payloads
    - Verify valid payload creates object successfully
    - Verify valid payload assigns subject relationships correctly
    - Verify valid payload can assign multiple subjects
    - Verify create response returns correctly serialised lesson name data
    - Verify invalid payloads return 400
    - Verify missing required fields return 400 BAD REQUEST
    - Verify validation errors are included in the response body
    ------------------
    Create - Business Rules
    - Verify duplicate objects return 400 BAD REQUEST
    - Verify duplicate validation is attached to correct field
    - Verify default/generated fields are set correctly after creation
    """

    # ==================
    # List - Permissions
    # ==================

    def test_superuser_can_access_lesson_name_list(self):
        self.authenticate_admin()
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_authenticated_non_admin_cannot_access_lesson_name_list(self):
        self.authenticate_user()
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthenticated_user_cannot_access_lesson_name_list(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # =================================
    # List - Queryset / Returned Objects
    # =================================

    def test_lesson_name_list_returns_all_lesson_names(self):
        self.authenticate_admin()
        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 2)

    def test_lesson_name_list_returns_empty_list_when_no_lesson_names_exist(self):
        self.authenticate_admin()
        models.LessonName.objects.all().delete()

        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["results"], [])

    # ==========================
    # List - Response Structure
    # ==========================

    def test_lesson_name_list_returns_expected_fields(self):
        self.authenticate_admin()
        response = self.client.get(self.list_url)

        first_lesson_name = response.data["results"][0]

        self.assertIn("lesson_name_id", first_lesson_name)
        self.assertIn("subjects", first_lesson_name)
        self.assertIn("title", first_lesson_name)
        self.assertIn("slug", first_lesson_name)
        self.assertIn("is_protected", first_lesson_name)

    def test_lesson_name_list_response_structure_is_consistent(self):
        self.authenticate_admin()
        response = self.client.get(self.list_url)

        results = response.data["results"]
        first_keys = set(results[0].keys())

        for lesson_name in results:
            self.assertEqual(set(lesson_name.keys()), first_keys)

    # =======================
    # List - Response Values
    # =======================

    def test_lesson_name_list_returns_expected_titles(self):
        self.authenticate_admin()
        response = self.client.get(self.list_url)

        returned_titles = [
            lesson_name["title"] for lesson_name in response.data["results"]
        ]

        self.assertIn(self.lesson_name1.title, returned_titles)
        self.assertIn(self.lesson_name2.title, returned_titles)

    def test_lesson_name_list_returns_expected_lesson_name_values(self):
        self.authenticate_admin()
        response = self.client.get(self.list_url)

        returned_lesson_names = {
            lesson_name["title"]: lesson_name
            for lesson_name in response.data["results"]
        }

        first_lesson_name = returned_lesson_names[self.lesson_name1.title]
        second_lesson_name = returned_lesson_names[self.lesson_name2.title]

        self.assertEqual(first_lesson_name["slug"], self.lesson_name1.slug)
        self.assertEqual(first_lesson_name["subjects"], [self.subject1.title])
        self.assertFalse(first_lesson_name["is_protected"])

        self.assertEqual(second_lesson_name["slug"], self.lesson_name2.slug)
        self.assertEqual(second_lesson_name["subjects"], [self.subject2.title])
        self.assertTrue(second_lesson_name["is_protected"])

    # =====================
    # Create - Permissions
    # =====================

    def test_superuser_can_create_lesson_name(self):
        self.authenticate_admin()
        payload = self.get_lesson_name_payload()

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(models.LessonName.objects.count(), 3)
        self.assertTrue(
            models.LessonName.objects.filter(title=payload["title"]).exists()
        )

    def test_authenticated_non_admin_cannot_create_lesson_name(self):
        self.authenticate_user()
        payload = self.get_lesson_name_payload()

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(models.LessonName.objects.count(), 2)
        self.assertFalse(
            models.LessonName.objects.filter(title=payload["title"]).exists()
        )

    def test_unauthenticated_user_cannot_create_lesson_name(self):
        payload = self.get_lesson_name_payload()

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(models.LessonName.objects.count(), 2)
        self.assertFalse(
            models.LessonName.objects.filter(title=payload["title"]).exists()
        )

    # ========================
    # Create - Valid Payloads
    # ========================

    def test_valid_payload_creates_lesson_name_successfully(self):
        self.authenticate_admin()
        payload = self.get_lesson_name_payload()

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(models.LessonName.objects.count(), 3)

        lesson_name = models.LessonName.objects.get(title=payload["title"])
        self.assert_lesson_name_matches(
            lesson_name,
            title=payload["title"],
            slug="quadratic-equations",
            subjects=[self.subject1.title],
            is_protected=False,
        )

    def test_valid_payload_can_assign_multiple_subjects(self):
        self.authenticate_admin()
        payload = self.get_lesson_name_payload(
            title="Essay Writing Skills",
            subjects=[self.subject1.title, self.subject2.title],
            is_protected=True,
        )

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        lesson_name = models.LessonName.objects.get(title=payload["title"])
        self.assert_lesson_name_matches(
            lesson_name,
            title=payload["title"],
            slug="essay-writing-skills",
            subjects=[self.subject1.title, self.subject2.title],
            is_protected=True,
        )

    # ==========================
    # Create - Invalid Payloads
    # ==========================

    def test_duplicate_lesson_name_returns_400(self):
        self.authenticate_admin()
        payload = self.get_lesson_name_payload(title=self.lesson_name1.title)

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(models.LessonName.objects.count(), 2)
        self.assertIn("title", response.data)

    def test_missing_required_fields_returns_400(self):
        self.authenticate_admin()

        payload = {
            "title": "Quadratic Equations",
        }

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("subjects", response.data)

    def test_invalid_payload_returns_validation_errors(self):
        self.authenticate_admin()

        payload = {
            "title": "",
            "subjects": ["NotARealSubject"],
        }

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("title", response.data)
        self.assertIn("subjects", response.data)

    # =====================
    # Create - Business Rules
    # =====================

    def test_generated_slug_is_set_correctly_after_creation(self):
        self.authenticate_admin()
        payload = self.get_lesson_name_payload(
            title="Biology Basics",
        )

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        lesson_name = models.LessonName.objects.get(title=payload["title"])
        self.assertEqual(lesson_name.slug, "biology-basics")

    def test_create_response_returns_serialized_lesson_name_data(self):
        self.authenticate_admin()
        payload = self.get_lesson_name_payload(
            title="Statistics Foundations",
            is_protected=True,
        )

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["title"], payload["title"])
        self.assertEqual(response.data["slug"], "statistics-foundations")
        self.assertEqual(response.data["subjects"], [self.subject1.title])
        self.assertTrue(response.data["is_protected"])
        self.assertIn("lesson_name_id", response.data)


class LessonNameDetailViewTests(BaseLessonNameTestCase):
    """
    DETAIL VIEW TEST CHECKLIST
    --------------------------
    Retrieve - Permissions
    - Verify ADMIN users can retrieve the object and receive 200 OK
    - Verify UNAUTHORISED users cannot retrieve the object and receive 403 FORBIDDEN
    - Verify UNAUTHENTICATED users cannot retrieve the object and receive 403 FORBIDDEN
    --------------------------
    Retrieve - Object Lookup
    - Verify the correct object is returned when lesson_name_slug and lesson_name_id are valid
    - Verify invalid lesson_name_id returns 404 NOT FOUND
    - Verify invalid lesson_name_slug returns 404 NOT FOUND
    - Verify mismatched lesson_name_slug and lesson_name_id return 404 NOT FOUND
    --------------------------
    Retrieve - Response Structure
    - Verify expected fields are present
    - Verify response structure is correct
    --------------------------
    Retrieve - Response Values
    - Verify returned values match database records
    - Verify returned values are correctly serialised
    --------------------------
    Update - Permissions
    - Verify ADMIN users can update the object and receive 200 OK
    - Verify UNAUTHORISED users cannot update the object and receive 403 FORBIDDEN
    - Verify UNAUTHENTICATED users cannot update the object and receive 403 FORBIDDEN
    --------------------------
    Update - Payloads
    - Verify valid payload updates an unprotected object successfully
    - Verify invalid payload returns 400 BAD REQUEST
    - Verify missing required fields return 400 BAD REQUEST for unprotected objects
    - Verify validation errors are included in the response body
    --------------------------
    Update - Business Rules
    - Verify protected objects keep restricted fields unchanged
    - Verify unprotected objects allow full updates
    --------------------------
    Delete - Permissions
    - Verify ADMIN users can delete an unprotected object and receive 204 NO CONTENT
    - Verify UNAUTHORISED users cannot delete the object and receive 403 FORBIDDEN
    - Verify UNAUTHENTICATED users cannot delete the object and receive 403 FORBIDDEN
    --------------------------
    Delete - Business Rules
    - Verify protected objects cannot be deleted and return 403 FORBIDDEN
    - Verify unprotected objects can be deleted successfully
    """

    # =====================
    # Retrieve - Permissions
    # =====================

    def test_superuser_can_retrieve_lesson_name(self):
        self.authenticate_admin()
        response = self.client.get(self.lesson_name1_detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_authenticated_non_admin_cannot_retrieve_lesson_name(self):
        self.authenticate_user()
        response = self.client.get(self.lesson_name1_detail_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthenticated_user_cannot_retrieve_lesson_name(self):
        response = self.client.get(self.lesson_name1_detail_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # ======================
    # Retrieve - Object Lookup
    # ======================

    def test_retrieve_returns_correct_lesson_name_for_valid_slug_and_id(self):
        self.authenticate_admin()

        response = self.client.get(self.lesson_name1_detail_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], self.lesson_name1.title)
        self.assertEqual(response.data["slug"], self.lesson_name1.slug)

    def test_invalid_lesson_name_id_returns_404(self):
        self.authenticate_admin()

        invalid_url = self.get_lesson_name_detail_url(self.lesson_name1).replace(
            str(self.lesson_name1.lesson_name_id),
            str(uuid.uuid4()),
        )

        response = self.client.get(invalid_url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_invalid_lesson_name_slug_returns_404(self):
        self.authenticate_admin()

        invalid_url = self.get_lesson_name_detail_url(self.lesson_name1).replace(
            self.lesson_name1.slug,
            "not-a-real-lesson-name",
        )

        response = self.client.get(invalid_url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_mismatched_lesson_name_slug_and_lesson_name_id_returns_404(self):
        self.authenticate_admin()

        mismatched_url = self.get_lesson_name_detail_url(self.lesson_name1).replace(
            str(self.lesson_name1.lesson_name_id),
            str(self.lesson_name2.lesson_name_id),
        )

        response = self.client.get(mismatched_url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # ==========================
    # Retrieve - Response Structure
    # ==========================

    def test_retrieve_returns_expected_fields(self):
        self.authenticate_admin()

        response = self.client.get(self.lesson_name1_detail_url)

        self.assertIn("lesson_name_id", response.data)
        self.assertIn("subjects", response.data)
        self.assertIn("title", response.data)
        self.assertIn("slug", response.data)
        self.assertIn("is_protected", response.data)

    def test_retrieve_response_structure_is_correct(self):
        self.authenticate_admin()

        response = self.client.get(self.lesson_name1_detail_url)

        expected_fields = {
            "lesson_name_id",
            "subjects",
            "title",
            "slug",
            "is_protected",
        }

        self.assertEqual(set(response.data.keys()), expected_fields)

    # =======================
    # Retrieve - Response Values
    # =======================

    def test_retrieve_returns_expected_lesson_name_values(self):
        self.authenticate_admin()

        response = self.client.get(self.lesson_name1_detail_url)

        self.assertEqual(response.data["title"], self.lesson_name1.title)
        self.assertEqual(response.data["slug"], self.lesson_name1.slug)
        self.assertEqual(response.data["subjects"], [self.subject1.title])
        self.assertFalse(response.data["is_protected"])

    # ====================
    # Update - Permissions
    # ====================

    def test_superuser_can_update_lesson_name(self):
        self.authenticate_admin()
        payload = self.get_lesson_name_payload(title="Advanced Algebra Introduction")

        response = self.client.put(self.lesson_name1_detail_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_authenticated_non_admin_cannot_update_lesson_name(self):
        self.authenticate_user()
        payload = self.get_lesson_name_payload(title="Advanced Algebra Introduction")

        response = self.client.put(self.lesson_name1_detail_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthenticated_user_cannot_update_lesson_name(self):
        payload = self.get_lesson_name_payload(title="Advanced Algebra Introduction")

        response = self.client.put(self.lesson_name1_detail_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # =================
    # Update - Payloads
    # =================

    def test_valid_payload_updates_unprotected_lesson_name_successfully(self):
        self.authenticate_admin()
        payload = self.get_lesson_name_payload(
            title="Advanced Algebra Introduction",
            subjects=[self.subject1.title, self.subject2.title],
        )

        response = self.client.put(self.lesson_name1_detail_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.lesson_name1.refresh_from_db()
        self.assert_lesson_name_matches(
            self.lesson_name1,
            title="Advanced Algebra Introduction",
            slug=self.lesson_name1.slug,
            subjects=[self.subject1.title, self.subject2.title],
            is_protected=False,
        )

    def test_missing_required_fields_returns_400_for_unprotected_lesson_name(self):
        self.authenticate_admin()

        payload = {
            "title": "Advanced Algebra Introduction",
        }

        response = self.client.put(self.lesson_name1_detail_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("subjects", response.data)

    def test_invalid_payload_returns_validation_errors(self):
        self.authenticate_admin()

        payload = {
            "title": "",
            "subjects": ["NotARealSubject"],
            "is_protected": False,
        }

        response = self.client.put(self.lesson_name1_detail_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("title", response.data)
        self.assertIn("subjects", response.data)

    # =====================
    # Update - Business Rules
    # =====================

    def test_read_only_fields_cannot_be_changed(self):
        self.authenticate_admin()

        original_lesson_name_id = self.lesson_name1.lesson_name_id
        original_slug = self.lesson_name1.slug

        payload = self.get_lesson_name_payload(
            title="Advanced Algebra Introduction",
            lesson_name_id=str(uuid.uuid4()),
            slug="changed-slug",
        )

        response = self.client.put(self.lesson_name1_detail_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.lesson_name1.refresh_from_db()

        self.assertEqual(self.lesson_name1.lesson_name_id, original_lesson_name_id)
        self.assertEqual(self.lesson_name1.slug, original_slug)

    def test_protected_lesson_name_cannot_be_updated(self):
        self.authenticate_admin()

        payload = self.get_lesson_name_payload(
            title="Changed Poetry Lesson",
            subjects=[self.subject1.title],
            is_protected=False,
        )

        response = self.client.put(self.lesson_name2_detail_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        self.lesson_name2.refresh_from_db()
        self.assertTrue(self.lesson_name2.is_protected)

    def test_protected_lesson_name_fields_remain_unchanged_after_failed_update(self):
        self.authenticate_admin()

        original_title = self.lesson_name2.title
        original_slug = self.lesson_name2.slug
        original_subjects = list(
            self.lesson_name2.subjects.values_list("title", flat=True)
        )
        original_is_protected = self.lesson_name2.is_protected

        payload = self.get_lesson_name_payload(
            title="Changed Poetry Lesson",
            subjects=[self.subject1.title],
            is_protected=False,
        )

        response = self.client.put(self.lesson_name2_detail_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        self.lesson_name2.refresh_from_db()

        self.assertEqual(self.lesson_name2.title, original_title)
        self.assertEqual(self.lesson_name2.slug, original_slug)
        self.assertEqual(
            list(self.lesson_name2.subjects.values_list("title", flat=True)),
            original_subjects,
        )
        self.assertEqual(self.lesson_name2.is_protected, original_is_protected)

    # ====================
    # Delete - Permissions
    # ====================

    def test_superuser_can_delete_unprotected_lesson_name(self):
        self.authenticate_admin()

        response = self.client.delete(self.lesson_name1_detail_url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_authenticated_non_admin_cannot_delete_lesson_name(self):
        self.authenticate_user()

        response = self.client.delete(self.lesson_name1_detail_url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(
            models.LessonName.objects.filter(
                lesson_name_id=self.lesson_name1.lesson_name_id
            ).exists()
        )

    def test_unauthenticated_user_cannot_delete_lesson_name(self):
        response = self.client.delete(self.lesson_name1_detail_url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(
            models.LessonName.objects.filter(
                lesson_name_id=self.lesson_name1.lesson_name_id
            ).exists()
        )

    # =====================
    # Delete - Business Rules
    # =====================

    def test_protected_lesson_name_cannot_be_deleted(self):
        self.authenticate_admin()

        response = self.client.delete(self.lesson_name2_detail_url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(
            response.data["detail"],
            "This Lesson Name cannot be deleted. Contact Admin",
        )

    def test_unprotected_lesson_name_is_removed_from_database(self):
        self.authenticate_admin()

        response = self.client.delete(self.lesson_name1_detail_url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(
            models.LessonName.objects.filter(
                lesson_name_id=self.lesson_name1.lesson_name_id
            ).exists()
        )

    def test_failed_delete_does_not_remove_protected_lesson_name(self):
        self.authenticate_admin()

        response = self.client.delete(self.lesson_name2_detail_url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(
            models.LessonName.objects.filter(
                lesson_name_id=self.lesson_name2.lesson_name_id
            ).exists()
        )
