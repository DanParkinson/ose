from rest_framework import serializers
from ... import models
from ..serializers import resource_serializers


class LessonVariantResourceSerializer(serializers.ModelSerializer):
    resource = resource_serializers.ResourceBySubjectSerializer(read_only=True)

    class Meta:
        model = models.LessonVariantResource
        fields = [
            "resource",
            "order",
        ]


class ResourceCreateForLessonVariantSerializer(serializers.ModelSerializer):
    order = serializers.IntegerField(required=False, default=0)

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
            "order",
        ]
        read_only_fields = [
            "resource_id",
            "slug",
        ]

    def create(self, validated_data):
        validated_data.pop("order", 0)
        return super().create(validated_data)


class LessonVariantResourceAttachSerializer(serializers.Serializer):
    resource = serializers.PrimaryKeyRelatedField(
        queryset=models.Resource.objects.none()
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        lesson_variant = self.context.get("lesson_variant")

        if lesson_variant:
            self.fields["resource"].queryset = (
                models.Resource.objects.filter(
                    subjects=lesson_variant.subject,
                )
                .exclude(resource_lesson_variants__lesson_variant=lesson_variant)
                .distinct()
            )

    def validate(self, attrs):
        lesson_variant = self.context["lesson_variant"]
        resource = attrs["resource"]

        if models.LessonVariantResource.objects.filter(
            lesson_variant=lesson_variant,
            resource=resource,
        ).exists():
            raise serializers.ValidationError(
                {"resource": "Resource already attached."}
            )

        return attrs
