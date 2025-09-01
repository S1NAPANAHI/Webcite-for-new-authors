#feature/spoilers #feature/design #doctype/spec #status/approved

# Spoiler System Onboarding - Wireframe Spec

**Objective:** To quickly and clearly teach new users how the three-tier spoiler system works, empowering them to control their experience.

---

**Trigger:** This onboarding flow triggers automatically for a first-time visitor upon their first visit to any page containing spoiler-gated content (e.g., a character page or timeline).

### 1. Welcome Modal

*   **UI:** A clean, non-intrusive modal window appears over the page content.
*   **Header:** "Control Your Spoilers"
*   **Body Text:** "Welcome to the Zoroasterverse. This site contains deep lore, but you control what you see. Choose a spoiler level at any time."
*   **Visual:** Three icons are displayed side-by-side:
    *   **Minimal:** (An icon of a closed book or a keyhole)
    *   **Standard:** (An icon of a half-open book or a compass)
    *   **Full:** (An icon of a fully open book or a magnifying glass)
*   **CTA Button:** "Show Me How It Works"

### 2. Interactive Example

*   **UI:** The modal expands slightly.
*   **Header:** "Here's An Example"
*   **Content:** A sample Character Bio is shown within the modal.
    *   **Character Name:** Kaelen
    *   **Bio Text:** Contains three versions of a sentence, one for each spoiler level.
*   **Interaction:** Below the bio, the three spoiler mode icons (Minimal, Standard, Full) are shown as clickable toggles. The "Minimal" toggle is active by default.
*   **Initial State (Minimal):** The bio reads: "Kaelen is a skilled tactician from the Northern Reach, known for his unwavering loyalty."
*   **On-Click "Standard":** The bio text dynamically changes to: "Kaelen is a skilled tactician from the Northern Reach, whose loyalty was forged after the **[SPOILER]** during the Siege of Silverwood."
*   **On-Click "Full":** The bio text dynamically changes to: "Kaelen is a skilled tactician from the Northern Reach, whose loyalty was forged after **he betrayed his own house** during the Siege of Silverwood."

### 3. Confirmation

*   **UI:** The example section is replaced with a confirmation message.
*   **Header:** "You're In Control"
*   **Body Text:** "You can change this setting at any time using the spoiler icon in the site header. Your current setting is **Minimal**."
*   **CTA Button:** "Start Exploring"

---

### Implementation Notes

*   A cookie should be set (`spoiler_onboarding_complete=true`) to ensure this flow only appears once.
*   The default spoiler setting for all new users is `Minimal`.
*   The design should be clean, fast, and easily dismissible at any stage.