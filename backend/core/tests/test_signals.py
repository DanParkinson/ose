from unittest.mock import patch, call
from django.test import TestCase
from django.contrib.auth import get_user_model

from core import models


class BaseSignalTestCase(TestCase):
    def setUp(self):
        self.User = get_user_model()

        self.user = self.User.objects.create_user(
            username="user",
            password="testpass123",
        )
        self.superuser = self.User.objects.create_superuser(
            username="admin",
            email="admin@example.com",
            password="testpass123",
        )

        self.subject = models.Subject.objects.create(
            title="Maths",
            level="gcse",
            language="en",
            is_published=True,
            is_protected=False,
        )

        self.topic = models.Topic.objects.create(
            title="Algebra",
            is_protected=False,
        )
        self.topic.subjects.set([self.subject])

        self.lesson_name = models.LessonName.objects.create(
            title="Linear Equations",
            is_protected=False,
        )
        self.lesson_name.subjects.set([self.subject])

        self.variation = models.Variation.objects.create(
            title="Foundation",
            is_protected=False,
        )

        self.teaching_style = models.TeachingStyle.objects.create(
            title="Lecture",
            is_protected=False,
        )

        self.lesson_variant = models.LessonVariant.objects.create(
            subject=self.subject,
            topic=self.topic,
            lesson_name=self.lesson_name,
            teaching_style=self.teaching_style,
            variation=self.variation,
            is_published=True,
            is_protected=False,
            author=self.superuser,
        )

        self.resource = models.Resource.objects.create(
            title="Algebra Slides",
            category="slide",
            description="Intro algebra slides",
            url="https://example.com/algebra-slides",
            is_protected=False,
            author=self.superuser,
        )
        self.resource.subjects.set([self.subject])

        self.lesson_variant_resource = models.LessonVariantResource.objects.create(
            lesson_variant=self.lesson_variant,
            resource=self.resource,
            order=1,
        )

    # =====================
    # Helpers
    # =====================

    def create_subject(self, title="Physics"):
        return models.Subject.objects.create(
            title=title,
            level="gcse",
            language="en",
            is_published=True,
            is_protected=False,
        )

    def create_resource(self, title="Worksheet"):
        resource = models.Resource.objects.create(
            title=title,
            category="worksheet",
            description="Test resource",
            url="https://example.com/resource",
            is_protected=False,
            author=self.superuser,
        )
        resource.subjects.set([self.subject])
        return resource

    def create_lesson_variant(self):
        topic = models.Topic.objects.create(
            title="Graphs",
            is_protected=False,
        )
        topic.subjects.set([self.subject])

        lesson_name = models.LessonName.objects.create(
            title="Quadratic Graphs",
            is_protected=False,
        )
        lesson_name.subjects.set([self.subject])

        variation = models.Variation.objects.create(
            title="Higher",
            is_protected=False,
        )

        teaching_style = models.TeachingStyle.objects.create(
            title="Discussion",
            is_protected=False,
        )

        return models.LessonVariant.objects.create(
            subject=self.subject,
            topic=topic,
            lesson_name=lesson_name,
            teaching_style=teaching_style,
            variation=variation,
            is_published=True,
            is_protected=False,
            author=self.superuser,
        )


class SubjectCacheInvalidationSignalTests(BaseSignalTestCase):
    @patch("core.signals.cache.delete_pattern")
    def test_subject_create_clears_subject_caches(self, mock_delete_pattern):
        self.create_subject()

        mock_delete_pattern.assert_has_calls(
            [
                call("*subject_list*"),
                call("*subject_detail*"),
            ]
        )
        self.assertEqual(mock_delete_pattern.call_count, 2)

    @patch("core.signals.cache.delete_pattern")
    def test_subject_update_clears_subject_caches(self, mock_delete_pattern):
        subject = self.create_subject()
        mock_delete_pattern.reset_mock()

        subject.title = "Biology"
        subject.save()

        mock_delete_pattern.assert_has_calls(
            [
                call("*subject_list*"),
                call("*subject_detail*"),
            ]
        )
        self.assertEqual(mock_delete_pattern.call_count, 2)

    @patch("core.signals.cache.delete_pattern")
    def test_subject_delete_clears_subject_caches(self, mock_delete_pattern):
        subject = self.create_subject()
        mock_delete_pattern.reset_mock()

        subject.delete()

        mock_delete_pattern.assert_has_calls(
            [
                call("*subject_list*"),
                call("*subject_detail*"),
            ]
        )
        self.assertEqual(mock_delete_pattern.call_count, 2)


class ResourceCacheInvalidationSignalTests(BaseSignalTestCase):
    @patch("core.signals.cache.delete_pattern")
    def test_resource_create_clears_resource_related_caches(self, mock_delete_pattern):
        self.create_resource()

        mock_delete_pattern.assert_has_calls(
            [
                call("*resource_detail*"),
                call("*lesson_variant_with_resources_detail*"),
            ]
        )
        self.assertEqual(mock_delete_pattern.call_count, 2)

    @patch("core.signals.cache.delete_pattern")
    def test_resource_update_clears_resource_related_caches(self, mock_delete_pattern):
        resource = self.create_resource()
        mock_delete_pattern.reset_mock()

        resource.title = "Updated Resource"
        resource.save()

        mock_delete_pattern.assert_has_calls(
            [
                call("*resource_detail*"),
                call("*lesson_variant_with_resources_detail*"),
            ]
        )
        self.assertEqual(mock_delete_pattern.call_count, 2)

    @patch("core.signals.cache.delete_pattern")
    def test_resource_delete_clears_resource_related_caches(self, mock_delete_pattern):
        resource = self.create_resource()
        mock_delete_pattern.reset_mock()

        resource.delete()

        mock_delete_pattern.assert_has_calls(
            [
                call("*resource_detail*"),
                call("*lesson_variant_with_resources_detail*"),
            ]
        )
        self.assertEqual(mock_delete_pattern.call_count, 2)


