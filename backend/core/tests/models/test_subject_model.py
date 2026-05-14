from django.db import IntegrityError
from django.utils.text import slugify

from ..base import BaseAPITestCase
from ... import models


class SubjectModelTests(BaseAPITestCase):
    """
    SUBJECT MODEL TEST CHECKLIST
    ------------------
    Field / Save Behaviour
    - Verify slug is generated automatically when a subject is created
    ------------------
    Model Meta
    - Verify subjects are ordered by title
    - Verify duplicate title, level, and language combinations are not allowed
    """

    # =====================
    # Field / Save Behaviour
    # =====================

    def test_subject_slug_is_generated_on_create(self):
        """
        Arrange: Prepare a subject without manually setting a slug.
        Act: Create the subject.
        Assert: The slug is generated from title, level, and language.
        """
        subject = models.Subject.objects.create(
            title="Computer Science",
            level="secondary",
            language="en",
            is_published=True,
            is_protected=False,
        )

        expected_slug = slugify("Computer Science-secondary-en")

        self.assertEqual(subject.slug, expected_slug)

    # =====================
    # Model Meta
    # =====================

    def test_subjects_are_ordered_by_title(self):
        """
        Arrange: Use the default subject records from the base test setup.
        Act: Retrieve all subjects from the database.
        Assert: Subjects are returned in title order.
        """
        subjects = models.Subject.objects.all()

        titles = [subject.title for subject in subjects]

        self.assertEqual(titles, sorted(titles))

    def test_duplicate_title_level_language_combination_raises_integrity_error(self):
        """
        Arrange: Use an existing subject's title, level, and language.
        Act: Attempt to create another subject with the same title, level, and language.
        Assert: An IntegrityError is raised because the combination must be unique.
        """
        with self.assertRaises(IntegrityError):
            models.Subject.objects.create(
                title=self.subject1.title,
                level=self.subject1.level,
                language=self.subject1.language,
                is_published=True,
                is_protected=False,
            )

    def test_same_title_with_different_level_is_allowed(self):
        """
        Arrange: Use an existing subject title with a different level.
        Act: Create a subject with the same title but different level.
        Assert: The subject is created successfully because the unique constraint includes level.
        """
        subject = models.Subject.objects.create(
            title=self.subject1.title,
            level="primary",
            language=self.subject1.language,
            is_published=True,
            is_protected=False,
        )

        self.assertEqual(subject.title, self.subject1.title)
        self.assertEqual(subject.level, "primary")
