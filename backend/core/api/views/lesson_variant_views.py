# from rest_framework import generics, status, permissions, filters
# from django_filters.rest_framework import DjangoFilterBackend
# from django.utils.decorators import method_decorator
# from django.views.decorators.cache import cache_page
# from rest_framework.response import Response
# from django.shortcuts import get_object_or_404
# from ... import models
# from ..serializers import lesson_variant_serializers
# from .. import custom_filters


# class LessonVariantBySubjectListView(generics.ListAPIView):
#     serializer_class = lesson_variant_serializers.LessonVariantBySubjectListSerializer
#     permission_classes = [permissions.AllowAny]
#     filter_backends = [DjangoFilterBackend, filters.SearchFilter]
#     filterset_class = custom_filters.LessonVariantFilter
#     search_fields = ["lesson_name__title", "topic__title", "variation__title"]

#     def get_subject(self):
#         subject_id = self.kwargs["subject_id"]
#         subject_slug = self.kwargs["subject_slug"]

#         return get_object_or_404(
#             models.Subject,
#             subject_id=subject_id,
#             slug=subject_slug,
#         )

#     def get_queryset(self):
#         if getattr(self, "swagger_fake_view", False):
#             return models.LessonVariant.objects.none()

#         subject = self.get_subject()
#         return models.LessonVariant.objects.select_related(
#             "lesson_name",
#             "topic",
#             "subject",
#             "author",
#         ).filter(subject=subject)


# class UniqueLessonVariantLessonListView(generics.ListAPIView):
#     permission_classes = [permissions.AllowAny]
#     filter_backends = [DjangoFilterBackend, filters.SearchFilter]
#     filterset_class = custom_filters.UniqueLessonVariantFilter
#     search_fields = [
#         "lesson_name__title",
#         "topic__title",
#     ]

#     def get_subject(self):
#         return get_object_or_404(
#             models.Subject,
#             subject_id=self.kwargs["subject_id"],
#             slug=self.kwargs["subject_slug"],
#         )

#     def get_queryset(self):
#         if getattr(self, "swagger_fake_view", False):
#             return models.LessonVariant.objects.none()

#         subject = self.get_subject()

#         return (
#             models.LessonVariant.objects.filter(subject=subject)
#             .values(
#                 "topic_id",
#                 "topic__title",
#                 "lesson_name_id",
#                 "lesson_name__title",
#             )
#             .distinct()
#             .order_by(
#                 "topic__title",
#                 "lesson_name__title",
#             )
#         )

#     def format_data(self, queryset):
#         return [
#             {
#                 "topic_id": item["topic_id"],
#                 "topic": item["topic__title"],
#                 "lesson_name_id": item["lesson_name_id"],
#                 "lesson_name": item["lesson_name__title"],
#             }
#             for item in queryset
#         ]

#     def list(self, request, *args, **kwargs):
#         queryset = self.filter_queryset(self.get_queryset())

#         page = self.paginate_queryset(queryset)

#         if page is not None:
#             data = self.format_data(page)
#             return self.get_paginated_response(data)

#         data = self.format_data(queryset)
#         return Response(data)


# class LessonVariantListByLessonView(generics.ListAPIView):
#     serializer_class = lesson_variant_serializers.LessonVariantBySubjectListSerializer
#     permission_classes = [permissions.AllowAny]

#     def get_subject(self):
#         return get_object_or_404(
#             models.Subject,
#             subject_id=self.kwargs["subject_id"],
#             slug=self.kwargs["subject_slug"],
#         )

#     def get_queryset(self):
#         if getattr(self, "swagger_fake_view", False):
#             return models.LessonVariant.objects.none()

#         subject = self.get_subject()
#         topic_id = self.request.query_params.get("topic")
#         lesson_name_id = self.request.query_params.get("lesson_name")

#         queryset = (
#             models.LessonVariant.objects.select_related(
#                 "subject",
#                 "topic",
#                 "lesson_name",
#                 "teaching_style",
#                 "variation",
#                 "author",
#             )
#             .prefetch_related(
#                 "lesson_variant_resources__resource",
#             )
#             .filter(subject=subject)
#         )

#         if topic_id:
#             queryset = queryset.filter(topic_id=topic_id)

#         if lesson_name_id:
#             queryset = queryset.filter(lesson_name_id=lesson_name_id)

