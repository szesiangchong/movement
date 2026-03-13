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
| Rule lines | `#C5CDD8` |
| Alternating row | `#EDF1F5` (Ice) |
| Positive/Mitigant | `#1A7856` (Green) |
| Risk accent | `#9B3025` (Muted red) |
| Confidentiality | `#B8952A` (Gold) |
| Header font | Georgia |
| Body font | Calibri |
| Logo | Movement mark (white version on dark, navy version on light) |

### Slide Structure

```
┌─────────────────────────────────────────────────────────┐
│  [LOGO]  PROJECT NAME   Target Name     CONFIDENTIAL    │  ← Navy bar
│                                         IC | PHASE X    │
├────────────────────────────┬────────────────────────────┤
│                            │                            │
│  I. BUSINESS OVERVIEW      │  II. INVESTMENT THESIS     │
│  ────                      │  ────                      │
│                            │                            │
│  2-3 sentences on the      │  Lever 1: Bold label +     │
│  business, market position,│  description               │
│  moat, key differentiator  │                            │
│                            │  Lever 2: ...              │
│  Italicised secondary      │                            │
│  paragraph (e.g. recurring │  Lever 3: ...              │
│  revenue, SaaS mix)        │                            │
├────────────────────────────┴────────────────────────────┤
│  FINANCIAL SUMMARY & TRANSACTION                        │
│  ───────────────────────────────────────────────────     │
│  │     │ FY-2A │ FY-1A │ LTM(E) │ CAGR │ │ TXN    │   │
│  │ Rev │       │       │        │      │ │ EV     │   │
│  │ EBI │       │       │        │      │ │ Mult   │   │
│  │ Mgn │       │       │        │      │ │ Eq Chk │   │
├────────────────────────────┬────────────────────────────┤
│                            │                            │
│  III. KEY RISKS &          │  IV. INDICATIVE RETURNS    │
│       MITIGANTS            │  ────                      │
│  ────                      │                            │
│  Risk: detail → mitigant   │   24.2%        2.8x       │
│  Risk: detail → mitigant   │   Target IRR   Target MOIC│
│  Risk: detail → mitigant   │                            │
│                            │   Assumptions footnote     │
├────────────────────────────┴────────────────────────────┤
│  ─────────────────────────────────────────────────────  │
│  RECOMMENDATION   [proceed/pass/request meeting]  [LOGO]│
└─────────────────────────────────────────────────────────┘
```

---

## Input Data Schema

When using this template, provide the following data. All fields are required unless marked optional.

### Header

```yaml
project_name: "PROJECT VOLT"
target_name: "OmniGrid Solutions"
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
    1-2 sentences (italicised). Recurring revenue mix, SaaS component,
    margin profile, or structural differentiator.
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
  periods: ["FY23A", "FY24A", "LTM (E)"]
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
```

### IV. Key Risks & Mitigants

```yaml
risks:
  - risk: "Concentration"
    detail: "Top 3 customers = 40% of revenue."
    mitigant: "5-year MSAs with 98% retention rate."
  - risk: "Supply Chain"
    detail: "Semiconductor volatility exposure."
    mitigant: "Pass-through pricing clauses in all Tier-1 contracts."
  - risk: "Key-Man"
    detail: "Founder-led with limited succession plan."
    mitigant: "Equity rollover + COO hire in Year 1."
```

### V. Indicative Returns

```yaml
returns:
  irr: "24.2%"
  moic: "2.8x"
  assumptions: "5-year hold  •  Multiple-neutral exit  •  3.5x senior leverage"
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
2. **Thesis levers:** Label in bold Georgia (navy), description in regular Calibri (mid grey). Each lever separated by whitespace, not bullets.
3. **Financial table:** Navy header row, alternating white/ice rows. LTM column values in bold navy. CAGR column: positive values in green. Transaction summary right-aligned in a separate column block, labels in mid grey, values in bold navy.
4. **Risks:** `Risk: detail` on one line (Calibri, charcoal). `→ Mitigant` on next line (green, italic). No bullets.
5. **Returns:** Two large numbers side by side — 28pt Georgia bold navy. Small labels below. Assumptions as italic footnote.
6. **Recommendation:** Full-width rule above. "RECOMMENDATION" in bold navy with letter-spacing, followed by the text in mid grey.
7. **Logo:** White version in header bar (left), navy version in footer (right).
8. **Vertical divider:** Thin rule between top-left and top-right sections only. Does not extend into the table or bottom sections.
9. **No boxes, cards, or shadows.** The layout breathes. Typography and whitespace do the work.

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

See: `examples/Project_Volt_IC_OnePager_v3.pptx`
