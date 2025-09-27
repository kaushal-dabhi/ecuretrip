-- Cleanup script for orphaned profiles
-- This script removes profiles that don't have corresponding users in auth.users

-- First, let's see what orphaned profiles exist
SELECT 
    p.id,
    p.full_name,
    p.email,
    p.role,
    p.created_at
FROM public.profiles p
LEFT JOIN auth.users u ON p.id = u.id
WHERE u.id IS NULL;

-- Delete orphaned profiles (uncomment the line below to actually delete)
-- DELETE FROM public.profiles 
-- WHERE id NOT IN (SELECT id FROM auth.users);

-- Alternative: Update orphaned profiles to have valid user IDs
-- This would require creating corresponding auth.users entries first

-- Check current profiles count
SELECT COUNT(*) as total_profiles FROM public.profiles;

-- Check current auth users count  
SELECT COUNT(*) as total_auth_users FROM auth.users;
