from django.db import IntegrityError
from django.utils.text import slugify

from ..base import BaseAPITestCase
from ... import models


class TeachingStyleModelTests(BaseAPITestCase):
    """
    TEACHING STYLE MODEL TEST CHECKLIST
    ------------------
    Field / Save Behaviour
    - Verify slug is generated automatically when a teaching style is created
    ------------------
    Model Meta
    - Verify teaching styles are ordered by title
    - Verify duplicate teaching style titles are not allowed
    """

    # =====================
    # Field / Save Behaviour
    # =====================

    def test_teaching_style_slug_is_generated_on_create(self):
        """
        Arrange: Prepare a teaching style without manually setting a slug.
        Act: Create the teaching style.
        Assert: The slug is generated from the teaching style title.
        """
        teaching_style = models.TeachingStyle.objects.create(
            title="Demonstration",
            is_protected=False,
        )

        expected_slug = slugify("Demonstration")

        self.assertEqual(teaching_style.slug, expected_slug)

    # =====================
    # Model Meta
    # =====================

    def test_teaching_styles_are_ordered_by_title(self):
        """
        Arrange: Use the default teaching style records from the base test setup.
        Act: Retrieve all teaching styles from the database.
        Assert: Teaching styles are returned in title order.
        """
        teaching_styles = models.TeachingStyle.objects.all()

        titles = [teaching_style.title for teaching_style in teaching_styles]

        self.assertEqual(titles, sorted(titles))

    def test_duplicate_teaching_style_title_raises_integrity_error(self):
        """
        Arrange: Use an existing teaching style title.
        Act: Attempt to create another teaching style with the same title.
        Assert: An IntegrityError is raised because teaching style titles must be unique.
        """
        with self.assertRaises(IntegrityError):
            models.TeachingStyle.objects.create(
                title=self.teaching_style1.title,
                is_protected=False,
            )
