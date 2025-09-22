# 🔑 OAuth Setup Guide - Complete Instructions

## GitHub OAuth Setup (2 minutes)

1. **Go to GitHub Settings**
   - Visit: https://github.com/settings/developers
   - Click "OAuth Apps" in left sidebar
   - Click "New OAuth App"

2. **Fill out the form:**
   ```
   Application name: Jonny Cangemi Portfolio
   Homepage URL: https://jonnycangemi.com
   Application description: Professional portfolio with secure access
   Authorization callback URL: https://jonnycangemi.com/api/auth/callback/github
   ```

3. **Save and get credentials:**
   - Click "Register application"
   - Copy the **Client ID**
   - Click "Generate a new client secret"
   - Copy the **Client Secret**

## Google OAuth Setup (3 minutes)

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Create new project or select existing

2. **Enable Google+ API**
   - Go to "APIs & Services" > "Library"
   - Search "Google+ API" and enable it

3. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Application type: "Web application"

4. **Configure settings:**
   ```
   Name: Jonny Cangemi Portfolio
   Authorized JavaScript origins: https://jonnycangemi.com
   Authorized redirect URIs: https://jonnycangemi.com/api/auth/callback/google
   ```

5. **Save and get credentials:**
   - Copy the **Client ID**
   - Copy the **Client Secret**

## Quick Commands for Vercel Deployment

Once you have the OAuth credentials, run these commands:

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Set environment variables (replace with your actual values)
vercel env add NEXTAUTH_SECRET
# Paste your generated secret

vercel env add NEXTAUTH_URL
# Enter: https://jonnycangemi.com

vercel env add GITHUB_CLIENT_ID
# Paste your GitHub Client ID

vercel env add GITHUB_CLIENT_SECRET
# Paste your GitHub Client Secret

vercel env add GOOGLE_CLIENT_ID
# Paste your Google Client ID

vercel env add GOOGLE_CLIENT_SECRET
# Paste your Google Client Secret

# Deploy with environment variables
vercel --prod
```

## Generate NextAuth Secret
```bash
openssl rand -base64 32
```

---
**Time to complete: ~5 minutes**
**Result: Fully secured OAuth-enabled portfolio**