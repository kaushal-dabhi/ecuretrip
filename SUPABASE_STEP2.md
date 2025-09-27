# Step 2: Database Schema Setup

## What You Need to Do

### 1. Create Supabase Project (if not done)
- Go to [supabase.com](https://supabase.com)
- Create new project in **EU region**
- Note your project URL and anon key

### 2. Configure Authentication
- In Supabase Dashboard → Authentication → Settings
- Enable **Email OTP** authentication
- Configure email templates (optional)

### 3. Create Storage Bucket
- In Supabase Dashboard → Storage
- Create bucket: `patient_uploads`
- Set to **Private**
- Enable **Versioning**

### 4. Add Environment Variables
Create `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 5. Run Database Schema
Copy and paste the entire contents of `supabase-schema.sql` into your Supabase SQL Editor and run it.

## What the Schema Creates

### Tables:
- **profiles** - User profiles (extends auth.users)
- **treatments** - Medical treatments with pricing
- **patients** - Patient records
- **cases** - Medical cases
- **case_files** - File attachments for cases
- **quotes** - Treatment quotes from doctors

### Security:
- Row Level Security (RLS) enabled on all tables
- Policies for patients, doctors, and admins
- Public read access to treatments

### Seed Data:
- 5 sample treatments (oncology and pediatrics)

## Verification Steps

### 1. Run Setup Script
```bash
npx tsx scripts/setup-supabase.ts
```

### 2. Test in Browser
Visit `http://localhost:3000/test-supabase`

You should see:
- ✅ Connection successful
- 5 treatments displayed
- No errors

### 3. Check Supabase Dashboard
- Tables should appear in Database → Tables
- 5 treatments visible in treatments table
- Storage bucket `patient_uploads` exists

## Troubleshooting

### Connection Issues
- Verify environment variables are correct
- Check project URL format
- Ensure project is active (not paused)

### Schema Issues
- Run SQL commands one by one if bulk fails
- Check for syntax errors
- Verify extensions are enabled

### Missing Data
- Re-run the INSERT statements
- Check if RLS policies are blocking access
- Verify user permissions

## Next Steps

Once Step 2 is complete:
- ✅ Database schema created
- ✅ Seed data loaded
- ✅ Test page working

Proceed to **Step 3**: Create treatments list and detail pages using your existing UI components.
