#feature/worldbuilding #feature/spoilers #doctype/guide #status/approved

# Content Inventory: Ownership Locks and Progress

**Objective:** To define how content visibility is controlled based on a user's ownership of specific issues and their progress through the narrative, integrating with the [[feature/spoilers|spoiler system]].

---

This guide details the logic behind the `OwnershipLocks` and progress-based toggles used in content entries (e.g., [[templates/characters|Characters]], [[templates/events-and-timeline|Events]], [[templates/glossary|Glossary]], [[templates/route-nodes-and-endings|Route Nodes & Endings]]).

### 1. Ownership Locks (`OwnershipLocks` Field)

*   **Definition:** The `OwnershipLocks` field in a content entry specifies one or more `WorkID`s (e.g., `S1-I1-STD`) that a user must own to unlock a higher level of spoiler detail (typically `Standard` mode).
*   **Purpose:** To ensure that readers only encounter spoilers for content they have already purchased and are presumed to have read.
*   **Behavior:**
    *   If a user is in `Standard` spoiler mode and owns the `WorkID` specified in `OwnershipLocks`, the content entry will display its `CapsuleStandard` version.
    *   If the user does not own the `WorkID`, the content will remain in `CapsuleMinimal` (or hidden, depending on `SpoilerSeverity`).
*   **Example:** An event that occurs in Issue 3 will have `S1-I3-STD` in its `OwnershipLocks`. A user in `Standard` mode will only see the detailed `CapsuleStandard` version of this event if they own `S1-I3-STD`.

### 2. Progress-Based Toggles (`Mark as Finished`)

*   **Definition:** Users can mark issues as "finished" in their [[store-library/library-ux-spec|Library]]. This action signals their progress through the narrative.
*   **Purpose:** To allow users to manually unlock deeper spoiler content across the site, even if they don't own subsequent issues (e.g., they read it elsewhere).
*   **Behavior:** When an issue is marked as finished, the system treats the user as having "read" that issue, potentially unlocking content that would otherwise be gated by `OwnershipLocks` for that specific `WorkID`.
*   **Example:** A user marks `S1-I2-STD` as finished. Content entries with `S1-I2-STD` in their `OwnershipLocks` will now display their `CapsuleStandard` version to this user in `Standard` spoiler mode.

### 3. Integration with Spoiler Modes

*   The `OwnershipLocks` and progress toggles primarily affect content display in `Standard` spoiler mode.
*   `Minimal` mode always hides spoilers, regardless of ownership or progress.
*   `Full` mode always shows all content, regardless of ownership or progress.

### 4. Admin Considerations

*   Content authors must carefully assign `OwnershipLocks` to ensure content is revealed at the appropriate point in the narrative.
*   The CMS should provide tools to easily manage and view a user's owned and "finished" content for testing purposes.

---

*Last updated: [Month, Year]*