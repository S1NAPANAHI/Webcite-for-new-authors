#feature/spoilers #doctype/spec #status/approved

# Spoiler System: Modes and Defaults

**Objective:** To define the global spoiler modes and their default application across the Zoroasterverse website, ensuring a controlled and user-configurable content experience.

---

### 1. Global Spoiler Modes

There are three primary spoiler modes that govern content visibility:

*   **Minimal Mode:**
    *   **Purpose:** Provides a high-level overview, hiding all major plot points, character fates, and route-specific details.
    *   **Content Display:** Only non-spoiler summaries are visible. All [[capsules-pattern|spoiler capsules]] are hidden.
    *   **Target Audience:** New visitors, casual readers, or users who want to avoid any potential spoilers.

*   **Standard Mode:**
    *   **Purpose:** Reveals content that the user has already encountered or is entitled to see based on their progress.
    *   **Content Display:** Shows details for content tied to owned and completed issues. Spoiler capsules for unread content remain hidden.
    *   **Target Audience:** Logged-in users who own content and are progressing through the series.

*   **Full Mode:**
    *   **Purpose:** Reveals all canon content, including major plot points, character fates, and details about all routes and endings.
    *   **Content Display:** All content is visible. Spoiler capsules are automatically expanded.
    *   **Target Audience:** Users who have completed the series, deep-lore enthusiasts, or those who explicitly opt-in to see all information.

### 2. Default Mode Application

*   **Guests (Non-Logged-In Users):** Default to **Minimal Mode**.
*   **Logged-In Non-Owners:** Default to **Minimal Mode**.
*   **Owners (Logged-In Users with Purchased Content):** Default to **Standard Mode**.

### 3. User Controls

*   **Global Toggle:** A persistent spoiler mode toggle will be available in the site header, allowing users to switch between `Minimal`, `Standard`, and `Full` modes at any time.
*   **Per-Page Override:** On content pages (e.g., [[wireframes/character/character-annotations|Character Pages]], [[wireframes/event/event-annotations|Event Pages]]), a control will allow users to temporarily elevate or reduce the spoiler exposure for that specific page.

### 4. Content Gating & Unlocks

*   **Ownership-Aware:** Content tagged with `OwnershipLocks` will only reveal in `Standard` mode if the user owns the corresponding `WorkID` (e.g., an event from Issue 3 will only show details in Standard mode if the user owns Issue 3).
*   **Progress-Based:** Users can mark issues as "finished" in their [[store-library/library-ux-spec|Library]]. This action can unlock deeper spoiler content across the site, even if they don't own subsequent issues.

### 5. Admin Workflow & QA

*   Content authors must tag all content with appropriate `SpoilerSeverity` (Low/Medium/High) and `OwnershipLocks`.
*   Admins can preview content in all three modes before publishing to ensure no unintended spoilers are revealed, as detailed in [[qa-preview-procedure]].

---

*Last updated: [Month, Year]*