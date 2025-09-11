# Information Architecture Taxonomy - Zoroasterverse Website

**Purpose:** This document defines the complete taxonomy, categorization systems, and hierarchical relationships for all content types across the Zoroasterverse website. It serves as the authoritative reference for content organization, tagging, cross-linking, and spoiler management.

**Last Updated:** August 15, 2025  
**Status:** Active  

---

## Taxonomy Overview

The Zoroasterverse IA taxonomy is built around five core content dimensions:
- **Temporal** (Eras, Seasons, Issues)
- **Narrative** (Routes, Branches, Endings)
- **Character-Based** (POVs, Relationships, Affiliations)
- **Geographic** (Locations, Regions, Factions)
- **Thematic** (Story Arcs, Content Types, Spoiler Levels)

---

## Primary Content Types

### 1. Works Hierarchy

```
Universe: Zoroasterverse
├── Season 1
│   ├── Issue 1 (Standard Edition)
│   ├── Issue 1 (Deluxe Edition)
│   ├── Issue 2 (Standard Edition)
│   └── Season 1 Bundle
├── Season 2
└── Special Editions
```

**Taxonomy Rules:**
- **WorkID Format:** `S[Season]-I[Issue]-[Edition]` (e.g., `S1-I1-STD`, `S1-I1-DLX`)
- **Bundle Format:** `S[Season]-B[Bundle]` (e.g., `S1-B1`)
- **Edition Types:** Standard, Deluxe, Bundle, Special
- **Hierarchy:** Universe → Season → Issue → Edition

### 2. Temporal Taxonomy

#### Eras (Macro Timeline)
- **Pre-Foundation** - Events before the current system
- **Foundations** - Establishment of current power structures
- **Convergence** - Major narrative intersections
- **Consequences** - Post-decision aftermath periods
- **Legacy** - Long-term outcomes and future setup

#### Dating System
- **Format:** `[Era].[Sequence]` (e.g., `Foundations.12`, `Convergence.05`)
- **Precision:** Major events get full dates, minor events use relative positioning
- **Cross-Reference:** All dates tie back to specific Issues/Seasons

### 3. Narrative Structure Taxonomy

#### Routes (Abstract Labels)
```
Route Categories:
├── Diplomatic Routes
│   ├── Silent Accord
│   ├── Veiled Tide
│   └── Formal Compact
├── Direct Action Routes  
│   ├── Iron Vow
│   ├── Broken Oath
│   └── Steel Resolution
└── Compromise Routes
    ├── Ember Path
    ├── Glass Crown
    └── Thorn Pact
```

#### Branches and Nodes
- **Node ID Format:** `NODE-[DESCRIPTOR]` (e.g., `NODE-GATE`, `NODE-PARLEY`)
- **Branch Categories:** Primary, Secondary, Hidden, Conditional
- **Prerequisites:** Event-based, Ownership-based, Choice-based

#### Endings Taxonomy
```
Ending Categories:
├── Resolution Types
│   ├── Reprieve (temporary peace)
│   ├── Severance (permanent separation)  
│   ├── Unity (lasting alliance)
│   └── Transformation (systemic change)
├── Outcome Scope
│   ├── Personal (individual consequences)
│   ├── Factional (group consequences)
│   └── Universal (world-changing)
└── Stability Level
    ├── Stable (lasting outcome)
    ├── Fragile (temporary outcome)
    └── Volatile (unstable outcome)
```

---

## Character Taxonomy

### 1. Character Classification

#### Primary Categories
- **POV Characters** - Reader viewpoint characters
- **Major Characters** - Significant story roles, named throughout
- **Supporting Characters** - Important but limited appearances  
- **Minor Characters** - Brief mentions or single-scene roles

#### Character Attributes
```
Character Metadata:
├── Core Identity
│   ├── Name (public-safe)
│   ├── Aliases/Titles
│   └── Pronouns
├── Narrative Role
│   ├── POV Status (Y/N)
│   ├── First Appearance (WorkID)
│   ├── Character Arc Tags
│   └── Story Function
├── Affiliations
│   ├── Primary Faction
│   ├── Secondary Affiliations
│   └── Relationship Networks
└── Spoiler Management
    ├── Spoiler Severity (Low/Medium/High)
    ├── Ownership Locks (WorkIDs)
    └── Capsule Content (Minimal/Standard/Full)
```

### 2. Relationship Taxonomy

