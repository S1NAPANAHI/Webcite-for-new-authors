# Application Specification

Defines fields, validation rules, and storage structure for beta program applications.

## Sections and Fields

### Basics
- `full_name` (string, required): Applicant’s legal name.
- `email` (string, required, unique, valid email format): Contact and login identifier.
- `country` (string, required): Dropdown of countries.
- `timezone` (string, required): Dropdown matching country selection.
- `reading_speed` (string, required): Options: `<2h/wk`, `2–4h/wk`, `5–7h/wk`, `8h+`.

### Experience
- `beta_experience` (text, optional): Past beta reading details (titles/links).
- `favorite_genres` (array<string>, required): Multi-select list of genres.
- `strengths` (array<string>, required): Multi-select: `plot`, `pacing`, `character`, `continuity`, `clarity`, `worldbuilding`.

### Availability & Devices
- `availability_hours` (string, required): Select: `2–3h`, `4–6h`, `7–10h`, `10h+` per week.
- `preferred_formats` (array<string>, required): Multi-select: `EPUB`, `PDF`.
- `primary_device` (string, optional): Select: `eReader`, `Tablet`, `Phone`, `Desktop`.

### Sample Feedback Task
- `excerpts_choice` (string, system-provided excerpt). 
- `q1` (text, required, 100–300 words): What worked best and why?
- `q2` (text, required, 100–300 words): What confused you and how to clarify?
- `q3` (text, required, 60–200 words): One actionable suggestion.

### Consents
- `consent_watermark` (boolean, required): Agree to receive watermarked files.
- `consent_nda` (boolean, required): Agree to sign NDA if selected.
- `consent_logs` (boolean, optional): Agree to share device logs for QA.

## Validation Rules
- Required fields must be non-empty.
- Email must be unique.
- Word-count constraints enforced on Q1–Q3.

## Storage Model
- Store as `BetaApplication` entity:
  - Fields: as above, plus `status` (`submitted`,`shortlisted`,`accepted`,`waitlist`,`rejected`), timestamps (`submitted_at`,`updated_at`).
