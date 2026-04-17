from rest_framework import generics, status, permissions
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from ... import models
from ..serializers import topic_serializers


class TopicListCreateView(generics.ListCreateAPIView):
    queryset = models.Topic.objects.prefetch_related("subjects")
    serializer_class = topic_serializers.TopicSerializer
    permission_classes = [permissions.IsAdminUser]


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
