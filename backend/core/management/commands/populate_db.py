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
    help = "Populate database with Maths and English lesson data"

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

        teaching_styles = self.create_teaching_styles()
        variations = self.create_variations()

        subject_data = {
            "Mathematics": {
                "level": "secondary",
                "topics": [
                    "Number",
                    "Algebra",
                    "Geometry",
                    "Ratio",
                    "Fractions",
                    "Decimals",
                    "Percentages",
                    "Statistics",
                    "Probability",
                    "Sequences",
                    "Graphs",
                    "Trigonometry",
                ],
                "lessons": [
                    "Simplifying Expressions",
                    "Linear Equations",
                    "Equivalent Fractions",
                    "Percentage Change",
                    "Compound Shapes",
                    "Angles in Polygons",
                    "Linear Graphs",
                    "Calculating Averages",
                    "Probability Scale",
                    "Nth Term",
                    "Ratio Problems",
                    "Pythagoras Theorem",
                ],
            },
            "English": {
                "level": "secondary",
                "topics": [
                    "Reading",
                    "Creative Writing",
                    "Persuasive Writing",
                    "Poetry",
                    "Shakespeare",
                    "Modern Fiction",
                    "Non-Fiction",
                    "Grammar",
                    "Vocabulary",
                    "Sentence Structure",
                    "Literary Devices",
                    "Spoken Language",
                ],
                "lessons": [
                    "Character Analysis",
                    "Using Evidence",
                    "Descriptive Openings",
                    "Poetic Imagery",
                    "Shakespeare Language",
                    "Building Tension",
                    "Writing to Persuade",
                    "Using Commas",
                    "Vocabulary Choices",
                    "Sentence Openers",
                    "Metaphors and Similes",
                    "Spoken Arguments",
                ],
            },
        }

        lesson_variant_count = 0

        for subject_title, data in subject_data.items():
            subject = Subject.objects.create(
                title=subject_title,
                level=data["level"],
                language="en",
                is_published=True,
                is_protected=False,
            )

            topics = self.create_topics(
                topic_names=data["topics"],
                subject=subject,
            )

            lesson_names = self.create_lesson_names(
                lesson_names=data["lessons"],
                subject=subject,
            )

            for topic in topics:
                selected_lessons = random.sample(
                    lesson_names,
                    k=6,
                )

                for lesson_name in selected_lessons:
                    selected_styles = random.sample(
                        teaching_styles,
                        k=3,
                    )

                    selected_variations = random.sample(
                        variations,
                        k=3,
                    )

                    for teaching_style in selected_styles:
                        for variation in selected_variations:
                            lesson_variant_count += 1

                            lesson_variant = LessonVariant.objects.create(
                                subject=subject,
                                topic=topic,
                                lesson_name=lesson_name,
                                teaching_style=teaching_style,
                                variation=variation,
                                is_published=(lesson_variant_count % 5 != 0),
                                is_protected=(lesson_variant_count % 11 == 0),
                                author=author,
                            )

                            resources = self.build_resources(
                                topic=topic,
                                lesson_name=lesson_name,
                                subject=subject,
                            )

                            for order, resource_data in enumerate(
                                resources,
                                start=1,
                            ):
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
                f"Successfully created {lesson_variant_count} lesson variants."
            )
        )

    def get_or_create_seed_user(self):
        user, created = User.objects.get_or_create(
            email="seed@example.com",
        )

        if created:
            user.set_password("password123")
            user.save()

        return user

    def create_teaching_styles(self):
        style_names = [
            "Teacher Explanation",
            "Guided Practice",
            "Independent Practice",
        ]

        return [
            TeachingStyle.objects.create(
                title=style_name,
                is_protected=False,
            )
            for style_name in style_names
        ]

    def create_variations(self):
        variation_names = [
            "Support",
            "Core",
            "Challenge",
        ]

        return [
            Variation.objects.create(
                title=variation_name,
                is_protected=False,
            )
            for variation_name in variation_names
        ]

    def create_topics(self, topic_names, subject):
        topics = []

        for topic_name in topic_names:
            topic = Topic.objects.create(
                title=f"{subject.title} - {topic_name}",
                is_protected=False,
            )

            topic.subjects.add(subject)

            topics.append(topic)

        return topics

    def create_lesson_names(self, lesson_names, subject):
        lessons = []

        for lesson_title in lesson_names:
            lesson_name = LessonName.objects.create(
                title=lesson_title,
                is_protected=False,
            )

            lesson_name.subjects.add(subject)

            lessons.append(lesson_name)

        return lessons

    def build_resources(self, topic, lesson_name, subject):
        base_name = self.slugify(f"{topic.title}-{lesson_name.title}")

        display_name = lesson_name.title

        resources = [
            {
                "title": f"{display_name} Slides",
                "category": "slide",
                "description": (f"Slides for {display_name} in {subject.title}."),
                "file_name": (f"{base_name}-slides.txt"),
            },
            {
                "title": f"{display_name} Worksheet",
                "category": "worksheet",
                "description": (f"Worksheet for {display_name} in {subject.title}."),
                "file_name": (f"{base_name}-worksheet.txt"),
            },
            {
                "title": f"{display_name} Notes",
                "category": "file",
                "description": (f"Teacher notes for {display_name}."),
                "file_name": (f"{base_name}-notes.txt"),
            },
        ]

        optional_resources = [
            {
                "title": (f"{display_name} Video"),
                "category": "video",
                "description": (f"Video explanation for {display_name}."),
                "url": (f"https://example.com/{base_name}/video"),
            },
            {
                "title": (f"{display_name} Template"),
                "category": "template",
                "description": (f"Editable template for {display_name}."),
                "file_name": (f"{base_name}-template.txt"),
            },
            {
                "title": (f"{display_name} Extension"),
                "category": "link",
                "description": (f"Extension resource for {display_name}."),
                "url": (f"https://example.com/{base_name}/extension"),
            },
        ]

        resources.extend(
            random.sample(
                optional_resources,
                k=random.randint(1, 3),
            )
        )

        return resources

    def create_resource(
        self,
        resource_data,
        author,
        subject,
    ):
        resource = Resource(
            title=resource_data["title"],
            category=resource_data["category"],
            description=resource_data["description"],
            is_protected=random.choice([False, False, False, True]),
            author=author,
        )

        if resource_data["category"] in {
            "video",
            "link",
        }:
            resource.url = resource_data["url"]

        else:
            resource.file.save(
                resource_data["file_name"],
                ContentFile(f"Sample content for {resource_data['title']}"),
                save=False,
            )

        resource.save()

        resource.subjects.add(subject)

        return resource

    def slugify(self, value):
        return value.lower().replace(" ", "-").replace("/", "-")
