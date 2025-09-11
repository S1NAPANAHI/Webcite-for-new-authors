#feature/spoilers #doctype/spec #status/approved

# Spoiler System: Capsules Pattern

**Objective:** To define the visual and functional pattern for spoiler capsules within content, ensuring sensitive information is hidden by default and revealed only upon user interaction.

---

### 1. Definition

A spoiler capsule is a discrete block of content that contains plot-sensitive information. It is hidden by default and requires a deliberate user action (e.g., a click or tap) to reveal its contents.

### 2. Visual Design (Collapsed State)

*   **Appearance:** A visually distinct block (e.g., a shaded box, a blurred text area) that clearly indicates hidden content.
*   **Label:** A clear, non-spoiler label indicating the nature of the hidden content (e.g., "Reveals Branch: Silent Accord - tap to reveal").
*   **Severity Badge (Optional):** A small badge indicating the `SpoilerSeverity` (Low, Medium, High) as defined in [[content-inventory/guides/tagging-and-spoiler-severity]].

### 3. Functional Behavior

*   **Click-to-Reveal:** Upon clicking/tapping the capsule, its contents are revealed. The capsule should remain expanded until the user navigates away or explicitly collapses it.
*   **Global Mode Interaction:**
    *   In `Minimal` and `Standard` modes (unless ownership/progress criteria are met), capsules remain collapsed.
    *   In `Full` mode, all capsules are automatically expanded by default.
*   **Ownership/Progress Gating:** Capsules can be linked to `OwnershipLocks` (e.g., "Unlocks after you finish: [[works-and-editions-seed|Issue 3]]"). If the user meets the criteria, the capsule may be automatically expanded in `Standard` mode, or the label might change to indicate it's now safe to view.

### 4. Content & Structure within Capsules

*   Capsules can contain rich text, images, and internal links. Any internal links within a capsule should also respect the current spoiler mode.
*   The content within a capsule should be concise and directly relevant to the spoiler it contains.

### 5. Authoring & QA

*   Content authors will use a specific syntax or editor tool to mark content as a spoiler capsule (e.g., `||This is a spoiler||` in Markdown, or a dedicated button in a rich text editor as specified in [[beta-program/portal/feedback-form-spec]]).
*   During [[qa-preview-procedure|QA]], content should be reviewed in all spoiler modes to ensure capsules function correctly and no unintended spoilers are revealed.

---

*Last updated: [Month, Year]*