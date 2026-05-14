from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase

from .. import models


class BaseAPITestCase(APITestCase):
    def setUp(self):
        self.User = get_user_model()

        # ===========
        # Users
        # ===========
        self.user = self.User.objects.create_user(
            email="user@example.com",
            password="testpass123",
        )
        self.other_user = self.User.objects.create_user(
            email="otheruser@example.com",
            password="testpass123",
        )
        self.superuser = self.User.objects.create_superuser(
            email="admin@example.com",
            password="testpass123",
        )

        # ===========
        # Subjects
        # ===========
        self.subject1 = models.Subject.objects.create(
            title="Mathematics",
            level="secondary",
            language="en",
            is_published=True,
            is_protected=False,
        )
        self.subject2 = models.Subject.objects.create(
            title="English",
            level="primary",
            language="en",
            is_published=False,
            is_protected=True,
        )

        # ===========
        # Topics
        # ===========
        self.topic1 = models.Topic.objects.create(
            title="Algebra",
            is_protected=False,
        )
        self.topic2 = models.Topic.objects.create(
            title="Poetry",
            is_protected=True,
        )
        self.topic1.subjects.set([self.subject1])
        self.topic2.subjects.set([self.subject2])

        # ===========
        # Lesson Names
        # ===========
        self.lesson_name1 = models.LessonName.objects.create(
            title="Linear Equations",
            is_protected=False,
        )
        self.lesson_name2 = models.LessonName.objects.create(
            title="Poetry Analysis",
            is_protected=True,
        )
        self.lesson_name1.subjects.set([self.subject1])
        self.lesson_name2.subjects.set([self.subject2])

        # ===========
        # Variations
        # ===========
        self.variation1 = models.Variation.objects.create(
            title="Foundation",
            is_protected=False,
        )
        self.variation2 = models.Variation.objects.create(
            title="Higher",
            is_protected=True,
        )

        # ===========
        # Teaching Styles
        # ===========
        self.teaching_style1 = models.TeachingStyle.objects.create(
            title="Lecture",
            is_protected=False,
        )
        self.teaching_style2 = models.TeachingStyle.objects.create(
            title="Discussion",
            is_protected=True,
        )

        # ===========
        # Lesson Variants
        # ===========
        self.lesson_variant1 = models.LessonVariant.objects.create(
            subject=self.subject1,
            topic=self.topic1,
            lesson_name=self.lesson_name1,
            teaching_style=self.teaching_style1,
            variation=self.variation1,
            is_published=True,
            is_protected=False,
            author=self.superuser,
        )
        self.lesson_variant2 = models.LessonVariant.objects.create(
            subject=self.subject2,
            topic=self.topic2,
            lesson_name=self.lesson_name2,
            teaching_style=self.teaching_style2,
            variation=self.variation2,
            is_published=False,
            is_protected=True,
            author=self.superuser,
        )

        # ===========
        # Resources
        # ===========
        self.resource1 = models.Resource.objects.create(
            title="Algebra Slides",
            category="slide",
            description="Intro algebra slides",
            url="https://example.com/algebra-slides",
            is_protected=False,
            author=self.superuser,
        )
        self.resource2 = models.Resource.objects.create(
            title="Poetry Worksheet",
            category="worksheet",
            description="Poetry worksheet",
            url="https://example.com/poetry-worksheet",
            is_protected=True,
            author=self.superuser,
        )
        self.resource1.subjects.set([self.subject1])
        self.resource2.subjects.set([self.subject2])

        # ===========
        # Lesson Variant Resources
        # ===========
        self.lesson_variant_resource1 = models.LessonVariantResource.objects.create(
            lesson_variant=self.lesson_variant1,
            resource=self.resource1,
            order=1,
        )
        self.lesson_variant_resource2 = models.LessonVariantResource.objects.create(
            lesson_variant=self.lesson_variant2,
            resource=self.resource2,
            order=2,
        )

    # =====================
    # Auth helpers
    # =====================
    def authenticate_user(self):
        self.client.force_authenticate(user=self.user)

    def authenticate_other_user(self):
        self.client.force_authenticate(user=self.other_user)

    def authenticate_admin(self):
        self.client.force_authenticate(user=self.superuser)

    def unauthenticate(self):
        self.client.force_authenticate(user=None)

    # =====================
    # Active Subject URLs
    # =====================
    def get_subject_list_url(self):
        return reverse("subject-list")

    # =====================
    # Active Topic URLs
    # =====================
    def get_topic_list_url(self):
        return reverse("topic-list")

    # =====================
    # Active Lesson Name URLs
    # =====================
    def get_lesson_name_list_url(self):
        return reverse("lesson-name-list")

    # =====================
    # Active Variation URLs
    # =====================
    def get_variation_list_url(self):
        return reverse("variation-list")

    # =====================
    # Active Teaching Style URLs
    # =====================
    def get_teaching_style_list_url(self):
        return reverse("teaching-style-list")
