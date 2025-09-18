 #feature/worldbuilding #feature/design #doctype/spec #status/approved

# Annotated Wireframes — Event Page

**Objective:** To define the UI/UX for event pages, integrating the spoiler system and providing a clear, interactive experience for exploring narrative events.

---

This specification works in conjunction with [[content-inventory/templates/events-and-timeline]] and [[spoilers/modes-and-defaults]].

### 1. Header + Metadata

*   **Event Title:** (Non-spoiler naming)
*   **Era/Date:** (e.g., "Foundations Era, Day 1.12")
*   **Participants:** (Abstracted if hidden by spoiler mode, e.g., "Unknown Figure" instead of a character name).
*   **Location:** (Abstracted if hidden).

### 2. Summary (Minimal-Safe)

*   One-paragraph non-spoiler summary of the event.

### 3. Spoiler Capsules

*   **Outcome Capsule:**
    *   **Label:** “Reveals outcome for Branch: Iron Vow — tap to reveal” (See [[spoilers/capsules-pattern]] for visual and functional details).
    *   **Severity Badge:** `L` / `M` / `H` (Low, Medium, High, from [[content-inventory/guides/tagging-and-spoiler-severity]]).
*   **Timeline Placement Snippet:** (With gate as needed, e.g., "This event occurs after [[Event: Market Standoff]]").

### 4. Related Content

*   **Related Characters:** Links to characters involved in the event (gated by spoiler mode).
*   **Related Route Nodes:** Links to [[content-inventory/templates/route-nodes-and-endings|Route Nodes]] influenced by this event (gated by spoiler mode).

---

*Last updated: [Month, Year]*
