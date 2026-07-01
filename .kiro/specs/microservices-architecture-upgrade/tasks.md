# Implementation Plan: Microservices Architecture Upgrade

## Overview

This implementation plan breaks down the microservices architecture upgrade into granular, executable tasks. The architecture introduces five new services (Auth Service, Trial & Subscription Service, API Security Gateway, Customer Support Service, and Notification Service) while maintaining compatibility with existing ML detection services. Each task includes specific file references, clear acceptance criteria, and requirement traceability.

**Existing Infrastructure:**
- Auth Service: Skeleton only (pom.xml configured)
- Backend Service: Fully implemented Spring Boot service
- Frontend: React application
- Docker Compose: PostgreSQL, Redis, MinIO already configured
- ML Services: Audio and Image detection services operational

**Implementation Strategy:**
1. Complete infrastructure and database setup
2. Build Auth Service with all three login methods
3. Implement Trial & Subscription Service
4. Build API Gateway with security filters
5. Implement Support and Notification Services
6. Integrate frontend with new architecture
7. Test and deploy

## Tasks

- [ ] 1. Infrastructure and Database Setup
  - [ ] 1.1 Set up PostgreSQL database schema and migrations
    - Create Flyway migration directory structure in auth-service and trial-service
    - Write V1__initial_schema.sql for users table with all auth provider columns
    - Write V2__subscriptions_schema.sql for subscriptions and usage_tracking tables
    - Write V3__api_keys_schema.sql for api_keys table
    - Configure Flyway in application.yml for both services
    - Test migrations run successfully on docker-compose up
    - _Requirements: 1.1, 1.2, 1.3, 6.1, 6.2, 15.1, 15.2_
  
  - [~] 1.2 Configure Redis for caching and rate limiting
    - Update docker-compose.yml Redis service with persistence configuration
    - Create RedisConfig.java in auth-service for connection pooling
    - Implement RedisTemplate beans for JWT blacklist and OTP storage
    - Configure Redis connection properties in application.yml
    - Test Redis connectivity with ping command
    - _Requirements: 4.9, 4.10, 13.4, 13.5_
  
  - [~] 1.3 Generate RSA key pair for JWT signing
    - Create secrets/ directory in project root
    - Generate RSA-2048 private key using openssl
    - Extract public key from private key
    - Update application.yml to reference key files
    - Add secrets/ to .gitignore to prevent key exposure
    - Document key generation steps in README.md
    - _Requirements: 4.1, 4.11_
  
  - [~] 1.4 Set up environment variables and .env file
    - Create .env.example template with all required variables
    - Document all environment variables: database credentials, OAuth keys, Twilio/SendGrid keys, Razorpay keys
    - Add .env to .gitignore
    - Update docker-compose.yml to use env_file directive
    - Create setup script to generate .env from template
    - _Requirements: 29.7, 35.5_
  
  - [~] 1.5 Update docker-compose.yml for new microservices
    - Add auth-service container with port 8082
    - Add trial-service container with port 8083
    - Add gateway container with port 8080
    - Add support-service container with port 8084 (FastAPI)
    - Add notification-service container with port 8085 (FastAPI)
    - Configure service dependencies and health checks
    - Set up Docker network for inter-service communication
    - _Requirements: 29.1, 29.2, 29.3, 29.4, 29.5, 29.6, 29.8_

