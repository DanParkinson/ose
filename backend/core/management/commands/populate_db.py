import random

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


class Command(BaseCommand):
    help = "Populate the database with readable curriculum sample data"

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.WARNING("Clearing existing data..."))

        LessonVariantResource.objects.all().delete()
        Resource.objects.all().delete()
        LessonVariant.objects.all().delete()
        LessonName.objects.all().delete()
        TeachingStyle.objects.all().delete()
        Variation.objects.all().delete()
        Topic.objects.all().delete()
        Subject.objects.all().delete()

        self.stdout.write(self.style.SUCCESS("Existing data cleared."))

        curriculum_data = {
            "Mathematics": {
                "description": "GCSE mathematics curriculum covering key number, algebra, geometry and data skills.",
                "icon": "calculate",
                "topics": {
                    "Algebra": [
                        "Nth Term Basics",
                        "Finding the Rule",
                        "Using the Rule",
                        "Mixed Sequence Practice",
                        "One Step Equations",
                        "Two Step Equations",
                        "Equations with Brackets",
                        "Equation Problem Solving",
                        "Expanding One Bracket",
                        "Expanding Two Brackets",
                        "Factorising Simple Expressions",
                        "Factorising Harder Expressions",
                    ],
                    "Number": [
                        "Equivalent Fractions",
                        "Comparing Fractions",
                        "Adding Fractions",
                        "Subtracting Fractions",
                        "Percentage of an Amount",
                        "Percentage Increase",
                        "Percentage Decrease",
                        "Reverse Percentages",
                    ],
                    "Geometry": [
                        "Angles on a Line",
                        "Angles Around a Point",
                        "Angles in Triangles",
                        "Angles in Parallel Lines",
                        "Perimeter Basics",
                        "Area of Rectangles and Triangles",
                        "Area of Compound Shapes",
                        "Area Problem Solving",
                    ],
                },
            },
            "English Language": {
                "description": "GCSE English Language curriculum focused on reading and writing skills.",
                "icon": "menu_book",
                "topics": {
                    "Reading Skills": [
                        "Identifying Language Features",
                        "Analysing Word Choice",
                        "Explaining Effects",
                        "Language Analysis Practice",
                        "Reading Between the Lines",
                        "Using Evidence",
                        "Developing Inference",
                        "Inference Practice",
                    ],
                    "Writing Skills": [
                        "Building Setting Description",
                        "Using Sensory Detail",
                        "Sentence Variety",
                        "Descriptive Writing Practice",
                        "Writing to Argue",
                        "Writing to Persuade",
                        "Writing for Audience",
                        "Transactional Writing Practice",
                    ],
                },
            },
            "Combined Science": {
                "description": "GCSE combined science curriculum covering biology, chemistry and physics topics.",
                "icon": "science",
                "topics": {
                    "Biology": [
                        "Animal and Plant Cells",
                        "Specialised Cells",
                        "Microscopes",
                        "Cell Organisation",
                    ],
                    "Chemistry": [
                        "Atoms Basics",
                        "Elements and Compounds",
                        "Mixtures",
                        "Particle Models",
                    ],
                    "Physics": [
                        "Contact and Non Contact Forces",
                        "Resultant Force",
                        "Distance Time Graphs",
                        "Velocity Time Graphs",
                    ],
                },
            },
        }

        self.stdout.write(
            self.style.WARNING(
                "Creating subjects, topics, lesson names, lesson variants, and resources..."
            )
        )

        teaching_style, _ = TeachingStyle.objects.get_or_create(title="Standard")
        variation, _ = Variation.objects.get_or_create(title="Base")

        for subject_title, subject_info in curriculum_data.items():
            subject = Subject.objects.create(
                title=subject_title,
                level="gcse",
                language="en",
                description=subject_info["description"],
                icon=subject_info["icon"],
            )

            for topic_title, lesson_titles in subject_info["topics"].items():
                topic, _ = Topic.objects.get_or_create(title=topic_title)

                for lesson_title in lesson_titles:
                    lesson_name, _ = LessonName.objects.get_or_create(
                        title=lesson_title
                    )

                    lesson_variant = LessonVariant.objects.create(
                        subject=subject,
                        topic=topic,
                        lesson_name=lesson_name,
                        teaching_style=teaching_style,
                        variation=variation,
                        is_published=self.is_lesson_published(lesson_title),
                    )

                    lesson_resources = self.build_resources_for_lesson(lesson_title)

                    for resource_order, resource_data in enumerate(
                        lesson_resources, start=1
                    ):
                        resource = self.create_resource(resource_data)
                        LessonVariantResource.objects.create(
                            lesson_variant=lesson_variant,
                            resource=resource,
                            order=resource_order,
                        )

        self.stdout.write(
            self.style.SUCCESS(
                "Database successfully populated with readable curriculum sample data."
            )
        )

    def is_lesson_published(self, lesson_title):
        unpublished_lessons = {
            "Mixed Sequence Practice",
            "Expanding Two Brackets",
            "Factorising Harder Expressions",
            "Percentage Decrease",
            "Reverse Percentages",
            "Sentence Variety",
            "Descriptive Writing Practice",
            "Writing to Argue",
            "Writing to Persuade",
            "Writing for Audience",
            "Transactional Writing Practice",
            "Velocity Time Graphs",
        }
        return lesson_title not in unpublished_lessons

    def build_resources_for_lesson(self, lesson_title):
        resources = [
            {
                "title": f"{lesson_title} Slides",
                "category": "slide",
                "description": f"Slide deck for {lesson_title.lower()}.",
                "file_name": self.make_file_name(lesson_title, "slides"),
            },
            {
                "title": f"{lesson_title} Worksheet",
                "category": "worksheet",
                "description": f"Worksheet for {lesson_title.lower()}.",
                "file_name": self.make_file_name(lesson_title, "worksheet"),
            },
            {
                "title": f"{lesson_title} Teacher Notes",
                "category": "file",
                "description": f"Teacher notes for {lesson_title.lower()}.",
                "file_name": self.make_file_name(lesson_title, "teacher_notes"),
            },
        ]

        optional_resources = [
            {
                "title": f"{lesson_title} Video",
                "category": "video",
                "description": f"Video explanation for {lesson_title.lower()}.",
                "url": f"https://example.com/videos/{self.slug_text(lesson_title)}",
            },
            {
                "title": f"{lesson_title} Extension Task",
                "category": "template",
                "description": f"Extension task for {lesson_title.lower()}.",
                "file_name": self.make_file_name(lesson_title, "extension_task"),
            },
            {
                "title": f"{lesson_title} Help Link",
                "category": "link",
                "description": f"Helpful support link for {lesson_title.lower()}.",
                "url": f"https://example.com/help/{self.slug_text(lesson_title)}",
            },
        ]

        resources.extend(random.sample(optional_resources, k=random.randint(1, 2)))
        return resources

    def create_resource(self, resource_data):
        resource = Resource(
            title=resource_data["title"],
            category=resource_data["category"],
            description=resource_data["description"],
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
        return resource

    def slug_text(self, text):
        return text.lower().replace("&", "and").replace(" ", "_")

    def make_file_name(self, lesson_title, suffix):
        return f"{self.slug_text(lesson_title)}_{suffix}.txt"
