from django.db import models
from django.utils.text import slugify
import uuid
from django.contrib.auth import get_user_model

User = get_user_model()


class Subject(models.Model):
    LEVEL_CHOICES = [("secondary", "Secondary"), ("primary", "Primary")]
    LANGUAGE_CHOICES = [
        ("en", "English"),
    ]
    subject_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=50)
    slug = models.SlugField(blank=True, max_length=500)
    level = models.CharField(max_length=10, choices=LEVEL_CHOICES)
    language = models.CharField(max_length=2, choices=LANGUAGE_CHOICES)
    is_published = models.BooleanField(default=False)
    is_protected = models.BooleanField(default=False)

    class Meta:
        ordering = ["title"]
        constraints = [
            models.UniqueConstraint(
                fields=["title", "level", "language"],
                name="unique_subject_title_level_language",
            )
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(f"{self.title}-{self.level}-{self.language}")
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} - ({self.level})"
