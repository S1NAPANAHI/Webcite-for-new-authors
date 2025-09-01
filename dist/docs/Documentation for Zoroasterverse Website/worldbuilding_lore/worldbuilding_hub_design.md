#feature/worldbuilding #feature/design #doctype/spec #status/approved

# Worldbuilding Hub: Comprehensive Design Document

**Objective:** To define the comprehensive design for the Zoroasterverse Worldbuilding Hub, covering user experience (frontend), admin experience (backend content management), and underlying technical considerations.

---

### 1. User Experience (Frontend) - How Readers Explore Your World

#### 1.1. The World Explorer Hub (Dashboard)

*   **Purpose:** The main entry point for discovery and exploration of the lore.
*   **Elements:**
    *   **Header:** Prominent title: "Explore the Zoroasterverse"
    *   **Search Bar:** A powerful, faceted search bar at the top, allowing users to search by `Character`, `Event`, `Location`, `Term`, `Route`, etc. (See [[wireframes/world-explorer-hub-spec]] for detailed UI).
    *   **Featured Content:** Dynamically updated section highlighting new or particularly interesting lore entries (e.g., "Featured Character of the Week," "Recently Updated").
    *   **Visual Navigation Modules:**
        *   **World Map (Clickable):** A stylized, interactive map of the Zoroasterverse. Clicking on regions or key locations links to relevant [[content-inventory/templates/locations|Location]] pages or filters search results.
        *   **Timeline Overview:** A condensed, visual representation of the main [[content-inventory/templates/events-and-timeline|timeline eras]]. Clicking on an era leads to a more detailed timeline view.
        *   **Web of Intrigue (Relationship Map Snippet):** A small, interactive snippet of the [[wireframes/character/relationship-visualizer-spec|Relationship Visualizer]], showcasing a few key interconnected characters or factions. Clicking expands to the full visualizer.
    *   **Content Categories:** Direct links to major content categories (e.g., [[content-inventory/templates/characters|Characters]], [[content-inventory/templates/events-and-timeline|Events]], [[content-inventory/templates/glossary|Glossary]], [[content-inventory/templates/route-nodes-and-endings|Routes & Endings]]).
*   **Interaction:** All elements respect the user's current [[spoilers/modes-and-defaults|spoiler mode]].

#### 1.2. Lore Pages (Character, Event, Glossary, etc.)

*   **Purpose:** Displaying detailed information about a single entry.
*   **Elements:**
    *   **Header:** Name, Type (e.g., "Character: Lyra").
    *   **Non-Spoiler Overview:** A brief, safe summary visible in `Minimal` mode.
    *   **Spoiler Capsules:** Interactive elements that hide plot-sensitive information, revealed by user interaction or [[ownership-locks-and-progress|ownership/progress]]. (See [[spoilers/capsules-pattern]]).
    *   **Related Content:** Dynamically generated links to other lore entries (characters involved in an event, events related to a character, etc.).
    *   **Relationship Visualizer:** For Character and Faction pages, an interactive graph showing connections. (See [[wireframes/character/relationship-visualizer-spec]]).
    *   **Version History Selector:** A dropdown allowing users to view the page content as it existed at the time of previous book releases. (See [[content-inventory/guides/content-versioning-spec]]).
*   **Interaction:** Users can switch spoiler modes, click capsules, and navigate through related content.

#### 1.3. Search & Filtering

*   **Purpose:** Allowing users to find specific information quickly and precisely.
*   **Elements:**
    *   **Global Search Bar:** Accessible from all lore pages.
    *   **Faceted Filters:** Allow users to narrow down results by `Era`, `Arc`, `POV`, `Spoiler Severity`, `WorkID` (issue/season), etc.

### 2. Admin Experience (Backend) - How You Manage the World

#### 2.1. Content Management System (CMS) Interface

*   **Purpose:** Admin dashboard for creating, editing, and publishing lore entries.
*   **Elements:**
    *   **List View:** Displays all existing lore entries with filters and sort options.
    *   **"Create New" Button:** Initiates the creation of a new lore entry.
    *   **Edit Form:** A dedicated form for each lore entry type (Character, Event, etc.).

#### 2.2. Content Entry Forms (for each type: Character, Event, etc.)

