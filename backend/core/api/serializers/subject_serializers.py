from rest_framework import serializers
from ... import models


class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Subject
        fields = [
            "subject_id",
            "title",
            "slug",
            "level",
            "language",
            "is_published",
            "is_protected",
        ]
        read_only_fields = ["subject_id", "slug"]
