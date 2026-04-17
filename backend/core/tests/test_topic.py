import uuid

from rest_framework import status

from .base import BaseAPITestCase
from .. import models


class BaseTopicTestCase(BaseAPITestCase):
    def setUp(self):
        super().setUp()
        self.list_url = self.get_topic_list_url()
        self.topic1_detail_url = self.get_topic_detail_url(self.topic1)
        self.topic2_detail_url = self.get_topic_detail_url(self.topic2)

    def get_topic_payload(self, **overrides):
        payload = {
            "title": "Geometry",
            "subjects": ["Mathematics"],
            "is_protected": False,
        }
        payload.update(overrides)
        return payload


class TopicListCreateViewTests(BaseTopicTestCase):
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
    - Verify create response returns correctly serialised topic data
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

    def test_superuser_can_access_topic_list(self):
        self.authenticate_admin()

        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_authenticated_non_admin_cannot_access_topic_list(self):
        self.authenticate_user()

        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthenticated_user_cannot_access_topic_list(self):
        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # =================================
    # List - Queryset / Returned Objects
    # =================================

    def test_topic_list_returns_all_topics(self):
        self.authenticate_admin()

        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_topic_list_returns_empty_list_when_no_topics_exist(self):
        self.authenticate_admin()
        models.Topic.objects.all().delete()

        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])

    # ==========================
    # List - Response Structure
    # ==========================

    def test_topic_list_returns_expected_fields(self):
        self.authenticate_admin()

        response = self.client.get(self.list_url)

        expected_fields = {
            "topic_id",
            "subjects",
            "title",
            "slug",
            "is_protected",
        }

        self.assertEqual(set(response.data[0].keys()), expected_fields)

    # =======================
    # List - Response Values
    # =======================

    def test_topic_list_returns_expected_topic_values(self):
        self.authenticate_admin()

        response = self.client.get(self.list_url)

        returned_topics = {topic["title"]: topic for topic in response.data}

        algebra = returned_topics["Algebra"]
        poetry = returned_topics["Poetry"]

        self.assertEqual(algebra["slug"], "algebra")
        self.assertEqual(algebra["subjects"], ["Mathematics"])
        self.assertFalse(algebra["is_protected"])

        self.assertEqual(poetry["slug"], "poetry")
        self.assertEqual(poetry["subjects"], ["English"])
        self.assertTrue(poetry["is_protected"])

    # =====================
    # Create - Permissions
    # =====================

    def test_authenticated_non_admin_cannot_create_topic(self):
        self.authenticate_user()
        payload = self.get_topic_payload()

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertFalse(models.Topic.objects.filter(title=payload["title"]).exists())

    def test_unauthenticated_user_cannot_create_topic(self):
        payload = self.get_topic_payload()

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertFalse(models.Topic.objects.filter(title=payload["title"]).exists())

    # ========================
    # Create - Valid Payloads
    # ========================

    def test_valid_payload_creates_topic_successfully(self):
        self.authenticate_admin()
        payload = self.get_topic_payload()

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        topic = models.Topic.objects.get(title=payload["title"])

        self.assertEqual(topic.title, payload["title"])
        self.assertEqual(topic.slug, "geometry")
        self.assertEqual(topic.is_protected, payload["is_protected"])
        self.assertEqual(topic.subjects.count(), 1)
        self.assertIn(self.subject1, topic.subjects.all())

    def test_valid_payload_can_assign_multiple_subjects(self):
        self.authenticate_admin()
        payload = self.get_topic_payload(
            title="Creative Writing",
            subjects=["Mathematics", "English"],
            is_protected=True,
        )

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        topic = models.Topic.objects.get(title="Creative Writing")

        self.assertEqual(topic.subjects.count(), 2)
        self.assertIn(self.subject1, topic.subjects.all())
        self.assertIn(self.subject2, topic.subjects.all())
        self.assertTrue(topic.is_protected)

    def test_create_response_returns_serialized_topic_data(self):
        self.authenticate_admin()
        payload = self.get_topic_payload(
            title="Statistics",
            subjects=["Mathematics"],
            is_protected=True,
        )

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["title"], "Statistics")
        self.assertEqual(response.data["slug"], "statistics")
        self.assertEqual(response.data["subjects"], ["Mathematics"])
        self.assertTrue(response.data["is_protected"])
        self.assertIn("topic_id", response.data)

    # ==========================
    # Create - Invalid Payloads
    # ==========================

    def test_duplicate_topic_returns_400(self):
        self.authenticate_admin()

        payload = self.get_topic_payload(title="Algebra")

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("title", response.data)

    def test_missing_required_fields_returns_400(self):
        self.authenticate_admin()

        payload = {
            "title": "Geometry",
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


class TopicDetailViewTests(BaseTopicTestCase):
    """
    DETAIL VIEW TEST CHECKLIST
    --------------------------
    Retrieve - Permissions
    - Verify ADMIN users can retrieve the object and receive 200 OK
    - Verify UNAUTHORISED users cannot retrieve the object and receive 403 FORBIDDEN
    - Verify UNAUTHENTICATED users cannot retrieve the object and receive 403 FORBIDDEN
    --------------------------
    Retrieve - Object Lookup
    - Verify the correct object is returned when topic_slug and topic_id are valid
    - Verify invalid topic_id returns 404 NOT FOUND
    - Verify invalid topic_slug returns 404 NOT FOUND
    - Verify mismatched topic_slug and topic_id return 404 NOT FOUND
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
    - Verify read-only fields cannot be changed
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
    - Verify deleted objects are removed from the database
    - Verify failed deletions do not remove the object from the database
    """

    # =====================
    # Retrieve - Permissions
    # =====================

    def test_superuser_can_retrieve_topic(self):
        self.authenticate_admin()

        response = self.client.get(self.topic1_detail_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_authenticated_non_admin_cannot_retrieve_topic(self):
        self.authenticate_user()

        response = self.client.get(self.topic1_detail_url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthenticated_user_cannot_retrieve_topic(self):
        response = self.client.get(self.topic1_detail_url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # ======================
    # Retrieve - Object Lookup
    # ======================

    def test_retrieve_returns_correct_topic_for_valid_slug_and_id(self):
        self.authenticate_admin()

        response = self.client.get(self.topic1_detail_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], self.topic1.title)
        self.assertEqual(response.data["slug"], self.topic1.slug)

    def test_invalid_topic_id_returns_404(self):
        self.authenticate_admin()

        invalid_url = self.get_topic_detail_url(self.topic1).replace(
            str(self.topic1.topic_id),
            str(uuid.uuid4()),
        )

        response = self.client.get(invalid_url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_invalid_topic_slug_returns_404(self):
        self.authenticate_admin()

        invalid_url = self.get_topic_detail_url(self.topic1).replace(
            self.topic1.slug,
            "not-a-real-topic",
        )

        response = self.client.get(invalid_url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_mismatched_topic_slug_and_topic_id_returns_404(self):
        self.authenticate_admin()

        mismatched_url = self.get_topic_detail_url(self.topic1).replace(
            str(self.topic1.topic_id),
            str(self.topic2.topic_id),
        )

        response = self.client.get(mismatched_url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # ==========================
    # Retrieve - Response Structure
    # ==========================

    def test_retrieve_returns_expected_fields(self):
        self.authenticate_admin()

        response = self.client.get(self.topic1_detail_url)

        expected_fields = {
            "topic_id",
            "subjects",
            "title",
            "slug",
            "is_protected",
        }

        self.assertEqual(set(response.data.keys()), expected_fields)

    # =======================
    # Retrieve - Response Values
    # =======================

    def test_retrieve_returns_expected_topic_values(self):
        self.authenticate_admin()

        response = self.client.get(self.topic1_detail_url)

        self.assertEqual(response.data["title"], self.topic1.title)
        self.assertEqual(response.data["slug"], self.topic1.slug)
        self.assertEqual(response.data["subjects"], ["Mathematics"])
        self.assertEqual(response.data["is_protected"], self.topic1.is_protected)

    # ====================
    # Update - Permissions
    # ====================

    def test_authenticated_non_admin_cannot_update_topic(self):
        self.authenticate_user()
        payload = self.get_topic_payload(title="Advanced Algebra")

        response = self.client.put(self.topic1_detail_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthenticated_user_cannot_update_topic(self):
        payload = self.get_topic_payload(title="Advanced Algebra")

        response = self.client.put(self.topic1_detail_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # =================
    # Update - Payloads
    # =================

    def test_valid_payload_updates_unprotected_topic_successfully(self):
        self.authenticate_admin()
        payload = self.get_topic_payload(
            title="Advanced Algebra",
            subjects=["Mathematics", "English"],
            is_protected=False,
        )

        response = self.client.put(self.topic1_detail_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.topic1.refresh_from_db()

        self.assertEqual(self.topic1.title, "Advanced Algebra")
        self.assertEqual(self.topic1.subjects.count(), 2)
        self.assertIn(self.subject1, self.topic1.subjects.all())
        self.assertIn(self.subject2, self.topic1.subjects.all())
        self.assertFalse(self.topic1.is_protected)

    def test_missing_required_fields_returns_400_for_unprotected_topic(self):
        self.authenticate_admin()

        payload = {
            "title": "Advanced Algebra",
        }

        response = self.client.put(self.topic1_detail_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("subjects", response.data)

    def test_invalid_payload_returns_validation_errors(self):
        self.authenticate_admin()

        payload = {
            "title": "",
            "subjects": ["NotARealSubject"],
            "is_protected": False,
        }

        response = self.client.put(self.topic1_detail_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("title", response.data)
        self.assertIn("subjects", response.data)

    # =====================
    # Update - Business Rules
    # =====================

    def test_read_only_fields_cannot_be_changed(self):
        self.authenticate_admin()

        original_topic_id = self.topic1.topic_id
        original_slug = self.topic1.slug

        payload = self.get_topic_payload(
            topic_id=uuid.uuid4(),
            slug="changed-slug",
            title="Advanced Algebra",
            subjects=["Mathematics"],
            is_protected=False,
        )

        response = self.client.put(self.topic1_detail_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.topic1.refresh_from_db()

        self.assertEqual(self.topic1.topic_id, original_topic_id)
        self.assertEqual(self.topic1.slug, original_slug)

    def test_protected_topic_fields_remain_unchanged_after_failed_update(self):
        self.authenticate_admin()

        original_title = self.topic2.title
        original_slug = self.topic2.slug
        original_subjects = list(self.topic2.subjects.all())
        original_is_protected = self.topic2.is_protected

        payload = self.get_topic_payload(
            title="Changed Poetry",
            subjects=["Mathematics"],
            is_protected=False,
        )

        response = self.client.put(self.topic2_detail_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        self.topic2.refresh_from_db()

        self.assertEqual(self.topic2.title, original_title)
        self.assertEqual(self.topic2.slug, original_slug)
        self.assertEqual(list(self.topic2.subjects.all()), original_subjects)
        self.assertEqual(self.topic2.is_protected, original_is_protected)

    # ====================
    # Delete - Permissions
    # ====================

    def test_authenticated_non_admin_cannot_delete_topic(self):
        self.authenticate_user()

        response = self.client.delete(self.topic1_detail_url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(
            models.Topic.objects.filter(topic_id=self.topic1.topic_id).exists()
        )

    def test_unauthenticated_user_cannot_delete_topic(self):
        response = self.client.delete(self.topic1_detail_url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(
            models.Topic.objects.filter(topic_id=self.topic1.topic_id).exists()
        )

    # =====================
    # Delete - Business Rules
    # =====================

    def test_protected_topic_cannot_be_deleted(self):
        self.authenticate_admin()

        response = self.client.delete(self.topic2_detail_url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(
            response.data["detail"],
            "This Topic cannot be deleted. Contact Admin",
        )

    def test_unprotected_topic_is_removed_from_database(self):
        self.authenticate_admin()

        response = self.client.delete(self.topic1_detail_url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(
            models.Topic.objects.filter(topic_id=self.topic1.topic_id).exists()
        )

    def test_failed_delete_does_not_remove_protected_topic(self):
        self.authenticate_admin()

        response = self.client.delete(self.topic2_detail_url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(
            models.Topic.objects.filter(topic_id=self.topic2.topic_id).exists()
        )
