# Requirements Document: Microservices Architecture Upgrade

## Introduction

This requirements document specifies the functional and non-functional requirements for transforming the MayaBhedak deepfake detection platform from a monolithic architecture to a microservices architecture. The system will introduce five new services (Auth Service, Trial & Subscription Service, API Security Gateway, Customer Support Service, and Notification Service) while maintaining compatibility with existing ML detection services. The goal is to provide users with a robust authentication system supporting multiple login methods, a free trial program with clear upgrade paths, comprehensive security controls, customer support capabilities, and a multi-channel notification system.

## Glossary

- **Auth_Service**: Spring Boot microservice responsible for user authentication via email/password, Google OAuth 2.0, and mobile OTP
- **Trial_Service**: Spring Boot microservice managing free trial quotas, subscription plans, usage tracking, and billing
- **API_Gateway**: Spring Cloud Gateway service providing single entry point, JWT validation, rate limiting, and request routing
- **Support_Service**: FastAPI microservice handling customer support tickets, FAQ system, and agent communication
- **Notification_Service**: FastAPI microservice sending email, SMS, and in-app notifications
- **User**: Any person interacting with the MayaBhedak platform (authenticated or anonymous)
- **Free_Trial_User**: User with active 14-day trial providing 50 audio and 50 image detections
- **Pro_User**: Subscriber paying ₹999/month for 1000 audio and 1000 image detections
- **Enterprise_User**: Subscriber with custom pricing and unlimited detections
- **JWT**: JSON Web Token used for stateless authentication with RS256 signing
- **API_Key**: Secure credential for programmatic access to the API
- **OTP**: One-Time Password, 6-digit code valid for 5 minutes
- **Detection**: Analysis of audio or image file for deepfake authenticity
- **Quota**: Monthly limit of detections based on subscription plan
- **Rate_Limit**: Maximum number of API requests per minute based on subscription plan
- **Support_Ticket**: Customer support request with unique tracking number
- **In_App_Notification**: Message displayed in the web interface notification bell icon


## Requirements

### Requirement 1: Email and Password Authentication

**User Story:** As a new user, I want to register with my email and password, so that I can create an account and access the deepfake detection platform.

#### Acceptance Criteria

1. WHEN a user submits a registration form with email, password, and full name, THE Auth_Service SHALL create a new user account with hashed password
2. THE Auth_Service SHALL enforce password complexity requiring minimum 8 characters, at least one uppercase letter, one lowercase letter, and one digit
3. WHEN a user registers, THE Auth_Service SHALL use bcrypt algorithm with 10 salt rounds to hash the password before storage
4. WHEN a user registers, THE Auth_Service SHALL generate a 6-digit email verification code and store it with 15-minute expiry
5. WHEN a user registers, THE Notification_Service SHALL send a welcome email containing the verification code
6. WHEN a user submits a valid email verification code, THE Auth_Service SHALL mark the email as verified
7. IF a user attempts to verify email with an expired or incorrect code, THEN THE Auth_Service SHALL reject the verification and return an error
8. WHEN a verified user submits valid login credentials, THE Auth_Service SHALL generate a JWT access token with 15-minute expiry
9. WHEN a verified user logs in, THE Auth_Service SHALL generate a JWT refresh token with 7-day expiry
10. WHEN a user logs in, THE Auth_Service SHALL update the last login timestamp in the database
11. THE Auth_Service SHALL enforce rate limiting of 5 login attempts per 15 minutes per email address
12. IF a user enters incorrect credentials, THEN THE Auth_Service SHALL return HTTP 401 Unauthorized without revealing whether email or password was wrong


### Requirement 2: Google OAuth 2.0 Authentication

**User Story:** As a user, I want to log in using my Google account, so that I can quickly access the platform without creating a separate password.

#### Acceptance Criteria

1. WHEN a user clicks the "Login with Google" button, THE Auth_Service SHALL redirect to Google OAuth 2.0 authorization endpoint with appropriate scopes
2. THE Auth_Service SHALL request email and profile scopes from Google OAuth
3. WHEN Google redirects back with an authorization code, THE Auth_Service SHALL exchange the code for access and ID tokens
4. THE Auth_Service SHALL validate the Google ID token signature before extracting user claims
5. WHEN a user logs in with Google for the first time, THE Auth_Service SHALL create a new user account using Google profile information
6. THE Auth_Service SHALL store the Google subject identifier (sub) as the unique identifier for OAuth users
7. THE Auth_Service SHALL set the auth_provider field to GOOGLE for OAuth-authenticated users
8. WHEN an existing Google user logs in, THE Auth_Service SHALL retrieve the user by google_sub identifier
9. WHEN a Google user logs in successfully, THE Auth_Service SHALL generate JWT tokens with user information and plan details
10. IF Google OAuth fails or user denies permissions, THEN THE Auth_Service SHALL return HTTP 400 with error message suggesting alternative login methods
11. THE Auth_Service SHALL use PKCE (Proof Key for Code Exchange) to enhance OAuth security
12. THE Auth_Service SHALL validate the state parameter to prevent CSRF attacks during OAuth flow


### Requirement 3: Mobile OTP Authentication

**User Story:** As a user, I want to log in using my mobile number and OTP, so that I can access the platform without remembering a password.

#### Acceptance Criteria

1. WHEN a user submits a mobile number in E.164 format, THE Auth_Service SHALL generate a 6-digit random OTP
2. THE Auth_Service SHALL store the OTP in Redis with 5-minute expiry
3. WHEN an OTP is generated, THE Notification_Service SHALL send the OTP via Twilio SMS to the provided mobile number
4. THE Auth_Service SHALL enforce rate limiting of 3 OTP requests per 5 minutes per mobile number
5. WHEN a user submits a mobile number and OTP for verification, THE Auth_Service SHALL validate that the OTP matches and has not expired
6. THE Auth_Service SHALL allow maximum 3 verification attempts before requiring a new OTP
7. WHEN an OTP is successfully verified for the first time, THE Auth_Service SHALL create a new user account with auth_provider set to MOBILE
8. WHEN an existing mobile user submits valid OTP, THE Auth_Service SHALL retrieve the user by mobile_number and generate JWT tokens
9. WHEN a mobile user logs in successfully, THE Auth_Service SHALL mark the mobile_verified field as true
10. IF SMS delivery fails, THEN THE Notification_Service SHALL log the Twilio error and return HTTP 503 suggesting email verification instead
11. THE Auth_Service SHALL validate mobile numbers match E.164 format (+[country code][number]) before processing
12. THE Auth_Service SHALL increment attempt counter in Redis for each failed OTP verification