*   **Purpose:** Detailed forms for inputting structured data for each lore entry.
*   **Elements:**
    *   **Standard Fields:** Name, Type, brief description.
    *   **Spoiler Fields:** Rich text editors for `CapsuleMinimal`, `CapsuleStandard`, `CapsuleFull` content. These editors will include a `[+ Spoiler]` button to mark inline spoilers. (See [[beta-program/portal/feedback-form-spec]] for editor component spec).
    *   **Tagging Fields:** Dropdowns/multi-select for `Arc`, `Issue`, `POV`, `Branch`, `Ending-level`, `SpoilerSeverity`. (See [[content-inventory/guides/tagging-and-spoiler-severity]]).
    *   **Relationship Fields:** Input fields for `RelatedEntries` (e.g., `ALLY_OF`, `PARTICIPATED_IN`), with auto-suggesting existing lore IDs. (Leverages [[content-inventory/guides/id-conventions-and-crosslinks]]).
    *   **Ownership Locks/Progress Toggles:** Fields to define which `WorkID`s unlock content. (See [[ownership-locks-and-progress]]).
    *   **Version Control:** Interface for saving new versions of content and reverting to previous ones. (See [[content-inventory/guides/content-versioning-spec]]).

#### 2.3. Publishing Workflow

*   **Purpose:** Ensuring content is reviewed and correctly formatted before going live.
*   **Elements:**
    *   **States:** Draft / Needs Review / Approved / Published.
    *   **Spoiler Lint Integration:** The CMS will run [[spoilers/spoiler-lint-rules|spoiler lint]] checks automatically, displaying warnings/errors to the admin.
    *   **QA Preview:** Admins can preview content in all spoiler modes (Minimal, Standard, Full) before publishing. (See [[sops/spoiler-qa-checklist]]).

### 3. Technical Considerations (Backend Data & Logic)

#### 3.1. Database Model

*   **Recommendation:** A [[content-inventory/guides/graph-model-recommendations|Graph Database]] is highly recommended for storing lore entries and their complex relationships. This model inherently supports the interconnected nature of the worldbuilding data.
*   **Integration:** The CMS will interact with this database to store and retrieve content.

#### 3.2. Spoiler System Logic

*   **Dynamic Content Serving:** The backend will dynamically serve content based on the user's current [[spoilers/modes-and-defaults|spoiler mode]], their owned `WorkID`s, and their `Marked as Finished` progress.
*   **Rendering:** The frontend will receive structured content (e.g., HTML with spoiler tags) and render it appropriately (e.g., collapsed capsules).

#### 3.3. Search Indexing

*   **Purpose:** To enable fast and accurate search across all lore content.
*   **Implementation:** A dedicated search index (e.g., Elasticsearch, Algolia) will be used to index all lore entries, including their tags and relationships.

---

*Last updated: [Month, Year]*


│  > I am kind of person that likes to write a lot so I would have multiple works in progress, the history of my novel universe is quite large │
│     so that is why I might cover diffrent eras at the same time, so in my shop I might have indicators for works in progess telling my       │
│    readers how much I have progressed                                                                                                        │
│                                                                                                                                              │
│                                                                                                                                              │
│    so What I am trying to say is I am ready to brainstorm for the shop and my inventory.                                                     │
│                                                                                                                                              │
│    my novel series follows this structure:                                                                                                   │
│                                                                                                                                              │
│    BOOK>VOLUME>SAGA>ARC>ISSUE>CHAPTER                                                                                                        │
│                                                                                                                                              │
│    So I imagine while I have different projects ongoing, i could have a subscription based thing for chapter by chapter releases             │
│                                                                                                                                              │
│    the unit is the issue, it contains around 40-60k words,arc is bigger than that and it contains several issues, saga contains several arcs │
│     and volume contains several sagas and in the end a book contains several volumes, you can imagine how big a book could be.               │
│                                                                                                                                              │
│    so in my shop I plan to have this methods or tree structure, where I can give people chapters by supscription plan, or sell them issue by │
│     issue, or arc by arc and so on,                                                                                                          │
│                                                                                                                                              │
│    an issue will be the cheapest and a book will be the most expensive                                                                       │
│                                                                                                                                              │
│    there will have the option to buy it in any configuration they want.                                                                      │
│                                                                                                                                              │
│    these were my ideas, what do you have any?     