- [ ] 2. Auth Service - Core Foundation
  - [~] 2.1 Create User entity and repository
    - Create User.java entity with all fields: id, email, mobile_number, password_hash, google_sub, auth_provider, full_name, avatar_url, email_verified, mobile_verified, created_at, last_login_at
    - Add JPA annotations and validation constraints (@NotNull, @Email, @Size)
    - Create UserRepository.java extending JpaRepository
    - Add custom query methods: findByEmail, findByMobileNumber, findByGoogleSub
    - Write unit tests for repository methods
    - _Requirements: 1.1, 2.6, 2.7, 3.1, 3.7_
  
  - [~] 2.2 Implement password hashing and validation
    - Create PasswordEncoderConfig.java with BCryptPasswordEncoder bean (10 salt rounds)
    - Create PasswordValidator.java service for complexity checks (min 8 chars, uppercase, lowercase, digit)
    - Implement password hashing in user registration flow
    - Write unit tests for password validation rules
    - Test password verification with bcrypt
    - _Requirements: 1.2, 1.3, 5.5_
  
  - [~] 2.3 Implement JWT token generation service
    - Create JwtService.java with RS256 signing using private key
    - Implement generateAccessToken method (15-minute expiry, includes userId, email, plan, roles)
    - Implement generateRefreshToken method (7-day expiry)
    - Add JWT claims: userId, email, plan, roles, iat, exp
    - Load RSA private key from file path in application.yml
    - Write unit tests for token generation
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  
  - [~] 2.4 Implement JWT validation and parsing
    - Create JwtValidator.java with RS256 verification using public key
    - Implement validateToken method checking signature and expiry
    - Implement extractClaims method to parse JWT payload
    - Add blacklist check against Redis before accepting token
    - Load RSA public key from file path
    - Write unit tests for token validation edge cases
    - _Requirements: 4.5, 4.6, 4.10, 4.12_

- [ ] 3. Auth Service - Email/Password Authentication
  - [~] 3.1 Implement user registration endpoint
    - Create RegisterRequest DTO with email, password, fullName, mobileNumber (optional)
    - Create AuthController.java with POST /register endpoint
    - Validate email format and password complexity
    - Hash password with bcrypt before storage
    - Save user to database with auth_provider=EMAIL
    - Generate 6-digit verification code and store in Redis (15-minute TTL)
    - Return UserResponse with userId and message
    - _Requirements: 1.1, 1.2, 1.3, 1.4_
  
  - [~] 3.2 Integrate email verification with Notification Service
    - Create NotificationClient.java REST client for notification-service
    - Call notification-service to send welcome email with verification code
    - Handle email sending failures gracefully
    - Log email delivery status
    - _Requirements: 1.5, 22.1, 22.2, 22.3_
  
  - [~] 3.3 Implement email verification endpoint
    - Create POST /verify-email endpoint accepting email and code
    - Retrieve verification code from Redis by email
    - Compare submitted code with stored code
    - Check code has not expired (15-minute window)
    - Set email_verified=true in user record
    - Delete verification code from Redis after successful verification
    - Return success or error response
    - _Requirements: 1.6, 1.7_
  
  - [~] 3.4 Implement login endpoint with JWT response
    - Create LoginRequest DTO with email and password
    - Create POST /login endpoint
    - Validate user exists by email
    - Verify password with bcrypt
    - Call Trial Service to fetch user's current plan and usage
    - Generate JWT access token and refresh token
    - Update last_login_at timestamp
    - Return LoginResponse with tokens and user/plan info
    - _Requirements: 1.8, 1.9, 1.10, 8.1, 8.2_
  
  - [~] 3.5 Implement rate limiting for login attempts
    - Create LoginRateLimiter.java using Redis INCR
    - Track login attempts per email address with 15-minute window
    - Allow maximum 5 attempts per 15 minutes
    - Return HTTP 429 when rate limit exceeded
    - Reset counter after successful login
    - _Requirements: 1.11_
  
  - [ ]* 3.6 Write unit tests for email/password authentication
    - Test successful registration flow
    - Test password validation rules (min 8 chars, complexity)
    - Test email verification success and failure cases
    - Test login with correct and incorrect credentials
    - Test rate limiting triggers after 5 failed attempts
    - Test JWT token generation and validation

