# TaskFlow: Todo App

A full-stack todo app built with Django REST Framework and React. Users register, log in with JWT, and manage their own private tasks.

**Live app:** https://todo-task-4-hyn4.onrender.com
**API:** https://todo-task-eocq.onrender.com/api/

> Hosted on free plans, so the first load after a pause can take up to a minute.

## Features

- Register and log in with JWT authentication
- Each user sees only their own todos
- Add, edit, complete and delete todos
- API pagination, search and filtering

## Tech stack

- **Backend:** Django, Django REST Framework, SimpleJWT
- **Frontend:** React (Vite), Bootstrap
- **Database:** SQLite locally, PostgreSQL in production
- **Hosting:** Render

## API endpoints

| Method | Endpoint | Auth |
|---|---|---|
| POST | `/api/register/` | No |
| POST | `/api/login/` | No |
| POST | `/api/token/refresh/` | No |
| GET, POST | `/api/todos/` | Yes |
| GET, PUT, PATCH, DELETE | `/api/todos/<id>/` | Yes |

Send the token as `Authorization: Bearer <access_token>`.

## Run locally

**Backend**

```bash
git clone https://github.com/Saugatrana10/TODO-Task-.git
cd TODO-Task-
python -m venv venv
venv\Scripts\activate          
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

**Frontend**

```bash
cd todo-frontend
npm install
npm run dev
```

The app runs at http://localhost:5173 and the API at http://127.0.0.1:8000/api/.

## Project structure

```
TODOAPI/          Django project settings and urls
Apps/             Models, serializers, views
todo-frontend/    React app
```
