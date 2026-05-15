from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Subject, Topic, LessonName, TeachingStyle, Variation
from django.core.cache import cache


@receiver([post_save, post_delete], sender=Subject)
def invalidate_subject_cache(sender, instance, **kwargs):
    """
    Invalidate Subject list, detail caches when a Subject is created, updated, deleted
    """
    cache.delete_pattern("*subject_list:*")


# ============
# Topics
# ============
@receiver([post_save, post_delete], sender=Topic)
def invalidate_topic_cache(sender, instance, **kwargs):
    """
    Invalidate Topic list caches when a Topic is created, updated, or deleted.
    """
    deleted_count = cache.delete_pattern("*topic_list:*")
    print(f"TOPIC post_save/post_delete cache deleted: {deleted_count}")


@receiver([post_save, post_delete], sender=LessonName)
def invalidate_lesson_name_cache(sender, instance, **kwargs):
    """
    Invalidate LessonName list, detail caches when a LessonName is created, updated, deleted
    """
    cache.delete_pattern("*lesson_name_list:*")


@receiver([post_save, post_delete], sender=TeachingStyle)
def invalidate_teaching_style_cache(sender, instance, **kwargs):
    """
    Invalidate TeachingStyle list, detail caches when a TeachingStyle is created, updated, deleted
    """
    cache.delete_pattern("*teaching_style_list*")


@receiver([post_save, post_delete], sender=Variation)
def invalidate_variation_cache(sender, instance, **kwargs):
    """
    Invalidate Variation list, detail caches when a Variation is created, updated, deleted
    """
    cache.delete_pattern("*variation_list*")


# @receiver([post_save, post_delete], sender=Resource)
# def invalidate_resource_cache(sender, instance, **kwargs):
#     cache.delete_pattern("*resource_detail*")
#     cache.delete_pattern("*lesson_variant_with_resources_detail*")


# @receiver([post_save, post_delete], sender=LessonVariant)
# def invalidate_lesson_variant_cache(sender, instance, **kwargs):
#     cache.delete_pattern("*lesson_variant_detail*")
#     cache.delete_pattern("*lesson_variant_with_resources_detail*")


# @receiver([post_save, post_delete], sender=LessonVariantResource)
# def invalidate_lesson_variant_resource_cache(sender, instance, **kwargs):
#     cache.delete_pattern("*lesson_variant_with_resources_detail*")