- [ ] 4. Auth Service - Google OAuth 2.0 Authentication
  - [~] 4.1 Configure Google OAuth client
    - Update application.yml with Google OAuth client ID and secret
    - Configure redirect URI: /oauth2/callback/google
    - Set required scopes: email, profile
    - Add PKCE configuration for enhanced security
    - _Requirements: 2.1, 2.2, 2.11_
  
  - [~] 4.2 Implement Google OAuth authorization flow
    - Create GET /login/google endpoint to initiate OAuth
    - Generate state parameter to prevent CSRF attacks
    - Store state in Redis with 10-minute TTL
    - Redirect user to Google authorization endpoint
    - _Requirements: 2.1, 2.12_
  
  - [~] 4.3 Implement Google OAuth callback handler
    - Create GET /oauth2/callback/google endpoint
    - Validate state parameter matches stored value
    - Exchange authorization code for access token and ID token
    - Validate Google ID token signature using Google's public keys
    - Extract user claims from ID token (sub, email, name, picture)
    - _Requirements: 2.3, 2.4_
  
  - [~] 4.4 Implement Google user creation and login
    - Check if user exists by google_sub identifier
    - Create new user if first-time login with auth_provider=GOOGLE
    - Store Google profile information (email, name, avatar_url)
    - Set email_verified=true automatically for Google users
    - Call Trial Service to initialize free trial for new users
    - Generate JWT tokens with user and plan information
    - Return LoginResponse to frontend
    - _Requirements: 2.5, 2.6, 2.7, 2.8, 2.9_
  
  - [~] 4.5 Handle Google OAuth errors
    - Catch OAuth exceptions (invalid code, network errors)
    - Return HTTP 400 with user-friendly error message
    - Log detailed error for debugging
    - Suggest alternative login methods in error response
    - _Requirements: 2.10_
  
  - [ ]* 4.6 Write unit tests for Google OAuth flow
    - Test authorization URL generation with correct parameters
    - Test state parameter generation and validation
    - Test token exchange with mock Google API
    - Test ID token validation
    - Test new user creation vs existing user login

- [ ] 5. Auth Service - Mobile OTP Authentication
  - [~] 5.1 Implement OTP generation and storage
    - Create POST /login/mobile/request-otp endpoint accepting mobile number
    - Validate mobile number format (E.164: +[country][number])
    - Generate 6-digit random OTP (100000-999999)
    - Store OTP in Redis with 5-minute TTL
    - Store attempt counter in Redis
    - _Requirements: 3.1, 3.2, 3.11_
  
  - [~] 5.2 Integrate Twilio SMS for OTP delivery
    - Create TwilioClient.java using Twilio Java SDK
    - Configure Twilio credentials from environment variables
    - Implement sendSMS method calling Twilio API
    - Format SMS message: "Your MayaBhedak OTP is {code}. Valid for 5 minutes."
    - Handle Twilio errors and log message SID
    - Return HTTP 503 if SMS delivery fails
    - _Requirements: 3.3, 3.10, 23.1, 23.2, 23.5_
  
  - [~] 5.3 Implement OTP rate limiting
    - Track OTP requests per mobile number in Redis
    - Allow maximum 3 OTP requests per 5 minutes
    - Return HTTP 429 when rate limit exceeded
    - _Requirements: 3.4, 23.11_
  
  - [~] 5.4 Implement OTP verification endpoint
    - Create POST /login/mobile/verify-otp endpoint accepting mobile and OTP
    - Retrieve stored OTP from Redis
    - Validate OTP matches and has not expired
    - Increment attempt counter in Redis
    - Allow maximum 3 verification attempts before requiring new OTP
    - Delete OTP from Redis after successful verification
    - _Requirements: 3.5, 3.6, 3.12_
  
  - [~] 5.5 Implement mobile user creation and login
    - Check if user exists by mobile_number
    - Create new user if first-time login with auth_provider=MOBILE
    - Set mobile_verified=true
    - Call Trial Service to initialize free trial for new users
    - Generate JWT tokens
    - Return LoginResponse
    - _Requirements: 3.7, 3.8, 3.9_
  
  - [ ]* 5.6 Write unit tests for mobile OTP authentication
    - Test OTP generation produces 6-digit code
    - Test mobile number format validation
    - Test OTP verification success and failure
    - Test OTP expiry after 5 minutes
    - Test rate limiting for OTP requests and verifications

