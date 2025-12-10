# RevHub - Microservices Social Media Platform

RevHub is a comprehensive social media application built using a modern **Microservices Architecture**. It leverages **Spring Boot** for the backend services, **Angular 18** for the frontend (using Module Federation), and a robust infrastructure including **Kafka** for event-driven communication, **Consul** for service discovery, and **MySQL/MongoDB** for persistence.

## 🚀 Technology Stack

### Backend
*   **Framework:** Spring Boot (v3.x)
*   **Language:** Java 17+
*   **Database:** MySQL 8.0 (Relational), MongoDB 6.0 (NoSQL)
*   **Event Bus:** Apache Kafka & Zookeeper
*   **Service Discovery:** HashiCorp Consul
*   **API Gateway:** Spring Cloud Gateway
*   **Orchestration:** Docker & Docker Compose

### Frontend
*   **Framework:** Angular 18
*   **Architecture:** Microfrontends (Module Federation)
*   **Styling:** Angular Material, SCSS

---

## 🏗️ Project Structure

```
RevHub/
├── backend-services/           # Spring Boot Microservices
│   ├── api-gateway/            # Entry point for all API requests
│   ├── user-service/           # User management & Profiles
│   ├── post-service/           # Posts, Likes, Comments
│   ├── social-service/         # Graph relationships (Followers/Following)
│   ├── chat-service/           # Real-time chat (WebSocket)
│   ├── notification-service/   # User notifications
│   ├── feed-service/           # News feed generation
│   ├── search-service/         # Search functionality
│   └── saga-orchestrator/      # Distributed transaction management
├── frontend-services/          # Angular Microfrontends
│   ├── shell-app/              # Main Host Application
│   ├── auth-microfrontend/     # Login/Register
│   ├── profile-microfrontend/  # User Profiles
│   └── ...                     # Other feature modules
├── infrastructure/             # Database initialization scripts
├── docker-compose.yml          # Container orchestration config
└── run-application.bat         # Quick start script
```

---

## 🔌 Service Registry & Ports

| Service Name | Port | Description |
| :--- | :--- | :--- |
| **Infrastructure** | | |
| Consul UI | `8500` | Service Discovery Dashboard |
| Kafka | `9092` | Event Streaming Platform |
| Zookeeper | `2181` | Kafka Coordination |
| MySQL | `3306` | Relational Database |
| MongoDB | `27017` | NoSQL Database |
| **Microservices** | | |
| API Gateway | `8080` | Main Backend Entry Point |
| User Service | `8081` | User Accounts & Auth |
| Post Service | `8082` | Content Management |
| Social Service | `8083` | Follower Graph |
| Chat Service | `8084` | Messaging |
| Notification Service | `8085` | Alerts & Activities |
| Feed Service | `8086` | Aggregated User Feeds |
| Search Service | `8087` | Content Search |
| Saga Orchestrator | `8088` | Transaction Coordinator |
| **Frontend** | | |
| Shell App | `4200` | Main User Interface |

---

## 🔄 System Workflow

1.  **Service Registration**: All backend microservices start up and automatically register themselves with **Consul** (Service Discovery).
2.  **API Routing**: Requests from the Frontend flow through the **API Gateway** (Port 8080), which routes them to the appropriate microservice based on the URL path (e.g., `/api/users` -> `user-service`).
3.  **Event-Driven Data Sync**:
    *   When a user creates a post, the `post-service` saves it to MySQL.
    *   It also publishes a `PostCreatedEvent` to **Kafka**.
    *   The `feed-service` consumes this event to update followers' feeds in MongoDB.
    *   The `search-service` consumes this event to index the post for searching.
4.  **Distributed Transactions**: Complex operations (like creating a user, which involves Auth, Profile, and Social records) are managed by the `saga-orchestrator` to ensure data consistency across services.

---

## 🛠️ How to Run

### Prerequisites
*   **Docker Desktop** (Running)
*   **Node.js** (v18+ for Frontend)
*   **Java JDK** (v17+ if running locally without Docker)

### Step 1: Start Backend & Infrastructure
Double-click `run-application.bat` in the root directory, or run:

```bash
docker-compose up -d --build
```

*Wait for a few minutes* for all containers to initialize. You can check the status at [http://localhost:8500](http://localhost:8500) (Consul UI) to see when services are green.

### Step 2: Start Frontend
The frontend currently needs to be run locally (or you can containerize it separately).

1.  Open a terminal in `frontend-services/shell-app`.
2.  Install dependencies (first time only):
    ```bash
    npm install
    ```
3.  Start the application:
    ```bash
    npm start
    ```
4.  Open your browser to **http://localhost:4200**.

---

## 🧪 Testing the API

You can test the backend directly via the API Gateway:
*   **Health Check**: `GET http://localhost:8080/actuator/health`
*   **Users**: `GET http://localhost:8080/api/users/{username}` (Requires Auth)

Enjoy building with RevHub!
