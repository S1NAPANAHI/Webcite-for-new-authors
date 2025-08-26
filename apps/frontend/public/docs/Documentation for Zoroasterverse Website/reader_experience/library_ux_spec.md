#feature/store #doctype/spec #status/approved

# Store: Library UX Specification

**Objective:** To define the user experience (UX) and functionality of the user's personal library, where purchased digital content is accessed and managed.

---

This specification works in conjunction with [[download-limits-and-counters]] and [[watermark-note-behavior]].

### 1. Library Header

*   **Title:** "Your Library"
*   **Sub-navigation Chips:** `All` | `Issues` | `Bundles` | `Deluxe` | `Downloads` (allows filtering of owned content).
*   **Info Banner (Dismissible):**
    *   **Content:** "Files may include a purchaser-specific watermark. Download limits: 5 per format." (See [[microcopy/library-notices]] for copy).

### 2. Item Cards (Per Owned Product)

Each purchased product will be displayed as a card in the library.

*   **Elements:**
    *   **Cover Thumbnail:** (Left on desktop; top on mobile).
    *   **Title + Edition Tag:** (e.g., "The Veiled City - Standard Edition").
    *   **Formats with Counters:**
        *   EPUB: "Download (X/5 used)" (where X is downloads consumed).
        *   PDF: "Download (X/5 used)"
        *   MOBI: "Download (X/5 used)"
    *   **Download Button:** Active if downloads remain. Disabled if downloads exhausted.
    *   **"Mark as finished" Toggle:**
        *   **Purpose:** Allows users to indicate they have completed reading an issue.
        *   **Functionality:** Updates site-wide [[spoilers/modes-and-defaults|spoiler unlocks]] (ownership/progress gating) for deeper lore content.
    *   **Reset Request Link:** "Need a reset? Contact support@zoroasterverse.com" (See [[microcopy/download-reset-prompts]] for copy).

### 3. Download Behavior

*   **Clicking Download:** Initiates the file download. The counter for that format decrements upon successful download.
*   **Error States:** Clear messages for failed downloads or exhausted limits.

### 4. Route Suggestions Panel

*   **Placement:** A dedicated section within the library, or a sidebar.
*   **Content:** Based on the user's owned and "Marked as finished" issues, suggest related lore entries or alternative narrative routes to explore.
*   **Example:** "You finished Issue 1! Explore the [[Character: Lyra]] page, or see the [[Route: Silent Accord]] path you took."

---

*Last updated: [Month, Year]*
