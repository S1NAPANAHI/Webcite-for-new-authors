#feature/store #doctype/spec #status/approved

# Store: Preorder and Release States

**Objective:** To define the various states a product (issue or bundle) can be in, from preorder to release, and how these states are reflected in the UI and system behavior.

---

This specification works in conjunction with the [[product-page-spec]] and the [[sops/new-issue-release-checklist]].

### 1. Product States

*   **Upcoming:**
    *   **Definition:** Product is announced but not yet available for preorder.
    *   **UI:** Product page may exist but with no purchase options. "Coming Soon" message.
    *   **System Behavior:** No sales or downloads possible.

*   **Preorder:**
    *   **Definition:** Product is available for purchase before its official release date.
    *   **UI:** Product page displays "Preorder Now" CTA, a preorder badge (e.g., "Preorder: [Month, Year]"), and potentially a countdown timer.
    *   **System Behavior:** Purchases are recorded. Files are not yet available for download. Users are added to a notification list for release.

*   **Released:**
    *   **Definition:** Product is officially launched and available for immediate purchase and download.
    *   **UI:** Product page displays "Buy Issue" CTA, "Available Now" badge (if applicable).
    *   **System Behavior:** Purchases enable immediate download. Preorder badge/countdown is removed.

*   **Archived/Unavailable:**
    *   **Definition:** Product is no longer actively sold (e.g., replaced by a bundle, or temporarily out of stock).
    *   **UI:** Product page may show "Unavailable" or redirect to a new product.
    *   **System Behavior:** No new purchases possible. Existing owners retain library access.

### 2. State Transitions

*   **Manual Transition:** States can be manually changed by an administrator in the CMS.
*   **Automated Transition:** The system should support automated transitions based on predefined dates (e.g., `ReleaseDate` triggers transition from `Preorder` to `Released`).

### 3. UI Elements & Microcopy

*   **Preorder Badge:** "Preorder: [Month, Year]" (see [[microcopy/preorder-and-release-text]] for copy).
*   **Release Badge:** "Available Now" (see [[microcopy/preorder-and-release-text]] for copy).
*   **Countdown Timer:** Displays `[DD]d [HH]h` until release.
*   **CTA Buttons:** "Preorder Now", "Buy Issue", "In Library".

---

*Last updated: [Month, Year]*