# Beta Portal: Feedback Form Specification v2.0

**Objective:** To define a single, unified feedback form that empowers beta readers to provide detailed feedback and correctly mark spoilers within a single interface.

---

### 1. Guiding Principle: Unified Submission

This form consolidates all feedback into one view. The beta reader is responsible for marking spoilers within their detailed review text using the provided tools. The system will then intelligently parse this structured data for both internal review and public display.

### 2. Form Layout & Fields

**Info Box (Top of Form):**
> **IMPORTANT: Your Public Review:** The `Rating`, `Headline`, `Quick Take`, `Highlights`, and the non-spoiler parts of your `Detailed Feedback` will be used to create your public review. **You are responsible for marking spoilers.** Use the `[+ Spoiler]` button in the text editor to hide any text that reveals major plot points. Your `Private Notes` will never be shown publicly.

**Public-Facing Fields:**

*   **Overall Rating (Required):** 1-5 star selector.
*   **Headline (Required):** Text input, max 80 characters.
*   **Quick Take (Required):** Text area, 1-2 sentences.
*   **Highlights (Required):** Checkbox group (select 2-3): `Pacing`, `Character Arcs`, `Worldbuilding`, `Clarity`, `Continuity`, `Emotional Impact`, `Dialogue`.

**Detailed Feedback (Public, with Spoiler Controls):**

*   **Field:** `Detailed Feedback`
*   **Type:** Rich Text Editor.
*   **Helper Text:** "What worked well and what could be improved? Please be specific and use the `[+ Spoiler]` button to hide plot-sensitive details."
*   **Spoiler Component Spec:** See Section 3 below.

**Internal-Only Fields:**

*   **Field:** `Private Notes to Author (Optional)`
*   **Type:** Simple text area.
*   **Helper Text:** "Have any sensitive feedback or thoughts that should NOT be made public under any circumstances? Add them here."

*   **Field:** `Typo/Grammar Fixes (Optional)`
*   **Type:** Simple text area.

---

### 3. Component Spec: The Spoiler Capsule Editor

This defines the functionality of the rich text editor for the `Detailed Feedback` field.

*   **UI:** The editor will feature a standard toolbar (Bold, Italic, Lists) and a prominent button labeled **`[+ Spoiler]`**.

*   **User Workflow:**
    1.  The beta reader writes their detailed review in the text box.
    2.  They highlight a portion of their text that contains a spoiler (e.g., "...when it's revealed that Kaelen was the traitor all along.").
    3.  They click the `[+ Spoiler]` button.
    4.  **In the Editor:** The highlighted text is immediately wrapped in a distinct visual block (e.g., a gray, shaded box with a "SPOILER" badge at the top). This gives them instant visual confirmation of what will be hidden.

*   **Data Output:** The editor must output structured content (e.g., HTML or Markdown). The spoiler capsule must be represented by a specific tag.
    *   **HTML Example:** `This part is public. <div class="spoiler-capsule">This part is a spoiler.</div>`
    *   **Markdown Example:** `This part is public. ||This part is a spoiler.||` (using a standard spoiler syntax).

*   **Public Conversion Logic:**
    *   When the user converts their beta feedback to a public review, the system will parse this structured text.
    *   Any content within the `<div class="spoiler-capsule">` or `||...||` tags will be automatically rendered on the live website as a collapsed, click-to-reveal UI element.
    *   All other text will be visible by default.

### 4. Submission & Confirmation

*   A single "Submit Feedback" button.
*   On success, a confirmation page appears: "Thank you! Your feedback has been submitted. You will be notified on launch day to publish your review."
