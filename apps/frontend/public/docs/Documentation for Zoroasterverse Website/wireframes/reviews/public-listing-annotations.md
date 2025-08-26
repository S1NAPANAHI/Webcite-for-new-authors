#feature/reviews #feature/design #doctype/spec #status/approved

# Annotated Wireframes — Public Review Listing

**Objective:** To define the UI/UX for displaying public reviews, including filtering, sorting, and aggregate scores, while respecting spoiler controls.

---

This specification works in conjunction with [[reviews/public-display-modules]] and [[reviews/aggregates-and-beta-snapshot]].

### 1. Review Listing Header

*   **Title:** "Reader Reviews" or "Community Feedback"
*   **Aggregate Score Module:** (See [[reviews/aggregates-and-beta-snapshot]] for details).
    *   Pre-release: "Beta Average Score (n=XX, Beta)"
    *   Post-release: "Public Average" + optional "Fresh ratio"

### 2. Filters & Sort Options

*   **Filters:**
    *   `Spoiler-free only` toggle.
    *   `Route Label` dropdown (abstracted labels from [[spoilers/labels/route-labels-placeholder]]).
    *   `POV Focus` dropdown.
    *   `Edition` filter (Standard/Deluxe).
*   **Sort Options:** `Helpful`, `Newest`, `Highest Rating`, `Lowest Rating`.

### 3. Review Cards (Individual Review Display)

*   **Layout:** Displayed as per [[reviews/public-display-modules]].
*   **Elements:**
    *   Headline, quick take, tags, rating stars.
    *   Reviewer name.
    *   If spoiler content: collapsed capsule with "Tap to reveal" (see [[spoilers/capsules-pattern]]).
    *   Metadata: route label (abstracted), edition, [[reviews/verified-purchase-rules|Verified Purchase]] flag (post-release).
    *   Helpfulness counter and report button.

### 4. Pagination

*   Standard pagination controls for navigating through multiple pages of reviews.

### 5. Empty State

*   **Message:** "Be the first to review this issue."
*   **CTA:** "Write a Review" button.

---

*Last updated: [Month, Year]*
