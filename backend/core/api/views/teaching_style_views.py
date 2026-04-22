from rest_framework import generics, status, permissions
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from ... import models
from ..serializers import teaching_style_serializers


class TeachingStyleListView(generics.ListCreateAPIView):
    queryset = models.TeachingStyle.objects.all()
    serializer_class = teaching_style_serializers.TeachingStyleSerializer
    permission_classes = [permissions.IsAdminUser]


class TeachingStyleDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.TeachingStyle.objects.all()
    serializer_class = teaching_style_serializers.TeachingStyleSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_object(self):
        queryset = self.get_queryset()
        teaching_style_id = self.kwargs.get("teaching_style_id")
        teaching_style_slug = self.kwargs.get("teaching_style_slug")
        return get_object_or_404(
            queryset, teaching_style_id=teaching_style_id, slug=teaching_style_slug
        )

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        if instance.is_protected:
            return Response(
                {
                    "detail": "This Teaching Style is protected and cannot be updated. Contact Admin"
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        if instance.is_protected:
            return Response(
                {"detail": "This Teaching Style cannot be deleted. Contact Admin"},
                status=status.HTTP_403_FORBIDDEN,
            )

        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
