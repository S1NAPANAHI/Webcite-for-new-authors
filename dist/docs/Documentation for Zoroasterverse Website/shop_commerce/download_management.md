# Shop & Commerce: Download Management

This document consolidates the specifications and policies related to managing digital content downloads, including limits, reset procedures, and watermarking behavior.

---

## 1. Download Limits and Counters

**Objective:** To define the rules and technical specifications for managing download limits and displaying download counters to users, balancing convenience with anti-piracy measures.

### 1.1. Download Limit Rule

*   **Limit:** Each purchase grants the user a maximum of **5 downloads per format** for the purchased `WorkID` (e.g., 5 EPUB downloads, 5 PDF downloads, 5 MOBI downloads).
*   **Purpose:** To deter unauthorized sharing while allowing users flexibility for multiple devices or accidental deletions.

### 1.2. Download Counter Display

*   **Placement:** Counters will be displayed in the user's [[reader_experience/library_ux_spec|Library]] next to each downloadable format.
*   **Format:** `Download (X/5 used)` where X is the number of downloads already consumed for that format.
    *   **Example:** `EPUB Download (2/5 used)`
*   **Thresholds:**
    *   When `X < 5`: Display normally.
    *   When `X = 5`: Display `Download (0/5 remaining)` or `Downloads Exhausted`.

### 1.3. Counter Decrement Logic

*   **Trigger:** The counter decrements upon a successful download event.
*   **Definition of Successful Download:** A server-side confirmation that the file transfer has initiated and completed, or a reasonable timeout has passed.
*   **Error Handling:** Downloads that fail due to server errors or network interruptions should **not** decrement the counter. Client-side failures (e.g., user cancels download) should also ideally not decrement the counter, but this may require more complex client-side reporting.

### 1.4. Watermarking Integration

*   Each download will be uniquely watermarked with purchaser identifiers (e.g., email, order ID) as part of the [[shop_commerce/download_management#watermark-note-behavior|Watermark Note Behavior]] and [[community_engagement/beta_program/anti-leak-measures|anti-leak-measures]]. The download counter should only decrement after the watermarking process is successfully applied to the file.

---

## 2. Download Reset Policy

**Title:** Download Reset Policy

### 2.1. Standard Limits

Each purchase includes up to **5 downloads per format** (e.g., EPUB, PDF, MOBI), as detailed in our [[legal_policy/copyright_licensing|copyright and licensing]] policy.

### 2.2. When to Request a Reset

You may need a download reset if:

- You changed devices or reading apps multiple times
- A download was interrupted or corrupted
- You legitimately need additional downloads for personal use
- Technical issues prevented successful downloads

### 2.3. How to Request

Email **support@zoroasterverse.com** with the following information:

-   **Order ID** (found in your purchase confirmation email)
-   **The format(s) you need reset** (EPUB, PDF, MOBI, or all)
-   **A short note explaining why you need the reset**

We process reasonable requests within **2–3 business days**.

### 2.4. Important Notes

-   Excessive reset requests may be declined or investigated for potential abuse
-   Downloaded files may include purchaser-specific watermarking, as part of our [[community_engagement/beta_program/anti-leak-measures|anti-leak-measures]].
-   Resets are provided at our discretion for legitimate technical issues or device changes
-   This policy is designed to balance customer convenience with anti-piracy measures

### 2.5. Future Improvements

A self-serve reset request form may be added to streamline this process in future updates.

### 2.6. Contact Support

For questions about this policy or to request a reset:
**support@zoroasterverse.com**

---

## 3. Watermark Note Behavior

**Objective:** To define the display and behavior of watermark notices across the website, informing users about the anti-piracy measures in place for downloaded content.

### 3.1. Watermark Definition

*   **Purpose:** Digital files (EPUB, PDF, MOBI) downloaded from Zoroasterverse.com may include a unique, embedded watermark.
*   **Content:** This watermark typically includes the purchaser's email address and/or order ID, making the file traceable to its original download source.
*   **Type:** Watermarks can be visible (e.g., in the footer of each page in a PDF) or invisible (embedded in metadata or file structure).

### 3.2. Display Locations for Watermark Notes

*   **Product Pages:**
    *   **Placement:** As a bullet point under the purchase section (see [[reader_experience/microcopy/footer-snippets-and-product-bullets|footer-snippets-and-product-bullets]] for copy).
    *   **Copy:** "Watermarking for security"

*   **Library Page:**
    *   **Placement:** As a dismissible info banner at the top of the user's [[reader_experience/library_ux_spec|Library]] page.
    *   **Copy:** "Your files may include a purchaser-specific watermark. Download limits: 5 per format."

*   **Download Confirmation/Receipt UX:**
    *   **Placement:** On the download confirmation screen and within the email receipt.
    *   **Copy:** "Please note: Your downloaded files include a unique, purchaser-specific watermark for security purposes."

### 3.3. Behavior & Enforcement

*   **Non-Intrusive:** The visible watermark should be designed to be non-intrusive to the reading experience.
*   **Traceability:** The primary purpose is traceability in the event of unauthorized distribution.
*   **Legal Basis:** The use of watermarks is covered under the [[legal_policy/copyright_licensing|copyright and licensing]] and [[community_engagement/beta_program/beta-reader-policy-pre-nda|Beta Reader Policy]].

### 3.4. Admin Considerations

*   The CMS/download system must have the capability to apply unique watermarks to each file upon download request.
*   The system should log the watermarked file's unique ID and the associated user/order for forensic purposes.
