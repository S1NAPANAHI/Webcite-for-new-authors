# Content Management: Content Model and Guidelines

This document consolidates guidelines and recommendations for structuring, linking, and managing content within the Zoroasterverse website, particularly focusing on the novel's complex narrative and spoiler system.

---

## 1. Graph Model Recommendations

**Objective:** To recommend a data modeling approach that complements the current CSV/spreadsheet structure, ensuring the project can handle deep narrative complexity and scale without future database overhauls.

### 1.1. Current Model: Spreadsheets (CSVs)

The current system using spreadsheets for [[content_templates/characters|Characters]], [[content_templates/events-and-timeline|Events]], [[content_templates/route-nodes-and-endings|Routes]], etc., is **excellent** for initial data entry, bulk editing, and establishing a clear schema. It should be kept as the primary method for content authoring.

### 1.2. The Future Challenge: Deep Relationships

As the story grows, the relationships *between* data points become as important as the data itself. For example:

*   Which characters were **allies** during the *Siege of Silverwood* but became **rivals** after the *Thorn Pact*?
*   Show me all events influenced by the *Silent Accord* that feature a member of the *House of Ember*.
*   Can a reader reach *Ending X* without first encountering *Character Y*?

Answering these questions with spreadsheets requires complex, multi-file lookups that are slow and difficult to maintain. This is a common scaling problem for rich narrative worlds.

### 1.3. Recommendation: A Graph Model Backend

While content can be authored in spreadsheets, I recommend that the backend database be structured as a **Graph**. In a graph model, the relationships are first-class citizens.

*   **Nodes:** These are your primary entities: `Character`, `Event`, `Location`, `Faction`, `RouteNode`.
*   **Edges:** These are the relationships that connect them: `ALLY_OF`, `BETRAYED_IN`, `PARTICIPATED_IN`, `LEADS_TO`.

### 1.4. Example

Instead of just having a `Relations` column in a Character CSV, the data would be structured like this:

*   `(Character: Lyra)` **--[ALLY_OF]-->** `(Character: Maren)`
*   `(Character: Lyra)` **--[PARTICIPATED_IN]-->** `(Event: Hall_Summit)`
*   `(Event: Hall_Summit)` **--[INFLUENCED_BY]-->** `(Route: Veiled_Tide)`

### 1.5. Benefits of this Approach

1.  **Powerful Queries:** The complex questions above become simple and fast queries in a graph database (like Neo4j, ArangoDB, or AWS Neptune).
2.  **Discovering Insights:** You can visually map out character relationships or plot lines, making it easier to spot inconsistencies or find interesting new narrative connections.
3.  **Scalability:** A graph is designed to handle billions of relationships without a performance hit. Your world can grow infinitely complex without breaking the backend.
4.  **Flexible Authoring:** You can continue to use spreadsheets. A developer can write a simple import script that reads the CSVs and builds the graph structure automatically.

### 1.6. Actionable Next Step

No immediate action is needed from a content perspective. This document should be given to the future development team as a strong recommendation for their backend architecture. It informs their choice of database technology and ensures the system they build will support the narrative's complexity for years to come.

---

## 2. ID Conventions and Cross-linking

**Objective:** To define consistent naming conventions for content IDs and best practices for cross-linking between entries, ensuring data integrity and seamless navigation within the worldbuilding wiki.

This guide is crucial for maintaining a robust and navigable content inventory, especially when leveraging a [[graph-model-recommendations|graph data model]].

### 2.1. ID Naming Conventions

All content entries (Works, Characters, Events, Route Nodes, Glossary Terms, Reviews) must have a unique, consistent ID (slug).

*   **Format:** `TYPE-SHORTNAME-IDENTIFIER` (all uppercase, hyphens as separators).
*   **Rules:**
    *   Must be unique across its `TYPE`.
    *   Should be descriptive but concise.
    *   Avoid spaces or special characters (use hyphens instead).
    *   Should remain stable once assigned.

