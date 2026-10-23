# DreamConsole (DC)

DreamConsole is a comprehensive suite of free, fast, and secure online tools designed to simplify everyday digital tasks. Whether you are a developer, a designer, or an everyday user, our platform offers a wide array of utilities—from image format conversions and PDF manipulations to developer tools and SEO generators.

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React, Tailwind CSS, TypeScript
- **Backend**: FastAPI (Python), SQLAlchemy (Async), Alembic (Migrations)
- **Database**: MySQL

---

## Prerequisites

Before you begin, ensure you have the following installed on your machine:
- **Node.js** (v18+)
- **Python** (v3.10+)
- **MySQL** Server

---

## Environment Setup

### Backend (.env)
Create a `.env` file in the `backend/` directory with your MySQL credentials:
```env
MYSQL_USER=root
MYSQL_PASSWORD=123
MYSQL_SERVER=localhost
MYSQL_PORT=3306
MYSQL_DB=dcdl

# Optional:
# SECRET_KEY=your_secret_key_here
```

### Frontend (.env.local)
Create a `.env.local` file in the `frontend/` directory to link the frontend to your local API:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

---

## Local Development Guide

### 1. Backend Setup

Open a terminal and navigate to the `backend/` folder:

```bash
cd backend
```

Create and activate a Python virtual environment:
```bash
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

Install the required Python dependencies:
```bash
pip install -r requirements.txt
```

Run database migrations to set up your tables (make sure your MySQL server is running and the database `dcdl` exists):
```bash
alembic upgrade head
```

Start the FastAPI development server:
```bash
uvicorn app.main:app --reload --port 8000
```
Your backend API will be available at `http://localhost:8000`. You can view the interactive API docs at `http://localhost:8000/docs`.

### 2. Frontend Setup

Open a new terminal and navigate to the `frontend/` folder:

```bash
cd frontend
```

Install the Node.js dependencies:
```bash
npm install
```

Start the Next.js development server:
```bash
npm run dev
```
Your frontend will be available at `http://localhost:3000`.

---

## Features

- **Image Tools**: Background remover, format converters (JPG, PNG, WebP), compressions.
- **PDF Tools**: Merge, compress, convert, sign, watermark, extract, split.
- **Developer Tools**: Base64 encoding/decoding, UUID generators, Regex testers.
- **SEO Tools**: Meta tag generators, Robots.txt generator.
- **Video Downloader**: Download videos from various social media platforms.
- **Admin Dashboard**: Comprehensive usage statistics and tool management.

## Team

Built by:
- **Arun** - Senior Developer
- **Sajith** - Full Stack Developer
