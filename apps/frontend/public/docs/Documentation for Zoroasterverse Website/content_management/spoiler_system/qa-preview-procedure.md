#feature/spoilers #doctype/sop #status/approved

# Spoiler System: QA Preview Procedure

**Objective:** To provide a step-by-step procedure for Quality Assurance (QA) personnel to verify the correct functioning of the spoiler system across all content, ensuring no unintended spoilers are revealed.

---

This procedure should be performed for all new or updated lore content before publishing.

### 1. Access the Content

1.  Navigate to the content item (e.g., Character page, Event entry, Glossary term) in the CMS preview environment.
2.  Ensure you have admin-level access that allows you to switch spoiler modes.

### 2. Preview in Minimal Mode

1.  Set the global spoiler toggle to `Minimal` mode (see [[modes-and-defaults]]).
2.  **Verify:**
    *   Only high-level, non-spoiler summaries are visible.
    *   All [[capsules-pattern|spoiler capsules]] are collapsed and hidden.
    *   No character names, event outcomes, or plot points that appear later in the series are visible.
    *   Internal links to spoiler-gated content are either disabled, blurred, or abstracted.
3.  **Action:** If any spoilers are visible, flag the content for revision by the author. Log the issue in the [[ops/qa-logs/spoiler-qa-log]].

### 3. Preview in Standard Mode

1.  Set the global spoiler toggle to `Standard` mode.
2.  **Simulate Ownership/Progress:** If the content has `OwnershipLocks` or `ProgressToggles`, simulate a user who owns/has completed the relevant `WorkID` (e.g., by temporarily assigning ownership in the preview environment).
3.  **Verify:**
    *   Content tied to owned/completed issues is revealed.
    *   Spoiler capsules for content *not* yet owned/completed remain hidden.
    *   No content from future issues or unread branches is visible.
    *   Internal links behave correctly based on ownership/progress.
4.  **Action:** If any issues are found, flag for revision and log in the [[ops/qa-logs/spoiler-qa-log]].

### 4. Preview in Full Mode

1.  Set the global spoiler toggle to `Full` mode.
2.  **Verify:**
    *   All content is visible, including major plot points, character fates, and route-specific details.
    *   All [[capsules-pattern|spoiler capsules]] are automatically expanded.
    *   All internal links are active and lead to the correct content.
3.  **Action:** If any content is still hidden or links are broken, flag for revision and log in the [[ops/qa-logs/spoiler-qa-log]].

### 5. Run Spoiler Lint

1.  Execute the [[spoiler-lint-rules]] tool on the content item.
2.  **Verify:** All lint warnings and errors are resolved.
3.  **Action:** If any lint issues remain, flag for revision and log in the [[ops/qa-logs/spoiler-qa-log]].

### 6. Sign-off

1.  Once all checks pass, mark the content as QA'd in the CMS.
2.  Record the QA sign-off in the [[ops/qa-logs/spoiler-qa-log]], including date and QA personnel.

---

*Last updated: [Month, Year]*