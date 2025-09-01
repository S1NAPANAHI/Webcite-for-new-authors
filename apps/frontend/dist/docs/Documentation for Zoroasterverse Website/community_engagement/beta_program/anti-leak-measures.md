# Beta Program: Anti-Leak Strategy & Protocol

**Objective:** To establish a robust, multi-layered strategy to deter, detect, and respond to unauthorized leaks of beta content.

---

This strategy is built on four layers: Technical Prevention, Legal Deterrents, Community Trust, and a Response Protocol.

### 1. Technical Prevention Measures

These measures are designed to make leaking difficult and traceable.

*   **Forensic Watermarking:**
    *   **Visible Watermark:** A subtle, semi-transparent footer on each page of a PDF/EPUB file containing the beta reader's email address and a unique ID (e.g., `beta-s1-i1-username@email.com`).
    *   **Invisible Watermark (Steganography):** Embed the same unique ID within the file's metadata or as a pattern of near-invisible pixels. This survives screenshots and file conversions, providing definitive proof of the source of a leak.

*   **Portal-Only Access for Sensitive Content:**
    *   The most critical chapters (e.g., the final 20% of an issue) will **not** be available for download.
    *   This content must be read exclusively through the secure, authenticated web portal, which will have copy/paste and right-click functionality disabled.

*   **Access Logging & Anomaly Detection:**
    *   Log all access events for beta content, including timestamp, IP address, device user agent, and action (e.g., `portal_read_chapter_10`, `download_epub`).
    *   Implement automated alerts for suspicious activity, such as:
        *   Excessive downloads of the same file in a short period.
        *   Logins from multiple, geographically distant IP addresses for the same account within hours.
        *   Attempts to access content outside of the authorized beta period.

### 2. Legal Deterrents

These measures ensure there are clear and significant consequences for breaking the rules.

*   **Non-Disclosure Agreement (NDA):**
    *   The NDA is not just a formality. It must be a legally binding e-signature document.
    *   It must explicitly state that beta content is confidential and proprietary intellectual property.
    *   **Liquidated Damages Clause:** Include a clause specifying that a leak causes significant, hard-to-quantify damages and that the beta reader agrees to a pre-determined financial penalty (e.g., $1,000 USD) in the event of a confirmed breach. This makes the consequence clear and tangible.

### 3. Community & Social Trust

A community that feels valued is less likely to leak content.

*   **Reinforce Trust:** Use the strategies in `beta-alumni-strategy.md` to build a community of trusted insiders who feel a sense of ownership and pride in the project.
*   **Clear Communication:** The onboarding process and emails must clearly, but respectfully, state the importance of confidentiality and the consequences of leaks.
*   **Gratitude:** Publicly and privately thank beta readers for their contribution, reinforcing their role as valued partners.

### 4. Leak Response Protocol

If a leak is suspected or confirmed, follow this protocol swiftly and without deviation.

*   **Step 1: Verification (Internal):**
    *   Immediately analyze the leaked content (e.g., a screenshot posted online) to identify the watermark. Use forensic tools if necessary.
    *   Cross-reference the unique ID with the beta reader database to confirm the source.

*   **Step 2: Immediate Access Revocation:**
    *   Once the source is confirmed, immediately revoke all beta access for that user account. This includes portal access and download links.

*   **Step 3: Formal Communication:**
    *   Send the `Revocation` email template to the user, formally notifying them of the breach and the action taken.
    *   If the NDA includes a damages clause, this email should be followed by a formal notice from `legal@zoroasterverse.com`.

*   **Step 4: Damage Control (Public):**
    *   Do not engage with the leak directly on social media.
    *   Have a pre-written public statement ready that is calm and professional. It should acknowledge that a breach of trust occurred with a pre-release version and that the final version may differ, turning the negative into a point of interest.
    *   Use the leak as an opportunity to remind the wider community of the importance of supporting the author and respecting the beta process.
