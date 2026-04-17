from django.urls import reverse
from rest_framework import status

from .. import models
from .base import BaseAPITestCase


class BaseLessonVariantResourceTestCase(BaseAPITestCase):
    def setUp(self):
        super().setUp()

        self.create_url = self.get_lesson_variant_resource_create_url(
            self.subject1,
            self.lesson_variant1,
        )

        self.attach_url = reverse(
            "lesson-variant-resource-attach",
            kwargs={
                "subject_slug": self.subject1.slug,
                "subject_id": self.subject1.subject_id,
                "lesson_variant_slug": self.lesson_variant1.slug,
                "lesson_variant_id": self.lesson_variant1.lesson_variant_id,
            },
        )

        self.unattached_resource = models.Resource.objects.create(
            title="Fractions Worksheet",
            category="worksheet",
            description="Fractions practice worksheet",
            url="https://example.com/fractions-worksheet",
            is_protected=False,
            author=self.superuser,
        )
        self.unattached_resource.subjects.set([self.subject1])

    def get_resource_payload(self, **overrides):
        payload = {
            "title": "Fractions Worksheet",
            "category": "worksheet",
            "description": "Fractions practice worksheet",
            "url": "https://example.com/fractions-worksheet",
            "order": 3,
        }
        payload.update(overrides)
        return payload

    def get_attach_payload(self, **overrides):
        payload = {
            "resource": str(self.unattached_resource.resource_id),
        }
        payload.update(overrides)
        return payload


