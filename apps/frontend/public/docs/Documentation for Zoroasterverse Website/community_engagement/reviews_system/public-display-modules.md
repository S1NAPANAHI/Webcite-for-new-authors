#feature/reviews #doctype/spec #status/approved

# Reviews: Public Display Modules

**Objective:** To define the various UI modules and components used for displaying reviews on public-facing pages, ensuring consistency and adherence to spoiler rules.

---

### 1. Review Card (Individual Review Display)

This is the primary component for displaying a single review.

*   **Elements:**
    *   **Headline:** (e.g., "Hooked from chapter 2")
    *   **Quick Take:** (1-2 sentences summary)
    *   **Rating:** 1-5 star visual representation.
    *   **Reviewer Name:** (e.g., "by ReaderX")
    *   **Tags:** (e.g., `Pacing`, `Worldbuilding` - from [[reviews/templates/review-template-spoiler-free|review template]])
    *   **Spoiler Capsule:** (If present, a collapsed, click-to-reveal section. See [[spoilers/capsules-pattern]] for behavior.)
    *   **Metadata:**
        *   `Route Label` (abstracted, e.g., "Silent Accord")
        *   `Edition` (e.g., "Standard", "Deluxe")
        *   `Verified Purchase` badge (if applicable, see [[verified-purchase-rules]])
    *   **Helpfulness Counter:** "X people found this helpful" with an upvote button.
    *   **Report Button:** "Report" (links to [[policies/reviews-and-community-guidelines|reporting process]]).

### 2. Review Listing (Collection of Reviews)

This module displays multiple review cards.

*   **Elements:**
    *   **Aggregate Score Module:** (See [[aggregates-and-beta-snapshot]])
    *   **Filters:**
        *   `Spoiler-free only` toggle.
        *   `Route Label` dropdown (abstracted labels).
        *   `POV Focus` dropdown.
        *   `Edition` filter (Standard/Deluxe).
    *   **Sort Options:** `Helpful`, `Newest`, `Highest Rating`, `Lowest Rating`.
    *   **Review Cards:** Displayed below filters and sort options.
    *   **Pagination:** For large numbers of reviews.

### 3. Beta Snapshot Module (Pre-Release)

*   **Placement:** Prominently displayed on product pages during the pre-release phase.
*   **Elements:**
    *   Badge: "Beta Average Score"
    *   Score display: (e.g., "4.2/5")
    *   Sample size: "n=XX (Beta)"
    *   Tooltip: "Based on early beta feedback; may differ from public reviews."
    *   Link: "See all beta reviews" (leads to filtered review listing).

### 4. Public Aggregate Module (Post-Release)

*   **Placement:** Replaces the Beta Snapshot module on product pages post-release.
*   **Elements:**
    *   Average Rating: (e.g., "4.5/5")
    *   "Fresh" Ratio: (e.g., "85% Fresh")
    *   "Fresh" badge (if applicable, see [[aggregates-and-beta-snapshot]] for calculation).
    *   Link: "See all reviews" (leads to full review listing).

### 5. Empty State

*   **Message:** "Be the first to review this issue!"
*   **CTA:** "Write a Review" button.

---

*Last updated: [Month, Year]*