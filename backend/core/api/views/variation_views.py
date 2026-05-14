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
from ..serializers import variation_serializers


class VariationListView(generics.ListCreateAPIView):
    queryset = models.Variation.objects.all()
    serializer_class = variation_serializers.VariationSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = [
        "is_protected",
    ]
    search_fields = ["title"]

    def get_permissions(self):
        if self.request.method == "POST":
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]

    @method_decorator(cache_page(60 * 60 * 24, key_prefix="variation_list"))
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)


class VariationDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Variation.objects.all()
    serializer_class = variation_serializers.VariationSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_object(self):
        queryset = self.get_queryset()
        variation_id = self.kwargs.get("variation_id")
        variation_slug = self.kwargs.get("variation_slug")
        return get_object_or_404(
            queryset, variation_id=variation_id, slug=variation_slug
        )

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        if instance.is_protected:
            return Response(
                {
                    "detail": "This Variation is protected and cannot be updated. Contact Admin"
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        if instance.is_protected:
            return Response(
                {"detail": "This Variation cannot be deleted. Contact Admin"},
                status=status.HTTP_403_FORBIDDEN,
            )

        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
