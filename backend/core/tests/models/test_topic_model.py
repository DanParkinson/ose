from django.db import IntegrityError
from django.utils.text import slugify

from ..base import BaseAPITestCase
from ... import models


class TopicModelTests(BaseAPITestCase):
    """
    TOPIC MODEL TEST CHECKLIST
    ------------------
    Field / Save Behaviour
    - Verify slug is generated automatically when a topic is created
    ------------------
    Model Meta
    - Verify topics are ordered by title
    - Verify duplicate topic titles are not allowed
    ------------------
    Relationships
    - Verify topic can be assigned to a subject
    - Verify topic can be assigned to multiple subjects
    """

    # =====================
    # Field / Save Behaviour
    # =====================

    def test_topic_slug_is_generated_on_create(self):
        """
        Arrange: Prepare a topic without manually setting a slug.
        Act: Create the topic.
        Assert: The slug is generated from the topic title.
        """
        topic = models.Topic.objects.create(
            title="Geometry",
            is_protected=False,
        )

        expected_slug = slugify("Geometry")

        self.assertEqual(topic.slug, expected_slug)

    # =====================
    # Model Meta
    # =====================

    def test_topics_are_ordered_by_title(self):
        """
        Arrange: Use the default topic records from the base test setup.
        Act: Retrieve all topics from the database.
        Assert: Topics are returned in title order.
        """
        topics = models.Topic.objects.all()

        titles = [topic.title for topic in topics]

        self.assertEqual(titles, sorted(titles))

    def test_duplicate_topic_title_raises_integrity_error(self):
        """
        Arrange: Use an existing topic title.
        Act: Attempt to create another topic with the same title.
        Assert: An IntegrityError is raised because topic titles must be unique.
        """
        with self.assertRaises(IntegrityError):
            models.Topic.objects.create(
                title=self.topic1.title,
                is_protected=False,
            )

    # =====================
    # Relationships
    # =====================

    def test_topic_can_be_assigned_to_subject(self):
        """
        Arrange: Create a topic and use an existing subject.
        Act: Assign the subject to the topic.
        Assert: The topic is linked to the expected subject.
        """
        topic = models.Topic.objects.create(
            title="Fractions",
            is_protected=False,
        )

        topic.subjects.set([self.subject1])

        self.assertIn(self.subject1, topic.subjects.all())

    def test_topic_can_be_assigned_to_multiple_subjects(self):
        """
        Arrange: Create a topic and use multiple existing subjects.
        Act: Assign both subjects to the topic.
        Assert: The topic is linked to all assigned subjects.
        """
        topic = models.Topic.objects.create(
            title="Reading",
            is_protected=False,
        )

        topic.subjects.set([self.subject1, self.subject2])

        self.assertEqual(topic.subjects.count(), 2)
        self.assertIn(self.subject1, topic.subjects.all())
        self.assertIn(self.subject2, topic.subjects.all())
