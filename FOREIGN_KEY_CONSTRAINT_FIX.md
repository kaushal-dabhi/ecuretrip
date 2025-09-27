# 🔧 Foreign Key Constraint Fix

## ✅ **Issue Identified:**
The error `insert or update on table "profiles" violates foreign key constraint "profiles_id_fkey"` occurs because there are orphaned profiles in the database that don't have corresponding user accounts in the `auth.users` table.

## 🎯 **Root Cause:**
- The `profiles` table has a foreign key constraint to `auth.users(id)`
- Some profiles were created with random UUIDs that don't exist in `auth.users`
- This violates the foreign key constraint

## 🔧 **Solution:**

### **Step 1: Identify Orphaned Profiles**
Run this query in your Supabase SQL Editor to see what's causing the issue:

```sql
-- Check for orphaned profiles
SELECT 
    p.id,
    p.full_name,
    p.email,
    p.role,
    p.created_at
FROM public.profiles p
LEFT JOIN auth.users u ON p.id = u.id
WHERE u.id IS NULL
ORDER BY p.created_at DESC;
```

### **Step 2: Clean Up Orphaned Profiles**
Once you've identified the orphaned profiles, delete them:

```sql
-- Delete orphaned profiles (profiles without corresponding auth.users)
DELETE FROM public.profiles 
WHERE id NOT IN (SELECT id FROM auth.users);
```

### **Step 3: Clean Up Related Data**
Also clean up any related data that might be orphaned:

```sql
-- Delete orphaned patients
DELETE FROM public.patients 
WHERE profile_id NOT IN (SELECT id FROM public.profiles);

-- Delete orphaned cases
DELETE FROM public.cases 
WHERE patient_id NOT IN (SELECT id FROM public.patients);

-- Delete orphaned case files
DELETE FROM public.case_files 
WHERE case_id NOT IN (SELECT id FROM public.cases);

-- Delete orphaned quotes
DELETE FROM public.quotes 
WHERE case_id NOT IN (SELECT id FROM public.cases);
```

### **Step 4: Verify Cleanup**
Check that everything is clean:

```sql
-- Verify no orphaned data remains
SELECT 
    'profiles' as table_name,
    COUNT(*) as total_count,
    COUNT(CASE WHEN p.id IN (SELECT id FROM auth.users) THEN 1 END) as valid_count
FROM public.profiles p

UNION ALL

SELECT 
    'patients' as table_name,
    COUNT(*) as total_count,
    COUNT(CASE WHEN pt.profile_id IN (SELECT id FROM public.profiles) THEN 1 END) as valid_count
FROM public.patients pt

UNION ALL

SELECT 
    'cases' as table_name,
    COUNT(*) as total_count,
    COUNT(CASE WHEN c.patient_id IN (SELECT id FROM public.patients) THEN 1 END) as valid_count
FROM public.cases c;
```

## 🚀 **Alternative: Use the Provided Scripts**

I've created two scripts to help you:

### **1. Diagnostic Script:**
```bash
# Copy the contents of scripts/fix-foreign-key-constraint.sql
# and run it in your Supabase SQL Editor
```

### **2. Cleanup Script:**
```bash
# Copy the contents of scripts/cleanup-orphaned-profiles.sql
# and run it in your Supabase SQL Editor
```

## 📋 **Step-by-Step Instructions:**

### **Option 1: Quick Fix (Recommended)**
1. Go to your Supabase SQL Editor
2. Run this query to delete orphaned profiles:
   ```sql
   DELETE FROM public.profiles 
   WHERE id NOT IN (SELECT id FROM auth.users);
   ```
3. Run the updated `medical-tourism-schema.sql` again

### **Option 2: Complete Cleanup**
1. Run the diagnostic script to see what's orphaned
2. Run the cleanup queries step by step
3. Verify everything is clean
4. Run the updated `medical-tourism-schema.sql`

## ⚠️ **Important Notes:**

### **Data Loss Warning:**
- The cleanup will delete orphaned profiles and related data
- This is necessary to fix the foreign key constraint
- Make sure you don't need any of the orphaned data

### **Backup Recommendation:**
- Consider backing up your database before running cleanup
- Export any important data you want to keep

## 🎯 **After Cleanup:**

### **1. Run the Updated Schema:**
```sql
-- Copy and paste the contents of medical-tourism-schema.sql
-- into your Supabase SQL Editor and run it
```

### **2. Create Sample Doctors (Optional):**
```bash
npm run create-sample-doctors
```

### **3. Verify Everything Works:**
- Check that the schema runs without errors
- Test the doctors and hospitals pages
- Verify that new user registrations work

## 🎉 **Expected Result:**

After cleanup and running the updated schema:
- ✅ No foreign key constraint errors
- ✅ Clean database with proper relationships
- ✅ Working doctors and hospitals pages
- ✅ Functional user registration and authentication
- ✅ All dynamic content working properly

## 🔍 **Troubleshooting:**

### **If you still get errors:**
1. Check for other foreign key constraints
2. Verify all related tables are clean
3. Make sure you're running the latest schema
4. Check for any remaining orphaned data

### **If you need help:**
- Run the diagnostic script to identify issues
- Check the error messages carefully
- Verify your Supabase project settings
- Make sure RLS policies are properly configured

**The foreign key constraint error should be resolved after cleanup!** 🚀
