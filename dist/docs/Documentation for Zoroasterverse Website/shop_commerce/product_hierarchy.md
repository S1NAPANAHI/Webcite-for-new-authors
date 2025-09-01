# Shop & Commerce: Product Hierarchy

This document defines the hierarchical structure of the novel series as it relates to product offerings in the shop.

---

## 1. Novel Series Hierarchy

Your novel series follows a clear, nested structure:

**BOOK > VOLUME > SAGA > ARC > ISSUE > CHAPTER**

This hierarchy forms the basis for how content is packaged and sold.

## 2. Product Mapping

Each level of the novel hierarchy can correspond to a distinct product or bundle in the shop:

*   **CHAPTER:** The most granular unit. Not sold individually, but accessible via subscription (Chapter Pass).
*   **ISSUE:** The fundamental purchasable unit (40-60k words). Each issue will have its own product page and unique ID.
*   **ARC:** A bundle of multiple Issues. Sold as a higher-level product.
*   **SAGA:** A bundle of multiple Arcs. Sold as a higher-level product.
*   **VOLUME:** A bundle of multiple Sagas. Sold as a higher-level product.
*   **BOOK:** The largest bundle, comprising multiple Volumes. The most comprehensive and typically most expensive product.

## 3. Data Representation

The `content_management/content_templates/works-and-editions.csv` file is designed to capture this hierarchy with the following fields:

*   `Work_Type`: Specifies the type of work (e.g., 'Book', 'Volume', 'Saga', 'Arc', 'Issue', 'Chapter').
*   `Parent_Work_ID`: Links to the immediate parent in the hierarchy (e.g., an Issue's parent would be its Arc).
*   `Book_ID`, `Volume_ID`, `Saga_ID`, `Arc_ID`, `Issue_ID`: Provide direct links to higher-level components for easier querying and navigation.

## 4. Implications for Shop Functionality

This hierarchy enables:

*   **Flexible Purchasing:** Customers can buy at their preferred granularity.
*   **Tiered Pricing:** Discounts can be applied to larger bundles.
*   **Progress Indicators:** The structure allows for tracking and displaying progress for Works in Progress (WIPs) at any level.
*   **Navigation:** The shop can offer hierarchical browsing, allowing users to explore a series from Book down to individual Issues.
