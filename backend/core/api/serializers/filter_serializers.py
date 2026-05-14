from rest_framework import serializers
from ... import models


class FilterTopicBySubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Topic
        fields = [
            "topic_id",
            "title",
        ]
        read_only_fields = ["topic_id", "title"]


class FilterLessonNameBySubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.LessonName
        fields = [
            "lesson_name_id",
            "title",
        ]
        read_only_fields = ["lesson_name_id", "title"]


class FilterTeachingStyleSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.TeachingStyle
        fields = [
            "teaching_style_id",
            "title",
        ]
        read_only_fields = ["teaching_style_id", "title"]


class FilterVariationSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Variation
        fields = [
            "variation_id",
            "title",
        ]
        read_only_fields = ["variation_id", "title"]
