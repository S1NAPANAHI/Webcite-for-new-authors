# Architecture Blueprint

This document outlines the overall architecture and technical foundation of the Zoroasterverse website.

## 1. Website Blueprint for the Zoroasterverse Novel Series

**Status:** Approved  
**Last Updated:** August 15, 2025  
**Version:** 1.0  

## Executive Summary

This blueprint defines the complete website architecture for the Zoroasterverse interactive novel series. The platform serves as both an ecommerce store for digital books and a living companion to the narrative, featuring spoiler-aware content management, beta reader programs, and community engagement tools.

## Core Goals

- **Monetize** the series through ebook sales with future subscription options
- **Engage** readers with interactive timelines, route tracking, and spoiler-controlled worldbuilding wiki
- **Community** building through reviews, beta programs, and reader profiles
- **Control** via comprehensive admin tools for content, commerce, and user management

## Primary Audiences

### Casual Readers
- Clean navigation to purchase and download ebooks
- Access to news, releases, and basic story information
- Simple onboarding without spoilers

### Deep-Lore Enthusiasts
- Interactive timelines and character relationship maps
- Route tracking across branching narratives
- Comprehensive, spoiler-aware worldbuilding database
- Achievement system and progress tracking

### Beta Readers
- Structured application and evaluation process
- NDA-protected access to draft content
- Feedback forms and community portal
- Conversion to public reviews at launch

### Press & Partners
- Media kits and release information
- Author bio and contact details
- High-resolution assets and fact sheets

## Information Architecture

```
/
├── Home
├── Read & Shop/
│   ├── Store (ebooks, bundles, editions)
│   └── Library (purchased content, downloads)
├── The Series/
│   ├── Story Guide (reading order, branches)
│   ├── Timelines (global + POV-specific)
│   ├── Characters
│   ├── Locations & Factions
│   └── Glossary
├── Interactive/
│   ├── Route Tracker
│   ├── Timeline Explorer
│   └── Quiz Companions
├── Community/
│   ├── Reviews
│   └── Events/AMA (future)
├── Blog & News/
│   ├── Release Posts
│   ├── Dev logs
│   ├── Project Updates
├── Beta Program/
│   ├── Application
│   ├── NDA Process
│   └── Portal (authenticated)
├── Account/
│   ├── Profile & Settings
│   ├── Library
│   └── Subscriptions (future)
└── Admin/
    ├── Content Management
    ├── Commerce Tools
    ├── User Management
    ├── Beta Operations
    └── Analytics
```

## Key Features

### Ecommerce & Monetization
- **Digital Store:** EPUB, PDF, MOBI formats
- **Editions:** Standard, Deluxe (with extras), Seasonal bundles
- **Pricing:** Launch discounts, preorders, gift codes
- **Delivery:** Watermarked downloads, 5-download limit per purchase
- **Payment:** Stripe/PayPal integration
- **Refund Policy:** 14-day digital goods policy

### Spoiler Control System
- **Three Modes:** Minimal (guests), Standard (owners), Full (opt-in)
- **Ownership Gating:** Content unlocks based on purchased issues
- **Progress Tracking:** "Mark as finished" toggles unlock deeper content
- **Spoiler Capsules:** Tap-to-reveal sections with clear labeling
- **Admin Preview:** QA in all modes before publishing

### Beta Reader Program
- **Cohort Size:** 40-60 readers per issue
- **Application:** Scored on depth, availability, tone, genre fit
- **Access:** Watermarked files + portal-only sensitive content
- **Obligations:** Structured feedback + public review conversion
- **Timeline:** 2 weeks reading + 1 week review submission

### Reviews & Community
- **Templates:** Spoiler-free and spoiler-tagged options
- **Moderation:** Auto-spoiler detection and manual approval queue
- **Display:** "Beta Average Score" pre-release, public reviews post-launch
- **Verification:** "Verified Purchase" badges for owners

## Content Model

### Works & Editions
- Season, Issue, Edition (Standard/Deluxe/Bundle)
- Formats, pricing, release dates
- Content warnings and age guidance (13+)

### Worldbuilding Database
- **Characters:** POV status, first appearance, relationships
- **Events:** Timeline placement, participants, outcomes
- **Routes:** Decision nodes, branching paths, endings
- **Glossary:** Terms with context-aware definitions

### User-Generated Content
- **Reviews:** Ratings, highlights, spoiler sections
- **Profiles:** Achievements, favorite routes, reading progress
- **Beta Feedback:** Structured forms and conversion tracking

## Technical Considerations

### Spoiler Management
- Content tagged with Arc, Issue, POV, Branch, Severity levels
- Ownership/progress locks tied to purchase history
- Preview modes for admin QA
- Cross-linking respects current spoiler settings

