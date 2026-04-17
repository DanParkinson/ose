from rest_framework import serializers
from ... import models


class LessonNameSerializer(serializers.ModelSerializer):
    subjects = serializers.SlugRelatedField(
        many=True, slug_field="title", queryset=models.Subject.objects.all()
    )

    class Meta:
        model = models.LessonName
        fields = [
            "lesson_name_id",
            "title",
            "subjects",
            "slug",
            "is_protected",
        ]
        read_only_fields = ["lesson_name_id", "slug"]
