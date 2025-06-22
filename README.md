# Scheduler Service

## Overview
A scalable, production-ready job scheduler microservice built with FastAPI, SQLAlchemy, and APScheduler. It supports job scheduling, management, and execution, and is designed for horizontal scaling using NGINX as a load balancer. The project includes a modern React frontend.

---

## Features

- Flexible job scheduling (interval, cron, date)
- REST API for job CRUD operations
- Persistent storage with PostgreSQL
- Modular, maintainable backend codebase
- Documentation at `/docs`
- NGINX reverse proxy and load balancer
- React frontend for job management

---

## Project Structure

```
scheduler_service/
├── backend/                # FastAPI backend
│   ├── api/endpoints/      # API routes (jobs.py)
│   ├── core/               # Configuration (config.py)
│   ├── db/                 # Database models and session
│   ├── schemas/            # Pydantic models
│   └── services/           # Business logic (scheduler.py)
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── assets/         # Static assets
│   └── public/             # Public static files
├── docker-compose.yml      # Multi-service orchestration
├── Dockerfile              # Backend Docker build
├── nginx.conf              # NGINX load balancer config
├── requirements.txt        # Python dependencies
├── alembic.ini             # Alembic DB migrations config
└── .env                    # Environment variables (not committed)
```

---

## Prerequisites

- Docker & Docker Compose
- Node.js (v18+ recommended) and npm (for frontend development)
- Python 3.11+ (for local backend development)
- PostgreSQL (for local development, but handled by Docker in production)

---

## Setup & Running

### 1. Clone the repository

```sh
git clone https://github.com/TMVKasiViswanath/Digantara---Backend-Assessment---Kasi.git
cd scheduler_service
```

### 2. Create a `.env` file

Create a `.env` file in the project root with the following content:

```
DATABASE_URL=postgresql://user:pass@db:5432/scheduler_db
SECRET_KEY=your-very-secret-key
SCHEDULER_TIMEZONE=UTC
POSTGRES_USER=user
POSTGRES_PASSWORD=pass
POSTGRES_DB=scheduler_db
```

> **Note:** Never commit your `.env` file to version control.

### 3. Build and start all services

```sh
docker compose up --build
```

- NGINX will be available at [http://localhost:8000](http://localhost:8000)
- API docs: [http://localhost:8000/docs](http://localhost:8000/docs)

### 4. Stopping services

```sh
docker compose down
```

---

## Backend Development (Optional, outside Docker)

```sh
# Create and activate a virtual environment
python -m venv venv
venv\Scripts\activate  # On Windows
# source venv/bin/activate  # On Linux/macOS

# Install dependencies
pip install -r requirements.txt

# Run migrations (if needed)
alembic upgrade head

# Start the backend
uvicorn backend.main:app --reload
```

---

## Frontend Development

```sh
cd frontend
npm install
npm run dev
```

- The frontend will be available at [http://localhost:5173](http://localhost:5173)
- It expects the backend API to be running at `http://localhost:8000`

---

## Scaling & Load Balancing

- **NGINX** (configured in `nginx.conf`) load balances requests between multiple backend containers (`backend1`, `backend2`, etc.).
- To add more backend replicas, duplicate the backend service in `docker-compose.yml` and add to the NGINX upstream block.
- For production, consider using Kubernetes or Docker Swarm for dynamic scaling.

---

## Environment Variables

All sensitive configuration (database URL, secrets, etc.) is managed via the `.env` file and injected into containers by Docker Compose.

---

## API Endpoints

- **API Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **Jobs API:** [http://localhost:8000/api/v1/jobs](http://localhost:8000/api/v1/jobs)

---

## Technologies Used

- **Backend:** FastAPI, APScheduler, SQLAlchemy, Alembic, PostgreSQL
- **Frontend:** React, TypeScript, Material-UI, Vite
- **Containerization:** Docker, Docker Compose
- **Load Balancing:** NGINX

---

## Troubleshooting

- If environment variables are not picked up, ensure your `.env` file is in the project root and named exactly `.env`.
- For network or image pull issues, check your internet connection and Docker Hub status.
- For database issues, ensure the `db` service is healthy and accessible from backend containers.

---

## License

MIT 