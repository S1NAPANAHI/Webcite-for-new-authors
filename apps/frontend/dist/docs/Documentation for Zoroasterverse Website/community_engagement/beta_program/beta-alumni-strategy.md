# Beta Program: Alumni & Retention Strategy

**Objective:** To create a system that recognizes and retains high-quality beta readers, turning them into a long-term community asset rather than a single-cycle resource.

---

### 1. The Problem

Standard beta programs are transactional: a user gives feedback in exchange for early access. Once the cycle is over, the relationship lies dormant until the next call for applications. This risks losing valuable, trained readers who understand the project's needs.

### 2. The Solution: A Tiered Alumni System

We will introduce a simple tier system based on participation, with increasing rewards to foster loyalty and continued engagement.

*   **Tier 1: Beta Reader (Active)**
    *   **Who:** Any reader currently active in a beta cycle.
    *   **Access:** Standard beta access (watermarked files, portal).

*   **Tier 2: Beta Alumni**
    *   **Who:** Any reader who has successfully completed **one or more** beta cycles (i.e., submitted feedback and converted their review).
    *   **Benefits:**
        *   **Priority Selection:** Guaranteed a spot in the next beta cycle they apply for, bypassing the scoring process (provided they are in good standing).
        *   **Private Forum/Discord Access:** A dedicated channel for alumni to discuss the series with other dedicated fans and have more direct interaction with the author/team between cycles.
        *   **"Beta Alumni" Profile Badge:** A permanent badge on their website profile.

*   **Tier 3: Veteran Reader**
    *   **Who:** Any reader who has successfully completed **three or more** beta cycles.
    *   **Benefits:** All Alumni benefits, plus:
        *   **Early Access to Betas:** Invited to a "Week 0" pre-beta, getting access to materials a week before the general beta cohort to spot major issues.
        *   **Credit Mention:** An optional acknowledgment on a "Special Thanks" page on the website.
        *   **"Veteran Reader" Profile Badge:** An upgraded, more distinguished profile badge.

### 3. Engagement Tactics Between Cycles

*   **Exclusive Dev-Logs:** Post short, exclusive updates on story development or worldbuilding concepts to the private Alumni channel.
*   **Polls & Quick Feedback:** Use the alumni group as a trusted sounding board for small ideas, like character names or cover art directions.
*   **Direct Recognition:** Publicly thank a "Reader of the Month" in the newsletter or on social media (with their permission).

### 4. Implementation Plan

*   **Database:** The `Users` table should have a field for `beta_cycles_completed` (integer) and `beta_status` (enum: `none`, `active`, `alumni`, `veteran`, `on_strike`).
*   **Admin Panel:** The beta management dashboard should clearly show these statuses for each applicant.
*   **Automation:** When a beta cycle is successfully completed, a script should increment the `beta_cycles_completed` count for all compliant participants and update their `beta_status` accordingly.
