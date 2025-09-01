#feature/store #feature/operations #doctype/sop #status/approved

# Admin SOP: New Issue Release Checklist

**Objective:** To provide a step-by-step checklist for publishing a new issue of the Zoroasterverse series, ensuring all product, content, and announcement steps are completed.

---

This checklist should be used in conjunction with the [[ops/decisions-register]] and [[ops/kpis-and-analytics-spec]] for overall project management.

### Pre-release (T-14 to T-1 days)

1.  **Create Products in CMS:**
    *   [ ] Create Standard and Deluxe editions for the new issue.
    *   [ ] Set Formats: EPUB, PDF, MOBI.
    *   [ ] Set `PreorderMonth` placeholder; add `ReleaseDate` when finalized.
    *   [ ] Set price, regions (no exclusions), taxes, and coupons (if any).

2.  **Upload Assets:**
    *   [ ] Upload final EPUB, PDF, and MOBI files.
    *   [ ] Enable watermarking for all files, as per [[policies/copyright-and-licensing]].
    *   [ ] Record file sizes for Tech Specs on the product page.

3.  **Product Page Copy:**
    *   [ ] Paste short non-spoiler overview.
    *   [ ] Add Age Guidance (13+ recommended) and Content Warnings (editable set), as defined in [[policies/footer-snippets-and-product-bullets]].
    *   [ ] Add license bullets and 5-download note.

4.  **Beta Snapshot (if pre-release):**
    *   [ ] Enable "Beta Average Score" module on the product page.
    *   [ ] Confirm sample size "n" displays and has "Beta" label.
    *   [ ] Set tooltip copy for the Beta Average Score.

5.  **Store Linking:**
    *   [ ] Link bundle/season pages as needed.
    *   [ ] Add preorder badge and countdown.

6.  **Announcements:**
    *   [ ] Draft Release Post (non-spoiler).
    *   [ ] Prepare newsletter segment and scheduling.
    *   [ ] Prepare social media copy (optional).

7.  **QA:**
    *   [ ] Verify pricing currencies and tax display.
    *   [ ] Test product page in guest vs logged-in vs owner states.

### Release Day (T0)

1.  **Switch State:**
    *   [ ] Switch preorder to release state (auto or manual).
2.  **Verify Flows:**
    *   [ ] Verify purchase and download flows are working correctly.
3.  **Announce:**
    *   [ ] Send release newsletter; publish Release Post.
4.  **Monitor:**
    *   [ ] Monitor error logs and support inbox for the first 24 hours.

### Post-release (T+1 to T+7)

1.  **Review Module:**
    *   [ ] Switch Reviews module to Public Average default.
    *   [ ] Keep "Beta Snapshot" tab accessible for transparency.
2.  **Monitor Reviews:**
    *   [ ] Review early public reviews; moderate as needed, following [[reviews/moderation-guidelines]].

---

*Last updated: [Month, Year]*
