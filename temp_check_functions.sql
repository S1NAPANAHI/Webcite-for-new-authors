-- Check existing is_admin function signatures
SELECT 
    p.proname as function_name,
    p.pronargs as num_args,
    pg_get_function_arguments(p.oid) as arguments,
    pg_get_function_result(p.oid) as return_type,
    p.prosrc as source_code
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' 
  AND p.proname = 'is_admin'
ORDER BY p.pronargs;
