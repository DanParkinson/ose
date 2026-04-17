from rest_framework import serializers
from ... import models


class TeachingStyleSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.TeachingStyle
        fields = [
            "teaching_style_id",
            "title",
            "slug",
            "is_protected",
        ]
        read_only_fields = ["teaching_style_id", "slug"]
