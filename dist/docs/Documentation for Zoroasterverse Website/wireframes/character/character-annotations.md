 #feature/worldbuilding #feature/design #doctype/spec #status/approved

# Annotated Wireframes — Character Page

**Objective:** To define the UI/UX for character pages, integrating the spoiler system and providing a rich, interactive experience for exploring character lore.

---

This specification works in conjunction with [[content-inventory/templates/characters]] and [[spoilers/modes-and-defaults]].

### 1. Header + Controls

*   **Character Name:** (Non-spoiler-safe)
*   **Global Spoiler Toggle:** (Header-level): `Minimal` | `Standard` | `Full` (See [[spoilers/modes-and-defaults]] for behavior).
*   **Per-page Override Toggle:** “Adjust for this page only” (allows temporary mode change for this page).

### 2. Non-Spoiler Overview

*   **Short Bio:** Avoids late-appearance details and route outcomes.
*   **Tags Row:** (Non-spoiler): `Arc`, `Issue of first appearance` (abstracted if needed), `POV status` (Y/N).

### 3. Spoiler Capsules

*   **Sections:** `History`, `Relationships`, `Key Moments`, `Appearances Timeline`.
*   **Capsule Design:** (See [[spoilers/capsules-pattern]] for visual and functional details).
    *   **Label Example:** “Reveals Branch: Silent Accord — tap to reveal”
    *   **Severity Badge:** `L` / `M` / `H` (Low, Medium, High, from [[content-inventory/guides/tagging-and-spoiler-severity]]).
    *   **Ownership/Progress Lock Indicator:** If user hasn’t finished related content (e.g., “Unlocks after you finish: Issue 3”).
*   **Content within Capsules:** Rich text explaining the event/relationship/change, cross-links to related [[content-inventory/templates/events|Events]] and [[content-inventory/templates/characters|Factions]] (respecting current spoiler mode).

### 4. Relationship Visualizer (New Component)

*   **Placement:** A prominent section on the character page.
*   **Component:** See [[relationship-visualizer-spec]] for detailed specification.
*   **Purpose:** To visually map the character's connections to other characters, factions, and key events, leveraging the [[content-inventory/guides/graph-model-recommendations|graph data model]].

### 5. Visual Tags

*   `Arc`, `Issue`, `POV`, `Branch`, `Ending-level`, `Severity` (L/M/H).

---

*Last updated: [Month, Year]*
