# PowerShell script to organize ecommerce directory
$baseDir = "supabase/migrations/ecommerce"

# Create necessary directories
$dirs = @("enums", "tables", "functions", "views", "policies", "triggers", "setup")
foreach ($dir in $dirs) {
    $path = Join-Path $baseDir $dir
    if (-not (Test-Path $path)) {
        New-Item -ItemType Directory -Path $path -Force | Out-Null
    }
}

# Define the file moves - format: @{from = "old/path"; to = "new/path"}
$moves = @(
    # Enums
    @{from = "enums/01_create_ecommerce_related_enums.sql"; to = "enums/01_ecommerce_enums.sql"},
    
    # Functions
    @{from = "functions/03_has_active_subscription_function.sql"; to = "functions/01_subscription_checks.sql"},
    @{from = "functions/04_get_user_subscription_tier_function.sql"; to = "functions/02_subscription_tiers.sql"},
    @{from = "functions/06_generate_order_number_function.sql"; to = "functions/03_order_utilities.sql"},
    @{from = "functions/07_update_inventory_function.sql"; to = "functions/04_inventory_management.sql"},
    @{from = "functions/08_create_product_with_variants_function.sql"; to = "functions/05_product_management.sql"},
    @{from = "functions/09_get_or_create_cart_function.sql"; to = "functions/06_cart_management.sql"},
    @{from = "functions/11_get_user_active_subscription_function.sql"; to = "functions/07_subscription_management.sql"},
    @{from = "functions/12_user_has_privilege_function.sql"; to = "functions/08_user_privileges.sql"},
    
    # Tables - renumbering sequentially
    @{from = "tables/01_create_profiles_table.sql"; to = "tables/01_profiles.sql"},
    @{from = "tables/19_create_products_table.sql"; to = "tables/02_products.sql"},
    @{from = "tables/20_create_product_categories_table.sql"; to = "tables/03_product_categories.sql"},
    @{from = "tables/20_create_stripe_customers_table.sql"; to = "tables/04_stripe_customers.sql"},
    @{from = "tables/21_create_product_variants_table.sql"; to = "tables/05_product_variants.sql"},
    @{from = "tables/21_create_subscriptions_table.sql"; to = "tables/06_subscriptions.sql"},
    @{from = "tables/22_create_orders_table.sql"; to = "tables/07_orders.sql"},
    @{from = "tables/22_create_prices_table.sql"; to = "tables/08_prices.sql"},
    @{from = "tables/23_create_purchases_table.sql"; to = "tables/09_purchases.sql"},
    @{from = "tables/23_create_subscriptions_table.sql"; to = "tables/10_subscriptions.sql"},
    @{from = "tables/24_create_invoices_table.sql"; to = "tables/11_invoices.sql"},
    @{from = "tables/24_create_subscription_invoices.sql"; to = "tables/12_subscription_invoices.sql"},
    @{from = "tables/24_create_subscriptions_table.sql"; to = "tables/13_subscriptions.sql"},
    @{from = "tables/25_create_refunds_table.sql"; to = "tables/14_refunds.sql"},
    @{from = "tables/25_create_subscription_plans_table.sql"; to = "tables/15_subscription_plans.sql"},
    @{from = "tables/25_create_subscription_usage.sql"; to = "tables/16_subscription_usage.sql"}
)

# Process the moves
foreach ($move in $moves) {
    $fromPath = Join-Path $baseDir $move.from
    $toPath = Join-Path $baseDir $move.to
    
    if (Test-Path $fromPath) {
        $toDir = Split-Path -Path $toPath -Parent
        if (-not (Test-Path $toDir)) {
            New-Item -ItemType Directory -Path $toDir -Force | Out-Null
        }
        Move-Item -Path $fromPath -Destination $toPath -Force -ErrorAction SilentlyContinue
        Write-Host "Moved $($move.from) to $($move.to)"
    } else {
        Write-Warning "Source file not found: $($move.from)"
    }
}

# Create README.md
$readmeContent = @"
# E-commerce Migrations

This directory contains database migrations for the e-commerce functionality, organized by type and version.

## Directory Structure

```
ecommerce/
├── enums/               # Database enums
│   └── 01_ecommerce_enums.sql
│
├── tables/              # Table definitions
│   ├── 01_profiles.sql
│   ├── 02_products.sql
│   ├── 03_product_categories.sql
│   ├── 04_stripe_customers.sql
│   ├── 05_product_variants.sql
│   ├── 06_subscriptions.sql
│   ├── 07_orders.sql
│   ├── 08_prices.sql
│   ├── 09_purchases.sql
│   ├── 10_subscriptions.sql
│   ├── 11_invoices.sql
│   ├── 12_subscription_invoices.sql
│   ├── 13_subscriptions.sql
│   ├── 14_refunds.sql
│   ├── 15_subscription_plans.sql
│   └── 16_subscription_usage.sql
│
├── functions/           # Database functions
│   ├── 01_subscription_checks.sql
│   ├── 02_subscription_tiers.sql
│   ├── 03_order_utilities.sql
│   ├── 04_inventory_management.sql
│   ├── 05_product_management.sql
│   ├── 06_cart_management.sql
│   ├── 07_subscription_management.sql
│   └── 08_user_privileges.sql
│
├── views/               # Database views
│   └── (to be added)
│
├── policies/            # Row Level Security policies
│   └── (to be added)
│
└── triggers/            # Database triggers
    └── (to be added)
```

## Notes

1. **Naming Conventions:**
   - Files are prefixed with a two-digit number for ordering
   - Names are in `snake_case`
   - File names describe their purpose

2. **Duplicate Subscriptions:**
   - There appear to be multiple subscription-related tables (06_, 10_, 13_)
   - These should be reviewed and consolidated if necessary

3. **Next Steps:**
   - Add missing policy files
   - Add missing trigger files
   - Create necessary views
   - Update any code that references old file paths
"@

Set-Content -Path (Join-Path $baseDir "README.md") -Value $readmeContent

Write-Host "Reorganization complete! Review the README.md for notes on next steps."
