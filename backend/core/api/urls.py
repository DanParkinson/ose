from django.urls import path
from .views import (
    subject_views,
    topic_views,
    lesson_name_views,
    variation_views,
    teaching_style_views,
    resource_views,
    lesson_variant_views,
    lesson_variant_resource_views,
    filter_views,
)

urlpatterns = [
    # ============
    # Subjects
    # ============
    path(
        "subjects/", subject_views.SubjectListCreateView.as_view(), name="subject-list"
    ),
    path(
        "subjects/<slug:subject_slug>/<uuid:subject_id>/",
        subject_views.SubjectDetailView.as_view(),
        name="subject-detail",
    ),
    # =============
    # Topics
    # =============
    path("topics/", topic_views.TopicListCreateView.as_view(), name="topic-list"),
    path(
        "topics/<slug:topic_slug>/<uuid:topic_id>/",
        topic_views.TopicDetailView.as_view(),
        name="topic-detail",
    ),
    # =============
    # LessonNames
    # =============
    path(
        "lesson_names/",
        lesson_name_views.LessonNameListCreateView.as_view(),
        name="lesson-name-list",
    ),
    path(
        "lesson_names/<slug:lesson_name_slug>/<uuid:lesson_name_id>/",
        lesson_name_views.LessonNameDetailView.as_view(),
        name="lesson-name-detail",
    ),
    # =============
    # Variation
    # =============
    path(
        "variations/",
        variation_views.VariationListView.as_view(),
        name="variation-list",
    ),
    path(
        "variations/<slug:variation_slug>/<uuid:variation_id>/",
        variation_views.VariationDetailView.as_view(),
        name="variation-detail",
    ),
    # =============
    # Teaching Style
    # =============
    path(
        "teaching_styles/",
        teaching_style_views.TeachingStyleListView.as_view(),
        name="teaching-style-list",
    ),
    path(
        "teaching_styles/<slug:teaching_style_slug>/<uuid:teaching_style_id>/",
        teaching_style_views.TeachingStyleDetailListView.as_view(),
        name="teaching-style-detail",
    ),
    # ==============
    # Resources
    # ==============
    path(
        "subjects/<slug:subject_slug>/<uuid:subject_id>/resources/",
        resource_views.ResourceBySubjectListView.as_view(),
        name="resource-by-subject-list",
    ),
    path(
        "subjects/<slug:subject_slug>/<uuid:subject_id>/resources/<slug:resource_slug>/<uuid:resource_id>/",
        resource_views.ResourceBySubjectDetailView.as_view(),
        name="resource-by-subject-detail",
    ),
    # # ==============
    # # Lesson Variants
    # # ==============
    path(
        "subjects/<slug:subject_slug>/<uuid:subject_id>/lessons/",
        lesson_variant_views.LessonVariantBySubjectListView.as_view(),
        name="lesson-list",
    ),
    path(
        "subjects/<slug:subject_slug>/<uuid:subject_id>/lessons/create/",
        lesson_variant_views.LessonVariantCreateView.as_view(),
        name="lesson-create",
    ),
    path(
        "subjects/<slug:subject_slug>/<uuid:subject_id>/lessons/<slug:lesson_variant_slug>/<uuid:lesson_variant_id>/",
        lesson_variant_views.LessonVariantDetailView.as_view(),
        name="lesson-detail",
    ),
    path(
        "subjects/<slug:subject_slug>/<uuid:subject_id>/lessons/<slug:lesson_variant_slug>/<uuid:lesson_variant_id>/resources/",
        lesson_variant_views.LessonVariantWithNestedResourcesDetailView.as_view(),
        name="lesson-with-resource-detail",
    ),
    # ===================
    # Lesson Variant Resource
    # ===================
    path(
        "subjects/<slug:subject_slug>/<uuid:subject_id>/lessons/<slug:lesson_variant_slug>/<uuid:lesson_variant_id>/resources/create/",
        lesson_variant_resource_views.LessonVariantResourceCreateView.as_view(),
        name="lesson-variant-resource-create",
    ),
    path(
        "subjects/<slug:subject_slug>/<uuid:subject_id>/lessons/<slug:lesson_variant_slug>/<uuid:lesson_variant_id>/resources/attach/",
        lesson_variant_resource_views.LessonVariantResourceAttachView.as_view(),
        name="lesson-variant-resource-attach",
    ),
    path(
        "subjects/<slug:subject_slug>/<uuid:subject_id>/lessons/<slug:lesson_variant_slug>/<uuid:lesson_variant_id>/resources/<uuid:resource_id>/delete/",
        lesson_variant_resource_views.LessonVariantResourceDestroyView.as_view(),
        name="lesson-variant-resource-delete",
    ),
    # =============
    # Filter List finders
    # =============
    path(
        "subjects/<slug:subject_slug>/<uuid:subject_id>/filter/topics/",
        filter_views.FilterTopicBySubjectListView.as_view(),
        name="filter-topic-by-subject",
    ),
    path(
        "subjects/<slug:subject_slug>/<uuid:subject_id>/filter/lessonnames/",
        filter_views.FilterLessonNameBySubjectListView.as_view(),
        name="filter-lesson-name-by-subject",
    ),
    path(
        "subjects/<slug:subject_slug>/<uuid:subject_id>/filter/teachingstyles/",
        filter_views.FilterTeachingStyleListView.as_view(),
        name="filter-teaching-style",
    ),
    path(
        "subjects/<slug:subject_slug>/<uuid:subject_id>/filter/variations/",
        filter_views.FilterVariationListView.as_view(),
        name="filter-variation",
    ),
]
