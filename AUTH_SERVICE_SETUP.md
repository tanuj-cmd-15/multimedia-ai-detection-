# Auth Service Setup Guide

## Overview

The Auth Service provides three authentication methods:
1. **Email/Password** - Traditional registration with bcrypt password hashing
2. **Google OAuth 2.0** - Login with Google account
3. **Mobile OTP** - SMS-based authentication via Twilio

## Prerequisites

Before starting, you need:

### 1. Google OAuth Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable "Google+ API"
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Application type: Web application
6. Authorized redirect URIs: `http://localhost:8082/auth/oauth2/callback/google`
7. Copy Client ID and Client Secret

### 2. Twilio Account (for SMS OTP)
1. Sign up at [Twilio](https://www.twilio.com/)
2. Get a phone number (free trial includes credits)
3. Copy Account SID, Auth Token, and Phone Number from dashboard
4. Format phone number as E.164: `+1234567890`

### 3. SendGrid Account (for emails)
1. Sign up at [SendGrid](https://sendgrid.com/)
2. Create an API key with "Mail Send" permissions
3. Free tier: 100 emails/day

## Quick Start

### Step 1: Generate JWT Keys

Run the provided script to generate RSA key pair:

```bash
# Windows
generate-jwt-keys.bat

# Linux/Mac
chmod +x generate-jwt-keys.sh
./generate-jwt-keys.sh
```

This creates:
- `auth-service/src/main/resources/secrets/private_key.pem` (for signing tokens)
- `auth-service/src/main/resources/secrets/public_key.pem` (for verification)

**⚠️ SECURITY**: Never commit private_key.pem to git!

### Step 2: Configure Environment Variables

Copy the example file and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env` and add:

```bash
# Google OAuth
GOOGLE_CLIENT_ID=your_actual_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_actual_client_secret

# Twilio SMS
TWILIO_ACCOUNT_SID=your_actual_account_sid
TWILIO_AUTH_TOKEN=your_actual_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# SendGrid Email
SENDGRID_API_KEY=your_actual_api_key
```

### Step 3: Start Infrastructure

Start PostgreSQL and Redis:

```bash
docker-compose up -d postgres redis
```

Wait for services to be healthy (~30 seconds).

### Step 4: Build Auth Service

```bash
cd auth-service
mvn clean package
```

### Step 5: Run Auth Service

```bash
# Using Maven
mvn spring-boot:run

# Or using Docker
docker-compose up -d auth-service
```

The service will start on port **8082**.

## Testing the Auth Service

### 1. Test Email/Password Registration

```bash
curl -X POST http://localhost:8082/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123",
    "fullName": "Test User"
  }'
```

Expected response:
```json
{
  "message": "Registration successful. Please check your email for verification code.",
  "user": {
    "id": 1,
    "email": "test@example.com",
    "fullName": "Test User",
    "authProvider": "EMAIL",
    "emailVerified": false
  }
}
```

### 2. Test Login

```bash
curl -X POST http://localhost:8082/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123"
  }'
```

Expected response:
```json
{
  "accessToken": "eyJhbGciOiJSUzI1NiJ9...",
  "refreshToken": "eyJhbGciOiJSUzI1NiJ9...",
  "tokenType": "Bearer",
  "expiresIn": 900,
  "user": { ... },
  "plan": {
    "planType": "FREE_TRIAL",
    "trialRequestsUsed": 0,
    "trialRequestsLimit": 50
  }
}
```

### 3. Test Mobile OTP (requires Twilio)

Request OTP:
```bash
curl -X POST http://localhost:8082/auth/otp/request \
  -H "Content-Type: application/json" \
  -d '{
    "mobileNumber": "+919876543210"
  }'
```

Verify OTP:
```bash
curl -X POST http://localhost:8082/auth/otp/verify \
  -H "Content-Type: application/json" \
  -d '{
    "mobileNumber": "+919876543210",
    "otp": "123456"
  }'
