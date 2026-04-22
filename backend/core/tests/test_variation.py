import uuid

from rest_framework import status

from .base import BaseAPITestCase
from .. import models


class BaseVariationTestCase(BaseAPITestCase):
    def setUp(self):
        super().setUp()
        self.list_url = self.get_variation_list_url()
        self.variation1_detail_url = self.get_variation_detail_url(self.variation1)
        self.variation2_detail_url = self.get_variation_detail_url(self.variation2)

    def get_variation_payload(self, **overrides):
        payload = {
            "title": "Core",
            "is_protected": False,
        }
        payload.update(overrides)
        return payload


class VariationListCreateViewTests(BaseVariationTestCase):
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
    - Verify create response returns correctly serialised variation data
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

    def test_superuser_can_access_variation_list(self):
        self.authenticate_admin()

        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_authenticated_non_admin_cannot_access_variation_list(self):
        self.authenticate_user()

        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthenticated_user_cannot_access_variation_list(self):
        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # =================================
    # List - Queryset / Returned Objects
    # =================================

    def test_variation_list_returns_all_variations(self):
        self.authenticate_admin()

        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 2)

    def test_variation_list_returns_empty_list_when_no_variations_exist(self):
        self.authenticate_admin()
        models.Variation.objects.all().delete()

        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["results"], [])

    # ==========================
    # List - Response Structure
    # ==========================

    def test_variation_list_returns_expected_fields(self):
        self.authenticate_admin()

        response = self.client.get(self.list_url)

        expected_fields = {
            "variation_id",
            "title",
            "slug",
            "is_protected",
        }

        self.assertEqual(set(response.data["results"][0].keys()), expected_fields)

    # =======================
    # List - Response Values
    # =======================

    def test_variation_list_returns_expected_variation_values(self):
        self.authenticate_admin()

        response = self.client.get(self.list_url)

        returned_variations = {
            variation["title"]: variation for variation in response.data["results"]
        }

        foundation = returned_variations["Foundation"]
        higher = returned_variations["Higher"]

        self.assertEqual(foundation["slug"], "foundation")
        self.assertFalse(foundation["is_protected"])

        self.assertEqual(higher["slug"], "higher")
        self.assertTrue(higher["is_protected"])

    # =====================
    # Create - Permissions
    # =====================

    def test_authenticated_non_admin_cannot_create_variation(self):
        self.authenticate_user()
        payload = self.get_variation_payload()

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertFalse(
            models.Variation.objects.filter(title=payload["title"]).exists()
        )

    def test_unauthenticated_user_cannot_create_variation(self):
        payload = self.get_variation_payload()

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertFalse(
            models.Variation.objects.filter(title=payload["title"]).exists()
        )

    # ========================
    # Create - Valid Payloads
    # ========================

    def test_valid_payload_creates_variation_successfully(self):
        self.authenticate_admin()
        payload = self.get_variation_payload()

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        variation = models.Variation.objects.get(title=payload["title"])

        self.assertEqual(variation.title, payload["title"])
        self.assertEqual(variation.slug, "core")
        self.assertEqual(variation.is_protected, payload["is_protected"])

    def test_create_response_returns_serialized_variation_data(self):
        self.authenticate_admin()
        payload = self.get_variation_payload(title="Extended", is_protected=True)

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["title"], "Extended")
        self.assertEqual(response.data["slug"], "extended")
        self.assertTrue(response.data["is_protected"])
        self.assertIn("variation_id", response.data)

    # ==========================
    # Create - Invalid Payloads
    # ==========================

    def test_duplicate_variation_returns_400(self):
        self.authenticate_admin()

        payload = self.get_variation_payload(title="Foundation")

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("title", response.data)

    def test_missing_required_fields_returns_400(self):
        self.authenticate_admin()

        payload = {
            "is_protected": False,
        }

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("title", response.data)

    def test_invalid_payload_returns_validation_errors(self):
        self.authenticate_admin()

        payload = {
            "title": "",
            "is_protected": False,
        }

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("title", response.data)


