# eCureTrip Medical Tourism Website - Deployment Guide

## 🚀 Quick Deployment Options

Due to file size limitations with Vercel CLI, here are the best deployment options:

### Option 1: Vercel (Recommended)
1. **Create GitHub Repository:**
   - Go to [GitHub.com](https://github.com) and create a new repository
   - Name it: `ecuretrip-medical-tourism`
   - Make it public

2. **Push Code to GitHub:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/ecuretrip-medical-tourism.git
   git branch -M main
   git push -u origin main
   ```

3. **Deploy on Vercel:**
   - Go to [Vercel.com](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Add Environment Variables:
     - `NEXT_PUBLIC_SUPABASE_URL`: `https://eqjpdytmsohfpohecczz.supabase.co`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxanBkeXRtc29oZnBvaGVjY3p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4MzM1NzcsImV4cCI6MjA3NDQwOTU3N30.DDNR98O9E1rcWirNZPOuoSYjaUDSuReNcZQbZtxTjgQ`
     - `SUPABASE_SERVICE_ROLE_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxanBkeXRtc29oZnBvaGVjY3p6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODgzMzU3NywiZXhwIjoyMDc0NDA5NTc3fQ.OamNH7cypAFAR1I8C54IfT0unLYqnk02PgcUXyU6FfU`
   - Click "Deploy"

### Option 2: Netlify
1. **Create GitHub Repository** (same as above)
2. **Deploy on Netlify:**
   - Go to [Netlify.com](https://netlify.com)
   - Sign up/Login with GitHub
   - Click "New site from Git"
   - Choose GitHub and select your repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`
   - Add Environment Variables (same as Vercel)
   - Click "Deploy site"

### Option 3: Railway
1. **Create GitHub Repository** (same as above)
2. **Deploy on Railway:**
   - Go to [Railway.app](https://railway.app)
   - Sign up/Login with GitHub
   - Click "New Project"
   - Choose "Deploy from GitHub repo"
   - Select your repository
   - Add Environment Variables (same as Vercel)
   - Railway will automatically detect Next.js and deploy

## 📋 What's Included

### ✅ Complete Medical Tourism Website
- **Homepage** with hero section and specialties
- **Treatments Page** with dynamic data from Supabase
- **Doctors Page** with Dr. Pritesh Shah (Radiologist, Tata Memorial Hospital)
- **Hospitals Page** with Tata Memorial Hospital and Apollo Ahmedabad
- **Patient Portal** with medical records and case management
- **Doctor Portal** with case reviews and quote management
- **Authentication System** with role-based access
- **Medical Intake Form** for new patients
- **Treatment Detail Pages** with booking functionality

### ✅ Real Data Integration
- **Supabase Database** with real medical data
- **1 Doctor**: Dr. Pritesh Shah (Radiology, Tata Memorial Hospital)
- **2 Hospitals**: Tata Memorial Hospital (Mumbai) & Apollo Ahmedabad
- **Dynamic Treatments** from database
- **Working Authentication** with OTP and password options

### ✅ Professional Features
- **Responsive Design** for all devices
- **Modern UI/UX** with your brand colors (#2A4049, #ADC8A6)
- **Medical Images** for oncology and pediatric treatments
- **Working APIs** for doctors and hospitals data
- **Secure Authentication** with role-based access

## 🎯 Ready to Share

Once deployed, you'll get a URL like:
- Vercel: `https://your-project.vercel.app`
- Netlify: `https://your-project.netlify.app`
- Railway: `https://your-project.railway.app`

## 📱 Share with Friends & Doctors

The website includes:
- **Professional medical tourism platform**
- **Real doctor profiles** (Dr. Pritesh Shah)
- **Real hospital information** (Tata Memorial & Apollo Ahmedabad)
- **Working patient and doctor portals**
- **Complete medical workflows**
- **Modern, trustworthy design**

Perfect for showing to medical professionals and potential patients!

---

**Note**: The website is fully functional with real data and can be used for actual medical tourism consultations.
