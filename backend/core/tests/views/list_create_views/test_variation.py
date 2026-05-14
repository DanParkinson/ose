from rest_framework import status

from core import models
from core.tests.base import BaseAPITestCase


class BaseVariationTestCase(BaseAPITestCase):
    def setUp(self):
        super().setUp()
        self.list_url = self.get_variation_list_url()

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
    List - Permissions - Public
    - Verify ALL users receive 200 OK
    ------------------
    List - Queryset / Returned Objects
    - Verify all expected objects are returned
    - Verify empty queryset returns 200 OK with an empty results list
    ------------------
    List - Response Structure
    - Verify expected paginated response fields are present
    - Verify expected variation fields are present
    - Verify response structure is consistent across returned objects
    ------------------
    List - Response Values
    - Verify returned values match database records
    - Verify returned values are correctly serialised
    ------------------
    Create - Permissions
    - Verify ADMIN users CAN create object and receive 201 CREATED
    - Verify AUTHENTICATED NON-ADMIN users CANNOT create object and receive 403 FORBIDDEN
    - Verify UNAUTHENTICATED users CANNOT create object and receive 401 UNAUTHORIZED
    ------------------
    Create - Payloads
    - Verify valid payload creates object successfully
    - Verify create response returns correctly serialised variation data
    - Verify invalid payloads return 400 BAD REQUEST
    - Verify missing required fields return 400 BAD REQUEST
    - Verify validation errors are included in the response body
    ------------------
    Create - Business Rules
    - Verify duplicate objects return 400 BAD REQUEST
    - Verify duplicate validation is attached to correct field
    - Verify default/generated fields are set correctly after creation
    """

    def test_any_user_can_access_variation_list(self):
        """
        Arrange: Do not authenticate the request.
        Act: Send a GET request to the variation list endpoint.
        Assert: The response returns 200 OK because list views allow public safe read access.
        """
        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_variation_list_returns_all_variations(self):
        """
        Arrange: Use the default variation records from the base test setup.
        Act: Send a GET request to the variation list endpoint.
        Assert: The paginated results include all expected variation records.
        """
        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 2)

    def test_variation_list_returns_empty_list_when_no_variations_exist(self):
        """
        Arrange: Delete all variation records from the database.
        Act: Send a GET request to the variation list endpoint.
        Assert: The response returns 200 OK with an empty paginated results list.
        """
        models.Variation.objects.all().delete()

        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["results"], [])

    def test_variation_list_returns_paginated_response_structure(self):
        """
        Arrange: Use the default variation records from the base test setup.
        Act: Send a GET request to the variation list endpoint.
        Assert: The response includes the expected pagination fields.
        """
        response = self.client.get(self.list_url)

        self.assertIn("count", response.data)
        self.assertIn("next", response.data)
        self.assertIn("previous", response.data)
        self.assertIn("results", response.data)

    def test_variation_list_returns_expected_fields(self):
        """
        Arrange: Use the default variation records from the base test setup.
        Act: Send a GET request to the variation list endpoint.
        Assert: Each returned variation contains the expected serializer fields.
        """
        response = self.client.get(self.list_url)

        expected_fields = {
            "variation_id",
            "title",
            "slug",
            "is_protected",
        }

        first_variation = response.data["results"][0]

        self.assertEqual(set(first_variation.keys()), expected_fields)

    def test_variation_list_response_structure_is_consistent(self):
        """
        Arrange: Use multiple variation records from the base test setup.
        Act: Send a GET request to the variation list endpoint.
        Assert: Every returned variation has the same response structure.
        """
        response = self.client.get(self.list_url)

        results = response.data["results"]
        keys = set(results[0].keys())

        for variation in results:
            self.assertEqual(set(variation.keys()), keys)

    def test_variation_list_returns_expected_titles(self):
        """
        Arrange: Use the default variation records from the base test setup.
        Act: Send a GET request to the variation list endpoint.
        Assert: The returned variation titles match the expected database values.
        """
        response = self.client.get(self.list_url)

        titles = [variation["title"] for variation in response.data["results"]]

        self.assertIn(self.variation1.title, titles)
        self.assertIn(self.variation2.title, titles)

    def test_variation_list_returns_expected_variation_values(self):
        """
        Arrange: Use the default variation records from the base test setup.
        Act: Send a GET request to the variation list endpoint.
        Assert: The returned values match the stored database records.
        """
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

    def test_superuser_can_create_variation(self):
        """
        Arrange: Authenticate as a superuser and prepare a valid variation payload.
        Act: Send a POST request to the variation list/create endpoint.
        Assert: The response returns 201 CREATED and the variation is saved.
        """
        self.authenticate_admin()
        payload = self.get_variation_payload()

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(
            models.Variation.objects.filter(title=payload["title"]).exists()
        )

    def test_authenticated_non_admin_cannot_create_variation(self):
        """
        Arrange: Authenticate as a regular non-admin user and prepare a valid variation payload.
        Act: Send a POST request to the variation list/create endpoint.
        Assert: The response returns 403 FORBIDDEN and no variation is created.
        """
        self.authenticate_user()
        payload = self.get_variation_payload()

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertFalse(
            models.Variation.objects.filter(title=payload["title"]).exists()
        )

    def test_unauthenticated_user_cannot_create_variation(self):
        """
        Arrange: Prepare a valid variation payload without authenticating.
        Act: Send a POST request to the variation list/create endpoint.
        Assert: The response returns 401 UNAUTHORIZED and no variation is created.
        """
        payload = self.get_variation_payload()

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertFalse(
            models.Variation.objects.filter(title=payload["title"]).exists()
        )

    def test_valid_payload_creates_variation_successfully(self):
        """
        Arrange: Authenticate as a superuser and prepare a valid variation payload.
        Act: Send a POST request to create the variation.
        Assert: The variation is created with the expected title, slug, and protection value.
        """
        self.authenticate_admin()
        payload = self.get_variation_payload()

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        variation = models.Variation.objects.get(title=payload["title"])

        self.assertEqual(variation.title, payload["title"])
        self.assertEqual(variation.slug, "core")
        self.assertEqual(variation.is_protected, payload["is_protected"])

    def test_create_response_returns_serialized_variation_data(self):
        """
        Arrange: Authenticate as a superuser and prepare a valid variation payload.
        Act: Send a POST request to create the variation.
        Assert: The response returns the correctly serialized variation data.
        """
        self.authenticate_admin()
        payload = self.get_variation_payload(
            title="Extended",
            is_protected=True,
        )

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["title"], "Extended")
        self.assertEqual(response.data["slug"], "extended")
        self.assertTrue(response.data["is_protected"])
        self.assertIn("variation_id", response.data)

    def test_duplicate_variation_returns_400(self):
        """
        Arrange: Authenticate as a superuser and prepare a payload using an existing variation title.
        Act: Send a POST request to create a duplicate variation.
        Assert: The response returns 400 BAD REQUEST and the validation error is attached to title.
        """
        self.authenticate_admin()
        payload = self.get_variation_payload(title="Foundation")

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("title", response.data)

    def test_missing_required_fields_returns_400(self):
        """
        Arrange: Authenticate as a superuser and prepare a payload missing the required title field.
        Act: Send a POST request to create the variation.
        Assert: The response returns 400 BAD REQUEST and includes a title validation error.
        """
        self.authenticate_admin()
        payload = {
            "is_protected": False,
        }

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("title", response.data)

    def test_invalid_payload_returns_validation_errors(self):
        """
        Arrange: Authenticate as a superuser and prepare an invalid variation payload.
        Act: Send a POST request to create the variation.
        Assert: The response returns 400 BAD REQUEST with validation errors for title.
        """
        self.authenticate_admin()
        payload = {
            "title": "",
            "is_protected": False,
        }

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("title", response.data)
