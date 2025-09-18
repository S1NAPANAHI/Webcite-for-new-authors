#feature/beta-program #feature/design #doctype/spec #status/approved

# Annotated Wireframes — NDA Flow

**Objective:** To define the user experience (UX) for the Non-Disclosure Agreement (NDA) signing process, ensuring legal compliance and a clear understanding of confidentiality obligations.

---

This specification works in conjunction with [[policies/beta-reader-policy-pre-nda]] and [[beta-program/anti-leak-measures]].

### 1. NDA Invitation Screen

*   **Trigger:** After a beta applicant has been accepted into a cohort.
*   **Elements:**
    *   **Header:** "Congratulations! You're In!"
    *   **Body Text:** "To access the beta content, you must first sign our Non-Disclosure Agreement (NDA). This protects the unreleased material."
    *   **Key Terms Summary:** A concise, bulleted list of the most critical NDA terms (e.g., "Content is confidential," "No sharing or distribution," "Watermarked files").
    *   **CTA:** "Review and Sign NDA"

### 2. NDA Review & E-Signature Screen

*   **Elements:**
    *   **Full NDA Text:** Display the complete, legally binding NDA text. This should be scrollable.
    *   **Checkboxes:**
        *   "I have read and understand the terms of the NDA."
        *   "I agree to the terms of the NDA."
    *   **E-Signature Field:** A field for the user to type their full legal name, which serves as their electronic signature.
    *   **Date/Timestamp:** Automatically populated upon signature.
    *   **CTA:** "Sign NDA" (disabled until checkboxes are ticked and name is entered).

### 3. Confirmation Screen

*   **Elements:**
    *   **Header:** "NDA Signed! Access Granted."
    *   **Body Text:** "Thank you for signing the NDA. You now have access to the beta content. Your reading window begins [Start Date] and feedback is due by [End Date]."
    *   **Next Steps:**
        *   Link to the beta portal.
        *   Link to the [[beta-program/beta-reader-handbook]].
    *   **Confirmation Email:** A note that a copy of the signed NDA has been sent to their registered email address.

### 4. Error States

*   **Validation Errors:** Clear messages if required fields are not completed.
*   **Technical Errors:** Graceful handling of submission failures.

---

*Last updated: [Month, Year]*
