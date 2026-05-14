from rest_framework import status

from core import models
from core.tests.base import BaseAPITestCase


class BaseTopicTestCase(BaseAPITestCase):
    def setUp(self):
        super().setUp()
        self.list_url = self.get_topic_list_url()

    def get_topic_payload(self, **overrides):
        payload = {
            "title": "Geometry",
            "subjects": [str(self.subject1.subject_id)],
            "is_protected": False,
        }
        payload.update(overrides)
        return payload


class TopicListCreateViewTests(BaseTopicTestCase):
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
    - Verify expected topic fields are present
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
    - Verify create response returns correctly serialised topic data
    - Verify invalid payloads return 400 BAD REQUEST
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

    def test_any_user_can_access_topic_list(self):
        """
        Arrange: Do not authenticate the request.
        Act: Send a GET request to the topic list endpoint.
        Assert: The response returns 200 OK because list views allow public safe read access.
        """
        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    # =================================
    # List - Queryset / Returned Objects
    # =================================

    def test_topic_list_returns_all_topics(self):
        """
        Arrange: Use the default topic records from the base test setup.
        Act: Send a GET request to the topic list endpoint.
        Assert: The paginated results include all expected topic records.
        """
        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 2)

    def test_topic_list_returns_empty_list_when_no_topics_exist(self):
        """
        Arrange: Delete all topic records from the database.
        Act: Send a GET request to the topic list endpoint.
        Assert: The response returns 200 OK with an empty paginated results list.
        """
        models.Topic.objects.all().delete()

        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["results"], [])

    # ==========================
    # List - Response Structure
    # ==========================

    def test_topic_list_returns_paginated_response_structure(self):
        """
        Arrange: Use the default topic records from the base test setup.
        Act: Send a GET request to the topic list endpoint.
        Assert: The response includes the expected pagination fields.
        """
        response = self.client.get(self.list_url)

        self.assertIn("count", response.data)
        self.assertIn("next", response.data)
        self.assertIn("previous", response.data)
        self.assertIn("results", response.data)

    def test_topic_list_returns_expected_fields(self):
        """
        Arrange: Use the default topic records from the base test setup.
        Act: Send a GET request to the topic list endpoint.
        Assert: Each returned topic contains the expected serializer fields.
        """
        response = self.client.get(self.list_url)

        expected_fields = {
            "topic_id",
            "subjects",
            "title",
            "slug",
            "is_protected",
        }

        first_topic = response.data["results"][0]

        self.assertEqual(set(first_topic.keys()), expected_fields)

    def test_topic_list_response_structure_is_consistent(self):
        """
        Arrange: Use multiple topic records from the base test setup.
        Act: Send a GET request to the topic list endpoint.
        Assert: Every returned topic has the same response structure.
        """
        response = self.client.get(self.list_url)

        results = response.data["results"]
        keys = set(results[0].keys())

        for topic in results:
            self.assertEqual(set(topic.keys()), keys)

    # =======================
    # List - Response Values
    # =======================

    def test_topic_list_returns_expected_titles(self):
        """
        Arrange: Use the default topic records from the base test setup.
        Act: Send a GET request to the topic list endpoint.
        Assert: The returned topic titles match the expected database values.
        """
        response = self.client.get(self.list_url)

        titles = [topic["title"] for topic in response.data["results"]]

        self.assertIn(self.topic1.title, titles)
        self.assertIn(self.topic2.title, titles)

    def test_topic_list_returns_expected_topic_values(self):
        """
        Arrange: Use the default topics and subject relationships from the base test setup.
        Act: Send a GET request to the topic list endpoint.
        Assert: The returned values match the database records and nested subject representation.
        """
        response = self.client.get(self.list_url)

        returned_topics = {topic["title"]: topic for topic in response.data["results"]}

        algebra = returned_topics["Algebra"]
        poetry = returned_topics["Poetry"]

        self.assertEqual(algebra["slug"], "algebra")
        self.assertEqual(algebra["subjects"][0]["title"], "Mathematics")
        self.assertEqual(algebra["subjects"][0]["level"], "secondary")
        self.assertEqual(algebra["subjects"][0]["language"], "en")
        self.assertEqual(
            algebra["subjects"][0]["subject_id"],
            str(self.subject1.subject_id),
        )
        self.assertFalse(algebra["is_protected"])

        self.assertEqual(poetry["slug"], "poetry")
        self.assertEqual(poetry["subjects"][0]["title"], "English")
        self.assertEqual(poetry["subjects"][0]["level"], "primary")
        self.assertEqual(poetry["subjects"][0]["language"], "en")
        self.assertEqual(
            poetry["subjects"][0]["subject_id"],
            str(self.subject2.subject_id),
        )
        self.assertTrue(poetry["is_protected"])

    # =====================
    # Create - Permissions
    # =====================

    def test_superuser_can_create_topic(self):
        """
        Arrange: Authenticate as a superuser and prepare a valid topic payload using subject UUIDs.
        Act: Send a POST request to the topic list/create endpoint.
        Assert: The response returns 201 CREATED and the topic is saved.
        """
        self.authenticate_admin()
        payload = self.get_topic_payload()

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(models.Topic.objects.filter(title=payload["title"]).exists())

    def test_authenticated_non_admin_cannot_create_topic(self):
        """
        Arrange: Authenticate as a regular non-admin user and prepare a valid topic payload.
        Act: Send a POST request to the topic list/create endpoint.
        Assert: The response returns 403 FORBIDDEN and no topic is created.
        """
        self.authenticate_user()
        payload = self.get_topic_payload()

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertFalse(models.Topic.objects.filter(title=payload["title"]).exists())

    def test_unauthenticated_user_cannot_create_topic(self):
        """
        Arrange: Prepare a valid topic payload without authenticating.
        Act: Send a POST request to the topic list/create endpoint.
        Assert: The response returns 401 UNAUTHORIZED and no topic is created.
        """
        payload = self.get_topic_payload()

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertFalse(models.Topic.objects.filter(title=payload["title"]).exists())

    # ========================
    # Create - Valid Payloads
    # ========================

    def test_valid_payload_creates_topic_successfully(self):
        """
        Arrange: Authenticate as a superuser and prepare a valid topic payload using a subject UUID.
        Act: Send a POST request to create the topic.
        Assert: The topic is created with the expected title, slug, protection value, and subject relationship.
        """
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
        """
        Arrange: Authenticate as a superuser and prepare a payload with two subject UUIDs.
        Act: Send a POST request to create the topic.
        Assert: The topic is created and linked to both subjects.
        """
        self.authenticate_admin()
        payload = self.get_topic_payload(
            title="Creative Writing",
            subjects=[
                str(self.subject1.subject_id),
                str(self.subject2.subject_id),
            ],
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
        """
        Arrange: Authenticate as a superuser and prepare a valid topic payload using a subject UUID.
        Act: Send a POST request to create the topic.
        Assert: The response returns the correctly serialized topic data with nested subject data.
        """
        self.authenticate_admin()
        payload = self.get_topic_payload(
            title="Statistics",
            subjects=[str(self.subject1.subject_id)],
            is_protected=True,
        )

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["title"], "Statistics")
        self.assertEqual(response.data["slug"], "statistics")
        self.assertEqual(response.data["subjects"][0]["title"], "Mathematics")
        self.assertEqual(
            response.data["subjects"][0]["subject_id"],
            str(self.subject1.subject_id),
        )
        self.assertTrue(response.data["is_protected"])
        self.assertIn("topic_id", response.data)

    # ==========================
    # Create - Invalid Payloads
    # ==========================

    def test_duplicate_topic_returns_400(self):
        """
        Arrange: Authenticate as a superuser and prepare a payload using an existing topic title.
        Act: Send a POST request to create a duplicate topic.
        Assert: The response returns 400 BAD REQUEST and the validation error is attached to title.
        """
        self.authenticate_admin()
        payload = self.get_topic_payload(title="Algebra")

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("title", response.data)

    def test_missing_required_fields_returns_400(self):
        """
        Arrange: Authenticate as a superuser and prepare a payload missing required subject data.
        Act: Send a POST request to create the topic.
        Assert: The response returns 400 BAD REQUEST and includes a subjects validation error.
        """
        self.authenticate_admin()
        payload = {
            "title": "Geometry",
        }

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("subjects", response.data)

    def test_invalid_payload_returns_validation_errors(self):
        """
        Arrange: Authenticate as a superuser and prepare invalid title and subject data.
        Act: Send a POST request to create the topic.
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
