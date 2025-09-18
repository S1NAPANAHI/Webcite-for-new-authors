# Beta Portal: Feedback Form Specification

**Objective:** To define the structure and fields of the primary feedback form for beta readers.

---

### 1. Form Structure

The form should be presented as a single, clean page within the authenticated beta portal.

### 2. Form Fields

*   **Overall Rating (Required):**
    *   **Type:** 1-5 star selector.

*   **Headline (Required):**
    *   **Type:** Text input.
    *   **Constraint:** Max 80 characters.
    *   **Helper Text:** "Summarize your core feedback in a punchy headline."

*   **Quick Take (Required):**
    *   **Type:** Text area.
    *   **Constraint:** 1-2 sentences.
    *   **Helper Text:** "If you could only say one thing, what would it be?"

*   **Highlights (Required):**
    *   **Type:** Checkbox group (select 2-3).
    *   **Options:** `Pacing`, `Character Arcs`, `Worldbuilding`, `Clarity`, `Continuity`, `Emotional Impact`, `Dialogue`.

*   **Detailed Feedback - Strengths (Required):**
    *   **Type:** Rich text area.
    *   **Helper Text:** "What worked best for you and why? Please provide specific examples."

*   **Detailed Feedback - Opportunities (Required):**
    *   **Type:** Rich text area.
    *   **Helper Text:** "Where were you confused, or what felt like it could be improved? Please be specific."

*   **Spoiler-Specific Notes (Optional):**
    *   **Type:** Rich text area, clearly marked with a spoiler icon.
    *   **Helper Text:** "Place any thoughts that contain major spoilers here. This section will NOT be made public."

*   **Typo/Grammar Fixes (Optional):**
    *   **Type:** Simple text area.
    *   **Helper Text:** "Found any typos? Paste the sentence and the correction here."

### 3. Note on Public Conversion

A clear, non-dismissible info box must be present at the top of the form:

> **IMPORTANT:** The `Rating`, `Headline`, `Quick Take`, and `Highlights` you provide here will be used to pre-populate your public review on launch day. Please write them with a general audience in mind. Your detailed feedback and spoiler notes will always remain private.

### 4. Submission

*   A single "Submit Feedback" button.
*   Upon successful submission, the user should be redirected to a "Thank You" page that confirms their feedback has been received and reminds them of the launch day conversion task.
