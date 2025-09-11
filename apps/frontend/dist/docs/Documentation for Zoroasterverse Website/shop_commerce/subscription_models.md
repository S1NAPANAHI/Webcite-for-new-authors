# Shop & Commerce: Subscription Models

**Objective:** To define the subscription models for the Zoroasterverse website, supporting both granular chapter-by-chapter releases and larger arc-based bundles, ensuring the initial site architecture can support these models.

---

## 1. The Models: "Chapter Pass" and "Arc Pass"

We will implement two primary subscription models:

*   **Chapter Pass (Recurring Monthly Subscription):**
    *   **Model:** A recurring monthly subscription (e.g., "Zoroasterverse Chapter Pass").
    *   **Entitlement:** Subscribers get access to all new chapters as they are released within the subscribed series/book. This provides continuous engagement.
    *   **Delivery:** Chapters are automatically added to their library as they are published.
    *   **Upsell Opportunity:** Chapter Pass subscribers could receive a special discount on purchasing full Issues, Arcs, or higher-level bundles. This encourages conversion from a recurring, lower-value purchase to a higher-value one-time purchase.

*   **Arc Pass (One-Time Purchase Bundle):**
    *   **Model:** A single, one-time purchase that grants access to all issues within a specific Arc. This replaces the previous "Season Pass" concept.
    *   **Example:** A user buys the "Arc 1 Pass". They are charged once, and as each issue of Arc 1 is released, it is automatically added to their library.
    *   **Rationale:** Simpler to implement than recurring payments for a bundle, offers clear value, and provides upfront revenue.

## 2. User Experience

*   **Purchase:** Both the Chapter Pass and Arc Pass will be sold as distinct products in the store.
*   **Library:**
    *   For Chapter Pass subscribers, their library will display newly released chapters as they become available.
    *   For Arc Pass purchasers, the library will display placeholders for all upcoming issues in that Arc (e.g., "Issue 2 - Coming Soon").
*   **Release Day:** When a new chapter or issue is released, owners of the corresponding Pass will receive an email notification, and the content will automatically become available for download/reading in their library.

## 3. Features & Pricing

*   **Chapter Pass Content:** Includes access to all new chapters as they are released for the subscribed series/book.
*   **Arc Pass Content:** Includes all standard editions for a single Arc.
*   **Pricing:**
    *   **Chapter Pass:** Recurring monthly fee.
    *   **Arc Pass:** Should be priced at a slight discount compared to buying all issues individually (e.g., a 15-20% discount).
*   **Gifting:** Both Chapter and Arc Passes should be giftable.

## 4. Technical & Database Considerations

This is critical for future-proofing. The initial database design must account for these models.

*   **`products` Table:** Needs a `product_type` column (enum: `single_issue`, `bundle`, `chapter_pass`, `arc_pass`).
*   **`users` Table:** Needs a clear way to link a user to their entitlements.
*   **`subscriptions` Table (New/Updated):** A new or updated table to manage recurring Chapter Pass subscriptions.
    *   `id`
    *   `user_id`
    *   `subscription_product_id` (links to Chapter Pass product)
    *   `start_date`
    *   `end_date` (for fixed-term or cancellation)
    *   `status` (active, cancelled, etc.)
*   **`entitlements` Table (New/Updated):** A new or updated table to link `user_id` to specific content access (for both Chapter Pass and Arc Pass).
    *   `id`
    *   `user_id`
    *   `content_id` (links to specific chapter, issue, arc, etc.)
    *   `source_pass_id` (links to `subscriptions.id` for Chapter Pass, or `products.id` for Arc Pass)
    *   `granted_date`
*   **Release Logic:** When new content (chapter/issue) is published, the system must check the `subscriptions` and `entitlements` tables and grant access to all relevant users.

## 5. MVP Scope

*   **IN SCOPE for Phase 1 Architecture:** Designing the database tables to support both Chapter Pass and Arc Pass models.
*   **OUT OF SCOPE for Phase 1 Build:** The full user-facing purchase flow for these passes. This can be added in a later phase without requiring a database migration.

By planning for these subscription models now, we avoid painting ourselves into a technical corner later.
