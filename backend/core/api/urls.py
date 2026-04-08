from django.urls import path
from . import views

urlpatterns = [
    # Subjects
    path("subjects/", views.SubjectListView.as_view(), name="subject-list"),
    path(
        "subjects/<slug:slug>/<uuid:subject_id>/",
        views.SubjectDetailView.as_view(),
        name="subject-detail",
    ),
    # Topics
    # path('topics/', views.TopicListView.as_view(), name = "topic-list"),
    path(
        "topics/<slug:slug>/<uuid:topic_id>/",
        views.TopicDetailView.as_view(),
        name="topic-detail",
    ),
    # Lessons
    path(
        "lessons/<slug:slug>/<uuid:lesson_id>/",
        views.LessonDetailView.as_view(),
        name="lesson-detail",
    ),
    # Curriculum
    path(
        "curriculums/<slug:slug>/<uuid:curriculum_id>/",
        views.CurriculumDetailView.as_view(),
        name="curriculum-detail",
    ),
    # Units
    path(
        "units/<slug:slug>/<uuid:unit_id>/",
        views.UnitDetailView.as_view(),
        name="unit-detail",
    ),
]