*   **Examples:**
    *   **Works:** `S1-I1-STD` (Season 1, Issue 1, Standard Edition), `S1-B1` (Season 1 Bundle).
    *   **Characters:** `CH-LYRA`, `CH-ADEM`.
    *   **Events:** `EV-MARKET-STANDOFF`, `EV-HALL-SUMMIT`.
    *   **Route Nodes:** `NODE-GATE`, `NODE-PARLEY`.
    *   **Glossary:** `GL-ACCORDS`, `GL-TIDE`.
    *   **Reviews:** `RV-BETA-001`, `RV-PUB-001`.

### 2.2. Cross-linking Best Practices

Cross-linking connects related content entries, enriching the user's exploration experience.

*   **Internal Links (`[[wikilinks]]`):**
    *   **Rule:** Use `[[ID]]` or `[[ID|Display Name]]` syntax for all internal links within content fields (e.g., `CapsuleMinimal`, `CapsuleStandard`, `CapsuleFull`).
    *   **Example:** Instead of writing "Lyra was present," write "[[CH-LYRA|Lyra]] was present."
    *   **Benefit:** Obsidian automatically creates these links, and the system can parse them to build relationships in a [[graph-model-recommendations|graph database]].

*   **Related Entries Fields:**
    *   Many content schemas (e.g., Characters, Events, Glossary) have `RelatedEntries` fields.
    *   **Rule:** Populate these fields with the `ID`s of related content, separated by commas.
    *   **Example:** For `CH-LYRA`, `RelatedEntries` might include `CH-MAREN, EV-MARKET-STANDOFF`.

### 2.3. Spoiler System Integration

*   **Rule:** All cross-links must respect the user's current [[spoiler_system/modes-and-defaults|spoiler mode]].
*   **Behavior:** If a link points to content that is currently hidden by the user's spoiler mode, the link should either be disabled, blurred, or its text should be abstracted (e.g., `[[CH-LYRA|Unknown Figure]]`). This is handled by the [[spoiler_system/spoiler-lint-rules|spoiler lint]] and UI rendering logic.

---

## 3. Ownership Locks and Progress

**Objective:** To define how content visibility is controlled based on a user's ownership of specific issues and their progress through the narrative, integrating with the [[spoiler_system/modes-and-defaults|spoiler system]].

This guide details the logic behind the `OwnershipLocks` and progress-based toggles used in content entries (e.g., [[content_templates/characters|Characters]], [[content_templates/events-and-timeline|Events]], [[content_templates/glossary|Glossary]], [[content_templates/route-nodes-and-endings|Route Nodes & Endings]]).

### 3.1. Ownership Locks (`OwnershipLocks` Field)

*   **Definition:** The `OwnershipLocks` field in a content entry specifies one or more `WorkID`s (e.g., `S1-I1-STD`) that a user must own to unlock a higher level of spoiler detail (typically `Standard` mode).
*   **Purpose:** To ensure that readers only encounter spoilers for content they have already purchased and are presumed to have read.
*   **Behavior:**
    *   If a user is in `Standard` spoiler mode and owns the `WorkID` specified in `OwnershipLocks`, the content entry will display its `CapsuleStandard` version.
    *   If the user does not own the `WorkID`, the content will remain in `CapsuleMinimal` (or hidden, depending on `SpoilerSeverity`).
*   **Example:** An event that occurs in Issue 3 will have `S1-I3-STD` in its `OwnershipLocks`. A user in `Standard` mode will only see the detailed `CapsuleStandard` version of this event if they own `S1-I3-STD`.

### 3.2. Progress-Based Toggles (`Mark as Finished`)

*   **Definition:** Users can mark issues as "finished" in their [[reader_experience/library_ux_spec|Library]]. This action signals their progress through the narrative.
*   **Purpose:** To allow users to manually unlock deeper spoiler content across the site, even if they don't own subsequent issues (e.g., they read it elsewhere).
*   **Behavior:** When an issue is marked as finished, the system treats the user as having "read" that issue, potentially unlocking content that would otherwise be gated by `OwnershipLocks` for that specific `WorkID`.
*   **Example:** A user marks `S1-I2-STD` as finished. Content entries with `S1-I2-STD` in their `OwnershipLocks` will now display their `CapsuleStandard` version to this user in `Standard` spoiler mode.

