 #feature/store #doctype/spec #status/approved

# Store: Edition and Format Matrix

**Objective:** To define the various editions and digital formats available for each issue, along with their associated features, limitations, and pricing considerations.

---

This matrix should be used in conjunction with the [[product-page-spec]] and [[content-inventory/templates/works-and-editions]] for product setup.

### 1. Editions

*   **Standard Edition:**
    *   **Content:** Core narrative text of the issue.
    *   **Formats:** EPUB, PDF, MOBI.
    *   **Pricing:** Base price for the issue.

*   **Deluxe Edition:**
    *   **Content:** Core narrative text + additional digital extras.
    *   **Formats:** EPUB, PDF, MOBI (for core text), plus separate files for extras (e.g., PDF for concept art, MP3 for soundtrack links).
    *   **Extras Examples:** Concept art, author annotations, deleted scenes, soundtrack links, character sketches.
    *   **Pricing:** Higher price than Standard Edition, reflecting added value.

*   **Bundle/Season Pass:**
    *   **Content:** Multiple issues grouped together (e.g., all issues in a season).
    *   **Formats:** EPUB, PDF, MOBI for each included issue.
    *   **Pricing:** Discounted price compared to buying individual issues, as outlined in [[subscription-model-mvp]].

### 2. Digital Formats

*   **EPUB (.epub):**
    *   **Description:** Reflowable format, ideal for e-readers (Kindle, Kobo, Nook) and reading apps. Text adjusts to screen size.
    *   **Pros:** Best reading experience on most devices, supports dynamic text sizing.
    *   **Cons:** Limited control over complex layouts.

*   **PDF (.pdf):**
    *   **Description:** Fixed-layout format, preserves original design and typography. Good for print-like experience.
    *   **Pros:** Ideal for graphic-heavy content, consistent across devices.
    *   **Cons:** Less adaptable to small screens, may require zooming.

*   **MOBI (.mobi):**
    *   **Description:** Amazon's proprietary format, primarily for older Kindle devices.
    *   **Pros:** Direct compatibility with older Kindles.
    *   **Cons:** Being phased out by Amazon in favor of EPUB.

### 3. Format-Specific Considerations

*   **Watermarking:** All formats will support watermarking as per [[watermark-note-behavior]] and [[policies/copyright-and-licensing]].
*   **Download Limits:** All formats are subject to the [[download-limits-and-counters]] policy.
*   **Extras Delivery:** Deluxe edition extras will be delivered as separate files (e.g., PDF, JPG, MP3) alongside the core ebook files.

---

*Last updated: [Month, Year]*