import uuid
from rest_framework import status
from .base import BaseAPITestCase
from .. import models


class BaseResourceTestCase(BaseAPITestCase):
    def setUp(self):
        super().setUp()
        self.list_url = self.get_resource_by_subject_list_url(self.subject1)
        self.resource1_detail_url = self.get_resource_by_subject_detail_url(
            self.subject1,
            self.resource1,
        )
        self.resource2_detail_url = self.get_resource_by_subject_detail_url(
            self.subject2,
            self.resource2,
        )

    def get_resource_payload(self, **overrides):
        payload = {
            "title": "Fractions Worksheet",
            "category": "worksheet",
            "description": "Fractions practice",
            "url": "https://example.com/fractions-sheet",
            "is_protected": False,
        }
        payload.update(overrides)
        return payload


class ResourceBySubjectListCreateViewTests(BaseResourceTestCase):
    """
    LISTCREATE VIEW TEST CHECKLIST
    ------------------
    List - Permissions
    - Verify ADMIN users recieve 200 OKAY
    - Verify UNAUTHORISED users recieve 403 FORBIDDEN
    - Verify UNAUTHENTICATED users recieve 403 FORBIDDEN
    ------------------
    List - Queryset / Returned Objects
    - Verify all expected objects linked to the subject are returned
    - Verify resources linked to other subjects are not returned
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
    List - Filters
    - Verify search returns matching resources by title
    - Verify search returns empty list when no titles match
    - Verify search does not return matching resources from other subjects
    - Verify no search term returns the default subject queryset
    ------------------
    Create - Permissions
    - Verify ADMIN users CAN create object and receive 201 CREATED
    - Verify UNAUTHORISED users CANNOT create object and receive 403 FORBIDDEN
    - Verify UNAUTHENTICATED users CANNOT create object and receive 403 FORBIDDEN
    ------------------
    Create - Payloads
    - Verify valid payload creates object successfully
    - Verify created resource is linked to subject from URL
    - Verify created resource author is set from authenticated user
    - Verify create response returns correctly serialised resource data
    - Verify missing required fields return 400 BAD REQUEST
    ------------------
    Create - Business Rules
    - Verify default/generated fields are set correctly after creation
    """

    # ==================
    # List - Permissions
    # ==================

    def test_superuser_can_access_resource_list(self):
        self.authenticate_admin()

        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_authenticated_non_admin_cannot_access_resource_list(self):
        self.authenticate_user()

        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthenticated_user_cannot_access_resource_list(self):
        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # =================================
    # List - Queryset / Returned Objects
    # =================================

    def test_resource_list_returns_resources_for_matching_subject_only(self):
        self.authenticate_admin()

        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)

        resource = response.data["results"][0]
        self.assertEqual(resource["title"], self.resource1.title)
        self.assertEqual(resource["slug"], self.resource1.slug)

    def test_resource_list_returns_empty_list_when_subject_has_no_resources(self):
        self.authenticate_admin()

        empty_subject = models.Subject.objects.create(
            title="Science",
            level="gcse",
            language="en",
            is_published=True,
            is_protected=False,
        )

        empty_url = self.get_resource_by_subject_list_url(empty_subject)

        response = self.client.get(empty_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["results"], [])

    # ==========================
    # List - Response Structure
    # ==========================

    def test_resource_list_returns_expected_fields(self):
        self.authenticate_admin()

        response = self.client.get(self.list_url)

        expected_fields = {
            "resource_id",
            "title",
            "slug",
            "category",
            "description",
            "file",
            "url",
            "is_protected",
            "subjects",
            "created_at",
            "updated_at",
            "author",
        }

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(set(response.data["results"][0].keys()), expected_fields)

    # =======================
    # List - Response Values
    # =======================

    def test_resource_list_returns_expected_resource_values(self):
        self.authenticate_admin()

        response = self.client.get(self.list_url)

        resource = response.data["results"][0]

        self.assertEqual(resource["title"], self.resource1.title)
        self.assertEqual(resource["slug"], self.resource1.slug)
        self.assertEqual(resource["category"], self.resource1.category)
        self.assertEqual(resource["description"], self.resource1.description)
        self.assertEqual(resource["url"], self.resource1.url)
        self.assertEqual(resource["is_protected"], self.resource1.is_protected)
        self.assertEqual(len(resource["subjects"]), 1)

    # ==============
    # List - Filters
    # ==============

    def test_resource_list_search_returns_matching_resource_by_title(self):
        self.authenticate_admin()

        response = self.client.get(self.list_url, {"search": self.resource1.title})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)
        self.assertEqual(response.data["results"][0]["title"], self.resource1.title)
        self.assertEqual(
            response.data["results"][0]["resource_id"], str(self.resource1.resource_id)
        )

    def test_resource_list_search_returns_empty_list_when_no_titles_match(self):
        self.authenticate_admin()

        response = self.client.get(self.list_url, {"search": "Poetry"})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["results"], [])

    def test_resource_list_search_does_not_return_matching_resource_from_other_subject(
        self,
    ):
        self.authenticate_admin()

        other_subject = models.Subject.objects.create(
            title="Science",
            level="gcse",
            language="en",
            is_published=True,
            is_protected=False,
        )

        other_resource = models.Resource.objects.create(
            title=self.resource1.title,
            category="worksheet",
            description="Science resource with same title",
            url="https://example.com/science-resource",
            is_protected=False,
            author=self.superuser,
        )
        other_resource.subjects.add(other_subject)

        response = self.client.get(self.list_url, {"search": self.resource1.title})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)
        self.assertEqual(
            response.data["results"][0]["resource_id"], str(self.resource1.resource_id)
        )
        self.assertEqual(response.data["results"][0]["title"], self.resource1.title)

    def test_resource_list_without_search_returns_default_subject_queryset(self):
        self.authenticate_admin()

        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)
        self.assertEqual(
            response.data["results"][0]["resource_id"], str(self.resource1.resource_id)
        )

    # =====================
    # Create - Permissions
    # =====================

    def test_authenticated_non_admin_cannot_create_resource(self):
        self.authenticate_user()
        payload = self.get_resource_payload()

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertFalse(
            models.Resource.objects.filter(title=payload["title"]).exists()
        )

    def test_unauthenticated_user_cannot_create_resource(self):
        payload = self.get_resource_payload()

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertFalse(
            models.Resource.objects.filter(title=payload["title"]).exists()
        )

    # =================
    # Create - Payloads
    # =================

    def test_valid_payload_creates_resource_successfully(self):
        self.authenticate_admin()
        payload = self.get_resource_payload()

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        resource = models.Resource.objects.get(title=payload["title"])

        self.assertEqual(resource.title, payload["title"])
        self.assertEqual(resource.slug, "fractions-worksheet")
        self.assertEqual(resource.category, payload["category"])
        self.assertEqual(resource.description, payload["description"])
        self.assertEqual(resource.url, payload["url"])
        self.assertEqual(resource.is_protected, payload["is_protected"])

    def test_created_resource_is_linked_to_subject_from_url(self):
        self.authenticate_admin()
        payload = self.get_resource_payload()

        self.client.post(self.list_url, payload, format="json")

        resource = models.Resource.objects.get(title=payload["title"])

        self.assertEqual(resource.subjects.count(), 1)
        self.assertIn(self.subject1, resource.subjects.all())

    def test_created_resource_author_is_set_from_authenticated_user(self):
        self.authenticate_admin()
        payload = self.get_resource_payload()

        self.client.post(self.list_url, payload, format="json")

        resource = models.Resource.objects.get(title=payload["title"])

        self.assertEqual(resource.author, self.superuser)

    def test_create_response_returns_serialized_resource_data(self):
        self.authenticate_admin()
        payload = self.get_resource_payload(is_protected=True)

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["title"], payload["title"])
        self.assertEqual(response.data["slug"], "fractions-worksheet")
        self.assertEqual(response.data["category"], payload["category"])
        self.assertEqual(response.data["is_protected"], payload["is_protected"])
        self.assertIn("resource_id", response.data)

    def test_missing_required_fields_returns_400(self):
        self.authenticate_admin()

        payload = {
            "description": "Missing title and category",
        }

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("title", response.data)
        self.assertIn("category", response.data)


