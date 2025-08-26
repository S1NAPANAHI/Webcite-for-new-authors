#feature/beta-program #feature/operations #doctype/sop #status/approved

# Admin SOP: Respond to Breaches and Revocations (Beta Program)

**Objective:** To provide a clear, step-by-step protocol for responding to confirmed breaches of the Beta Reader Policy or NDA, and for revoking beta access.

---

This SOP is critical for maintaining the integrity of the [[beta-program]] and protecting intellectual property, as outlined in [[anti-leak-measures]].

### 1. Confirming a Breach

1.  **Evidence Collection:** Gather all available evidence of the breach (e.g., screenshots of leaked content, logs of suspicious download activity, reports from other beta readers).
2.  **Source Identification:** If the breach involves leaked content, use forensic watermarking (visible and invisible) to identify the specific beta reader responsible.
3.  **Verification:** Cross-reference the identified source with the beta reader database to confirm the user's identity and participation status.

### 2. Immediate Access Revocation

Once a breach is confirmed and attributed:

1.  **Disable Account Access:** Immediately revoke all beta access for the identified user. This includes:
    *   Disabling their access to the beta portal.
    *   Invalidating any active download links for beta content.
    *   Removing them from any beta-specific communication lists.
2.  **Update Status:** Mark the user's status in the beta program database as `Revoked` or `On Strike` (depending on severity).

### 3. Communication Protocol

1.  **Internal Notification:** Inform relevant internal stakeholders (e.g., project lead, legal counsel) of the breach and the action taken.
2.  **External Notification (to Breaching Party):**
    *   Send the `Revocation` email template (see [[beta-program/emails/revocation.txt]]) to the user.
    *   The email should briefly state the reason for revocation (e.g., "due to a policy/NDA violation") and mention that this may affect eligibility for future cycles.
    *   If the NDA includes a liquidated damages clause, legal counsel should follow up with a formal notice.

### 4. Damage Control (If Public Leak)

If the breach has resulted in a public leak:

1.  **Do NOT Engage Directly:** Avoid direct confrontation or public accusations on social media or forums.
2.  **Prepare Public Statement:** Have a pre-approved, calm, and professional public statement ready. This statement should:
    *   Acknowledge that pre-release content has been shared without authorization.
    *   Reiterate the importance of respecting intellectual property and the beta process.
    *   Emphasize that the leaked content is a draft and the final version may differ.
    *   Avoid naming the individual responsible.
3.  **Reinforce Policy:** Use the incident as an opportunity to remind the wider community of the [[policies/reviews-and-community-guidelines|community guidelines]] and the value of the beta program.

### 5. Logging

*   All breach confirmations, revocation actions, and communications should be logged in the [[ops/qa-logs/review-moderation-log|QA logs]] for future reference and legal purposes.

---

*Last updated: [Month, Year]*
