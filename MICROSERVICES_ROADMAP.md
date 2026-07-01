# MayaBhedak Microservices - Implementation Roadmap

## 🎯 Executive Summary

This document provides a **realistic, phased approach** to transforming the current monolithic application into a production-ready microservices architecture.

**Total Estimated Effort:** 8-12 weeks (1 developer)  
**Recommended Team:** 2-3 developers for 4-6 weeks  
**Priority:** Start with critical path items

---

## 📊 Implementation Phases

### Phase 1: Foundation (Week 1-2) - CRITICAL PATH

#### 1.1 Rebrand to MayaBhedak
**Effort:** 4-8 hours  
**Status:** Ready to start  
**Files:** ~50 files  

**Tasks:**
- [ ] Update frontend text (SwarParikshan → MayaBhedak)
- [ ] Update Devanagari (स्वर परीक्षा → माया भेदक)
- [ ] Update meta tags for SEO
- [ ] Update README and docs
- [ ] Test all pages

**Script:** See REBRAND_TO_MAYABHEDAK.md

#### 1.2 Infrastructure Setup
**Effort:** 1-2 days  

**Tasks:**
- [ ] Setup PostgreSQL database
- [ ] Setup Redis
- [ ] Setup MinIO (optional, can use local storage initially)
- [ ] Create .env configuration
- [ ] Setup Docker Compose (basic version)

#### 1.3 Database Schema Design
**Effort:** 1 day  

**Create tables:**
```sql
-- Users table (enhanced)
-- API keys table
-- Tickets table
-- Ticket messages table
-- Notifications table
-- Usage tracking table
```

**Deliverable:** `database/schema.sql`

---

### Phase 2: Auth Service (Week 2-3)

#### 2.1 Email/Password (Upgrade Existing)
**Effort:** 2-3 days  
**Priority:** HIGH  

**Tasks:**
- [ ] Add bcrypt password hashing (cost 12)
- [ ] Email verification flow
- [ ] Forgot password with Redis tokens
- [ ] JWT generation (RS256)
- [ ] Refresh token in httpOnly cookie

**New Files:**
```
auth-service/
├── src/main/java/com/mayabhedak/auth/
│   ├── controller/AuthController.java
│   ├── service/JwtService.java
│   ├── service/EmailVerificationService.java
│   ├── config/SecurityConfig.java
│   └── filter/JwtAuthenticationFilter.java
```

#### 2.2 Google OAuth 2.0
**Effort:** 2-3 days  
**Priority:** MEDIUM  

**Dependencies:**
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-oauth2-client</artifactId>
</dependency>
```

**Tasks:**
- [ ] Configure Google OAuth in application.yml
- [ ] Create OAuth callback endpoint
- [ ] Auto-create user on first login
- [ ] Link Google account to existing users

#### 2.3 Mobile OTP
**Effort:** 3-4 days  
**Priority:** MEDIUM  

**External Dependencies:**
- Twilio account (free tier: $15 credit)
- Redis for OTP storage

**Tasks:**
- [ ] POST /auth/otp/send endpoint
- [ ] POST /auth/otp/verify endpoint
- [ ] Rate limiting (3 attempts per 10 min)
- [ ] Twilio SMS integration
- [ ] Redis OTP storage (120s TTL)

---

### Phase 3: API Gateway (Week 3-4)

#### 3.1 Basic Gateway Setup
**Effort:** 2 days  
**Priority:** HIGH  

**Create new Spring Boot project:**
```
api-gateway/
├── pom.xml
└── src/main/java/com/mayabhedak/gateway/
    ├── GatewayApplication.java
    ├── config/RouteConfig.java
    └── filter/JwtValidationFilter.java
