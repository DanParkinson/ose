from django.db import models
from django.utils.text import slugify
import uuid
from django.contrib.auth import get_user_model

User = get_user_model()


class Subject(models.Model):
    LEVEL_CHOICES = [
        ("gcse", "GCSE"),
    ]
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
        return f"{self.title} - ({self.level} {self.language})"


class Topic(models.Model):
    topic_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=50)
    subjects = models.ManyToManyField(Subject, related_name="topics")
    slug = models.SlugField(blank=True, max_length=500)
    is_protected = models.BooleanField(default=False)

    class Meta:
        ordering = ["title"]
        constraints = [
            models.UniqueConstraint(
                fields=["title"],
                name="unique_topic_title",
            )
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(f"{self.title}")
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title}"


class LessonName(models.Model):
    lesson_name_id = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False
    )
    title = models.CharField(max_length=100)
    subjects = models.ManyToManyField(Subject, related_name="lesson_names")
    slug = models.SlugField(blank=True, max_length=100)
    is_protected = models.BooleanField(default=False)

    class Meta:
        ordering = ["title"]
        constraints = [
            models.UniqueConstraint(
                fields=["title"],
                name="unique_lesson_title",
            )
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(f"{self.title}")
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title}"


class Variation(models.Model):
    variation_id = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False
    )
    title = models.CharField(max_length=100)
    slug = models.SlugField(blank=True, max_length=100)
    is_protected = models.BooleanField(default=False)

    class Meta:
        ordering = ["title"]
        constraints = [
            models.UniqueConstraint(
                fields=["title"],
                name="unique_variation_title",
            )
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(f"{self.title}")
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title}"


class TeachingStyle(models.Model):
    teaching_style_id = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False
    )
    title = models.CharField(max_length=100)
    slug = models.SlugField(blank=True, max_length=100)
    is_protected = models.BooleanField(default=False)

    class Meta:
        ordering = ["title"]
        constraints = [
            models.UniqueConstraint(
                fields=["title"],
                name="unique_teaching_style_title",
            )
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(f"{self.title}")
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title}"


class Resource(models.Model):
    RESOURCE_CATEGORY_CHOICES = [
        ("slide", "Slide"),
        ("worksheet", "Worksheet"),
        ("video", "Video"),
        ("template", "Template"),
        ("file", "File"),
        ("link", "Link"),
    ]
    resource_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=50)
    slug = models.SlugField(blank=True, max_length=250)
    category = models.CharField(max_length=20, choices=RESOURCE_CATEGORY_CHOICES)
    description = models.TextField(blank=True)
    file = models.FileField(upload_to="resources/", blank=True, null=True)
    url = models.URLField(blank=True, null=True)
    is_protected = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="resources",
    )
    subjects = models.ManyToManyField(Subject, related_name="resources")

    class Meta:
        ordering = ["title", "category"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(f"{self.title}")
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title}-{self.category}"


class LessonVariant(models.Model):
    lesson_variant_id = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False
    )
    subject = models.ForeignKey(
        Subject, on_delete=models.CASCADE, related_name="lesson_variants"
    )
    topic = models.ForeignKey(
        Topic, on_delete=models.CASCADE, related_name="lesson_variants"
    )
    lesson_name = models.ForeignKey(
        LessonName,
        on_delete=models.CASCADE,
        related_name="lesson_variants",
    )
    teaching_style = models.ForeignKey(
        TeachingStyle,
        on_delete=models.CASCADE,
        related_name="lesson_variants",
    )
    variation = models.ForeignKey(
        Variation,
        on_delete=models.CASCADE,
        related_name="lesson_variants",
    )
    resources = models.ManyToManyField(
        "Resource", through="LessonVariantResource", related_name="lesson_variants"
    )
    slug = models.SlugField(blank=True, max_length=300)
    is_published = models.BooleanField(default=False)
    is_protected = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="lesson_variants",
    )

    class Meta:
        ordering = ["subject", "topic", "lesson_name", "teaching_style", "variation"]
        constraints = [
            models.UniqueConstraint(
                fields=[
                    "subject",
                    "topic",
                    "lesson_name",
                    "teaching_style",
                    "variation",
                ],
                name="unique_variation_per_lesson_name",
            )
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(
                f"{self.lesson_name.title}-{self.teaching_style.title}-{self.variation.title}"
            )
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.lesson_name.title} - ({self.teaching_style}-{self.variation})"


class LessonVariantResource(models.Model):
    lesson_variant = models.ForeignKey(
        LessonVariant,
        on_delete=models.CASCADE,
        related_name="lesson_variant_resources",
    )
    resource = models.ForeignKey(
        Resource,
        on_delete=models.CASCADE,
        related_name="resource_lesson_variants",
    )
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["lesson_variant", "order"]
        constraints = [
            models.UniqueConstraint(
                fields=["lesson_variant", "resource"],
                name="unique_lesson_variant_resource",
            )
        ]

    def __str__(self):
        return f"{self.lesson_variant.lesson_name.title}-{self.lesson_variant.teaching_style}-{self.lesson_variant.variation}-{self.resource.title}-({self.order})"
