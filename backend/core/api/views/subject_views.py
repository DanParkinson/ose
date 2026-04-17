from rest_framework import generics, status, permissions
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from ... import models
from ..serializers import subject_serializers


class SubjectListCreateView(generics.ListCreateAPIView):
    queryset = models.Subject.objects.all()
    serializer_class = subject_serializers.SubjectSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]


class SubjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Subject.objects.all()
    serializer_class = subject_serializers.SubjectSerializer
    protected_delete_message = (
        "This Subject cannot be deleted. Contact SuperUser if intended."
    )

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get_object(self):
        queryset = self.get_queryset()
        subject_id = self.kwargs.get("subject_id")
        subject_slug = self.kwargs.get("subject_slug")
        return get_object_or_404(queryset, subject_id=subject_id, slug=subject_slug)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        if instance.is_protected:
            return Response(
                {
                    "detail": "This Subject is protected and cannot be updated. Contact Admin"
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        if instance.is_protected:
            return Response(
                {"detail": "This Subject cannot be deleted. Contact Admin"},
                status=status.HTTP_403_FORBIDDEN,
            )

        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
