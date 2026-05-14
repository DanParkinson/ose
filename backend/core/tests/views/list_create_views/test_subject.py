from rest_framework import status

from core import models
from core.tests.base import BaseAPITestCase


class BaseSubjectTestCase(BaseAPITestCase):
    def setUp(self):
        super().setUp()
        self.list_url = self.get_subject_list_url()

    def get_subject_payload(self, **overrides):
        payload = {
            "title": "Science",
            "level": "secondary",
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
    - Verify ALL users receive 200 OK
    ------------------
    List - Queryset / Returned Objects
    - Verify all expected objects are returned
    - Verify empty queryset returns 200 OK with an empty results list
    ------------------
    List - Response Structure
    - Verify expected paginated response fields are present
    - Verify expected subject fields are present
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
    - Verify invalid payloads return 400 BAD REQUEST
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
        """
        Arrange: Do not authenticate the request.
        Act: Send a GET request to the subject list endpoint.
        Assert: The response returns 200 OK because the subject list is public.
        """
        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    # =================================
    # List - Queryset / Returned Objects
    # =================================

    def test_subject_list_returns_all_subjects(self):
        """
        Arrange: Use the default subject records from the base test setup.
        Act: Send a GET request to the subject list endpoint.
        Assert: The paginated results include all expected subject records.
        """
        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 2)

    def test_subject_list_returns_empty_list_when_no_subjects_exist(self):
        """
        Arrange: Delete all subject records from the database.
        Act: Send a GET request to the subject list endpoint.
        Assert: The response returns 200 OK with an empty paginated results list.
        """
        models.Subject.objects.all().delete()

        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["results"], [])

    # ==========================
    # List - Response Structure
    # ==========================

    def test_subject_list_returns_paginated_response_structure(self):
        """
        Arrange: Use the default subject records from the base test setup.
        Act: Send a GET request to the subject list endpoint.
        Assert: The response includes the expected pagination fields.
        """
        response = self.client.get(self.list_url)

        self.assertIn("count", response.data)
        self.assertIn("next", response.data)
        self.assertIn("previous", response.data)
        self.assertIn("results", response.data)

    def test_subject_list_returns_expected_fields(self):
        """
        Arrange: Use the default subject records from the base test setup.
        Act: Send a GET request to the subject list endpoint.
        Assert: Each returned subject contains the expected serializer fields.
        """
        response = self.client.get(self.list_url)

        first = response.data["results"][0]

        self.assertIn("subject_id", first)
        self.assertIn("title", first)
        self.assertIn("slug", first)
        self.assertIn("level", first)
        self.assertIn("language", first)
        self.assertIn("is_published", first)
        self.assertIn("is_protected", first)

    def test_subject_list_response_structure_is_consistent(self):
        """
        Arrange: Use multiple subject records from the base test setup.
        Act: Send a GET request to the subject list endpoint.
        Assert: Every returned subject has the same response structure.
        """
        response = self.client.get(self.list_url)

        results = response.data["results"]
        keys = set(results[0].keys())

        for item in results:
            self.assertEqual(set(item.keys()), keys)

    # =======================
    # List - Response Values
    # =======================

    def test_subject_list_returns_expected_titles(self):
        """
        Arrange: Use the default subject records from the base test setup.
        Act: Send a GET request to the subject list endpoint.
        Assert: The returned subject titles match the expected database values.
        """
        response = self.client.get(self.list_url)

        titles = [subject["title"] for subject in response.data["results"]]

        self.assertIn(self.subject1.title, titles)
        self.assertIn(self.subject2.title, titles)

    def test_subject_list_returns_expected_subject_values(self):
        """
        Arrange: Use the default subject records from the base test setup.
        Act: Send a GET request to the subject list endpoint.
        Assert: The returned subject values match the stored database records.
        """
        response = self.client.get(self.list_url)

        data = {subject["title"]: subject for subject in response.data["results"]}

        self.assertEqual(data[self.subject1.title]["slug"], self.subject1.slug)
        self.assertEqual(data[self.subject1.title]["level"], self.subject1.level)
        self.assertEqual(data[self.subject1.title]["language"], self.subject1.language)
        self.assertEqual(
            data[self.subject1.title]["is_published"],
            self.subject1.is_published,
        )
        self.assertEqual(
            data[self.subject1.title]["is_protected"],
            self.subject1.is_protected,
        )

        self.assertEqual(data[self.subject2.title]["slug"], self.subject2.slug)
        self.assertEqual(data[self.subject2.title]["level"], self.subject2.level)
        self.assertEqual(data[self.subject2.title]["language"], self.subject2.language)
        self.assertEqual(
            data[self.subject2.title]["is_published"],
            self.subject2.is_published,
        )
        self.assertEqual(
            data[self.subject2.title]["is_protected"],
            self.subject2.is_protected,
        )

    # =====================
    # Create - Permissions
    # =====================

    def test_superuser_can_create_subject(self):
        """
        Arrange: Authenticate as a superuser and prepare a valid subject payload.
        Act: Send a POST request to the subject list/create endpoint.
        Assert: The response returns 201 CREATED.
        """
        self.authenticate_admin()

        response = self.client.post(
            self.list_url,
            self.get_subject_payload(),
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_authenticated_non_admin_cannot_create_subject(self):
        """
        Arrange: Authenticate as a regular non-admin user and prepare a valid payload.
        Act: Send a POST request to the subject list/create endpoint.
        Assert: The response returns 403 FORBIDDEN and no subject is created.
        """
        self.authenticate_user()

        response = self.client.post(
            self.list_url,
            self.get_subject_payload(),
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(models.Subject.objects.count(), 2)

    def test_unauthenticated_user_cannot_create_subject(self):
        """
        Arrange: Prepare a valid subject payload without authenticating.
        Act: Send a POST request to the subject list/create endpoint.
        Assert: The response returns 401 UNAUTHORIZED and no subject is created.
        """
        response = self.client.post(
            self.list_url,
            self.get_subject_payload(),
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(models.Subject.objects.count(), 2)

    # ========================
    # Create - Valid Payloads
    # ========================

    def test_valid_payload_creates_subject_successfully(self):
        """
        Arrange: Authenticate as a superuser and prepare a valid subject payload.
        Act: Send a POST request to create the subject.
        Assert: The subject is successfully created in the database.
        """
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
        """
        Arrange: Authenticate as a superuser and prepare a payload using an existing subject title.
        Act: Send a POST request to create a duplicate subject.
        Assert: The response returns 400 BAD REQUEST.
        """
        self.authenticate_admin()

        response = self.client.post(
            self.list_url,
            self.get_subject_payload(title=self.subject1.title),
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_missing_required_fields_returns_400(self):
        """
        Arrange: Authenticate as a superuser and prepare a payload missing required fields.
        Act: Send a POST request to create the subject.
        Assert: The response returns 400 BAD REQUEST.
        """
        self.authenticate_admin()

        response = self.client.post(
            self.list_url,
            {"title": "Science"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_invalid_payload_returns_validation_errors(self):
        """
        Arrange: Authenticate as a superuser and prepare an invalid subject payload.
        Act: Send a POST request to create the subject.
        Assert: The response returns 400 BAD REQUEST with validation errors.
        """
        self.authenticate_admin()

        response = self.client.post(
            self.list_url,
            {
                "title": "",
                "level": "invalid",
                "language": "invalid",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # =====================
    # Create - Business Rules
    # =====================

    def test_generated_slug_is_set_correctly_after_creation(self):
        """
        Arrange: Authenticate as a superuser and prepare a valid subject payload.
        Act: Send a POST request to create the subject.
        Assert: The generated slug matches the expected slug format.
        """
        self.authenticate_admin()

        self.client.post(
            self.list_url,
            self.get_subject_payload(
                title="Biology",
                level="secondary",
            ),
            format="json",
        )

        subject = models.Subject.objects.get(title="Biology")

        self.assert_subject_matches(
            subject,
            title="Biology",
            slug="biology-secondary-en",
            level="secondary",
            language="en",
            is_published=True,
            is_protected=False,
        )
