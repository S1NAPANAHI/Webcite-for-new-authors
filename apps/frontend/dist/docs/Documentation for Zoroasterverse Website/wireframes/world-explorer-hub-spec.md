 #feature/worldbuilding #feature/design #doctype/spec #status/approved

# Annotated Wireframes — World Explorer Hub

**Objective:** To define the UI/UX for the central World Explorer Hub, serving as the primary entry point for users to discover and navigate the Zoroasterverse lore.

---

This specification works in conjunction with [[content-inventory/_README]] and leverages the [[content-inventory/guides/graph-model-recommendations|graph data model]].

### 1. Page Layout

*   **Header:** Prominent title: "Explore the Zoroasterverse"
*   **Search Bar:** A powerful, faceted search bar at the top, allowing users to search by `Character`, `Event`, `Location`, `Term`, `Route`, etc.
*   **Dynamic Sections:** The page will be composed of several dynamic, visually engaging sections.

### 2. Featured Content Section

*   **Purpose:** To highlight new or particularly interesting lore entries.
*   **Elements:**
    *   "Featured Character of the Week" (e.g., a character portrait, brief bio, and link to their page).
    *   "Featured Event" (e.g., an illustration, brief summary, and link to the event page).
    *   "Recently Updated" feed: A list of the most recently updated lore entries, with links.

### 3. Visual Navigation Modules

*   **Purpose:** To provide intuitive, visual entry points into different aspects of the world.
*   **Elements:**
    *   **World Map (Clickable):** A stylized map of the Zoroasterverse. Clicking on regions or key locations would link to relevant [[content-inventory/templates/locations|Location]] pages or filter search results.
    *   **Timeline Overview:** A condensed, visual representation of the main [[content-inventory/templates/events-and-timeline|timeline eras]]. Clicking on an era would lead to a more detailed timeline view.
    *   **Web of Intrigue (Relationship Map Snippet):** A small, interactive snippet of the [[character/relationship-visualizer-spec|Relationship Visualizer]], showcasing a few key interconnected characters or factions. Clicking would expand to the full visualizer.

### 4. Content Categories

*   **Purpose:** Direct links to major content categories.
*   **Elements:**
    *   Cards or prominent links for:
        *   [[content-inventory/templates/characters|Characters]]
        *   [[content-inventory/templates/events-and-timeline|Events]]
        *   [[content-inventory/templates/glossary|Glossary]]
        *   [[content-inventory/templates/route-nodes-and-endings|Routes & Endings]]
        *   [[content-inventory/templates/factions|Factions]] (if applicable)
        *   [[content-inventory/templates/locations|Locations]] (if applicable)

### 5. Spoiler Mode Integration

*   The entire hub will respect the user's current [[spoilers/modes-and-defaults|spoiler mode]]. For example, featured content or map labels might be abstracted if the user is in `Minimal` mode.

---

*Last updated: [Month, Year]*