- [ ] 6. Auth Service - Password Reset and Token Management
  - [~] 6.1 Implement password reset request endpoint
    - Create POST /forgot-password endpoint accepting email
    - Generate cryptographically secure reset token (UUID)
    - Store token in database with 1-hour expiry
    - Associate token with user account
    - Call Notification Service to send reset email with link
    - Return success message
    - _Requirements: 5.1, 5.2, 5.3, 5.11_
  
  - [~] 6.2 Implement password reset confirmation endpoint
    - Create POST /reset-password endpoint accepting token and newPassword
    - Validate token exists and has not expired
    - Validate new password meets complexity requirements
    - Hash new password with bcrypt
    - Update user's password_hash in database
    - Invalidate reset token
    - Invalidate all existing JWT tokens for user (add to blacklist)
    - Send confirmation email
    - _Requirements: 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 5.12_
  
  - [~] 6.3 Implement token refresh endpoint
    - Create POST /refresh-token endpoint accepting refreshToken
    - Validate refresh token signature and expiry
    - Check refresh token not blacklisted
    - Generate new access token (15-minute expiry)
    - Rotate refresh token (single-use, generate new one)
    - Blacklist old refresh token in Redis
    - Return new tokens
    - _Requirements: 4.7, 4.8_
  
  - [~] 6.4 Implement logout endpoint
    - Create POST /logout endpoint accepting JWT token
    - Extract token ID (jti claim)
    - Add token ID to Redis blacklist with TTL matching token expiry
    - Return success message
    - _Requirements: 4.9, 4.10_
  
  - [~] 6.5 Implement GET /me endpoint
    - Extract user ID from JWT token
    - Fetch user from database
    - Call Trial Service to get current plan and usage
    - Return UserResponse with plan information
    - _Requirements: 8.1, 8.2, 8.3, 8.4_
  
  - [ ]* 6.6 Write unit tests for password reset and token management
    - Test password reset token generation and validation
    - Test token expiry handling
    - Test password complexity enforcement during reset
    - Test refresh token rotation
    - Test logout blacklist functionality

- [~] 7. Checkpoint - Auth Service Complete
  - Verify all auth endpoints working (email, Google, mobile)
  - Test JWT generation and validation
  - Verify Redis integration for OTP and blacklist
  - Test with Postman or integration tests
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 8. Trial & Subscription Service - Foundation
  - [~] 8.1 Create trial-service Spring Boot project
    - Initialize new Spring Boot project with dependencies: web, data-jpa, postgresql, redis, validation, lombok
    - Create project structure: controller, service, repository, model, dto packages
    - Configure application.yml with port 8083, database, and Redis settings
    - Create TrialServiceApplication.java main class
    - Add Dockerfile for containerization
    - _Requirements: 6.1, 8.1_
  
  - [~] 8.2 Create Subscription entity and repository
    - Create Subscription.java entity with fields: id, user_id, plan_type, status, start_date, expiry_date, audio_limit, image_limit, trial_requests_used, created_at, updated_at
    - Add JPA annotations and constraints
    - Create SubscriptionRepository.java
    - Add custom query: findByUserIdAndStatus(userId, ACTIVE)
    - Write unit tests
    - _Requirements: 6.1, 6.2, 6.3, 8.11_
  
  - [~] 8.3 Create UsageTracking entity and repository
    - Create UsageTracking.java entity with fields: id, user_id, detection_type, count, tracking_month, last_updated
    - Add unique constraint on (user_id, detection_type, tracking_month)
    - Create UsageTrackingRepository.java
    - Add custom query: findByUserIdAndTrackingMonth
    - Write unit tests
    - _Requirements: 7.3, 7.4, 7.9_
  
  - [~] 8.4 Implement free trial initialization
    - Create TrialService.java with initializeTrialForNewUser method
    - Create FREE_TRIAL subscription: 50 audio + 50 image detections, 14-day duration
    - Set start_date to current date, expiry_date to start + 14 days
    - Set status to ACTIVE
    - Create usage_tracking records for audio and image with count=0
    - Handle duplicate initialization (idempotent operation)
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.12_
  
  - [~] 8.5 Expose trial initialization API endpoint
    - Create POST /subscription/initialize endpoint (internal API)
    - Accept userId in request body
    - Call trial initialization service
    - Send welcome email via Notification Service
    - Return subscription details
    - Handle errors and rollback on failure
    - _Requirements: 6.8, 6.10_

