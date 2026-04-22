# Useful Commands

## Populating the Database

From `/backend`

```bash
uv run manage.py populate_db
```

---

## Prior to Committing

From root directory `/app`

```bash
git add .
uv run pre-commit run
```

---

## Creating an ERD

From `/backend`

```bash
uv run manage.py graph_models core > models.dot
```

Then:
- Open the `.dot` file
- Copy contents into: https://graph.flyte.org/

---

## Launching API Docs (Swagger UI)

From `/backend`

```bash
uv run manage.py runserver
```

Then open in browser:

```
http://localhost:8000/api/schema/swagger-ui/
```

---

## Launching API Schema

From `/backend`

```bash
uv run manage.py spectacular --file schema.yml
```

This generates an OpenAPI schema file for the API.

---
