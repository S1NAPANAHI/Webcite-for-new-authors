#feature/worldbuilding #doctype/guide #status/approved

# Content Inventory: ID Conventions and Cross-linking

**Objective:** To define consistent naming conventions for content IDs and best practices for cross-linking between entries, ensuring data integrity and seamless navigation within the worldbuilding wiki.

---

This guide is crucial for maintaining a robust and navigable content inventory, especially when leveraging a [[graph-model-recommendations|graph data model]].

### 1. ID Naming Conventions

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

### 2. Cross-linking Best Practices

Cross-linking connects related content entries, enriching the user's exploration experience.

*   **Internal Links (`[[wikilinks]]`):**
    *   **Rule:** Use `[[ID]]` or `[[ID|Display Name]]` syntax for all internal links within content fields (e.g., `CapsuleMinimal`, `CapsuleStandard`, `CapsuleFull`).
    *   **Example:** Instead of writing "Lyra was present," write "[[CH-LYRA|Lyra]] was present."
    *   **Benefit:** Obsidian automatically creates these links, and the system can parse them to build relationships in a [[graph-model-recommendations|graph database]].

*   **Related Entries Fields:**
    *   Many content schemas (e.g., Characters, Events, Glossary) have `RelatedEntries` fields.
    *   **Rule:** Populate these fields with the `ID`s of related content, separated by commas.
    *   **Example:** For `CH-LYRA`, `RelatedEntries` might include `CH-MAREN, EV-MARKET-STANDOFF`.

### 3. Spoiler System Integration

*   **Rule:** All cross-links must respect the user's current [[spoilers/modes-and-defaults|spoiler mode]].
*   **Behavior:** If a link points to content that is currently hidden by the user's spoiler mode, the link should either be disabled, blurred, or its text should be abstracted (e.g., `[[CH-LYRA|Unknown Figure]]`). This is handled by the [[spoilers/spoiler-lint-rules|spoiler lint]] and UI rendering logic.

---

*Last updated: [Month, Year]*