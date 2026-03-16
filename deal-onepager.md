# Deal One-Pager — IC Review Template

> **Workflow:** IC One-Pager Generator
> **Output:** Single-slide 16:9 PPTX
> **Brand:** Movement Capital
> **Logo:** `assets/Movement_Mark_BlackFull.png`

---

## Purpose

Generate a single-slide Investment Committee one-pager for Phase I deal screening. The output should be presentation-ready — clean enough to drop into an IC pack without edits.

---

## Design Specification

### Layout: 16:9 (10" × 5.625")

**Design language:** Typography-driven, no cards or boxes. White background, navy header bar, thin section rules, generous whitespace. Think Lazard/Evercore, not McKinsey.

### Branding

| Element | Value |
|---|---|
| Primary | `#002147` (Navy) |
| Deep Navy | `#001530` |
| Text | `#1C1F26` (Charcoal) |
| Secondary text | `#4A5568` (Mid grey) |
| Muted text | `#8896A6` (Light grey) |
| Highlight text | `#0070C0` (Blue) — used for secondary/italic paragraphs |
| Rule lines | `#C5CDD8` |
| Alternating row | `#EDF1F5` (Ice) |
| Positive/Mitigant | `#1A7856` (Green) |
| Risk accent | `#9B3025` (Muted red) |
| Confidentiality | `#B8952A` (Gold) |
| Header font | Georgia (presentation title only) |
| Body font | Calibri (everything else, including section headers and thesis lever labels) |
| Logo | Movement mark (white version on dark, navy version on light) |

### Slide Structure

```
┌─────────────────────────────────────────────────────────┐
│  [LOGO]  PROJECT NAME   [TARGET LOGO] Target   CONFID.  │  ← Navy bar
│                                         IC | PHASE X    │
├────────────────────────────┬────────────────────────────┤
│                            │                            │
│  I. BUSINESS OVERVIEW      │  II. INVESTMENT THESIS     │
│  ────                      │  ────                      │
│                            │                            │
│  Primary paragraph         │  Lever 1: Bold label +     │
│  (charcoal)                │  description               │
│                            │                            │
│  Secondary paragraph       │  Lever 2: ...              │
│  (blue italic)             │                            │
│                            │  Lever 3: ...              │
│  Competitive advantage     │                            │
│  paragraph (bold label +   │                            │
│  charcoal)                 │                            │
├────────────────────────────┴────────────────────────────┤
│  FINANCIAL SUMMARY & TRANSACTION                        │
│  ───────────────────────────────────────────────────     │
│  │     │ FY-2A │ FY-1A │ FY0A │ CAGR │ │ TXN   │ DET │
│  │ Rev │       │       │      │      │ │ EV    │ OVW │
│  │ EBI │       │       │      │      │ │ Mult  │ D/C │
│  │ Mgn │       │       │      │      │ │ Eq Ck │ Lev │
├────────────────────────────┬────────────────────────────┤
│                            │                            │
│  IV. KEY RISKS &           │  V. INDICATIVE RETURNS     │
│       MITIGANTS            │  ────                      │
│  ────                      │                            │
│  Risk: detail → mitigant   │   ~24%        2.9x        │
│  Risk: detail → mitigant   │   Target IRR   Target MOIC│
│  Risk: detail → mitigant   │                            │
│  Risk: detail → mitigant   │   Assumptions footnote     │
├────────────────────────────┴────────────────────────────┤
│  ─────────────────────────────────────────────────────  │
│  RECOMMENDATION | [proceed/pass/request meeting]  [LOGO]│
└─────────────────────────────────────────────────────────┘
```

---

## Input Data Schema

When using this template, provide the following data. All fields are required unless marked optional.

### Header

```yaml
project_name: "PROJECT VOLT"
target_name: "OmniGrid Solutions"
target_logo: "path/to/target_logo.png"  # optional — placed next to target name in header bar
confidentiality: "STRICTLY CONFIDENTIAL"
phase: "PHASE I"
committee: "INVESTMENT COMMITTEE"
```

### I. Business Overview

```yaml
business_overview:
  primary: |
    2-3 sentences. What the company does, market position,
    customer base, geography, market share.
  secondary: |
    1-2 sentences (italicised, blue). Recurring revenue mix,
    growth trajectory, margin profile, or structural differentiator.
  competitive_advantage: |
    Optional. Bold label (e.g. "Cross-BU Flywheel") followed by
    1-2 sentences on the key competitive moat or platform dynamic.
```

### II. Investment Thesis

```yaml
investment_thesis:
  - label: "Inorganic Growth"
    description: "4 identified bolt-on targets at 6-8x EBITDA; consolidation play in a fragmented market."
  - label: "Operational Alpha"
    description: "Supply chain optimization targeting 300bps margin expansion over a 3-year horizon."
  - label: "Secular Tailwind"
    description: "AI-driven power demand provides a non-cyclical revenue floor with 20%+ growth visibility."
```

