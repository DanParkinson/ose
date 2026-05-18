from django.urls import path
from .views import (
    subject_views,
)

urlpatterns = [
    # ============
    # Subjects
    # ============
    path(
        "subjects/", subject_views.SubjectListCreateView.as_view(), name="subject-list"
    ),
]
