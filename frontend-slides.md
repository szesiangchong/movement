# Frontend Slides — HTML Presentation Generator

> **Workflow:** HTML Slide Deck Generator
> **Output:** Single self-contained `.html` file (zero dependencies, runs in browser)
> **Brand:** Movement Capital
> **Logo:** `assets/Movement_Mark_BlackFull.png`
> **Source:** Adapted from [zarazhangrui/frontend-slides](https://github.com/zarazhangrui/frontend-slides)

---

## What This Does

Generates animation-rich HTML presentations that run entirely in the browser — no PowerPoint, no install, no build tools. Navigate with arrow keys, Space, or swipe. Every slide fits exactly within the viewport (no scrolling).

Good for: LP presentations, pitch decks, conference talks, internal reviews, client-facing materials where you want something more polished than a .pptx.

---

## How to Prompt

### Quick Start (minimal prompt)

```
Using the frontend-slides workflow, create an HTML presentation on [TOPIC].
[paste your content or bullet points]
```

### With Style Direction

```
Using the frontend-slides workflow, create an HTML presentation.

Purpose: Pitch deck
Length: 10 slides
Style: Dark Botanical (elegant, premium feel)
Editing: No

Content:
[paste your content]
```

### Convert an Existing PPTX

```
Using the frontend-slides workflow, convert this PowerPoint to an animated HTML presentation.
Use the "Bold Signal" style preset.
[attach .pptx file]
```

### Full Control Prompt

```
Using the frontend-slides workflow, create an HTML presentation.

Purpose: [Pitch deck / Teaching / Conference talk / Internal]
Length: [Short 5-10 / Medium 10-20 / Long 20+]
Content: [All ready / Rough notes / Topic only]
Editing: [Yes — can edit text in browser / No — presentation only]
Style: [Pick from presets below, or say "Show me options"]

Content:
[your slides content here]
```

---

## Available Style Presets

### Dark Themes

| Preset | Vibe | Fonts | Key Colours |
|--------|------|-------|-------------|
| **Bold Signal** | Confident, high-impact | Archivo Black + Space Grotesk | Dark grey `#1a1a1a`, orange card `#FF5722` |
| **Electric Studio** | Bold, clean, professional | Manrope | Black `#0a0a0a`, blue accent `#4361ee` |
| **Creative Voltage** | Energetic, retro-modern | Syne + Space Mono | Electric blue `#0066ff`, neon yellow `#d4ff00` |
| **Dark Botanical** | Elegant, sophisticated, premium | Cormorant + IBM Plex Sans | Near-black `#0f0f0f`, warm gold `#d4a574`, pink `#e8b4b8` |

### Light Themes

| Preset | Vibe | Fonts | Key Colours |
|--------|------|-------|-------------|
| **Notebook Tabs** | Editorial, organised, tactile | Bodoni Moda + DM Sans | Cream `#f8f6f1`, coloured tabs (mint, lavender, pink) |
| **Pastel Geometry** | Friendly, modern, approachable | Plus Jakarta Sans | Soft blue `#c8d9e6`, pill accents |
| **Split Pastel** | Playful, creative | Outfit | Peach `#f5e6dc`, lavender `#e4dff0` |
| **Vintage Editorial** | Witty, confident, personality | Fraunces + Work Sans | Cream `#f5f3ee`, geometric accents |

### Specialty Themes

| Preset | Vibe | Best For |
|--------|------|----------|
| **Neon Cyber** | Futuristic, techy | Tech pitches, AI demos |
| **Terminal Green** | Hacker aesthetic | Developer audiences |
| **Swiss Modern** | Clean, Bauhaus-inspired | Data-heavy, precise |
| **Paper & Ink** | Editorial, literary | Thought leadership, essays |

### Movement Capital Recommended Presets

For IC presentations and deal materials:
- **Dark Botanical** — premium, boardroom feel
- **Bold Signal** — high-conviction, action-oriented
- **Paper & Ink** — editorial, thoughtful analysis

---

## Design Principles

1. **Zero Dependencies** — Single HTML file, inline CSS/JS. No npm, no build tools.
2. **Viewport Fitting (Non-Negotiable)** — Every slide fits exactly within 100vh. No scrolling. Content overflows? Split into multiple slides.
3. **Distinctive Design** — No generic "AI slop." Avoid Inter, Roboto, Arial. Avoid purple gradients on white. Every deck should feel custom-crafted.
4. **Typography-Driven** — Font choice and hierarchy do the work. Use Fontshare or Google Fonts exclusively.

### Content Density Limits Per Slide

| Slide Type | Maximum Content |
|------------|-----------------|
| Title | 1 heading + 1 subtitle + optional tagline |
| Content | 1 heading + 4-6 bullets OR 1 heading + 2 paragraphs |
| Feature grid | 1 heading + 6 cards max (2x3 or 3x2) |
| Code | 1 heading + 8-10 lines |
| Quote | 1 quote (max 3 lines) + attribution |
| Image | 1 heading + 1 image (max 60vh height) |

**Content exceeds limits? Split into multiple slides. Never cram, never scroll.**

---

## Technical Reference

### Mandatory CSS (viewport-base.css)

Include this in **every** presentation:

```css
/* Lock html/body to viewport */
html, body { height: 100%; overflow-x: hidden; }
html { scroll-snap-type: y mandatory; scroll-behavior: smooth; }

/* Each slide = exact viewport height */
.slide {
    width: 100vw;
    height: 100vh;
    height: 100dvh;
    overflow: hidden;
    scroll-snap-align: start;
    display: flex;
    flex-direction: column;
    position: relative;
}

.slide-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    max-height: 100%;
    overflow: hidden;
    padding: var(--slide-padding);
}

/* ALL typography must use clamp() */
:root {
    --title-size: clamp(1.5rem, 5vw, 4rem);
    --h2-size: clamp(1.25rem, 3.5vw, 2.5rem);
    --h3-size: clamp(1rem, 2.5vw, 1.75rem);
    --body-size: clamp(0.75rem, 1.5vw, 1.125rem);
    --small-size: clamp(0.65rem, 1vw, 0.875rem);
    --slide-padding: clamp(1rem, 4vw, 4rem);
    --content-gap: clamp(0.5rem, 2vw, 2rem);
    --element-gap: clamp(0.25rem, 1vw, 1rem);
}

/* Responsive breakpoints */
@media (max-height: 700px) {
    :root {
        --slide-padding: clamp(0.75rem, 3vw, 2rem);
        --title-size: clamp(1.25rem, 4.5vw, 2.5rem);
    }
}
@media (max-height: 600px) {
    .nav-dots, .keyboard-hint, .decorative { display: none; }
}
@media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
        animation-duration: 0.01ms !important;
        transition-duration: 0.2s !important;
    }
}
```

### Animation Patterns

```css
/* Fade + Slide Up (most versatile) */
.reveal {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
                transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide.visible .reveal { opacity: 1; transform: translateY(0); }

/* Stagger children */
.reveal:nth-child(1) { transition-delay: 0.1s; }
.reveal:nth-child(2) { transition-delay: 0.2s; }
.reveal:nth-child(3) { transition-delay: 0.3s; }
.reveal:nth-child(4) { transition-delay: 0.4s; }
```

| Feeling | Animation Style | Visual Cues |
|---------|----------------|-------------|
| Dramatic / Cinematic | Slow fade-ins (1-1.5s), large scale transitions | Dark backgrounds, spotlight effects |
| Techy / Futuristic | Neon glow, glitch text, grid reveals | Particle systems, monospace accents |
| Professional / Corporate | Subtle fast animations (200-300ms) | Navy/slate, precise spacing |
| Calm / Minimal | Very slow subtle motion, gentle fades | High whitespace, muted palette, serif type |
| Editorial / Magazine | Staggered text reveals | Strong type hierarchy, pull quotes |

### Required JavaScript Features

Every presentation must include a `SlidePresentation` class with:
- Keyboard navigation (arrows, Space, Page Up/Down)
- Touch/swipe support
- Mouse wheel navigation
- Progress bar
- Navigation dots
- Intersection Observer for scroll-triggered `.visible` class

### CSS Gotchas

**Never negate CSS functions directly:**
```css
/* WRONG — silently ignored: */
right: -clamp(28px, 3.5vw, 44px);

/* CORRECT: */
right: calc(-1 * clamp(28px, 3.5vw, 44px));
```

### Image Handling

- Images: `max-height: min(50vh, 400px)` always
- Use direct file paths, not base64 (unless embedding logo)
- Process oversized images with Pillow (`pip install Pillow`)
- Circular crop for logos on modern styles

---

## Navigation (When Viewing)

| Control | Action |
|---------|--------|
| `→` / `↓` / `Space` | Next slide |
| `←` / `↑` | Previous slide |
| Scroll / Swipe | Navigate |
| Click nav dots | Jump to slide |
| `E` key | Toggle edit mode (if enabled) |

---

## Customisation (After Generation)

- **Colours:** Edit `:root` CSS variables
- **Fonts:** Change the Google Fonts / Fontshare link
- **Animations:** Modify `.reveal` class transitions
- **Content:** Edit HTML directly, or enable inline editing mode for in-browser edits
