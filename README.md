# Scheduler Service

## Overview
A scalable, production-ready job scheduler microservice built with FastAPI, SQLAlchemy, and APScheduler. It supports job scheduling, management, and execution, and is designed for horizontal scaling using NGINX as a load balancer. The project includes a modern React frontend.

---

## Features

- Flexible job scheduling (interval, cron, date)
- REST API for job CRUD operations
- Persistent storage with PostgreSQL
- Modular, maintainable backend codebase
- API docs at `/docs`
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

## One-Pager: Scaling Strategies & API Management

This project is designed to be scalable and cloud-ready. Here's how you can scale the application and manage APIs across different levels of complexity:

### 1. Basic Scaling Approaches

#### a. **Serverless APIs with AWS Lambda**
- **How:** Package your FastAPI endpoints as serverless functions using AWS Lambda (with AWS API Gateway as the HTTP interface).
- **Benefits:**
  - Automatic scaling to thousands of concurrent requests.
  - No server management; pay only for usage.
  - Built-in high availability and global reach.
- **API Management:**
  - Use AWS API Gateway for routing, authentication, throttling, and monitoring.
  - Deploy each endpoint as a Lambda function or use frameworks like AWS Chalice or Zappa for FastAPI.
- **When to use:**
  - For event-driven workloads, unpredictable traffic, or when you want to minimize infrastructure management.

#### b. **Application Load Balancer (ALB) with EC2**
- **How:** Deploy multiple EC2 instances running your backend (Dockerized or not), and place an AWS Application Load Balancer in front.
- **Benefits:**
  - Distributes incoming traffic across healthy backend instances.
  - Supports auto-scaling groups for dynamic scaling based on load.
  - Integrates with AWS Certificate Manager for SSL.
- **API Management:**
  - ALB handles routing and health checks.
  - Use AWS WAF for security, and Route 53 for DNS-based global load balancing.
- **When to use:**
  - For traditional VM-based deployments, when you need more control over the environment, or for legacy compatibility.

### 2. Advanced Scaling: Kubernetes (K8s)
- **How:** Deploy your services as containers in a Kubernetes cluster (EKS on AWS, GKE on GCP, AKS on Azure, or on-premises).
- **Benefits:**
  - Automated scaling, self-healing, and rolling updates.
  - Service discovery and internal load balancing.
  - Supports blue/green and canary deployments.
  - Easily manage secrets, config, and persistent storage.
- **API Management:**
  - Use Kubernetes Ingress controllers (e.g., NGINX Ingress, AWS ALB Ingress) for routing and SSL.
  - Integrate with API gateways (Kong, Ambassador, AWS API Gateway) for advanced API management (rate limiting, authentication, monitoring).
- **When to use:**
  - For large-scale, microservices-based architectures, or when you need maximum flexibility and automation.

### 3. API Management Best Practices
- **Documentation:** Always provide OpenAPI docs (as this project does at `/docs`).
- **Authentication & Authorization:** Use JWT, OAuth2, or API keys. Integrate with API Gateway or Ingress for enforcement.
- **Rate Limiting & Throttling:** Protect your backend from abuse using API Gateway, NGINX, or Ingress policies.
- **Monitoring & Logging:** Use centralized logging (ELK, Loki) and monitoring (Prometheus, Grafana, AWS CloudWatch).
- **Versioning:** Version your APIs (e.g., `/api/v1/jobs`) to support backward compatibility.

### 4. Choosing the Right Approach
- **Start simple:** For small projects or MVPs, Docker Compose with NGINX is sufficient.
- **Scale up:** As traffic grows, move to ALB+EC2 or serverless Lambdas.
- **Go advanced:** For global, high-availability, and microservices, use Kubernetes with an API gateway.

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

