# Scheduler Service

## Overview
This is a production-ready, modular scheduler microservice built with FastAPI, SQLAlchemy, and APScheduler. It supports job scheduling, management, and execution with a scalable architecture. NGINX is used as a reverse proxy and can be extended for load balancing.

## Features
- Job scheduling with flexible configuration (interval, cron, date)
- API endpoints for job CRUD operations
- Database integration for job persistence
- Modular, SOLID-compliant codebase
- OpenAPI documentation at `/docs`
- NGINX reverse proxy for scalability

## Setup & Running

### Prerequisites
- Docker & Docker Compose

### Steps
1. Clone the repository
2. Copy `.env.example` to `.env` and set your environment variables
3. Run:
   ```sh
   docker-compose up --build
   ```
4. Access the API at `http://localhost` (proxied by NGINX)
5. API docs: `http://localhost/docs`

## NGINX Integration
- NGINX listens on port 80 and proxies all requests to the FastAPI app (`web` service) on port 8000.
- Configuration is in `nginx.conf`.
- This setup allows for easy horizontal scaling and load balancing by adding more FastAPI containers and updating the NGINX upstream block.

## Scaling & API Management (One-Pager)

### Scaling
- **Stateless API**: The FastAPI app is stateless; all job and user data is persisted in the database, allowing multiple app instances.
- **Horizontal Scaling**: To handle more load, increase the number of `web` (FastAPI) containers and update the NGINX `upstream` block to include all app instances.
- **Database**: Use a managed Postgres instance for high availability and performance.
- **Scheduler**: For distributed scheduling, use a shared job store (e.g., Redis, Postgres) with APScheduler or a distributed task queue (e.g., Celery + Redis/RabbitMQ) for production.

### API Management
- **NGINX**: Acts as a reverse proxy, can be configured for rate limiting, SSL termination, and load balancing.
- **API Gateway**: For large-scale deployments, consider using an API gateway (e.g., Kong, AWS API Gateway) for authentication, monitoring, and advanced traffic management.

## Project Structure
- `api-service/`: FastAPI backend
- `frontend/`: (Optional) Frontend app
- `nginx.conf`: NGINX configuration
- `docker-compose.yml`: Multi-service orchestration

---
For any questions, see the code comments and API docs at `/docs`.

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL
- Docker (optional)

### Environment Setup

Create a `.env` file in the root directory with your configuration:

```bash
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
POSTGRES_USER=your_username
POSTGRES_PASSWORD=your_password
POSTGRES_DB=your_database_name

# Application Configuration
SECRET_KEY=your-secret-key-minimum-32-characters-long
```

### Backend Setup

```bash
# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/macOS

# Install dependencies
pip install -r requirements.txt

# Run migrations
alembic upgrade head

# Start backend (development)
docker-compose up --build
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```


## API Endpoints

- **API Docs**: http://localhost:8000/docs
- **Jobs API**: http://localhost:8000/api/v1/jobs

## Project Structure

```
scheduler_service/
├── app/                    # FastAPI backend
│   ├── api/endpoints/     # API routes
│   ├── core/              # Configuration
│   ├── db/                # Database models
│   ├── schemas/           # Pydantic models
│   └── services/          # Business logic
├── frontend/              # React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   └── services/      # API services
├── docker-compose.yml     # Docker setup
└── requirements.txt       # Python dependencies
```

## Technologies

- **Backend**: FastAPI, APScheduler, SQLAlchemy, PostgreSQL
- **Frontend**: React, TypeScript, Material-UI, Vite
- **Database**: PostgreSQL with Alembic migrations
- **Containerization**: Docker & Docker Compose 