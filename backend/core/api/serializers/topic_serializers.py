from rest_framework import serializers
from ... import models


class TopicSerializer(serializers.ModelSerializer):
    subjects = serializers.PrimaryKeyRelatedField(
        many=True, queryset=models.Subject.objects.all()
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

    def to_representation(self, instance):
        data = super().to_representation(instance)

        data["subjects"] = [
            {
                "subject_id": str(subject.subject_id),
                "title": subject.title,
                "level": subject.level,
                "language": subject.language,
            }
            for subject in instance.subjects.all()
        ]
        return data


class TopicBySubjectListSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Topic
        fields = [
            "topic_id",
            "title",
        ]
        read_only_fields = ["topic_id", "title", "slug"]
