# Beta Program Kit

#feature/beta-program #doctype/index #status/approved

# Beta Program Directory

This folder contains all artifacts for end-to-end beta program operations, including application specs, scoring, communications, timeline, anti-leak measures, and metrics.

---

### Key Documents

**Core Strategy & Guides:**
*   [[beta-reader-handbook]] - The single source of truth for beta readers.
*   [[beta-alumni-strategy]] - The plan for long-term community retention.
*   [[anti-leak-measures]] - The multi-layered strategy for protecting IP.

**Operational Specs:**
*   [[application-spec]] - The specification for the beta application form.
*   [[scoring-rubric-and-weights]] - Defines how applicants are scored.
*   [[selection-algorithm]] - The detailed logic for how the final cohort is chosen.
*   [[cohort-balancing-rules]] - The diversity quotas for a balanced cohort.
*   [[operational-timeline]] - The detailed schedule for each phase of a beta cycle.

**Portal & Forms:**
*   [[portal/feedback-form-spec]] - The spec for the main feedback form.
*   [[portal/conversion-form-spec]] - The spec for converting beta feedback to a public review.

**Metrics:**
*   [[metrics-and-dashboards]] - Defines the KPIs and dashboard visuals for managing the program.

### Related Documents

*   [[sops/beta-cycle-checklist]] - The step-by-step checklist for running a beta cycle.
*   [[policies/beta-reader-policy-pre-nda]] - The public-facing summary of the beta policy.
*   [[reviews/aggregates-and-beta-snapshot]] - Defines how beta reviews contribute to the site's scoring.


Structure:

- _README.md: Overview of the beta program kit.
- application-spec.md: Field definitions, validation, and storage for beta applications.
- scoring-rubric-and-weights.md: Criteria definitions and weightings for scoring applications.
- cohort-balancing-rules.md: Rules and quotas to ensure diverse and balanced cohorts.
- selection-algorithm.md: Step-by-step candidate selection and waitlist logic.
- operational-timeline.md: Detailed schedule for each phase of the beta cycle.
- /emails: Paste-ready email templates for acceptance, waitlist, reminders, revocation, and launch-day conversion.
  - acceptance.txt
  - waitlist.txt
  - reading-reminder.txt
  - review-reminder.txt
  - revocation.txt
  - launchday-conversion.txt
- /portal: Specifications for portal forms.
  - feedback-form-spec.md
  - conversion-form-spec.md
- anti-leak-measures.md: Operational guidelines to prevent unauthorized leaks.
- metrics-and-dashboards.md: Definitions of KPIs and admin views for monitoring program health.

Purpose:
Provides a comprehensive, modular set of artifacts to operationalize the beta reader program with consistency and scalability.