# Worldbuilding & Lore: Character Profiles

This document outlines the specifications for displaying character profiles on the Zoroasterverse website, integrating with the spoiler system and cross-linking to other worldbuilding elements.

---

## 1. Objective

To provide comprehensive and engaging character profiles that reveal information progressively based on the user's spoiler mode and content ownership/progress.

## 2. Profile Sections

*   **Basic Information:** Name, Alias (if any), Affiliation, Key Role.
*   **Biography:** A narrative summary of the character's life and actions, presented in different spoiler capsules.
*   **Relationships:** Connections to other characters (allies, rivals, family, etc.), with links to their profiles.
*   **Key Events:** Significant events the character participated in, with links to the interactive timelines.
*   **Abilities/Traits:** Special skills, powers, or defining characteristics.
*   **Appearances:** List of Issues/Arcs/Volumes where the character plays a significant role, with links to product pages.

## 3. Spoiler Control Integration

Character profiles will heavily utilize the [[content_management/content_model#capsule-content|Capsule Content]] (`CapsuleMinimal`, `CapsuleStandard`, `CapsuleFull`) and [[content_management/content_model#ownership-locks-field|Ownership Locks]] defined in the content model.

*   **`CapsuleMinimal`:** Basic, non-spoiler information visible to all.
*   **`CapsuleStandard`:** Reveals more details once the user owns/has progressed past specific `WorkID`s.
*   **`CapsuleFull`:** Reveals all details, including major spoilers, when the user is in Full Spoiler Mode.

## 4. Cross-linking

*   All mentions of other characters, events, locations, or glossary terms within the profile will be linked using the [[content_management/content_model#id-conventions-and-cross-linking|ID conventions]].
*   Links will respect the user's current spoiler mode.

## 5. Data Source

*   Character data will primarily come from the `content_management/content_templates/characters.csv`.
*   Relationships and event participation will be derived from the content model and potentially a graph database backend.

## 6. User Experience

*   **Visual Design:** Clean, readable layout with clear hierarchy of information.
*   **Navigability:** Easy to jump between related characters and other worldbuilding elements.
*   **Progressive Disclosure:** Information revealed gradually to avoid overwhelming users and to manage spoilers effectively.

## 7. Admin Considerations

*   **Profile Management:** CMS tools to easily create, edit, and link character profiles.
*   **Spoiler Management:** Tools to define and preview the different spoiler capsules for each character.
