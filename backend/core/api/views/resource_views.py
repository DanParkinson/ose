from rest_framework import generics, status, permissions, filters
from rest_framework.response import Response
from django.db.models import Prefetch
from django.shortcuts import get_object_or_404
from ... import models
from ..serializers import resource_serializers


# ======================
# Resources
# ======================
class ResourceBySubjectListView(generics.ListCreateAPIView):
    serializer_class = resource_serializers.ResourceBySubjectSerializer
    permission_classes = [permissions.IsAdminUser]
    filter_backends = [filters.SearchFilter]
    search_fields = ["title"]

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

        matching_subjects = models.Subject.objects.filter(
            subject_id=subject.subject_id,
            slug=subject.slug,
        )

        return (
            models.Resource.objects.filter(
                subjects=subject,
            )
            .prefetch_related(Prefetch("subjects", queryset=matching_subjects))
            .distinct()
        )

    def perform_create(self, serializer):
        subject = self.get_subject()
        resource = serializer.save(author=self.request.user)
        resource.subjects.add(subject)


class ResourceBySubjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Resource.objects.prefetch_related("subjects")
    serializer_class = resource_serializers.ResourceBySubjectSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_object(self):
        queryset = self.get_queryset()
        resource_id = self.kwargs.get("resource_id")
        resource_slug = self.kwargs.get("resource_slug")

        return get_object_or_404(
            queryset,
            resource_id=resource_id,
            slug=resource_slug,
        )

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        if instance.is_protected:
            return Response(
                {
                    "detail": "This Resource is protected and cannot be updated. Contact Admin"
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        if instance.is_protected:
            return Response(
                {"detail": "This Resource cannot be deleted. Contact Admin"},
                status=status.HTTP_403_FORBIDDEN,
            )

        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
