from django.contrib import admin
from . import models


class LessonVariantResourceInline(admin.TabularInline):
    model = models.LessonVariantResource
    extra = 1
    ordering = ("order",)


@admin.register(models.Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ("title", "level", "language", "subject_id")
    search_fields = ("title", "level", "language", "subject_id")
    list_filter = ("level", "language")
    readonly_fields = ("slug",)


@admin.register(models.LessonVariant)
class LessonVariantAdmin(admin.ModelAdmin):
    list_display = (
        "lesson_name",
        "teaching_style",
        "variation",
        "topic",
        "subject",
        "is_published",
    )
    search_fields = (
        "lesson_name__title",
        "teaching_style__title",
        "variation__title",
        "topic__title",
        "subject__title",
    )
    list_filter = ("subject", "topic", "is_published")
    readonly_fields = ("slug",)
    inlines = [LessonVariantResourceInline]
