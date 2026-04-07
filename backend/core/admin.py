from django.contrib import admin
from .models import (
    Subject,
    Topic,
    Lesson,
    Resource,
    LessonResource,
    Curriculum,
    Unit,
    UnitLesson,
)


# ==================================
# Inlines
# ==================================
class TopicInline(admin.TabularInline):
    model = Topic
    extra = 1
    fields = ("title", "description")


class LessonInline(admin.TabularInline):
    model = Lesson
    extra = 1
    fields = ("title", "variant", "description", "is_active")


class LessonResourceInline(admin.TabularInline):
    model = LessonResource
    extra = 1
    fields = ("resource", "order")


class UnitLessonInline(admin.TabularInline):
    model = UnitLesson
    extra = 1
    fields = ("lesson", "order")
    autocomplete_fields = ("lesson",)


class UnitInLine(admin.TabularInline):
    model = Unit
    extra = 1
    fields = ("year_group", "level", "order", "description")


# ==================================
# Core Content Admin
# ==================================
@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ("title", "level", "language", "subject_id")
    search_fields = ("title", "level", "language", "subject_id")
    list_filter = ("level", "language")
    readonly_fields = ("slug",)
    summernote_fields = ("description",)
    inlines = [TopicInline]


@admin.register(Topic)
class TopicAdmin(admin.ModelAdmin):
    list_display = ("title", "subject", "topic_id")
    search_fields = ("title", "description", "subject__title")
    list_filter = ("subject",)
    readonly_fields = ("slug",)
    summernote_fields = ("description",)
    inlines = [LessonInline]


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ("title", "variant", "topic", "is_active", "lesson_id")
    search_fields = ("title", "description", "topic__title")
    list_filter = ("is_active", "topic", "title")
    readonly_fields = ("slug",)
    inlines = [LessonResourceInline]


@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "is_active", "created_at", "updated_at")
    search_fields = ("title", "description", "category")
    list_filter = ("category", "is_active")
    readonly_fields = ("slug",)


@admin.register(LessonResource)
class LessonResourceAdmin(admin.ModelAdmin):
    list_display = ("lesson", "resource", "order")
    search_fields = ("lesson__title", "resource__title")
    list_filter = ("lesson",)


# ==================================
# Curriculum Admin
# ==================================
@admin.register(Curriculum)
class CurriculumAdmin(admin.ModelAdmin):
    list_display = ("title", "subject", "created_at", "updated_on", "curriculum_id")
    search_fields = ("title", "subject__title", "description", "curriculum_id")
    list_filter = ("subject",)
    readonly_fields = ("slug",)
    inlines = [UnitInLine]


@admin.register(Unit)
class UnitAdmin(admin.ModelAdmin):
    list_display = (
        "curriculum",
        "year_group",
        "level",
        "order",
    )
    search_fields = ("curriculum__title", "description")
    list_filter = ("curriculum", "year_group", "level")
    readonly_fields = ("slug",)
    inlines = [UnitLessonInline]


@admin.register(UnitLesson)
class UnitLessonAdmin(admin.ModelAdmin):
    list_display = ("unit", "lesson", "order")
    search_fields = ("unit__curriculum", "lesson__title")
    list_filter = (
        "unit__curriculum",
        "unit__year_group",
        "unit__level",
        "unit__order",
    )
