#feature/reviews #doctype/guide #status/approved

# Review Moderation Guidelines

**Objective:** To provide clear rules and workflows for moderating user-submitted reviews, ensuring a fair, respectful, and useful review section for all users.

---

These guidelines are to be used in conjunction with the broader [[policies/reviews-and-community-guidelines]].

### 1. Intake and Auto-Processing

*   **Auto-Spoiler Detection:** The system will attempt to auto-detect potential spoilers in non-spoiler fields and offer to wrap them in a spoiler capsule. If the user declines, the review may be flagged for manual moderation.
*   **Flagging:** Reviews can be flagged by other users (via an in-page report function) or by automated systems (e.g., profanity filters).
*   **Queueing:** Flagged reviews are sent to a moderation queue with a reason (e.g., `spoiler`, `abuse`, `off-topic`, `spam`).

### 2. Moderator Actions

For each review in the queue, a moderator can take the following actions:

*   **Approve:** The review meets all guidelines and is published as-is.
*   **Edit (Light):** For minor issues (e.g., a forgotten spoiler tag, a slightly off-topic sentence).
    *   Moderator can redact specific words/phrases or move content into a spoiler capsule.
    *   The reviewer should be notified of the edit and the reason.
*   **Reject:** For clear policy breaches (e.g., hate speech, severe abuse, spam).
    *   The reviewer should be notified of the rejection with a brief rationale and a link to the relevant guideline.
    *   Rejected reviews are not published.

### 3. Sorting and Display in Moderation Queue

*   **Default Sort:** By submission date (newest first).
*   **Filters:** By flag reason (e.g., show only `abuse` flags).

### 4. Badges and Labels

*   **"Verified Purchase"**: Automatically applied to reviews from users who own the product, as per [[verified-purchase-rules]].
*   **"Beta" Label**: Pre-release reviews from beta readers will be clearly labeled "Beta" and contribute to the [[aggregates-and-beta-snapshot|Beta Average Score]].

### 5. Escalation & Enforcement

*   **Repeat Violations:** Users with repeated policy breaches will receive warnings. Severe or persistent violations can lead to content removal and account restrictions, as outlined in the [[policies/reviews-and-community-guidelines]].
*   **Appeals:** Reviewers can appeal a moderation decision by replying to the notification email. Appeals should be reviewed within 7 business days.

### 6. Reporting and Metrics

*   **Moderation Log:** All moderation actions (approve, edit, reject) should be logged, including moderator ID, timestamp, and reason. This log contributes to the [[ops/qa-logs/review-moderation-log]].
*   **KPIs:** Key metrics to track include:
    *   Number of reviews submitted vs. published.
    *   Average time to moderate a review.
    *   Breakdown of rejection reasons.

---

*Last updated: [Month, Year]*