### Requirement 4: JWT Token Management

**User Story:** As a system administrator, I want secure token-based authentication, so that user sessions are stateless, scalable, and protected against tampering.

#### Acceptance Criteria

1. THE Auth_Service SHALL generate JWT access tokens using RS256 algorithm with private key signing
2. THE JWT access token SHALL include claims for user ID, email, subscription plan, roles, issued-at timestamp, and expiration timestamp
3. THE Auth_Service SHALL set JWT access token expiry to 15 minutes from issuance
4. THE Auth_Service SHALL generate JWT refresh tokens with 7-day expiry for token renewal
5. THE API_Gateway SHALL validate all JWT tokens using the RS256 public key before allowing access to protected endpoints
6. WHEN a JWT access token expires, THE API_Gateway SHALL return HTTP 401 with error code TOKEN_EXPIRED
7. WHEN a user submits a valid refresh token, THE Auth_Service SHALL generate a new access token and rotate the refresh token
8. THE Auth_Service SHALL support single-use refresh tokens to prevent token replay attacks
9. WHEN a user logs out, THE Auth_Service SHALL add the JWT token ID to a blacklist in Redis with TTL matching token expiry
10. THE API_Gateway SHALL check the Redis blacklist before accepting any JWT token
11. THE Auth_Service SHALL never log or transmit JWT signing private keys
12. THE API_Gateway SHALL reject any JWT with missing required claims or invalid signature


### Requirement 5: Password Reset Flow

**User Story:** As a user who forgot my password, I want to reset it securely via email, so that I can regain access to my account.

#### Acceptance Criteria

1. WHEN a user submits a forgot-password request with their email, THE Auth_Service SHALL generate a cryptographically secure reset token
2. THE Auth_Service SHALL store the reset token in the database with 1-hour expiry and associate it with the user's account
3. WHEN a reset token is generated, THE Notification_Service SHALL send an email with a reset link containing the token
4. WHEN a user clicks the reset link and submits a new password, THE Auth_Service SHALL validate the token is not expired and matches a user
5. THE Auth_Service SHALL enforce the same password complexity rules during reset as during registration
6. WHEN a valid reset token and new password are submitted, THE Auth_Service SHALL hash the new password with bcrypt and update the database
7. THE Auth_Service SHALL invalidate the reset token immediately after successful password reset
8. THE Auth_Service SHALL send a confirmation email after password reset to notify the user of the change
9. IF a user submits an expired or invalid reset token, THEN THE Auth_Service SHALL return HTTP 400 with error message
10. THE Auth_Service SHALL allow only one active reset token per user at a time
11. THE Auth_Service SHALL rate limit password reset requests to 3 per hour per email address
12. THE Auth_Service SHALL invalidate all existing JWT tokens for the user after password reset for security


### Requirement 6: Free Trial Initialization

**User Story:** As a new user, I want to automatically receive a 14-day free trial with detection credits, so that I can evaluate the platform before purchasing.

#### Acceptance Criteria

1. WHEN a new user completes registration through any authentication method, THE Trial_Service SHALL automatically initialize a free trial subscription
2. THE Trial_Service SHALL set the trial plan to FREE_TRIAL with 50 audio detection credits and 50 image detection credits
3. THE Trial_Service SHALL set the trial start date to the user's registration date
4. THE Trial_Service SHALL calculate the trial expiry date as 14 days from the start date
5. THE Trial_Service SHALL set the subscription status to ACTIVE upon initialization
6. THE Trial_Service SHALL initialize usage counters to zero for both audio and image detections
7. THE Trial_Service SHALL create a usage_tracking record for the current month with detection counts set to zero
8. WHEN trial initialization completes, THE Notification_Service SHALL send a welcome email explaining trial benefits and limits
9. THE Trial_Service SHALL ensure only one active subscription exists per user at any time
10. IF trial initialization fails, THEN THE Auth_Service SHALL rollback user creation to maintain data consistency
11. THE Trial_Service SHALL store all trial parameters (limits, duration) in the database for auditability
12. THE Trial_Service SHALL record the trial initialization timestamp for reporting and analytics


### Requirement 7: Usage Quota Enforcement

**User Story:** As a platform operator, I want to enforce detection limits based on subscription plans, so that users cannot exceed their allocated quotas and system resources are protected.

#### Acceptance Criteria

1. WHEN a user initiates a detection request, THE Trial_Service SHALL check the user's current usage against their plan's monthly limit
2. THE Trial_Service SHALL reject detection requests with HTTP 403 QUOTA_EXCEEDED when the user has reached their monthly limit
3. THE Trial_Service SHALL track audio detections and image detections separately in the usage_tracking table
4. WHEN a detection is successfully completed, THE Trial_Service SHALL atomically increment the appropriate usage counter
5. THE Trial_Service SHALL calculate usage percentage as (detections_used / detections_limit) * 100
6. WHEN usage percentage exceeds 80%, THE Trial_Service SHALL trigger a warning notification to the user
7. WHEN usage percentage reaches 100%, THE Trial_Service SHALL trigger a quota exhausted notification with upgrade call-to-action
8. THE Trial_Service SHALL reset monthly usage counters to zero on the first day of each new month
9. THE Trial_Service SHALL use database transactions to ensure usage increments are never lost or double-counted
10. THE Trial_Service SHALL cache current usage in Redis for 5 minutes to reduce database load during high-traffic periods
11. WHEN a user upgrades their plan, THE Trial_Service SHALL immediately apply the new quota limits without resetting current usage
12. THE Trial_Service SHALL log all quota enforcement decisions for auditing and customer support inquiries


### Requirement 8: Subscription Plan Management

**User Story:** As a user, I want to view my current subscription plan details and usage statistics, so that I can make informed decisions about upgrading.

#### Acceptance Criteria

