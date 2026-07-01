# MayaBhedak - Microservices Architecture

## Overview

MayaBhedak (माया भेदक - "Illusion Breaker") is an industrial-grade, production-ready deepfake detection platform built with a microservices architecture.

**Platform Name:** MayaBhedak  
**Meaning:** Illusion Breaker (Sanskrit: माया = Illusion, भेदक = Breaker)  
**Architecture:** Microservices with API Gateway pattern  
**Tech Stack:** Spring Boot, FastAPI, React + Vite + TailwindCSS, PostgreSQL, Redis, MinIO

---

## Service Inventory

| Service | Port | Technology | Purpose |
|---------|------|------------|---------|
| **API Gateway** | 8080 | Spring Cloud Gateway | Entry point, routing, auth, rate limiting |
| **Auth Service** | 8082 | Spring Boot | Google OAuth, OTP, JWT management |
| **Trial/Billing Service** | 8083 | Spring Boot | Free trial tracking, subscription plans |
| **Support Service** | 8084 | FastAPI | Customer support tickets, FAQs |
| **Notification Service** | 8085 | FastAPI | Email, SMS, in-app notifications |
| **Audio Detection** | 5000 | Flask + PyTorch | Audio deepfake detection ML |
| **Image Detection** | 5001 | Flask + PyTorch | AI-generated image detection ML |
| **Frontend** | 3000 | React + Vite | User interface |
| **PostgreSQL** | 5432 | Database | Persistent storage |
| **Redis** | 6379 | Cache/Queue | Sessions, rate limiting, pub/sub |
| **MinIO** | 9000 | Object Storage | File uploads, ML artifacts |

---

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      User Browser                            │
│                   http://localhost:3000                      │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              API Gateway (Port 8080)                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ • JWT Validation (RS256)                             │  │
│  │ • API Key Validation                                 │  │
│  │ • Rate Limiting (Redis Token Bucket)                 │  │
│  │ • Request Signing (HMAC-SHA256)                      │  │
│  │ • Security Headers                                   │  │
│  └──────────────────────────────────────────────────────┘  │
└───┬───────┬────────┬────────┬────────┬────────┬────────────┘
    │       │        │        │        │        │
    ▼       ▼        ▼        ▼        ▼        ▼
┌────────┐┌──────┐┌───────┐┌───────┐┌────────┐┌───────────┐
│ Auth   ││Trial ││Support││Notif  ││Audio   ││Image      │
│Service ││Billing│Service││Service││Detect  ││Detect     │
│:8082   ││:8083 ││:8084  ││:8085  ││:5000   ││:5001      │
└───┬────┘└──┬───┘└───┬───┘└───┬───┘└───┬────┘└─────┬─────┘
    │        │        │        │        │            │
    └────────┴────────┴────────┴────────┴────────────┘
                           ▼
    ┌──────────────────────────────────────────────────┐
    │         Shared Infrastructure                     │
    │  ┌────────────┐  ┌─────────┐  ┌──────────────┐ │
    │  │ PostgreSQL │  │  Redis  │  │    MinIO     │ │
    │  │   :5432    │  │  :6379  │  │    :9000     │ │
    │  └────────────┘  └─────────┘  └──────────────┘ │
    └──────────────────────────────────────────────────┘
```

---

## Service Responsibilities

### 1. API Gateway (Spring Cloud Gateway - Port 8080)

**Purpose:** Single entry point for all client requests

**Responsibilities:**
- Route requests to appropriate microservices
- JWT validation (RS256 signature verification)
- API key validation and scope checking
- Rate limiting (Redis token bucket algorithm)
