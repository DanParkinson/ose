from rest_framework import generics, status, permissions
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from ... import models
from ..serializers import variation_serializers


class VariationListView(generics.ListCreateAPIView):
    queryset = models.Variation.objects.all()
    serializer_class = variation_serializers.VariationSerializer
    permission_classes = [permissions.IsAdminUser]


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
