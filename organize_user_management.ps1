# PowerShell script to organize user_management directory
$baseDir = "supabase/migrations/user_management"

# Create necessary directories
$dirs = @("enums", "tables", "functions", "views", "policies", "triggers", "setup")
foreach ($dir in $dirs) {
    $path = Join-Path $baseDir $dir
    if (-not (Test-Path $path)) {
        New-Item -ItemType Directory -Path $path -Force | Out-Null
    }
}

# Move and rename files
$moves = @(
    @{from = "functions/02_is_admin_function.sql"; to = "functions/02_user_permissions.sql"},
    @{from = "functions/05_handle_new_user_function.sql"; to = "functions/03_handle_new_user.sql"},
    @{from = "functions/14_current_user_is_admin_function.sql"; to = "functions/04_user_permissions.sql"},
    @{from = "functions/15_get_member_count_function.sql"; to = "functions/05_user_management.sql"},
    @{from = "functions/16_update_profile_beta_status_function.sql"; to = "functions/06_user_management.sql"},
    @{from = "functions/20_get_user_role_function.sql"; to = "functions/07_user_permissions.sql"},
    @{from = "tables/01_create_profiles_table.sql"; to = "tables/01_profiles.sql"},
    @{from = "tables/02_create_user_roles_table.sql"; to = "tables/02_user_roles.sql"},
    @{from = "tables/04_create_user_stats_table.sql"; to = "tables/03_user_stats.sql"},
    @{from = "tables/33_create_beta_applications_table.sql"; to = "tables/04_beta_applications.sql"}
)

foreach ($move in $moves) {
    $fromPath = Join-Path $baseDir $move.from
    $toPath = Join-Path $baseDir $move.to
    
    if (Test-Path $fromPath) {
        Move-Item -Path $fromPath -Destination $toPath -Force
        Write-Host "Moved $($move.from) to $($move.to)"
    }
}

Write-Host "Reorganization complete!"
