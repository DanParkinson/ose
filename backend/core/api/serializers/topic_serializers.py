from rest_framework import serializers
from ... import models


class TopicSerializer(serializers.ModelSerializer):
    subjects = serializers.SlugRelatedField(
        many=True, slug_field="title", queryset=models.Subject.objects.all()
    )

    class Meta:
        model = models.Topic
        fields = [
            "topic_id",
            "subjects",
            "title",
            "slug",
            "is_protected",
        ]
        read_only_fields = ["topic_id", "slug"]
