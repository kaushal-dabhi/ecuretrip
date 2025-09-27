-- Fix foreign key constraint issues
-- This script helps identify and resolve foreign key constraint violations

-- Step 1: Check for orphaned profiles (profiles without corresponding auth.users)
SELECT 
    'Orphaned profiles' as issue_type,
    COUNT(*) as count
FROM public.profiles p
LEFT JOIN auth.users u ON p.id = u.id
WHERE u.id IS NULL

UNION ALL

-- Step 2: Check for orphaned patients (patients without corresponding profiles)
SELECT 
    'Orphaned patients' as issue_type,
    COUNT(*) as count
FROM public.patients pt
LEFT JOIN public.profiles p ON pt.profile_id = p.id
WHERE p.id IS NULL

UNION ALL

-- Step 3: Check for orphaned cases (cases without corresponding patients)
SELECT 
    'Orphaned cases' as issue_type,
    COUNT(*) as count
FROM public.cases c
LEFT JOIN public.patients p ON c.patient_id = p.id
WHERE p.id IS NULL;

-- Step 4: Show detailed orphaned profiles
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

-- Step 5: Clean up orphaned profiles (UNCOMMENT TO EXECUTE)
-- WARNING: This will delete profiles that don't have corresponding auth.users
-- DELETE FROM public.profiles 
-- WHERE id NOT IN (SELECT id FROM auth.users);

-- Step 6: Clean up orphaned patients (UNCOMMENT TO EXECUTE)
-- DELETE FROM public.patients 
-- WHERE profile_id NOT IN (SELECT id FROM public.profiles);

-- Step 7: Clean up orphaned cases (UNCOMMENT TO EXECUTE)
-- DELETE FROM public.cases 
-- WHERE patient_id NOT IN (SELECT id FROM public.patients);

-- Step 8: Verify cleanup
SELECT 
    'Remaining profiles' as table_name,
    COUNT(*) as count
FROM public.profiles

UNION ALL

SELECT 
    'Remaining patients' as table_name,
    COUNT(*) as count
FROM public.patients

UNION ALL

SELECT 
    'Remaining cases' as table_name,
    COUNT(*) as count
FROM public.cases;
