<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# proceed to phase 4

Phase 4 is the **final integration and testing phase** for your Cosmic Timeline. Here’s how to bring all the new UI, API connections, themes, and components together and ensure a smooth, production-ready deployment. This draws directly from your unified guide and industry-standard best practices for advanced React+Supabase apps.[^1]

***

## Phase 4: Final Integration \& Testing

### 1. **Import CSS Theme**

Make sure your cosmic theme CSS is loaded globally:

- In `src/index.css`, add at the top:

```css
@import './styles/timeline-themes.css';
```


### 2. **Update App Routing**

Ensure your app routes use the new Timelines page and not the old one:

- In `src/App.tsx`, replace the TimelinesPage import with:

```typescript
// import TimelinesPage from 'zoroasterui'    <-- old, remove this
import TimelinesPage from './pages/Timelines'; // <-- use your new local component
```


### 3. **API Layer \& Custom Hooks**

Implement the official Supabase-powered API hooks:

- Move your fetchers (`fetchAges`, `fetchBooks`, `fetchEventsByAge`) from the unified design guide into `src/lib/api-timeline.ts`, as described.
- Implement corresponding React hooks in `src/components/timeline/hooks/`:
    - `useTimelineData.ts`
    - `useEventsByAge.ts`
    - `useCosmicAnimation.ts`
    - `useThemeMode.ts`


### 4. **Production Verification Checklist**

After merging code, start your local dev server. Walk through this step-by-step:

- [ ] Open your timelines page—**Cosmic Ring dial should be visible and animated**
- [ ] Click an Age node—**timeline panel slides in from the right**
- [ ] See age title, events for that age populating the panel
- [ ] Click on an event card—**Codex modal opens with details**
- [ ] Test the theme toggle—switch between light/dark, verify persistence
- [ ] Inspect on desktop *and* mobile screen sizes (use responsive dev tools)
- [ ] Check the browser console for any warnings/errors
- [ ] Confirm timeline and events are loading live from Supabase (not from static mocks)


### 5. **Instant Rollback Plan**

If you need to revert for any reason:

- Delete new `Timelines.tsx` in `src/pages`
- Rename `Timelines.classic.tsx` back to `Timelines.tsx`
- If needed, rollback styles and imports in `App.tsx` and `index.css` as described in your guide

***

## What This Achieves

- **All features live**: Dual-ring/linear interface, SVG glyphs, event/Codex system, theme switching
- **Full Supabase integration**: Timeline updates as you add new Ages/Books/Events
- **User experience**: Mobile friendly, beautiful animations, production reliability, lightning fast thanks to Vite + Tailwind + Supabase edge cache

After passing this checklist, your Cosmic Timeline is ready for launch!

**If you want, we can prepare a pre-production checklist (SEO, accessibility, analytics, service workers, etc.) or deployment instructions for Vercel/Netlify/your host. Let me know your next goal!**

<div align="center">⁂</div>

[^1]: UNIFIED_COSMIC_TIMELINE_GUIDE.md

