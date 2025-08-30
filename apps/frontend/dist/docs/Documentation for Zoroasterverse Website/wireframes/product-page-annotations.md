#feature/store #feature/design #doctype/spec #status/approved

# Annotated Wireframes — Product Page

**Objective:** To define the layout structure, component behavior, data bindings, and paste-ready microcopy for the Product Page.

---

This specification works in conjunction with the [[store-library/product-page-spec]].

### 1. Hero Section

*   **Elements:**
    *   Cover image (left on desktop; top on mobile)
    *   Title, Issue/Season label
    *   Edition selector (Standard/Deluxe)
    *   Preorder badge (if applicable): “Preorder: [Month, Year]” (See [[store-library/preorder-and-release-states]])
*   **Notes:**
    *   On release, Preorder badge auto-switches to “Available Now.”
    *   Deluxe shows extras list (annotations, concept art, soundtrack links) under selector.

### 2. Purchase Module

*   **Price display** per edition
*   **CTA:**
    *   If preorder: “Preorder Now”
    *   If released: “Buy Issue”
    *   If owned: “Add to Library” switches to “In Library”
*   **Formats checklist:** EPUB, PDF, MOBI
*   **Content warnings summary:** (See [[policies/footer-snippets-and-product-bullets]] for copy)

### 3. Beta Average Score Module (Pre-Release)

*   **Badge:** “Beta Average Score”
*   **Score display:** “4.2/5” + “n=47 (Beta)”
*   **Tooltip:** “Based on early beta feedback; may differ from public reviews.” (See [[microcopy/beta-score-tooltip]] for copy)

### 4. Details Section

*   **Tabs:** Overview | Editions | Extras (Deluxe only) | Tech Specs (formats, file sizes)
*   **Overview:** Short synopsis (non-spoiler), reading order link to [[blueprints/approved/website-blueprint|Series Guide]].
*   **Tech Specs:** Formats, file size per format, download note, recommended readers/apps.

### 5. Reviews Section

*   **Pre-release:** “Beta Snapshot” tab first, individual beta reviews labeled “Beta”
*   **Post-release:** “Public Reviews” tab first, aggregates (Public Average; Fresh ratio badge).
*   **Sort:** Helpful, Newest, Highest, Lowest
*   **Card content:** Headline, quick take, tags, rating, spoiler capsule (if present), route label (abstracted), edition, Verified Purchase badge (post-release).

### 6. Footer Banner (Contextual)

*   “Have questions? Email support@zoroasterverse.com”

---

*Last updated: [Month, Year]*
