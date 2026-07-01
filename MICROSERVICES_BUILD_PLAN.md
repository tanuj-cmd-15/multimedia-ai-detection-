# Microservices Build Plan

## ✅ COMPLETED: Auth Service (Port 8082)
- **Status**: 100% Complete - 35 files created
- **Features**: Email/Password, Google OAuth, Mobile OTP, JWT tokens
- **Ready to Use**: Yes

---

## 🔄 IN PROGRESS: Trial & Subscription Service (Port 8083)

### Files Created So Far:
1. ✅ pom.xml (Maven dependencies)
2. ✅ TrialServiceApplication.java (Main class)
3. ✅ application.yml (Configuration)
4. ✅ Subscription.java (Entity)

### Still Need to Create (~25 files):
- **Enums**: PlanType, SubscriptionStatus, DetectionType
- **Entities**: UsageTracking
- **Repositories**: SubscriptionRepository, UsageTrackingRepository
- **DTOs**: PlanDetails, UsageStats, UpgradeRequest, UpgradeResponse, InitializeTrialRequest
- **Services**: TrialService, UsageTrackingService, PaymentService
- **Controller**: SubscriptionController
- **Scheduled Jobs**: TrialExpiryChecker, MonthlyUsageReset
- **Database**: Flyway migration for subscriptions and usage_tracking tables
- **Dockerfile**: Container configuration

**Estimated Time**: 45 minutes to complete

---

## 🔄 TO BUILD: API Gateway (Port 8080)

### Technology: Spring Cloud Gateway

### Files Needed (~20 files):
- **Configuration**: GatewayConfig, CorsConfig, SecurityConfig
- **Filters**: JwtValidationFilter, RateLimitFilter, RequestSigningFilter
- **Services**: JwtValidationService, RateLimitService
- **DTOs**: ErrorResponse, HealthAggregateResponse
- **Controller**: GatewayHealthController
- **Properties**: application.yml (route configuration)
- **Dockerfile**: Container configuration

**Key Features**:
- Route all requests to microservices
- Validate JWT tokens (RS256 public key)
- Rate limiting per plan (Redis token bucket)
- Add security headers
- HMAC signing for ML service requests
- Aggregate health checks

**Estimated Time**: 1 hour

---

## 🔄 TO BUILD: Support Service (Port 8084)

### Technology: FastAPI (Python)

### Files Needed (~15 files):
- **Main**: main.py (FastAPI app)
- **Models**: Ticket, TicketMessage, FAQ (SQLAlchemy)
- **Schemas**: TicketCreate, TicketResponse, MessageCreate, FAQResponse (Pydantic)
- **Routes**: tickets.py, faq.py
- **Services**: ticket_service.py, faq_service.py
- **Database**: alembic migrations
- **Config**: config.py, database.py
- **Requirements**: requirements.txt
- **Dockerfile**: Container configuration

**Key Features**:
- Create and manage support tickets
- Thread-based conversation
- FAQ system with 10 pre-populated questions
- File attachments (MinIO)
- Auto-priority assignment
- Email notifications

**Estimated Time**: 1 hour

---

## 🔄 TO BUILD: Notification Service (Port 8085)

### Technology: FastAPI (Python)

### Files Needed (~18 files):
- **Main**: main.py (FastAPI app)
- **Models**: Notification, NotificationPreference (SQLAlchemy)
- **Schemas**: EmailRequest, SMSRequest, InAppRequest (Pydantic)
- **Routes**: notifications.py, preferences.py
- **Services**: email_service.py, sms_service.py, notification_service.py
- **Templates**: Email templates (Jinja2)
- **Workers**: Redis pub/sub subscriber
- **Database**: alembic migrations
- **Config**: config.py, database.py
- **Requirements**: requirements.txt
- **Dockerfile**: Container configuration

**Key Features**:
- Send emails via SendGrid (8 templates)
- Send SMS via Twilio
- In-app notifications with bell icon
- User notification preferences
- Weekly usage digest
- Redis pub/sub for real-time delivery

**Estimated Time**: 1.5 hours

---

## 📊 Summary

| Service | Port | Technology | Status | Files | Time |
|---------|------|------------|--------|-------|------|
| Auth Service | 8082 | Spring Boot | ✅ Complete | 35 | Done |
| Trial Service | 8083 | Spring Boot | 🔄 In Progress | 4/30 | 45 min |
| API Gateway | 8080 | Spring Cloud | ⏳ Not Started | 0/20 | 1 hr |
| Support Service | 8084 | FastAPI | ⏳ Not Started | 0/15 | 1 hr |
| Notification Service | 8085 | FastAPI | ⏳ Not Started | 0/18 | 1.5 hr |

**Total Remaining Work**: ~4 hours of implementation

---

## 🎯 Recommended Approach

### Option A: Complete One Service at a Time
**Pros**: Test each service thoroughly before moving on  
**Cons**: Longer before seeing full system

**Order**:
1. Finish Trial Service (45 min)
2. Build API Gateway (1 hr)
3. Build Support Service (1 hr)
4. Build Notification Service (1.5 hr)
5. Integrate Frontend

### Option B: Build Minimal Working System
**Pros**: Get end-to-end flow working quickly  
**Cons**: Missing some features initially

**Phase 1** (2 hours):
- Finish Trial Service (core features only)
- Build minimal API Gateway (routing + JWT validation)
- Skip Support and Notification initially

**Phase 2** (2 hours):
- Add Support Service
- Add Notification Service
- Complete all features

### Option C: Parallel Development
**Pros**: Fastest overall  
**Cons**: More complex to coordinate

- You: Test Auth Service
- Me: Build all remaining services simultaneously
- Then: Integration testing together

---

## 💡 My Recommendation

**Go with Option A** - Complete one service at a time. Here's why:

1. **Trial Service** is critical - Auth Service calls it
2. **API Gateway** is the entry point - everything flows through it
3. **Support & Notification** are nice-to-have initially

**Next Step**: Let me finish the Trial Service (45 minutes), then you can test Auth + Trial together.

---

## 🚀 Quick Decision Guide

**If you want to:**

**Test the system ASAP** → Choose Option B (Minimal working system)

**Have everything production-ready** → Choose Option A (Complete one at a time)

**Speed run** → Choose Option C (Parallel development)

---

**What would you like me to do?**

1. **Continue building Trial Service** (finish the remaining 25 files)
2. **Skip to API Gateway** (so you can route requests)
3. **Build everything in parallel** (all services at once)
4. **Take a break and test what we have** (Auth Service only)

Let me know and I'll continue! 🚀
