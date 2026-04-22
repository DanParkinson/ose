import random

from django.contrib.auth import get_user_model
from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand

from core.models import (
    Subject,
    Topic,
    LessonName,
    TeachingStyle,
    Variation,
    LessonVariant,
    Resource,
    LessonVariantResource,
)

User = get_user_model()


class Command(BaseCommand):
    help = "Populate the database with simple loop-friendly sample data"

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.WARNING("Clearing existing data..."))

        LessonVariantResource.objects.all().delete()
        LessonVariant.objects.all().delete()
        Resource.objects.all().delete()
        LessonName.objects.all().delete()
        Topic.objects.all().delete()
        TeachingStyle.objects.all().delete()
        Variation.objects.all().delete()
        Subject.objects.all().delete()

        self.stdout.write(self.style.SUCCESS("Existing data cleared."))

        author = self.get_or_create_seed_user()

        self.stdout.write(self.style.WARNING("Creating seed data..."))

        teaching_style = self.get_or_create_teaching_style()
        variation = self.get_or_create_variation()

        # Easy-to-edit seed sizes
        subject_count = 3
        topics_per_subject = 3
        lessons_per_topic = 4

        for subject_index in range(1, subject_count + 1):
            subject = Subject.objects.create(
                title=f"subject-{subject_index}",
                level="gcse",
                language="en",
                is_published=True,
                is_protected=False,
            )

            for topic_index in range(1, topics_per_subject + 1):
                global_topic_number = (
                    (subject_index - 1) * topics_per_subject
                ) + topic_index

                topic, _ = Topic.objects.get_or_create(
                    title=f"topic-{global_topic_number}",
                    defaults={"is_protected": False},
                )
                topic.subjects.add(subject)

                for lesson_index in range(1, lessons_per_topic + 1):
                    global_lesson_number = (
                        ((subject_index - 1) * topics_per_subject * lessons_per_topic)
                        + ((topic_index - 1) * lessons_per_topic)
                        + lesson_index
                    )

                    lesson_name, _ = LessonName.objects.get_or_create(
                        title=f"lesson-{global_lesson_number}",
                        defaults={"is_protected": False},
                    )
                    lesson_name.subjects.add(subject)

                    lesson_variant = LessonVariant.objects.create(
                        subject=subject,
                        topic=topic,
                        lesson_name=lesson_name,
                        teaching_style=teaching_style,
                        variation=variation,
                        is_published=self.is_lesson_published(global_lesson_number),
                        is_protected=False,
                        author=author,
                    )

                    lesson_resources = self.build_resources_for_lesson(
                        global_lesson_number
                    )

                    for order, resource_data in enumerate(lesson_resources, start=1):
                        resource = self.create_resource(
                            resource_data=resource_data,
                            author=author,
                            subject=subject,
                        )
                        LessonVariantResource.objects.create(
                            lesson_variant=lesson_variant,
                            resource=resource,
                            order=order,
                        )

        self.stdout.write(
            self.style.SUCCESS(
                "Database successfully populated with simple sample data."
            )
        )

    def get_or_create_seed_user(self):
        user, created = User.objects.get_or_create(
            email="seed@example.com",
            defaults={
                "username": "seeduser",
            },
        )

        if created:
            user.set_password("password123")
            user.save()

        return user

    def get_or_create_teaching_style(self):
        teaching_style, _ = TeachingStyle.objects.get_or_create(
            title="teaching-style-1",
            defaults={"is_protected": False},
        )
        return teaching_style

    def get_or_create_variation(self):
        variation, _ = Variation.objects.get_or_create(
            title="variation-1",
            defaults={"is_protected": False},
        )
        return variation

    def is_lesson_published(self, lesson_number):
        unpublished_lessons = {4, 8, 12}
        return lesson_number not in unpublished_lessons

    def build_resources_for_lesson(self, lesson_number):
        lesson_title = f"lesson-{lesson_number}"

        resources = [
            {
                "title": f"{lesson_title}-slides",
                "category": "slide",
                "description": f"Slides for {lesson_title}.",
                "file_name": self.make_file_name(lesson_title, "slides"),
            },
            {
                "title": f"{lesson_title}-worksheet",
                "category": "worksheet",
                "description": f"Worksheet for {lesson_title}.",
                "file_name": self.make_file_name(lesson_title, "worksheet"),
            },
            {
                "title": f"{lesson_title}-notes",
                "category": "file",
                "description": f"Teacher notes for {lesson_title}.",
                "file_name": self.make_file_name(lesson_title, "notes"),
            },
        ]

        optional_resources = [
            {
                "title": f"{lesson_title}-video",
                "category": "video",
                "description": f"Video for {lesson_title}.",
                "url": f"https://example.com/videos/{lesson_title}",
            },
            {
                "title": f"{lesson_title}-template",
                "category": "template",
                "description": f"Template for {lesson_title}.",
                "file_name": self.make_file_name(lesson_title, "template"),
            },
            {
                "title": f"{lesson_title}-link",
                "category": "link",
                "description": f"Helpful link for {lesson_title}.",
                "url": f"https://example.com/help/{lesson_title}",
            },
        ]

        resources.extend(random.sample(optional_resources, k=random.randint(1, 2)))
        return resources

    def create_resource(self, resource_data, author, subject):
        resource = Resource(
            title=resource_data["title"],
            category=resource_data["category"],
            description=resource_data["description"],
            is_protected=False,
            author=author,
        )

        if resource_data["category"] in {"video", "link"}:
            resource.url = resource_data["url"]
        else:
            file_name = resource_data["file_name"]
            resource.file.save(
                file_name,
                ContentFile(f"Sample content for {resource_data['title']}"),
                save=False,
            )

        resource.save()
        resource.subjects.add(subject)

        return resource

    def make_file_name(self, lesson_title, suffix):
        return f"{lesson_title}_{suffix}.txt"
