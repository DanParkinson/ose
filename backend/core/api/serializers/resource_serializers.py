from rest_framework import serializers
from ... import models
from .subject_serializers import SubjectSummarySerializer


class ResourceBySubjectSerializer(serializers.ModelSerializer):
    subjects = SubjectSummarySerializer(many=True, read_only=True)

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
            "is_protected",
            "subjects",
            "created_at",
            "updated_at",
            "author",
        ]
        read_only_fields = ["resource_id", "slug", "created_at", "updated_at", "author"]