#         return queryset.order_by(
#             "teaching_style__title",
#             "variation__title",
#         )


# class LessonVariantCreateView(generics.CreateAPIView):
#     serializer_class = lesson_variant_serializers.LessonVariantWriteSerializer
#     permission_classes = [permissions.IsAdminUser]

#     def get_subject(self):
#         if not hasattr(self, "_subject"):
#             self._subject = get_object_or_404(
#                 models.Subject,
#                 subject_id=self.kwargs["subject_id"],
#                 slug=self.kwargs["subject_slug"],
#             )
#         return self._subject

#     def get_serializer_context(self):
#         context = super().get_serializer_context()
#         context["subject"] = self.get_subject()
#         return context

#     def perform_create(self, serializer):
#         serializer.save(
#             subject=self.get_subject(),
#             author=self.request.user,
#         )


# class LessonVariantDetailView(generics.RetrieveUpdateDestroyAPIView):
#     def get_subject(self):
#         if not hasattr(self, "_subject"):
#             self._subject = get_object_or_404(
#                 models.Subject,
#                 subject_id=self.kwargs["subject_id"],
#                 slug=self.kwargs["subject_slug"],
#             )
#         return self._subject

#     def get_queryset(self):
#         return models.LessonVariant.objects.select_related(
#             "lesson_name",
#             "teaching_style",
#             "variation",
#             "topic",
#             "subject",
#             "author",
#         ).filter(subject=self.get_subject())

#     def get_object(self):
#         return get_object_or_404(
#             self.get_queryset(),
#             lesson_variant_id=self.kwargs["lesson_variant_id"],
#             slug=self.kwargs["lesson_variant_slug"],
#         )

#     def get_permissions(self):
#         if self.request.method in permissions.SAFE_METHODS:
#             return [permissions.AllowAny()]
#         return [permissions.IsAdminUser()]

#     @method_decorator(cache_page(60 * 60 * 24, key_prefix="lesson_variant_detail"))
#     def retrieve(self, request, *args, **kwargs):
#         return super().retrieve(request, *args, **kwargs)

#     def get_serializer_class(self):
#         if self.request.method in ["PUT", "PATCH"]:
#             return lesson_variant_serializers.LessonVariantUpdateSerializer
#         return lesson_variant_serializers.LessonVariantDetailReadOnlySerializer

#     def get_serializer_context(self):
#         context = super().get_serializer_context()
#         context["subject"] = self.get_subject()
#         return context

#     def update(self, request, *args, **kwargs):
#         instance = self.get_object()

#         if instance.is_protected:
#             return Response(
#                 {
#                     "detail": "This Lesson Variant is protected and cannot be updated. Contact Admin"
#                 },
#                 status=status.HTTP_403_FORBIDDEN,
#             )

#         return super().update(request, *args, **kwargs)

#     def destroy(self, request, *args, **kwargs):
#         instance = self.get_object()

#         if instance.is_protected:
#             return Response(
#                 {"detail": "This Lesson Variant cannot be deleted. Contact Admin"},
#                 status=status.HTTP_403_FORBIDDEN,
#             )

#         self.perform_destroy(instance)
#         return Response(status=status.HTTP_204_NO_CONTENT)


# class LessonVariantWithNestedResourcesDetailView(generics.RetrieveAPIView):
#     serializer_class = (
#         lesson_variant_serializers.LessonVariantWithNestedResourcesDetailSerializer
#     )
#     permission_classes = [permissions.AllowAny]
#     lookup_field = "lesson_variant_id"
#     lookup_url_kwarg = "lesson_variant_id"

#     @method_decorator(
#         cache_page(60 * 60 * 24, key_prefix="lesson_variant_with_resources_detail")
#     )
#     def retrieve(self, request, *args, **kwargs):
#         return super().retrieve(request, *args, **kwargs)

#     def get_queryset(self):
#         subject_id = self.kwargs["subject_id"]

#         return (
#             models.LessonVariant.objects.select_related(
#                 "subject",
#                 "topic",
#                 "lesson_name",
#                 "teaching_style",
#                 "variation",
#             )
#             .prefetch_related(
#                 "lesson_variant_resources__resource",
#             )
#             .filter(
#                 subject_id=subject_id,
#             )
#         )
