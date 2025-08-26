CREATE OR REPLACE VIEW public.detailed_audit_log AS
SELECT
  al.id,
  al.action,
  al.created_at,
  al.actor_user_id,
  p.username AS actor_username,
  p.display_name AS actor_display_name
FROM
  public.audit_log al
LEFT JOIN
  public.profiles p ON al.actor_user_id = p.id;
