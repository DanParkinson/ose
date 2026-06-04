from unittest.mock import patch

from core import models
from core.tests.base import BaseAPITestCase


class SubjectCacheInvalidationSignalTests(BaseAPITestCase):
    """
    SUBJECT CACHE INVALIDATION SIGNAL TEST CHECKLIST
    ------------------
    Subject - Create
    - Verify creating a Subject clears the subject list cache
    ------------------
    Subject - Update
    - Verify updating a Subject clears the subject list cache
    ------------------
    Subject - Delete
    - Verify deleting a Subject clears the subject list cache
    """

    @patch("core.signals.cache.delete_pattern")
    def test_subject_create_clears_subject_list_cache(self, mock_delete_pattern):
        """
        Arrange:
        - Patch the cache delete_pattern method.

        Act:
        - Create a new Subject record.

        Assert:
        - The subject list cache invalidation pattern is called once.
        """
        models.Subject.objects.create(
            title="Science",
            level="secondary",
            language="en",
            is_published=True,
            is_protected=False,
        )

        mock_delete_pattern.assert_called_once_with("*subject_list:*")

    @patch("core.signals.cache.delete_pattern")
    def test_subject_update_clears_subject_list_cache(self, mock_delete_pattern):
        """
        Arrange:
        - Use an existing Subject record from the base test setup.
        - Patch the cache delete_pattern method.

        Act:
        - Update and save the Subject record.

        Assert:
        - The subject list cache invalidation pattern is called once.
        """
        self.subject1.title = "Updated Mathematics"
        self.subject1.save()

        mock_delete_pattern.assert_called_once_with("*subject_list:*")

    @patch("core.signals.cache.delete_pattern")
    def test_subject_delete_clears_subject_list_cache(self, mock_delete_pattern):
        """
        Arrange:
        - Use an existing Subject record from the base test setup.
        - Patch the cache delete_pattern method.

        Act:
        - Delete the Subject record.

        Assert:
        - The subject list cache invalidation pattern is called once.
        """
        self.subject1.delete()

        mock_delete_pattern.assert_called_once_with("*subject_list:*")
