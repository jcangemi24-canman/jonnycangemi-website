# 🔑 OAuth Credentials Setup - REQUIRED FOR DEPLOYMENT

## GitHub OAuth Setup (2 minutes)

1. **Go to GitHub Settings**
   - Visit: https://github.com/settings/developers
   - Click "OAuth Apps" → "New OAuth App"

2. **Fill out the form:**
   ```
   Application name: Jonny Cangemi Portfolio
   Homepage URL: https://jonnycangemi.com
   Application description: Secure portfolio with authenticated access
   Authorization callback URL: https://jonnycangemi.com/api/auth/callback/github
   ```

3. **Get credentials:**
   - Click "Register application"
   - Copy **Client ID**
   - Click "Generate a new client secret"
   - Copy **Client Secret**

## Google OAuth Setup (3 minutes)

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Create project or select existing

2. **Enable APIs:**
   - Go to "APIs & Services" → "Library"
   - Search "Google+ API" and enable

3. **Create OAuth credentials:**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - Application type: "Web application"

4. **Configure settings:**
   ```
   Name: Jonny Cangemi Portfolio
   Authorized JavaScript origins: https://jonnycangemi.com
   Authorized redirect URIs: https://jonnycangemi.com/api/auth/callback/google
   ```

5. **Get credentials:**
   - Copy **Client ID**
   - Copy **Client Secret**

## Set Environment Variables in Vercel

Once you have the OAuth credentials, run these commands:

```bash
# GitHub OAuth
echo "your-github-client-id" | vercel env add GITHUB_CLIENT_ID production
echo "your-github-client-secret" | vercel env add GITHUB_CLIENT_SECRET production

# Google OAuth
echo "your-google-client-id" | vercel env add GOOGLE_CLIENT_ID production
echo "your-google-client-secret" | vercel env add GOOGLE_CLIENT_SECRET production
```

## ⚡ Quick Command Reference:

```bash
# After getting OAuth credentials, deploy:
vercel --prod

# Then create admin user:
curl -X POST https://jonnycangemi.com/api/setup-admin \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jonny Cangemi",
    "email": "your-email@example.com",
    "password": "your-secure-password"
  }'
```

---
**Status**: ⚠️ Waiting for OAuth credentials to complete deployment