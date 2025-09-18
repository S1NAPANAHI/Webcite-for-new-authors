# Core Platform: Database Schema

This document outlines the proposed database schema for the Zoroasterverse website, detailing the main tables, their relationships, and key fields required to support all documented features.

---

## 1. Database Type Considerations

While a traditional relational database (e.g., PostgreSQL, MySQL) can handle most of the application's data (users, orders, subscriptions), the complex interconnections within the novel's worldbuilding (characters, events, relationships) strongly suggest the benefits of a **Graph Database** for that specific domain (as recommended in [[content_management/content_model.md#graph-model-recommendations|Content Model: Graph Model Recommendations]]).

For this initial schema, we will outline a relational-like structure for core application data, with a note on how a graph database would integrate for worldbuilding.

## 2. Core Tables & Relationships

### 2.1. `Users` Table

Stores user account information.

*   `user_id` (PK, UUID)
*   `email` (Unique, String)
*   `password_hash` (String)
*   `display_name` (String)
*   `profile_picture_url` (String, Nullable)
*   `bio` (Text, Nullable)
*   `created_at` (Timestamp)
*   `updated_at` (Timestamp)
*   `last_login_at` (Timestamp, Nullable)
*   `default_spoiler_mode` (Enum: 'Minimal', 'Standard', 'Full')

### 2.2. `Works` Table (Product Hierarchy)

Represents all levels of the novel hierarchy (Book, Volume, Saga, Arc, Issue, Chapter) and serves as the central product catalog.

*   `work_id` (PK, UUID)
*   `work_type` (Enum: 'Book', 'Volume', 'Saga', 'Arc', 'Issue', 'Chapter')
*   `title` (String)
*   `description` (Text)
*   `publication_date` (Date, Nullable)
*   `author_id` (FK to `Authors` table, Nullable - if authors are managed separately)
*   `parent_work_id` (FK to `Works.work_id`, Nullable - for hierarchical linking)
*   `base_price` (Decimal, Nullable - for purchasable units)
*   `bundle_discount_percentage` (Decimal, Nullable)
*   `planned_issues_count` (Integer, Nullable)
*   `planned_chapters_count` (Integer, Nullable)
*   `released_issues_count` (Integer, Default 0)
*   `released_chapters_count` (Integer, Default 0)
*   `next_release_date` (Date, Nullable)
*   `status` (Enum: 'Planned', 'In Progress', 'Completed', 'Archived')
*   `word_count` (Integer, Nullable - for Issues/Chapters)
*   `cover_image_url` (String, Nullable)

### 2.3. `Orders` Table

Records user purchases.

*   `order_id` (PK, UUID)
*   `user_id` (FK to `Users.user_id`)
*   `order_date` (Timestamp)
*   `total_amount` (Decimal)
*   `status` (Enum: 'Pending', 'Completed', 'Cancelled', 'Refunded')
*   `payment_id` (String, from payment gateway)

### 2.4. `OrderItems` Table

Details the items within each order.

*   `order_item_id` (PK, UUID)
*   `order_id` (FK to `Orders.order_id`)
*   `work_id` (FK to `Works.work_id`)
*   `quantity` (Integer)
*   `price_at_purchase` (Decimal)

### 2.5. `Subscriptions` Table

Manages recurring Chapter Pass subscriptions.

*   `subscription_id` (PK, UUID)
*   `user_id` (FK to `Users.user_id`)
*   `work_id` (FK to `Works.work_id` - for the specific series/book subscribed to)
*   `start_date` (Timestamp)
*   `end_date` (Timestamp, Nullable - for cancellation/expiration)
*   `status` (Enum: 'Active', 'Cancelled', 'Expired', 'Paused')
*   `payment_plan_id` (String, from payment gateway)

### 2.6. `Entitlements` Table

Links users to specific content they have access to (purchased or subscribed).

*   `entitlement_id` (PK, UUID)
*   `user_id` (FK to `Users.user_id`)
*   `work_id` (FK to `Works.work_id` - the specific chapter/issue/arc entitled)
*   `source_type` (Enum: 'Purchase', 'Subscription', 'BetaAccess', 'Gift')
*   `source_id` (UUID, Nullable - FK to `Orders.order_id` or `Subscriptions.subscription_id` or `BetaAccess.beta_access_id`)
*   `granted_at` (Timestamp)
*   `expires_at` (Timestamp, Nullable)

### 2.7. `Downloads` Table

Tracks individual file downloads for limits and watermarking.

*   `download_id` (PK, UUID)
*   `user_id` (FK to `Users.user_id`)
*   `work_id` (FK to `Works.work_id`)
*   `format` (String: 'EPUB', 'PDF', 'MOBI')
*   `download_count` (Integer, Default 0)
*   `last_download_at` (Timestamp, Nullable)
*   `watermark_data` (String, Nullable - unique data embedded)

### 2.8. `Reviews` Table

Stores user-submitted reviews.

*   `review_id` (PK, UUID)
*   `user_id` (FK to `Users.user_id`)
*   `work_id` (FK to `Works.work_id` - the work being reviewed)
*   `rating` (Integer, 1-5)
*   `title` (String, Nullable)
*   `content` (Text)
*   `is_spoiler` (Boolean, Default False)
*   `status` (Enum: 'Pending', 'Approved', 'Rejected')
*   `created_at` (Timestamp)
*   `updated_at` (Timestamp)

### 2.9. `BetaApplications` Table

Manages applications for the beta program.

*   `application_id` (PK, UUID)
*   `user_id` (FK to `Users.user_id`)
*   `applied_at` (Timestamp)
*   `status` (Enum: 'Pending', 'Approved', 'Rejected')
*   `score` (Integer, Nullable)
*   `notes` (Text, Nullable)

### 2.10. `BetaCohorts` Table

Defines specific beta testing groups.

*   `cohort_id` (PK, UUID)
*   `name` (String)
*   `description` (Text, Nullable)
*   `start_date` (Date)
*   `end_date` (Date)
*   `work_id` (FK to `Works.work_id` - the work being beta tested)

### 2.11. `BetaReaders` Table

Links users to beta cohorts.

*   `beta_reader_id` (PK, UUID)
*   `user_id` (FK to `Users.user_id`)
*   `cohort_id` (FK to `BetaCohorts.cohort_id`)
*   `joined_at` (Timestamp)
*   `status` (Enum: 'Active', 'Completed', 'Revoked')

### 2.12. `Affiliates` Table

Manages affiliate program participants.

*   `affiliate_id` (PK, UUID)
*   `user_id` (FK to `Users.user_id`)
*   `referral_code` (Unique, String)
*   `status` (Enum: 'Active', 'Pending', 'Suspended')
*   `created_at` (Timestamp)
*   `updated_at` (Timestamp)

### 2.13. `Referrals` Table

Tracks individual referrals made by affiliates.

*   `referral_id` (PK, UUID)
*   `affiliate_id` (FK to `Affiliates.affiliate_id`)
*   `referred_user_id` (FK to `Users.user_id`, Nullable - if referred user registers)
*   `referred_email` (String, Nullable - if referred user doesn't register but makes purchase)
*   `order_id` (FK to `Orders.order_id`, Nullable - if referral leads to purchase)
*   `referred_at` (Timestamp)
*   `conversion_status` (Enum: 'Clicked', 'Registered', 'Purchased')

### 2.14. `Artists` Table

Stores information about collaborating artists.

*   `artist_id` (PK, UUID)
*   `user_id` (FK to `Users.user_id`, Nullable - if artist is also a user)
*   `name` (String)
*   `portfolio_url` (String, Nullable)
*   `bio` (Text, Nullable)
*   `contact_email` (String)
*   `status` (Enum: 'Active', 'Pending', 'Inactive')

### 2.15. `Collaborations` Table

Manages specific artist collaboration projects.

*   `collaboration_id` (PK, UUID)
*   `artist_id` (FK to `Artists.artist_id`)
*   `project_title` (String)
*   `description` (Text)
*   `status` (Enum: 'Planned', 'In Progress', 'Completed', 'Cancelled')
*   `start_date` (Date, Nullable)
*   `end_date` (Date, Nullable)
*   `deliverables` (Text, Nullable)

## 3. Worldbuilding Data (Graph Database Integration)

For highly interconnected worldbuilding data (Characters, Events, Locations, Factions, Relationships), a **Graph Database** is recommended. This would store nodes (entities) and edges (relationships) allowing for powerful queries and flexible data modeling.

*   **Nodes (Examples):** `Character`, `Event`, `Location`, `Faction`, `RouteNode`, `GlossaryTerm`
*   **Edges (Examples):** `ALLY_OF`, `PARTICIPATED_IN`, `OCCURS_AT`, `LEADS_TO`, `DEFINES`

This graph database would likely integrate with the relational database via `work_id` (for linking events to specific issues/arcs) and `user_id` (for tracking user progress through routes).

## 4. Future Considerations

*   **Indexing:** Proper indexing for performance.
*   **Normalization/Denormalization:** Balancing data integrity with query performance.
*   **Auditing:** Tracking changes to critical data.
*   **Caching:** Strategies for frequently accessed data.
