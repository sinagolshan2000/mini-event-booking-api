# Mini Event Booking System API

A lightweight RESTful API for managing events and bookings, built with **Fastify**, **Node.js**, and **TypeScript**. The project is intentionally minimal, focusing on clean architecture, correctness, and clarity rather than heavy infrastructure.

---

## Tech Stack

* **Node.js** v22.21.1
* **Fastify** – high-performance HTTP framework
* **TypeScript** – type safety and maintainability
* **lowdb** – JSON-based persistence
* **bcrypt** – password hashing
* **@fastify/rate-limit** – IP-based rate limiting
* **Vitest** – unit testing
* **Docker** – containerization

---

## APL list
You see them in postman.json and you can import them in postman

### Core

* CRUD APIs for **Events** and **Bookings**
* Each Event has: `name`, `date`, `location`, `capacity`
* Each Booking links a **user** to an **event**
* List events with **remaining seats**

### Constraints

* Bookings cannot exceed event capacity
* Same user cannot book the same event twice

### Extras

* Pagination (`page`, `limit`) on list endpoints
* Event filtering by date range (`startDate`, `endDate`) and location
* Token-based authentication
* **Global IP-based rate limiting** on all endpoints
* Docker support

---

## Architecture Overview

```
┌──────────────┐
│   Client     │
└──────┬───────┘
       │ HTTP
┌──────▼───────┐
│  Fastify App │
│              │
│  ┌────────┐  │
│  │ Auth   │◄─┼── Token validation
│  └────────┘  │
│              │
│  ┌────────┐  │
│  │ Events │  │
│  └────────┘  │
│              │
│  ┌────────┐  │
│  │Bookings│  │
│  └────────┘  │
└──────┬───────┘
       │
┌──────▼───────┐
│    lowdb     │
│   (db.json) │
└──────────────┘
```

### Design Notes

* **Modules are isolated** (schema, service, routes)
* Authentication is implemented as a **Fastify plugin**
* Business rules live in service layers
* Persistence is abstracted behind lowdb

---

## Setup Instructions

### Prerequisites

* Node.js **v22.21.1**
* npm

## Bofore Setup
Clear users field in db.json, give it empty value "[]".
Two user authomatically added to db when starting server.
Just to make sure password is hashed correctly for them.

### Local Development

```bash
npm install
npm run dev
```

Server will start on:

```
http://localhost:3000
```

### Production Build

```bash
npm run build
npm start
```

---

## Docker Setup

### Build image

```bash
docker build -t mini-event-api .
```

### Run container

```bash
docker run -p 3000:3000 mini-event-api
```

---

## Authentication

* Login via `POST /auth/login`
* Receive a Bearer token
* Send token in all subsequent requests:

```
Authorization: Bearer <token>
```

Tokens are stored in the database for simplicity.

---

## Rate Limiting

* Global IP-based rate limiting
* Default: **100 requests per minute per IP**
* Applied to **all endpoints**

---

## Error Handling

* Proper HTTP status codes (`400`, `401`, `404`, `409`, `500`)
* Consistent error response format
* Validation handled via JSON schema

---

## Trade-offs & Decisions

### lowdb (JSON database)

**Pros**:

* Zero setup
* Easy to reason about
* Ideal for small projects and take-home tasks

**Cons**:

* No concurrency guarantees
* Not suitable for high traffic or distributed systems

### Token-based Auth (no JWT)

* Tokens stored in DB for simplicity
* Easy invalidation
* Avoids extra cryptographic complexity

### No Concurrency Handling

* Explicitly out of scope
* Keeps logic simple and readable

---

## Testing

```bash
npm run test
```

Tests cover:

* Service-level business logic
* API endpoints
* Edge cases (capacity, double booking)

---

## Login
Two users for testing is inserted to db when running app
make sure clear db.json before running server
Try it to login
email: user@example.com
password: password123

email: user2@example.com
password: password123

## Postman
You can test APIs with post man
How to use

1. Open Postman

2. Click Import

3. Paste the JSON file postman.json located in project root directory

4. Set environment variable:

    * baseUrl → http://localhost:3000

5. Login first → copy token → set token variable

## Project Status

All core requirements and recommended extras are implemented. The project prioritizes clarity, correctness, and evaluability over production-scale complexity.
