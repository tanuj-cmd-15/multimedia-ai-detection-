# MayaBhedak - Complete Implementation Checklist

## 📋 Pre-Implementation Setup

### Your Answers Needed:
- [ ] Java version: _______
- [ ] Maven installed: YES / NO
- [ ] Docker Desktop installed: YES / NO
- [ ] PostgreSQL: Docker / Local / Not installed
- [ ] Redis: Docker / Local / Not installed

### External Accounts Setup:
- [ ] Google Cloud Console account created
- [ ] Google OAuth credentials obtained (Client ID + Secret)
- [ ] Twilio account created
- [ ] Twilio SID, Auth Token, Phone Number obtained
- [ ] SendGrid account created
- [ ] SendGrid API Key obtained

---

## 🎯 PHASE 1: Infrastructure (Day 1 - Morning)

### 1.1 Create Environment Files ⏱️ 10 minutes
- [ ] Copy `.env.example` to `.env`
- [ ] Fill in all environment variables
- [ ] Generate JWT keys (I'll provide command)
- [ ] Save all credentials securely

### 1.2 Setup Database ⏱️ 15 minutes
- [ ] Start PostgreSQL (Docker or local)
- [ ] Run `database/init.sql` schema
- [ ] Verify tables created
- [ ] Test connection

### 1.3 Setup Redis ⏱️ 5 minutes
- [ ] Start Redis (Docker or local)
- [ ] Test connection with redis-cli
- [ ] Verify password works

### 1.4 Start Docker Infrastructure ⏱️ 10 minutes
- [ ] Run `docker-compose -f docker-compose-infra.yml up -d`
- [ ] Check all containers running
- [ ] Check logs for errors

**✅ Checkpoint:** Postgres + Redis + MinIO running

---

## 🎯 PHASE 2: Auth Service (Day 1 - Afternoon)

### 2.1 Create Auth Service Project ⏱️ 30 minutes
- [ ] Create Spring Boot project structure
- [ ] Add all dependencies to pom.xml
- [ ] Configure application.yml
- [ ] Create main Application class
- [ ] Test service starts on port 8082

### 2.2 Email/Password Auth ⏱️ 2 hours
- [ ] Create User entity
- [ ] Create UserRepository
- [ ] Implement bcrypt password hashing
- [ ] Create registration endpoint
- [ ] Create login endpoint
- [ ] Generate JWT (RS256)
- [ ] Test with Postman

### 2.3 Google OAuth 2.0 ⏱️ 2 hours
- [ ] Add OAuth2 dependencies
- [ ] Configure Google OAuth in application.yml
- [ ] Create OAuth callback handler
- [ ] Test Google login flow
- [ ] Auto-create user on first login

### 2.4 Mobile OTP ⏱️ 2 hours
- [ ] Create OTP send endpoint
- [ ] Integrate Twilio SDK
- [ ] Store OTP in Redis (120s TTL)
- [ ] Create OTP verify endpoint
- [ ] Implement rate limiting (3 per 10min)
- [ ] Test with real phone number

**✅ Checkpoint:** All 3 auth methods working

---

## 🎯 PHASE 3: API Gateway (Day 2 - Morning)

### 3.1 Create Gateway Project ⏱️ 30 minutes
- [ ] Create Spring Cloud Gateway project
- [ ] Add dependencies
- [ ] Configure routes
- [ ] Test basic routing

### 3.2 JWT Validation ⏱️ 2 hours
- [ ] Create JWT validation filter
- [ ] Fetch public key from auth service
- [ ] Verify RS256 signature
- [ ] Extract user info from JWT
- [ ] Test with valid/invalid tokens

### 3.3 Rate Limiting ⏱️ 2 hours
- [ ] Implement Redis token bucket
- [ ] Set limits per plan (10/100/1000 req/min)
- [ ] Return 429 with Retry-After header
- [ ] Test rate limiting

### 3.4 Request Signing ⏱️ 1 hour
- [ ] Create HMAC-SHA256 signing
- [ ] Add X-Internal-Sig header
- [ ] Update ML services to verify signature
- [ ] Test signed requests

**✅ Checkpoint:** Gateway routing with security

---

## 🎯 PHASE 4: Trial & Billing Service (Day 2 - Afternoon)

### 4.1 Create Trial Service ⏱️ 1 hour
- [ ] Create Spring Boot project
- [ ] Add dependencies
- [ ] Configure database
- [ ] Test service starts on port 8083

### 4.2 Trial Logic ⏱️ 2 hours
- [ ] Create trial tracking entity
- [ ] Initialize trial on signup
- [ ] Create usage middleware
- [ ] Increment counter on detection
- [ ] Check limits before allowing detection
- [ ] Test trial exhaustion

### 4.3 Plans & Billing ⏱️ 2 hours
- [ ] Create /billing/plans endpoint
- [ ] Create plan comparison JSON
- [ ] Add upgrade endpoint (TODO: payment)
- [ ] Test plan switching

**✅ Checkpoint:** Free trial system working

---

## 🎯 PHASE 5: Support Service (Day 3 - Morning)

### 5.1 Create Support Service ⏱️ 1 hour
- [ ] Create FastAPI project
- [ ] Setup database models
- [ ] Test service starts on port 8084

### 5.2 Ticket System ⏱️ 3 hours
- [ ] Create tickets table
- [ ] Create ticket_messages table
- [ ] Implement CRUD endpoints
- [ ] Auto-assign priority
- [ ] Test ticket creation

### 5.3 FAQ System ⏱️ 1 hour
- [ ] Create FAQ JSON
- [ ] Create FAQ endpoint
- [ ] Test FAQ retrieval

**✅ Checkpoint:** Support tickets working

---

## 🎯 PHASE 6: Notification Service (Day 3 - Afternoon)

### 6.1 Create Notification Service ⏱️ 1 hour
- [ ] Create FastAPI project
- [ ] Setup Redis pub/sub
- [ ] Test service starts on port 8085

### 6.2 Email Integration ⏱️ 2 hours
- [ ] Integrate SendGrid
- [ ] Create email templates
- [ ] Subscribe to notify:email channel
- [ ] Test email sending

### 6.3 SMS Integration ⏱️ 1 hour
- [ ] Integrate Twilio
- [ ] Subscribe to notify:sms channel
- [ ] Test SMS sending

### 6.4 In-App Notifications ⏱️ 2 hours
- [ ] Create notifications table
- [ ] Create notification endpoints
- [ ] Test notification storage

**✅ Checkpoint:** All notification channels working

---

## 🎯 PHASE 7: Frontend Integration (Day 4)

### 7.1 Rebrand to MayaBhedak ⏱️ 2 hours
- [ ] Update all text references
- [ ] Update meta tags
- [ ] Update logos
- [ ] Test all pages

### 7.2 New Login Page ⏱️ 3 hours
- [ ] Create tab switcher component
- [ ] Email/Password tab
- [ ] Google OAuth button
- [ ] Mobile OTP tab with countdown
- [ ] Test all 3 methods

### 7.3 Navbar Updates ⏱️ 2 hours
- [ ] Add avatar display
- [ ] Add plan badge
- [ ] Add trial usage bar
- [ ] Add notification bell
- [ ] Add user menu

### 7.4 Support UI ⏱️ 2 hours
- [ ] Floating support button
- [ ] Support panel slide-in
- [ ] Ticket creation form
- [ ] Ticket list view
- [ ] Test support flow

**✅ Checkpoint:** Frontend fully integrated

---

## 🎯 PHASE 8: Docker & Deployment (Day 5)

### 8.1 Complete Docker Compose ⏱️ 2 hours
- [ ] Add all microservices
- [ ] Configure networks
- [ ] Configure volumes
- [ ] Add health checks
- [ ] Test full stack startup

### 8.2 Testing ⏱️ 4 hours
- [ ] End-to-end auth flow
- [ ] Detection with trial limits
- [ ] Support ticket creation
- [ ] Notifications delivery
- [ ] Rate limiting
- [ ] API key management

### 8.3 Documentation ⏱️ 2 hours
- [ ] Complete MICROSERVICES_ARCHITECTURE.md
- [ ] Update README.md
- [ ] Add API documentation
- [ ] Create deployment guide

**✅ Checkpoint:** Production-ready system

---

## 📊 Progress Tracker

| Phase | Status | Time Estimate | Actual Time |
|-------|--------|---------------|-------------|
| Phase 1: Infrastructure | ⏳ Pending | 40 min | ___ |
| Phase 2: Auth Service | ⏳ Pending | 6 hours | ___ |
| Phase 3: API Gateway | ⏳ Pending | 5.5 hours | ___ |
| Phase 4: Trial Service | ⏳ Pending | 5 hours | ___ |
| Phase 5: Support Service | ⏳ Pending | 5 hours | ___ |
| Phase 6: Notification Service | ⏳ Pending | 6 hours | ___ |
| Phase 7: Frontend | ⏳ Pending | 9 hours | ___ |
| Phase 8: Docker & Deploy | ⏳ Pending | 8 hours | ___ |
| **TOTAL** | | **45 hours** | ___ |

---

## ✅ Current Status

**Started:** __________  
**Phase:** __________  
**Blocked By:** __________  
**Next Action:** __________

---

## 🚨 Troubleshooting

If stuck, check:
1. All services running? `docker ps`
2. Logs: `docker logs <container-name>`
3. Database connected? Check connection string
4. Redis working? `redis-cli ping`
5. Environment variables loaded? Check .env

---

**Last Updated:** Starting implementation  
**Maintained By:** You + Kiro AI
