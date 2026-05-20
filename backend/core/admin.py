from django.contrib import admin
from . import models


@admin.register(models.Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "level",
        "language",
        "is_published",
        "is_protected",
        "subject_id",
    )
    search_fields = (
        "title",
        "level",
        "language",
        "is_published",
        "is_protected",
    )
    list_filter = (
        "level",
        "language",
        "is_published",
        "is_protected",
    )
    readonly_fields = ("slug", "subject_id")
