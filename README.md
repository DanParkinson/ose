Open Source Education
A website for teachers to share and access resources and curriculums so they dont have to make them

Tech stack:
    uv - pytohn mangement
    vite - react management
    Django:
        API design
    postgresql:
        for relational database
    Docker:
        containerisation:
            Backend
            Frontend
    VSCODE:
        devcontainers:

Requirements:
    Extensions:
        Dev containers - for loading local dev environment
    Optimising API querues time and load:
        Django-silk

StartUp:
    Setting up:
        Docker installed
        VSCODE installed
        run ` DEV CONTAINERS: rebuild and reopen in container
    Setting up Django
        Create super user with:
            cd backend
            uv run python manage.py createsuperuser
            access localhost:8000 and login to access Django admin

Docker:
    Containers:
        Devcontainer linked to backend
        backend to host Django Api
        frontend to host react frontend
    Volumes:
        Postgres Database

backend:
    Django:
        Config:
            Project setup
        Accounts:
            for custom user model
        Core:
            core functionality of teacher resources

Database:
    Postgres:

Frontend:
    React:

Useful commands:
    populate database:
        cd backend
        uv run python manage.py populate_db

    Creating ERD:
        uv run manage.py graph_models core > models.dot
        copy contents of file at https://graph.flyte.org/

    Prior to commiting:
        cd ..
        git add .
        uv run pre-commit run


filters for the lessonvariant page:
- Topics
- LessonName
- Variant
- TeachingStyle

# Still to implement

lessonVariant Resources
- testing + permissions

filters
- lessonvarianttopic testing
- lessonvariantlessonname + testing
- lessonvariantvariant + testing
- lessonvariantteachingstyle + testing
- lessonvariant filtereset for applying frotnend requests

subject detail upgrade to show:
- intro video
- templates to get started
- respurce templates
+ revamp of test permissions
