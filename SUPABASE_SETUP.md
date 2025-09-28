# 🔧 Supabase Setup Guide for eCureTrip

## Step 1: Create Supabase Account

1. **Go to:** https://supabase.com
2. **Sign up** with GitHub, Google, or Email
3. **Create new project:**
   - Name: `ecuretrip-demo`
   - Password: Create strong password (save it!)
   - Region: Choose closest to your users

## Step 2: Set Up Database Schema

1. **Go to:** SQL Editor in your Supabase dashboard
2. **Copy and paste** the contents of `setup-supabase.sql`
3. **Run the SQL** to create all tables and sample data

## Step 3: Get Your Credentials

1. **Go to:** Settings → API
2. **Copy these values:**

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 4: Configure Environment Variables

### For Local Development:
Create `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### For Vercel Deployment:
1. **Go to:** Vercel Dashboard → Your Project → Settings → Environment Variables
2. **Add these variables:**
   - `NEXT_PUBLIC_SUPABASE_URL` = your project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your anon key
   - `SUPABASE_SERVICE_ROLE_KEY` = your service role key

## Step 5: Create Sample Users

Run this command to create sample doctors:
```bash
npm run create-sample-doctors
```

## Step 6: Redeploy to Vercel

After setting up environment variables:
```bash
vercel --prod
```

## ✅ Verification

Your demo should now work with:
- ✅ Real database connection
- ✅ Sample doctors and treatments
- ✅ User authentication
- ✅ Full functionality

## 🔐 Test Credentials

After running sample doctor creation:
```
Doctor: dr.rajesh@apollohospitals.com / Doctor123!
Patient: Create account through signup
```

## 🆘 Troubleshooting

### Common Issues:
1. **"supabaseUrl is required"** → Environment variables not set
2. **"Failed to fetch"** → Database schema not created
3. **Authentication errors** → Row Level Security policies

### Solutions:
1. Double-check environment variables
2. Run the SQL schema setup
3. Check Supabase dashboard for errors

---

**Need help?** Check the Supabase documentation or your project's API logs.
