from rest_framework import generics
from django.shortcuts import get_object_or_404
from .. import models
from . import serializers


# ======================
# Subjects
# ======================
class SubjectListView(generics.ListAPIView):
    queryset = models.Subject.objects.all()
    serializer_class = serializers.SubjectSerializer


class SubjectDetailView(generics.RetrieveAPIView):
    queryset = models.Subject.objects.all()
    serializer_class = serializers.SubjectDetailSerializer
    lookup_field = "subject_id"
    lookup_url_kwarg = "subject_id"

    def get_object(self):
        queryset = self.get_queryset()
        subject_id = self.kwargs.get("subject_id")
        subject_slug = self.kwargs.get("subject_slug")
        return get_object_or_404(queryset, subject_id=subject_id, slug=subject_slug)


# ======================
# Lessons
# ======================
class LessonVariantListView(generics.ListAPIView):
    serializer_class = serializers.LessonVaraintSerializer

    def get_queryset(self):
        subject_id = self.kwargs["subject_id"]
        return models.LessonVariant.objects.select_related(
            "lesson_name",
            "teaching_style",
            "variation",
            "topic",
            "subject",
        ).filter(subject_id=subject_id)


# ======================
# Resources
# ======================
class LessonVariantResourceListView(generics.ListAPIView):
    serializer_class = serializers.LessonVariantResourceSerializer

    def get_queryset(self):
        subject_id = self.kwargs["subject_id"]
        lesson_variant_id = self.kwargs["lesson_variant_id"]

        return (
            models.LessonVariantResource.objects.select_related(
                "resource",
                "lesson_variant",
                "lesson_variant__subject",
            )
            .filter(
                lesson_variant_id=lesson_variant_id,
                lesson_variant__subject_id=subject_id,
            )
            .order_by("order")
        )
