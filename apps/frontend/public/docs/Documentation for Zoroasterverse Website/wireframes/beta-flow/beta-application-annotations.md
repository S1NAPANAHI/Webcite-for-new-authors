#feature/beta-program #feature/design #doctype/spec #status/approved

# Annotated Wireframes — Beta Application Flow

**Objective:** To define the UI/UX for the beta application form, ensuring a clear, guided process for prospective beta readers.

---

This specification works in conjunction with [[beta-program/application-spec]].

### 1. Application Form (Stepper UI)

*   **Layout:** A multi-step form, ideally with a progress indicator (e.g., "Step 1 of 5").
*   **Navigation:** "Next" and "Back" buttons. "Next" should be disabled until all required fields on the current step are valid.

### 2. Step 1: Basics

*   **Fields:**
    *   Full name (required, text)
    *   Email (required, email format, unique validation)
    *   Country/Timezone (required, select)
    *   Reading speed (required, select: <2h/wk, 2–4h/wk, 5–7h/wk, 8h+)

### 3. Step 2: Experience

*   **Fields:**
    *   Prior beta experience (optional, multi-line text; encourage links/titles)
    *   Favorite genres (required, multi-select)
    *   Strengths (required, multi-select: plot, pacing, character, continuity, clarity, worldbuilding)

### 4. Step 3: Availability & Devices

*   **Fields:**
    *   Weekly availability during window (required, select: 2–3h, 4–6h, 7–10h, 10h+)
    *   Preferred formats (required, multi-select: EPUB, PDF)
    *   Primary device (optional, select: eReader, tablet, phone, desktop)

### 5. Step 4: Sample Feedback Task

*   **Prompt:** "Read this short excerpt (≈700–900 words). Answer 3 questions." (Excerpt displayed directly on the page or linked).
*   **Fields:**
    *   Q1: What worked best and why? (required, 100–300 words)
    *   Q2: What confused you and how would you clarify it? (required, 100–300 words)
    *   Q3: One actionable suggestion (required, 60–200 words)

### 6. Step 5: Consents

*   **Fields:**
    *   I consent to watermarked files (required, checkbox)
    *   I agree to sign the NDA if selected (required, checkbox)
    *   Optional: share device logs for QA (optional, checkbox)

### 7. Validation & Microcopy

*   **Validation:** Required fields enforced per step. Word-count hints/warnings for sample answers.
*   **Microcopy:**
    *   “Strong applications are specific and cite examples.”
    *   “Watermarked files are for your eyes only; leaks result in immediate revocation.” (See [[beta-program/anti-leak-measures]])

### 8. Post-Application States

*   **Confirmation Screen:** “Thanks! We’ll notify you by email.”
*   **Email Templates:** (See [[beta-program/emails]] for acceptance, waitlist, and reminder emails).

---

*Last updated: [Month, Year]*
