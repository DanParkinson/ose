# DRF generic views and API utilities
from rest_framework import generics, status, permissions, filters
from rest_framework.response import Response

# Django helpers
from django.shortcuts import get_object_or_404

# Caching
from django.core.cache import cache

# Filtering
from django_filters.rest_framework import DjangoFilterBackend

# Project models
from ... import models

# App serializers
from ..serializers import topic_serializers


class TopicListCreateView(generics.ListCreateAPIView):
    queryset = models.Topic.objects.prefetch_related("subjects")
    serializer_class = topic_serializers.TopicSerializer
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

    def list(self, request, *args, **kwargs):
        cache_key = f"topic_list:{request.get_full_path()}"

        cached_data = cache.get(cache_key)

        if cached_data is not None:
            # print("TOPIC LIST FROM CACHE")
            return Response(cached_data)

        # print("TOPIC LIST FROM DATABASE")

        response = super().list(request, *args, **kwargs)

        cache.set(cache_key, response.data, timeout=60 * 60 * 24)

        return response


class TopicBySubjectListView(generics.ListAPIView):
    serializer_class = topic_serializers.TopicBySubjectListSerializer
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
            return models.Topic.objects.none()

        subject = self.get_subject()

        return (
            models.Topic.objects.filter(lesson_variants__subject=subject)
            .distinct()
            .order_by("title")
        )


class TopicDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Topic.objects.prefetch_related("subjects")
    serializer_class = topic_serializers.TopicSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_object(self):
        queryset = self.get_queryset()
        topic_id = self.kwargs.get("topic_id")
        topic_slug = self.kwargs.get("topic_slug")
        return get_object_or_404(queryset, topic_id=topic_id, slug=topic_slug)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        if instance.is_protected:
            return Response(
                {
                    "detail": "This Topic is protected and cannot be updated. Contact Admin"
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        if instance.is_protected:
            return Response(
                {"detail": "This Topic cannot be deleted. Contact Admin"},
                status=status.HTTP_403_FORBIDDEN,
            )

        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
