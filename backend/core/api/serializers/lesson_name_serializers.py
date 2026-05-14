from rest_framework import serializers
from ... import models


class LessonNameSerializer(serializers.ModelSerializer):
    subjects = serializers.PrimaryKeyRelatedField(
        many=True, queryset=models.Subject.objects.all()
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


class LessonNameBySubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.LessonName
        fields = [
            "lesson_name_id",
            "title",
        ]
        read_only_fields = ["lesson_name_id", "title", "slug"]
