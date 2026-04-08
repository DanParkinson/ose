from rest_framework import serializers
from ..models import (
    Subject,
    Topic,
    Lesson,
    Resource,
    Curriculum,
    Unit,
    UnitLesson,
    LessonResource,
)


# ===========================
# List serializers
# ===========================
class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = [
            "subject_id",
            "title",
            "slug",
            "level",
            "language",
            "description",
            "icon",
        ]
        read_only_fields = ["subject_id", "slug", "icon"]


# =========================
# Summary List Serializers for nested relationships and reduced payloads
# =========================
class TopicSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = [
            "topic_id",
            "title",
            "slug",
        ]
        read_only_fields = ["topic_id", "slug"]


class CurriculumSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Curriculum
        fields = [
            "curriculum_id",
            "title",
            "description",
            "slug",
            "created_at",
            "updated_at",
            "is_published",
        ]
        read_only_fields = ["curriculum_id", "slug", "created_at", "updated_at"]


class LessonSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = [
            "lesson_id",
            "title",
            "variant",
            "slug",
            "created_at",
            "updated_at",
            "is_published",
        ]
        read_only_fields = ["lesson_id", "slug", "created_at", "updated_at"]


class ResourceSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = [
            "resource_id",
            "title",
            "slug",
            "category",
            "file",
            "url",
            "created_at",
            "updated_at",
            "is_published",
        ]
        read_only_fields = ["resource_id", "slug", "created_at", "updated_at"]


class UnitSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Unit
        fields = [
            "unit_id",
            "year_group",
            "level",
            "order",
            "slug",
            "created_at",
            "updated_at",
            "is_published",
        ]
        read_only_fields = ["unit_id", "slug", "created_at", "updated_at"]


# ====================
# Lookups
# ====================
class LessonResourceSerializer(serializers.ModelSerializer):
    resource = ResourceSummarySerializer(read_only=True)

    class Meta:
        model = LessonResource
        fields = [
            "order",
            "resource",
        ]


class UnitLessonSerializer(serializers.ModelSerializer):
    lesson = LessonSummarySerializer(read_only=True)

    class Meta:
        model = UnitLesson
        fields = [
            "order",
            "lesson",
        ]


# ==========================
# nested Detail serializers
# =========================
class SubjectDetailSerializer(serializers.ModelSerializer):
    topics = TopicSummarySerializer(many=True, read_only=True)
    curriculums = CurriculumSummarySerializer(many=True, read_only=True)

    class Meta:
        model = Subject
        fields = [
            "subject_id",
            "title",
            "slug",
            "level",
            "language",
            "description",
            "icon",
            "topics",
            "curriculums",
        ]
        read_only_fields = ["subject_id", "slug", "icon"]


class TopicDetailSerializer(serializers.ModelSerializer):
    lessons = LessonSummarySerializer(many=True, read_only=True)

    class Meta:
        model = Topic
        fields = ["topic_id", "title", "slug", "subject", "description", "lessons"]
        read_only_fields = ["topic_id", "slug"]


class LessonDetailSerializer(serializers.ModelSerializer):
    resources = LessonResourceSerializer(
        source="lesson_resources", many=True, read_only=True
    )

    class Meta:
        model = Lesson
        fields = [
            "lesson_id",
            "title",
            "variant",
            "topic",
            "slug",
            "description",
            "created_at",
            "updated_at",
            "is_published",
            "resources",
        ]
        read_only_fields = ["lesson_id", "slug", "created_at", "updated_at"]


class CurriculumDetailSerializer(serializers.ModelSerializer):
    units = UnitSummarySerializer(many=True, read_only=True)

    class Meta:
        model = Curriculum
        fields = [
            "curriculum_id",
            "title",
            "subject",
            "description",
            "slug",
            "created_at",
            "updated_at",
            "is_published",
            "units",
        ]
        read_only_fields = ["curriculum_id", "slug", "created_at", "updated_at"]


class UnitDetailSerializer(serializers.ModelSerializer):
    lessons = UnitLessonSerializer(source="unit_lessons", many=True, read_only=True)

    class Meta:
        model = Unit
        fields = [
            "unit_id",
            "year_group",
            "level",
            "order",
            "slug",
            "description",
            "created_at",
            "updated_at",
            "is_published",
            "lessons",
        ]
        read_only_fields = ["unit_id", "slug", "created_at", "updated_at"]


# ==========================
# In progress
# ==========================
