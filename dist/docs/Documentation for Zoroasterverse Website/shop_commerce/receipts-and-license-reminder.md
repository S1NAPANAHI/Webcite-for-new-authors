#feature/store #doctype/spec #status/approved

# Store: Receipts and License Reminder

**Objective:** To define the content and delivery of post-purchase receipts and license reminders, ensuring clear communication of ownership terms and download access.

---

This specification works in conjunction with [[policies/copyright-and-licensing]] and [[download-limits-and-counters]].

### 1. Purchase Receipt (Email)

*   **Trigger:** Sent automatically upon successful completion of a purchase.
*   **Sender:** noreply@zoroasterverse.com (or similar automated email address).
*   **Subject Line:** "Your Zoroasterverse Order Confirmation - #[Order ID]"
*   **Content:**
    *   **Header:** Zoroasterverse Logo, "Thank You for Your Purchase!"
    *   **Order Summary:**
        *   Order ID
        *   Date of Purchase
        *   Total Amount Paid
        *   Payment Method
    *   **Items Purchased:**
        *   List each `WorkID` (Title, Edition).
        *   Link to download page for each item.
    *   **License Reminder:**
        *   "Your purchase grants you a personal-use license. Sharing or distributing these files is prohibited." (See [[policies/copyright-and-licensing]] for full text).
    *   **Download Limits Reminder:**
        *   "Each item has a limit of 5 downloads per format. Need a reset? Contact support@zoroasterverse.com." (See [[policies/download-reset-policy]]).
    *   **Watermark Note:**
        *   "Please note: Your downloaded files include a unique, purchaser-specific watermark for security purposes." (See [[watermark-note-behavior]]).
    *   **Support Contact:**
        *   "Questions? Contact support@zoroasterverse.com."

### 2. License Reminder (In-App/In-Library)

*   **Trigger:** May appear periodically in the user's library or upon first access of a downloaded file.
*   **Placement:** A small, dismissible banner or pop-up.
*   **Content:** "Remember, your files are for personal use only. Sharing is prohibited." (See [[policies/copyright-and-licensing]] for full text).

---

*Last updated: [Month, Year]*
