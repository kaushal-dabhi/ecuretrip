#!/bin/bash

# eCureTrip Investor Demo Deployment Script
echo "🚀 Deploying eCureTrip to Vercel for Investor Demo..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Login to Vercel (if not already logged in)
echo "🔐 Checking Vercel authentication..."
vercel whoami &> /dev/null || vercel login

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "🎯 Your demo is now live and ready for investors!"
echo "📱 Share the URL with your investors for remote access"
