# DRF generic views and API utilities
from rest_framework import generics, status, permissions, filters
from rest_framework.response import Response

# Django helpers
from django.shortcuts import get_object_or_404
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page

# Filtering
from django_filters.rest_framework import DjangoFilterBackend

# Project models
from ... import models

# App serializers
from ..serializers import lesson_name_serializers


class LessonNameListCreateView(generics.ListCreateAPIView):
    queryset = models.LessonName.objects.prefetch_related("subjects")
    serializer_class = lesson_name_serializers.LessonNameSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = [
        "subjects",
        "is_protected",
    ]
    search_fields = ["title"]

    def get_permissions(self):
        if self.request.method == "POST":
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]

    @method_decorator(cache_page(60 * 60 * 24, key_prefix="lesson_name_list"))
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)


class LessonNameBySubjectListView(generics.ListAPIView):
    serializer_class = lesson_name_serializers.LessonNameBySubjectSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None

    def get_subject(self):
        return get_object_or_404(
            models.Subject,
            subject_id=self.kwargs["subject_id"],
            slug=self.kwargs["subject_slug"],
        )

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return models.LessonName.objects.none()

        subject = self.get_subject()
        topic_id = self.request.query_params.get("topic")

        queryset = models.LessonName.objects.filter(
            lesson_variants__subject=subject,
        )

        if topic_id:
            queryset = queryset.filter(
                lesson_variants__topic_id=topic_id,
            )

        return queryset.distinct().order_by("title")


class LessonNameDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.LessonName.objects.prefetch_related("subjects")
    serializer_class = lesson_name_serializers.LessonNameSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_object(self):
        queryset = self.get_queryset()
        lesson_name_id = self.kwargs.get("lesson_name_id")
        lesson_name_slug = self.kwargs.get("lesson_name_slug")
        return get_object_or_404(
            queryset, lesson_name_id=lesson_name_id, slug=lesson_name_slug
        )

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        if instance.is_protected:
            return Response(
                {
                    "detail": "This Lesson Name is protected and cannot be updated. Contact Admin"
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        if instance.is_protected:
            return Response(
                {"detail": "This Lesson Name cannot be deleted. Contact Admin"},
                status=status.HTTP_403_FORBIDDEN,
            )

        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
