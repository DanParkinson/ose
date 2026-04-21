from rest_framework import generics, status, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from ... import models
from ..serializers import lesson_variant_serializers
from .. import custom_filters


class LessonVariantBySubjectListView(generics.ListAPIView):
    serializer_class = lesson_variant_serializers.LessonVariantBySubjectListSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_class = custom_filters.LessonVariantFilter
    search_fields = ["lesson_name__title", "topic__title", "variation__title"]

    def get_subject(self):
        subject_id = self.kwargs["subject_id"]
        subject_slug = self.kwargs["subject_slug"]

        return get_object_or_404(
            models.Subject,
            subject_id=subject_id,
            slug=subject_slug,
        )

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return models.LessonVariant.objects.none()

        subject = self.get_subject()
        return models.LessonVariant.objects.select_related(
            "lesson_name",
            "teaching_style",
            "variation",
            "topic",
            "subject",
            "author",
        ).filter(subject=subject)


class LessonVariantCreateView(generics.CreateAPIView):
    serializer_class = lesson_variant_serializers.LessonVariantWriteSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_subject(self):
        if not hasattr(self, "_subject"):
            self._subject = get_object_or_404(
                models.Subject,
                subject_id=self.kwargs["subject_id"],
                slug=self.kwargs["subject_slug"],
            )
        return self._subject

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["subject"] = self.get_subject()
        return context

    def perform_create(self, serializer):
        serializer.save(
            subject=self.get_subject(),
            author=self.request.user,
        )


class LessonVariantDetailView(generics.RetrieveUpdateDestroyAPIView):
    def get_subject(self):
        if not hasattr(self, "_subject"):
            self._subject = get_object_or_404(
                models.Subject,
                subject_id=self.kwargs["subject_id"],
                slug=self.kwargs["subject_slug"],
            )
        return self._subject

    def get_queryset(self):
        return models.LessonVariant.objects.select_related(
            "lesson_name",
            "teaching_style",
            "variation",
            "topic",
            "subject",
            "author",
        ).filter(subject=self.get_subject())

    def get_object(self):
        return get_object_or_404(
            self.get_queryset(),
            lesson_variant_id=self.kwargs["lesson_variant_id"],
            slug=self.kwargs["lesson_variant_slug"],
        )

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get_serializer_class(self):
        if self.request.method in ["PUT", "PATCH"]:
            return lesson_variant_serializers.LessonVariantUpdateSerializer
        return lesson_variant_serializers.LessonVariantDetailReadOnlySerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["subject"] = self.get_subject()
        return context

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        if instance.is_protected:
            return Response(
                {
                    "detail": "This Lesson Variant is protected and cannot be updated. Contact Admin"
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        if instance.is_protected:
            return Response(
                {"detail": "This Lesson Variant cannot be deleted. Contact Admin"},
                status=status.HTTP_403_FORBIDDEN,
            )

        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


class LessonVariantWithNestedResourcesDetailView(generics.RetrieveAPIView):
    serializer_class = (
        lesson_variant_serializers.LessonVariantWithNestedResourcesDetailSerializer
    )
    permission_classes = [permissions.AllowAny]
    lookup_field = "lesson_variant_id"
    lookup_url_kwarg = "lesson_variant_id"

    def get_queryset(self):
        subject_id = self.kwargs["subject_id"]

        return (
            models.LessonVariant.objects.select_related(
                "subject",
                "topic",
                "lesson_name",
                "teaching_style",
                "variation",
            )
            .prefetch_related(
                "lesson_variant_resources__resource",
            )
            .filter(
                subject_id=subject_id,
            )
        )
