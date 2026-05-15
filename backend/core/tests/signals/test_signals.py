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


class TopicCacheInvalidationSignalTests(BaseAPITestCase):
    """
    TOPIC CACHE INVALIDATION SIGNAL TEST CHECKLIST
    ------------------
    Topic - Create
    - Verify creating a Topic clears the topic list cache
    ------------------
    Topic - Update
    - Verify updating a Topic clears the topic list cache
    ------------------
    Topic - Delete
    - Verify deleting a Topic clears the topic list cache
    """

    @patch("core.signals.cache.delete_pattern")
    def test_topic_create_clears_topic_list_cache(self, mock_delete_pattern):
        """
        Arrange:
        - Patch the cache delete_pattern method.

        Act:
        - Create a new Topic record.
        - Assign the Topic to a Subject.

        Assert:
        - The topic list cache invalidation pattern is called once.
        """
        topic = models.Topic.objects.create(
            title="Geometry",
            is_protected=False,
        )
        topic.subjects.set([self.subject1])

        mock_delete_pattern.assert_called_once_with("*topic_list:*")

    @patch("core.signals.cache.delete_pattern")
    def test_topic_update_clears_topic_list_cache(self, mock_delete_pattern):
        """
        Arrange:
        - Use an existing Topic record from the base test setup.
        - Patch the cache delete_pattern method.

        Act:
        - Update and save the Topic record.

        Assert:
        - The topic list cache invalidation pattern is called once.
        """
        self.topic1.title = "Updated Algebra"
        self.topic1.save()

        mock_delete_pattern.assert_called_once_with("*topic_list:*")

    @patch("core.signals.cache.delete_pattern")
    def test_topic_delete_clears_topic_list_cache(self, mock_delete_pattern):
        """
        Arrange:
        - Use an existing Topic record from the base test setup.
        - Patch the cache delete_pattern method.

        Act:
        - Delete the Topic record.

        Assert:
        - The topic list cache invalidation pattern is called once.
        """
        self.topic1.delete()

        mock_delete_pattern.assert_called_once_with("*topic_list:*")


class LessonNameCacheInvalidationSignalTests(BaseAPITestCase):
    """
    LESSON NAME CACHE INVALIDATION SIGNAL TEST CHECKLIST
    ------------------
    Lesson Name - Create
    - Verify creating a LessonName clears the lesson name list cache
    ------------------
    Lesson Name - Update
    - Verify updating a LessonName clears the lesson name list cache
    ------------------
    Lesson Name - Delete
    - Verify deleting a LessonName clears the lesson name list cache
    """

    @patch("core.signals.cache.delete_pattern")
    def test_lesson_name_create_clears_lesson_name_list_cache(
        self, mock_delete_pattern
    ):
        """
        Arrange:
        - Patch the cache delete_pattern method.

        Act:
        - Create a new LessonName record.
        - Assign the LessonName to a Subject.

        Assert:
        - The lesson name list cache invalidation pattern is called once.
        """
        lesson_name = models.LessonName.objects.create(
            title="Quadratic Equations",
            is_protected=False,
        )
        lesson_name.subjects.set([self.subject1])

        mock_delete_pattern.assert_called_once_with("*lesson_name_list:*")

    @patch("core.signals.cache.delete_pattern")
    def test_lesson_name_update_clears_lesson_name_list_cache(
        self, mock_delete_pattern
    ):
        """
        Arrange:
        - Use an existing LessonName record from the base test setup.
        - Patch the cache delete_pattern method.

        Act:
        - Update and save the LessonName record.

        Assert:
        - The lesson name list cache invalidation pattern is called once.
        """
        self.lesson_name1.title = "Updated Linear Equations"
        self.lesson_name1.save()

        mock_delete_pattern.assert_called_once_with("*lesson_name_list:*")

    @patch("core.signals.cache.delete_pattern")
    def test_lesson_name_delete_clears_lesson_name_list_cache(
        self, mock_delete_pattern
    ):
        """
        Arrange:
        - Use an existing LessonName record from the base test setup.
        - Patch the cache delete_pattern method.

        Act:
        - Delete the LessonName record.

        Assert:
        - The lesson name list cache invalidation pattern is called once.
        """
        self.lesson_name1.delete()

        mock_delete_pattern.assert_called_once_with("*lesson_name_list:*")


