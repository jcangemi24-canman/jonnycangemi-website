# 🔑 OAuth Setup - Step by Step Guide

## 1. GitHub OAuth Setup (2 minutes)

### Step 1: Create GitHub OAuth App
1. **Open this link**: https://github.com/settings/applications/new
2. **Fill out the form** with these exact values:

```
Application name: Jonny Cangemi Portfolio
Homepage URL: https://jonnycangemi.com
Application description: Secure portfolio access
Authorization callback URL: https://jonnycangemi.com/api/auth/callback/github
```

3. **Click "Register application"**
4. **Copy the Client ID** (you'll see it immediately)
5. **Click "Generate a new client secret"**
6. **Copy the Client Secret** (SAVE THIS - you can't see it again!)

### Step 2: Add to Vercel
Run these commands with your GitHub credentials:

```bash
echo "YOUR_GITHUB_CLIENT_ID" | vercel env add GITHUB_CLIENT_ID production
echo "YOUR_GITHUB_CLIENT_SECRET" | vercel env add GITHUB_CLIENT_SECRET production
```

---

## 2. Google OAuth Setup (3 minutes)

### Step 1: Create Google Cloud Project
1. **Open**: https://console.cloud.google.com/
2. **Create new project** or select existing
3. **Project name**: "Jonny Portfolio" (or any name)

### Step 2: Enable Google+ API
1. **Go to**: APIs & Services → Library
2. **Search**: "Google+ API"
3. **Click "Enable"**

### Step 3: Create OAuth Credentials
1. **Go to**: APIs & Services → Credentials
2. **Click**: "Create Credentials" → "OAuth 2.0 Client IDs"
3. **Application type**: Web application
4. **Name**: Jonny Cangemi Portfolio

### Step 4: Configure Authorized URLs
Add these **exact URLs**:

**Authorized JavaScript origins:**
```
https://jonnycangemi.com
```

**Authorized redirect URIs:**
```
https://jonnycangemi.com/api/auth/callback/google
```

5. **Click "Create"**
6. **Copy Client ID and Client Secret**

### Step 5: Add to Vercel
```bash
echo "YOUR_GOOGLE_CLIENT_ID" | vercel env add GOOGLE_CLIENT_ID production
echo "YOUR_GOOGLE_CLIENT_SECRET" | vercel env add GOOGLE_CLIENT_SECRET production
```

---

## 3. Deploy Updated Site

```bash
vercel --prod
```

---

## 4. Create Your Admin Account

```bash
curl -X POST https://jonnycangemi.com/api/setup-admin \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jonny Cangemi",
    "email": "your-email@example.com",
    "password": "your-secure-password"
  }'
```

---

## 5. Create Your First Access Code

Once you're admin, go to: https://jonnycangemi.com/admin
Create access codes for people you want to give access to!

---

**Total Setup Time: ~5 minutes**
**Result: Fully secured portfolio with OAuth + access codes** 🔒