class LessonVariantResourceCreateViewTests(BaseLessonVariantResourceTestCase):
    """
    CREATE VIEW TEST CHECKLIST
    --------------------------
    GET - Permissions
    - Verify ADMIN users can access the create endpoint helper data and receive 200 OK
    - Verify UNAUTHORISED users cannot access the create endpoint helper data and receive 403 FORBIDDEN
    - Verify UNAUTHENTICATED users cannot access the create endpoint helper data and receive 403 FORBIDDEN
    --------------------------
    GET - Object Lookup
    - Verify valid subject and lesson variant lookup returns 200 OK
    - Verify invalid subject ID returns 404 NOT FOUND
    - Verify invalid lesson variant ID returns 404 NOT FOUND
    - Verify invalid lesson variant slug returns 404 NOT FOUND
    - Verify mismatched subject and lesson variant returns 404 NOT FOUND
    --------------------------
    GET - Response Structure
    - Verify expected fields are present
    --------------------------
    GET - Response Values
    - Verify returned values match database records
    --------------------------
    POST - Permissions
    - Verify ADMIN users can create a resource for a lesson variant and receive 201 CREATED
    - Verify UNAUTHORISED users cannot create and receive 403 FORBIDDEN
    - Verify UNAUTHENTICATED users cannot create and receive 403 FORBIDDEN
    --------------------------
    POST - Object Lookup
    - Verify valid subject and lesson variant lookup allows creation
    - Verify invalid subject ID returns 404 NOT FOUND
    - Verify invalid subject slug still creates when ID is valid
    - Verify invalid lesson variant ID returns 404 NOT FOUND
    - Verify invalid lesson variant slug returns 404 NOT FOUND
    - Verify mismatched subject and lesson variant returns 404 NOT FOUND
    --------------------------
    POST - Payloads
    - Verify valid payload creates resource successfully
    - Verify missing required fields return 400 BAD REQUEST
    - Verify validation errors are included in the response body
    - Verify order defaults to 0 when omitted
    --------------------------
    POST - Business Rules
    - Verify author is set from authenticated user
    - Verify lesson variant resource link is created
    - Verify created link stores submitted order
    - Verify resource slug is generated correctly
    --------------------------
    POST - Response Structure
    - Verify expected fields are present in create response
    - Verify nested resource data is returned
    --------------------------
    POST - Response Values
    - Verify returned values match created database records
    """

    # =====================
    # GET - Permissions
    # =====================

    def test_admin_can_access_create_endpoint_helper_data(self):
        self.authenticate_admin()

        response = self.client.get(self.create_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_authenticated_non_admin_cannot_access_create_endpoint_helper_data(self):
        self.authenticate_user()

        response = self.client.get(self.create_url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthenticated_user_cannot_access_create_endpoint_helper_data(self):
        response = self.client.get(self.create_url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # =====================
    # GET - Object Lookup
    # =====================

    def test_valid_subject_and_lesson_variant_lookup_returns_200_for_get(self):
        self.authenticate_admin()

        response = self.client.get(self.create_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_with_invalid_subject_id_returns_404(self):
        self.authenticate_admin()

        invalid_url = self.get_lesson_variant_resource_create_url(
            self.subject1,
            self.lesson_variant1,
        ).replace(
            str(self.subject1.subject_id),
            "00000000-0000-0000-0000-000000000000",
        )

        response = self.client.get(invalid_url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_with_invalid_lesson_variant_id_returns_404(self):
        self.authenticate_admin()

        invalid_url = self.get_lesson_variant_resource_create_url(
            self.subject1,
            self.lesson_variant1,
        ).replace(
            str(self.lesson_variant1.lesson_variant_id),
            "00000000-0000-0000-0000-000000000000",
        )

        response = self.client.get(invalid_url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_with_invalid_lesson_variant_slug_returns_404(self):
        self.authenticate_admin()

        invalid_url = self.get_lesson_variant_resource_create_url(
            self.subject1,
            self.lesson_variant1,
        ).replace(
            self.lesson_variant1.slug,
            "not-a-real-lesson-variant",
        )

        response = self.client.get(invalid_url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_with_mismatched_subject_and_lesson_variant_returns_404(self):
        self.authenticate_admin()

        invalid_url = self.get_lesson_variant_resource_create_url(
            self.subject1,
            self.lesson_variant1,
        ).replace(
            str(self.subject1.subject_id),
            str(self.subject2.subject_id),
        )

        response = self.client.get(invalid_url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # =====================
    # GET - Response Structure
    # =====================

    def test_get_response_contains_expected_fields(self):
        self.authenticate_admin()

        response = self.client.get(self.create_url)

        expected_fields = {
            "subject",
            "lesson_variant",
            "lesson_name",
        }

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(set(response.data.keys()), expected_fields)

    # =====================
    # GET - Response Values
    # =====================

    def test_get_response_values_match_database_records(self):
        self.authenticate_admin()

        response = self.client.get(self.create_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["subject"], self.subject1.title)
        self.assertEqual(
            response.data["lesson_variant"],
            str(self.lesson_variant1.lesson_variant_id),
        )
        self.assertEqual(response.data["lesson_name"], self.lesson_name1.title)

    # =====================
    # POST - Permissions
    # =====================

    def test_admin_can_create_resource_for_lesson_variant(self):
        self.authenticate_admin()
        payload = self.get_resource_payload()

        response = self.client.post(self.create_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_authenticated_non_admin_cannot_create_resource_for_lesson_variant(self):
        self.authenticate_user()
        payload = self.get_resource_payload()

        response = self.client.post(self.create_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(models.Resource.objects.count(), 3)
        self.assertEqual(models.LessonVariantResource.objects.count(), 2)

    def test_unauthenticated_user_cannot_create_resource_for_lesson_variant(self):
        payload = self.get_resource_payload()

        response = self.client.post(self.create_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(models.Resource.objects.count(), 3)
        self.assertEqual(models.LessonVariantResource.objects.count(), 2)

    # =====================
    # POST - Object Lookup
    # =====================

    def test_valid_subject_and_lesson_variant_lookup_allows_creation(self):
        self.authenticate_admin()
        payload = self.get_resource_payload()

        response = self.client.post(self.create_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_post_with_invalid_subject_id_returns_404(self):
        self.authenticate_admin()

        invalid_url = self.get_lesson_variant_resource_create_url(
            self.subject1,
            self.lesson_variant1,
        ).replace(
            str(self.subject1.subject_id),
            "00000000-0000-0000-0000-000000000000",
        )

        payload = self.get_resource_payload()

        response = self.client.post(invalid_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(models.Resource.objects.count(), 3)
        self.assertEqual(models.LessonVariantResource.objects.count(), 2)

    def test_post_with_invalid_subject_slug_still_creates_when_id_is_valid(self):
        self.authenticate_admin()

        invalid_url = self.get_lesson_variant_resource_create_url(
            self.subject1,
            self.lesson_variant1,
        ).replace(
            self.subject1.slug,
            "not-a-real-subject",
        )

        payload = self.get_resource_payload(title="Decimals Worksheet")

        response = self.client.post(invalid_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(models.Resource.objects.count(), 4)
        self.assertEqual(models.LessonVariantResource.objects.count(), 3)

    def test_post_with_invalid_lesson_variant_id_returns_404(self):
        self.authenticate_admin()

        invalid_url = self.get_lesson_variant_resource_create_url(
            self.subject1,
            self.lesson_variant1,
        ).replace(
            str(self.lesson_variant1.lesson_variant_id),
            "00000000-0000-0000-0000-000000000000",
        )

        payload = self.get_resource_payload()

        response = self.client.post(invalid_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(models.Resource.objects.count(), 3)
        self.assertEqual(models.LessonVariantResource.objects.count(), 2)

    def test_post_with_invalid_lesson_variant_slug_returns_404(self):
        self.authenticate_admin()

        invalid_url = self.get_lesson_variant_resource_create_url(
            self.subject1,
            self.lesson_variant1,
        ).replace(
            self.lesson_variant1.slug,
            "not-a-real-lesson-variant",
        )

        payload = self.get_resource_payload()

        response = self.client.post(invalid_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(models.Resource.objects.count(), 3)
        self.assertEqual(models.LessonVariantResource.objects.count(), 2)

    def test_post_with_mismatched_subject_and_lesson_variant_returns_404(self):
        self.authenticate_admin()

        invalid_url = self.get_lesson_variant_resource_create_url(
            self.subject1,
            self.lesson_variant1,
        ).replace(
            str(self.subject1.subject_id),
            str(self.subject2.subject_id),
        )

        payload = self.get_resource_payload()

        response = self.client.post(invalid_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(models.Resource.objects.count(), 3)
        self.assertEqual(models.LessonVariantResource.objects.count(), 2)

    # =====================
    # POST - Payloads
    # =====================

    def test_valid_payload_creates_resource_successfully(self):
        self.authenticate_admin()
        payload = self.get_resource_payload(title="Decimals Worksheet")

        response = self.client.post(self.create_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(models.Resource.objects.count(), 4)
        self.assertEqual(models.LessonVariantResource.objects.count(), 3)

        resource = models.Resource.objects.get(title="Decimals Worksheet")
        link = models.LessonVariantResource.objects.get(
            lesson_variant=self.lesson_variant1,
            resource=resource,
        )

        self.assertEqual(resource.title, payload["title"])
        self.assertEqual(resource.category, payload["category"])
        self.assertEqual(resource.description, payload["description"])
        self.assertEqual(resource.url, payload["url"])
        self.assertEqual(link.order, payload["order"])

    def test_missing_required_fields_returns_400(self):
        self.authenticate_admin()

        payload = {
            "description": "Missing title and category",
        }

        response = self.client.post(self.create_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("title", response.data)
        self.assertIn("category", response.data)
        self.assertEqual(models.Resource.objects.count(), 3)
        self.assertEqual(models.LessonVariantResource.objects.count(), 2)

    def test_invalid_payload_returns_validation_errors(self):
        self.authenticate_admin()

        payload = {
            "title": "",
            "category": "",
            "description": "Bad payload",
            "url": "not-a-valid-url",
        }

        response = self.client.post(self.create_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("title", response.data)
        self.assertIn("category", response.data)
        self.assertIn("url", response.data)
        self.assertEqual(models.Resource.objects.count(), 3)
        self.assertEqual(models.LessonVariantResource.objects.count(), 2)

    def test_order_defaults_to_0_when_omitted(self):
        self.authenticate_admin()

        payload = self.get_resource_payload(title="Decimals Worksheet")
        payload.pop("order")

        response = self.client.post(self.create_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        resource = models.Resource.objects.get(title="Decimals Worksheet")
        link = models.LessonVariantResource.objects.get(
            lesson_variant=self.lesson_variant1,
            resource=resource,
        )

        self.assertEqual(link.order, 0)

    # =====================
    # POST - Business Rules
    # =====================

    def test_author_is_set_from_authenticated_user(self):
        self.authenticate_admin()
        payload = self.get_resource_payload(title="Decimals Worksheet")

        self.client.post(self.create_url, payload, format="json")

        resource = models.Resource.objects.get(title="Decimals Worksheet")

        self.assertEqual(resource.author, self.superuser)

    def test_lesson_variant_resource_link_is_created(self):
        self.authenticate_admin()
        payload = self.get_resource_payload(title="Decimals Worksheet")

        self.client.post(self.create_url, payload, format="json")

        resource = models.Resource.objects.get(title="Decimals Worksheet")

        self.assertTrue(
            models.LessonVariantResource.objects.filter(
                lesson_variant=self.lesson_variant1,
                resource=resource,
            ).exists()
        )

    def test_created_link_stores_submitted_order(self):
        self.authenticate_admin()
        payload = self.get_resource_payload(title="Decimals Worksheet", order=7)

        self.client.post(self.create_url, payload, format="json")

        resource = models.Resource.objects.get(title="Decimals Worksheet")
        link = models.LessonVariantResource.objects.get(
            lesson_variant=self.lesson_variant1,
            resource=resource,
        )

        self.assertEqual(link.order, 7)

    def test_resource_slug_is_generated_correctly(self):
        self.authenticate_admin()
        payload = self.get_resource_payload(title="Decimals Worksheet")

        self.client.post(self.create_url, payload, format="json")

        resource = models.Resource.objects.get(title="Decimals Worksheet")

        self.assertEqual(resource.slug, "decimals-worksheet")

    # =====================
    # POST - Response Structure
    # =====================

    def test_create_response_returns_expected_fields(self):
        self.authenticate_admin()
        payload = self.get_resource_payload(title="Decimals Worksheet")

        response = self.client.post(self.create_url, payload, format="json")

        expected_fields = {
            "resource",
            "order",
        }

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(set(response.data.keys()), expected_fields)

    def test_create_response_returns_nested_resource_data(self):
        self.authenticate_admin()
        payload = self.get_resource_payload(title="Decimals Worksheet")

        response = self.client.post(self.create_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIsInstance(response.data["resource"], dict)

    # =====================
    # POST - Response Values
    # =====================

    def test_create_response_returns_expected_values(self):
        self.authenticate_admin()
        payload = self.get_resource_payload(title="Decimals Worksheet", order=5)

        response = self.client.post(self.create_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["order"], 5)
        self.assertEqual(response.data["resource"]["title"], payload["title"])
        self.assertEqual(response.data["resource"]["category"], payload["category"])
        self.assertEqual(
            response.data["resource"]["description"],
            payload["description"],
        )
        self.assertEqual(response.data["resource"]["url"], payload["url"])


class LessonVariantResourceAttachViewTests(BaseLessonVariantResourceTestCase):
    """
    ATTACH VIEW TEST CHECKLIST
    --------------------------
    Create - Permissions
    - Verify ADMIN users can attach a resource and receive 201 CREATED
    - Verify UNAUTHORISED users cannot attach a resource and receive 403 FORBIDDEN
    - Verify UNAUTHENTICATED users cannot attach a resource and receive 403 FORBIDDEN
    --------------------------
    Create - Object Lookup
    - Verify valid lesson variant lookup allows attach
    - Verify invalid subject ID returns 404 NOT FOUND
    - Verify invalid lesson variant ID returns 404 NOT FOUND
    - Verify mismatched subject and lesson variant returns 404 NOT FOUND
    --------------------------
    Create - Payloads
    - Verify valid payload attaches resource successfully
    - Verify missing resource field returns 400 BAD REQUEST
    - Verify invalid resource ID returns 400 BAD REQUEST
    - Verify resource outside subject queryset returns 400 BAD REQUEST
    - Verify already attached resource returns 400 BAD REQUEST
    --------------------------
    Create - Business Rules
    - Verify lesson variant resource link is created
    - Verify attached resource belongs to requested lesson variant
    - Verify attached resource keeps default order value
    - Verify duplicate attach is blocked
    --------------------------
    Create - Response Structure
    - Verify expected fields are present in create response
    - Verify nested resource data is returned
    --------------------------
    Create - Response Values
    - Verify returned values match created database record
    """

    # =====================
    # Create - Permissions
    # =====================

    def test_admin_can_attach_resource(self):
        self.authenticate_admin()
        payload = self.get_attach_payload()

        response = self.client.post(self.attach_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_authenticated_non_admin_cannot_attach_resource(self):
        self.authenticate_user()
        payload = self.get_attach_payload()

        response = self.client.post(self.attach_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertFalse(
            models.LessonVariantResource.objects.filter(
                lesson_variant=self.lesson_variant1,
                resource=self.unattached_resource,
            ).exists()
        )

    def test_unauthenticated_user_cannot_attach_resource(self):
        payload = self.get_attach_payload()

        response = self.client.post(self.attach_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertFalse(
            models.LessonVariantResource.objects.filter(
                lesson_variant=self.lesson_variant1,
                resource=self.unattached_resource,
            ).exists()
        )

    # =====================
    # Create - Object Lookup
    # =====================

    def test_valid_lesson_variant_lookup_allows_attach(self):
        self.authenticate_admin()
        payload = self.get_attach_payload()

        response = self.client.post(self.attach_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_invalid_subject_id_returns_404(self):
        self.authenticate_admin()

        invalid_url = reverse(
            "lesson-variant-resource-attach",
            kwargs={
                "subject_slug": self.subject1.slug,
                "subject_id": "00000000-0000-0000-0000-000000000000",
                "lesson_variant_slug": self.lesson_variant1.slug,
                "lesson_variant_id": self.lesson_variant1.lesson_variant_id,
            },
        )

        response = self.client.post(
            invalid_url, self.get_attach_payload(), format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_invalid_lesson_variant_id_returns_404(self):
        self.authenticate_admin()

        invalid_url = reverse(
            "lesson-variant-resource-attach",
            kwargs={
                "subject_slug": self.subject1.slug,
                "subject_id": self.subject1.subject_id,
                "lesson_variant_slug": self.lesson_variant1.slug,
                "lesson_variant_id": "00000000-0000-0000-0000-000000000000",
            },
        )

        response = self.client.post(
            invalid_url, self.get_attach_payload(), format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_mismatched_subject_and_lesson_variant_returns_404(self):
        self.authenticate_admin()

        invalid_url = reverse(
            "lesson-variant-resource-attach",
            kwargs={
                "subject_slug": self.subject2.slug,
                "subject_id": self.subject2.subject_id,
                "lesson_variant_slug": self.lesson_variant1.slug,
                "lesson_variant_id": self.lesson_variant1.lesson_variant_id,
            },
        )

        response = self.client.post(
            invalid_url, self.get_attach_payload(), format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # =====================
    # Create - Payloads
    # =====================

    def test_valid_payload_attaches_resource_successfully(self):
        self.authenticate_admin()

        response = self.client.post(
            self.attach_url, self.get_attach_payload(), format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(
            models.LessonVariantResource.objects.filter(
                lesson_variant=self.lesson_variant1,
                resource=self.unattached_resource,
            ).exists()
        )

    def test_missing_resource_field_returns_400(self):
        self.authenticate_admin()

        response = self.client.post(self.attach_url, {}, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("resource", response.data)

    def test_invalid_resource_id_returns_400(self):
        self.authenticate_admin()

        payload = {"resource": "00000000-0000-0000-0000-000000000000"}

        response = self.client.post(self.attach_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("resource", response.data)

    def test_resource_outside_subject_queryset_returns_400(self):
        self.authenticate_admin()

        payload = {"resource": str(self.resource2.resource_id)}

        response = self.client.post(self.attach_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("resource", response.data)

    def test_already_attached_resource_returns_400(self):
        self.authenticate_admin()

        payload = {"resource": str(self.resource1.resource_id)}

        response = self.client.post(self.attach_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("resource", response.data)

    # =====================
    # Create - Business Rules
    # =====================

    def test_lesson_variant_resource_link_is_created(self):
        self.authenticate_admin()

        self.client.post(self.attach_url, self.get_attach_payload(), format="json")

        self.assertTrue(
            models.LessonVariantResource.objects.filter(
                lesson_variant=self.lesson_variant1,
                resource=self.unattached_resource,
            ).exists()
        )

    def test_attached_resource_belongs_to_requested_lesson_variant(self):
        self.authenticate_admin()

        self.client.post(self.attach_url, self.get_attach_payload(), format="json")

        link = models.LessonVariantResource.objects.get(
            lesson_variant=self.lesson_variant1,
            resource=self.unattached_resource,
        )

        self.assertEqual(link.lesson_variant, self.lesson_variant1)
        self.assertEqual(link.resource, self.unattached_resource)

    def test_attached_resource_keeps_default_order_value(self):
        self.authenticate_admin()

        self.client.post(self.attach_url, self.get_attach_payload(), format="json")

        link = models.LessonVariantResource.objects.get(
            lesson_variant=self.lesson_variant1,
            resource=self.unattached_resource,
        )

        self.assertEqual(link.order, 0)

    def test_duplicate_attach_is_blocked(self):
        self.authenticate_admin()

        payload = {"resource": str(self.resource1.resource_id)}

        response = self.client.post(self.attach_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            models.LessonVariantResource.objects.filter(
                lesson_variant=self.lesson_variant1,
                resource=self.resource1,
            ).count(),
            1,
        )

    # =====================
    # Create - Response Structure
    # =====================

    def test_create_response_returns_expected_fields(self):
        self.authenticate_admin()

        response = self.client.post(
            self.attach_url, self.get_attach_payload(), format="json"
        )

        expected_fields = {"resource", "order"}

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(set(response.data.keys()), expected_fields)

    def test_create_response_returns_nested_resource_data(self):
        self.authenticate_admin()

        response = self.client.post(
            self.attach_url, self.get_attach_payload(), format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIsInstance(response.data["resource"], dict)

    # =====================
    # Create - Response Values
    # =====================

    def test_create_response_returns_expected_values(self):
        self.authenticate_admin()

        response = self.client.post(
            self.attach_url, self.get_attach_payload(), format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["order"], 0)
        self.assertEqual(
            response.data["resource"]["resource_id"],
            str(self.unattached_resource.resource_id),
        )
        self.assertEqual(
            response.data["resource"]["title"],
            self.unattached_resource.title,
        )
        self.assertEqual(
            response.data["resource"]["category"],
            self.unattached_resource.category,
        )