#### Relationship Types
- **Alliance** - Cooperative partnership
- **Rivalry** - Competitive opposition
- **Mentor/Student** - Teaching relationship
- **Family** - Blood or chosen family
- **Professional** - Work-based connection
- **Romantic** - Intimate partnership
- **Unknown** - Relationship unclear/developing

#### Relationship Metadata
- **Strength:** Strong, Moderate, Weak, Former
- **Status:** Active, Dormant, Severed, Evolving
- **Spoiler Level:** Which mode reveals the relationship details

---

## Geographic and Faction Taxonomy

### 1. Location Hierarchy

```
Geographic Structure:
├── Regions (macro areas)
│   ├── The City (central urban area)
│   ├── Outer Territories (peripheral zones)
│   └── Neutral Zones (unclaimed areas)
├── Districts (sub-regions)
│   ├── Administrative Centers
│   ├── Residential Areas
│   └── Commercial Zones
└── Specific Locations
    ├── Buildings/Landmarks
    ├── Meeting Places
    └── Strategic Points
```

### 2. Faction Taxonomy

#### Faction Categories
- **Official Bodies** - Recognized governmental/institutional groups
- **Underground Networks** - Hidden or unofficial organizations
- **Professional Groups** - Trade-based or skill-based organizations
- **Ideological Movements** - Belief or cause-based groups
- **Temporary Alliances** - Situational partnerships

#### Faction Attributes
```
Faction Metadata:
├── Structure
│   ├── Leadership Style
│   ├── Hierarchy Type
│   └── Decision-Making Process
├── Influence
│   ├── Geographic Reach
│   ├── Resource Access
│   └── Political Power
├── Relationships
│   ├── Allied Factions
│   ├── Opposed Factions
│   └── Neutral Relationships
└── Narrative Impact
    ├── Story Relevance
    ├── Route Influence
    └── Character Connections
```

---

## Content Tagging System

### 1. Arc Tags
- **Foundations** - World establishment and setup
- **City** - Urban politics and power structures  
- **Conflict** - Direct confrontations and tensions
- **Revelation** - Major discoveries and plot reveals
- **Resolution** - Conclusion and consequence phases

### 2. Content Type Tags
- **Character** - Character-focused content
- **Event** - Action/occurrence-focused content
- **Location** - Place-focused content
- **Concept** - Idea/system-focused content
- **Relationship** - Connection-focused content

### 3. Audience Tags
- **Casual** - Accessible to all readers
- **Lore** - Appeals to detail-oriented fans
- **Completionist** - Requires deep engagement
- **Spoiler-Safe** - No major reveals
- **Spoiler-Heavy** - Contains significant reveals

---

## Spoiler Management Taxonomy

### 1. Spoiler Severity Levels

#### Low Severity
- General world information
- Early character introductions
- Basic faction descriptions
- Non-plot-critical events
- Publicly available information

#### Medium Severity  
- Character development details
- Faction relationship dynamics
- Route-specific information
- Mid-story event outcomes
- Character motivation reveals

#### High Severity
- Major plot twists
- Ending-specific information
- Character fate revelations
- Critical decision outcomes
- Cross-route spoilers

### 2. Disclosure Modes

#### Minimal Mode (Default for Non-Owners)
```
Content Exposure:
├── World Overview ✓
├── Character Basics ✓
├── Early Story Events ✓
├── General Lore ✓
├── Route Abstractions ✓
├── Character Arcs ✗
├── Specific Outcomes ✗
├── Ending Details ✗
└── Cross-References (limited)
```

#### Standard Mode (Content Owners)
```
Content Exposure:
├── All Minimal Content ✓
├── Owned Content Details ✓
├── Character Development ✓
├── Owned Route Information ✓
├── Event Context ✓
├── Unowned Route Details ✗
├── Future Content ✗
├── Alternate Ending Details ✗
└── Cross-References (expanded)
```

#### Full Mode (Opt-In)
```
Content Exposure:
├── All Standard Content ✓
├── Complete Route Details ✓
├── All Ending Information ✓
├── Character Fates ✓
├── Cross-Route Spoilers ✓
├── Future Content Hints ✓
├── Author Commentary ✓
└── Cross-References (complete)
```

### 3. Ownership and Progress Gates

#### Ownership-Based Gating
- Content reveals tied to purchased Works
- Edition-specific extras (Deluxe content)
- Bundle bonus material access
- Subscription tier benefits

#### Progress-Based Gating
- "Mark as Finished" unlock triggers
- Reading milestone rewards
- Route completion bonuses
- Achievement-based reveals

---

## Cross-Linking Taxonomy

### 1. Reference Types

