import uuid

from django.urls import reverse
from rest_framework import status

from .. import models
from .base import BaseAPITestCase


class BaseLessonVariantTestCase(BaseAPITestCase):
    def setUp(self):
        super().setUp()
        self.list_url = self.get_lesson_list_url(self.subject1)
        self.create_url = self.get_lesson_create_url(self.subject1)
        self.lesson_variant1_detail_url = self.get_lesson_detail_url(
            self.subject1,
            self.lesson_variant1,
        )
        self.lesson_variant2_detail_url = self.get_lesson_detail_url(
            self.subject2,
            self.lesson_variant2,
        )
        self.lesson_variant1_with_resources_detail_url = (
            self.get_lesson_with_resource_detail_url(
                self.subject1,
                self.lesson_variant1,
            )
        )

    def get_lesson_variant_payload(self, **overrides):
        payload = {
            "topic": self.topic1.title,
            "lesson_name": self.lesson_name1.title,
            "teaching_style": self.teaching_style2.title,
            "variation": self.variation2.title,
            "is_published": True,
            "is_protected": False,
        }
        payload.update(overrides)
        return payload


class LessonVariantBySubjectListViewTests(BaseLessonVariantTestCase):
    """
    LIST VIEW TEST CHECKLIST
    ------------------
    List - Permissions
    - Verify public user can access lesson variant list
    - Verify authenticated user can access lesson variant list
    - Verify admin user can access lesson variant list
    ------------------
    List - Object Lookup
    - Verify valid subject slug and ID return 200 OK
    - Verify invalid subject ID returns 404 NOT FOUND
    - Verify invalid subject slug returns 404 NOT FOUND
    - Verify mismatched subject slug and ID returns 404 NOT FOUND
    ------------------
    List - Queryset / Returned Objects
    - Verify all expected lesson variants for the subject are returned
    - Verify lesson variants for other subjects are not returned
    - Verify empty queryset returns 200 OK with an empty list
    ------------------
    List - Response Structure
    - Verify expected fields are present
    - Verify response structure is consistent across returned objects
    ------------------
    List - Response Values
    - Verify returned values match database records
    - Verify returned values are correctly serialised
    - Verify author is returned as username
    - Verify related fields are returned as titles
    """

    # ==================
    # List - Permissions
    # ==================

    def test_public_user_can_access_lesson_variant_list(self):
        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_authenticated_user_can_access_lesson_variant_list(self):
        self.authenticate_user()

        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_admin_user_can_access_lesson_variant_list(self):
        self.authenticate_admin()

        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    # ==================
    # List - Object Lookup
    # ==================

    def test_valid_subject_slug_and_id_return_200(self):
        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_invalid_subject_id_returns_404(self):
        invalid_url = self.get_lesson_list_url(self.subject1).replace(
            str(self.subject1.subject_id),
            str(uuid.uuid4()),
        )

        response = self.client.get(invalid_url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_invalid_subject_slug_returns_404(self):
        invalid_url = self.get_lesson_list_url(self.subject1).replace(
            self.subject1.slug,
            "not-a-real-subject",
        )

        response = self.client.get(invalid_url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_mismatched_subject_slug_and_id_returns_404(self):
        mismatched_url = self.get_lesson_list_url(self.subject1).replace(
            str(self.subject1.subject_id),
            str(self.subject2.subject_id),
        )

        response = self.client.get(mismatched_url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # =================================
    # List - Queryset / Returned Objects
    # =================================

    def test_lesson_variant_list_returns_all_variants_for_subject(self):
        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["lesson_name"], self.lesson_name1.title)

    def test_lesson_variant_list_returns_empty_list_when_subject_has_no_variants(self):
        empty_subject = models.Subject.objects.create(
            title="Science",
            level="gcse",
            language="en",
            is_published=True,
            is_protected=False,
        )

        empty_url = self.get_lesson_list_url(empty_subject)

        response = self.client.get(empty_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])

    # ==========================
    # List - Response Structure
    # ==========================

    def test_lesson_variant_list_returns_expected_fields(self):
        response = self.client.get(self.list_url)

        expected_fields = {
            "lesson_variant_id",
            "subject",
            "topic",
            "lesson_name",
            "teaching_style",
            "variation",
            "slug",
            "is_published",
            "is_protected",
            "created_at",
            "updated_at",
            "author",
        }

        self.assertEqual(set(response.data[0].keys()), expected_fields)

    # =======================
    # List - Response Values
    # =======================

    def test_lesson_variant_list_returns_expected_values(self):
        response = self.client.get(self.list_url)

        lesson_variant = response.data[0]

        self.assertEqual(lesson_variant["subject"], self.subject1.title)
        self.assertEqual(lesson_variant["topic"], self.topic1.title)
        self.assertEqual(lesson_variant["lesson_name"], self.lesson_name1.title)
        self.assertEqual(lesson_variant["teaching_style"], self.teaching_style1.title)
        self.assertEqual(lesson_variant["variation"], self.variation1.title)
        self.assertEqual(lesson_variant["slug"], self.lesson_variant1.slug)
        self.assertTrue(lesson_variant["is_published"])
        self.assertFalse(lesson_variant["is_protected"])
        self.assertEqual(lesson_variant["author"], self.superuser.username)

    def test_lesson_variant_list_returns_related_fields_as_titles(self):
        response = self.client.get(self.list_url)

        lesson_variant = response.data[0]

        self.assertIsInstance(lesson_variant["subject"], str)
        self.assertIsInstance(lesson_variant["topic"], str)
        self.assertIsInstance(lesson_variant["lesson_name"], str)
        self.assertIsInstance(lesson_variant["teaching_style"], str)
        self.assertIsInstance(lesson_variant["variation"], str)
        self.assertIsInstance(lesson_variant["author"], str)


class LessonVariantCreateViewTests(BaseLessonVariantTestCase):
    """
    CREATE VIEW TEST CHECKLIST
    ------------------
    Create - Permissions
    - Verify ADMIN users CAN create object and receive 201 CREATED
    - Verify UNAUTHORISED users CANNOT create object and receive 403 FORBIDDEN
    - Verify UNAUTHENTICATED users CANNOT create object and receive 403 FORBIDDEN
    ------------------
    Create - Subject Lookup
    - Verify valid subject slug and ID allow creation
    - Verify invalid subject ID returns 404 NOT FOUND
    - Verify invalid subject slug returns 404 NOT FOUND
    - Verify mismatched subject slug and ID return 404 NOT FOUND
    ------------------
    Create - Payloads
    - Verify valid payload creates lesson variant successfully
    - Verify topic must belong to subject from URL
    - Verify lesson_name must belong to subject from URL
    - Verify missing required fields return 400 BAD REQUEST
    - Verify validation errors are included in the response body
    ------------------
    Create - Business Rules
    - Verify subject is set from URL
    - Verify author is set from authenticated user
    - Verify slug is generated correctly after creation
    - Verify duplicate lesson variant combination is blocked
    ------------------
    Create - Response Structure
    - Verify expected fields are present in create response
    ------------------
    Create - Response Values
    - Verify returned values match created database record
    """

    # =====================
    # Create - Permissions
    # =====================

    def test_superuser_can_create_lesson_variant(self):
        self.authenticate_admin()
        payload = self.get_lesson_variant_payload()

        response = self.client.post(self.create_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(models.LessonVariant.objects.count(), 3)

    def test_authenticated_non_admin_cannot_create_lesson_variant(self):
        self.authenticate_user()
        payload = self.get_lesson_variant_payload()

        response = self.client.post(self.create_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(models.LessonVariant.objects.count(), 2)

    def test_unauthenticated_user_cannot_create_lesson_variant(self):
        payload = self.get_lesson_variant_payload()

        response = self.client.post(self.create_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(models.LessonVariant.objects.count(), 2)

    # ======================
    # Create - Subject Lookup
    # ======================

    def test_valid_subject_slug_and_id_allow_creation(self):
        self.authenticate_admin()
        payload = self.get_lesson_variant_payload()

        response = self.client.post(self.create_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_invalid_subject_id_returns_404(self):
        self.authenticate_admin()

        invalid_url = self.get_lesson_create_url(self.subject1).replace(
            str(self.subject1.subject_id),
            str(uuid.uuid4()),
        )

        payload = self.get_lesson_variant_payload()

        response = self.client.post(invalid_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(models.LessonVariant.objects.count(), 2)

    def test_invalid_subject_slug_returns_404(self):
        self.authenticate_admin()

        invalid_url = self.get_lesson_create_url(self.subject1).replace(
            self.subject1.slug,
            "not-a-real-subject",
        )

        payload = self.get_lesson_variant_payload()

        response = self.client.post(invalid_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(models.LessonVariant.objects.count(), 2)

    def test_mismatched_subject_slug_and_id_returns_404(self):
        self.authenticate_admin()

        mismatched_url = self.get_lesson_create_url(self.subject1).replace(
            str(self.subject1.subject_id),
            str(self.subject2.subject_id),
        )

        payload = self.get_lesson_variant_payload()

        response = self.client.post(mismatched_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(models.LessonVariant.objects.count(), 2)

    # =================
    # Create - Payloads
    # =================

    def test_valid_payload_creates_lesson_variant_successfully(self):
        self.authenticate_admin()
        payload = self.get_lesson_variant_payload()

        response = self.client.post(self.create_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        lesson_variant = models.LessonVariant.objects.get(
            subject=self.subject1,
            topic=self.topic1,
            lesson_name=self.lesson_name1,
            teaching_style=self.teaching_style2,
            variation=self.variation2,
        )

        self.assertEqual(lesson_variant.subject, self.subject1)
        self.assertEqual(lesson_variant.topic, self.topic1)
        self.assertEqual(lesson_variant.lesson_name, self.lesson_name1)
        self.assertEqual(lesson_variant.teaching_style, self.teaching_style2)
        self.assertEqual(lesson_variant.variation, self.variation2)
        self.assertTrue(lesson_variant.is_published)
        self.assertFalse(lesson_variant.is_protected)

    def test_topic_must_belong_to_subject_from_url(self):
        self.authenticate_admin()

        payload = self.get_lesson_variant_payload(topic=self.topic2.title)

        response = self.client.post(self.create_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("topic", response.data)
        self.assertEqual(models.LessonVariant.objects.count(), 2)

    def test_lesson_name_must_belong_to_subject_from_url(self):
        self.authenticate_admin()

        payload = self.get_lesson_variant_payload(lesson_name=self.lesson_name2.title)

        response = self.client.post(self.create_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("lesson_name", response.data)
        self.assertEqual(models.LessonVariant.objects.count(), 2)

    def test_missing_required_fields_returns_400(self):
        self.authenticate_admin()

        payload = {
            "is_published": True,
        }

        response = self.client.post(self.create_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("topic", response.data)
        self.assertIn("lesson_name", response.data)
        self.assertIn("teaching_style", response.data)
        self.assertIn("variation", response.data)
        self.assertEqual(models.LessonVariant.objects.count(), 2)

    def test_invalid_payload_returns_validation_errors(self):
        self.authenticate_admin()

        payload = {
            "topic": "Not A Real Topic",
            "lesson_name": "Not A Real Lesson",
            "teaching_style": "Not A Real Teaching Style",
            "variation": "Not A Real Variation",
            "is_published": True,
            "is_protected": False,
        }

        response = self.client.post(self.create_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("topic", response.data)
        self.assertIn("lesson_name", response.data)
        self.assertIn("teaching_style", response.data)
        self.assertIn("variation", response.data)
        self.assertEqual(models.LessonVariant.objects.count(), 2)

    # =====================
    # Create - Business Rules
    # =====================

    def test_subject_is_set_from_url(self):
        self.authenticate_admin()

        payload = self.get_lesson_variant_payload(is_published=False)

        self.client.post(self.create_url, payload, format="json")

        lesson_variant = models.LessonVariant.objects.get(
            subject=self.subject1,
            topic=self.topic1,
            lesson_name=self.lesson_name1,
            teaching_style=self.teaching_style2,
            variation=self.variation2,
        )

        self.assertEqual(lesson_variant.subject, self.subject1)

    def test_author_is_set_from_authenticated_user(self):
        self.authenticate_admin()

        payload = self.get_lesson_variant_payload(is_published=False)

        self.client.post(self.create_url, payload, format="json")

        lesson_variant = models.LessonVariant.objects.get(
            subject=self.subject1,
            topic=self.topic1,
            lesson_name=self.lesson_name1,
            teaching_style=self.teaching_style2,
            variation=self.variation2,
        )

        self.assertEqual(lesson_variant.author, self.superuser)

    def test_slug_is_generated_correctly_after_creation(self):
        self.authenticate_admin()

        payload = self.get_lesson_variant_payload(is_published=False)

        self.client.post(self.create_url, payload, format="json")

        lesson_variant = models.LessonVariant.objects.get(
            subject=self.subject1,
            topic=self.topic1,
            lesson_name=self.lesson_name1,
            teaching_style=self.teaching_style2,
            variation=self.variation2,
        )

        self.assertEqual(
            lesson_variant.slug,
            "linear-equations-discussion-higher",
        )

    def test_duplicate_lesson_variant_combination_is_blocked(self):
        self.authenticate_admin()

        payload = self.get_lesson_variant_payload(
            teaching_style=self.teaching_style1.title,
            variation=self.variation1.title,
        )

        response = self.client.post(self.create_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("non_field_errors", response.data)
        self.assertEqual(models.LessonVariant.objects.count(), 2)

    # ==========================
    # Create - Response Structure
    # ==========================

    def test_create_response_returns_expected_fields(self):
        self.authenticate_admin()

        payload = self.get_lesson_variant_payload()

        response = self.client.post(self.create_url, payload, format="json")

        expected_fields = {
            "topic",
            "lesson_name",
            "teaching_style",
            "variation",
            "is_published",
            "is_protected",
        }

        self.assertEqual(set(response.data.keys()), expected_fields)

    # =======================
    # Create - Response Values
    # =======================

    def test_create_response_returns_expected_values(self):
        self.authenticate_admin()

        payload = self.get_lesson_variant_payload()

        response = self.client.post(self.create_url, payload, format="json")

        self.assertEqual(response.data["topic"], self.topic1.title)
        self.assertEqual(response.data["lesson_name"], self.lesson_name1.title)
        self.assertEqual(response.data["teaching_style"], self.teaching_style2.title)
        self.assertEqual(response.data["variation"], self.variation2.title)
        self.assertTrue(response.data["is_published"])
        self.assertFalse(response.data["is_protected"])


class LessonVariantDetailViewTests(BaseLessonVariantTestCase):
    """
    DETAIL VIEW TEST CHECKLIST
    --------------------------
    Retrieve - Permissions
    - Verify PUBLIC users can retrieve the object and receive 200 OK
    - Verify AUTHENTICATED users can retrieve the object and receive 200 OK
    - Verify ADMIN users can retrieve the object and receive 200 OK
    --------------------------
    Retrieve - Object Lookup
    - Verify the correct object is returned when subject slug, subject ID, lesson variant slug, and lesson variant ID are valid
    - Verify invalid subject ID returns 404 NOT FOUND
    - Verify invalid subject slug returns 404 NOT FOUND
    - Verify mismatched subject slug and ID return 404 NOT FOUND
    - Verify invalid lesson variant ID returns 404 NOT FOUND
    - Verify invalid lesson variant slug returns 404 NOT FOUND
    - Verify mismatched lesson variant slug and ID return 404 NOT FOUND
    - Verify lesson variant from another subject cannot be retrieved through the wrong subject URL
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
    - Verify missing required fields return 400 BAD REQUEST
    --------------------------
    Update - Business Rules
    - Verify protected lesson variants cannot be updated
    - Verify failed protected update leaves the object unchanged
    --------------------------
    Delete - Permissions
    - Verify ADMIN users can delete an unprotected object and receive 204 NO CONTENT
    - Verify UNAUTHORISED users cannot delete the object and receive 403 FORBIDDEN
    - Verify UNAUTHENTICATED users cannot delete the object and receive 403 FORBIDDEN
    --------------------------
    Delete - Business Rules
    - Verify protected lesson variants cannot be deleted and return 403 FORBIDDEN
    - Verify unprotected lesson variants can be deleted successfully
    - Verify deleted objects are removed from the database
    - Verify failed deletions do not remove the object from the database
    """

    # =====================
    # Retrieve - Permissions
    # =====================

    def test_public_user_can_retrieve_lesson_variant(self):
        response = self.client.get(self.lesson_variant1_detail_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_authenticated_user_can_retrieve_lesson_variant(self):
        self.authenticate_user()

        response = self.client.get(self.lesson_variant1_detail_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_admin_user_can_retrieve_lesson_variant(self):
        self.authenticate_admin()

        response = self.client.get(self.lesson_variant1_detail_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    # ======================
    # Retrieve - Object Lookup
    # ======================

    def test_retrieve_returns_correct_lesson_variant_for_valid_lookups(self):
        response = self.client.get(self.lesson_variant1_detail_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["lesson_name"], self.lesson_name1.title)
        self.assertEqual(response.data["topic"], self.topic1.title)
        self.assertEqual(response.data["teaching_style"], self.teaching_style1.title)
        self.assertEqual(response.data["variation"], self.variation1.title)

    def test_invalid_subject_id_returns_404(self):
        invalid_url = reverse(
            "lesson-detail",
            kwargs={
                "subject_slug": self.subject1.slug,
                "subject_id": uuid.uuid4(),
                "lesson_variant_slug": self.lesson_variant1.slug,
                "lesson_variant_id": self.lesson_variant1.lesson_variant_id,
            },
        )

        response = self.client.get(invalid_url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_invalid_subject_slug_returns_404(self):
        invalid_url = reverse(
            "lesson-detail",
            kwargs={
                "subject_slug": "not-a-real-subject",
                "subject_id": self.subject1.subject_id,
                "lesson_variant_slug": self.lesson_variant1.slug,
                "lesson_variant_id": self.lesson_variant1.lesson_variant_id,
            },
        )

        response = self.client.get(invalid_url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_mismatched_subject_slug_and_id_returns_404(self):
        invalid_url = reverse(
            "lesson-detail",
            kwargs={
                "subject_slug": self.subject1.slug,
                "subject_id": self.subject2.subject_id,
                "lesson_variant_slug": self.lesson_variant1.slug,
                "lesson_variant_id": self.lesson_variant1.lesson_variant_id,
            },
        )

        response = self.client.get(invalid_url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_invalid_lesson_variant_id_returns_404(self):
        invalid_url = reverse(
            "lesson-detail",
            kwargs={
                "subject_slug": self.subject1.slug,
                "subject_id": self.subject1.subject_id,
                "lesson_variant_slug": self.lesson_variant1.slug,
                "lesson_variant_id": uuid.uuid4(),
            },
        )

        response = self.client.get(invalid_url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_invalid_lesson_variant_slug_returns_404(self):
        invalid_url = reverse(
            "lesson-detail",
            kwargs={
                "subject_slug": self.subject1.slug,
                "subject_id": self.subject1.subject_id,
                "lesson_variant_slug": "not-a-real-lesson-variant",
                "lesson_variant_id": self.lesson_variant1.lesson_variant_id,
            },
        )

        response = self.client.get(invalid_url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_mismatched_lesson_variant_slug_and_id_returns_404(self):
        invalid_url = reverse(
            "lesson-detail",
            kwargs={
                "subject_slug": self.subject1.slug,
                "subject_id": self.subject1.subject_id,
                "lesson_variant_slug": self.lesson_variant1.slug,
                "lesson_variant_id": self.lesson_variant2.lesson_variant_id,
            },
        )

        response = self.client.get(invalid_url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_lesson_variant_from_another_subject_cannot_be_retrieved_through_wrong_subject_url(
        self,
    ):
        invalid_url = reverse(
            "lesson-detail",
            kwargs={
                "subject_slug": self.subject1.slug,
                "subject_id": self.subject1.subject_id,
                "lesson_variant_slug": self.lesson_variant2.slug,
                "lesson_variant_id": self.lesson_variant2.lesson_variant_id,
            },
        )

        response = self.client.get(invalid_url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # ==========================
    # Retrieve - Response Structure
    # ==========================

    def test_retrieve_returns_expected_fields(self):
        response = self.client.get(self.lesson_variant1_detail_url)

        expected_fields = {
            "lesson_variant_id",
            "subject",
            "topic",
            "lesson_name",
            "teaching_style",
            "variation",
            "slug",
            "is_published",
            "is_protected",
            "created_at",
            "updated_at",
            "author",
        }

        self.assertEqual(set(response.data.keys()), expected_fields)

    # =======================
    # Retrieve - Response Values
    # =======================

    def test_retrieve_returns_expected_values(self):
        response = self.client.get(self.lesson_variant1_detail_url)

        self.assertEqual(response.data["subject"], self.subject1.title)
        self.assertEqual(response.data["topic"], self.topic1.title)
        self.assertEqual(response.data["lesson_name"], self.lesson_name1.title)
        self.assertEqual(response.data["teaching_style"], self.teaching_style1.title)
        self.assertEqual(response.data["variation"], self.variation1.title)
        self.assertEqual(response.data["slug"], self.lesson_variant1.slug)
        self.assertTrue(response.data["is_published"])
        self.assertFalse(response.data["is_protected"])
        self.assertEqual(response.data["author"], self.superuser.username)

    # ====================
    # Update - Permissions
    # ====================

    def test_admin_user_can_update_unprotected_lesson_variant(self):
        self.authenticate_admin()

        payload = self.get_lesson_variant_payload(
            topic="Algebra",
            lesson_name="Linear Equations",
            teaching_style="Discussion",
            variation="Higher",
            is_published=False,
            is_protected=False,
        )

        response = self.client.put(
            self.lesson_variant1_detail_url,
            payload,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_authenticated_non_admin_cannot_update_lesson_variant(self):
        self.authenticate_user()

        payload = self.get_lesson_variant_payload(
            is_published=False,
        )

        response = self.client.put(
            self.lesson_variant1_detail_url,
            payload,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthenticated_user_cannot_update_lesson_variant(self):
        payload = self.get_lesson_variant_payload(
            is_published=False,
        )

        response = self.client.put(
            self.lesson_variant1_detail_url,
            payload,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # =================
    # Update - Payloads
    # =================

    def test_valid_payload_updates_unprotected_lesson_variant_successfully(self):
        self.authenticate_admin()

        payload = self.get_lesson_variant_payload(
            topic="Algebra",
            lesson_name="Linear Equations",
            teaching_style="Discussion",
            variation="Higher",
            is_published=False,
            is_protected=False,
        )

        response = self.client.put(
            self.lesson_variant1_detail_url,
            payload,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.lesson_variant1.refresh_from_db()

        self.assertEqual(self.lesson_variant1.topic, self.topic1)
        self.assertEqual(self.lesson_variant1.lesson_name, self.lesson_name1)
        self.assertEqual(self.lesson_variant1.teaching_style, self.teaching_style2)
        self.assertEqual(self.lesson_variant1.variation, self.variation2)
        self.assertFalse(self.lesson_variant1.is_published)
        self.assertFalse(self.lesson_variant1.is_protected)

    def test_invalid_payload_returns_400(self):
        self.authenticate_admin()

        payload = {
            "topic": "Not A Real Topic",
            "lesson_name": "Not A Real Lesson",
            "teaching_style": "Not A Real Teaching Style",
            "variation": "Not A Real Variation",
            "is_published": True,
            "is_protected": False,
        }

        response = self.client.put(
            self.lesson_variant1_detail_url,
            payload,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("topic", response.data)
        self.assertIn("lesson_name", response.data)
        self.assertIn("teaching_style", response.data)
        self.assertIn("variation", response.data)

    # =====================
    # Update - Business Rules
    # =====================

    def test_protected_lesson_variant_cannot_be_updated(self):
        self.authenticate_admin()

        payload = {
            "topic": "Poetry",
            "lesson_name": "Poetry Analysis",
            "teaching_style": "Lecture",
            "variation": "Foundation",
            "is_published": True,
            "is_protected": False,
        }

        response = self.client.put(
            self.lesson_variant2_detail_url,
            payload,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(
            response.data["detail"],
            "This Lesson Variant is protected and cannot be updated. Contact Admin",
        )

    def test_failed_protected_update_leaves_lesson_variant_unchanged(self):
        self.authenticate_admin()

        original_topic = self.lesson_variant2.topic
        original_lesson_name = self.lesson_variant2.lesson_name
        original_teaching_style = self.lesson_variant2.teaching_style
        original_variation = self.lesson_variant2.variation
        original_is_published = self.lesson_variant2.is_published
        original_is_protected = self.lesson_variant2.is_protected
        original_slug = self.lesson_variant2.slug

        payload = {
            "topic": "Poetry",
            "lesson_name": "Poetry Analysis",
            "teaching_style": "Lecture",
            "variation": "Foundation",
            "is_published": True,
            "is_protected": False,
        }

        response = self.client.put(
            self.lesson_variant2_detail_url,
            payload,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        self.lesson_variant2.refresh_from_db()

        self.assertEqual(self.lesson_variant2.topic, original_topic)
        self.assertEqual(self.lesson_variant2.lesson_name, original_lesson_name)
        self.assertEqual(self.lesson_variant2.teaching_style, original_teaching_style)
        self.assertEqual(self.lesson_variant2.variation, original_variation)
        self.assertEqual(self.lesson_variant2.is_published, original_is_published)
        self.assertEqual(self.lesson_variant2.is_protected, original_is_protected)
        self.assertEqual(self.lesson_variant2.slug, original_slug)

    # ====================
    # Delete - Permissions
    # ====================

    def test_authenticated_non_admin_cannot_delete_lesson_variant(self):
        self.authenticate_user()

        response = self.client.delete(self.lesson_variant1_detail_url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(
            models.LessonVariant.objects.filter(
                lesson_variant_id=self.lesson_variant1.lesson_variant_id
            ).exists()
        )

    def test_unauthenticated_user_cannot_delete_lesson_variant(self):
        response = self.client.delete(self.lesson_variant1_detail_url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(
            models.LessonVariant.objects.filter(
                lesson_variant_id=self.lesson_variant1.lesson_variant_id
            ).exists()
        )

    # =====================
    # Delete - Business Rules
    # =====================

    def test_protected_lesson_variant_cannot_be_deleted(self):
        self.authenticate_admin()

        response = self.client.delete(self.lesson_variant2_detail_url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(
            response.data["detail"],
            "This Lesson Variant cannot be deleted. Contact Admin",
        )

    def test_unprotected_lesson_variant_is_removed_from_database(self):
        self.authenticate_admin()

        response = self.client.delete(self.lesson_variant1_detail_url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(
            models.LessonVariant.objects.filter(
                lesson_variant_id=self.lesson_variant1.lesson_variant_id
            ).exists()
        )

    def test_failed_delete_does_not_remove_protected_lesson_variant(self):
        self.authenticate_admin()

        response = self.client.delete(self.lesson_variant2_detail_url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(
            models.LessonVariant.objects.filter(
                lesson_variant_id=self.lesson_variant2.lesson_variant_id
            ).exists()
        )


class LessonVariantWithNestedResourcesDetailViewTests(BaseLessonVariantTestCase):
    """
    DETAIL WITH NESTED RESOURCES TEST CHECKLIST
    -------------------------------------------
    Retrieve - Permissions
    - Verify public user can retrieve lesson variant with nested resources
    - Verify authenticated user can retrieve lesson variant with nested resources
    --------------------------
    Retrieve - Object Lookup
    - Verify valid subject and lesson variant lookup returns 200 OK
    - Verify invalid lesson variant ID returns 404 NOT FOUND
    - Verify invalid subject ID returns 404 NOT FOUND
    - Verify mismatched subject and lesson variant returns 404 NOT FOUND
    --------------------------
    Retrieve - Response Structure
    - Verify expected fields are present
    - Verify response does not contain unintended fields
    - Verify nested resources are returned as a list
    --------------------------
    Retrieve - Response Values
    - Verify returned lesson variant values match database records
    - Verify returned values are correctly serialised
    - Verify nested resources are returned in the correct order
    - Verify empty nested resources list is returned when no resources exist
    """

    def setUp(self):
        super().setUp()
        self.detail_url = self.lesson_variant1_with_resources_detail_url

    # =====================
    # Retrieve - Permissions
    # =====================

    def test_public_user_can_retrieve_lesson_variant_with_nested_resources(self):
        response = self.client.get(self.detail_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_authenticated_user_can_retrieve_lesson_variant_with_nested_resources(self):
        self.authenticate_user()

        response = self.client.get(self.detail_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    # ======================
    # Retrieve - Object Lookup
    # ======================

    def test_valid_subject_and_lesson_variant_lookup_returns_200(self):
        response = self.client.get(self.detail_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_invalid_lesson_variant_id_returns_404(self):
        invalid_url = reverse(
            "lesson-with-resource-detail",
            kwargs={
                "subject_slug": self.subject1.slug,
                "subject_id": self.subject1.subject_id,
                "lesson_variant_slug": self.lesson_variant1.slug,
                "lesson_variant_id": uuid.uuid4(),
            },
        )

        response = self.client.get(invalid_url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_invalid_subject_id_returns_404(self):
        invalid_url = reverse(
            "lesson-with-resource-detail",
            kwargs={
                "subject_slug": self.subject1.slug,
                "subject_id": uuid.uuid4(),
                "lesson_variant_slug": self.lesson_variant1.slug,
                "lesson_variant_id": self.lesson_variant1.lesson_variant_id,
            },
        )

        response = self.client.get(invalid_url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_mismatched_subject_and_lesson_variant_returns_404(self):
        invalid_url = reverse(
            "lesson-with-resource-detail",
            kwargs={
                "subject_slug": self.subject2.slug,
                "subject_id": self.subject2.subject_id,
                "lesson_variant_slug": self.lesson_variant1.slug,
                "lesson_variant_id": self.lesson_variant1.lesson_variant_id,
            },
        )

        response = self.client.get(invalid_url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # ==========================
    # Retrieve - Response Structure
    # ==========================

    def test_response_contains_expected_fields(self):
        response = self.client.get(self.detail_url)

        expected_fields = {
            "lesson_variant_id",
            "subject",
            "topic",
            "lesson_name",
            "teaching_style",
            "variation",
            "slug",
            "resources",
            "is_published",
            "created_at",
            "updated_at",
            "author",
        }

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(set(response.data.keys()), expected_fields)

    def test_response_does_not_contain_unintended_fields(self):
        response = self.client.get(self.detail_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertNotIn("is_protected", response.data)

    def test_response_structure_is_correct_for_nested_resources(self):
        response = self.client.get(self.detail_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data["resources"], list)
        self.assertEqual(len(response.data["resources"]), 1)

    # =======================
    # Retrieve - Response Values
    # =======================

    def test_response_values_match_database_records(self):
        response = self.client.get(self.detail_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data["lesson_variant_id"],
            str(self.lesson_variant1.lesson_variant_id),
        )
        self.assertEqual(response.data["subject"], self.lesson_variant1.subject.title)
        self.assertEqual(response.data["topic"], self.lesson_variant1.topic.title)
        self.assertEqual(
            response.data["lesson_name"],
            self.lesson_variant1.lesson_name.title,
        )
        self.assertEqual(
            response.data["teaching_style"],
            self.lesson_variant1.teaching_style.title,
        )
        self.assertEqual(
            response.data["variation"],
            self.lesson_variant1.variation.title,
        )
        self.assertEqual(response.data["slug"], self.lesson_variant1.slug)
        self.assertEqual(
            response.data["is_published"],
            self.lesson_variant1.is_published,
        )
        self.assertEqual(response.data["author"], self.lesson_variant1.author.username)

    def test_response_values_are_correctly_serialised(self):
        response = self.client.get(self.detail_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data["lesson_variant_id"], str)
        self.assertIsInstance(response.data["subject"], str)
        self.assertIsInstance(response.data["topic"], str)
        self.assertIsInstance(response.data["lesson_name"], str)
        self.assertIsInstance(response.data["teaching_style"], str)
        self.assertIsInstance(response.data["variation"], str)
        self.assertIsInstance(response.data["slug"], str)
        self.assertIsInstance(response.data["is_published"], bool)
        self.assertIsInstance(response.data["author"], str)

    def test_nested_resources_are_returned_in_correct_order(self):
        extra_resource = models.Resource.objects.create(
            title="Second Algebra Resource",
            category="worksheet",
            description="Extra practice",
            url="https://example.com/extra-resource",
            is_protected=False,
            author=self.superuser,
        )
        extra_resource.subjects.set([self.subject1])

        models.LessonVariantResource.objects.create(
            lesson_variant=self.lesson_variant1,
            resource=extra_resource,
            order=2,
        )

        response = self.client.get(self.detail_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["resources"][0]["order"], 1)
        self.assertEqual(response.data["resources"][1]["order"], 2)

    def test_returns_empty_resources_list_when_no_resources_exist(self):
        lesson_variant_without_resources = models.LessonVariant.objects.create(
            subject=self.subject1,
            topic=self.topic1,
            lesson_name=models.LessonName.objects.create(
                title="Simultaneous Equations",
                is_protected=False,
            ),
            teaching_style=self.teaching_style1,
            variation=models.Variation.objects.create(
                title="Core",
                is_protected=False,
            ),
            is_published=True,
            is_protected=False,
            author=self.superuser,
        )

        lesson_variant_without_resources.lesson_name.subjects.set([self.subject1])

        empty_resources_url = reverse(
            "lesson-with-resource-detail",
            kwargs={
                "subject_slug": self.subject1.slug,
                "subject_id": self.subject1.subject_id,
                "lesson_variant_slug": lesson_variant_without_resources.slug,
                "lesson_variant_id": lesson_variant_without_resources.lesson_variant_id,
            },
        )

        response = self.client.get(empty_resources_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["resources"], [])