1. WHEN a user requests their current plan, THE Trial_Service SHALL return plan type, status, start date, expiry date, and feature limits
2. THE Trial_Service SHALL provide separate limits for audio detections, image detections, and API calls per minute
3. THE Trial_Service SHALL indicate whether the user has access to bulk upload, API keys, and priority support based on their plan
4. WHEN a user requests usage statistics, THE Trial_Service SHALL return current month's usage for audio and image detections
5. THE Trial_Service SHALL calculate and return remaining detections for the current month (limit - used)
6. THE Trial_Service SHALL calculate and return the date when usage counters will reset (first day of next month)
7. THE Trial_Service SHALL support three plan types: FREE_TRIAL (50 detections, 14 days), PRO (1000 detections/month, ₹999), and ENTERPRISE (unlimited, custom pricing)
8. WHEN displaying plan information, THE Trial_Service SHALL clearly indicate days remaining until trial expiry for FREE_TRIAL users
9. THE Trial_Service SHALL mark subscriptions as EXPIRED when the current date exceeds the expiry date
10. WHEN a subscription expires, THE Trial_Service SHALL prevent new detections and return HTTP 403 with upgrade instructions
11. THE Trial_Service SHALL store billing cycle information (MONTHLY or YEARLY) for paid subscriptions
12. THE Trial_Service SHALL calculate next billing date based on subscription start date and billing cycle


### Requirement 9: Plan Upgrade and Payment Processing

**User Story:** As a free trial user, I want to upgrade to a paid plan, so that I can continue using the platform with higher limits after my trial expires.

#### Acceptance Criteria

1. WHEN a user initiates a plan upgrade, THE Trial_Service SHALL validate the target plan is valid (PRO or ENTERPRISE)
2. WHEN a user selects a paid plan, THE Trial_Service SHALL create a payment intent via Razorpay or Stripe API
3. THE Trial_Service SHALL calculate the payment amount based on the selected plan and billing cycle (monthly ₹999, yearly with discount)
4. WHEN payment is successfully processed, THE Trial_Service SHALL update the user's subscription to the new plan with ACTIVE status
5. WHEN upgrading from FREE_TRIAL to PRO, THE Trial_Service SHALL cancel the trial subscription and create a new PRO subscription starting immediately
6. THE Trial_Service SHALL set the new subscription's expiry date to 30 days from activation for monthly billing
7. THE Trial_Service SHALL preserve the user's current month usage when upgrading plans
8. WHEN a payment fails, THE Trial_Service SHALL rollback the upgrade transaction and keep the user on their current plan
9. WHEN a payment fails, THE Notification_Service SHALL send an email with retry instructions and alternative payment methods
10. THE Trial_Service SHALL store payment transaction IDs and timestamps for billing records and refund processing
11. THE Trial_Service SHALL provide a 3-day grace period for payment failures before downgrading expired paid subscriptions
12. WHEN a subscription is successfully upgraded, THE Notification_Service SHALL send a confirmation email with invoice details and next billing date


### Requirement 10: Trial Expiry Notifications

**User Story:** As a free trial user, I want to receive notifications before my trial expires, so that I have time to upgrade and avoid service interruption.

#### Acceptance Criteria

1. THE Trial_Service SHALL run a scheduled job daily to check for trials expiring within the next 3 days
2. WHEN a trial will expire in 3 days, THE Notification_Service SHALL send an email and in-app notification with upgrade call-to-action
3. WHEN a trial will expire in 1 day, THE Notification_Service SHALL send a second reminder via email and in-app notification
4. WHEN a trial expires (expiry date reached), THE Notification_Service SHALL send a final email explaining that the trial has ended
5. THE expiry notification emails SHALL include direct links to the plan upgrade page with the user's current usage statistics
6. THE Trial_Service SHALL mark trials as EXPIRED when the current date exceeds the expiry date
7. THE Trial_Service SHALL prevent duplicate notifications by tracking which expiry warnings have been sent in the database
8. WHEN a user upgrades before expiry, THE Trial_Service SHALL cancel pending expiry notifications
9. THE Notification_Service SHALL create in-app notifications for all trial expiry warnings visible in the notification bell icon
10. THE expiry emails SHALL include pricing information for PRO and ENTERPRISE plans with feature comparisons
11. THE Trial_Service SHALL schedule the expiry check job to run at 9:00 AM UTC daily
12. THE Trial_Service SHALL log all expiry notification attempts for auditing and debugging


### Requirement 11: API Gateway Request Routing

**User Story:** As a system architect, I want all API requests to flow through a single gateway, so that security policies are consistently enforced and services can be independently scaled.

#### Acceptance Criteria