```

**Dependencies:**
```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-gateway</artifactId>
</dependency>
```

#### 3.2 Security Filters
**Effort:** 3-4 days  
**Priority:** HIGH  

**Tasks:**
- [ ] JWT validation filter (verify RS256)
- [ ] API key validation filter
- [ ] Rate limiting (Redis token bucket)
- [ ] Request signing for internal services
- [ ] Security headers

#### 3.3 Rate Limiting
**Effort:** 2 days  
**Priority:** MEDIUM  

**Implementation:**
- Redis token bucket algorithm
- Per-user limits based on plan
- Return 429 with Retry-After header

---

### Phase 4: Trial & Billing Service (Week 4-5)

#### 4.1 Free Trial Logic
**Effort:** 2-3 days  
**Priority:** HIGH  

**Tasks:**
- [ ] Trial initialization on signup
- [ ] Request counting middleware
- [ ] Trial expiry checking
- [ ] Usage tracking API endpoints

**New Endpoints:**
```
GET  /billing/usage        # Current usage
GET  /billing/plans        # Available plans
POST /billing/upgrade      # Upgrade plan (TODO: payment)
```

#### 4.2 Frontend Integration
**Effort:** 2-3 days  
**Priority:** HIGH  

**Tasks:**
- [ ] Trial usage banner component
- [ ] Upgrade page with plan comparison
- [ ] Trial progress bar in navbar
- [ ] Login gate for unauthenticated users

---

### Phase 5: Support & Notifications (Week 5-6)

#### 5.1 Support Service (FastAPI)
**Effort:** 3-4 days  
**Priority:** MEDIUM  

**Create new FastAPI project:**
```
support-service/
├── main.py
├── models.py
├── routes.py
├── database.py
└── requirements.txt
```

**Tasks:**
- [ ] Ticket CRUD endpoints
- [ ] Message threading
- [ ] Auto-priority assignment
- [ ] FAQ endpoint

#### 5.2 Notification Service (FastAPI)
**Effort:** 3-4 days  
**Priority:** MEDIUM  

**Tasks:**
- [ ] Redis pub/sub consumer
- [ ] SendGrid email integration
- [ ] Twilio SMS integration
- [ ] In-app notifications API
- [ ] Email templates

#### 5.3 Frontend Support UI
**Effort:** 2-3 days  

**Tasks:**
- [ ] Floating support button
- [ ] Support ticket slide-in panel
- [ ] FAQ accordion
- [ ] Bell icon with notifications

---

### Phase 6: Docker & Deployment (Week 6-7)

#### 6.1 Complete Docker Compose
**Effort:** 2-3 days  

**Tasks:**
- [ ] All services defined
- [ ] Health checks configured
- [ ] Networks and volumes
- [ ] Environment variables
- [ ] Service dependencies

#### 6.2 Testing & Integration
**Effort:** 3-5 days  

**Tasks:**
- [ ] Unit tests for auth flows
- [ ] Integration tests for gateway
- [ ] End-to-end tests
- [ ] Load testing
- [ ] Security audit

---

## 🚀 Quick Start Implementation

### Option 1: Incremental Approach (Recommended)

**Keep current monolith running, add new services gradually:**

1. **Week 1:** Rebrand + Auth service (separate port 8082)
2. **Week 2:** Gateway (port 8080) routing to both old and new
3. **Week 3:** Trial service + migrate existing users
4. **Week 4:** Support + Notifications
5. **Week 5:** Complete migration + Docker Compose
6. **Week 6:** Testing + deployment

**Advantage:** Zero downtime, can test incrementally

### Option 2: Big Bang Approach

**Build everything first, switch over once:**

1. **Week 1-5:** Build all services in parallel
2. **Week 6:** Integration and testing
3. **Week 7:** Cutover to new architecture

**Advantage:** Cleaner architecture from start  
**Risk:** Longer time to production

---

## 💡 Practical Next Steps (Right Now)

### Immediate Action Items (Today)

1. **Rebrand to MayaBhedak** (4 hours)
   - Run the search & replace scripts
   - Update meta tags
   - Test frontend

2. **Setup Development Environment** (2 hours)
   - Install Docker Desktop
   - Setup PostgreSQL locally
   - Setup Redis locally
   - Copy .env.example to .env

3. **Create Auth Service Project** (2 hours)
   - Create Spring Boot project
   - Add dependencies
   - Create basic structure
   - Test "Hello World"

### This Week

4. **Implement Enhanced Email/Password Auth** (2-3 days)
   - Add bcrypt
   - JWT with RS256
   - Email verification
   - Forgot password

5. **Create Basic API Gateway** (2 days)
   - Route configuration
   - JWT validation
   - Test with Postman

### Next Week

6. **Google OAuth Integration** (2-3 days)
7. **Free Trial System** (2-3 days)

---

## 📚 Required Skills & Resources

### Skills Needed
- Spring Boot (intermediate)
- FastAPI (basic)
- Docker (basic)
- PostgreSQL (basic)
- Redis (basic)
- React (intermediate)

### External Services (Free Tiers Available)
- **Google Cloud Console:** OAuth credentials (free)
- **Twilio:** $15 free credit for SMS
- **SendGrid:** 100 emails/day free
- **Docker Hub:** Free for public images

### Learning Resources
- Spring Security OAuth2: https://spring.io/guides/tutorials/spring-boot-oauth2/
- JWT Best Practices: https://tools.ietf.org/html/rfc8725
- FastAPI Docs: https://fastapi.tiangolo.com/
- Redis Pub/Sub: https://redis.io/topics/pubsub

---

## 🎯 Success Metrics

### Phase 1 Complete When:
✅ Rebranded to MayaBhedak  
✅ PostgreSQL + Redis running  
✅ .env configured  

### Phase 2 Complete When:
✅ Email/Password auth working with JWT  
✅ Google OAuth working  
✅ Mobile OTP working  
✅ All 3 methods tested  

### Phase 3 Complete When:
✅ Gateway routing all requests  
✅ JWT validation working  
✅ Rate limiting working  
✅ Security headers present  

### Phase 6 Complete When:
✅ All services in Docker Compose  
✅ Frontend login works end-to-end  
✅ Free trial system functional  
✅ Support tickets work  
✅ Notifications delivered  

---

## ⚠️ Important Notes

1. **Don't Break Production:** Keep existing monolith running while building new services

2. **Database Migration:** Plan carefully, use Flyway or Liquibase for schema versioning

3. **Secrets Management:** Never commit real credentials, use .env

4. **Testing:** Write tests as you go, not at the end

5. **Documentation:** Update architecture docs with each service

6. **Monitoring:** Add logging from day 1

---

## 🤝 Need Help?

**Stuck on implementation?** Break it down further:
- Start with just JWT auth (skip OAuth/OTP initially)
- Use in-memory cache instead of Redis initially
- Skip Docker Compose, run services locally
- Build one endpoint at a time

**Remember:** Perfect is the enemy of done. Ship incrementally!

---

**Status:** Ready for implementation  
**Last Updated:** June 30, 2026  
**Maintained By:** Development Team
