# Beta Program: Metrics & Admin Dashboards Spec

**Objective:** To define the specific visual components and data points for an admin-facing dashboard, enabling at-a-glance monitoring of the beta program's health and effectiveness.

This spec builds on the KPIs defined in `/ops/kpis-and-analytics-spec.md`.

---

### Admin Dashboard: "Beta Program Health"

The dashboard should be organized into three sections corresponding to the main phases of a beta cycle.

### Section 1: Application & Selection Funnel

This section tracks the pipeline of incoming applicants.

*   **Component 1: Application Funnel Chart**
    *   **Type:** A vertical funnel chart.
    *   **Stages:**
        1.  `Applications Started` (e.g., 250)
        2.  `Applications Completed` (e.g., 180)
        3.  `Scored & Ranked` (e.g., 180)
        4.  `Accepted into Cohort` (e.g., 60)
        5.  `Waitlisted` (e.g., 40)
    *   **Purpose:** Instantly shows where drop-off occurs. A large drop between Started and Completed might indicate the application is too long or has technical issues.

*   **Component 2: Final Cohort Diversity**
    *   **Type:** A set of three donut charts.
    *   **Charts:**
        1.  **Device Mix:** Slices for `eReader`, `Tablet`, `Phone`, `Desktop`.
        2.  **Timezone Mix:** Slices for `Americas`, `Europe/Africa`, `Asia/Oceania`.
        3.  **Experience Mix:** Slices for `First-Time Reader`, `Experienced Reader`.
    *   **Purpose:** Provides a clear, visual confirmation that cohort balancing goals were met.

### Section 2: In-Cycle Engagement

This section monitors the activity of the cohort during the reading and review window.

*   **Component 1: Feedback Submission Rate**
    *   **Type:** A single, large percentage gauge.
    *   **Metric:** `(Number of feedback forms submitted) / (Cohort Size)`.
    *   **Example:** `95%` (57/60).
    *   **Purpose:** The single most important metric for cycle health. A low rate indicates a problem with the cohort or the process.

*   **Component 2: Submission Timeline**
    *   **Type:** A line graph showing submissions over time.
    *   **X-Axis:** The 7 days of the review window.
    *   **Y-Axis:** Cumulative number of submissions.
    *   **Purpose:** Shows submission patterns. A huge spike on the last day suggests the review window could be shortened or that reminders are only effective at the last minute.

### Section 3: Post-Cycle Conversion & Health

This section tracks the long-term value and health of the beta community.

*   **Component 1: Public Review Conversion Rate**
    *   **Type:** A simple bar chart.
    *   **Bars:**
        *   `Converted within 24h`
        *   `Converted within 72h`
        *   `Not Converted`
    *   **Purpose:** Measures how effectively the beta obligation is being met, a key indicator of reader commitment.

*   **Component 2: Alumni Tier Distribution**
    *   **Type:** A horizontal bar chart showing the current state of the entire beta community.
    *   **Bars:**
        *   `Veteran Readers` (e.g., 15)
        *   `Beta Alumni` (e.g., 85)
        *   `On Strike / Inactive` (e.g., 5)
    *   **Purpose:** Visualizes the long-term health and retention of the beta program.
