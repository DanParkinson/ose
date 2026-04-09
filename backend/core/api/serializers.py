from rest_framework import serializers
from .. import models


# ======================
# Subject Serializers
# ======================
class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Subject
        fields = [
            "subject_id",
            "title",
            "slug",
            "level",
            "language",
        ]
        read_only_fields = ["subject_id", "slug"]


class SubjectDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Subject
        fields = [
            "title",
            "slug",
            "level",
            "language",
        ]
        read_only_fields = ["subject_id", "slug"]


# ======================
# Lesson Serializers
# ======================
class LessonVaraintSerializer(serializers.ModelSerializer):
    subject = serializers.SlugRelatedField(read_only=True, slug_field="title")
    lesson_name = serializers.SlugRelatedField(read_only=True, slug_field="title")
    teaching_style = serializers.SlugRelatedField(read_only=True, slug_field="title")
    variation = serializers.SlugRelatedField(read_only=True, slug_field="title")
    topic = serializers.SlugRelatedField(read_only=True, slug_field="title")

    class Meta:
        model = models.LessonVariant
        fields = [
            "lesson_variant_id",
            "subject",
            "topic",
            "lesson_name",
            "teaching_style",
            "variation",
            "slug",
            "is_published",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["lesson_variant_id", "created_at", "updated_at", "slug"]


# ======================
# Resource Serializers
# ======================
class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Resource
        fields = [
            "resource_id",
            "title",
            "slug",
            "category",
            "description",
            "file",
            "url",
        ]


class LessonVariantResourceSerializer(serializers.ModelSerializer):
    resource = ResourceSerializer(read_only=True)

    class Meta:
        model = models.LessonVariantResource
        fields = [
            "order",
            "resource",
        ]