### III. Financial Summary & Transaction

```yaml
financials:
  periods: ["FY23A", "FY24A", "FY25A"]
  metrics:
    - name: "Revenue"
      values: ["$189.2M", "$215.0M", "$242.0M"]
      cagr: "14.5%"
    - name: "Adj. EBITDA"
      values: ["$38.1M", "$47.3M", "$55.7M"]
      cagr: "20.0%"
    - name: "EBITDA Margin"
      values: ["20.1%", "22.0%", "23.0%"]
      cagr: "+290bps"

transaction:
  - label: "Enterprise Value"
    value: "$640.0M"
  - label: "EV / LTM EBITDA"
    value: "11.5x"
  - label: "Equity Check"
    value: "$310.0M"

deal_context:  # optional — additional columns to the right of transaction
  - label: "Deal Overview"
    value: "Gen-1 Secondaries (67%)"
  - label: "Net Debt / (Cash)"
    value: "($5.7M)"
  - label: "Leverage"
    value: "2.0x EBITDA"
```

### IV. Key Risks & Mitigants

```yaml
risks:  # 3-4 risks supported
  - risk: "Succession & Governance"
    detail: "Gen-1 founders (67% ownership) exiting, while holding core roles."
    mitigant: "Gen-2 keen to carry on and rollover; transitionary period for Gen-1s."
  - risk: "Key-Man"
    detail: "Founder originates 80% of pipeline."
    mitigant: "Earnout tied to retention; promoted to director band (+59% comp)."
  - risk: "Concentration"
    detail: "Top 3 customers = 40% of revenue."
    mitigant: "5-year MSAs with 98% retention rate."
  - risk: "Supply Chain"
    detail: "Semiconductor volatility exposure."
    mitigant: "Pass-through pricing clauses in all Tier-1 contracts."
```

### V. Indicative Returns

```yaml
returns:
  irr: "~24%"
  moic: "2.9x"
  assumptions: "5-yr hold  •  6x entry / 6x exit  •  2.0x leverage  •  5% Revenue CAGR  •  26% EBITDA margin"
```

### Recommendation

```yaml
recommendation: >
  Proceed to confirmatory due diligence. High-conviction
  "Buy-and-Build" thesis with defensible market position.
```

---

## Formatting Rules

1. **Section headers:** All caps, 7.5pt Calibri, navy, letter-spacing 2pt, with a short 1" navy underline rule below.
2. **Thesis levers:** Label in bold Calibri (navy), description in regular Calibri (mid grey). Each lever separated by whitespace, not bullets.
3. **Business overview secondary paragraph:** Italic, blue (`#0070C0`). Used for recurring revenue or growth trajectory highlights.
4. **Business overview competitive advantage paragraph:** Bold label in charcoal, followed by regular charcoal description. Use for flywheel, moat, or platform dynamics.
5. **Financial table:** Navy header row, alternating white/ice rows. Latest-year column values in bold navy. CAGR column: positive values in green, negative in red. Transaction summary in a separate column block (labels in mid grey, values in bold navy). Optional deal context columns to the right (labels in mid grey, values in bold navy).
6. **Risks:** 3-4 risks supported. `Risk: detail` on one line (Calibri, charcoal). `→ Mitigant` on next line (green, italic, indented ~0.12"). No bullets.
7. **Returns:** Two large numbers side by side — 26pt Calibri bold navy. Small labels below in mid grey. Assumptions as italic footnote in muted grey, listing key model drivers (hold period, entry/exit multiple, leverage, revenue CAGR, EBITDA margin).
8. **Recommendation:** Full-width navy rule above. `RECOMMENDATION |` in bold navy with letter-spacing, pipe separator, followed by the text in mid grey.
9. **Header bar:** Movement logo (left), project name in Georgia bold white, optional target company logo, target name in mid grey Calibri. Confidentiality in gold (right), committee/phase in muted grey below.
10. **Footer logo:** Navy version of Movement mark, positioned far right (x ≈ 9.55").
11. **Vertical divider:** Thin rule (`#C5CDD8`) between left and right sections in the top and bottom halves. Does not extend into the financial table.
12. **No boxes, cards, or shadows.** The layout breathes. Typography and whitespace do the work.

---

## Usage

```
Generate an IC one-pager using the deal-onepager template.

Here is the deal data:

[paste YAML block or provide in natural language]
```

Claude will generate a PPTX file matching this specification using PptxGenJS.

---

## Reference Output

See: `examples/Project_Diamond_IC_OnePager.pptx`