- [ ] 9. Trial & Subscription Service - Quota Management
  - [~] 9.1 Implement quota check endpoint
    - Create GET /subscription/quota/check endpoint
    - Accept userId and detectionType (AUDIO/IMAGE) parameters
    - Retrieve user's active subscription
    - Check subscription status is ACTIVE and not expired
    - Retrieve current month's usage from usage_tracking
    - Compare usage against plan limits
    - Return boolean: canDetect and remaining count
    - _Requirements: 7.1, 7.2, 8.10_
  
  - [~] 9.2 Implement usage increment endpoint
    - Create POST /subscription/usage/increment endpoint
    - Accept userId and detectionType in request body
    - Use database transaction for atomic increment
    - Update or insert usage_tracking record for current month
    - Increment count by 1 atomically
    - Update last_updated timestamp
    - Cache usage in Redis for 5 minutes
    - _Requirements: 7.4, 7.9, 7.10_
  
  - [~] 9.3 Implement usage warning notifications
    - Calculate usage percentage: (used / limit) * 100
    - When usage > 80%, trigger warning notification
    - When usage = 100%, trigger quota exhausted notification
    - Call Notification Service with usage stats and upgrade CTA
    - Track warnings sent to avoid duplicates
    - _Requirements: 7.5, 7.6, 7.7_
  
  - [~] 9.4 Implement monthly usage reset
    - Create scheduled job (@Scheduled) running on 1st of each month
    - Query all usage_tracking records from previous month
    - Reset count to 0 for all records
    - Update tracking_month to current month
    - Log reset operation for audit
    - _Requirements: 7.8_
  
  - [ ]* 9.5 Write unit tests for quota management
    - Test quota check with various usage scenarios
    - Test usage increment atomicity
    - Test usage warning trigger thresholds
    - Test monthly reset logic

- [ ] 10. Trial & Subscription Service - Plan Management
  - [~] 10.1 Implement get current plan endpoint
    - Create GET /subscription/plan endpoint
    - Accept userId parameter
    - Retrieve active subscription from database
    - Calculate days remaining until expiry
    - Build PlanDetails response with limits and features
    - Return plan type, status, dates, and feature flags
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.7, 8.8_
  
  - [~] 10.2 Implement get usage statistics endpoint
    - Create GET /subscription/usage endpoint
    - Accept userId parameter
    - Retrieve current month's usage for audio and image
    - Retrieve user's plan limits
    - Calculate remaining detections and usage percentage
    - Calculate next reset date (1st of next month)
    - Return UsageStats response
    - _Requirements: 8.4, 8.5, 8.6_
  
  - [~] 10.3 Implement plan upgrade endpoint
    - Create POST /subscription/upgrade endpoint
    - Accept userId, targetPlan (PRO/ENTERPRISE), billingCycle (MONTHLY/YEARLY)
    - Validate target plan is valid
    - Calculate payment amount based on plan and cycle
    - Create Razorpay payment intent
    - Handle payment callback webhook
    - Update subscription to new plan on successful payment
    - Cancel old subscription
    - Preserve current month usage
    - Send confirmation email via Notification Service
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.10_
  
  - [~] 10.4 Handle payment failures and grace period
    - Implement payment webhook handler for failures
    - Update subscription status to PAYMENT_FAILED
    - Provide 3-day grace period before downgrading
    - Send payment failure notification with retry instructions
    - Rollback upgrade transaction on failure
    - _Requirements: 9.8, 9.9, 9.11_
  
  - [~] 10.5 Implement trial expiry notifications
    - Create scheduled job running daily at 9 AM UTC
    - Query trials expiring in 3 days
    - Query trials expiring in 1 day
    - Query trials expiring today
    - Send notifications via Notification Service with upgrade CTA
    - Mark subscription status as EXPIRED when expiry date reached
