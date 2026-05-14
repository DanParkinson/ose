from django.db import IntegrityError
from django.utils.text import slugify

from ..base import BaseAPITestCase
from ... import models


class VariationModelTests(BaseAPITestCase):
    """
    VARIATION MODEL TEST CHECKLIST
    ------------------
    Field / Save Behaviour
    - Verify slug is generated automatically when a variation is created
    ------------------
    Model Meta
    - Verify variations are ordered by title
    - Verify duplicate variation titles are not allowed
    """

    # =====================
    # Field / Save Behaviour
    # =====================

    def test_variation_slug_is_generated_on_create(self):
        """
        Arrange: Prepare a variation without manually setting a slug.
        Act: Create the variation.
        Assert: The slug is generated from the variation title.
        """
        variation = models.Variation.objects.create(
            title="Intermediate",
            is_protected=False,
        )

        expected_slug = slugify("Intermediate")

        self.assertEqual(variation.slug, expected_slug)

    # =====================
    # Model Meta
    # =====================

    def test_variations_are_ordered_by_title(self):
        """
        Arrange: Use the default variation records from the base test setup.
        Act: Retrieve all variations from the database.
        Assert: Variations are returned in title order.
        """
        variations = models.Variation.objects.all()

        titles = [variation.title for variation in variations]

        self.assertEqual(titles, sorted(titles))

    def test_duplicate_variation_title_raises_integrity_error(self):
        """
        Arrange: Use an existing variation title.
        Act: Attempt to create another variation with the same title.
        Assert: An IntegrityError is raised because variation titles must be unique.
        """
        with self.assertRaises(IntegrityError):
            models.Variation.objects.create(
                title=self.variation1.title,
                is_protected=False,
            )
