from rest_framework import generics, permissions
from django.db.models import Prefetch
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from .. import models
from . import serializers


# ==================
# Subject
# ==================
class SubjectListView(generics.ListAPIView):
    queryset = models.Subject.objects.all()
    serializer_class = serializers.SubjectSerializer
    permission_classes = [permissions.AllowAny]

    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["level", "language"]


class SubjectDetailView(generics.RetrieveAPIView):
    queryset = models.Subject.objects.all()
    serializer_class = serializers.SubjectDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = "subject_id"
    lookup_url_kwarg = "subject_id"

    def get_object(self):
        queryset = self.get_queryset()
        subject_id = self.kwargs.get("subject_id")
        slug = self.kwargs.get("slug")
        return get_object_or_404(queryset, subject_id=subject_id, slug=slug)


# ===============
# Topic
# ===============
class TopicDetailView(generics.RetrieveAPIView):
    queryset = models.Topic.objects.all()
    serializer_class = serializers.TopicDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = "topic_id"
    lookup_url_kwarg = "topic_id"

    def get_object(self):
        queryset = self.get_queryset()
        topic_id = self.kwargs.get("topic_id")
        slug = self.kwargs.get("slug")
        return get_object_or_404(queryset, topic_id=topic_id, slug=slug)


# ========================
# Lessons
# ========================
class LessonDetailView(generics.RetrieveAPIView):
    queryset = models.Lesson.objects.filter(is_published=True).prefetch_related(
        Prefetch(
            "lesson_resources",
            queryset=models.LessonResource.objects.select_related("resource"),
        )
    )
    serializer_class = serializers.LessonDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = "lesson_id"
    lookup_url_kwarg = "lesson_id"

    def get_object(self):
        queryset = self.get_queryset()
        lesson_id = self.kwargs.get("lesson_id")
        slug = self.kwargs.get("slug")
        return get_object_or_404(queryset, lesson_id=lesson_id, slug=slug)


# ========================
# Curriculum
# ========================
class CurriculumDetailView(generics.RetrieveAPIView):
    queryset = models.Curriculum.objects.filter(is_published=True)
    serializer_class = serializers.CurriculumDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = "curriculum_id"
    lookup_url_kwarg = "curriculum_id"

    def get_object(self):
        queryset = self.get_queryset()
        curriculum_id = self.kwargs.get("curriculum_id")
        slug = self.kwargs.get("slug")
        return get_object_or_404(queryset, curriculum_id=curriculum_id, slug=slug)


# =================
# Unit
# =================
class UnitDetailView(generics.RetrieveAPIView):
    queryset = models.Unit.objects.filter(is_published=True).prefetch_related(
        Prefetch(
            "unit_lessons", queryset=models.UnitLesson.objects.select_related("lesson")
        )
    )
    serializer_class = serializers.UnitDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = "unit_id"
    lookup_url_kwarg = "unit_id"

    def get_object(self):
        queryset = self.get_queryset()
        unit_id = self.kwargs.get("unit_id")
        slug = self.kwargs.get("slug")
        return get_object_or_404(queryset, unit_id=unit_id, slug=slug)
