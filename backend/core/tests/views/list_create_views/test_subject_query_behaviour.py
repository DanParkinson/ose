from rest_framework import status

from core.tests.base import BaseAPITestCase
from core.models import Subject


class SubjectListFilteringSearchPaginationTests(BaseAPITestCase):
    """
    SUBJECT LIST FILTERING, SEARCHING AND PAGINATION TEST CHECKLIST
    ---------------------------------------------------------------
    Pagination
    - Verify limit controls number of returned results
    - Verify offset skips earlier results
    - Verify count shows total records
    - Verify next appears when more results exist
    - Verify previous appears when offset is beyond first page

    ---------------------------------------------------------------
    Filtering
    - Verify filter by level
    - Verify filter by is_published
    - Verify filter by is_protected
    - Verify multiple filters can be combined

    ---------------------------------------------------------------
    Searching
    - Verify search by title
    - Verify search is case-insensitive
    - Verify search with no matches returns empty results
    - Verify search works with filters

    ---------------------------------------------------------------
    Edge Behaviour
    - Verify invalid filter value behaviour
    - Verify pagination works after filtering
    - Verify pagination works after searching
    """

    def setUp(self):
        super().setUp()

        Subject.objects.all().delete()

        self.maths = Subject.objects.create(
            title="Mathematics",
            level="secondary",
            language="en",
            is_published=True,
            is_protected=False,
        )

        self.english = Subject.objects.create(
            title="English",
            level="primary",
            language="en",
            is_published=True,
            is_protected=False,
        )

        self.french = Subject.objects.create(
            title="French",
            level="secondary",
            language="fr",
            is_published=False,
            is_protected=False,
        )

        self.science = Subject.objects.create(
            title="Science",
            level="secondary",
            language="en",
            is_published=True,
            is_protected=True,
        )

        self.history = Subject.objects.create(
            title="History",
            level="primary",
            language="en",
            is_published=False,
            is_protected=False,
        )

    def get_subject_list_url(self):
        return "/core/subjects/"

    # =====================
    # Pagination
    # =====================

    def test_limit_controls_number_of_returned_results(self):
        """
        Arrange: Create multiple subjects and set a limit query parameter.
        Act: Send a GET request to the subject list endpoint.
        Assert: Only the limited number of results is returned.
        """
        response = self.client.get(f"{self.get_subject_list_url()}?limit=2")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 2)

    def test_offset_skips_earlier_results(self):
        """
        Arrange: Create multiple subjects and request results with an offset.
        Act: Send a GET request to the subject list endpoint.
        Assert: The first returned result is not the first database record.
        """
        response_without_offset = self.client.get(
            f"{self.get_subject_list_url()}?limit=1"
        )
        response_with_offset = self.client.get(
            f"{self.get_subject_list_url()}?limit=1&offset=1"
        )

        first_result = response_without_offset.data["results"][0]["subject_id"]
        offset_result = response_with_offset.data["results"][0]["subject_id"]

        self.assertNotEqual(first_result, offset_result)

    def test_count_shows_total_records(self):
        """
        Arrange: Create multiple subjects.
        Act: Send a GET request to the subject list endpoint.
        Assert: The count value matches the total number of subjects.
        """
        response = self.client.get(self.get_subject_list_url())

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], Subject.objects.count())

    def test_next_appears_when_more_results_exist(self):
        """
        Arrange: Create more subjects than the requested limit.
        Act: Send a GET request with a small limit.
        Assert: The next pagination link is returned.
        """
        response = self.client.get(f"{self.get_subject_list_url()}?limit=2")

        self.assertIsNotNone(response.data["next"])

    def test_previous_appears_when_offset_is_beyond_first_page(self):
        """
        Arrange: Create multiple subjects and request an offset page.
        Act: Send a GET request with limit and offset.
        Assert: The previous pagination link is returned.
        """
        response = self.client.get(f"{self.get_subject_list_url()}?limit=2&offset=2")

        self.assertIsNotNone(response.data["previous"])

    # =====================
    # Filtering
    # =====================

    def test_filter_by_level(self):
        """
        Arrange: Create subjects with different levels.
        Act: Filter subjects by level.
        Assert: Only subjects with the requested level are returned.
        """
        response = self.client.get(f"{self.get_subject_list_url()}?level=primary")

        for subject in response.data["results"]:
            self.assertEqual(subject["level"], "primary")

    def test_filter_by_is_published(self):
        """
        Arrange: Create published and unpublished subjects.
        Act: Filter subjects by is_published.
        Assert: Only published subjects are returned.
        """
        response = self.client.get(f"{self.get_subject_list_url()}?is_published=true")

        for subject in response.data["results"]:
            self.assertTrue(subject["is_published"])

    def test_filter_by_is_protected(self):
        """
        Arrange: Create protected and unprotected subjects.
        Act: Filter subjects by is_protected.
        Assert: Only protected subjects are returned.
        """
        response = self.client.get(f"{self.get_subject_list_url()}?is_protected=true")

        for subject in response.data["results"]:
            self.assertTrue(subject["is_protected"])

    def test_combine_multiple_filters(self):
        """
        Arrange: Create subjects with different levels, languages, and publication states.
        Act: Apply multiple filters in one request.
        Assert: Returned subjects match all supplied filters.
        """
        response = self.client.get(
            f"{self.get_subject_list_url()}?level=secondary&language=en&is_published=true"
        )

        for subject in response.data["results"]:
            self.assertEqual(subject["level"], "secondary")
            self.assertEqual(subject["language"], "en")
            self.assertTrue(subject["is_published"])

    # =====================
    # Searching
    # =====================

    def test_search_by_title(self):
        """
        Arrange: Create subjects with different titles.
        Act: Search for a subject by title.
        Assert: Matching subject titles are returned.
        """
        response = self.client.get(f"{self.get_subject_list_url()}?search=Math")

        titles = [subject["title"] for subject in response.data["results"]]

        self.assertIn("Mathematics", titles)

    def test_search_is_case_insensitive(self):
        """
        Arrange: Create a subject with a mixed-case title.
        Act: Search using lowercase text.
        Assert: The matching subject is still returned.
        """
        response = self.client.get(f"{self.get_subject_list_url()}?search=mathematics")

        titles = [subject["title"] for subject in response.data["results"]]

        self.assertIn("Mathematics", titles)

    def test_search_with_no_matches_returns_empty_results(self):
        """
        Arrange: Create subjects that do not match the search term.
        Act: Search using a term with no matches.
        Assert: The results list is empty.
        """
        response = self.client.get(f"{self.get_subject_list_url()}?search=NoMatchHere")

        self.assertEqual(response.data["results"], [])

    def test_search_works_with_filters(self):
        """
        Arrange: Create subjects where search and filter narrow the result.
        Act: Search by title while also filtering by level.
        Assert: Returned subjects match the search term and filter.
        """
        response = self.client.get(
            f"{self.get_subject_list_url()}?search=Science&level=secondary"
        )

        self.assertEqual(len(response.data["results"]), 1)
        self.assertEqual(response.data["results"][0]["title"], "Science")
        self.assertEqual(response.data["results"][0]["level"], "secondary")

    # =====================
    # Edge Behaviour
    # =====================

    def test_invalid_filter_value_returns_bad_request(self):
        """
        Arrange: Create subjects with valid level values.
        Act: Filter using an invalid level value.
        Assert: The request fails because the filter value is invalid.
        """
        response = self.client.get(f"{self.get_subject_list_url()}?level=invalid-level")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_pagination_works_after_filtering(self):
        """
        Arrange: Create several subjects and apply a filter with pagination.
        Act: Send a GET request using filter and limit.
        Assert: The filtered response is paginated.
        """
        response = self.client.get(
            f"{self.get_subject_list_url()}?level=secondary&limit=1"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)
        self.assertEqual(response.data["results"][0]["level"], "secondary")

    def test_pagination_works_after_searching(self):
        """
        Arrange: Create searchable subjects and apply pagination.
        Act: Send a GET request using search and limit.
        Assert: The searched response is paginated.
        """
        response = self.client.get(f"{self.get_subject_list_url()}?search=e&limit=1")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)
        self.assertIsNotNone(response.data["count"])
