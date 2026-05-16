from django.contrib import admin
from . import models


class LessonVariantResourceInline(admin.TabularInline):
    model = models.LessonVariantResource
    extra = 1
    ordering = ("order",)
    autocomplete_fields = ("resource",)


@admin.register(models.Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "level",
        "language",
        "is_published",
        "is_protected",
        "subject_id",
    )
    search_fields = (
        "title",
        "level",
        "language",
        "is_published",
        "is_protected",
    )
    list_filter = (
        "level",
        "language",
        "is_published",
        "is_protected",
    )
    readonly_fields = ("slug", "subject_id")


@admin.register(models.Topic)
class TopicAdmin(admin.ModelAdmin):
    list_display = ("title", "is_protected", "get_subjects", "topic_id")
    search_fields = ("title",)
    list_filter = ("is_protected", "subjects")
    readonly_fields = ("slug",)
    filter_horizontal = ("subjects",)

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset.prefetch_related("subjects")

    def get_subjects(self, obj):
        return ", ".join(subject.title for subject in obj.subjects.all())

    get_subjects.short_description = "Subjects"


@admin.register(models.LessonName)
class LessonNameAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "is_protected",
        "get_subjects",
        "lesson_name_id",
    )
    search_fields = ("title",)
    list_filter = ("is_protected", "subjects")
    readonly_fields = ("slug",)
    filter_horizontal = ("subjects",)

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset.prefetch_related("subjects")

    def get_subjects(self, obj):
        return ", ".join(subject.title for subject in obj.subjects.all())

    get_subjects.short_description = "Subjects"


# @admin.register(models.Resource)
# class ResourceAdmin(admin.ModelAdmin):
#     list_display = (
#         "title",
#         "category",
#         "slug",
#         "resource_id",
#         "updated_at",
#         "author",
#         "get_subjects",
#     )
#     search_fields = ("title", "category", "description", "resource_id")
#     list_filter = ("subjects", "category", "created_at", "updated_at")
#     readonly_fields = ("slug", "created_at", "updated_at")
#     filter_horizontal = ("subjects",)

#     def get_queryset(self, request):
#         queryset = super().get_queryset(request)
#         return queryset.prefetch_related("subjects")

#     def get_subjects(self, obj):
#         return ", ".join(subject.title for subject in obj.subjects.all())

#     get_subjects.short_description = "Subjects"


# @admin.register(models.LessonVariant)
# class LessonVariantAdmin(admin.ModelAdmin):
#     list_display = (
#         "lesson_name",
#         "topic",
#         "subject",
#         "is_published",
#         "author",
#     )
#     search_fields = (
#         "lesson_name__title",
#         "topic__title",
#         "subject__title",
#         "author",
#     )
#     list_filter = ("subject", "topic", "is_published")
#     readonly_fields = ("slug",)
#     inlines = [LessonVariantResourceInline]


# @admin.register(models.LessonVariantResource)
# class LessonVariantResourceAdmin(admin.ModelAdmin):
#     list_display = (
#         "lesson_variant",
#         "resource",
#         "order",
#     )
#     search_fields = (
#         "lesson_variant__lesson_name__title",
#         "resource__title",
#     )
#     ordering = ("lesson_variant", "order")
