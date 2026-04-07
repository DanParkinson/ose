import random

from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand

from core.models import (
    Subject,
    Topic,
    Lesson,
    Resource,
    LessonResource,
    Curriculum,
    Unit,
    UnitLesson,
)


class Command(BaseCommand):
    help = "Populate the database with readable curriculum sample data"

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.WARNING("Clearing existing data..."))

        # Delete in dependency order
        UnitLesson.objects.all().delete()
        LessonResource.objects.all().delete()
        Unit.objects.all().delete()
        Curriculum.objects.all().delete()
        Lesson.objects.all().delete()
        Resource.objects.all().delete()
        Topic.objects.all().delete()
        Subject.objects.all().delete()

        self.stdout.write(self.style.SUCCESS("Existing data cleared."))

        curriculum_data = {
            "Mathematics": {
                "description": "GCSE mathematics curriculum covering key number, algebra, geometry and data skills.",
                "icon": "calculate",
                "curriculums": [
                    {
                        "title": "Secondary Setted Curriculum",
                        "units": [
                            {
                                "year_group": "year_7",
                                "level": "red",
                                "order": 1,
                                "lessons": [
                                    "Nth Term Basics",
                                    "Finding the Rule",
                                    "Equivalent Fractions",
                                    "Comparing Fractions",
                                ],
                            },
                            {
                                "year_group": "year_7",
                                "level": "amber",
                                "order": 1,
                                "lessons": [
                                    "Nth Term Basics",
                                    "Using the Rule",
                                    "Adding Fractions",
                                    "Subtracting Fractions",
                                ],
                            },
                            {
                                "year_group": "year_7",
                                "level": "green",
                                "order": 1,
                                "lessons": [
                                    "Using the Rule",
                                    "Mixed Sequence Practice",
                                    "Adding Fractions",
                                    "Subtracting Fractions",
                                ],
                            },
                            {
                                "year_group": "year_8",
                                "level": "red",
                                "order": 2,
                                "lessons": [
                                    "One Step Equations",
                                    "Two Step Equations",
                                    "Angles on a Line",
                                    "Angles Around a Point",
                                ],
                            },
                            {
                                "year_group": "year_8",
                                "level": "amber",
                                "order": 2,
                                "lessons": [
                                    "Two Step Equations",
                                    "Equation Problem Solving",
                                    "Angles in Triangles",
                                    "Angles in Parallel Lines",
                                ],
                            },
                            {
                                "year_group": "year_9",
                                "level": "blue",
                                "order": 3,
                                "lessons": [
                                    "Expanding One Bracket",
                                    "Expanding Two Brackets",
                                    "Factorising Simple Expressions",
                                    "Factorising Harder Expressions",
                                ],
                            },
                            {
                                "year_group": "year_10",
                                "level": "core",
                                "order": 4,
                                "lessons": [
                                    "Percentage of an Amount",
                                    "Percentage Increase",
                                    "Percentage Decrease",
                                    "Reverse Percentages",
                                ],
                            },
                            {
                                "year_group": "year_10",
                                "level": "mixed_ability",
                                "order": 5,
                                "lessons": [
                                    "Perimeter Basics",
                                    "Area of Rectangles and Triangles",
                                    "Area of Compound Shapes",
                                    "Area Problem Solving",
                                ],
                            },
                        ],
                    },
                    {
                        "title": "Secondary Mixed Ability Curriculum",
                        "units": [
                            {
                                "year_group": "year_7",
                                "level": "mixed_ability",
                                "order": 1,
                                "lessons": [
                                    "Nth Term Basics",
                                    "Finding the Rule",
                                    "Equivalent Fractions",
                                    "Adding Fractions",
                                ],
                            },
                            {
                                "year_group": "year_8",
                                "level": "mixed_ability",
                                "order": 2,
                                "lessons": [
                                    "One Step Equations",
                                    "Two Step Equations",
                                    "Angles on a Line",
                                    "Angles in Triangles",
                                ],
                            },
                            {
                                "year_group": "year_9",
                                "level": "mixed_ability",
                                "order": 3,
                                "lessons": [
                                    "Expanding One Bracket",
                                    "Factorising Simple Expressions",
                                    "Percentage Increase",
                                    "Reverse Percentages",
                                ],
                            },
                        ],
                    },
                ],
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
                "curriculums": [
                    {
                        "title": "Secondary Core Curriculum",
                        "units": [
                            {
                                "year_group": "year_10",
                                "level": "core",
                                "order": 1,
                                "lessons": [
                                    "Identifying Language Features",
                                    "Analysing Word Choice",
                                    "Explaining Effects",
                                    "Language Analysis Practice",
                                ],
                            },
                            {
                                "year_group": "year_10",
                                "level": "core",
                                "order": 2,
                                "lessons": [
                                    "Reading Between the Lines",
                                    "Using Evidence",
                                    "Developing Inference",
                                    "Inference Practice",
                                ],
                            },
                            {
                                "year_group": "year_11",
                                "level": "core",
                                "order": 3,
                                "lessons": [
                                    "Building Setting Description",
                                    "Using Sensory Detail",
                                    "Sentence Variety",
                                    "Descriptive Writing Practice",
                                ],
                            },
                            {
                                "year_group": "year_11",
                                "level": "core",
                                "order": 4,
                                "lessons": [
                                    "Writing to Argue",
                                    "Writing to Persuade",
                                    "Writing for Audience",
                                    "Transactional Writing Practice",
                                ],
                            },
                        ],
                    }
                ],
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
                "curriculums": [
                    {
                        "title": "Secondary Science Curriculum",
                        "units": [
                            {
                                "year_group": "year_9",
                                "level": "core",
                                "order": 1,
                                "lessons": [
                                    "Animal and Plant Cells",
                                    "Specialised Cells",
                                    "Microscopes",
                                    "Cell Organisation",
                                ],
                            },
                            {
                                "year_group": "year_9",
                                "level": "core",
                                "order": 2,
                                "lessons": [
                                    "Atoms Basics",
                                    "Elements and Compounds",
                                    "Mixtures",
                                    "Particle Models",
                                ],
                            },
                            {
                                "year_group": "year_10",
                                "level": "core",
                                "order": 3,
                                "lessons": [
                                    "Contact and Non Contact Forces",
                                    "Resultant Force",
                                    "Distance Time Graphs",
                                    "Velocity Time Graphs",
                                ],
                            },
                        ],
                    }
                ],
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
                "Creating subjects, topics, lessons, resources, curriculums and units..."
            )
        )

        all_lessons = {}

        # Create subjects, topics, lessons, resources
        for subject_title, subject_info in curriculum_data.items():
            subject = Subject.objects.create(
                title=subject_title,
                level="gcse",
                language="en",
                description=subject_info["description"],
                icon=subject_info["icon"],
            )

            for topic_title, lesson_titles in subject_info["topics"].items():
                topic = Topic.objects.create(
                    subject=subject,
                    title=topic_title,
                    description=f"{topic_title} content for {subject_title}.",
                )

                for lesson_title in lesson_titles:
                    lesson = Lesson.objects.create(
                        topic=topic,
                        title=lesson_title,
                        variant="base",
                        description=f"Lesson covering {lesson_title.lower()}.",
                        is_active=True,
                    )
                    all_lessons[(subject_title, lesson_title)] = lesson

                    lesson_resources = self.build_resources_for_lesson(lesson_title)

                    for resource_order, resource_data in enumerate(
                        lesson_resources, start=1
                    ):
                        resource = self.create_resource(resource_data)
                        LessonResource.objects.create(
                            lesson=lesson,
                            resource=resource,
                            order=resource_order,
                        )

            # Create curriculums and units for this subject
            for curriculum_info in subject_info["curriculums"]:
                curriculum = Curriculum.objects.create(
                    title=curriculum_info["title"],
                    subject=subject,
                    description=f"{curriculum_info['title']} for {subject_title}.",
                )

                for unit_info in curriculum_info["units"]:
                    unit = Unit.objects.create(
                        curriculum=curriculum,
                        year_group=unit_info["year_group"],
                        level=unit_info["level"],
                        order=unit_info["order"],
                        description=(
                            f"{curriculum.title} - "
                            f"{unit_info['year_group']} - "
                            f"{unit_info['level']} - "
                            f"half term {unit_info['order']}."
                        ),
                    )

                    for lesson_order, lesson_title in enumerate(
                        unit_info["lessons"], start=1
                    ):
                        lesson = all_lessons.get((subject_title, lesson_title))
                        if lesson:
                            UnitLesson.objects.create(
                                unit=unit,
                                lesson=lesson,
                                order=lesson_order,
                            )
                        else:
                            self.stdout.write(
                                self.style.WARNING(
                                    f"Lesson '{lesson_title}' not found for subject '{subject_title}'."
                                )
                            )

        self.stdout.write(
            self.style.SUCCESS(
                "Database successfully populated with readable curriculum sample data."
            )
        )

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
            is_active=True,
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
