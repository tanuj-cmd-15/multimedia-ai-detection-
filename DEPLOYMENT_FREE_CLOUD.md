# MayaBhedak - FREE Cloud Deployment Guide

## 🎯 Overview

Deploy MayaBhedak completely FREE using:
- Vercel (Frontend)
- Railway.app (Backend + Auth)
- Supabase (Database)
- Upstash (Redis)
- Hugging Face (ML Models)
- Cloudinary (Storage)

**Total Cost: $0/month** (with reasonable usage limits)

---

## 📋 PHASE 1: Setup Free Accounts (15 minutes)

### 1. Vercel (Frontend Hosting)
1. Go to: https://vercel.com/signup
2. Sign up with GitHub
3. ✅ Done! (No credit card needed)

### 2. Railway.app (Backend Hosting)
1. Go to: https://railway.app/
2. Sign up with GitHub
3. Get $5/month free credit
4. ✅ Good for 2 backend services

### 3. Supabase (PostgreSQL Database)
1. Go to: https://supabase.com/
2. Sign up with GitHub
3. Create new project
4. Copy database connection string
5. ✅ 500MB free forever

### 4. Upstash (Redis)
1. Go to: https://upstash.com/
2. Sign up with GitHub
3. Create Redis database
4. Copy connection URL
5. ✅ 10,000 commands/day free

### 5. Hugging Face (ML Models)
1. Go to: https://huggingface.co/join
2. Sign up with email
3. ✅ Free GPU for public models

### 6. Cloudinary (File Storage)
1. Go to: https://cloudinary.com/users/register/free
2. Sign up
3. Copy API credentials
4. ✅ 25GB storage + 25GB bandwidth/month

---

## 🚀 PHASE 2: Deploy Database (10 minutes)

### Step 1: Supabase Setup
```sql
-- Run this in Supabase SQL Editor
-- Copy from: database/init.sql
-- (I'll create a simplified version)
```

**I'll create:** `database/supabase-schema.sql` (simplified for cloud)

### Step 2: Get Connection String
```
Format: postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
```

Save this! You'll need it.

---

## 🚀 PHASE 3: Deploy Backend to Railway (15 minutes)

### Step 1: Prepare Backend
```powershell
# Create railway.json
# I'll generate this for you
```

