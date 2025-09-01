#feature/worldbuilding #feature/spoilers #doctype/guide #status/approved

# Content Inventory: Tagging and Spoiler Severity

**Objective:** To define the conventions for tagging content entries with spoiler severity levels and other contextual tags, ensuring consistent application of the [[feature/spoilers|spoiler system]].

---

This guide should be used by content authors when populating the [[templates/characters|Characters]], [[templates/events-and-timeline|Events]], [[templates/glossary|Glossary]], and [[templates/route-nodes-and-endings|Route Nodes & Endings]] spreadsheets.

### 1. Spoiler Severity (`SpoilerSeverity` Field)

This field indicates the inherent spoiler level of a piece of information, regardless of the user's current spoiler mode. It helps determine how content should be gated and displayed.

*   **Low:** Information that is generally safe to reveal early. It might hint at future events or character traits but does not give away major plot points or twists.
    *   **Example:** A character's general personality, a historical event that is widely known in-world.
*   **Medium:** Information that reveals significant details about a character, event, or plot point that might be considered a spoiler for a reader who has not completed a specific issue or arc.
    *   **Example:** A character's hidden ability, the outcome of a minor conflict, a key decision point in a route.
*   **High:** Information that reveals major plot twists, character fates, critical narrative outcomes, or the resolution of a central conflict.
    *   **Example:** The identity of a main antagonist, a character's death, the final outcome of a major route.

### 2. Contextual Tags

These tags provide additional context for content entries and are crucial for filtering, cross-linking, and spoiler gating.

*   **Arc Tags (`ArcTags` Field):** Indicates which major narrative arc the content belongs to.
    *   **Example:** `Foundations`, `City`, `Conflict`, `Resolution`.
*   **Issue/Season Tags (`FirstAppearanceWorkID`, `OwnershipLocks` Fields):** Links content to specific issues or seasons. This is used by the [[spoilers/modes-and-defaults|spoiler system]] to determine when content can be revealed based on user ownership.
*   **POV Tags (`POV` Field):** Indicates if a character is a Point-of-View character.
*   **Branch Tags (`BranchTags` Field):** Links content to specific narrative branches or routes (e.g., `Silent Accord`, `Iron Vow`). These are typically [[spoilers/labels/route-labels-placeholder|abstracted route labels]].
*   **Ending-Level Tags (`EndingID`, `EndingCategory` Fields):** Links content to specific endings or categories of endings (e.g., `Reprieve`, `Severance`). These are typically [[spoilers/labels/ending-tags|abstracted ending tags]].

### 3. Capsule Content (`CapsuleMinimal`, `CapsuleStandard`, `CapsuleFull` Fields)

These fields contain the actual content that will be displayed at different spoiler levels. Authors must ensure consistency and accuracy across these versions.

*   **`CapsuleMinimal`:** The most basic, non-spoiler version.
*   **`CapsuleStandard`:** Reveals more detail once the user meets `OwnershipLocks`.
*   **`CapsuleFull`:** Reveals all details, including major spoilers.

### 4. Cross-Linking (`RelatedEntries`, `TimelineLinks` Fields)

*   **Rule:** Use consistent [[id-conventions-and-crosslinks|ID conventions]] for linking between entries (e.g., `CH-LYRA` for Lyra, `EV-MARKET-STANDOFF` for Market Standoff).
*   **Behavior:** The display of cross-linked content will respect the user's current spoiler mode.

---

*Last updated: [Month, Year]*