class VariationDetailViewTests(BaseVariationTestCase):
    """
    DETAIL VIEW TEST CHECKLIST
    --------------------------
    Retrieve - Permissions
    - Verify ADMIN users can retrieve the object and receive 200 OK
    - Verify UNAUTHORISED users cannot retrieve the object and receive 403 FORBIDDEN
    - Verify UNAUTHENTICATED users cannot retrieve the object and receive 403 FORBIDDEN
    --------------------------
    Retrieve - Object Lookup
    - Verify the correct object is returned when variation_slug and variation_id are valid
    - Verify invalid variation_id returns 404 NOT FOUND
    - Verify invalid variation_slug returns 404 NOT FOUND
    - Verify mismatched variation_slug and variation_id return 404 NOT FOUND
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

    def test_superuser_can_retrieve_variation(self):
        self.authenticate_admin()

        response = self.client.get(self.variation1_detail_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_authenticated_non_admin_cannot_retrieve_variation(self):
        self.authenticate_user()

        response = self.client.get(self.variation1_detail_url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthenticated_user_cannot_retrieve_variation(self):
        response = self.client.get(self.variation1_detail_url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # ======================
    # Retrieve - Object Lookup
    # ======================

    def test_retrieve_returns_correct_variation_for_valid_slug_and_id(self):
        self.authenticate_admin()

        response = self.client.get(self.variation1_detail_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], self.variation1.title)
        self.assertEqual(response.data["slug"], self.variation1.slug)

    def test_invalid_variation_id_returns_404(self):
        self.authenticate_admin()

        invalid_url = self.get_variation_detail_url(self.variation1).replace(
            str(self.variation1.variation_id),
            str(uuid.uuid4()),
        )

        response = self.client.get(invalid_url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_invalid_variation_slug_returns_404(self):
        self.authenticate_admin()

        invalid_url = self.get_variation_detail_url(self.variation1).replace(
            self.variation1.slug,
            "not-a-real-variation",
        )

        response = self.client.get(invalid_url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_mismatched_variation_slug_and_variation_id_returns_404(self):
        self.authenticate_admin()

        mismatched_url = self.get_variation_detail_url(self.variation1).replace(
            str(self.variation1.variation_id),
            str(self.variation2.variation_id),
        )

        response = self.client.get(mismatched_url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # ==========================
    # Retrieve - Response Structure
    # ==========================

    def test_retrieve_returns_expected_fields(self):
        self.authenticate_admin()

        response = self.client.get(self.variation1_detail_url)

        expected_fields = {
            "variation_id",
            "title",
            "slug",
            "is_protected",
        }

        self.assertEqual(set(response.data.keys()), expected_fields)

    # =======================
    # Retrieve - Response Values
    # =======================

    def test_retrieve_returns_expected_variation_values(self):
        self.authenticate_admin()

        response = self.client.get(self.variation1_detail_url)

        self.assertEqual(response.data["title"], self.variation1.title)
        self.assertEqual(response.data["slug"], self.variation1.slug)
        self.assertEqual(
            response.data["is_protected"],
            self.variation1.is_protected,
        )

    # ====================
    # Update - Permissions
    # ====================

    def test_authenticated_non_admin_cannot_update_variation(self):
        self.authenticate_user()
        payload = self.get_variation_payload(title="Core Foundation")

        response = self.client.put(self.variation1_detail_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthenticated_user_cannot_update_variation(self):
        payload = self.get_variation_payload(title="Core Foundation")

        response = self.client.put(self.variation1_detail_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # =================
    # Update - Payloads
    # =================

    def test_valid_payload_updates_unprotected_variation_successfully(self):
        self.authenticate_admin()
        payload = self.get_variation_payload(title="Core Foundation")

        response = self.client.put(self.variation1_detail_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.variation1.refresh_from_db()

        self.assertEqual(self.variation1.title, "Core Foundation")
        self.assertFalse(self.variation1.is_protected)

    def test_missing_required_fields_returns_400_for_unprotected_variation(self):
        self.authenticate_admin()

        payload = {
            "is_protected": False,
        }

        response = self.client.put(self.variation1_detail_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("title", response.data)

    def test_invalid_payload_returns_validation_errors(self):
        self.authenticate_admin()

        payload = {
            "title": "",
            "is_protected": False,
        }

        response = self.client.put(self.variation1_detail_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("title", response.data)

    # =====================
    # Update - Business Rules
    # =====================

    def test_read_only_fields_cannot_be_changed(self):
        self.authenticate_admin()

        original_variation_id = self.variation1.variation_id
        original_slug = self.variation1.slug

        payload = self.get_variation_payload(
            variation_id=uuid.uuid4(),
            slug="changed-slug",
            title="Core Foundation",
        )

        response = self.client.put(self.variation1_detail_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.variation1.refresh_from_db()

        self.assertEqual(self.variation1.variation_id, original_variation_id)
        self.assertEqual(self.variation1.slug, original_slug)

    def test_protected_variation_fields_remain_unchanged_after_failed_update(self):
        self.authenticate_admin()

        original_title = self.variation2.title
        original_slug = self.variation2.slug
        original_is_protected = self.variation2.is_protected

        payload = self.get_variation_payload(
            title="Changed Higher",
            is_protected=False,
        )

        response = self.client.put(self.variation2_detail_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        self.variation2.refresh_from_db()

        self.assertEqual(self.variation2.title, original_title)
        self.assertEqual(self.variation2.slug, original_slug)
        self.assertEqual(self.variation2.is_protected, original_is_protected)

    # ====================
    # Delete - Permissions
    # ====================

    def test_authenticated_non_admin_cannot_delete_variation(self):
        self.authenticate_user()

        response = self.client.delete(self.variation1_detail_url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(
            models.Variation.objects.filter(
                variation_id=self.variation1.variation_id
            ).exists()
        )

    def test_unauthenticated_user_cannot_delete_variation(self):
        response = self.client.delete(self.variation1_detail_url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(
            models.Variation.objects.filter(
                variation_id=self.variation1.variation_id
            ).exists()
        )

    # =====================
    # Delete - Business Rules
    # =====================

    def test_protected_variation_cannot_be_deleted(self):
        self.authenticate_admin()

        response = self.client.delete(self.variation2_detail_url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(
            response.data["detail"],
            "This Variation cannot be deleted. Contact Admin",
        )

    def test_unprotected_variation_is_removed_from_database(self):
        self.authenticate_admin()

        response = self.client.delete(self.variation1_detail_url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(
            models.Variation.objects.filter(
                variation_id=self.variation1.variation_id
            ).exists()
        )

    def test_failed_delete_does_not_remove_protected_variation(self):
        self.authenticate_admin()

        response = self.client.delete(self.variation2_detail_url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(
            models.Variation.objects.filter(
                variation_id=self.variation2.variation_id
            ).exists()
        )
