from django.db import models
from django.utils.text import slugify
from django.core.exceptions import ValidationError
import uuid


class Subject(models.Model):
    LEVEL_CHOICES = [
        ("gcse", "GCSE"),
    ]
    LANGUAGE_CHOICES = [
        ("en", "English"),
    ]
    subject_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=50)
    slug = models.SlugField(blank=True, max_length=100, unique=True)
    level = models.CharField(max_length=10, choices=LEVEL_CHOICES)
    language = models.CharField(max_length=2, choices=LANGUAGE_CHOICES)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=100, blank=True)

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
        return f"{self.title}"


class Topic(models.Model):
    topic_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=50)
    slug = models.SlugField(blank=True, max_length=100)
    subject = models.ForeignKey(
        Subject,
        on_delete=models.CASCADE,
        related_name="topics",
    )
    description = models.TextField(blank=True)

    class Meta:
        ordering = ["subject", "title"]
        constraints = [
            models.UniqueConstraint(
                fields=["subject", "title"],
                name="unique_topic_title_per_subject",
            )
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(f"{self.subject}-{self.title}")
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.subject}-{self.title}"


class Lesson(models.Model):
    VARIANT_CHOICES = [
        ("base", "Base"),
        ("no_negatives", "No Negatives"),
    ]
    lesson_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=50)
    variant = models.CharField(max_length=50, choices=VARIANT_CHOICES, default="base")
    topic = models.ForeignKey(
        Topic,
        on_delete=models.CASCADE,
        related_name="lessons",
    )
    slug = models.SlugField(blank=True, max_length=200)
    description = models.TextField(blank=True)
    resources = models.ManyToManyField(
        "Resource",
        through="LessonResource",
        related_name="lessons",
    )
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["title"]
        constraints = [
            models.UniqueConstraint(
                fields=["topic", "title", "variant"],
                name="unique_lesson_title_variant_per_topic",
            )
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(f"{self.topic}-{self.title}-{self.variant}")
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title}-{self.variant}"


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
    title = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(blank=True, max_length=250)
    category = models.CharField(max_length=20, choices=RESOURCE_CATEGORY_CHOICES)
    description = models.TextField(blank=True)
    file = models.FileField(upload_to="resources/", blank=True, null=True)
    url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["title", "category"]

    def clean(self):
        super().clean()
        if self.category in {"video", "link"}:
            if not self.url:
                raise ValidationError({"url": "This resource must have a URL."})
            if self.file:
                raise ValidationError({"file": "This resource should not have a file."})
        else:
            if not self.file and not self.url:
                raise ValidationError("This resource must have either a file or a URL.")

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(f"{self.title}")
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title}-{self.category}"


# ==================================
# Curriculum
# ==================================
class Curriculum(models.Model):
    curriculum_id = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False
    )
    title = models.CharField(max_length=100)
    subject = models.ForeignKey(
        "Subject",
        on_delete=models.CASCADE,
        related_name="curriculums",
    )
    description = models.TextField(blank=True)
    slug = models.SlugField(blank=True, max_length=200, unique=True)
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["subject", "title"]
        constraints = [
            models.UniqueConstraint(
                fields=["subject", "title"],
                name="unique_curriculum_title_per_subject",
            )
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(f"{self.subject.title}-{self.title}")
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.subject.title}-{self.title}"


class Unit(models.Model):
    YEAR_GROUP_CHOICES = [
        ("year_7", "Year 7"),
        ("year_8", "Year 8"),
        ("year_9", "Year 9"),
        ("year_10", "Year 10"),
        ("year_11", "Year 11"),
    ]

    LEVEL_CHOICES = [
        ("core", "Core"),
        ("red", "Red"),
        ("amber", "Amber"),
        ("green", "Green"),
        ("blue", "Blue"),
        ("mixed_ability", "Mixed Ability"),
        ("general", "General"),
        ("no_level_assigned", "No Level Assigned"),
    ]

    unit_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    curriculum = models.ForeignKey(
        Curriculum,
        on_delete=models.CASCADE,
        related_name="units",
    )
    year_group = models.CharField(max_length=20, choices=YEAR_GROUP_CHOICES)
    level = models.CharField(
        max_length=20, choices=LEVEL_CHOICES, default="no_level_assigned"
    )
    order = models.PositiveSmallIntegerField()
    lessons = models.ManyToManyField(
        "Lesson",
        through="UnitLesson",
        related_name="units",
    )
    slug = models.SlugField(blank=True, max_length=100)
    description = models.TextField(blank=True)
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = [
            "curriculum",
            "year_group",
            "level",
            "order",
        ]
        constraints = [
            models.UniqueConstraint(
                fields=["curriculum", "year_group", "level", "order"],
                name="unique_unit_per_curriculum_year_level_order",
            ),
            models.CheckConstraint(
                check=models.Q(order__gte=1) & models.Q(order__lte=6),
                name="unit_order_between_1_and_6",
            ),
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(
                f"{self.curriculum.title}-{self.year_group}-{self.level}-{self.order}"
            )
        super().save(*args, **kwargs)

    def __str__(self):
        level_display = self.get_level_display() if self.level else "General"
        return (
            f"{self.curriculum.title} | "
            f"{self.get_year_group_display()} | "
            f"{level_display} | "
            f"Half Term {self.order}"
        )


# ===================================
# Organisation
# ==================================
class UnitLesson(models.Model):
    unit = models.ForeignKey(
        Unit,
        on_delete=models.CASCADE,
        related_name="unit_lessons",
    )
    lesson = models.ForeignKey(
        "Lesson",
        on_delete=models.CASCADE,
        related_name="lesson_units",
    )
    order = models.PositiveIntegerField(default=1)

    class Meta:
        ordering = ["unit", "order"]
        constraints = [
            models.UniqueConstraint(
                fields=["unit", "lesson"],
                name="unique_unit_lesson",
            ),
            models.UniqueConstraint(
                fields=["unit", "order"],
                name="unique_lesson_order_per_unit",
            ),
        ]

    def __str__(self):
        return f"{self.unit.year_group}-{self.unit.level}-{self.unit.order}-{self.lesson.title}-({self.order})"


class LessonResource(models.Model):
    lesson = models.ForeignKey(
        Lesson,
        on_delete=models.CASCADE,
        related_name="lesson_resources",
    )
    resource = models.ForeignKey(
        Resource,
        on_delete=models.CASCADE,
        related_name="resource_lessons",
    )
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["lesson", "order"]
        constraints = [
            models.UniqueConstraint(
                fields=["lesson", "resource"],
                name="unique_lesson_resource",
            )
        ]

    def __str__(self):
        return f"{self.lesson.title}-{self.resource.title}-({self.order})"