1. THE API_Gateway SHALL listen on port 8080 and serve as the single entry point for all API requests
2. THE API_Gateway SHALL route requests with path /auth/** to the Auth_Service on port 8082
3. THE API_Gateway SHALL route requests with path /subscription/** to the Trial_Service on port 8083
4. THE API_Gateway SHALL route requests with path /detect/** to the Legacy Backend Service on port 8081
5. THE API_Gateway SHALL route requests with path /support/** to the Support_Service on port 8084
6. THE API_Gateway SHALL route health check requests to all services and aggregate the status
7. THE API_Gateway SHALL add the X-Forwarded-For header to all routed requests to preserve client IP addresses
8. THE API_Gateway SHALL add the X-Request-ID header with a unique UUID to all routed requests for distributed tracing
9. THE API_Gateway SHALL configure CORS to allow requests from the frontend domain with credentials
10. THE API_Gateway SHALL set appropriate timeouts for each route (30 seconds for ML services, 10 seconds for others)
11. THE API_Gateway SHALL retry failed requests to backend services using exponential backoff (max 3 attempts)
12. THE API_Gateway SHALL log all routed requests with timestamp, method, path, status code, and response time for monitoring


### Requirement 12: JWT Validation at Gateway

**User Story:** As a security administrator, I want all protected API requests to be authenticated at the gateway, so that unauthorized access is blocked before reaching backend services.

#### Acceptance Criteria

1. THE API_Gateway SHALL extract JWT tokens from the Authorization header in the format "Bearer {token}"
2. THE API_Gateway SHALL validate JWT signatures using the RS256 public key before allowing access to protected endpoints
3. THE API_Gateway SHALL check the JWT expiration timestamp and reject expired tokens with HTTP 401 TOKEN_EXPIRED
4. THE API_Gateway SHALL verify all required JWT claims (userId, email, plan, roles, iat, exp) are present
5. THE API_Gateway SHALL check the Redis blacklist for the JWT token ID before accepting the token
6. IF a JWT is blacklisted, THEN THE API_Gateway SHALL reject the request with HTTP 401 TOKEN_REVOKED
7. THE API_Gateway SHALL allow unauthenticated access to public endpoints (/auth/register, /auth/login, /auth/login/google, /support/faq)
8. THE API_Gateway SHALL extract user information from valid JWT claims and add it to the X-User-Id and X-User-Plan headers
9. THE API_Gateway SHALL forward the original JWT token to backend services for additional authorization checks if needed
10. IF JWT validation fails for any reason, THEN THE API_Gateway SHALL return HTTP 401 with a descriptive error message
11. THE API_Gateway SHALL cache public key in memory to avoid repeated file reads during validation
12. THE API_Gateway SHALL support JWT validation with response time under 5 milliseconds for optimal performance


### Requirement 13: Rate Limiting by Plan

**User Story:** As a platform operator, I want to enforce rate limits based on subscription plans, so that free users don't overwhelm the system and paid users receive priority access.

#### Acceptance Criteria

1. THE API_Gateway SHALL enforce rate limits of 10 requests per minute for FREE_TRIAL users
2. THE API_Gateway SHALL enforce rate limits of 100 requests per minute for PRO users
3. THE API_Gateway SHALL enforce rate limits of 1000 requests per minute for ENTERPRISE users
4. THE API_Gateway SHALL use Redis to track request counts per user per 60-second sliding window
5. WHEN a user exceeds their rate limit, THE API_Gateway SHALL return HTTP 429 Too Many Requests
6. THE API_Gateway SHALL include X-RateLimit-Limit, X-RateLimit-Remaining, and X-RateLimit-Reset headers in all responses
7. THE X-RateLimit-Reset header SHALL contain the Unix timestamp when the current rate limit window resets
8. THE API_Gateway SHALL reset rate limit counters every 60 seconds from the first request in the window
9. THE API_Gateway SHALL implement a token bucket algorithm allowing burst capacity up to 2x the per-minute limit
10. THE API_Gateway SHALL exempt health check endpoints from rate limiting
11. THE rate limit error response SHALL include a message suggesting plan upgrades for users who frequently hit limits
12. THE API_Gateway SHALL log rate limit violations with user ID and plan type for analytics and abuse detection


### Requirement 14: API Security Headers

**User Story:** As a security administrator, I want the gateway to add security headers to all responses, so that the application is protected against common web vulnerabilities.

#### Acceptance Criteria

1. THE API_Gateway SHALL add the Strict-Transport-Security header with value "max-age=31536000; includeSubDomains" to all responses
2. THE API_Gateway SHALL add the Content-Security-Policy header with value "default-src 'self'" to all responses
3. THE API_Gateway SHALL add the X-Frame-Options header with value "DENY" to prevent clickjacking attacks
4. THE API_Gateway SHALL add the X-Content-Type-Options header with value "nosniff" to prevent MIME type sniffing
5. THE API_Gateway SHALL add the X-XSS-Protection header with value "1; mode=block" for legacy browser protection
6. THE API_Gateway SHALL add the Referrer-Policy header with value "strict-origin-when-cross-origin" to control referrer information
7. THE API_Gateway SHALL remove server identification headers (X-Powered-By, Server) to avoid information disclosure
8. THE API_Gateway SHALL add the X-Request-ID header to all responses for request tracing and debugging
9. THE API_Gateway SHALL configure CORS headers (Access-Control-Allow-Origin, Access-Control-Allow-Credentials, Access-Control-Allow-Methods) for frontend requests
10. THE API_Gateway SHALL set Access-Control-Max-Age to 3600 seconds to cache preflight responses
11. THE API_Gateway SHALL validate the Origin header matches the whitelist before allowing CORS requests
12. THE API_Gateway SHALL add security headers consistently to both successful and error responses


### Requirement 15: API Key Generation and Management

**User Story:** As a PRO or ENTERPRISE user, I want to generate API keys for programmatic access, so that I can integrate the deepfake detection service into my applications.

#### Acceptance Criteria

1. WHEN a PRO or ENTERPRISE user requests an API key, THE Auth_Service SHALL generate a cryptographically random 32-byte key
2. THE Auth_Service SHALL format API keys with prefix "mb_live_" for production keys and "mb_test_" for test keys
3. THE Auth_Service SHALL hash API keys using SHA-256 before storing in the database
4. THE Auth_Service SHALL store only the first 8 characters of the key as prefix for display purposes
5. THE Auth_Service SHALL return the full API key only once at generation time with a warning to store it securely
6. THE Auth_Service SHALL allow PRO users to create maximum 5 API keys
7. THE Auth_Service SHALL allow ENTERPRISE users to create unlimited API keys
8. WHEN a user requests API key list, THE Auth_Service SHALL return masked keys showing only the prefix (e.g., "mb_live_abc12345...")
9. THE Auth_Service SHALL support naming API keys for organizational purposes (e.g., "Production Server", "Test Environment")
10. THE Auth_Service SHALL allow users to revoke API keys by marking is_active as false
11. THE Auth_Service SHALL support optional expiry dates for API keys that automatically revoke them after the date
12. THE Auth_Service SHALL update the last_used_at timestamp whenever an API key is successfully validated


### Requirement 16: API Key Validation

**User Story:** As a developer, I want to authenticate my API requests using an API key, so that my application can access the detection service without user login.

#### Acceptance Criteria

1. THE API_Gateway SHALL accept API keys in the X-API-Key request header
2. WHEN an API key is provided, THE API_Gateway SHALL hash it using SHA-256 and look up the hash in the database
3. THE API_Gateway SHALL reject requests with invalid or revoked API keys with HTTP 401 INVALID_API_KEY
4. THE API_Gateway SHALL reject requests with expired API keys with HTTP 401 API_KEY_EXPIRED
5. WHEN an API key is validated, THE API_Gateway SHALL extract the associated user's subscription plan for rate limiting
6. THE API_Gateway SHALL apply the same rate limits to API key requests as to JWT requests based on the user's plan
7. THE API_Gateway SHALL cache validated API keys in Redis for 10 minutes to reduce database lookups
8. THE API_Gateway SHALL update the last_used_at timestamp asynchronously after successful API key validation
9. THE API_Gateway SHALL allow both JWT and API key authentication, with JWT taking precedence if both are provided
10. THE API_Gateway SHALL add the X-User-Id header to requests authenticated via API key for backend services
11. THE API_Gateway SHALL enforce the same quota limits for API key requests as for JWT requests
12. THE API_Gateway SHALL log all API key usage for auditing and billing verification


### Requirement 17: API Key Rotation

**User Story:** As a security-conscious user, I want to rotate my API keys periodically, so that I can minimize the impact of potential key compromise.

#### Acceptance Criteria

1. WHEN a user rotates an API key, THE Auth_Service SHALL generate a new key and mark the old key for deactivation
2. THE Auth_Service SHALL provide a 24-hour grace period during which both old and new keys remain valid
3. WHEN the grace period expires, THE Auth_Service SHALL automatically revoke the old API key
4. THE Auth_Service SHALL notify the user via email when a new API key is generated and when the old key will expire
5. THE Auth_Service SHALL display both active and grace-period keys in the user's API key list with clear expiry information
6. THE Auth_Service SHALL allow users to immediately revoke the old key without waiting for the grace period
7. THE Auth_Service SHALL prevent creating new keys if the user has reached their plan's key limit including grace-period keys
8. THE Auth_Service SHALL log all key rotation events with timestamps for security auditing
9. WHEN a grace-period key is used, THE API_Gateway SHALL add a warning header X-API-Key-Deprecation with the expiry date
10. THE Auth_Service SHALL support forced rotation of all keys for a user in case of security incident
11. THE Auth_Service SHALL track rotation history including creation date, rotation date, and revocation date
12. THE Auth_Service SHALL send a final reminder 2 hours before the old key is automatically revoked


### Requirement 18: Support Ticket Creation

**User Story:** As a user, I want to create support tickets for my issues, so that I can get help from the customer support team.

#### Acceptance Criteria

1. WHEN a user submits a support ticket, THE Support_Service SHALL create a ticket with a unique ticket number in format "TKT-YYYY-NNNNNN"
2. THE Support_Service SHALL require subject (max 200 characters) and description (max 2000 characters) fields
3. THE Support_Service SHALL support ticket categories: TECHNICAL, BILLING, FEATURE_REQUEST, BUG_REPORT, and OTHER
4. THE Support_Service SHALL auto-assign priority based on keywords in subject and description (urgent, broken, critical → HIGH)
5. THE Support_Service SHALL set default priority to MEDIUM if no urgent keywords are detected
6. THE Support_Service SHALL set the initial ticket status to OPEN upon creation
7. WHEN a ticket is created, THE Support_Service SHALL store the first message as the ticket description
8. WHEN a ticket is created, THE Notification_Service SHALL send a confirmation email to the user with the ticket number
9. THE Support_Service SHALL support optional file attachments (max 10MB per file, max 5 files per ticket)
10. THE Support_Service SHALL upload attachments to MinIO and store URLs in the ticket_messages.attachments JSONB field
11. THE Support_Service SHALL record the ticket creation timestamp and set updated_at to the same value
12. THE Support_Service SHALL allow tickets to be created by both authenticated users and anonymous users (with email collection)


### Requirement 19: Support Ticket Management

**User Story:** As a user, I want to view and manage my support tickets, so that I can track the status of my issues and communicate with support agents.

#### Acceptance Criteria

1. WHEN a user requests their ticket list, THE Support_Service SHALL return all tickets created by that user sorted by created_at descending
2. THE Support_Service SHALL support filtering tickets by status (OPEN, IN_PROGRESS, WAITING_USER, RESOLVED, CLOSED)
3. THE Support_Service SHALL return ticket summaries including ticket number, subject, status, priority, creation date, and unread message count
4. WHEN a user requests ticket details, THE Support_Service SHALL return the complete ticket information with all messages in chronological order
5. THE Support_Service SHALL include sender type (USER, AGENT, SYSTEM) and sender name for each message
6. THE Support_Service SHALL exclude internal messages (is_internal=true) from user-facing ticket details
7. THE Support_Service SHALL mark messages as read when the user views ticket details
8. THE Support_Service SHALL calculate unread_count as messages created after the user's last_read_at timestamp
9. THE Support_Service SHALL update the ticket's updated_at timestamp whenever a new message is added
10. THE Support_Service SHALL support status transitions: OPEN → IN_PROGRESS → WAITING_USER → RESOLVED → CLOSED
11. THE Support_Service SHALL allow users to close RESOLVED tickets to indicate their issue is fully addressed
12. THE Support_Service SHALL automatically close tickets that remain in RESOLVED status for 7 days without user response


### Requirement 20: Support Ticket Replies

**User Story:** As a user, I want to reply to support tickets, so that I can provide additional information or respond to agent questions.

#### Acceptance Criteria

1. WHEN a user adds a reply to a ticket, THE Support_Service SHALL create a new message record with sender_type set to USER
2. THE Support_Service SHALL require message text (min 1 character, max 2000 characters)
3. THE Support_Service SHALL support attaching files to replies with the same limits as ticket creation (10MB, 5 files)
4. WHEN a user adds a reply, THE Support_Service SHALL update the ticket's updated_at timestamp to the current time
5. WHEN a user adds a reply, THE Support_Service SHALL change ticket status from WAITING_USER to OPEN if applicable
6. WHEN a user reply is added, THE Notification_Service SHALL send an email to assigned support agents
7. THE Support_Service SHALL validate the user has permission to reply to the ticket (must be ticket creator)
8. THE Support_Service SHALL reject replies to CLOSED tickets with HTTP 400 error
9. THE Support_Service SHALL store the user's full name as sender_name in the message record
10. THE Support_Service SHALL upload any reply attachments to MinIO before saving the message
11. THE Support_Service SHALL create a system message when ticket status changes (e.g., "Ticket marked as resolved")
12. THE Support_Service SHALL support editing messages within 5 minutes of posting for typo corrections


### Requirement 21: FAQ System

**User Story:** As a user, I want to browse frequently asked questions, so that I can find answers to common issues without creating a support ticket.

#### Acceptance Criteria

1. THE Support_Service SHALL provide an endpoint to retrieve all FAQ items organized by category
2. THE Support_Service SHALL support FAQ categories matching ticket categories (TECHNICAL, BILLING, FEATURE_REQUEST, GENERAL)
3. THE Support_Service SHALL store 10 pre-populated FAQs covering common questions about detection, trials, plans, API keys, and account management
4. WHEN a user requests FAQs, THE Support_Service SHALL return questions, answers, categories, and helpful_count for each item
5. THE Support_Service SHALL sort FAQs by display order field to allow prioritization of most important questions
6. THE Support_Service SHALL support searching FAQs by keyword matching question or answer text
7. THE FAQ search SHALL be case-insensitive and support partial word matching
8. THE Support_Service SHALL allow users to mark FAQs as helpful by incrementing the helpful_count
9. THE Support_Service SHALL rate-limit helpful votes to 1 per user per FAQ item to prevent spam
10. THE Support_Service SHALL provide FAQ URLs that can be shared directly to specific questions
11. THE Support_Service SHALL display a "Contact Support" call-to-action at the bottom of each FAQ answer
12. THE Support_Service SHALL track FAQ view counts for analytics to identify which topics need better documentation


### Requirement 22: Email Notifications

**User Story:** As a user, I want to receive email notifications for important events, so that I stay informed about my account and support tickets.

#### Acceptance Criteria

1. THE Notification_Service SHALL send emails via SendGrid using pre-defined HTML templates
2. THE Notification_Service SHALL support email templates for: welcome, OTP verification, trial expiry, ticket updates, password reset, plan upgrade, payment failed, and weekly digest
3. THE Notification_Service SHALL render email templates using Jinja2 with dynamic data provided by calling services
4. WHEN sending an email, THE Notification_Service SHALL validate the recipient email address format before calling SendGrid
5. THE Notification_Service SHALL set the from address to "noreply@mayabhedak.com" and from name to "MayaBhedak"
6. THE Notification_Service SHALL support email priority levels: HIGH (trial expiry, payment failed), NORMAL (ticket updates), LOW (weekly digest)
7. WHEN an email send fails, THE Notification_Service SHALL retry using exponential backoff (1s, 2s, 4s, 8s, 16s)
8. THE Notification_Service SHALL log email delivery status including SendGrid message ID and any error codes
9. THE Notification_Service SHALL respect user notification preferences and skip emails if email_enabled is false
10. THE Notification_Service SHALL include unsubscribe links in marketing and digest emails per CAN-SPAM compliance
11. THE Notification_Service SHALL track email open rates and click rates using SendGrid webhook events
12. THE Notification_Service SHALL support sending emails to multiple recipients (BCC) for admin notifications


### Requirement 23: SMS Notifications

**User Story:** As a user, I want to receive SMS notifications for critical events like OTP codes, so that I can quickly verify my identity and respond to urgent alerts.

#### Acceptance Criteria

1. THE Notification_Service SHALL send SMS messages via Twilio using the configured Twilio phone number
2. THE Notification_Service SHALL validate mobile numbers are in E.164 format (+[country code][number]) before sending
3. THE Notification_Service SHALL support SMS templates for: OTP codes, trial expiry warnings, and urgent security alerts
4. WHEN sending an SMS, THE Notification_Service SHALL keep message length under 160 characters for single-segment delivery
5. THE Notification_Service SHALL log Twilio message SID and delivery status for all SMS sends
6. IF SMS delivery fails, THEN THE Notification_Service SHALL log the Twilio error code and description
7. THE Notification_Service SHALL retry failed SMS sends up to 3 times with exponential backoff
8. THE Notification_Service SHALL respect user notification preferences and skip SMS if sms_enabled is false
9. THE Notification_Service SHALL track SMS delivery costs from Twilio for billing and budget monitoring
10. THE Notification_Service SHALL support international SMS delivery with appropriate cost tracking per country
11. THE Notification_Service SHALL rate-limit SMS sends to 3 per user per 5 minutes to prevent abuse
12. THE Notification_Service SHALL provide opt-out instructions in SMS messages per telecommunications regulations


### Requirement 24: In-App Notifications

**User Story:** As a user, I want to see notifications within the application, so that I can stay updated on important events without checking my email.

#### Acceptance Criteria

1. WHEN other services trigger notifications, THE Notification_Service SHALL create records in the notifications table
2. THE Notification_Service SHALL support notification types: INFO (general updates), WARNING (quota warnings), ERROR (payment failures), SUCCESS (plan upgrades)
3. WHEN a user requests notifications, THE Notification_Service SHALL return notifications sorted by created_at descending
4. THE Notification_Service SHALL support filtering notifications by is_read status (unread_only=true)
5. WHEN a user requests unread count, THE Notification_Service SHALL return count of notifications where is_read=false
6. THE Notification_Service SHALL limit notification queries to 50 most recent items for performance
7. WHEN a user marks a notification as read, THE Notification_Service SHALL set is_read=true and record read_at timestamp
8. THE Notification_Service SHALL support marking all notifications as read in a single request
9. THE Notification_Service SHALL include optional action_url for notifications that link to specific pages (e.g., upgrade page)
10. THE Notification_Service SHALL store additional context in the metadata JSONB field (e.g., ticket_id, usage_percentage)
11. THE Notification_Service SHALL automatically delete notifications older than 90 days to manage database size
12. THE Notification_Service SHALL publish real-time notifications via Redis pub/sub for WebSocket delivery to connected clients


### Requirement 25: Notification Preferences

**User Story:** As a user, I want to control which notifications I receive, so that I'm only alerted about events that matter to me.

#### Acceptance Criteria

1. WHEN a user is created, THE Notification_Service SHALL initialize default notification preferences with email_enabled=true, sms_enabled=true, in_app_enabled=true
2. WHEN a user requests their notification preferences, THE Notification_Service SHALL return settings for email, SMS, in-app, marketing emails, and digest frequency
3. WHEN a user updates preferences, THE Notification_Service SHALL validate the new settings and save them to the notification_preferences table
4. THE Notification_Service SHALL support digest frequency options: DAILY, WEEKLY, and NEVER
5. WHEN a notification is triggered, THE Notification_Service SHALL check user preferences before sending via email or SMS
6. THE Notification_Service SHALL always send critical notifications (security alerts, payment failures) regardless of preferences
7. THE Notification_Service SHALL skip marketing and digest emails if marketing_emails=false
8. THE Notification_Service SHALL support granular preferences for notification types (trial expiry, ticket updates, usage warnings) in future enhancements
9. THE Notification_Service SHALL log when notifications are skipped due to user preferences
10. THE Notification_Service SHALL provide a preference summary showing estimated notification frequency based on current settings
11. THE Notification_Service SHALL send a confirmation email when notification preferences are changed
12. THE Notification_Service SHALL support global unsubscribe from all non-critical emails via unsubscribe link


### Requirement 26: Weekly Usage Digest

**User Story:** As a user, I want to receive a weekly summary of my usage, so that I can track my detection activity and plan usage.

#### Acceptance Criteria

1. THE Notification_Service SHALL run a scheduled job every Sunday at 9:00 AM UTC to generate weekly digests
2. THE Notification_Service SHALL query usage statistics for the past 7 days from the Trial_Service
3. THE weekly digest email SHALL include total audio detections, total image detections, remaining quota, and days until reset
4. THE weekly digest SHALL include a comparison to the previous week showing usage trends (increased/decreased)
5. THE weekly digest SHALL include personalized tips based on usage patterns (e.g., "You're using 80% of your quota")
6. THE weekly digest SHALL include feature highlights and platform updates relevant to the user's plan
7. THE Notification_Service SHALL skip sending digests to users with digest_frequency=NEVER
8. THE Notification_Service SHALL send daily digests (Monday-Friday at 9 AM UTC) to users with digest_frequency=DAILY
9. THE weekly digest email SHALL include a clear call-to-action to upgrade for users approaching quota limits
10. THE Notification_Service SHALL track digest email open rates to measure engagement
11. THE Notification_Service SHALL include an unsubscribe link allowing users to opt out of future digests
12. THE Notification_Service SHALL batch digest emails in groups of 100 to avoid rate limits from SendGrid


### Requirement 27: Detection Request Flow

**User Story:** As an authenticated user, I want to submit audio or image files for deepfake detection, so that I can verify the authenticity of media content.

#### Acceptance Criteria

1. WHEN a user submits a detection request with a valid JWT, THE API_Gateway SHALL validate the JWT and check rate limits
2. THE API_Gateway SHALL forward the validated request to the Trial_Service to check quota availability
3. THE Trial_Service SHALL verify the user has remaining detections for the current month based on their subscription plan
4. IF quota is available, THEN THE API_Gateway SHALL route the request to the Legacy Backend Service on port 8081
5. THE Legacy Backend Service SHALL forward audio files to the Audio ML Service on port 5000
6. THE Legacy Backend Service SHALL forward image files to the Image ML Service on port 5001
7. WHEN the ML service returns a prediction, THE Legacy Backend Service SHALL store the result in the audio_analyses or image_analyses table
8. THE Legacy Backend Service SHALL call the Trial_Service to atomically increment the usage counter for the appropriate detection type
9. THE Legacy Backend Service SHALL return the detection result to the user including prediction, confidence score, and analysis timestamp
10. IF quota is exhausted, THEN THE Trial_Service SHALL return HTTP 403 QUOTA_EXCEEDED with upgrade instructions
11. THE API_Gateway SHALL enforce request timeout of 30 seconds for detection requests due to ML inference time
12. THE Legacy Backend Service SHALL sign requests to ML services using HMAC-SHA256 to prevent unauthorized access


### Requirement 28: Detection History

**User Story:** As a user, I want to view my past detection results, so that I can review previous analyses and track patterns.

#### Acceptance Criteria

1. WHEN a user requests detection history, THE Legacy Backend Service SHALL return all analyses performed by that user sorted by analyzed_at descending
2. THE detection history SHALL include filename, detection type (AUDIO/IMAGE), prediction (REAL/FAKE), confidence score, and timestamp
3. THE Legacy Backend Service SHALL support pagination with configurable page size (default 20 items per page)
4. THE Legacy Backend Service SHALL support filtering history by detection type (audio only, image only, or both)
5. THE Legacy Backend Service SHALL support filtering history by prediction result (real only, fake only, or both)
6. THE Legacy Backend Service SHALL support date range filtering (from_date and to_date query parameters)
7. THE Legacy Backend Service SHALL include total count of matching records in the response for pagination UI
8. THE Legacy Backend Service SHALL allow users to delete individual history items
9. THE Legacy Backend Service SHALL provide a bulk delete endpoint to clear all history older than a specified date
10. THE Legacy Backend Service SHALL include file URLs for detections where files were stored in MinIO
11. THE Legacy Backend Service SHALL respect user privacy by ensuring users can only access their own detection history
12. THE Legacy Backend Service SHALL cache recent history (last 24 hours) in Redis for faster retrieval


### Requirement 29: Docker Compose Infrastructure

**User Story:** As a developer, I want to run all services locally using Docker Compose, so that I can develop and test the microservices architecture without complex setup.

#### Acceptance Criteria

1. THE docker-compose.yml file SHALL define services for PostgreSQL, Redis, MinIO, API Gateway, Auth Service, Trial Service, Support Service, Notification Service, Legacy Backend, Audio ML, Image ML, and Frontend
2. THE PostgreSQL service SHALL expose port 5432 and use persistent volume for data storage
3. THE Redis service SHALL expose port 6379 and use persistent volume for data storage
4. THE MinIO service SHALL expose port 9000 for S3 API and port 9001 for web console
5. THE API_Gateway SHALL depend on Auth_Service and Trial_Service to ensure proper startup order
6. THE Auth_Service SHALL depend on PostgreSQL and Redis to ensure database is ready before startup
7. THE docker-compose.yml SHALL use environment variables from .env file for all configuration including database credentials and API keys
8. THE Docker network SHALL allow inter-service communication using service names as hostnames (e.g., auth-service:8082)
9. THE docker-compose.yml SHALL include health check commands for all services to verify they started correctly
10. THE frontend service SHALL be configured to proxy API requests to the API_Gateway on port 8080
11. THE docker-compose.yml SHALL support docker-compose up -d to start all services in detached mode
12. THE docker-compose.yml SHALL support docker-compose down -v to stop services and remove volumes for clean reset


### Requirement 30: Database Migrations

**User Story:** As a developer, I want automated database migrations, so that schema changes are applied consistently across all environments.

#### Acceptance Criteria

1. THE Auth_Service SHALL use Flyway for database migrations with migration scripts in src/main/resources/db/migration
2. THE Auth_Service migrations SHALL create users table with all required columns and constraints
3. THE Trial_Service migrations SHALL create subscriptions, usage_tracking, and api_keys tables
4. THE Support_Service SHALL use Alembic for database migrations with migration scripts in alembic/versions
5. THE Support_Service migrations SHALL create tickets, ticket_messages, and faq tables
6. THE Notification_Service migrations SHALL create notifications and notification_preferences tables
7. ALL migration scripts SHALL be named with version prefix (V1__initial_schema.sql, V2__add_otp_columns.sql)
8. THE migration tools SHALL automatically run pending migrations on service startup
9. THE migration tools SHALL maintain a schema_version table tracking which migrations have been applied
10. THE migration scripts SHALL use IF NOT EXISTS clauses to support idempotent execution
11. THE migration scripts SHALL include both UP migrations (apply changes) and DOWN migrations (rollback changes)
12. THE migration tools SHALL fail service startup if any migration fails to prevent inconsistent state


### Requirement 31: Service Health Checks

**User Story:** As a DevOps engineer, I want health check endpoints for all services, so that I can monitor system status and detect failures.

#### Acceptance Criteria

1. ALL microservices SHALL expose a GET /health endpoint returning HTTP 200 when healthy
2. THE health check response SHALL include service name, version, status (UP/DOWN), and timestamp
3. THE health check SHALL verify database connectivity by executing a simple query
4. THE health check SHALL verify Redis connectivity by executing a PING command
5. THE health check for services SHALL verify external API connectivity (Google OAuth, Twilio, SendGrid, Razorpay)
6. THE health check SHALL return HTTP 503 Service Unavailable when critical dependencies are unreachable
7. THE health check response SHALL include dependency status for database, cache, and external services
8. THE API_Gateway SHALL provide GET /health/aggregate endpoint combining status from all services
9. THE aggregate health check SHALL return HTTP 200 only when all services are healthy
10. THE health checks SHALL complete within 2 seconds to enable rapid monitoring
11. THE health checks SHALL be excluded from authentication requirements and rate limiting
12. THE health checks SHALL be suitable for use by Docker health check commands and Kubernetes liveness probes


### Requirement 32: Frontend Integration Updates

**User Story:** As a frontend developer, I want to update the React application to use the new microservices architecture, so that users can access all authentication methods and new features.

#### Acceptance Criteria

1. THE frontend SHALL update the login page to display three authentication options: Email/Password, Google OAuth, and Mobile OTP
2. THE frontend SHALL implement Google OAuth flow using the authorization URL from the Auth_Service
3. THE frontend SHALL store JWT tokens in HTTP-only cookies or secure localStorage after successful login
4. THE frontend SHALL include the JWT token in the Authorization header for all API requests to protected endpoints
5. THE frontend SHALL implement automatic token refresh when access token expires using the refresh token
6. THE frontend SHALL display a usage banner when the user has consumed more than 80% of their monthly quota
7. THE usage banner SHALL show remaining detections, quota percentage, and days until reset
8. THE usage banner SHALL include an "Upgrade Plan" button that navigates to the subscription management page
9. THE frontend SHALL add a notification bell icon in the header showing unread count badge
10. THE frontend SHALL implement a notification dropdown displaying recent in-app notifications
11. THE frontend SHALL add a floating support button in the bottom-right corner that opens the ticket creation form
12. THE frontend SHALL update all API calls to use the API Gateway URL (http://localhost:8080 in development)


### Requirement 33: Error Handling and Logging

**User Story:** As a system administrator, I want comprehensive error handling and logging across all services, so that I can troubleshoot issues and monitor system health.

#### Acceptance Criteria

1. ALL services SHALL log errors with level ERROR including stack traces and contextual information
2. ALL services SHALL log warnings with level WARN for recoverable issues like rate limit hits or retry attempts
3. ALL services SHALL log informational messages with level INFO for important operations like user registration, login, and plan upgrades
4. THE logging format SHALL include timestamp, service name, log level, request ID, user ID (if applicable), and message
5. ALL services SHALL use structured logging (JSON format) for easier parsing and analysis
6. THE services SHALL log to stdout for Docker Compose to capture and aggregate logs
7. ALL services SHALL return standardized error responses with error_code, message, and timestamp fields
8. THE API_Gateway SHALL transform backend error responses into consistent format before returning to clients
9. ALL services SHALL include the X-Request-ID header in error responses for correlation with logs
10. THE services SHALL sanitize sensitive data (passwords, tokens, API keys) from logs
11. THE services SHALL implement circuit breaker pattern to prevent cascading failures when dependencies are down
12. THE services SHALL log performance metrics including response times for all endpoints


### Requirement 34: Data Privacy and GDPR Compliance

**User Story:** As a data protection officer, I want the system to handle user data in compliance with GDPR, so that user privacy rights are respected.

#### Acceptance Criteria

1. THE Auth_Service SHALL provide an endpoint for users to export all their personal data in JSON format
2. THE data export SHALL include user profile, subscription history, detection history, support tickets, and notification preferences
3. THE Auth_Service SHALL provide an endpoint for users to delete their account and all associated data
4. WHEN a user deletes their account, THE system SHALL cascade delete all related records including subscriptions, tickets, notifications, and API keys
5. THE system SHALL anonymize deleted user records in audit logs by replacing personal identifiers with "DELETED_USER"
6. THE system SHALL require explicit consent for processing personal data during registration
7. THE system SHALL display a clear privacy policy link on registration and data collection pages
8. THE system SHALL allow users to update their personal information (name, email, mobile) at any time
9. THE system SHALL implement data retention policies deleting old notifications (90 days) and closed tickets (1 year)
10. THE system SHALL encrypt sensitive personal data at rest in the PostgreSQL database
11. THE system SHALL log all access to personal data for audit trail (who accessed, when, what data)
12. THE system SHALL provide cookie consent banner for frontend tracking cookies per GDPR requirements


### Requirement 35: Security Best Practices

**User Story:** As a security engineer, I want the system to follow security best practices, so that user data and system resources are protected from attacks.

#### Acceptance Criteria

1. ALL services SHALL validate and sanitize user inputs to prevent SQL injection attacks
2. THE services SHALL use parameterized queries or ORM methods for all database operations
3. ALL services SHALL sanitize HTML inputs to prevent XSS (Cross-Site Scripting) attacks
4. THE Auth_Service SHALL never store passwords in plain text and SHALL use bcrypt with minimum 10 salt rounds
5. THE Auth_Service SHALL never log or transmit JWT private keys or API key secrets
6. THE API_Gateway SHALL enforce HTTPS in production environments and redirect HTTP requests to HTTPS
7. THE services SHALL validate file uploads by checking MIME types, file extensions, and file sizes
8. THE services SHALL scan uploaded files for malware before storing in MinIO
9. THE API_Gateway SHALL implement request size limits to prevent denial-of-service attacks
10. THE services SHALL use prepared statements for all SQL queries to prevent injection attacks
11. THE services SHALL implement CSRF protection using tokens for state-changing operations
12. THE services SHALL regularly update dependencies to patch known security vulnerabilities