class TeachingStyleCacheInvalidationSignalTests(BaseAPITestCase):
    """
    TEACHING STYLE CACHE INVALIDATION SIGNAL TEST CHECKLIST
    ------------------
    Teaching Style - Create
    - Verify creating a TeachingStyle clears the teaching style list cache
    ------------------
    Teaching Style - Update
    - Verify updating a TeachingStyle clears the teaching style list cache
    ------------------
    Teaching Style - Delete
    - Verify deleting a TeachingStyle clears the teaching style list cache
    """

    @patch("core.signals.cache.delete_pattern")
    def test_teaching_style_create_clears_teaching_style_list_cache(
        self, mock_delete_pattern
    ):
        """
        Arrange: Patch the cache delete_pattern method.
        Act: Create a new TeachingStyle record.
        Assert: The teaching style list cache is invalidated once.
        """
        models.TeachingStyle.objects.create(
            title="Modelling",
            is_protected=False,
        )

        mock_delete_pattern.assert_called_once_with("*teaching_style_list*")

    @patch("core.signals.cache.delete_pattern")
    def test_teaching_style_update_clears_teaching_style_list_cache(
        self, mock_delete_pattern
    ):
        """
        Arrange: Use an existing TeachingStyle record from the base test setup.
        Act: Update and save the TeachingStyle record.
        Assert: The teaching style list cache is invalidated once.
        """
        self.teaching_style1.title = "Updated Lecture"
        self.teaching_style1.save()

        mock_delete_pattern.assert_called_once_with("*teaching_style_list*")

    @patch("core.signals.cache.delete_pattern")
    def test_teaching_style_delete_clears_teaching_style_list_cache(
        self, mock_delete_pattern
    ):
        """
        Arrange: Use an existing TeachingStyle record from the base test setup.
        Act: Delete the TeachingStyle record.
        Assert: The teaching style list cache is invalidated once.
        """
        self.teaching_style1.delete()

        mock_delete_pattern.assert_called_once_with("*teaching_style_list*")


class VariationCacheInvalidationSignalTests(BaseAPITestCase):
    """
    VARIATION CACHE INVALIDATION SIGNAL TEST CHECKLIST
    ------------------
    Variation - Create
    - Verify creating a Variation clears the variation list cache
    ------------------
    Variation - Update
    - Verify updating a Variation clears the variation list cache
    ------------------
    Variation - Delete
    - Verify deleting a Variation clears the variation list cache
    """

    @patch("core.signals.cache.delete_pattern")
    def test_variation_create_clears_variation_list_cache(self, mock_delete_pattern):
        """
        Arrange: Patch the cache delete_pattern method.
        Act: Create a new Variation record.
        Assert: The variation list cache is invalidated once.
        """
        models.Variation.objects.create(
            title="Exam Practice",
            is_protected=False,
        )

        mock_delete_pattern.assert_called_once_with("*variation_list*")

    @patch("core.signals.cache.delete_pattern")
    def test_variation_update_clears_variation_list_cache(self, mock_delete_pattern):
        """
        Arrange: Use an existing Variation record from the base test setup.
        Act: Update and save the Variation record.
        Assert: The variation list cache is invalidated once.
        """
        self.variation1.title = "Updated Foundation"
        self.variation1.save()

        mock_delete_pattern.assert_called_once_with("*variation_list*")

    @patch("core.signals.cache.delete_pattern")
    def test_variation_delete_clears_variation_list_cache(self, mock_delete_pattern):
        """
        Arrange: Use an existing Variation record from the base test setup.
        Act: Delete the Variation record.
        Assert: The variation list cache is invalidated once.
        """
        self.variation1.delete()

        mock_delete_pattern.assert_called_once_with("*variation_list*")
