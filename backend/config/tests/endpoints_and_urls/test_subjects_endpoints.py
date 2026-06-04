from django.test import SimpleTestCase
from django.urls import resolve

from core.api.views.subject_views import (
    SubjectListCreateView,
    SubjectDetailView,
)


class SubjectEndpointUrlTests(SimpleTestCase):
    """
    SUBJECT ENDPOINT URL TEST CHECKLIST
    -----------------------------------
    Subject List Endpoint
    - Verify subject list endpoint resolves
    - Verify subject list endpoint uses SubjectListCreateView

    -----------------------------------
    Subject Detail Endpoint
    - Verify subject detail endpoint resolves
    - Verify subject detail endpoint uses SubjectDetailView
    """

    # =====================
    # Subject List Endpoint
    # =====================

    def test_subject_list_endpoint_resolves(self):
        """
        Arrange: Define the documented subject list endpoint.

        Act: Resolve the URL.

        Assert: The endpoint exists in the URL configuration.
        """
        resolver = resolve("/core/subjects/")

        self.assertIsNotNone(resolver)

    def test_subject_list_endpoint_uses_correct_view(self):
        """
        Arrange: Define the documented subject list endpoint.

        Act: Resolve the URL.

        Assert: The endpoint maps to SubjectListCreateView.
        """
        resolver = resolve("/core/subjects/")

        self.assertEqual(
            resolver.func.view_class,
            SubjectListCreateView,
        )

    # =====================
    # Subject Detail Endpoint
    # =====================

    def test_subject_detail_endpoint_resolves(self):
        """
        Arrange: Define a subject detail endpoint.

        Act: Resolve the URL.

        Assert: The endpoint exists in the URL configuration.
        """
        resolver = resolve("/core/subjects/00000000-0000-0000-0000-000000000001/")

        self.assertIsNotNone(resolver)

    def test_subject_detail_endpoint_uses_correct_view(self):
        """
        Arrange: Define a subject detail endpoint.

        Act: Resolve the URL.

        Assert: The endpoint maps to SubjectDetailView.
        """
        resolver = resolve("/core/subjects/00000000-0000-0000-0000-000000000001/")

        self.assertEqual(
            resolver.func.view_class,
            SubjectDetailView,
        )
