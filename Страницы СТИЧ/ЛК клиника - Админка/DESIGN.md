# Design System Strategy: Med-as

## 1. Overview & Creative North Star
**Creative North Star: "The Clinical Sanctuary"**

In the chaotic landscape of medical aggregators, this design system establishes a position of absolute clarity and calm. We are moving away from the "industrial clinic" look—characterized by cold white grids and harsh lines—toward a high-end, editorial experience. 

The aesthetic is defined by **Soft Structuralism**: a layout that feels incredibly organized yet physically light. We achieve this through "breathable" white space, intentional asymmetry in medical listings, and a hierarchy that prioritizes rapid comprehension over information density. By overlapping high-contrast typography with translucent, layered surfaces, we create a digital space that feels both technologically advanced and human-centric.

---

## 2. Colors: Tonal Architecture
The palette transitions from the deep, authoritative **Navy (#00193c)** to the life-affirming **Seafoam (#006c45)**. 

### The "No-Line" Rule
To maintain a premium feel, **1px solid borders are strictly prohibited for sectioning.** Structural separation must be achieved through:
- **Surface Shifts:** Placing a `surface-container-low` section against a `surface` background.
- **Tonal Transitions:** Using background color blocks to define where one category ends and another begins.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of materials. 
- **Base:** `surface` (#faf9fe) for the overall canvas.
- **Secondary Layers:** `surface-container` (#eeedf2) for grouping related content blocks.
- **Interactive Cards:** `surface-container-lowest` (#ffffff) to provide the highest contrast and visual "pop."

### The "Glass & Gradient" Rule
For floating elements, such as navigation bars or modal headers, use a backdrop-blur (12px-20px) with `surface` at 80% opacity. For primary actions, employ a subtle linear gradient from `primary` (#00193c) to `primary-container` (#002d62) at a 135-degree angle to add depth and "soul" that flat fills lack.

---

## 3. Typography: Editorial Authority
We use **Manrope** for its unique balance of geometric precision and organic warmth.

- **Display (Large/Med):** Reserved for high-impact hero headings. Use tight letter-spacing (-0.02em) to create a bold, editorial look that feels like a premium health journal.
- **Headline (Sm/Med):** Used for section titles. These should feel authoritative but approachable.
- **Body (Lg/Md):** Optimized for readability. Use `on-surface-variant` (#43474f) for longer descriptions to reduce eye strain.
- **Labels:** Always in uppercase with slightly increased tracking (+0.05em) when using `label-sm` to ensure clinical precision.

The contrast between the oversized `display-lg` headings and the tight, functional `label-md` tags creates the "Signature" look of this design system.

---

## 4. Elevation & Depth: The Layering Principle
We reject traditional drop shadows in favor of **Tonal Layering**.

- **Natural Lift:** Instead of shadows, place a `surface-container-lowest` (#ffffff) element on a `surface-container-low` (#f4f3f8) background. This creates a soft, sophisticated edge.
- **Ambient Shadows:** For high-elevation elements (modals, dropdowns), use a multi-layered shadow: `0px 4px 20px rgba(0, 27, 63, 0.06)`. Note the tinting: we use a fraction of the `on-primary-fixed` color rather than pure black to mimic natural light reflection.
- **The "Ghost Border" Fallback:** If a border is required for accessibility, use the `outline-variant` token at **15% opacity**. High-contrast borders are a sign of unrefined UI; we prefer "felt" boundaries over "seen" ones.

---

## 5. Components

### Buttons & CTAs
- **Primary:** Gradient fill (`primary` to `primary-container`), `on-primary` text, and `DEFAULT` (0.5rem) roundness.
- **Secondary:** `secondary-container` (#70fcb7) background with `on-secondary-container` (#00734a) text. 
- **Tertiary:** No background; `primary` text with an icon.

### Cards & Lists
**Strict Rule:** No divider lines between list items. Use `spacing-4` (1rem) vertical gaps or alternating subtle background shifts. 
- **Doctor/Clinic Cards:** Use a `surface-container-lowest` card. The profile image should slightly "break the grid" by overlapping the container's top edge to create depth.

### Input Fields
- **State:** `surface-container-highest` background, no border. On focus, transition to a `ghost-border` of the `primary` color.
- **Validation:** Errors use `error` (#ba1a1a) text but a `error-container` (#ffdad6) soft background fill for the entire input area to ensure the user feels guided, not shouted at.

### Additional Signature Components
- **Progressive Disclosure Trays:** For medical history or complex forms, use "glass" sheets that slide over the content rather than full-page refreshes.
- **Status Pills:** Utilize `secondary-fixed` for "Available" states, ensuring the mint/seafoam green communicates health and readiness.

---

## 6. Do's and Don'ts

### Do
- **Do** use asymmetrical layouts. A 3-column grid where one column is significantly wider creates a custom, high-end feel.
- **Do** prioritize Russian typography legibility. Manrope handles Cyrillic beautifully; ensure line-heights are 1.4x-1.6x for body text.
- **Do** use the Seafoam green (`secondary`) as a surgical tool—only for success states, active selections, or critical health-related CTAs.

### Don't
- **Don't** use 100% black text. Always use `on-surface` (#1a1b1f) to maintain the soft "Clinical Sanctuary" vibe.
- **Don't** use sharp corners. Every element must adhere to the `DEFAULT` (0.5rem / ROUND_EIGHT) or `xl` (1.5rem) scales to remain approachable.
- **Don't** clutter. If a screen feels full, increase the spacing tokens (e.g., move from `spacing-8` to `spacing-12`) and re-evaluate the information hierarchy.