from rest_framework import generics, status, permissions, response
from django.shortcuts import get_object_or_404
from ... import models
from ..serializers import lesson_variant_resource_serializers


class LessonVariantResourceCreateView(generics.CreateAPIView):
    serializer_class = (
        lesson_variant_resource_serializers.ResourceCreateForLessonVariantSerializer
    )
    permission_classes = [permissions.IsAdminUser]

    def get_subject(self):
        if not hasattr(self, "_subject"):
            self._subject = get_object_or_404(
                models.Subject,
                subject_id=self.kwargs["subject_id"],
                slug=self.kwargs["subject_slug"],
            )
        return self._subject

    def get_lesson_variant(self):
        if not hasattr(self, "_lesson_variant"):
            self._lesson_variant = get_object_or_404(
                models.LessonVariant.objects.select_related("subject"),
                lesson_variant_id=self.kwargs["lesson_variant_id"],
                slug=self.kwargs["lesson_variant_slug"],
                subject_id=self.kwargs["subject_id"],
            )
        return self._lesson_variant

    def get(self, request, *args, **kwargs):
        lesson_variant = self.get_lesson_variant()
        return response.Response(
            {
                "subject": lesson_variant.subject.title,
                "lesson_variant": str(lesson_variant.lesson_variant_id),
                "lesson_name": lesson_variant.lesson_name.title,
            }
        )

    def create(self, request, *args, **kwargs):
        lesson_variant = self.get_lesson_variant()

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        resource = serializer.save(author=request.user)
        order = serializer.validated_data.get("order", 0)

        lesson_variant_resource = models.LessonVariantResource.objects.create(
            lesson_variant=lesson_variant,
            resource=resource,
            order=order,
        )

        output_serializer = (
            lesson_variant_resource_serializers.LessonVariantResourceSerializer(
                lesson_variant_resource,
                context={"request": request},
            )
        )

        return response.Response(
            output_serializer.data,
            status=status.HTTP_201_CREATED,
        )


class LessonVariantResourceAttachView(generics.CreateAPIView):
    serializer_class = (
        lesson_variant_resource_serializers.LessonVariantResourceAttachSerializer
    )
    permission_classes = [permissions.IsAdminUser]

    def get_lesson_variant(self):
        if not hasattr(self, "_lesson_variant"):
            self._lesson_variant = get_object_or_404(
                models.LessonVariant.objects.select_related("subject"),
                lesson_variant_id=self.kwargs["lesson_variant_id"],
                slug=self.kwargs["lesson_variant_slug"],
                subject_id=self.kwargs["subject_id"],
            )
        return self._lesson_variant

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["lesson_variant"] = self.get_lesson_variant()
        return context

    def create(self, request, *args, **kwargs):
        lesson_variant = self.get_lesson_variant()

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        lesson_variant_resource = models.LessonVariantResource.objects.create(
            lesson_variant=lesson_variant,
            resource=serializer.validated_data["resource"],
        )

        output_serializer = (
            lesson_variant_resource_serializers.LessonVariantResourceSerializer(
                lesson_variant_resource,
                context={"request": request},
            )
        )

        return response.Response(
            output_serializer.data,
            status=status.HTTP_201_CREATED,
        )


class LessonVariantResourceDestroyView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAdminUser]

    def get_object(self):
        return get_object_or_404(
            models.LessonVariantResource.objects.select_related(
                "lesson_variant",
                "resource",
            ),
            lesson_variant__lesson_variant_id=self.kwargs["lesson_variant_id"],
            lesson_variant__slug=self.kwargs["lesson_variant_slug"],
            lesson_variant__subject_id=self.kwargs["subject_id"],
            resource__resource_id=self.kwargs["resource_id"],
        )

    def destroy(self, request, *args, **kwargs):
        lesson_variant_resource = self.get_object()
        resource = lesson_variant_resource.resource
        resource.delete()
        return response.Response(status=status.HTTP_204_NO_CONTENT)