This is a fantastic vision for your shop, and it perfectly leverages the complex structure of your novel series. Offering readers the
  flexibility to purchase at different granularities (chapter, issue, arc, etc.) is a powerful way to cater to diverse reading habits and
  budgets.

  Let's brainstorm how to translate this into a concrete shop and inventory system.

  1. Product Hierarchy & SKU Definition

  Your novel structure (BOOK > VOLUME > SAGA > ARC > ISSUE > CHAPTER) provides a clear hierarchy for your products.

   * Base Unit: The Issue: This will be your fundamental purchasable unit (40-60k words). Each issue will have its own product page and unique
     ID.
   * Bundles as Higher-Level Products:
       * An Arc is a bundle of Issues.
       * A Saga is a bundle of Arcs.
       * A Volume is a bundle of Sagas.
       * A Book is a bundle of Volumes.
   * Chapter (Subscription-Only): Individual chapters would not be sold à la carte, but accessed via a subscription.

  Idea: We need to update the content-inventory/templates/works-and-editions.csv to include fields that define this hierarchy (e.g.,
  Parent_WorkID or BelongsTo_ArcID, BelongsTo_SagaID, etc.).

  2. Tiered Pricing Strategy

  Your idea of Issue being cheapest and Book most expensive is sound. This implies a tiered discount structure:

   * Individual Issue Price: Base price.
   * Arc Bundle Price: A slight discount (e.g., 5-10%) compared to buying all constituent Issues individually.
   * Saga Bundle Price: A larger discount (e.g., 10-15%) compared to buying all constituent Arcs individually.
   * Volume Bundle Price: Even larger discount.
   * Book Bundle Price: The largest discount, encouraging the ultimate purchase.

  Idea: This encourages readers to buy larger bundles, increasing your average order value while offering perceived value.

  3. Subscription Model: The "Chapter Pass"

  This is a brilliant way to engage readers continuously.

   * Model: A recurring monthly subscription (e.g., "Zoroasterverse Chapter Pass").
   * Entitlement: Subscribers get access to all new chapters as they are released within the subscribed series/book.
   * Delivery: Chapters are automatically added to their library as they are published.
   * Upsell Opportunity: Chapter Pass subscribers could receive a special discount on purchasing full Issues, Arcs, or higher-level bundles.
     This encourages conversion from a recurring, lower-value purchase to a higher-value one-time purchase.

  Idea: We would need to expand the store-library/subscription-model-mvp.md to detail this "Chapter Pass" alongside the "Season Pass" (which
  would now be an "Arc Pass").

  4. Progress Indicators for Works in Progress (WIPs)

  This is a fantastic way to manage reader expectations and build anticipation for ongoing series.

   * Display: On the product page for an Arc, Saga, Volume, or Book that is still in progress, you could show:
       * Completion Percentage: X% Complete (e.g., based on Issues released vs. total planned).
       * Chapter Count: Y Chapters Released / Z Chapters Planned.
       * Next Release Date: Next Chapter: [Date] or Next Issue: [Date].
   * Data Requirement: This would require adding fields like Planned_Issues_Count, Planned_Chapters_Count, and Next_Release_Date to your Works
     & Editions content inventory.

  5. User Experience in the Shop

  Presenting this complexity clearly is key.

   * Dedicated Series Page: A central page for each novel series that visually displays the entire hierarchy (Book > Volume > Saga > Arc >
     Issue). Readers can click on any level to see its product page.
   * Product Page Upsells: On an Issue's product page, clearly show "Buy this Issue" AND "Buy the Arc this Issue belongs to (and save X%)" and
     "Subscribe to the Chapter Pass".
   * "Build Your Own Bundle" (Phase 2/3): While complex for an MVP, a future feature could allow users to select multiple Issues/Arcs and
     automatically apply bundle discounts in the cart.

  6. Admin Experience for Product Management

  Managing this will require a robust CMS.

   * Hierarchical Product Creation: The CMS needs to support creating Issues first, then creating Arcs that reference those Issues, and so on,
     up the chain.
   * Automated Bundle Pricing: Ideally, the system could automatically calculate bundle prices based on the sum of their parts and your defined
     discount percentages.

  What do you think of these ideas? We can start by updating the Works & Editions content inventory template and then refine the
  product-page-spec and subscription-model-mvp to reflect this detailed vision.