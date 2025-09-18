# Operations & Admin: Product Management Workflow

This document defines the necessary CMS functionalities and workflows for managing the complex product hierarchy, pricing, and progress tracking for the shop.

---

## 1. Objective

To streamline the process of creating, updating, and managing all product types (Issues, Arcs, Sagas, Volumes, Books) and their associated data, including pricing and Work-in-Progress (WIP) indicators.

## 2. Key Features

### 2.1. Hierarchical Product Creation

*   **Base Unit Creation:** Ability to create "Issue" products as the fundamental building block.
*   **Bundle Creation:**
    *   Ability to create "Arc" products by bundling existing "Issues."
    *   Ability to create "Saga," "Volume," and "Book" products by bundling their respective lower-level components.
*   **Automated Linking:** The system should automatically establish and maintain parent/child relationships based on bundling, ensuring the product hierarchy is always accurate.

### 2.2. Automated Bundle Pricing

*   **Discount Definition:** Define global or per-bundle discount percentages (e.g., 5% for Arc, 10% for Saga) within the CMS.
*   **Automatic Calculation:** The system should automatically calculate the bundle price based on the sum of its constituent parts and the applied discount, as per the [[shop_commerce/pricing_strategy|Pricing Strategy]].
*   **Override Option:** Provide an option to manually override automated pricing for specific promotions or unique product configurations.

### 2.3. WIP Progress Tracking

*   **Data Input:** Fields for `Planned_Issues_Count`, `Planned_Chapters_Count`, and `Next_Release_Date` for each product (as defined in `content_management/content_templates/works-and-editions.csv`).
*   **Progress Updates:** Ability to update `Released_Issues_Count` and `Released_Chapters_Count` as content is published.
*   **Automated Calculation:** The system should automatically calculate the `Completion Percentage` based on released vs. planned counts, which will be displayed on product pages.

### 2.4. Content Linking

*   **Intuitive Interface:** An easy-to-use interface to link chapters/issues to their respective arcs, sagas, volumes, and books, ensuring accurate content mapping.

### 2.5. Product Status Management

*   **Status Options:** Ability to set product status (e.g., "Planned," "In Progress," "Completed," "Archived"). This status can influence visibility and display on the storefront.

## 3. Integration Points

*   **Content Model:** Relies on the definitions in [[content_management/content_model|Content Model]] and `content_management/content_templates/works-and-editions.csv`.
*   **Shop Commerce:** Directly impacts product display and pricing as defined in [[shop_commerce/product_page_spec|Product Page Spec]] and [[shop_commerce/pricing_strategy|Pricing Strategy]].
*   **Admin Dashboard:** Functionality will be accessible via the [[operations_admin/admin_dashboard_spec|Admin Dashboard]].
