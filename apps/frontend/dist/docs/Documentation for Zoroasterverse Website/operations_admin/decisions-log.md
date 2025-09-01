# Decisions Log - Zoroasterverse Website Project

**Purpose:** This document tracks all major decisions made during the project planning phase, including rationale, alternatives considered, and approval dates. This serves as the authoritative record of how the project evolved from concept to final specifications.

**Last Updated:** August 15, 2025  
**Status:** Active  

---

## Decision Record Format

Each decision includes:
- **Decision ID:** Unique identifier
- **Date:** When the decision was made
- **Decision:** What was decided
- **Rationale:** Why this choice was made
- **Alternatives Considered:** Other options evaluated
- **Impact:** How this affects the project
- **Status:** Approved/Superseded/Under Review

---

## Core Platform Decisions

### D001 - Content Management Strategy
**Date:** August 15, 2025  
**Decision:** Implement a spoiler-aware content management system with three disclosure modes (Minimal, Standard, Full)  
**Rationale:** The interactive nature of the branching narrative requires sophisticated spoiler control to preserve reader experience while enabling deep engagement for completionist fans  
**Alternatives Considered:** 
- Single spoiler toggle (insufficient granularity)
- Content warnings only (doesn't address cross-linking complexity)
- Manual spoiler tagging without automation (too error-prone)
**Impact:** Requires custom CMS development with preview modes and automated lint checking  
**Status:** Approved  

### D002 - Audience Targeting and Age Rating
**Date:** August 15, 2025  
**Decision:** Target 13+ audience with content warnings, no hard age gate  
**Rationale:** Dark themes warrant guidance without blocking access; builds trust through transparency  
**Alternatives Considered:** 
- 16+ rating (potentially reduces audience)
- 18+ rating (unnecessarily restrictive)
- No age guidance (less responsible)
**Impact:** All content warnings and product descriptions must reflect 13+ guidance  
**Status:** Approved  

### D003 - Monetization Model
**Date:** August 15, 2025  
**Decision:** Primary revenue through individual ebook sales, subscriptions deferred to Phase 4  
**Rationale:** Simpler implementation for MVP, proven model for digital content, subscriptions add complexity  
**Alternatives Considered:** 
- Subscription-first model (higher development complexity)
- Freemium with premium features (harder to monetize effectively)
- One-time purchase for entire series (reduces ongoing revenue)
**Impact:** Store and commerce systems designed for per-issue transactions with future subscription capability  
**Status:** Approved  

---

## Technical Architecture Decisions

### D004 - File Distribution and DRM
**Date:** August 15, 2025  
**Decision:** 5 downloads per format with watermarking, no hard DRM  
**Rationale:** Balances user convenience with anti-piracy measures; DRM creates friction and support burden  
**Alternatives Considered:** 
- Unlimited downloads (higher piracy risk)
- Hard DRM (user experience friction)
- 3 downloads only (too restrictive)
**Impact:** Download tracking system required, watermarking implementation needed for beta files  
**Status:** Approved  

### D005 - Contact and Support Infrastructure
**Date:** August 15, 2025  
**Decision:** Use zoroasterverse.com domain with role-based email addresses (support@, legal@, press@, beta@)  
**Rationale:** Professional appearance, clear routing for different inquiry types, scalable structure  
**Alternatives Considered:** 
- Single contact email (harder to route and prioritize)
- Third-party support platform (additional cost and complexity)
- Personal email addresses (less professional, harder to transfer)
**Impact:** Email infrastructure setup required, support workflows must be documented  
**Status:** Approved  

---

## Beta Program Decisions

### D006 - Beta Reader Cohort Size and Structure
**Date:** August 15, 2025  
**Decision:** 40-60 readers per cohort with hybrid access (watermarked files + portal)  
**Rationale:** Large enough for statistical validity and diversity, small enough for manageable operations  
**Alternatives Considered:** 
- Small cohort (20-30): Faster to manage but less diverse feedback
- Large cohort (80-120): More feedback but higher operational burden
- Files-only access: Easier technically but less secure
**Impact:** Requires automated scoring system and cohort balancing algorithms  
**Status:** Approved  

### D007 - Beta Reader Obligations and Enforcement
**Date:** August 15, 2025  
**Decision:** One-strike policy (missed obligations = waitlist next cycle) with mandatory review conversion on launch day  
**Rationale:** Clear consequences encourage compliance while maintaining fairness; review conversion ensures continuity  
**Alternatives Considered:** 
- Three-strike policy (too lenient, poor accountability)
- Immediate permanent removal (too harsh)
- Optional review conversion (reduces public review volume)
**Impact:** Automated tracking system needed for compliance monitoring  
**Status:** Approved  

### D008 - Beta Program Timeline
**Date:** August 15, 2025  
**Decision:** 2 weeks reading + 1 week review submission per issue cycle  
**Rationale:** Sufficient time for thorough reading while maintaining reasonable release cadence  
**Alternatives Considered:** 
- 1 week reading (too rushed for quality feedback)
- 3 weeks total (delays release timeline unnecessarily)
- Flexible deadlines (harder to manage operations)
**Impact:** All beta communications and automation must reflect this timeline  
**Status:** Approved  

---

## User Experience Decisions

### D009 - Review System Architecture
**Date:** August 15, 2025  
**Decision:** Dual template system (spoiler-free and spoiler-tagged) with "Beta Average Score" display pre-release  
**Rationale:** Accommodates different reviewer preferences while providing transparency about beta feedback quality  
**Alternatives Considered:** 
- Single template (forces all reviewers into same format)
- No beta score display (less transparency for pre-orders)
- Separate beta/public review systems (fragmentation)
**Impact:** Review submission forms need template selection, product pages need beta score integration  
**Status:** Approved  

### D010 - Library and Download Management
**Date:** August 15, 2025  
**Decision:** Visual download counters with "Mark as Finished" toggle for spoiler unlocking  
**Rationale:** Transparent download tracking helps users manage limits; progress tracking enables smart spoiler gating  
**Alternatives Considered:** 
- Hidden download tracking (less transparent)
- Automatic progress detection (technically complex)
- Manual spoiler mode selection only (less convenient)
**Impact:** Library interface needs counter displays and progress tracking integration  
**Status:** Approved  

---

## Content Strategy Decisions

### D011 - Route and Ending Labeling
**Date:** August 15, 2025  
**Decision:** Use abstract route labels ("Silent Accord", "Iron Vow", etc.) to avoid raw spoilers in navigation  
**Rationale:** Enables route tracking and filtering without revealing narrative content to non-readers  
**Alternatives Considered:** 
- Chapter-based labeling (less meaningful for routes)
- Numerical codes (less memorable and engaging)
- Character-based routes (too spoiler-heavy)
**Impact:** All route-related content must use consistent abstract labeling system  
**Status:** Approved  

### D012 - Content Warnings Approach
**Date:** August 15, 2025  
**Decision:** Standard set: "violence, war consequences, psychological manipulation, moral ambiguity" with note that warnings may contain mild spoilers  
**Rationale:** Covers major thematic elements while acknowledging inherent spoiler risk in detailed warnings  
**Alternatives Considered:** 
- Extremely detailed warnings (too spoiler-heavy)
- Minimal warnings only (less helpful for sensitive readers)
- Dynamic warnings per chapter (too complex to maintain)
**Impact:** All product pages and relevant wiki entries need consistent warning implementation  
**Status:** Approved  

---

## Legal and Policy Decisions

### D013 - Copyright and Licensing Framework
**Date:** August 15, 2025  
**Decision:** © 2025 Sina Panahi with personal-use license, explicit anti-sharing terms, and watermarking disclosure  
**Rationale:** Clear ownership while educating users about appropriate use; watermarking disclosure builds trust  
**Alternatives Considered:** 
- Creative Commons licensing (too permissive for commercial work)
- No explicit license terms (legal ambiguity)
- Harsher enforcement language (adversarial tone)
**Impact:** All legal pages, product pages, and file headers need consistent copyright language  
**Status:** Approved  

### D014 - Refund Policy for Digital Goods
**Date:** August 15, 2025  
**Decision:** 14-day window for defective/inaccessible files only, excluding buyer's remorse and completed downloads  
**Rationale:** Balances customer protection with digital goods reality; clear exclusions prevent abuse  
**Alternatives Considered:** 
- 30-day window (too generous for digital goods)
- No refunds (too restrictive, damages trust)
- Unlimited refunds (open to abuse)
**Impact:** Refund processing workflow and customer service training required  
**Status:** Approved  

---

## Implementation Planning Decisions

### D015 - Development Approach
**Date:** August 15, 2025  
**Decision:** Complete design and planning phase before any coding begins  
**Rationale:** Complex feature interactions require thorough planning; early code commits can constrain design decisions  
**Alternatives Considered:** 
- Agile development with evolving requirements (risk of architectural debt)
- Prototype-first approach (might not address full complexity)
- Parallel design and development (higher risk of rework)
**Impact:** Extended planning phase required, but reduces development risk and cost  
**Status:** Approved  

### D016 - Project Structure and Documentation
**Date:** August 15, 2025  
**Decision:** Modular folder structure with dedicated areas for policies, wireframes, content inventory, SOPs, and microcopy  
**Rationale:** Clear separation of concerns enables parallel work and easier maintenance; each deliverable has clear ownership  
**Alternatives Considered:** 
- Single document approach (harder to maintain and collaborate)
- Feature-based organization (creates dependencies and duplication)
- Tool-specific organization (less transferable)
**Impact:** All team members need to understand and follow folder structure conventions  
**Status:** Approved  

---

## Deferred Decisions

### D017 - Subscription Tiers (Deferred to Phase 4)
**Date:** August 15, 2025  
**Decision:** Defer subscription implementation while designing architecture to accommodate future subscriptions  
**Rationale:** Focus on core functionality first; subscription complexity can be added once base platform is stable  
**Alternatives Considered:** 
- Implement subscriptions in MVP (increases complexity significantly)
- Never implement subscriptions (limits long-term revenue potential)
**Impact:** Data models and user management must be subscription-ready even if not implemented initially  
**Status:** Deferred  

### D018 - Community Forums (Deferred to Phase 4)
**Date:** August 15, 2025  
**Decision:** Start with reviews only, add forums in later phase if community demand exists  
**Rationale:** Reviews provide community feedback with less moderation burden; forums require significant ongoing management  
**Alternatives Considered:** 
- Launch with forums immediately (higher operational overhead)
- Never implement forums (limits community building)
**Impact:** Community engagement strategy focuses on reviews and beta program initially  
**Status:** Deferred  

---

## Decision Impact Summary

| Decision Area | Key Choices | Development Impact | Operational Impact |
|---------------|-------------|-------------------|-------------------|
| Content Management | Spoiler-aware CMS | Custom development required | QA process needed |
| Monetization | Per-issue sales | Standard e-commerce | Simple fulfillment |
| Beta Program | Structured cohorts | Automated workflows | Active management |
| User Experience | Transparency-focused | Rich interfaces needed | Self-service emphasis |
| Legal Framework | Balanced protection | Standard implementation | Clear policies |

---

## Change History

| Date | Decision ID | Change | Reason |
|------|-------------|--------|---------|
| Aug 15, 2025 | Initial | Created decision log | Project initialization |

---

*This decisions log will be updated as the project evolves. All major decisions must be recorded here with appropriate rationale and impact analysis.*