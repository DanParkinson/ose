from rest_framework import status

from core import models
from core.tests.base import BaseAPITestCase


class BaseLessonNameTestCase(BaseAPITestCase):
    def setUp(self):
        super().setUp()
        self.list_url = self.get_lesson_name_list_url()

    def get_lesson_name_payload(self, **overrides):
        payload = {
            "title": "Quadratic Equations",
            "subjects": [str(self.subject1.subject_id)],
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
            [
                str(subject_id)
                for subject_id in lesson_name.subjects.values_list(
                    "subject_id", flat=True
                )
            ],
            subjects,
        )
        self.assertEqual(lesson_name.is_protected, is_protected)


class LessonNameListCreateViewTests(BaseLessonNameTestCase):
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
    - Verify expected lesson name fields are present
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
    - Verify valid payload assigns subject relationships correctly
    - Verify valid payload can assign multiple subjects
    - Verify create response returns correctly serialised lesson name data
    - Verify invalid payloads return 400 BAD REQUEST
    - Verify missing required fields return 400 BAD REQUEST
    - Verify validation errors are included in the response body
    ------------------
    Create - Business Rules
    - Verify duplicate objects return 400 BAD REQUEST
    - Verify duplicate validation is attached to correct field
    - Verify default/generated fields are set correctly after creation
    """

    def test_any_user_can_access_lesson_name_list(self):
        """
        Arrange: Do not authenticate the request.
        Act: Send a GET request to the lesson name list endpoint.
        Assert: The response returns 200 OK because list views allow public safe read access.
        """
        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_lesson_name_list_returns_all_lesson_names(self):
        """
        Arrange: Use the default lesson name records from the base test setup.
        Act: Send a GET request to the lesson name list endpoint.
        Assert: The paginated results include all expected lesson name records.
        """
        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 2)

    def test_lesson_name_list_returns_empty_list_when_no_lesson_names_exist(self):
        """
        Arrange: Delete all lesson name records from the database.
        Act: Send a GET request to the lesson name list endpoint.
        Assert: The response returns 200 OK with an empty paginated results list.
        """
        models.LessonName.objects.all().delete()

        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["results"], [])

    def test_lesson_name_list_returns_paginated_response_structure(self):
        """
        Arrange: Use the default lesson name records from the base test setup.
        Act: Send a GET request to the lesson name list endpoint.
        Assert: The response includes the expected pagination fields.
        """
        response = self.client.get(self.list_url)

        self.assertIn("count", response.data)
        self.assertIn("next", response.data)
        self.assertIn("previous", response.data)
        self.assertIn("results", response.data)

    def test_lesson_name_list_returns_expected_fields(self):
        """
        Arrange: Use the default lesson name records from the base test setup.
        Act: Send a GET request to the lesson name list endpoint.
        Assert: Each returned lesson name contains the expected serializer fields.
        """
        response = self.client.get(self.list_url)

        expected_fields = {
            "lesson_name_id",
            "subjects",
            "title",
            "slug",
            "is_protected",
        }

        first_lesson_name = response.data["results"][0]

        self.assertEqual(set(first_lesson_name.keys()), expected_fields)

    def test_lesson_name_list_response_structure_is_consistent(self):
        """
        Arrange: Use multiple lesson name records from the base test setup.
        Act: Send a GET request to the lesson name list endpoint.
        Assert: Every returned lesson name has the same response structure.
        """
        response = self.client.get(self.list_url)

        results = response.data["results"]
        keys = set(results[0].keys())

        for lesson_name in results:
            self.assertEqual(set(lesson_name.keys()), keys)

    def test_lesson_name_list_returns_expected_titles(self):
        """
        Arrange: Use the default lesson name records from the base test setup.
        Act: Send a GET request to the lesson name list endpoint.
        Assert: The returned lesson name titles match the expected database values.
        """
        response = self.client.get(self.list_url)

        titles = [lesson_name["title"] for lesson_name in response.data["results"]]

        self.assertIn(self.lesson_name1.title, titles)
        self.assertIn(self.lesson_name2.title, titles)

    def test_lesson_name_list_returns_expected_lesson_name_values(self):
        """
        Arrange: Use the default lesson names and subject relationships from the base test setup.
        Act: Send a GET request to the lesson name list endpoint.
        Assert: The returned values match the database records and nested subject representation.
        """
        response = self.client.get(self.list_url)

        returned_lesson_names = {
            lesson_name["title"]: lesson_name
            for lesson_name in response.data["results"]
        }

        linear_equations = returned_lesson_names["Linear Equations"]
        poetry_analysis = returned_lesson_names["Poetry Analysis"]

        self.assertEqual(linear_equations["slug"], "linear-equations")
        self.assertEqual(linear_equations["subjects"][0]["title"], "Mathematics")
        self.assertEqual(linear_equations["subjects"][0]["level"], "secondary")
        self.assertEqual(linear_equations["subjects"][0]["language"], "en")
        self.assertEqual(
            linear_equations["subjects"][0]["subject_id"],
            str(self.subject1.subject_id),
        )
        self.assertFalse(linear_equations["is_protected"])

        self.assertEqual(poetry_analysis["slug"], "poetry-analysis")
        self.assertEqual(poetry_analysis["subjects"][0]["title"], "English")
        self.assertEqual(poetry_analysis["subjects"][0]["level"], "primary")
        self.assertEqual(poetry_analysis["subjects"][0]["language"], "en")
        self.assertEqual(
            poetry_analysis["subjects"][0]["subject_id"],
            str(self.subject2.subject_id),
        )
        self.assertTrue(poetry_analysis["is_protected"])

    def test_superuser_can_create_lesson_name(self):
        """
        Arrange: Authenticate as a superuser and prepare a valid lesson name payload using subject UUIDs.
        Act: Send a POST request to the lesson name list/create endpoint.
        Assert: The response returns 201 CREATED and the lesson name is saved.
        """
        self.authenticate_admin()
        payload = self.get_lesson_name_payload()

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(
            models.LessonName.objects.filter(title=payload["title"]).exists()
        )

    def test_authenticated_non_admin_cannot_create_lesson_name(self):
        """
        Arrange: Authenticate as a regular non-admin user and prepare a valid lesson name payload.
        Act: Send a POST request to the lesson name list/create endpoint.
        Assert: The response returns 403 FORBIDDEN and no lesson name is created.
        """
        self.authenticate_user()
        payload = self.get_lesson_name_payload()

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertFalse(
            models.LessonName.objects.filter(title=payload["title"]).exists()
        )

    def test_unauthenticated_user_cannot_create_lesson_name(self):
        """
        Arrange: Prepare a valid lesson name payload without authenticating.
        Act: Send a POST request to the lesson name list/create endpoint.
        Assert: The response returns 401 UNAUTHORIZED and no lesson name is created.
        """
        payload = self.get_lesson_name_payload()

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertFalse(
            models.LessonName.objects.filter(title=payload["title"]).exists()
        )

    def test_valid_payload_creates_lesson_name_successfully(self):
        """
        Arrange: Authenticate as a superuser and prepare a valid lesson name payload using a subject UUID.
        Act: Send a POST request to create the lesson name.
        Assert: The lesson name is created with the expected title, slug, protection value, and subject relationship.
        """
        self.authenticate_admin()
        payload = self.get_lesson_name_payload()

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        lesson_name = models.LessonName.objects.get(title=payload["title"])

        self.assert_lesson_name_matches(
            lesson_name,
            title=payload["title"],
            slug="quadratic-equations",
            subjects=[str(self.subject1.subject_id)],
            is_protected=False,
        )

    def test_valid_payload_can_assign_multiple_subjects(self):
        """
        Arrange: Authenticate as a superuser and prepare a payload with two subject UUIDs.
        Act: Send a POST request to create the lesson name.
        Assert: The lesson name is created and linked to both subjects.
        """
        self.authenticate_admin()
        payload = self.get_lesson_name_payload(
            title="Essay Writing Skills",
            subjects=[
                str(self.subject1.subject_id),
                str(self.subject2.subject_id),
            ],
            is_protected=True,
        )

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        lesson_name = models.LessonName.objects.get(title=payload["title"])

        self.assert_lesson_name_matches(
            lesson_name,
            title=payload["title"],
            slug="essay-writing-skills",
            subjects=[
                str(self.subject1.subject_id),
                str(self.subject2.subject_id),
            ],
            is_protected=True,
        )

    def test_create_response_returns_serialized_lesson_name_data(self):
        """
        Arrange: Authenticate as a superuser and prepare a valid lesson name payload using a subject UUID.
        Act: Send a POST request to create the lesson name.
        Assert: The response returns the correctly serialized lesson name data with nested subject data.
        """
        self.authenticate_admin()
        payload = self.get_lesson_name_payload(
            title="Statistics Foundations",
            subjects=[str(self.subject1.subject_id)],
            is_protected=True,
        )

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["title"], "Statistics Foundations")
        self.assertEqual(response.data["slug"], "statistics-foundations")
        self.assertEqual(response.data["subjects"][0]["title"], "Mathematics")
        self.assertEqual(
            response.data["subjects"][0]["subject_id"],
            str(self.subject1.subject_id),
        )
        self.assertTrue(response.data["is_protected"])
        self.assertIn("lesson_name_id", response.data)

    def test_duplicate_lesson_name_returns_400(self):
        """
        Arrange: Authenticate as a superuser and prepare a payload using an existing lesson name title.
        Act: Send a POST request to create a duplicate lesson name.
        Assert: The response returns 400 BAD REQUEST and the validation error is attached to title.
        """
        self.authenticate_admin()
        payload = self.get_lesson_name_payload(title="Linear Equations")

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("title", response.data)

    def test_missing_required_fields_returns_400(self):
        """
        Arrange: Authenticate as a superuser and prepare a payload missing required subject data.
        Act: Send a POST request to create the lesson name.
        Assert: The response returns 400 BAD REQUEST and includes a subjects validation error.
        """
        self.authenticate_admin()
        payload = {
            "title": "Quadratic Equations",
        }

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("subjects", response.data)

    def test_invalid_payload_returns_validation_errors(self):
        """
        Arrange: Authenticate as a superuser and prepare invalid title and subject data.
        Act: Send a POST request to create the lesson name.
        Assert: The response returns 400 BAD REQUEST with validation errors for title and subjects.
        """
        self.authenticate_admin()
        payload = {
            "title": "",
            "subjects": ["NotARealSubject"],
        }

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("title", response.data)
        self.assertIn("subjects", response.data)

    def test_generated_slug_is_set_correctly_after_creation(self):
        """
        Arrange: Authenticate as a superuser and prepare a valid payload with a new title.
        Act: Send a POST request to create the lesson name.
        Assert: The model generates the expected slug from the title.
        """
        self.authenticate_admin()
        payload = self.get_lesson_name_payload(
            title="Biology Basics",
        )

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        lesson_name = models.LessonName.objects.get(title=payload["title"])

        self.assertEqual(lesson_name.slug, "biology-basics")
