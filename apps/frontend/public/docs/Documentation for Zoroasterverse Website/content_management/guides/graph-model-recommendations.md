#feature/worldbuilding #doctype/guide #status/approved

# Content Architecture: Graph Model Recommendations

**Objective:** To recommend a data modeling approach that complements the current CSV/spreadsheet structure, ensuring the project can handle deep narrative complexity and scale without future database overhauls.

---

### 1. Current Model: Spreadsheets (CSVs)

The current system using spreadsheets for [[templates/characters|Characters]], [[templates/events-and-timeline|Events]], [[templates/route-nodes-and-endings|Routes]], etc., is **excellent** for initial data entry, bulk editing, and establishing a clear schema. It should be kept as the primary method for content authoring.

### 2. The Future Challenge: Deep Relationships

As the story grows, the relationships *between* data points become as important as the data itself. For example:

*   Which characters were **allies** during the *Siege of Silverwood* but became **rivals** after the *Thorn Pact*?
*   Show me all events influenced by the *Silent Accord* that feature a member of the *House of Ember*.
*   Can a reader reach *Ending X* without first encountering *Character Y*?

Answering these questions with spreadsheets requires complex, multi-file lookups that are slow and difficult to maintain. This is a common scaling problem for rich narrative worlds.

### 3. Recommendation: A Graph Model Backend

While content can be authored in spreadsheets, I recommend that the backend database be structured as a **Graph**. In a graph model, the relationships are first-class citizens.

*   **Nodes:** These are your primary entities: `Character`, `Event`, `Location`, `Faction`, `RouteNode`.
*   **Edges:** These are the relationships that connect them: `ALLY_OF`, `BETRAYED_IN`, `PARTICIPATED_IN`, `LEADS_TO`.

### 4. Example

Instead of just having a `Relations` column in a Character CSV, the data would be structured like this:

*   `(Character: Lyra)` **--[ALLY_OF]-->** `(Character: Maren)`
*   `(Character: Lyra)` **--[PARTICIPATED_IN]-->** `(Event: Hall_Summit)`
*   `(Event: Hall_Summit)` **--[INFLUENCED_BY]-->** `(Route: Veiled_Tide)`

### 5. Benefits of this Approach

1.  **Powerful Queries:** The complex questions above become simple and fast queries in a graph database (like Neo4j, ArangoDB, or AWS Neptune).
2.  **Discovering Insights:** You can visually map out character relationships or plot lines, making it easier to spot inconsistencies or find interesting new narrative connections.
3.  **Scalability:** A graph is designed to handle billions of relationships without a performance hit. Your world can grow infinitely complex without breaking the backend.
4.  **Flexible Authoring:** You can continue to use spreadsheets. A developer can write a simple import script that reads the CSVs and builds the graph structure automatically.

### 6. Actionable Next Step

No immediate action is needed from a content perspective. This document should be given to the future development team as a strong recommendation for their backend architecture. It informs their choice of database technology and ensures the system they build will support the narrative's complexity for years to come.