### Step 2: Deploy
1. Go to: https://railway.app/new
2. Select "Deploy from GitHub repo"
3. Connect your GitHub account
4. Select your repository
5. Select `/backend` folder
6. Add environment variables (I'll provide list)
7. Deploy!

**Railway will:**
- Build your Spring Boot app
- Assign a public URL: `https://your-app.up.railway.app`
- Auto-deploy on git push

---

## 🚀 PHASE 4: Deploy ML Models to Hugging Face (20 minutes)

### Audio Detection Model
```python
# I'll create: huggingface/audio-detection/app.py
# Gradio interface for your audio model
```

### Image Detection Model
```python
# I'll create: huggingface/image-detection/app.py
# Gradio interface for your image model
```

**Hugging Face provides:**
- Free GPU
- Auto-scaling
- Public API endpoint
- Web UI for testing

---

## 🚀 PHASE 5: Deploy Frontend to Vercel (10 minutes)

### Step 1: Configure
```javascript
// Update .env.production
VITE_API_URL=https://your-backend.up.railway.app
VITE_AUDIO_API=https://huggingface.co/spaces/username/audio
VITE_IMAGE_API=https://huggingface.co/spaces/username/image
```

### Step 2: Deploy
```powershell
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel

# Follow prompts, deploy!
```

**Vercel gives you:**
- https://mayabhedak.vercel.app
- Auto HTTPS
- CDN
- Auto-deploy on git push

---

## 📦 Environment Variables (Copy-Paste Ready)

### For Railway Backend:
```env
POSTGRES_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
REDIS_URL=redis://default:[PASSWORD]@[HOST].upstash.io:6379
CLOUDINARY_URL=cloudinary://[KEY]:[SECRET]@[CLOUD_NAME]
SENDGRID_API_KEY=SG.xxxxx
JWT_SECRET=your-random-32-char-string
INTERNAL_SECRET=another-random-32-char-string
```

### For Vercel Frontend:
```env
VITE_API_URL=https://mayabhedak-backend.up.railway.app
VITE_AUDIO_DETECT_URL=https://huggingface.co/spaces/username/audio-detect
VITE_IMAGE_DETECT_URL=https://huggingface.co/spaces/username/image-detect
```

---

## 💰 Cost Breakdown

| Service | Free Tier | Paid Tier Starts At |
|---------|-----------|-------------------|
| Vercel | Unlimited | $20/month (hobby) |
| Railway | $5 credit | $5/month (pay as you go) |
| Supabase | 500MB DB | $25/month (Pro) |
| Upstash | 10k cmds/day | $0.20 per 100k |
| Hugging Face | Unlimited (public) | $9/month (private) |
| Cloudinary | 25GB | $99/month (Plus) |
| SendGrid | 100/day | $19.95/month |

**Monthly Free Usage:**
- ~5000 API requests
- 500MB database
- 10GB file storage
- 100 emails/day
- Unlimited frontend traffic

**Perfect for:** MVP, beta testing, small user base (<100 users)

---

## 🎯 DEPLOYMENT ARCHITECTURE

```
                     Internet
                        │
                        ▼
              ┌──────────────────┐
              │  Vercel (Frontend)│
              │  mayabhedak.app   │
              └────────┬───────────┘
                       │
                       ▼
              ┌──────────────────┐
              │ Railway (Backend) │
              │   API Gateway     │
              └───┬────────┬──────┘
                  │        │
        ┌─────────┘        └─────────┐
        ▼                            ▼
┌──────────────┐            ┌──────────────┐
│ Hugging Face │            │   Railway    │
│  ML Models   │            │ Auth Service │
└──────────────┘            └──────────────┘
        │                            │
        │        ┌──────────────┐    │
        └────────┤   Supabase   │────┘
                 │  PostgreSQL  │
                 └──────────────┘
                        │
                 ┌──────────────┐
                 │   Upstash    │
                 │    Redis     │
                 └──────────────┘
```

---

## ⚡ QUICK START (Skip Docker!)

Since Docker is giving you issues, let's deploy DIRECTLY to cloud:

### Step 1: Setup Accounts (do now - 15 min)
- [ ] Create Vercel account
- [ ] Create Railway account
- [ ] Create Supabase account
- [ ] Create Upstash account
- [ ] Create Hugging Face account

### Step 2: Deploy Database (5 min)
- [ ] Create Supabase project
- [ ] Run schema SQL
- [ ] Copy connection string

### Step 3: Deploy Backend (10 min)
- [ ] Push code to GitHub
- [ ] Deploy on Railway
- [ ] Add environment variables

### Step 4: Deploy ML Models (15 min)
- [ ] Create Hugging Face Space (audio)
- [ ] Create Hugging Face Space (image)
- [ ] Upload model files

### Step 5: Deploy Frontend (5 min)
- [ ] Update API URLs
- [ ] Deploy on Vercel
- [ ] Test everything

**Total: 50 minutes to full deployment!**

---

## 🆘 Alternative: Use Simpler Stack

If you want something even simpler:

### Option A: Render.com (All-in-One)
- Deploy everything on Render
- Free tier available
- Easier than Railway

### Option B: Heroku
- Classic PaaS
- Free tier (with credit card)
- PostgreSQL included

### Option C: DigitalOcean App Platform
- $5/month droplet
- Everything in one place
- More control

---

## 💬 What Do You Want?

**Tell me your preference:**

1. **"Free cloud deployment"** → I'll create all configs for Vercel + Railway + Supabase
2. **"Simpler solution"** → I'll use Render.com (all-in-one)
3. **"Fix Docker first"** → I'll help debug your local setup
4. **"Show me all options"** → I'll create comparison guide

**Reply with your choice and I'll generate exact deployment files!**

---

## 📝 Next Steps Based on Your Choice

**If you choose FREE CLOUD:**
I'll create:
- ✅ `railway.json` (Railway config)
- ✅ `vercel.json` (Vercel config)
- ✅ `huggingface/audio-detection/app.py`
- ✅ `huggingface/image-detection/app.py`
- ✅ `database/supabase-schema.sql`
- ✅ `.env.production` templates
- ✅ Deployment scripts

**Ready to deploy?** Tell me your choice! 🚀
