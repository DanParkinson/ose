from django.contrib import admin
from django.urls import path, include

from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)

from dj_rest_auth.views import PasswordResetConfirmView


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("accounts.api.urls")),
    # auth
    path("api/auth/", include("dj_rest_auth.urls")),
    path("api/auth/registration/", include("dj_rest_auth.registration.urls")),
    path(
        "reset-password/<uidb64>/<token>/",
        PasswordResetConfirmView.as_view(),
        name="password_reset_confirm",
    ),
    # Extensions
    path("summernote/", include("django_summernote.urls")),
    path("silk/", include("silk.urls", namespace="silk")),
    # Apps
    path("core/", include("core.api.urls")),
    # Optional UI:
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path(
        "api/schema/swagger-ui/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
    path(
        "api/schema/redoc/",
        SpectacularRedocView.as_view(url_name="schema"),
        name="redoc",
    ),
]
