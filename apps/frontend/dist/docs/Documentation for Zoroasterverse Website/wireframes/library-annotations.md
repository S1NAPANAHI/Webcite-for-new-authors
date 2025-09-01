#feature/store #feature/design #doctype/spec #status/approved

# Annotated Wireframes — Library

**Objective:** To define the user experience (UX) and functionality of the user's personal library, where purchased digital content is accessed and managed.

---

This specification works in conjunction with [[store-library/library-ux-spec]].

### 1. Library Header

*   **Title:** “Your Library”
*   **Sub-navigation Chips:** `All` | `Issues` | `Bundles` | `Deluxe` | `Downloads`
*   **Info Banner (Dismissible):**
    *   “Files may include a purchaser-specific watermark. Download limits: 5 per format.” (See [[microcopy/library-notices]] for copy).

### 2. Item Cards (per owned product)

*   **Left:** cover thumbnail
*   **Center:**
    *   Title + Edition tag
    *   Formats with counters:
        *   EPUB: “Download (2/5 used)”
        *   PDF: “Download (0/5 used)”
        *   MOBI: “Download (5/5 used)”
*   **Right:**
    *   “Mark as finished” toggle (updates site-wide [[spoilers/modes-and-defaults|spoiler unlocks]]).
    *   “Need a reset? Email support@zoroasterverse.com” (See [[microcopy/download-reset-prompts]] for copy).

### 3. Download Behavior

*   Clicking Download: Initiates the file download. The counter for that format decrements upon successful download.
*   Error States: Clear messages for failed downloads or exhausted limits.

### 4. Route Suggestions Panel

*   **Placement:** A dedicated section within the library, or a sidebar.
*   **Content:** Based on the user's owned and “Marked as finished” issues, suggest related lore entries or alternative narrative routes to explore.
*   **Example:** “You finished Issue 1! Explore the [[Character: Lyra]] page, or see the [[Route: Silent Accord]] path you took.”

---

*Last updated: [Month, Year]*