### Commerce Integration
- Product variants for different editions/formats
- Download counters and reset procedures
- Watermarking for anti-piracy
- Email receipts with license terms

### Beta Operations
- Application scoring and cohort balancing
- NDA e-signature workflow
- Automated email campaigns
- Access revocation capabilities

## Legal & Policy Framework

### Copyright & Licensing
- © 2025 Sina Panahi. All rights reserved.
- Personal-use license with anti-piracy terms
- 5-download limit per format with support resets

### Content Guidelines
- 13+ age recommendation with content warnings
- Spoiler etiquette in reviews and community areas
- Moderation workflows for policy violations

### Beta Reader Agreements
- NDA requirements for early access
- Watermarked file distribution
- Revocation procedures for breaches

## Contact & Support

- **Primary Support:** support@zoroasterverse.com
- **Legal/NDA:** legal@zoroasterverse.com  
- **Press/Media:** press@zoroasterverse.com
- **Beta Operations:** beta@zoroasterverse.com

## Implementation Phases

### Phase 1: Foundation (MVP)
- Core ecommerce: Store, checkout, library
- Basic worldbuilding wiki (read-only)
- Review system and user accounts
- Admin CMS with role management

### Phase 2: Interactivity
- Route tracking and timeline explorer
- Advanced spoiler controls
- Achievement system
- Enhanced review moderation

### Phase 3: Beta Program
- Application and scoring system
- NDA workflow and portal
- Cohort management tools
- Feedback collection and analysis

### Phase 4: Advanced Features
- Subscription tiers
- Interactive maps
- Community forums
- Localization support

## Success Metrics

### Commerce
- Conversion rate from visitors to purchasers
- Average order value and repeat purchases
- Download completion rates

### Engagement
- Time spent on worldbuilding pages
- Route tracker usage and completion
- Review submission rates

### Community
- Beta application volumes and quality scores
- Review conversion rates from beta to public
- User retention and return visits

---

*This blueprint serves as the canonical reference for all website development decisions. Any changes must be documented in the decisions log with rationale and approval dates.*

## Shop & Inventory Enhancements

### Dedicated Series Page

*   **Objective:** To provide a central hub for each novel series, visually displaying its entire hierarchy (Book > Volume > Saga > Arc > Issue) and allowing readers to navigate and explore content at various granularities.
*   **Elements:**
    *   **Series Overview:** Synopsis, main characters, themes.
    *   **Hierarchical Navigation:** Interactive display of Books, Volumes, Sagas, Arcs, and Issues within the series. Each element should be clickable, leading to its respective product page.
    *   **Progress Indicators:** For ongoing series, display overall series completion percentage, next planned release, and other relevant WIP metrics.
    *   **Call to Actions:** Links to purchase options (e.g., "Buy the Full Series," "Subscribe to Chapter Pass," "Explore Individual Arcs").
    *   **Related Content:** Links to worldbuilding entries, character profiles, timelines relevant to the series.

### Admin Experience for Product Management

*   **Objective:** To define the necessary CMS functionalities for managing the complex product hierarchy, pricing, and progress tracking for the shop.
*   **Key Features:**
    *   **Hierarchical Product Creation:**
        *   Ability to create "Issue" products as the base unit.
        *   Ability to create "Arc" products by bundling existing "Issues."
        *   Ability to create "Saga," "Volume," and "Book" products by bundling their respective lower-level components.
        *   System should automatically link parent/child relationships based on bundling.
    *   **Automated Bundle Pricing:**
        *   Define global or per-bundle discount percentages (e.g., 5% for Arc, 10% for Saga).
        *   System should automatically calculate the bundle price based on the sum of its constituent parts and the applied discount.
        *   Option to override automated pricing for specific promotions.
    *   **WIP Progress Tracking:**
        *   Fields for `Planned_Issues_Count`, `Planned_Chapters_Count`, `Next_Release_Date` for each product (as defined in `works-and-editions.csv`).
        *   Ability to update `Released_Issues_Count` and `Released_Chapters_Count` as content is published.
        *   Automated calculation of `Completion Percentage` based on released vs. planned counts.
    *   **Content Linking:** Easy interface to link chapters/issues to their respective arcs, sagas, volumes, and books.
    *   **Product Status Management:** Ability to set product status (e.g., "Planned," "In Progress," "Completed," "Archived").

## 2. Technical Stack (Placeholder)

This section will detail the chosen technologies, frameworks, and libraries for the website development.

## 3. Database Schema (Placeholder)

This section will outline the database design, including tables, relationships, and key fields.
