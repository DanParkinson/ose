from rest_framework import status

from core import models
from core.tests.base import BaseAPITestCase


class BaseTeachingStyleTestCase(BaseAPITestCase):
    def setUp(self):
        super().setUp()
        self.list_url = self.get_teaching_style_list_url()

    def get_teaching_style_payload(self, **overrides):
        payload = {
            "title": "Workshop",
            "is_protected": False,
        }
        payload.update(overrides)
        return payload


class TeachingStyleListCreateViewTests(BaseTeachingStyleTestCase):
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
    - Verify expected teaching style fields are present
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
    - Verify create response returns correctly serialised teaching style data
    - Verify invalid payloads return 400 BAD REQUEST
    - Verify missing required fields return 400 BAD REQUEST
    - Verify validation errors are included in the response body
    ------------------
    Create - Business Rules
    - Verify duplicate objects return 400 BAD REQUEST
    - Verify duplicate validation is attached to correct field
    - Verify default/generated fields are set correctly after creation
    """

    def test_any_user_can_access_teaching_style_list(self):
        """
        Arrange: Do not authenticate the request.
        Act: Send a GET request to the teaching style list endpoint.
        Assert: The response returns 200 OK because list views allow public safe read access.
        """
        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_teaching_style_list_returns_all_teaching_styles(self):
        """
        Arrange: Use the default teaching style records from the base test setup.
        Act: Send a GET request to the teaching style list endpoint.
        Assert: The paginated results include all expected teaching style records.
        """
        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 2)

    def test_teaching_style_list_returns_empty_list_when_no_teaching_styles_exist(self):
        """
        Arrange: Delete all teaching style records from the database.
        Act: Send a GET request to the teaching style list endpoint.
        Assert: The response returns 200 OK with an empty paginated results list.
        """
        models.TeachingStyle.objects.all().delete()

        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["results"], [])

    def test_teaching_style_list_returns_paginated_response_structure(self):
        """
        Arrange: Use the default teaching style records from the base test setup.
        Act: Send a GET request to the teaching style list endpoint.
        Assert: The response includes the expected pagination fields.
        """
        response = self.client.get(self.list_url)

        self.assertIn("count", response.data)
        self.assertIn("next", response.data)
        self.assertIn("previous", response.data)
        self.assertIn("results", response.data)

    def test_teaching_style_list_returns_expected_fields(self):
        """
        Arrange: Use the default teaching style records from the base test setup.
        Act: Send a GET request to the teaching style list endpoint.
        Assert: Each returned teaching style contains the expected serializer fields.
        """
        response = self.client.get(self.list_url)

        expected_fields = {
            "teaching_style_id",
            "title",
            "slug",
            "is_protected",
        }

        first_teaching_style = response.data["results"][0]

        self.assertEqual(set(first_teaching_style.keys()), expected_fields)

    def test_teaching_style_list_response_structure_is_consistent(self):
        """
        Arrange: Use multiple teaching style records from the base test setup.
        Act: Send a GET request to the teaching style list endpoint.
        Assert: Every returned teaching style has the same response structure.
        """
        response = self.client.get(self.list_url)

        results = response.data["results"]
        keys = set(results[0].keys())

        for teaching_style in results:
            self.assertEqual(set(teaching_style.keys()), keys)

    def test_teaching_style_list_returns_expected_titles(self):
        """
        Arrange: Use the default teaching style records from the base test setup.
        Act: Send a GET request to the teaching style list endpoint.
        Assert: The returned teaching style titles match the expected database values.
        """
        response = self.client.get(self.list_url)

        titles = [
            teaching_style["title"] for teaching_style in response.data["results"]
        ]

        self.assertIn(self.teaching_style1.title, titles)
        self.assertIn(self.teaching_style2.title, titles)

    def test_teaching_style_list_returns_expected_teaching_style_values(self):
        """
        Arrange: Use the default teaching style records from the base test setup.
        Act: Send a GET request to the teaching style list endpoint.
        Assert: The returned values match the stored database records.
        """
        response = self.client.get(self.list_url)

        returned_teaching_styles = {
            teaching_style["title"]: teaching_style
            for teaching_style in response.data["results"]
        }

        lecture = returned_teaching_styles["Lecture"]
        discussion = returned_teaching_styles["Discussion"]

        self.assertEqual(lecture["slug"], "lecture")
        self.assertFalse(lecture["is_protected"])

        self.assertEqual(discussion["slug"], "discussion")
        self.assertTrue(discussion["is_protected"])

    def test_superuser_can_create_teaching_style(self):
        """
        Arrange: Authenticate as a superuser and prepare a valid teaching style payload.
        Act: Send a POST request to the teaching style list/create endpoint.
        Assert: The response returns 201 CREATED and the teaching style is saved.
        """
        self.authenticate_admin()
        payload = self.get_teaching_style_payload()

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(
            models.TeachingStyle.objects.filter(title=payload["title"]).exists()
        )

    def test_authenticated_non_admin_cannot_create_teaching_style(self):
        """
        Arrange: Authenticate as a regular non-admin user and prepare a valid teaching style payload.
        Act: Send a POST request to the teaching style list/create endpoint.
        Assert: The response returns 403 FORBIDDEN and no teaching style is created.
        """
        self.authenticate_user()
        payload = self.get_teaching_style_payload()

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertFalse(
            models.TeachingStyle.objects.filter(title=payload["title"]).exists()
        )

    def test_unauthenticated_user_cannot_create_teaching_style(self):
        """
        Arrange: Prepare a valid teaching style payload without authenticating.
        Act: Send a POST request to the teaching style list/create endpoint.
        Assert: The response returns 401 UNAUTHORIZED and no teaching style is created.
        """
        payload = self.get_teaching_style_payload()

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertFalse(
            models.TeachingStyle.objects.filter(title=payload["title"]).exists()
        )

    def test_valid_payload_creates_teaching_style_successfully(self):
        """
        Arrange: Authenticate as a superuser and prepare a valid teaching style payload.
        Act: Send a POST request to create the teaching style.
        Assert: The teaching style is created with the expected title, slug, and protection value.
        """
        self.authenticate_admin()
        payload = self.get_teaching_style_payload()

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        teaching_style = models.TeachingStyle.objects.get(title=payload["title"])

        self.assertEqual(teaching_style.title, payload["title"])
        self.assertEqual(teaching_style.slug, "workshop")
        self.assertEqual(teaching_style.is_protected, payload["is_protected"])

    def test_create_response_returns_serialized_teaching_style_data(self):
        """
        Arrange: Authenticate as a superuser and prepare a valid teaching style payload.
        Act: Send a POST request to create the teaching style.
        Assert: The response returns the correctly serialized teaching style data.
        """
        self.authenticate_admin()
        payload = self.get_teaching_style_payload(
            title="Seminar",
            is_protected=True,
        )

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["title"], "Seminar")
        self.assertEqual(response.data["slug"], "seminar")
        self.assertTrue(response.data["is_protected"])
        self.assertIn("teaching_style_id", response.data)

    def test_duplicate_teaching_style_returns_400(self):
        """
        Arrange: Authenticate as a superuser and prepare a payload using an existing teaching style title.
        Act: Send a POST request to create a duplicate teaching style.
        Assert: The response returns 400 BAD REQUEST and the validation error is attached to title.
        """
        self.authenticate_admin()
        payload = self.get_teaching_style_payload(title="Lecture")

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("title", response.data)

    def test_missing_required_fields_returns_400(self):
        """
        Arrange: Authenticate as a superuser and prepare a payload missing the required title field.
        Act: Send a POST request to create the teaching style.
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
        Arrange: Authenticate as a superuser and prepare an invalid teaching style payload.
        Act: Send a POST request to create the teaching style.
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