```

### 4. Test Google OAuth

1. Open browser: `http://localhost:8082/auth/login/google`
2. You'll be redirected to Google login
3. After login, you'll be redirected back with JWT tokens

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/register` | POST | Register with email/password |
| `/auth/login` | POST | Login with email/password |
| `/auth/verify-email` | POST | Verify email with code |
| `/auth/otp/request` | POST | Request OTP for mobile |
| `/auth/otp/verify` | POST | Verify OTP and login |
| `/auth/login/google` | GET | Initiate Google OAuth flow |
| `/auth/oauth2/callback/google` | GET | Google OAuth callback |
| `/auth/refresh-token` | POST | Refresh access token |
| `/auth/logout` | POST | Logout and blacklist token |
| `/auth/me` | GET | Get current user info |
| `/auth/health` | GET | Health check |

## JWT Token Structure

### Access Token (15 minutes)
```json
{
  "userId": 1,
  "email": "test@example.com",
  "plan": "FREE_TRIAL",
  "roles": ["USER"],
  "type": "access",
  "sub": "1",
  "jti": "uuid",
  "iat": 1234567890,
  "exp": 1234568790
}
```

### Refresh Token (7 days)
```json
{
  "userId": 1,
  "type": "refresh",
  "sub": "1",
  "jti": "uuid",
  "iat": 1234567890,
  "exp": 1235172690
}
```

## Security Features

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one digit
- Hashed with bcrypt (10 rounds)

### Rate Limiting
- **Login**: 5 attempts per 15 minutes per email
- **OTP Request**: 3 requests per 5 minutes per mobile
- **OTP Verification**: 3 attempts per OTP

### JWT Security
- RS256 (RSA-SHA256) signing
- Short-lived access tokens (15 min)
- Rotating refresh tokens (single-use)
- Token blacklist on logout
- Secure key storage

## Database Schema

```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    mobile_number VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255),
    google_sub VARCHAR(255) UNIQUE,
    auth_provider VARCHAR(20) NOT NULL,  -- EMAIL, GOOGLE, MOBILE
    full_name VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500),
    email_verified BOOLEAN DEFAULT FALSE,
    mobile_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

## Redis Keys

| Key Pattern | Purpose | TTL |
|-------------|---------|-----|
| `otp:{mobile}` | Store OTP code | 5 minutes |
| `otp:attempt:{mobile}` | Track OTP attempts | 5 minutes |
| `jwt:blacklist:{tokenId}` | Blacklist logged-out tokens | Token expiry |
| `rate:limit:login:{email}` | Track login attempts | 15 minutes |
| `rate:limit:otp:{mobile}` | Track OTP requests | 5 minutes |
| `verify:email:{email}` | Email verification code | 15 minutes |

## Troubleshooting

### Issue: "Failed to load private key"
**Solution**: Run `generate-jwt-keys.bat` to create RSA keys.

### Issue: "Twilio credentials not configured"
**Solution**: This is just a warning. SMS will be disabled if Twilio is not configured. You can still use email/password and Google login.

### Issue: "Database connection failed"
**Solution**: Ensure PostgreSQL is running:
```bash
docker-compose up -d postgres
docker-compose logs postgres
```

### Issue: "Redis connection failed"
**Solution**: Ensure Redis is running:
```bash
docker-compose up -d redis
docker-compose logs redis
```

### Issue: Rate limit exceeded during testing
**Solution**: Clear Redis keys:
```bash
docker exec -it swarparikshan-redis redis-cli
FLUSHALL
```

## Development Mode

For local development without external services:

1. **Skip Twilio** (OTP will fail, but email/Google still work)
2. **Skip SendGrid** (emails won't be sent, but registration works)
3. **Mock Trial Service** (default plan info will be returned)

The service is designed to gracefully degrade when external services are unavailable.

## Next Steps

After Auth Service is running:

1. **Build Trial Service** (port 8083) - for subscription management
2. **Build API Gateway** (port 8080) - for centralized routing
3. **Integrate Frontend** - update login page to use new endpoints
4. **Add Google OAuth button** - in React login page
5. **Add Mobile OTP tab** - in React login page

## Support

For issues or questions:
- Check logs: `docker-compose logs auth-service`
- Test health: `curl http://localhost:8082/auth/health`
- Check database: `docker exec -it swarparikshan-postgres psql -U swarparikshan -d swarparikshan -c "SELECT * FROM users;"`
