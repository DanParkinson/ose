import django_filters
from .. import models


class LessonVariantFilter(django_filters.FilterSet):
    topic = django_filters.UUIDFilter(field_name="topic__topic_id")
    lesson_name = django_filters.UUIDFilter(field_name="lesson_name__lesson_name_id")
    teaching_style = django_filters.UUIDFilter(
        field_name="teaching_style__teaching_style_id"
    )
    variation = django_filters.UUIDFilter(field_name="variation__variation_id")

    class Meta:
        model = models.LessonVariant
        fields = ["topic", "lesson_name", "teaching_style", "variation"]
