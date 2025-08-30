#feature/reviews #feature/design #doctype/spec #status/approved

# Annotated Wireframes — Review Submission

**Objective:** To define the UI/UX for the review submission form, ensuring a clear and guided process for users to provide feedback, including proper spoiler marking.

---

This specification works in conjunction with [[beta-program/portal/feedback-form-spec]] and [[reviews/templates/review-template-spoiler-tagged]].

### 1. Template Selection (If Applicable)

*   **Trigger:** If the user is given a choice (e.g., beta reader converting to public review).
*   **Elements:**
    *   Radio button choice: "Spoiler-free" vs "Spoiler-tagged"
    *   Description text under each option.
    *   Template preview on selection.

### 2. Common Fields (Both Templates)

*   **Headline (Required):**
    *   Text input with character counter (max 80 characters).
    *   Real-time validation.
*   **Quick Take (Required):**
    *   Text area (1–2 sentences).
    *   Helper text: "Sum up your reaction in a sentence or two."
*   **Rating (Required):**
    *   1–5 star interface.
    *   Hover states and click feedback.
*   **Highlights tags (Required):**
    *   Checkboxes: `Pacing`, `Character`, `Worldbuilding`, `Clarity`, `Emotional Impact`.
    *   Minimum/maximum selection enforcement.

### 3. Detailed Feedback (Unified Editor)

*   **Field:** `Detailed Feedback`
*   **Type:** Rich Text Editor.
*   **Toolbar:** Standard formatting (Bold, Italic, Lists) plus a prominent **`[+ Spoiler]`** button.
*   **Spoiler Marking:** User highlights text and clicks `[+ Spoiler]` to wrap it in a visual spoiler capsule within the editor (see [[spoilers/capsules-pattern]] for behavior).

### 4. Spoiler-Tagged Additional Fields (If Applicable)

*   **Major Moments (Optional):**
    *   Expandable text area.
    *   Content will be wrapped in a spoiler capsule automatically.
*   **Route Label (Optional):**
    *   Dropdown of [[spoilers/labels/route-labels-placeholder|abstracted route labels]].
*   **Ending Type (Optional):**
    *   Dropdown of [[spoilers/labels/ending-tags|abstracted ending tags]].
    *   Visibility: Hidden unless `Full` spoiler mode or owner.

### 5. Auto-Spoiler Detection

*   **Warning Banner:** "We found potential spoilers. Move them into the spoiler section?"
*   **Functionality:** Non-blocking notification with suggested fixes. One-click move to spoiler fields.

### 6. Review Guidelines Sidebar

*   **Content:** "Writing great reviews" tips, spoiler tag etiquette, examples of constructive feedback.
*   **Link:** To full [[policies/reviews-and-community-guidelines|community guidelines]].

### 7. Submission States

*   **Draft Auto-Save:** With timestamp.
*   **Validation Errors:** Highlighted in red.
*   **Success Confirmation:** After submission.
*   **Status Display:** "Awaiting moderation" status display.

### 8. Preview Mode

*   Toggle to preview how review will appear.
*   Shows spoiler capsule behavior.
*   Route label and tag display.
*   Rating and verification badge preview.

### 9. User Context

*   **Verified Purchase** badge indication (see [[reviews/verified-purchase-rules]]).
*   Edition owned (Standard/Deluxe) auto-detection.
*   Beta reviewer special instructions.
*   Guest user account creation prompt.

---

*Last updated: [Month, Year]*
