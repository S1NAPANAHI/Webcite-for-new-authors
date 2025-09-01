# Selection Algorithm

Outlines the step-by-step process to select beta readers and manage the waitlist.

# Phase 1: Pre-processing & Scoring

1.  **Initial Filtering:**
    *   `FILTER` all submissions to exclude any that are incomplete or where consent checkboxes were not ticked. 

2.  **Automated Scoring:**
    *   `FOR EACH` remaining application:
        *   Calculate `weighted_score` based on the criteria in `scoring-rubric-and-weights.md`.
        *   Store the `weighted_score` with the application record.

3.  **Initial Ranking:**
    *   `SORT` all applications in descending order by `weighted_score`. This creates the master ranked list.

---

# Phase 2: Intelligent Cohort Assembly (Slot-Filling Algorithm)

This phase ensures the final cohort is both high-quality (based on score) and diverse (based on quotas).

1.  **Define Quota Slots:**
    *   Based on `cohort-balancing-rules.md`, define the target number of slots for each diversity category (e.g., `target_newbies = 18`, `target_veterans = 42`, `target_us_timezone = 25`, etc.).

2.  **Iterative Slot-Filling:**
    *   Initialize an empty `final_cohort` list and a `waitlist`.
    *   `FOR EACH` application in the master ranked list (from top to bottom):
        *   **Check if Cohort is Full:**
            *   `IF` `final_cohort.size >= 60`, add the applicant to the `waitlist`.
            *   `ELSE`, proceed to evaluation.
        *   **Evaluate Diversity Contribution:**
            *   Check the applicant's attributes (device, timezone, experience).
            *   `IF` adding this applicant helps satisfy a needed diversity quota (e.g., `current_newbies < target_newbies`):
                *   Add the applicant to `final_cohort`.
                *   Decrement the relevant quota counters (e.g., `current_newbies++`).
            *   `ELSE IF` all quotas are already met OR the applicant doesn't fill a needed slot:
                *   Add the applicant to the `waitlist` to ensure the highest-scoring people who don't fit the diversity mix are still valued and kept warm.

3.  **Final Review & Waitlist Management:**
    *   The `final_cohort` list now contains a balanced group of high-scoring applicants.
    *   The `waitlist` contains high-scoring applicants who can be used to backfill any dropouts, prioritizing those who would fill a slot if one opens up.

---

### Rationale for this Algorithm

*   **Merit and Diversity:** This approach respects merit by always considering the highest-scored applicants first. However, it intelligently prioritizes those who also fulfill a diversity need, preventing the cohort from being filled with a monoculture of high-scorers with the same background.
*   **Efficiency:** It is a single-pass algorithm that is efficient to implement.
*   **Actionable:** This pseudo-code is detailed enough for a developer to build the selection tooling for the admin panel.

Edge Cases:
- If stacked rejections cause cohort holes, relax quotas in priority order: Diversity Mix → Device Mix → Timezone.
