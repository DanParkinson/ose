from rest_framework import generics, status, permissions
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from ... import models
from ..serializers import lesson_name_serializers


class LessonNameListCreateView(generics.ListCreateAPIView):
    queryset = models.LessonName.objects.prefetch_related("subjects")
    serializer_class = lesson_name_serializers.LessonNameSerializer
    permission_classes = [permissions.IsAdminUser]


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
