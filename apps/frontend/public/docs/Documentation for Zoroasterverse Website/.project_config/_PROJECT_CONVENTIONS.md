# Project Vault Conventions

**Version 1.0**

**Objective:** To define a consistent set of organizational conventions for this project vault, leveraging Obsidian's features to create a highly navigable and interconnected documentation system.

---

## 1. Folder Structure

This project uses a **feature-based** or **domain-based** folder structure. All files are organized by the *type of work* they represent, not by the website page they correspond to.

*   **`/policies`**: All legal and policy documents.
*   **`/wireframes`**: All UI/UX design specifications.
*   **`/content-inventory`**: All data schemas and content structure guides.
*   **`/sops`**: All Standard Operating Procedures (checklists).

This structure is a professional standard that prevents duplication and makes it easy for specialists to find their work.

## 2. Internal Linking (`[[Wikilinks]])`

Internal links are the backbone of this vault's navigation.

*   **Rule:** Whenever a document references a concept that is detailed in another file, it **MUST** include a direct internal link to that file using the `[[filename]]` syntax.
*   **Example:** The `[[beta-reader-handbook]]` should link to the `[[scoring-rubric-and-weights]]` when it discusses how applications are scored.

## 3. Tagging Convention

Tags provide a powerful, cross-cutting way to organize and find information.

*   **Rule:** Every document in this vault MUST have a block of tags at the top of the file.
*   **Tag Format:** Tags should be placed at the very top of the file, like this:
    ```
    #tags: #feature/beta-program #doctype/spec #status/approved 
    ```

### Tagging System

*   **Feature Tags (`#feature/`):** Describes the high-level project feature.
    *   `#feature/beta-program`
    *   `#feature/spoilers`
    *   `#feature/reviews`
    *   `#feature/store`
    *   `#feature/worldbuilding`

*   **Document Type Tags (`#doctype/`):** Describes the role of the document.
    *   `#doctype/spec` (for specifications)
    *   `#doctype/sop` (for checklists and procedures)
    *   `#doctype/policy` (for legal and policy texts)
    *   `#doctype/guide` (for explanatory guides)
    *   `#doctype/log` (for registers and logs)
    *   `#doctype/index` (for `_README.md` files)

*   **Status Tags (`#status/`):** Describes the current state of the document.
    *   `#status/draft`
    *   `#status/needs-review`
    *   `#status/approved`

## 4. Directory Index Files (`_README.md`)

As you suggested, the `_README.md` in each top-level directory serves as a master index for that section.

*   **Rule:** Each `_README.md` file must contain:
    1.  A brief, one-sentence description of the folder's purpose.
    2.  A "Key Documents" section with a bulleted list of internal links to the most important files within that directory.
    3.  A "Related Documents" section with links to important files in *other* directories that are relevant to this section.
