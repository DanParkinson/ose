from django.urls import path
from . import views

urlpatterns = [
    # Subjects
    path("subjects/", views.SubjectListView.as_view(), name="subject-list"),
    path(
        "subjects/<slug:subject_slug>/<uuid:subject_id>/",
        views.SubjectDetailView.as_view(),
        name="subject-detail",
    ),
    path(
        "subjects/<slug:subject_slug>/<uuid:subject_id>/lessons/",
        views.LessonVariantListView.as_view(),
        name="lesson-list",
    ),
    path(
        "subjects/<slug:subject_slug>/<uuid:subject_id>/lessons/<slug:lesson_variant_id>/resources/",
        views.LessonVariantResourceListView.as_view(),
        name="lesson-resources",
    ),
]
