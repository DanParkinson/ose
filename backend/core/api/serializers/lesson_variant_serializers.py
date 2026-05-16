# from rest_framework import serializers
# from ... import models
# from ..serializers import lesson_variant_resource_serializers


# class LessonVariantBySubjectListSerializer(serializers.ModelSerializer):
#     """
#     Used for listing LessonVariant before adding or loading resources
#     """

#     subject = serializers.SlugRelatedField(read_only=True, slug_field="title")
#     lesson_name = serializers.SlugRelatedField(read_only=True, slug_field="title")
#     topic = serializers.SlugRelatedField(read_only=True, slug_field="title")
#     author = serializers.SlugRelatedField(read_only=True, slug_field="username")

#     class Meta:
#         model = models.LessonVariant
#         fields = [
#             "lesson_variant_id",
#             "subject",
#             "topic",
#             "lesson_name",
#             "slug",
#             "is_published",
#             "is_protected",
#             "created_at",
#             "updated_at",
#             "author",
#         ]
#         read_only_fields = [
#             "lesson_variant_id",
#             "created_at",
#             "updated_at",
#             "slug",
#             "author",
#         ]


# class LessonVariantWriteSerializer(serializers.ModelSerializer):
#     """
#     Input serializer for creating a LessonVariant.
#     Subject comes from the URL.
#     Author comes from request.user.
#     lessonName and Topic start with no querset then filters through subject to fetch
#     """

#     topic = serializers.SlugRelatedField(
#         slug_field="title",
#         queryset=models.Topic.objects.none(),
#     )
#     lesson_name = serializers.SlugRelatedField(
#         slug_field="title",
#         queryset=models.LessonName.objects.none(),
#     )

#     class Meta:
#         model = models.LessonVariant
#         fields = [
#             "topic",
#             "lesson_name",
#             "is_published",
#             "is_protected",
#         ]

#     def __init__(self, *args, **kwargs):
#         super().__init__(*args, **kwargs)

#         subject = self.context.get("subject")
#         if subject is not None:
#             self.fields["topic"].queryset = models.Topic.objects.filter(
#                 subjects=subject
#             ).distinct()
#             self.fields["lesson_name"].queryset = models.LessonName.objects.filter(
#                 subjects=subject
#             ).distinct()

#     def validate(self, attrs):
#         subject = self.context["subject"]

#         exists = models.LessonVariant.objects.filter(
#             subject=subject,
#             topic=attrs["topic"],
#             lesson_name=attrs["lesson_name"],
#         ).exists()

#         if exists:
#             raise serializers.ValidationError(
#                 "A lesson variant with this combination already exists."
#             )

#         return attrs


# class LessonVariantDetailReadOnlySerializer(serializers.ModelSerializer):
#     subject = serializers.SlugRelatedField(read_only=True, slug_field="title")
#     topic = serializers.SlugRelatedField(read_only=True, slug_field="title")
#     lesson_name = serializers.SlugRelatedField(read_only=True, slug_field="title")
#     author = serializers.SlugRelatedField(read_only=True, slug_field="username")

#     class Meta:
#         model = models.LessonVariant
#         fields = [
#             "lesson_variant_id",
#             "subject",
#             "topic",
#             "lesson_name",
#             "slug",
#             "is_published",
#             "is_protected",
#             "created_at",
#             "updated_at",
#             "author",
#         ]
#         read_only_fields = [
#             "lesson_variant_id",
#             "subject",
#             "topic",
#             "lesson_name",
#             "slug",
#             "is_published",
#             "is_protected",
#             "created_at",
#             "updated_at",
#             "author",
#         ]


# class LessonVariantUpdateSerializer(serializers.ModelSerializer):
#     """
#     Input serializer for updating a LessonVariant.
#     Subject comes from the URL via serializer context.
#     Topic and lesson_name are limited to values linked to that subject.
#     """

#     topic = serializers.SlugRelatedField(
#         slug_field="title",
#         queryset=models.Topic.objects.none(),
#         required=False,
#     )
#     lesson_name = serializers.SlugRelatedField(
#         slug_field="title",
#         queryset=models.LessonName.objects.none(),
#         required=False,
#     )

#     class Meta:
#         model = models.LessonVariant
#         fields = [
#             "topic",
#             "lesson_name",
#             "is_published",
#             "is_protected",
#         ]

#     def __init__(self, *args, **kwargs):
#         super().__init__(*args, **kwargs)

#         subject = self.context.get("subject")
#         if subject is not None:
#             self.fields["topic"].queryset = models.Topic.objects.filter(
#                 subjects=subject
#             ).distinct()
#             self.fields["lesson_name"].queryset = models.LessonName.objects.filter(
#                 subjects=subject
#             ).distinct()

#     def validate(self, attrs):
#         subject = self.context["subject"]

#         topic = attrs.get("topic", self.instance.topic)
#         lesson_name = attrs.get("lesson_name", self.instance.lesson_name)

#         exists = (
#             models.LessonVariant.objects.filter(
#                 subject=subject,
#                 topic=topic,
#                 lesson_name=lesson_name,
#             )
#             .exclude(pk=self.instance.pk)
#             .exists()
#         )

#         if exists:
#             raise serializers.ValidationError(
#                 "A lesson variant with this combination already exists."
#             )

#         return attrs


# class LessonVariantWithNestedResourcesDetailSerializer(serializers.ModelSerializer):
#     subject = serializers.SlugRelatedField(read_only=True, slug_field="title")
#     lesson_name = serializers.SlugRelatedField(read_only=True, slug_field="title")
#     topic = serializers.SlugRelatedField(read_only=True, slug_field="title")
#     author = serializers.SlugRelatedField(read_only=True, slug_field="username")
#     resources = lesson_variant_resource_serializers.LessonVariantResourceSerializer(
#         source="lesson_variant_resources", many=True, read_only=True
#     )

#     class Meta:
#         model = models.LessonVariant
#         fields = [
#             "lesson_variant_id",
#             "subject",
#             "topic",
#             "lesson_name",
#             "slug",
#             "resources",
#             "is_published",
#             "created_at",
#             "updated_at",
#             "author",
#         ]
#         read_only_fields = [
#             "lesson_variant_id",
#             "created_at",
#             "updated_at",
#             "slug",
#             "author",
#         ]
