#feature/reviews #doctype/template #status/approved

# Review Template: Spoiler-Tagged

**Objective:** To provide a clear structure for users to submit reviews that include spoilers, ensuring sensitive content is properly marked and hidden from general view.

---

This template is used for the public-facing review submission form, as detailed in [[beta-program/portal/feedback-form-spec]].

### 1. Headline (Required)

*   **Purpose:** A concise, engaging summary of the review.
*   **Constraint:** Max 80 characters.

### 2. Quick Take (Required)

*   **Purpose:** A brief, impactful statement of overall impression.
*   **Constraint:** 1-2 sentences.

### 3. Highlights (Required)

*   **Purpose:** To categorize the review's focus and highlight key strengths.
*   **Options (Select 2-3):**
    *   `Pacing`
    *   `Character Arcs`
    *   `Worldbuilding`
    *   `Clarity`
    *   `Continuity`
    *   `Emotional Impact`
    *   `Dialogue`

### 4. Rating (Required)

*   **Purpose:** A quantitative measure of satisfaction.
*   **Constraint:** 1-5 stars.

### 5. Detailed Feedback (Optional)

*   **Purpose:** To provide in-depth analysis, including plot points, marked as spoilers.
*   **Content:** This section will primarily contain content that is marked with [[spoilers/capsules-pattern|spoiler capsules]].

### 6. Spoiler-Specific Fields

*   **Major Moments (Optional):**
    *   **Purpose:** To highlight key plot points or revelations.
    *   **Constraint:** Must be placed within a spoiler capsule using the editor tool.

*   **Route Label (Optional):**
    *   **Purpose:** To indicate which narrative path the reviewer experienced.
    *   **Type:** Dropdown/selection from [[spoilers/labels/route-labels-placeholder|abstracted route labels]].

*   **Ending Type (Optional):**
    *   **Purpose:** To categorize the nature of the ending experienced.
    *   **Type:** Dropdown/selection from [[spoilers/labels/ending-tags|abstracted ending tags]].
    *   **Visibility:** This field may be hidden by default and only visible to users in `Full` spoiler mode or who own the relevant content.

---

*Last updated: [Month, Year]*