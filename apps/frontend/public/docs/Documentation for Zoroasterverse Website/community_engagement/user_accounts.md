# Community & Engagement: User Accounts

This document outlines the specifications for user accounts, including registration, comprehensive profiles, authentication, and related features, designed to enhance personalization and community engagement.

---

## 1. Account Creation & Registration

*   **Methods:** Email/Password, Social Login (e.g., Google, Facebook - future consideration).
*   **Requirements:** Email verification for new accounts.
*   **Data Collected:** Username, Email, Password (hashed).

## 2. User Profile

*   **Objective:** To provide a personalized space for each user, showcasing their engagement with the platform and allowing for customization and progress tracking.

### 2.1. Core Identity & Customization

*   **Editable Fields:** Display Name, Profile Picture/Avatar (optional), Bio/About Me (optional).
*   **Contact Preferences:** Manage email notifications for new releases, updates, community activity, etc.
*   **Public/Private Profile Settings:** Granular control over what information is visible to other users (e.g., reading progress, review history).

### 2.2. My Library & Reading Progress

*   **Owned Content List:** A clear display of all purchased Issues, Arcs, Volumes, and Books, with direct download/access links.
*   **Reading Status & Progress Indicators:**
    *   "Mark as Finished" toggle for individual Issues/Arcs (crucial for spoiler system integration).
    *   Visual progress bars for ongoing series/Arcs (e.g., "Arc 1: 3/5 Issues Read").
    *   (Future) Integration with an online reader to track last-read chapter/page.
*   **Route Tracking (for branching narratives):** A visual representation of the narrative paths a user has explored, and the endings they've achieved.

### 2.3. Community Engagement Hub

*   **Review History:** A dedicated section showcasing all reviews submitted by the user.
*   **Comment/Discussion History:** If a forum or comment system is implemented, a record of the user's contributions.
*   **Achievements & Badges:** Gamification elements to reward reading milestones, community participation, or specific in-world discoveries.
*   **Follow/Friend System (Future):** Ability to follow other readers, artists, or even specific characters/factions within the worldbuilding.

### 2.4. Personalization & Recommendations

*   **Content Recommendations:** Based on the user's reading history, preferences, or similar interests of other readers.
*   **Customizable Dashboard:** Allow users to arrange widgets on their profile or a personalized homepage (e.g., "My WIPs," "New Releases," "Community Activity," "My Favorite Characters").
*   **Default Spoiler Mode:** Users can set their preferred spoiler mode for the entire site.

### 2.5. Integrated Program Status

*   **Affiliate Dashboard Link:** If the user is an approved affiliate, a direct link to their affiliate dashboard.
*   **Artist Collaboration Portal Link:** If the user is a collaborating artist, access to their project management portal.
*   **Beta Program Status:** Display their current status in the beta program (e.g., "Active Beta Reader," "Beta Alumni").

## 3. Authentication

*   **Login:** Email/Username and Password.
*   **Password Reset:** Standard forgotten password flow via email.
*   **Session Management:** Secure session tokens, remember me functionality.
*   **Two-Factor Authentication (2FA):** (Future consideration for enhanced security).

## 4. Account Management

*   **Email Change:** Requires re-verification.
*   **Password Change:** Requires current password.
*   **Account Deletion:** Process for users to request account deletion.

## 5. Integration with Other Features (Consolidated)

*   **Library:** User accounts are linked to their purchased content and subscription entitlements.
*   **Reviews:** Users must be logged in to submit reviews.
*   **Beta Program:** Account status determines access to beta portal and content.
*   **Spoiler System:** User progress and ownership data stored in the account influences spoiler display.

## 6. Admin Considerations

*   **User Management:** Admin panel to view, edit, and manage user accounts (e.g., reset passwords, view purchase history, manage beta status).
*   **Audit Logs:** Logging of significant account actions (e.g., password changes, account deletions).