#feature/spoilers #doctype/spec #status/approved

# Spoiler System: Lint Rules

**Objective:** To define automated rules and checks that identify potential spoiler leaks or inconsistencies in content tagging, ensuring adherence to the spoiler system's logic.

---

These rules should be implemented as part of the content management system (CMS) and run automatically before content is published. Warnings should be displayed to content authors.

### 1. Content Visibility Rules

*   **Rule:** Content tagged for `Standard` or `Full` mode should not be visible in `Minimal` mode unless explicitly allowed by an `OwnershipLock` or `ProgressToggle`.
    *   **Lint Check:** Flag any `CapsuleStandard` or `CapsuleFull` content that appears in a `Minimal` mode preview without a valid unlock condition.

*   **Rule:** Content tagged for `Full` mode should not be visible in `Standard` mode unless explicitly allowed by an `OwnershipLock` or `ProgressToggle`.
    *   **Lint Check:** Flag any `CapsuleFull` content that appears in a `Standard` mode preview without a valid unlock condition.

### 2. Link Integrity Rules

*   **Rule:** Internal links within content should not inadvertently reveal spoilers.
    *   **Lint Check:** If a link points to a page or section that is currently hidden by the user's spoiler mode, the link should either be disabled, blurred, or its text should be abstracted (e.g., `[[Character: Kaelen]]` becomes `[[Character: Unknown Tactician]]`).
    *   **Lint Check:** Flag any link within a `Minimal` or `Standard` capsule that points to `Full` mode content without a valid unlock.

### 3. Tagging Consistency Rules

*   **Rule:** `SpoilerSeverity` (Low, Medium, High) should align with the content's visibility settings.
    *   **Lint Check:** Flag `Minimal` content with `High` severity, as this might indicate a miscategorization.
    *   **Lint Check:** Flag `Full` content with `Low` severity, as this might indicate an under-tagging.

*   **Rule:** All lore entries (Characters, Events, etc.) must have a defined `Arc`, `Issue`, and `POV` tag.
    *   **Lint Check:** Flag any missing required tags.

### 4. Capsule Pattern Adherence

*   **Rule:** All content intended to be hidden should be correctly wrapped in a [[capsules-pattern|spoiler capsule]] using the defined syntax.
    *   **Lint Check:** Identify common spoiler phrases (e.g., "it turns out that", "the twist is") in non-capsuled text and suggest wrapping them.

### 5. Versioning Rules

*   **Rule:** When a lore entry is updated due to a new issue release, the previous version must be archived.
    *   **Lint Check:** Flag any major lore entry update that does not have a corresponding version saved in the [[content-inventory/guides/content-versioning-spec]].

---

*Last updated: [Month, Year]*