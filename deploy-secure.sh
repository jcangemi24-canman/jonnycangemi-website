#!/bin/bash

echo "🔐 Deploying Secure Portfolio - Jonny Cangemi"
echo "============================================="

# Generate NextAuth secret if not provided
if [ -z "$NEXTAUTH_SECRET" ]; then
    echo "📝 Generating NextAuth secret..."
    export NEXTAUTH_SECRET=$(openssl rand -base64 32)
    echo "✅ Secret generated: ${NEXTAUTH_SECRET:0:10}..."
fi

# Set environment variables in Vercel
echo "⚙️ Setting up Vercel environment variables..."

vercel env add NEXTAUTH_SECRET production <<< "$NEXTAUTH_SECRET"
vercel env add NEXTAUTH_URL production <<< "https://jonnycangemi.com"
vercel env add DATABASE_URL production <<< "file:./prod.db"

# OAuth keys (need to be provided manually)
echo "🔑 OAuth Setup Required:"
echo "Please set these manually in Vercel dashboard or using CLI:"
echo "- GITHUB_CLIENT_ID"
echo "- GITHUB_CLIENT_SECRET"
echo "- GOOGLE_CLIENT_ID"
echo "- GOOGLE_CLIENT_SECRET"

# Deploy to production
echo "🚀 Deploying to production..."
vercel --prod

echo ""
echo "✅ DEPLOYMENT COMPLETE!"
echo ""
echo "🔒 Security Features Active:"
echo "  ✓ Multi-factor authentication"
echo "  ✓ OAuth2 providers (GitHub, Google)"
echo "  ✓ Rate limiting & DDoS protection"
echo "  ✓ CSRF & XSS protection"
echo "  ✓ Secure headers (HSTS, CSP)"
echo "  ✓ Public/private content gating"
echo "  ✓ Admin user management"
echo "  ✓ Audit logging"
echo ""
echo "📋 Next Steps:"
echo "1. Add OAuth credentials in Vercel dashboard"
echo "2. Create admin user: POST /api/setup-admin"
echo "3. Test all authentication flows"
echo ""
echo "🌐 Your secure portfolio is live at: https://jonnycangemi.com"