class ResourceBySubjectDetailViewTests(BaseResourceTestCase):
    """
    DETAIL VIEW TEST CHECKLIST
    --------------------------
    Retrieve - Permissions
    - Verify ADMIN users can retrieve the object and receive 200 OK
    - Verify UNAUTHORISED users cannot retrieve the object and receive 403 FORBIDDEN
    - Verify UNAUTHENTICATED users cannot retrieve the object and receive 403 FORBIDDEN
    --------------------------
    Retrieve - Object Lookup
    - Verify the correct object is returned when resource_slug and resource_id are valid
    - Verify invalid resource_id returns 404 NOT FOUND
    - Verify invalid resource_slug returns 404 NOT FOUND
    - Verify mismatched resource_slug and resource_id return 404 NOT FOUND
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
    - Verify missing required fields return 400 BAD REQUEST for unprotected objects
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

    def test_superuser_can_retrieve_resource(self):
        self.authenticate_admin()

        response = self.client.get(self.resource1_detail_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_authenticated_non_admin_cannot_retrieve_resource(self):
        self.authenticate_user()

        response = self.client.get(self.resource1_detail_url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthenticated_user_cannot_retrieve_resource(self):
        response = self.client.get(self.resource1_detail_url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # ======================
    # Retrieve - Object Lookup
    # ======================

    def test_retrieve_returns_correct_resource_for_valid_slug_and_id(self):
        self.authenticate_admin()

        response = self.client.get(self.resource1_detail_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], self.resource1.title)
        self.assertEqual(response.data["slug"], self.resource1.slug)

    def test_invalid_resource_id_returns_404(self):
        self.authenticate_admin()

        invalid_url = self.get_resource_by_subject_detail_url(
            self.subject1,
            self.resource1,
        ).replace(str(self.resource1.resource_id), str(uuid.uuid4()))

        response = self.client.get(invalid_url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_invalid_resource_slug_returns_404(self):
        self.authenticate_admin()

        invalid_url = self.get_resource_by_subject_detail_url(
            self.subject1,
            self.resource1,
        ).replace(self.resource1.slug, "not-a-real-resource")

        response = self.client.get(invalid_url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_mismatched_resource_slug_and_resource_id_returns_404(self):
        self.authenticate_admin()

        mismatched_url = self.get_resource_by_subject_detail_url(
            self.subject1,
            self.resource1,
        ).replace(str(self.resource1.resource_id), str(self.resource2.resource_id))

        response = self.client.get(mismatched_url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # ==========================
    # Retrieve - Response Structure
    # ==========================

    def test_retrieve_returns_expected_fields(self):
        self.authenticate_admin()

        response = self.client.get(self.resource1_detail_url)

        expected_fields = {
            "resource_id",
            "title",
            "slug",
            "category",
            "description",
            "file",
            "url",
            "is_protected",
            "subjects",
            "created_at",
            "updated_at",
            "author",
        }

        self.assertEqual(set(response.data.keys()), expected_fields)

    # =======================
    # Retrieve - Response Values
    # =======================

    def test_retrieve_returns_expected_resource_values(self):
        self.authenticate_admin()

        response = self.client.get(self.resource1_detail_url)

        self.assertEqual(response.data["title"], self.resource1.title)
        self.assertEqual(response.data["slug"], self.resource1.slug)
        self.assertEqual(response.data["category"], self.resource1.category)
        self.assertEqual(response.data["description"], self.resource1.description)
        self.assertEqual(response.data["url"], self.resource1.url)
        self.assertEqual(response.data["is_protected"], self.resource1.is_protected)

    # ====================
    # Update - Permissions
    # ====================

    def test_authenticated_non_admin_cannot_update_resource(self):
        self.authenticate_user()
        payload = self.get_resource_payload(
            title="Updated Algebra Slides",
            category="slide",
            description="Updated description",
            url="https://example.com/new-algebra-slides",
        )

        response = self.client.put(self.resource1_detail_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthenticated_user_cannot_update_resource(self):
        payload = self.get_resource_payload(
            title="Updated Algebra Slides",
            category="slide",
            description="Updated description",
            url="https://example.com/new-algebra-slides",
        )

        response = self.client.put(self.resource1_detail_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # =================
    # Update - Payloads
    # =================

    def test_valid_payload_updates_unprotected_resource_successfully(self):
        self.authenticate_admin()
        payload = self.get_resource_payload(
            title="Updated Algebra Slides",
            category="slide",
            description="Updated description",
            url="https://example.com/new-algebra-slides",
            is_protected=False,
        )

        response = self.client.put(self.resource1_detail_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.resource1.refresh_from_db()

        self.assertEqual(self.resource1.title, payload["title"])
        self.assertEqual(self.resource1.category, payload["category"])
        self.assertEqual(self.resource1.description, payload["description"])
        self.assertEqual(self.resource1.url, payload["url"])
        self.assertEqual(self.resource1.is_protected, payload["is_protected"])

    def test_missing_required_fields_returns_400_for_unprotected_resource(self):
        self.authenticate_admin()

        payload = {
            "description": "Missing title and category",
        }

        response = self.client.put(self.resource1_detail_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("title", response.data)
        self.assertIn("category", response.data)

    # =====================
    # Update - Business Rules
    # =====================

    def test_read_only_fields_cannot_be_changed(self):
        self.authenticate_admin()

        original_resource_id = self.resource1.resource_id
        original_slug = self.resource1.slug
        original_author = self.resource1.author

        payload = self.get_resource_payload(
            resource_id=uuid.uuid4(),
            slug="changed-slug",
            author=self.user.id,
            title="Updated Algebra Slides",
            category="slide",
            description="Updated description",
            url="https://example.com/new-algebra-slides",
            is_protected=False,
        )

        response = self.client.put(self.resource1_detail_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.resource1.refresh_from_db()

        self.assertEqual(self.resource1.resource_id, original_resource_id)
        self.assertEqual(self.resource1.slug, original_slug)
        self.assertEqual(self.resource1.author, original_author)

    def test_protected_resource_fields_remain_unchanged_after_failed_update(self):
        self.authenticate_admin()

        original_title = self.resource2.title
        original_category = self.resource2.category
        original_description = self.resource2.description
        original_url = self.resource2.url
        original_author = self.resource2.author
        original_is_protected = self.resource2.is_protected

        payload = self.get_resource_payload(
            title="Changed Poetry Video",
            category="video",
            description="Changed description",
            url="https://example.com/changed-video",
            is_protected=False,
        )

        response = self.client.put(self.resource2_detail_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        self.resource2.refresh_from_db()

        self.assertEqual(self.resource2.title, original_title)
        self.assertEqual(self.resource2.category, original_category)
        self.assertEqual(self.resource2.description, original_description)
        self.assertEqual(self.resource2.url, original_url)
        self.assertEqual(self.resource2.author, original_author)
        self.assertEqual(self.resource2.is_protected, original_is_protected)

    # ====================
    # Delete - Permissions
    # ====================

    def test_authenticated_non_admin_cannot_delete_resource(self):
        self.authenticate_user()

        response = self.client.delete(self.resource1_detail_url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(
            models.Resource.objects.filter(
                resource_id=self.resource1.resource_id
            ).exists()
        )

    def test_unauthenticated_user_cannot_delete_resource(self):
        response = self.client.delete(self.resource1_detail_url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(
            models.Resource.objects.filter(
                resource_id=self.resource1.resource_id
            ).exists()
        )

    # =====================
    # Delete - Business Rules
    # =====================

    def test_protected_resource_cannot_be_deleted(self):
        self.authenticate_admin()

        response = self.client.delete(self.resource2_detail_url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(
            response.data["detail"],
            "This Resource cannot be deleted. Contact Admin",
        )

    def test_unprotected_resource_is_removed_from_database(self):
        self.authenticate_admin()

        response = self.client.delete(self.resource1_detail_url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(
            models.Resource.objects.filter(
                resource_id=self.resource1.resource_id
            ).exists()
        )

    def test_failed_delete_does_not_remove_protected_resource(self):
        self.authenticate_admin()

        response = self.client.delete(self.resource2_detail_url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(
            models.Resource.objects.filter(
                resource_id=self.resource2.resource_id
            ).exists()
        )