class LessonVariantCacheInvalidationSignalTests(BaseSignalTestCase):
    @patch("core.signals.cache.delete_pattern")
    def test_lesson_variant_create_clears_lesson_variant_related_caches(
        self, mock_delete_pattern
    ):
        mock_delete_pattern.reset_mock()

        self.create_lesson_variant()

        mock_delete_pattern.assert_has_calls(
            [
                call("*lesson_variant_detail*"),
                call("*lesson_variant_with_resources_detail*"),
            ]
        )
        self.assertEqual(mock_delete_pattern.call_count, 2)

    @patch("core.signals.cache.delete_pattern")
    def test_lesson_variant_update_clears_lesson_variant_related_caches(
        self, mock_delete_pattern
    ):
        mock_delete_pattern.reset_mock()

        self.lesson_variant.is_published = False
        self.lesson_variant.save()

        mock_delete_pattern.assert_has_calls(
            [
                call("*lesson_variant_detail*"),
                call("*lesson_variant_with_resources_detail*"),
            ]
        )
        self.assertEqual(mock_delete_pattern.call_count, 2)

    @patch("core.signals.cache.delete_pattern")
    def test_lesson_variant_delete_clears_lesson_variant_related_caches(
        self, mock_delete_pattern
    ):
        mock_delete_pattern.reset_mock()

        self.lesson_variant.delete()

        self.assertIn(
            call("*lesson_variant_detail*"),
            mock_delete_pattern.call_args_list,
        )
        self.assertIn(
            call("*lesson_variant_with_resources_detail*"),
            mock_delete_pattern.call_args_list,
        )


class LessonVariantWithNestedResourcesCacheInvalidationSignalTests(BaseSignalTestCase):
    @patch("core.signals.cache.delete_pattern")
    def test_lesson_variant_create_clears_nested_resources_detail_cache(
        self, mock_delete_pattern
    ):
        mock_delete_pattern.reset_mock()

        self.create_lesson_variant()

        self.assertIn(
            call("*lesson_variant_with_resources_detail*"),
            mock_delete_pattern.call_args_list,
        )

    @patch("core.signals.cache.delete_pattern")
    def test_lesson_variant_update_clears_nested_resources_detail_cache(
        self, mock_delete_pattern
    ):
        mock_delete_pattern.reset_mock()

        self.lesson_variant.is_published = False
        self.lesson_variant.save()

        self.assertIn(
            call("*lesson_variant_with_resources_detail*"),
            mock_delete_pattern.call_args_list,
        )

    @patch("core.signals.cache.delete_pattern")
    def test_lesson_variant_delete_clears_nested_resources_detail_cache(
        self, mock_delete_pattern
    ):
        mock_delete_pattern.reset_mock()

        self.lesson_variant.delete()

        self.assertIn(
            call("*lesson_variant_with_resources_detail*"),
            mock_delete_pattern.call_args_list,
        )

    @patch("core.signals.cache.delete_pattern")
    def test_lesson_variant_resource_create_clears_nested_resources_detail_cache(
        self, mock_delete_pattern
    ):
        resource = self.create_resource(title="Extra Algebra Sheet")
        mock_delete_pattern.reset_mock()

        models.LessonVariantResource.objects.create(
            lesson_variant=self.lesson_variant,
            resource=resource,
            order=2,
        )

        mock_delete_pattern.assert_called_once_with(
            "*lesson_variant_with_resources_detail*"
        )

    @patch("core.signals.cache.delete_pattern")
    def test_lesson_variant_resource_update_clears_nested_resources_detail_cache(
        self, mock_delete_pattern
    ):
        mock_delete_pattern.reset_mock()

        self.lesson_variant_resource.order = 99
        self.lesson_variant_resource.save()

        mock_delete_pattern.assert_called_once_with(
            "*lesson_variant_with_resources_detail*"
        )

    @patch("core.signals.cache.delete_pattern")
    def test_lesson_variant_resource_delete_clears_nested_resources_detail_cache(
        self, mock_delete_pattern
    ):
        mock_delete_pattern.reset_mock()

        self.lesson_variant_resource.delete()

        mock_delete_pattern.assert_called_once_with(
            "*lesson_variant_with_resources_detail*"
        )

    @patch("core.signals.cache.delete_pattern")
    def test_resource_update_clears_nested_resources_detail_cache(
        self, mock_delete_pattern
    ):
        mock_delete_pattern.reset_mock()

        self.resource.title = "Updated Algebra Slides"
        self.resource.save()

        self.assertIn(
            call("*lesson_variant_with_resources_detail*"),
            mock_delete_pattern.call_args_list,
        )

    @patch("core.signals.cache.delete_pattern")
    def test_resource_delete_clears_nested_resources_detail_cache(
        self, mock_delete_pattern
    ):
        mock_delete_pattern.reset_mock()

        self.resource.delete()

        self.assertIn(
            call("*lesson_variant_with_resources_detail*"),
            mock_delete_pattern.call_args_list,
        )
