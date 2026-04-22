from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Subject, Resource, LessonVariant, LessonVariantResource
from django.core.cache import cache


@receiver([post_save, post_delete], sender=Subject)
def invalidate_subject_cache(sender, instance, **kwargs):
    """
    Invalidate Subject list, detail caches when a Subject is created, updated, deleted
    """
    cache.delete_pattern("*subject_list*")
    cache.delete_pattern("*subject_detail*")


@receiver([post_save, post_delete], sender=Resource)
def invalidate_resource_cache(sender, instance, **kwargs):
    cache.delete_pattern("*resource_detail*")
    cache.delete_pattern("*lesson_variant_with_resources_detail*")


@receiver([post_save, post_delete], sender=LessonVariant)
def invalidate_lesson_variant_cache(sender, instance, **kwargs):
    cache.delete_pattern("*lesson_variant_detail*")
    cache.delete_pattern("*lesson_variant_with_resources_detail*")


@receiver([post_save, post_delete], sender=LessonVariantResource)
def invalidate_lesson_variant_resource_cache(sender, instance, **kwargs):
    cache.delete_pattern("*lesson_variant_with_resources_detail*")