#### Direct References
- **Character → Event** - Character participated in event
- **Event → Location** - Event occurred at location
- **Faction → Character** - Character affiliated with faction
- **Route → Ending** - Route leads to specific ending

#### Contextual References  
- **Thematic Connections** - Similar themes or concepts
- **Temporal Proximity** - Events close in timeline
- **Causal Relationships** - One thing leads to another
- **Parallel Developments** - Simultaneous occurrences

### 2. Link Behavior Rules

#### Spoiler-Aware Linking
- Links respect current spoiler mode
- Hover previews show appropriate detail level
- Click-through warnings for spoiler escalation
- Breadcrumb trails maintain spoiler consistency

#### Dynamic References
- Links update based on ownership status
- Personalized suggestions based on reading history
- Route-specific recommendations
- Progress-sensitive revelations

---

## Search and Filter Taxonomy

### 1. Primary Filters

#### By Content Type
- Characters, Events, Locations, Concepts, Routes

#### By Timeline
- Era, Season, Issue, Before/After specific events

#### By Narrative Element
- POV Character, Route Path, Story Arc, Ending Type

#### By Access Level  
- Public, Owner-Only, Progress-Gated, Full-Access

### 2. Secondary Filters

#### By Relationship
- Connected to specific characters/factions
- Part of specific storylines
- Influenced by specific choices

#### By Engagement
- Recently updated, Community favorites
- High-interaction content, Trending topics

---

## Metadata Standards

### 1. Required Fields (All Content)
```yaml
ContentID: unique-identifier
ContentType: [character|event|location|concept|route|ending]
Title: display-name
SpoilerSeverity: [low|medium|high]
CreatedDate: YYYY-MM-DD
LastModified: YYYY-MM-DD
PublishStatus: [draft|review|published|archived]
```

### 2. Content-Specific Fields

#### Characters
```yaml
FirstAppearance: WorkID
POVStatus: boolean
ArcTags: [array]
Relations: [array of character connections]
```

#### Events  
```yaml
Era: timeline-era
Date: era-specific-date
Participants: [array of character IDs]
Location: location-id
Outcomes: [array by spoiler mode]
```

#### Routes/Endings
```yaml
Prerequisites: [array of conditions]
BranchOptions: [array of route labels]
EndingCategory: resolution-type
RouteLabels: [array of abstract names]
```

### 3. Spoiler Management Fields
```yaml
OwnershipLocks: [array of WorkIDs]
ProgressGates: [array of conditions]
CapsuleContent:
  minimal: basic-summary
  standard: owner-details  
  full: complete-information
```

---

## Implementation Guidelines

### 1. Content Creation Rules
- All content must be tagged with minimum required metadata
- Spoiler levels must be assigned during creation
- Cross-references should be bidirectional
- Abstract labels preferred over explicit names

### 2. Quality Assurance
- Spoiler lint checks before publishing
- Cross-reference validation
- Metadata completeness verification
- Mode-specific preview testing

### 3. Evolution and Maintenance
- Regular taxonomy review and updates
- Community feedback integration
- Performance optimization for large datasets
- Backward compatibility maintenance

---

## Content ID Conventions

### 1. Format Standards
```
Characters: CH-[NAME] (e.g., CH-LYRA, CH-MAREN)
Events: EV-[DESCRIPTOR] (e.g., EV-MARKET-STANDOFF)
Locations: LOC-[NAME] (e.g., LOC-CENTRAL-HALL)  
Concepts: GL-[TERM] (e.g., GL-ACCORDS, GL-TIDE)
Routes: NODE-[DESCRIPTOR] (e.g., NODE-GATE)
Endings: END-[TYPE] (e.g., END-REPRIEVE)
```

### 2. Naming Conventions
- Use hyphens for multi-word descriptors
- Avoid numbers unless necessary for disambiguation
- Prefer descriptive over sequential naming
- Maintain consistency within content types

---

## Integration Points

### 1. User Interface
- Dynamic filtering based on user's spoiler mode
- Contextual cross-linking in content display
- Progress-aware content recommendations
- Personalized navigation based on ownership

### 2. Admin Interface  
- Bulk tagging and metadata management
- Spoiler impact analysis tools
- Cross-reference management dashboard
- Content relationship visualization

### 3. Community Features
- Tag-based review filtering
- Route-specific discussion threads
- Progress-based achievement systems
- Spoiler-aware social features

---

*This taxonomy serves as the foundational framework for all content organization within the Zoroasterverse website. It should be consulted for all content creation, categorization, and cross-linking decisions.*