#feature/reviews #feature/beta-program #doctype/spec #status/approved

# Aggregates and Beta Snapshot

Details the specification for aggregate scoring modules.

### "Fresh" Score Calculation

To provide a "Rotten Tomatoes" style metric, a "Fresh" score will be calculated and displayed. 

- **Definition:** A review is considered "Fresh" if it has a rating of 4 or 5 stars.
- **Calculation:** The Fresh Ratio is the percentage of total reviews (either Beta or Public) that are "Fresh".
- **Display:** A "Fresh" badge can be displayed next to the average score if the ratio is above a certain threshold (e.g., 70%).

---

## Beta Snapshot Module (Pre-Release)
- Title: "Beta Average Score"
- Data:
  - Average rating from Beta reviews.
  - "Fresh" Ratio of Beta reviews.
  - Sample size (n).
- Display:
  - Badge: "Beta" label.
  - Tooltip: "Based on early beta feedback; may differ from public reviews."

## Public Aggregate Module (Post-Release)
- Average Rating: calculated from all public reviews.
- "Fresh" Ratio: calculated from all public reviews.
- Badges:
  - "Fresh" badge if Fresh Ratio ≥ 70%.
  - Tooltip: "Ratings of 4 or 5 stars count as Fresh."

Placement:
- Near the top of the Reviews section, adjacent to sort and filter controls.