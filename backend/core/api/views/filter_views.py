from rest_framework import generics, permissions
from django.shortcuts import get_object_or_404
from ... import models
from ..serializers import filter_serializers


class FilterTopicBySubjectListView(generics.ListAPIView):
    serializer_class = filter_serializers.FilterTopicBySubjectSerializer
    permission_classes = [permissions.AllowAny]

    def get_subject(self):
        subject_id = self.kwargs["subject_id"]
        subject_slug = self.kwargs["subject_slug"]

        return get_object_or_404(
            models.Subject,
            subject_id=subject_id,
            slug=subject_slug,
        )

    def get_queryset(self):
        subject = self.get_subject()
        return models.Topic.objects.filter(subjects=subject).distinct()


class FilterLessonNameBySubjectListView(generics.ListAPIView):
    serializer_class = filter_serializers.FilterLessonNameBySubjectSerializer
    permission_classes = [permissions.AllowAny]

    def get_subject(self):
        subject_id = self.kwargs["subject_id"]
        subject_slug = self.kwargs["subject_slug"]

        return get_object_or_404(
            models.Subject,
            subject_id=subject_id,
            slug=subject_slug,
        )

    def get_queryset(self):
        subject = self.get_subject()
        return models.LessonName.objects.filter(subjects=subject).distinct()


class FilterTeachingStyleListView(generics.ListAPIView):
    queryset = models.TeachingStyle.objects.all()
    serializer_class = filter_serializers.FilterTeachingStyleSerializer
    permission_classes = [permissions.AllowAny]


class FilterVariationListView(generics.ListAPIView):
    serializer_class = filter_serializers.FilterVariationSerializer
    permission_classes = [permissions.AllowAny]

    def get_subject(self):
        subject_id = self.kwargs["subject_id"]
        subject_slug = self.kwargs["subject_slug"]

        return get_object_or_404(
            models.Subject,
            subject_id=subject_id,
            slug=subject_slug,
        )

    def get_queryset(self):
        subject = self.get_subject()
        return models.Variation.objects.filter(
            lesson_variants__subject=subject
        ).distinct()
