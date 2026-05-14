# 🏥 PatientCare — Microservices Healthcare Management System

A production-grade, event-driven microservices application built with Java and Spring Boot,
designed to simulate a real-world hospital information system.

---

## 🏗️ Architecture Overview

The system is composed of 5 independent microservices communicating via:
- **Apache Kafka** — for asynchronous, event-driven messaging
- **gRPC** — for high-performance synchronous inter-service calls
- **REST APIs** — for client-facing communication through the API Gateway

---

## ⚙️ Services

| Service | Responsibility |
|---|---|
| `api-gateway` | Single entry point — routes, authenticates, and forwards requests |
| `auth-service` | Issues and validates JWT tokens for secure access |
| `patientservice` | Manages patient records via CRUD REST APIs |
| `billing-service` | Handles invoice creation and payment records |
| `analytics-service` | Consumes Kafka events and generates reports/insights |

---

## 🛠️ Tech Stack

- **Language:** Java
- **Framework:** Spring Boot
- **Messaging:** Apache Kafka
- **Inter-service RPC:** gRPC
- **Authentication:** JWT (JSON Web Tokens)
- **Containerisation:** Docker
- **API Style:** REST

---

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Docker & Docker Compose
- Apache Kafka (or use the Docker config)

### Run with Docker
```bash
docker-compose up --build
```

### Run individually
```bash
cd api-gateway
./mvnw spring-boot:run
```
Repeat for each service.

---

## 📡 API Endpoints (via Gateway)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/login` | Authenticate and receive JWT |
| GET | `/patients` | Get all patient records |
| POST | `/patients` | Create a new patient |
| GET | `/patients/{id}` | Get patient by ID |
| POST | `/billing/invoice` | Create an invoice |
| GET | `/analytics/summary` | Get event-based analytics report |

---

## 🔐 Authentication Flow

1. Client sends credentials to `/auth/login`
2. Auth Service issues a signed JWT
3. All subsequent requests pass the JWT in the `Authorization` header
4. API Gateway validates the token before forwarding

---

## 📬 Kafka Event Flow

Services publish events to Kafka topics on key actions:
- Patient created → `patient.created` topic
- Invoice generated → `billing.invoiced` topic
- Analytics Service subscribes and processes all events asynchronously

This decouples services — a failure in Billing does **not** block Patient operations.

---

## 🐳 Docker

Each service has its own `Dockerfile`. Use Docker Compose to spin up the full system including Kafka and Zookeeper.

---

## 👨‍💻 Author

**Sivasuriya S** — [LinkedIn](https://www.linkedin.com/in/sivasuriya004/) | [GitHub](https://github.com/Sivasuriya-skr)