### 3.3. Integration with Spoiler Modes

*   The `OwnershipLocks` and progress toggles primarily affect content display in `Standard` spoiler mode.
*   `Minimal` mode always hides spoilers, regardless of ownership or progress.
*   `Full` mode always shows all content, regardless of ownership or progress.

### 3.4. Admin Considerations

*   Content authors must carefully assign `OwnershipLocks` to ensure content is revealed at the appropriate point in the narrative.
*   The CMS should provide tools to easily manage and view a user's owned and "finished" content for testing purposes.

---

## 4. Tagging and Spoiler Severity

**Objective:** To define the conventions for tagging content entries with spoiler severity levels and other contextual tags, ensuring consistent application of the [[spoiler_system/modes-and-defaults|spoiler system]].

This guide should be used by content authors when populating the [[content_templates/characters|Characters]], [[content_templates/events-and-timeline|Events]], [[content_templates/glossary|Glossary]], and [[content_templates/route-nodes-and-endings|Route Nodes & Endings]] spreadsheets.

### 4.1. Spoiler Severity (`SpoilerSeverity` Field)

This field indicates the inherent spoiler level of a piece of information, regardless of the user's current spoiler mode. It helps determine how content should be gated and displayed.

*   **Low:** Information that is generally safe to reveal early. It might hint at future events or character traits but does not give away major plot points or twists.
    *   **Example:** A character's general personality, a historical event that is widely known in-world.
*   **Medium:** Information that reveals significant details about a character, event, or plot point that might be considered a spoiler for a reader who has not completed a specific issue or arc.
    *   **Example:** A character's hidden ability, the outcome of a minor conflict, a key decision point in a route.
*   **High:** Information that reveals major plot twists, character fates, critical narrative outcomes, or the resolution of a central conflict.
    *   **Example:** The identity of a main antagonist, a character's death, the final outcome of a major route.

### 4.2. Contextual Tags

These tags provide additional context for content entries and are crucial for filtering, cross-linking, and spoiler gating.

*   **Arc Tags (`ArcTags` Field):** Indicates which major narrative arc the content belongs to.
    *   **Example:** `Foundations`, `City`, `Conflict`, `Resolution`.
*   **Issue/Season Tags (`FirstAppearanceWorkID`, `OwnershipLocks` Fields):** Links content to specific issues or seasons. This is used by the [[spoiler_system/modes-and-defaults|spoiler system]] to determine when content can be revealed based on user ownership.
*   **POV Tags (`POV` Field):** Indicates if a character is a Point-of-View character.
*   **Branch Tags (`BranchTags` Field):** Links content to specific narrative branches or routes (e.g., `Silent Accord`, `Iron Vow`). These are typically [[spoiler_system/labels/route-labels-placeholder|abstracted route labels]].
*   **Ending-Level Tags (`EndingID`, `EndingCategory` Fields):** Links content to specific endings or categories of endings (e.g., `Reprieve`, `Severance`). These are typically [[spoiler_system/labels/ending-tags|abstracted ending tags]].

### 4.3. Capsule Content (`CapsuleMinimal`, `CapsuleStandard`, `CapsuleFull` Fields)

These fields contain the actual content that will be displayed at different spoiler levels. Authors must ensure consistency and accuracy across these versions.

*   **`CapsuleMinimal`:** The most basic, non-spoiler version.
*   **`CapsuleStandard`:** Reveals more detail once the user meets `OwnershipLocks`.
*   **`CapsuleFull`:** Reveals all details, including major spoilers.

### 4.4. Cross-Linking (`RelatedEntries`, `TimelineLinks` Fields)

*   **Rule:** Use consistent [[id-conventions-and-crosslinks|ID conventions]] for linking between entries (e.g., `CH-LYRA` for Lyra, `EV-MARKET-STANDOFF` for Market Standoff).
*   **Behavior:** The display of cross-linked content will respect the user's current spoiler mode.
