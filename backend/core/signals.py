from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Subject
from django.core.cache import cache


@receiver([post_save, post_delete], sender=Subject)
def invalidate_subject_cache(sender, instance, **kwargs):
    """
    Invalidate Subject list, detail caches when a Subject is created, updated, deleted
    """
    cache.delete_pattern("*subject_list:*")
