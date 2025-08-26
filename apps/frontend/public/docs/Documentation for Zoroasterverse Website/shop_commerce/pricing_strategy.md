# Shop & Commerce: Pricing Strategy

This document outlines the tiered pricing strategy for the Zoroasterverse novel series, designed to incentivize larger purchases while offering flexible options to readers.

---

## 1. Core Principle: Tiered Discounts

The pricing model is based on offering progressively larger discounts as readers purchase higher-level bundles (e.g., Arc, Saga, Volume, Book) compared to buying their constituent parts individually.

## 2. Pricing Tiers

*   **Individual Issue Price:** This serves as the base price for the smallest purchasable unit. All other bundle prices are derived from this.

*   **Arc Bundle Price:** A slight discount (e.g., 5-10%) compared to buying all constituent Issues individually. This encourages readers to commit to a full Arc.

*   **Saga Bundle Price:** A larger discount (e.g., 10-15%) compared to buying all constituent Arcs individually. This incentivizes a deeper commitment to the narrative.

*   **Volume Bundle Price:** An even larger discount, encouraging the purchase of a significant portion of a Book.

*   **Book Bundle Price:** The largest discount, designed to encourage the ultimate purchase of an entire Book. This maximizes average order value.

## 3. Subscription Pricing

*   **Chapter Pass:** A recurring monthly fee provides access to new chapters as they are released. This is a continuous engagement model.
    *   **Upsell Opportunity:** Chapter Pass subscribers could receive a special discount on purchasing full Issues, Arcs, or higher-level bundles, encouraging conversion to higher-value one-time purchases.

## 4. Data Representation

The `content_management/content_templates/works-and-editions.csv` file includes fields to support this strategy:

*   `Base_Price`: The base price for an individual unit (e.g., an Issue).
*   `Bundle_Discount_Percentage`: The percentage discount applied when this item is part of a bundle (e.g., an Arc bundle might have a 10% discount).

## 5. Admin Considerations

*   The Content Management System (CMS) should support defining these discount percentages at various bundle levels.
*   Ideally, the system could automatically calculate bundle prices based on the sum of their parts and the defined discount percentages.
*   The ability to override automated pricing for specific promotions or sales events will be necessary.
