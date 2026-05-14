from django.db import IntegrityError
from django.utils.text import slugify

from ..base import BaseAPITestCase
from ... import models


class LessonNameModelTests(BaseAPITestCase):
    """
    LESSON NAME MODEL TEST CHECKLIST
    ------------------
    Field / Save Behaviour
    - Verify slug is generated automatically when a lesson name is created
    ------------------
    Model Meta
    - Verify lesson names are ordered by title
    - Verify duplicate lesson name titles are not allowed
    ------------------
    Relationships
    - Verify lesson name can be assigned to a subject
    - Verify lesson name can be assigned to multiple subjects
    """

    # =====================
    # Field / Save Behaviour
    # =====================

    def test_lesson_name_slug_is_generated_on_create(self):
        """
        Arrange: Prepare a lesson name without manually setting a slug.
        Act: Create the lesson name.
        Assert: The slug is generated from the lesson name title.
        """
        lesson_name = models.LessonName.objects.create(
            title="Quadratic Formula",
            is_protected=False,
        )

        expected_slug = slugify("Quadratic Formula")

        self.assertEqual(lesson_name.slug, expected_slug)

    # =====================
    # Model Meta
    # =====================

    def test_lesson_names_are_ordered_by_title(self):
        """
        Arrange: Use the default lesson name records from the base test setup.
        Act: Retrieve all lesson names from the database.
        Assert: Lesson names are returned in title order.
        """
        lesson_names = models.LessonName.objects.all()

        titles = [lesson_name.title for lesson_name in lesson_names]

        self.assertEqual(titles, sorted(titles))

    def test_duplicate_lesson_name_title_raises_integrity_error(self):
        """
        Arrange: Use an existing lesson name title.
        Act: Attempt to create another lesson name with the same title.
        Assert: An IntegrityError is raised because lesson name titles must be unique.
        """
        with self.assertRaises(IntegrityError):
            models.LessonName.objects.create(
                title=self.lesson_name1.title,
                is_protected=False,
            )

    # =====================
    # Relationships
    # =====================

    def test_lesson_name_can_be_assigned_to_subject(self):
        """
        Arrange: Create a lesson name and use an existing subject.
        Act: Assign the subject to the lesson name.
        Assert: The lesson name is linked to the expected subject.
        """
        lesson_name = models.LessonName.objects.create(
            title="Decimals",
            is_protected=False,
        )

        lesson_name.subjects.set([self.subject1])

        self.assertIn(self.subject1, lesson_name.subjects.all())

    def test_lesson_name_can_be_assigned_to_multiple_subjects(self):
        """
        Arrange: Create a lesson name and use multiple existing subjects.
        Act: Assign both subjects to the lesson name.
        Assert: The lesson name is linked to all assigned subjects.
        """
        lesson_name = models.LessonName.objects.create(
            title="Comprehension",
            is_protected=False,
        )

        lesson_name.subjects.set([self.subject1, self.subject2])

        self.assertEqual(lesson_name.subjects.count(), 2)
        self.assertIn(self.subject1, lesson_name.subjects.all())
        self.assertIn(self.subject2, lesson_name.subjects.all())
