#tags: #feature/store #doctype/spec #status/approved

# Store: Product Page Specification

**Objective:** To define the layout, components, states, and copy for issue and bundle product pages, ensuring a clear and compelling presentation of the product, and supporting hierarchical purchasing options.

---

### 1. Hero Section

*   **Elements:**
    *   **Cover Image:** (Left on desktop; top on mobile)
    *   **Title:** Product title (e.g., "The Veiled City - Issue 1" or "Arc 1: The Silent Accord").
    *   **Product Type Label:** (e.g., "Issue", "Arc", "Saga", "Volume", "Book").
    *   **Edition Selector:** (Standard/Deluxe) - allows users to switch between editions.
    *   **Preorder Badge:** (If applicable) "Preorder: [Month, Year]" - see [[preorder-and-release-states]].
*   **Notes:**
    *   On release, Preorder badge auto-switches to "Available Now."
    *   Deluxe edition selector shows extras list (annotations, concept art, soundtrack links) under selector.

### 2. Purchase Module

*   **Price Display:** Per edition/bundle.
*   **Call to Action (CTA):**
    *   If preorder: "Preorder Now"
    *   If released: "Buy Now"
    *   If owned: "In Library" (button disabled, or links to library item).
*   **Formats Checklist:** EPUB, PDF, MOBI (for issues/bundles containing issues).
*   **License Bullet Reminder:** (See [[policies/footer-snippets-and-product-bullets]] for copy).
*   **Content Warnings Summary:** (See [[policies/footer-snippets-and-product-bullets]] for copy).

### 3. Progress Indicators (For Works in Progress - WIPs)

*   **Placement:** Prominently displayed on product pages for `Arc`, `Saga`, `Volume`, or `Book` products that are not yet fully released.
*   **Elements:**
    *   **Completion Percentage:** `X% Complete` (e.g., "60% Complete").
        *   **Calculation:** Based on `Released_Issues_Count` / `Planned_Issues_Count` or `Released_Chapters_Count` / `Planned_Chapters_Count` from `works-and-editions.csv`.
    *   **Chapter/Issue Count:** `Y Chapters Released / Z Chapters Planned` or `Y Issues Released / Z Issues Planned`.
    *   **Next Release Date:** `Next Chapter: [Date]` or `Next Issue: [Date]`.
*   **Data Source:** `Planned_Issues_Count`, `Planned_Chapters_Count`, `Released_Issues_Count`, `Released_Chapters_Count`, `Next_Release_Date`, and `Status` from [[content-inventory/templates/works-and-editions]].

### 4. Upsell/Cross-sell Module

*   **Placement:** Below the main purchase module, or in a sidebar.
*   **Purpose:** To encourage users to purchase higher-value bundles or related content.
*   **Elements:**
    *   **For an Issue Product Page:**
        *   "Buy the Arc this Issue belongs to and save X%" (Link to Arc product page).
        *   "Subscribe to the Chapter Pass for chapter-by-chapter releases" (Link to subscription page).
    *   **For an Arc Product Page:**
        *   "Buy the Saga this Arc belongs to and save Y%" (Link to Saga product page).
        *   List of included Issues with links to their individual pages.
    *   **For any Product Page:**
        *   "Explore the full Series" (Link to [[series-page-spec|Series Page]]).

### 5. Beta Average Score Module (Pre-Release)

*   **Placement:** Near purchase module for visibility.
*   **Elements:**
    *   Badge: "Beta Average Score"
    *   Score display: (e.g., "4.2/5")
    *   Sample size: "n=XX (Beta)"
    *   Tooltip: "Based on early beta feedback; may differ from public reviews." (See [[microcopy/beta-score-tooltip]] for copy).

### 6. Details Section

*   **Tabs:** Overview | Editions | Extras (Deluxe only) | Tech Specs (formats, file sizes) | Included Content (for bundles).
*   **Overview:** Short synopsis (non-spoiler), reading order link to [[blueprints/approved/website-blueprint|Series Guide]].
*   **Included Content (New Tab for Bundles):** Lists all constituent Issues/Arcs/Sagas/Volumes with links to their individual product pages.
*   **Tech Specs:** Formats, file size per format, download note, recommended readers/apps.

### 7. Reviews Section

*   **Pre-release:** "Beta Snapshot" tab first, individual beta reviews labeled "Beta".
*   **Post-release:** "Public Reviews" tab first, aggregates (Public Average, Fresh ratio).
*   **Filters & Sort:** As defined in [[reviews/filters-and-sorts]].
*   **Review Cards:** Displayed as per [[reviews/public-display-modules]].

### 8. Footer Banner (Contextual)

*   "Have questions? Email support@zoroasterverse.com"

---

*Last updated: [Month, Year]*
