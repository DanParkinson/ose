from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase

from .. import models


class BaseAPITestCase(APITestCase):
    def setUp(self):
        self.User = get_user_model()
        # ===========
        # users
        # ===========
        self.user = self.User.objects.create_user(
            username="user",
            password="testpass123",
        )
        self.other_user = self.User.objects.create_user(
            username="otheruser",
            password="testpass123",
        )
        self.superuser = self.User.objects.create_superuser(
            username="admin",
            email="admin@example.com",
            password="testpass123",
        )
        # ===========
        # Subjects
        # ===========
        self.subject1 = models.Subject.objects.create(
            title="Mathematics",
            level="gcse",
            language="en",
            is_published=True,
            is_protected=False,
        )
        self.subject2 = models.Subject.objects.create(
            title="English",
            level="gcse",
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
        # Lesson Name
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
        # Variation
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
        # Teaching Style
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
        # Lesson Variant
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
        # Resource
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
        # Lesson Variant Resource
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
    # Subject URLs
    # =====================
    def get_subject_list_url(self):
        return reverse("subject-list")

    def get_subject_detail_url(self, subject=None):
        subject = subject or self.subject1
        return reverse(
            "subject-detail",
            kwargs={
                "subject_slug": subject.slug,
                "subject_id": subject.subject_id,
            },
        )

    # =====================
    # Topic URLs
    # =====================
    def get_topic_list_url(self):
        return reverse("topic-list")

    def get_topic_detail_url(self, topic=None):
        topic = topic or self.topic1
        return reverse(
            "topic-detail",
            kwargs={
                "topic_slug": topic.slug,
                "topic_id": topic.topic_id,
            },
        )

    # =====================
    # Lesson name URLs
    # =====================
    def get_lesson_name_list_url(self):
        return reverse("lesson-name-list")

    def get_lesson_name_detail_url(self, lesson_name=None):
        lesson_name = lesson_name or self.lesson_name1
        return reverse(
            "lesson-name-detail",
            kwargs={
                "lesson_name_slug": lesson_name.slug,
                "lesson_name_id": lesson_name.lesson_name_id,
            },
        )

    # =====================
    # Variation URLs
    # =====================
    def get_variation_list_url(self):
        return reverse("variation-list")

    def get_variation_detail_url(self, variation=None):
        variation = variation or self.variation1
        return reverse(
            "variation-detail",
            kwargs={
                "variation_slug": variation.slug,
                "variation_id": variation.variation_id,
            },
        )

    # =====================
    # Teaching style URLs
    # =====================
    def get_teaching_style_list_url(self):
        return reverse("teaching-style-list")

    def get_teaching_style_detail_url(self, teaching_style=None):
        teaching_style = teaching_style or self.teaching_style1
        return reverse(
            "teaching-style-detail",
            kwargs={
                "teaching_style_slug": teaching_style.slug,
                "teaching_style_id": teaching_style.teaching_style_id,
            },
        )

    # =====================
    # Resource URLs
    # =====================
    def get_resource_by_subject_list_url(self, subject=None):
        subject = subject or self.subject1
        return reverse(
            "resource-by-subject-list",
            kwargs={
                "subject_slug": subject.slug,
                "subject_id": subject.subject_id,
            },
        )

    def get_resource_by_subject_detail_url(self, subject=None, resource=None):
        subject = subject or self.subject1
        resource = resource or self.resource1
        return reverse(
            "resource-by-subject-detail",
            kwargs={
                "subject_slug": subject.slug,
                "subject_id": subject.subject_id,
                "resource_slug": resource.slug,
                "resource_id": resource.resource_id,
            },
        )

    # =====================
    # Lesson variant URLs
    # =====================
    def get_lesson_list_url(self, subject=None):
        subject = subject or self.subject1
        return reverse(
            "lesson-list",
            kwargs={
                "subject_slug": subject.slug,
                "subject_id": subject.subject_id,
            },
        )

    def get_lesson_create_url(self, subject=None):
        subject = subject or self.subject1
        return reverse(
            "lesson-create",
            kwargs={
                "subject_slug": subject.slug,
                "subject_id": subject.subject_id,
            },
        )

    def get_lesson_detail_url(self, subject=None, lesson_variant=None):
        subject = subject or self.subject1
        lesson_variant = lesson_variant or self.lesson_variant1
        return reverse(
            "lesson-detail",
            kwargs={
                "subject_slug": subject.slug,
                "subject_id": subject.subject_id,
                "lesson_variant_slug": lesson_variant.slug,
                "lesson_variant_id": lesson_variant.lesson_variant_id,
            },
        )

    def get_lesson_with_resource_detail_url(self, subject=None, lesson_variant=None):
        subject = subject or self.subject1
        lesson_variant = lesson_variant or self.lesson_variant1
        return reverse(
            "lesson-with-resource-detail",
            kwargs={
                "subject_slug": subject.slug,
                "subject_id": subject.subject_id,
                "lesson_variant_slug": lesson_variant.slug,
                "lesson_variant_id": lesson_variant.lesson_variant_id,
            },
        )

    # =====================
    # Lesson variant resource URLs
    # =====================
    def get_lesson_variant_resource_create_url(self, subject=None, lesson_variant=None):
        subject = subject or self.subject1
        lesson_variant = lesson_variant or self.lesson_variant1
        return reverse(
            "lesson-variant-resource-create",
            kwargs={
                "subject_slug": subject.slug,
                "subject_id": subject.subject_id,
                "lesson_variant_slug": lesson_variant.slug,
                "lesson_variant_id": lesson_variant.lesson_variant_id,
            },
        )

    def get_lesson_variant_resource_attach_url(self, subject=None, lesson_variant=None):
        subject = subject or self.subject1
        lesson_variant = lesson_variant or self.lesson_variant1
        return reverse(
            "lesson-variant-resource-attach",
            kwargs={
                "subject_slug": subject.slug,
                "subject_id": subject.subject_id,
                "lesson_variant_slug": lesson_variant.slug,
                "lesson_variant_id": lesson_variant.lesson_variant_id,
            },
        )

    def get_lesson_variant_resource_delete_url(self, subject=None, lesson_variant=None):
        subject = subject or self.subject1
        lesson_variant = lesson_variant or self.lesson_variant1
        return reverse(
            "lesson-variant-resource-delete",
            kwargs={
                "subject_slug": subject.slug,
                "subject_id": subject.subject_id,
                "lesson_variant_slug": lesson_variant.slug,
                "lesson_variant_id": lesson_variant.lesson_variant_id,
            },
        )
