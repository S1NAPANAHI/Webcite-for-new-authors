#feature/spoilers #doctype/sop #status/approved

# Spoiler System: Content Authoring Checklist

**Objective:** To provide a step-by-step guide for content authors to correctly tag and structure content for the spoiler system, ensuring consistency and preventing unintended leaks.

---

This checklist should be followed for all new or updated lore content (Characters, Events, Glossary, Route Nodes, etc.).

### Phase 1: Initial Content Creation

1.  **Identify Core Non-Spoiler Information:** Write the `Minimal` version of the content (e.g., `CapsuleMinimal`, `DefinitionMinimal`). This should be safe for any user to view.
2.  **Identify Spoiler Severity:** Determine the `SpoilerSeverity` (Low, Medium, High) for the content, as defined in [[content-inventory/guides/tagging-and-spoiler-severity]].
3.  **Identify Ownership Locks:** Determine which `WorkID` (e.g., `S1-I1-STD`) or `IssueNumber` unlocks the `Standard` level of detail. This will populate the `OwnershipLocks` field.

### Phase 2: Adding Gated Content

1.  **Write `Standard` Content:** Expand the `Minimal` content to include details that are safe for users who meet the `OwnershipLocks` criteria (e.g., `CapsuleStandard`, `DefinitionStandard`).
2.  **Write `Full` Content:** Add all remaining details, including major plot points, character fates, and route-specific information (e.g., `CapsuleFull`, `DefinitionFull`).
3.  **Apply Spoiler Capsules:** For any content that should be hidden in `Minimal` or `Standard` mode (unless unlocked by ownership/progress), ensure it is wrapped in a [[capsules-pattern|spoiler capsule]].
    *   Use the `[+ Spoiler]` button in the editor for rich text fields.
    *   For structured data (e.g., `OutcomeSummaryFull` in Events), ensure the system knows to hide it by default.
4.  **Tag with Context:** Assign relevant `Arc`, `Issue`, `POV`, `Branch`, `Ending-level`, and `Era` tags to the content.

### Phase 3: Linking & Cross-Referencing

1.  **Add Internal Links:** Wherever a concept or entity is mentioned that has its own page, create an [[internal link]] to it (e.g., `[[Character: Lyra]]`, `[[Event: Hall Summit]]`).
2.  **Verify Link Behavior:** Ensure that any links within spoiler capsules or to spoiler-gated content respect the user's current spoiler mode.

### Phase 4: Quality Assurance (QA)

1.  **Run Spoiler QA Procedure:** Follow the steps in [[qa-preview-procedure]] to preview the content in `Minimal`, `Standard`, and `Full` modes.
2.  **Run Spoiler Lint:** Use the [[spoiler-lint-rules]] to automatically check for any potential leaks or tagging errors.
3.  **Log QA Results:** Record the outcome of the QA in the [[ops/qa-logs/spoiler-qa-log]].

---

*Last updated: [Month, Year]*