# Worldbuilding & Lore: Interactive Timelines

This document outlines the specifications for interactive timelines, allowing readers to explore the chronological events of the Zoroasterverse.

---

## 1. Objective

To provide a dynamic and engaging way for readers to visualize the history and key events of the novel series, with options for filtering and detailed exploration.

## 2. Types of Timelines

*   **Global Timeline:** A comprehensive timeline showing all major events across the entire novel universe.
*   **POV-Specific Timelines:** Timelines filtered to show events relevant to a specific Point-of-View character.
*   **Branch-Specific Timelines:** Timelines filtered to show events relevant to a specific narrative branch or route.

## 3. Key Features

*   **Chronological Display:** Events displayed in chronological order.
*   **Event Details:** Clicking on an event reveals a detailed description, including participants, outcomes, and links to related content (characters, locations, issues).
*   **Filtering & Sorting:**
    *   Filter by character, location, faction, arc, or issue.
    *   Sort by date, importance, or character appearance.
*   **Spoiler Control Integration:** Events on the timeline will respect the user's current [[content_management/spoiler_system/modes-and-defaults|spoiler mode]].
    *   Spoilered events may be blurred, hidden, or have abstracted descriptions until unlocked by ownership or progress.
*   **Interactive Elements:** Zooming, panning, and potentially drag-and-drop reordering for personalized exploration (advanced feature).

## 4. Data Source

*   Event data will primarily come from the `content_management/content_templates/events-and-timeline.csv`.
*   Links to other content (characters, locations) will use the [[content_management/content_model#id-conventions-and-cross-linking|ID conventions]] defined in the content model.

## 5. User Experience

*   **Visual Design:** Clean, intuitive, and visually appealing timeline interface.
*   **Performance:** Smooth loading and interaction, even with a large number of events.
*   **Accessibility:** Designed to be usable by all readers.

## 6. Admin Considerations

*   **Event Management:** CMS tools to easily add, edit, and link events within the timeline.
*   **Timeline Generation:** System to automatically generate global and filtered timelines based on content data.
*   **QA:** Tools to preview timelines in different spoiler modes.
