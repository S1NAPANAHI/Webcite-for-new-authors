#feature/beta-program #feature/operations #doctype/sop #status/approved

# Admin SOP: Score and Select Cohort (One-Pager)

**Objective:** To provide a high-level overview of the process for scoring beta applications and selecting the final cohort, ensuring a balanced and high-quality group of readers.

---

This one-pager summarizes the detailed steps found in the [[beta-program/selection-algorithm]] and [[beta-program/scoring-rubric-and-weights]].

### 1. Application Review & Scoring

*   **Review Applications:** Access submitted applications in the admin panel.
*   **Apply Rubric:** For each application, score against the defined criteria (Analytical Depth, Reliability, Communication Tone, Genre Fit, Diversity Mix).
*   **Calculate Weighted Score:** Use the specified weights to calculate a total weighted score for each applicant.
*   **Initial Ranking:** Automatically rank all applicants from highest to lowest weighted score.

### 2. Cohort Selection

*   **Define Quotas:** Based on the [[beta-program/cohort-balancing-rules]], identify the target number of readers for each diversity category (e.g., device type, timezone, experience level).
*   **Iterative Selection:** Go through the ranked list of applicants, prioritizing those who:
    1.  Have the highest weighted score.
    2.  Help fulfill an unmet diversity quota.
*   **Fill Slots:** Add applicants to the cohort until the target cohort size is reached, ensuring diversity targets are met as much as possible.

### 3. Waitlist Management

*   **Create Waitlist:** After the main cohort is selected, the next highest-scoring applicants (who didn't fit the immediate diversity needs) are placed on a waitlist.
*   **Backfill:** If a selected beta reader drops out or fails to sign the NDA, invite the next suitable applicant from the waitlist to fill the vacant slot, prioritizing those who help maintain cohort balance.

### 4. Notification

*   **Acceptance:** Send acceptance emails to the selected cohort members.
*   **Waitlist:** Send waitlist emails to those placed on the waitlist.
*   **Rejection:** Send rejection emails to applicants not selected (optional, but good practice).

---

*Last updated: [Month, Year]*
