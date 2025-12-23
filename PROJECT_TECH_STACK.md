# RevHub - Technical Stack & Design Decision Document

This document serves as a reference for the **Libraries, Frameworks, and Tools** used in the RevHub project. Use this for your interview to explain *what* you used and *why*.

---

## 1. Backend Technology Stack

| Technology | Version | Purpose | Why I Used It? |
| :--- | :--- | :--- | :--- |
| **Java** | 17 (LTS) | Core Programming Language | Java 17 is the latest standard Long Term Support version. It offers better performance (GC improvements) and modern syntax (Records, Switch expressions) compared to Java 8. |
| **Spring Boot** | 3.5.8 | Application Framework | To build production-ready microservices quickly. "Starters" eliminate boilerplate configuration, allowing me to focus on business logic (User, Post, Chat features). |
| **Spring Cloud** | 2024.0.0 | Microservices Orchestration | Provides out-of-the-box support for **Service Discovery (Consul)** and **API Gateway**, essential for a distributed system. |
| **Spring Security** | - | Authentication & Authorization | The industry standard for securing Spring apps. It handles the filter chain for JWT validation and endpoint protection. |

## 2. Key Libraries

| Library | Version | Purpose | Why I Used It? |
| :--- | :--- | :--- | :--- |
| **JJWT (Java JWT)** | 0.12.3 | Token Management | A modern, fluent library for creating and validating **JSON Web Tokens**. I chose the latest version (0.12.x) for better security standards (SHA-256 by default). |
| **Lombok** | Latest | Code Reduction | To avoid writing boilerplate code like Getters, Setters, Constructors, and Builders. It keeps my Entity and DTO classes clean and readable. |
| **Spring Kafka** | - | Event Messaging | Provides a high-level abstraction over the Apache Kafka Java Client. It makes sending messages (`KafkaTemplate`) and consuming them (`@KafkaListener`) extremely simple. |

---

## 3. Frontend Technology Stack

| Technology | Version | Purpose | Why I Used It? |
| :--- | :--- | :--- | :--- |
| **Angular** | 18.0.0 | Frontend Framework | **Module Federation**. Angular 18 has excellent support for Micro-Frontends. This allows me to develop the `auth-app` and `shell-app` independently and load them together at runtime. |
| **RxJS** | ~7.8.0 | Reactive Programming | Used for handling asynchronous data streams (HTTP requests, generic state management) elegantly using Observables. |
| **Angular Material** | ^18.0.0 | UI Component Library | To provide a professional, consistent look and feel (Cards, Inputs, Buttons) without writing custom CSS from scratch. |

---

## 4. Databases & Infrastructure

| Component | Technology | Why I Used It? |
| :--- | :--- | :--- |
| **Relational DB** | **MySQL 8.0** | Used for **Structured Data** (Users, Posts). We need ACID compliance for transactions (e.g., ensuring a user is created only if their profile is valid). |
| **NoSQL DB** | **MongoDB 6.0** | Used for **High Volume/Unstructured Data** (Chat Messages, Notifications). It handles faster write ingestion rates and flexible schemas (different types of notifications). |
| **Message Broker** | **Apache Kafka** | To **Decouple** services. If the *Notification Service* is down, the *Post Service* shouldn't fail. Kafka stores the "Comment Created" event until Notification Service comes back up. |
| **Service Discovery** | **HashiCorp Consul** | Dynamic registration. I don't want to hardcode IP addresses (`localhost:8081`). Services look up each other by name (`user-service`) via Consul. |
| **Containerization** | **Docker** | Consistency. It ensures the app runs the same on my Windows laptop and the AWS EC2 Linux instance. |

---

## 5. Summary for "Tell me about your project"

"I built **RevHub**, a distributed social media application using **Spring Boot 3.5** and **Angular 18**.
I leveraged a **Microservices Architecture** to scale features independently.
- For data, I used a **Polyglot Persistence** strategy: **MySQL** for relational user/post data and **MongoDB** for high-velocity chat messages.
- For communication, I implemented **Kafka** for asynchronous, non-blocking notifications and **FeignClient/RestTemplate** for synchronous checks.
- Security is handled via stateless **JWTs** signed with **HMAC-SHA256**.
- The entire stack is containerized with **Docker Code** and orchestrated via **Consul** for service discovery."
